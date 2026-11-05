-- =====================================================================
-- Wezy · Datenbank (Supabase / Postgres)
-- Einmal komplett im Supabase "SQL Editor" ausführen.
-- Sicherheit: Jede Tabelle hat Row Level Security (RLS).
-- Grundregel: Man sieht nur Leute und Pläne aus der EIGENEN Altersgruppe.
-- =====================================================================

-- ---------- Hilfsfunktionen: Altersgruppe ----------
create or replace function public.age_group_of(bd date)
returns text language sql stable as $$
  select case
    when bd is null then null
    when date_part('year', age(current_date, bd)) >= 18 then '18+'
    when date_part('year', age(current_date, bd)) >= 16 then '16-17'
    when date_part('year', age(current_date, bd)) >= 13 then '13-15'
    else null end
$$;

-- ---------- Profile ----------
create table if not exists public.profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  name        text not null check (char_length(trim(name)) between 2 and 20),
  birthdate   date not null,
  games       text[] not null default '{}',
  consent     boolean not null default false,   -- Datenschutz-Einwilligung (unter 16: Eltern)
  founder_no  bigint generated always as identity,
  created_at  timestamptz not null default now()
);

create or replace function public.my_age_group()
returns text language sql stable security definer set search_path = public as $$
  select public.age_group_of(birthdate) from public.profiles where id = auth.uid()
$$;

-- Geburtsdatum prüfen und danach unveränderbar machen
create or replace function public.profiles_guard()
returns trigger language plpgsql as $$
begin
  if public.age_group_of(new.birthdate) is null then
    raise exception 'Wezy ist erst ab 13 Jahren.';
  end if;
  if new.birthdate > current_date - interval '13 years' then
    raise exception 'Wezy ist erst ab 13 Jahren.';
  end if;
  if tg_op = 'UPDATE' and new.birthdate is distinct from old.birthdate then
    raise exception 'Das Geburtsdatum kann nicht geändert werden.';
  end if;
  if not new.consent then
    raise exception 'Bitte stimme der Datenschutzerklärung zu.';
  end if;
  return new;
end $$;
drop trigger if exists profiles_guard on public.profiles;
create trigger profiles_guard before insert or update on public.profiles
  for each row execute function public.profiles_guard();

-- ---------- Blockieren ----------
create table if not exists public.blocks (
  blocker    uuid not null references public.profiles(id) on delete cascade default auth.uid(),
  blocked    uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (blocker, blocked),
  check (blocker <> blocked)
);

create or replace function public.blocked_between(a uuid, b uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.blocks
                 where (blocker = a and blocked = b) or (blocker = b and blocked = a))
$$;

-- ---------- Pläne ----------
create table if not exists public.plans (
  id          uuid primary key default gen_random_uuid(),
  creator     uuid not null references public.profiles(id) on delete cascade default auth.uid(),
  title       text not null check (char_length(trim(title)) between 3 and 80),
  category    text not null check (category in ('gaming','sport','freizeit','lernen','kreativ','sonst')),
  online      boolean not null default false,
  place_type  text not null check (place_type in ('online','cafe','park','sport','kino','bib','jz')),
  place_name  text check (place_name is null or char_length(place_name) <= 80),
  starts_at   timestamptz not null,
  size        int not null check (size between 2 and 20),
  age_group   text not null,
  is_lobby    boolean not null default false,
  game        text,
  created_at  timestamptz not null default now(),
  check (online = (place_type = 'online'))
);
create index if not exists plans_age_start on public.plans (age_group, starts_at);

create or replace function public.plans_guard()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  -- Altersgruppe kommt IMMER vom Ersteller, nie vom Client
  select public.age_group_of(birthdate) into new.age_group from public.profiles where id = new.creator;
  if new.age_group is null then raise exception 'Kein Profil.'; end if;
  -- Keine Hausnummern / Privatadressen im Treffpunkt
  if new.place_name ~* '(stra(ss|ß)e|str\.|weg|gasse|allee|platz)\s*\d' then
    raise exception 'Bitte nur öffentliche Orte, keine Adressen mit Hausnummer.';
  end if;
  return new;
