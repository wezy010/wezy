// =====================================================
// Wezy · Datenzugriff (alle Supabase-Aufrufe an einer Stelle)
// =====================================================
(function () {
  const C = window.WEZY_CONFIG || {};
  if (!C.SUPABASE_URL || !C.SUPABASE_ANON_KEY || !window.supabase) { window.api = null; return; }
  const sb = window.supabase.createClient(C.SUPABASE_URL, C.SUPABASE_ANON_KEY, {
    auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true }
  });

  // Fehler einheitlich werfen (Meldungen aus der Datenbank sind schon auf Deutsch)
  const T = ({ data, error }) => { if (error) throw new Error(friendly(error)); return data; };
  function friendly(e) {
    const m = (e && (e.message || e.error_description)) || 'Unbekannter Fehler';
    if (/Invalid login credentials/i.test(m)) return 'E-Mail oder Passwort falsch.';
    if (/Email not confirmed/i.test(m)) return 'Bitte bestätige zuerst deine E-Mail (Link im Postfach).';
    if (/User already registered/i.test(m)) return 'Mit dieser E-Mail gibt es schon ein Konto. Melde dich an.';
    if (/Password should be at least/i.test(m)) return 'Das Passwort braucht mindestens 8 Zeichen.';
    if (/rate limit|too many/i.test(m)) return 'Zu viele Versuche. Warte kurz und probier es nochmal.';
    if (/Failed to fetch|NetworkError/i.test(m)) return 'Keine Verbindung. Prüf dein Internet.';
    if (/row-level security/i.test(m)) return 'Das darfst du leider nicht.';
    return m;
  }
  let uid = null;
  const PLAN_COLS = 'id,title,category,online,place_type,place_name,starts_at,size,creator,is_lobby,game,created_at,members(user_id)';

  window.api = {
    // ---------- Auth ----------
    async session() { const s = T(await sb.auth.getSession()).session; uid = s ? s.user.id : null; return s; },
    onAuth(cb) { sb.auth.onAuthStateChange((ev, s) => { uid = s ? s.user.id : null; cb(ev, s); }); },
    async signUp(email, password) {
      return T(await sb.auth.signUp({ email, password, options: { emailRedirectTo: location.origin + location.pathname } }));
    },
    async signIn(email, password) { const d = T(await sb.auth.signInWithPassword({ email, password })); uid = d.user.id; return d; },
    async resetPassword(email) { return T(await sb.auth.resetPasswordForEmail(email, { redirectTo: location.origin + location.pathname })); },
    async setPassword(password) { return T(await sb.auth.updateUser({ password })); },
    async signOut() { await sb.auth.signOut(); uid = null; },
    uid() { return uid; },

    // ---------- Profil ----------
    async me() { const r = T(await sb.rpc('me')); return (r && r[0]) || null; },
    async createProfile(p) { T(await sb.from('profiles').insert({ id: uid, name: p.name, birthdate: p.birthdate, games: p.games, consent: p.consent })); },
    async updateProfile(p) { T(await sb.from('profiles').update(p).eq('id', uid)); },
    async profiles(ids) {
      if (!ids.length) return [];
      return T(await sb.from('profiles').select('id,name,founder_no,games').in('id', ids));
    },

    // ---------- Pläne ----------
    async listPlans() {
      const since = new Date(Date.now() - 3 * 3600e3).toISOString();
      return T(await sb.from('plans').select(PLAN_COLS).eq('is_lobby', false).gte('starts_at', since).order('starts_at').limit(100));
    },
    async myPlans() {
      const rows = T(await sb.from('members').select('plan_id').eq('user_id', uid));
      const ids = rows.map(r => r.plan_id);
      if (!ids.length) return [];
      return T(await sb.from('plans').select(PLAN_COLS).in('id', ids).order('created_at', { ascending: false }));
    },
    async getPlan(id) { return T(await sb.from('plans').select(PLAN_COLS).eq('id', id).maybeSingle()); },
    async createPlan(p) { return T(await sb.from('plans').insert(p).select('id').single()).id; },
    async deletePlan(id) { T(await sb.from('plans').delete().eq('id', id)); },
    async joinPlan(id) { T(await sb.rpc('join_plan', { p: id })); },
    async leavePlan(id) { T(await sb.rpc('leave_plan', { p: id })); },

    // ---------- Chat ----------
    async messages(planId) {
      const r = T(await sb.from('messages').select('id,user_id,body,created_at').eq('plan_id', planId).order('id', { ascending: false }).limit(200));
      return r.reverse();
    },
    async lastMessages(planIds) {
      if (!planIds.length) return [];
      return T(await sb.from('messages').select('id,plan_id,user_id,body,created_at').in('plan_id', planIds).order('id', { ascending: false }).limit(300));
    },
    async send(planId, body) { T(await sb.from('messages').insert({ plan_id: planId, body })); },
    subscribe(planId, onMsg, onMember) {
      const ch = sb.channel('plan-' + planId)
        .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages', filter: 'plan_id=eq.' + planId }, p => onMsg && onMsg(p.new))
        .on('postgres_changes', { event: '*', schema: 'public', table: 'members', filter: 'plan_id=eq.' + planId }, () => onMember && onMember())
        .subscribe();
      return () => sb.removeChannel(ch);
    },

    // ---------- Quick Match ----------
    async enterQueue(game, mode, mic, lang) { return T(await sb.rpc('enter_queue', { g: game, m: mode, mic_on: mic, l: lang })); },
    async queueStatus() { const r = T(await sb.from('queue').select('matched_plan').maybeSingle()); return r ? r.matched_plan : null; },
    async leaveQueue() { T(await sb.rpc('leave_queue')); },
    async queueCounts() { return T(await sb.rpc('queue_counts')) || []; },

    // ---------- Sicherheit ----------
    async report(r) { T(await sb.from('reports').insert({ reported_user: r.user || null, plan_id: r.plan || null, reason: r.reason })); },
    async block(userId) { T(await sb.from('blocks').insert({ blocked: userId })); },
    async unblock(userId) { T(await sb.from('blocks').delete().eq('blocker', uid).eq('blocked', userId)); },
    async blocks() { return T(await sb.from('blocks').select('blocked')).map(r => r.blocked); },
    async deleteAccount() { T(await sb.rpc('delete_my_account')); await sb.auth.signOut(); uid = null; }
  };
})();
