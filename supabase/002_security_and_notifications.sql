-- =====================================================================
-- Wezy · Migration 002: Sicherheits-Feinschliff + Benachrichtigungen
-- =====================================================================

-- ---------- 1. Feste search_path für alle Funktionen ----------
alter function public.age_group_of(date) set search_path = public;
alter function public.profiles_guard() set search_path = public;
alter function public.messages_guard() set search_path = public;

-- ---------- 2. Funktionen nicht für Gäste (anon) aufrufbar ----------
revoke execute on function
  public.blocked_between(uuid, uuid), public.can_see_plan(uuid), public.is_member(uuid),
  public.my_age_group(), public.profile_visible(uuid), public.age_group_of(date)
  from public, anon;
grant execute on function
  public.blocked_between(uuid, uuid), public.can_see_plan(uuid), public.is_member(uuid),
  public.my_age_group(), public.profile_visible(uuid), public.age_group_of(date)
  to authenticated;
-- Trigger-Funktionen braucht niemand direkt
revoke execute on function public.plans_guard(), public.plans_add_creator(),
  public.profiles_guard(), public.messages_guard() from public, anon, authenticated;

-- ---------- 3. Tempo: Indizes auf Fremdschlüssel ----------
create index if not exists blocks_blocked_idx    on public.blocks (blocked);
create index if not exists members_user_idx      on public.members (user_id);
create index if not exists messages_user_idx     on public.messages (user_id);
create index if not exists plans_creator_idx     on public.plans (creator);
create index if not exists queue_matched_idx     on public.queue (matched_plan);
create index if not exists reports_plan_idx      on public.reports (plan_id);
create index if not exists reports_reported_idx  on public.reports (reported_user);
create index if not exists reports_reporter_idx  on public.reports (reporter);

-- ---------- 4. Tempo: auth.uid() nur einmal pro Abfrage auswerten ----------
drop policy if exists p_profiles_select on public.profiles;
create policy p_profiles_select on public.profiles for select to authenticated
  using (id = (select auth.uid()) or public.profile_visible(id));
drop policy if exists p_profiles_insert on public.profiles;
create policy p_profiles_insert on public.profiles for insert to authenticated
  with check (id = (select auth.uid()));
drop policy if exists p_profiles_update on public.profiles;
create policy p_profiles_update on public.profiles for update to authenticated
  using (id = (select auth.uid())) with check (id = (select auth.uid()));
drop policy if exists p_blocks_all on public.blocks;
create policy p_blocks_all on public.blocks for all to authenticated
  using (blocker = (select auth.uid())) with check (blocker = (select auth.uid()));
drop policy if exists p_plans_select on public.plans;
create policy p_plans_select on public.plans for select to authenticated
  using (creator = (select auth.uid()) or (
    age_group = (select public.my_age_group())
    and not public.blocked_between(creator, (select auth.uid()))
    and (not is_lobby or public.is_member(id))));
drop policy if exists p_plans_insert on public.plans;
create policy p_plans_insert on public.plans for insert to authenticated
  with check (creator = (select auth.uid()) and is_lobby = false);
drop policy if exists p_plans_update on public.plans;
create policy p_plans_update on public.plans for update to authenticated
  using (creator = (select auth.uid())) with check (creator = (select auth.uid()) and is_lobby = false);
drop policy if exists p_plans_delete on public.plans;
create policy p_plans_delete on public.plans for delete to authenticated
  using (creator = (select auth.uid()));
drop policy if exists p_messages_insert on public.messages;
create policy p_messages_insert on public.messages for insert to authenticated
  with check (user_id = (select auth.uid()) and public.is_member(plan_id));
drop policy if exists p_reports_insert on public.reports;
create policy p_reports_insert on public.reports for insert to authenticated
  with check (reporter = (select auth.uid()));
drop policy if exists p_queue_select on public.queue;
create policy p_queue_select on public.queue for select to authenticated
  using (user_id = (select auth.uid()));

-- ---------- 5. Benachrichtigungen ----------
-- Wer hat in welchem Chat bis wohin gelesen
create table if not exists public.reads (
  user_id      uuid not null references public.profiles(id) on delete cascade default auth.uid(),
  plan_id      uuid not null references public.plans(id) on delete cascade,
  last_read_id bigint not null default 0,
  primary key (user_id, plan_id)
);
create index if not exists reads_plan_idx on public.reads (plan_id);
alter table public.reads enable row level security;
drop policy if exists p_reads_own on public.reads;
create policy p_reads_own on public.reads for select to authenticated
  using (user_id = (select auth.uid()));

-- Als gelesen markieren
create or replace function public.mark_read(p uuid)
returns void language plpgsql security definer set search_path = public as $$
declare mx bigint;
begin
  if not public.is_member(p) then return; end if;
  select coalesce(max(id), 0) into mx from public.messages where plan_id = p;
  insert into public.reads(user_id, plan_id, last_read_id) values (auth.uid(), p, mx)
    on conflict (user_id, plan_id) do update set last_read_id = greatest(public.reads.last_read_id, excluded.last_read_id);
end $$;

-- Ungelesene Nachrichten pro Chat (ohne eigene und ohne blockierte Leute)
create or replace function public.my_unread()
returns table(plan_id uuid, unread bigint) language sql stable security definer set search_path = public as $$
  select m.plan_id, count(*)
  from public.members mem
  join public.messages m on m.plan_id = mem.plan_id
  left join public.reads r on r.plan_id = mem.plan_id and r.user_id = mem.user_id
  where mem.user_id = auth.uid()
    and m.user_id <> auth.uid()
    and m.id > coalesce(r.last_read_id, 0)
    and not public.blocked_between(m.user_id, auth.uid())
  group by m.plan_id
$$;

-- Wer beitritt, wird im Chat angekündigt (so bekommt der Ersteller eine Benachrichtigung)
create or replace function public.members_announce()
returns trigger language plpgsql security definer set search_path = public as $$
declare pl public.plans; nm text;
begin
  select * into pl from public.plans where id = new.plan_id;
  if pl.is_lobby or new.user_id = pl.creator then return new; end if;
  select name into nm from public.profiles where id = new.user_id;
  insert into public.messages(plan_id, user_id, body) values (new.plan_id, new.user_id, '👋 ' || coalesce(nm, 'Jemand') || ' ist beigetreten');
  -- Der Beitretende hat seine eigene Ankündigung schon "gelesen"
  return new;
end $$;
drop trigger if exists members_announce on public.members;
create trigger members_announce after insert on public.members
  for each row execute function public.members_announce();
revoke execute on function public.members_announce() from public, anon, authenticated;

revoke execute on function public.mark_read(uuid), public.my_unread() from public, anon;
grant execute on function public.mark_read(uuid), public.my_unread() to authenticated;