end $$;
drop trigger if exists plans_guard on public.plans;
create trigger plans_guard before insert or update on public.plans
  for each row execute function public.plans_guard();

-- ---------- Mitglieder ----------
create table if not exists public.members (
  plan_id   uuid not null references public.plans(id) on delete cascade,
  user_id   uuid not null references public.profiles(id) on delete cascade,
  joined_at timestamptz not null default now(),
  primary key (plan_id, user_id)
);

create or replace function public.is_member(p uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.members where plan_id = p and user_id = auth.uid())
$$;

create or replace function public.can_see_plan(p uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.plans pl
    where pl.id = p
      and pl.age_group = public.my_age_group()
      and not public.blocked_between(pl.creator, auth.uid())
      and (not pl.is_lobby or public.is_member(pl.id))
  )
$$;

-- Ersteller ist automatisch dabei
create or replace function public.plans_add_creator()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.members(plan_id, user_id) values (new.id, new.creator) on conflict do nothing;
  return new;
end $$;
drop trigger if exists plans_add_creator on public.plans;
create trigger plans_add_creator after insert on public.plans
  for each row execute function public.plans_add_creator();

-- Beitreten / Verlassen nur über diese Funktionen (prüfen Alter, Platz, Blockierungen)
create or replace function public.join_plan(p uuid)
returns void language plpgsql security definer set search_path = public as $$
declare pl public.plans; n int;
begin
  select * into pl from public.plans where id = p for update;
  if not found or pl.is_lobby then raise exception 'Plan nicht gefunden.'; end if;
  if pl.age_group is distinct from public.my_age_group() then raise exception 'Nicht deine Altersgruppe.'; end if;
  if exists (select 1 from public.members m where m.plan_id = p and public.blocked_between(m.user_id, auth.uid())) then
    raise exception 'Beitritt nicht möglich.';
  end if;
  select count(*) into n from public.members where plan_id = p;
  if n >= pl.size then raise exception 'Leider schon voll.'; end if;
  insert into public.members(plan_id, user_id) values (p, auth.uid()) on conflict do nothing;
end $$;

create or replace function public.leave_plan(p uuid)
returns void language sql security definer set search_path = public as $$
  delete from public.members where plan_id = p and user_id = auth.uid()
$$;

-- ---------- Nachrichten ----------
create table if not exists public.messages (
  id         bigint generated always as identity primary key,
  plan_id    uuid not null references public.plans(id) on delete cascade,
  user_id    uuid not null references public.profiles(id) on delete cascade default auth.uid(),
  body       text not null check (char_length(trim(body)) between 1 and 500),
  created_at timestamptz not null default now()
);
create index if not exists messages_plan on public.messages (plan_id, id);

create or replace function public.messages_guard()
returns trigger language plpgsql as $$
begin
  -- Keine Handynummern im Chat
  if new.body ~ '\+?\d[\d\s/().-]{7,}\d' then
    raise exception 'Sicherheit: Bitte keine Handynummern im Chat teilen.';
  end if;
  if new.body ~* '(stra(ss|ß)e|str\.|weg|gasse|allee)\s*\d' then
    raise exception 'Sicherheit: Bitte keine Adressen im Chat teilen.';
  end if;
  return new;
end $$;
drop trigger if exists messages_guard on public.messages;
create trigger messages_guard before insert on public.messages
  for each row execute function public.messages_guard();

-- ---------- Meldungen ----------
create table if not exists public.reports (
  id            bigint generated always as identity primary key,
  reporter      uuid not null references public.profiles(id) on delete cascade default auth.uid(),
  reported_user uuid references public.profiles(id) on delete set null,
  plan_id       uuid references public.plans(id) on delete set null,
  reason        text not null check (char_length(reason) between 2 and 300),
  status        text not null default 'offen',
  created_at    timestamptz not null default now()
);

-- ---------- Quick-Match-Warteschlange ----------
create table if not exists public.queue (
  user_id      uuid primary key references public.profiles(id) on delete cascade default auth.uid(),
  game         text not null check (char_length(game) between 2 and 40),
  mode         text not null check (mode in ('Duo','Squad')),
  mic          boolean not null default true,
  lang         text not null default 'Deutsch',
  age_group    text not null,
  matched_plan uuid references public.plans(id) on delete set null,
  created_at   timestamptz not null default now()
);

create or replace function public.enter_queue(g text, m text, mic_on boolean, l text)
returns uuid language plpgsql security definer set search_path = public as $$
declare ag text := public.my_age_group(); need int; others uuid[]; newplan uuid; existing uuid;
begin
  if ag is null then raise exception 'Kein Profil.'; end if;
  -- Schon gematcht (z. B. während man gewartet hat)? Dann diese Lobby zurückgeben.
  select matched_plan into existing from public.queue
    where user_id = auth.uid() and matched_plan is not null and created_at > now() - interval '15 minutes';
  if existing is not null then return existing; end if;
  need := case when m = 'Squad' then 4 else 2 end;
  delete from public.queue where created_at < now() - interval '15 minutes';
  insert into public.queue(user_id, game, mode, mic, lang, age_group)
    values (auth.uid(), g, m, mic_on, l, ag)
    on conflict (user_id) do update set game = g, mode = m, mic = mic_on, lang = l,
      age_group = ag, matched_plan = null, created_at = now();

  select array_agg(user_id) into others from (
    select q.user_id from public.queue q
    where q.user_id <> auth.uid() and q.matched_plan is null
      and q.game = g and q.mode = m and q.lang = l and q.age_group = ag
      and not public.blocked_between(q.user_id, auth.uid())
    order by q.created_at
    limit need - 1
    for update skip locked
  ) s;

  if coalesce(array_length(others, 1), 0) < need - 1 then
    return null;   -- noch warten
  end if;

  insert into public.plans(creator, title, category, online, place_type, place_name, starts_at, size, is_lobby, game)
    values (auth.uid(), g || ' · ' || m, 'gaming', true, 'online', null, now(), need, true, g)
    returning id into newplan;
  insert into public.members(plan_id, user_id) select newplan, unnest(others) on conflict do nothing;
  update public.queue set matched_plan = newplan where user_id = any(others) or user_id = auth.uid();
  insert into public.messages(plan_id, user_id, body)
    values (newplan, auth.uid(), 'Match gefunden! Tauscht eure Spielernamen und ladet euch im Spiel ein.');
  return newplan;
end $$;

create or replace function public.leave_queue()
returns void language sql security definer set search_path = public as $$
  delete from public.queue where user_id = auth.uid()
$$;

-- Wie viele suchen gerade was (nur Zahlen, keine Personen)
create or replace function public.queue_counts()
returns table(game text, n bigint) language sql stable security definer set search_path = public as $$
  select game, count(*) from public.queue
  where age_group = public.my_age_group() and matched_plan is null
    and created_at > now() - interval '15 minutes'
  group by game order by 2 desc
$$;

-- ---------- Konto löschen (DSGVO) ----------
create or replace function public.delete_my_account()
returns void language sql security definer set search_path = public, auth as $$
  delete from auth.users where id = auth.uid()
$$;

-- =====================================================================
-- Row Level Security
-- =====================================================================
alter table public.profiles enable row level security;
alter table public.blocks   enable row level security;
alter table public.plans    enable row level security;
alter table public.members  enable row level security;
alter table public.messages enable row level security;
alter table public.reports  enable row level security;
alter table public.queue    enable row level security;

-- Profile: andere sehen nur Name/Games/Nummer, NIE das Geburtsdatum
create or replace function public.profile_visible(p uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.profiles pr where pr.id = p
                 and public.age_group_of(pr.birthdate) = public.my_age_group()
                 and not public.blocked_between(pr.id, auth.uid()))
$$;
revoke all on public.profiles from anon, authenticated;
grant select (id, name, games, founder_no, created_at) on public.profiles to authenticated;
grant insert (id, name, birthdate, games, consent) on public.profiles to authenticated;
grant update (name, games) on public.profiles to authenticated;

drop policy if exists p_profiles_select on public.profiles;
create policy p_profiles_select on public.profiles for select to authenticated
  using (id = auth.uid() or public.profile_visible(id));
drop policy if exists p_profiles_insert on public.profiles;
create policy p_profiles_insert on public.profiles for insert to authenticated
  with check (id = auth.uid());
drop policy if exists p_profiles_update on public.profiles;
create policy p_profiles_update on public.profiles for update to authenticated
  using (id = auth.uid()) with check (id = auth.uid());

-- Eigene Daten inkl. Geburtsdatum
create or replace function public.me()
returns table(id uuid, name text, birthdate date, age_group text, games text[], founder_no bigint)
language sql stable security definer set search_path = public as $$
  select id, name, birthdate, public.age_group_of(birthdate), games, founder_no
  from public.profiles where id = auth.uid()
$$;

-- Blocks: nur eigene
drop policy if exists p_blocks_all on public.blocks;
create policy p_blocks_all on public.blocks for all to authenticated
  using (blocker = auth.uid()) with check (blocker = auth.uid());

-- Pläne
drop policy if exists p_plans_select on public.plans;
create policy p_plans_select on public.plans for select to authenticated
  using (creator = auth.uid() or (
    age_group = public.my_age_group()
    and not public.blocked_between(creator, auth.uid())
    and (not is_lobby or public.is_member(id))));
drop policy if exists p_plans_insert on public.plans;
create policy p_plans_insert on public.plans for insert to authenticated
  with check (creator = auth.uid() and is_lobby = false);
drop policy if exists p_plans_update on public.plans;
create policy p_plans_update on public.plans for update to authenticated
  using (creator = auth.uid()) with check (creator = auth.uid() and is_lobby = false);
drop policy if exists p_plans_delete on public.plans;
create policy p_plans_delete on public.plans for delete to authenticated
  using (creator = auth.uid());

-- Mitglieder: sichtbar für alle, die den Plan sehen; Schreiben nur über join_plan/leave_plan
drop policy if exists p_members_select on public.members;
create policy p_members_select on public.members for select to authenticated
  using (public.can_see_plan(plan_id));

-- Nachrichten: nur Mitglieder lesen und schreiben
drop policy if exists p_messages_select on public.messages;
create policy p_messages_select on public.messages for select to authenticated
  using (public.is_member(plan_id));
drop policy if exists p_messages_insert on public.messages;
create policy p_messages_insert on public.messages for insert to authenticated
  with check (user_id = auth.uid() and public.is_member(plan_id));

-- Meldungen: nur abschicken, nicht lesen (Prüfung im Supabase-Dashboard)
drop policy if exists p_reports_insert on public.reports;
create policy p_reports_insert on public.reports for insert to authenticated
  with check (reporter = auth.uid());

-- Warteschlange: nur die eigene Zeile sehen
drop policy if exists p_queue_select on public.queue;
create policy p_queue_select on public.queue for select to authenticated
  using (user_id = auth.uid());

-- Funktionen nur für eingeloggte Nutzer
revoke execute on function public.join_plan(uuid), public.leave_plan(uuid), public.enter_queue(text,text,boolean,text),
  public.leave_queue(), public.queue_counts(), public.delete_my_account(), public.me() from anon, public;
grant execute on function public.join_plan(uuid), public.leave_plan(uuid), public.enter_queue(text,text,boolean,text),
  public.leave_queue(), public.queue_counts(), public.delete_my_account(), public.me() to authenticated;

-- Live-Updates (Chat, Mitglieder, Match)
do $$ begin
  begin alter publication supabase_realtime add table public.messages; exception when duplicate_object then null; end;
  begin alter publication supabase_realtime add table public.members;  exception when duplicate_object then null; end;
  begin alter publication supabase_realtime add table public.queue;    exception when duplicate_object then null; end;
end $$;
