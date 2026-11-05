// =====================================================
// Wezy · App
// =====================================================
(function () {
'use strict';
const $ = s => document.querySelector(s);
const $$ = s => Array.from(document.querySelectorAll(s));
const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const I = (d, s = 20, c = 'currentColor', w = 2.2) => `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="${c}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${d}</svg>`;
const P = { home: '<path d="M3 11l9-7 9 7"/><path d="M5 10v10h14V10"/>', pad: '<rect x="2" y="6" width="20" height="12" rx="6"/><path d="M6 12h4M8 10v4"/><circle cx="16" cy="11" r=".8"/><circle cx="18" cy="13" r=".8"/>', plus: '<path d="M12 5v14M5 12h14"/>', chat: '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>', user: '<circle cx="12" cy="8" r="4"/><path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6"/>', chk: '<path d="M5 12.5l4.5 4.5L19 7"/>', x: '<path d="M6 6l12 12M18 6L6 18"/>', pin: '<path d="M12 21s-7-6-7-11a7 7 0 0 1 14 0c0 5-7 11-7 11z"/><circle cx="12" cy="10" r="2.5"/>', clk: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>', shield: '<path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z"/><path d="M9 12l2 2 4-4"/>', back: '<path d="M15 18l-6-6 6-6"/>', send: '<path d="M5 12h14M13 6l6 6-6 6"/>', flag: '<path d="M5 21V4h11l-2 4 2 4H5"/>', mic: '<rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0 0 14 0"/><path d="M12 18v3"/>', globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/>', users: '<circle cx="9" cy="8" r="3.5"/><path d="M2 20c1-3.5 3.8-5 7-5s6 1.5 7 5"/><circle cx="17" cy="9" r="2.5"/><path d="M17 14c2.5 0 4.3 1.3 5 4"/>', star: '<path d="M12 2l2.9 6.3 6.9.7-5.2 4.6 1.5 6.8L12 17l-6.1 3.4 1.5-6.8L2.2 9l6.9-.7z"/>', out: '<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/>', trash: '<path d="M3 6h18M8 6V4h8v2M6 6l1 14h10l1-14"/>' };
const LOGO = (s = 36) => `<svg class="logo" width="${s}" height="${s}" viewBox="0 0 48 48" aria-hidden="true"><rect width="48" height="48" rx="15" fill="url(#lgA)"/><rect width="48" height="48" rx="15" fill="url(#lgH)"/><path d="M28.2 6.5 13.4 26.6h9.8L20.4 41.5l15.4-21h-10z" fill="#fff"/><path d="M37.5 5.5c.45 2.4 1.6 3.55 4 4-2.4.45-3.55 1.6-4 4-.45-2.4-1.6-3.55-4-4 2.4-.45 3.55-1.6 4-4z" fill="#fff" opacity=".95"/></svg>`;
const COL = ['#8B5CF6', '#EC4899', '#06B6D4', '#10B981', '#F59E0B', '#6366F1', '#EF4444', '#14B8A6'];
const hash = s => { let h = 0; for (const c of String(s)) h = (h * 31 + c.charCodeAt(0)) | 0; return Math.abs(h); };
const av = (name, id, s = 34) => `<span class="av" style="width:${s}px;height:${s}px;font-size:${Math.round(s * .38)}px;background-color:${COL[hash(id) % 8]}">${esc((name || '?')[0].toUpperCase())}</span>`;
const CI = { gaming: [P.pad, '#A78BFA'], sport: ['<circle cx="12" cy="12" r="9"/><path d="M3.6 9h16.8M3.6 15h16.8M12 3c2.5 2.7 2.5 15.3 0 18M12 3c-2.5 2.7-2.5 15.3 0 18"/>', '#34D399'], freizeit: ['<path d="M4 6h16v4a2 2 0 0 0 0 4v4H4v-4a2 2 0 0 0 0-4z"/><path d="M14 7v2M14 11v2M14 15v2"/>', '#F472B6'], lernen: ['<path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15H6.5A2.5 2.5 0 0 0 4 20.5z"/><path d="M4 20.5V5.5M8 7h8"/>', '#38BDF8'], kreativ: ['<path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"/>', '#FBBF24'], sonst: ['<circle cx="5" cy="12" r="1.6"/><circle cx="12" cy="12" r="1.6"/><circle cx="19" cy="12" r="1.6"/>', '#C4B5FD'] };
const CATS = [['gaming', 'Gaming'], ['sport', 'Sport'], ['freizeit', 'Freizeit'], ['lernen', 'Lernen'], ['kreativ', 'Kreativ'], ['sonst', 'Sonstiges']];
const catName = k => (CATS.find(c => c[0] === k) || [k, k])[1];
const cic = (k, s = 46) => `<span class="cic" style="--c:${(CI[k] || CI.sonst)[1]};width:${s}px;height:${s}px">${I((CI[k] || CI.sonst)[0], s * .48, (CI[k] || CI.sonst)[1], 2)}</span>`;
const PLACES = { cafe: 'Café / Essen', park: 'Park', sport: 'Sportplatz / Halle', kino: 'Kino', bib: 'Bibliothek', jz: 'Jugendzentrum' };
const GAMES = ['GTA Online', 'Minecraft', 'Fortnite', 'Valorant', 'EA FC', 'Roblox', 'Rocket League', 'Call of Duty', 'Apex Legends', 'League of Legends', 'Brawl Stars', 'Clash Royale'];
const AGEL = { '13-15': '13–15', '16-17': '16–17', '18+': '18+' };
const C = window.WEZY_CONFIG || {};

let toastT;
function toast(html, cls = 'v') {
  $$('.toast').forEach(x => x.remove());
  const d = document.createElement('div'); d.className = 'toast'; d.setAttribute('role', 'status');
  d.innerHTML = `<div class="hc ${cls}" style="font-size:14px;padding:11px 16px">${html}</div>`;
  document.body.appendChild(d); clearTimeout(toastT); toastT = setTimeout(() => d.remove(), 2600);
}
const err = e => toast(esc(e && e.message ? e.message : e), 'o');
async function busy(btn, fn) {
  if (btn) { btn.disabled = true; btn.dataset.t = btn.innerHTML; btn.innerHTML = '<span class="spin"></span>'; }
  try { return await fn(); } catch (e) { err(e); } finally { if (btn && btn.isConnected) { btn.disabled = false; btn.innerHTML = btn.dataset.t; } }
}
function fmtWhen(iso) {
  const d = new Date(iso), now = new Date(), diff = (d - now) / 60000;
  const hm = d.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' });
  if (diff < -1) { if (diff > -180) return 'Läuft gerade'; }
  if (diff <= 1) return 'Jetzt';
  if (diff < 60) return `In ${Math.round(diff)} Min`;
  const sameDay = d.toDateString() === now.toDateString();
  const tm = new Date(now); tm.setDate(now.getDate() + 1);
  if (sameDay) return `Heute, ${hm}`;
  if (d.toDateString() === tm.toDateString()) return `Morgen, ${hm}`;
  return d.toLocaleDateString('de-DE', { weekday: 'short', day: 'numeric', month: 'numeric' }) + ', ' + hm;
}
const fmtTime = iso => new Date(iso).toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' });

// ---------- State ----------
const S = { unread: {}, me: null, plans: [], names: {}, blocked: [], filter: 'alle', query: '', unsub: null, qTimer: null, raf: null };
async function loadNames(ids) {
  const need = [...new Set(ids)].filter(id => id && !(id in S.names));
  if (!need.length) return;
  try { (await api.profiles(need)).forEach(p => S.names[p.id] = p); } catch (e) { /* still render */ }
  need.forEach(id => { if (!(id in S.names)) S.names[id] = null; });
}
const unreadTotal = () => Object.values(S.unread).reduce((a, b) => a + Number(b), 0);
async function refreshUnread() {
  if (!window.api || !S.me) return;
  try {
    const rows = await api.unread(); S.unread = {}; rows.forEach(r => S.unread[r.plan_id] = Number(r.unread));
    const n = unreadTotal(); document.title = n ? `(${n}) Wezy` : 'Wezy';
    const b = document.querySelector('#tab-chats .badge');
    if (n && !b) { const t = document.querySelector('#tab-chats'); if (t) t.insertAdjacentHTML('beforeend', `<span class="badge">${n > 99 ? '99+' : n}</span>`); }
    else if (b) { if (n) b.textContent = n > 99 ? '99+' : n; else b.remove(); }
  } catch (e) { }
}
setInterval(refreshUnread, 20000);
document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible') refreshUnread(); });
const nameOf = id => id === api.uid() ? (S.me ? S.me.name : 'Du') : (S.names[id] ? S.names[id].name : 'Unbekannt');

// ---------- Router (#/route/param) ----------
function route() { const h = location.hash.replace(/^#\/?/, '').split('/'); return { v: h[0] || 'home', p: h[1] || null }; }
function go(v, p) { const h = '#/' + v + (p ? '/' + p : ''); if (location.hash === h) render(); else location.hash = h; }
window.addEventListener('hashchange', () => render());
function cleanup() { if (S.unsub) { S.unsub(); S.unsub = null; } }

async function render() {
  cleanup(); S.rendering = true;
  try { await renderInner(); } finally { S.rendering = false; }
}
async function renderInner() {
  const a = $('#app');
  if (!window.api) { tabs(false); a.innerHTML = setupMissing(); return; }
  const sess = await api.session().catch(() => null);
  if (S.recovery || location.hash.includes('type=recovery')) { tabs(false); return recovery(); }
  if (!sess) { tabs(false); return auth(); }
  if (!S.me) {
    try { S.me = await api.me(); } catch (e) { err(e); }
    if (!S.me) { tabs(false); return onboarding(); }
    api.blocks().then(b => S.blocked = b).catch(() => {});
  }
  const r = route();
  const V = { home, play, create, chats, chat, me: profile, plan: detail };
  a.classList.remove('enter'); void a.offsetWidth; a.classList.add('enter');
  setTimeout(() => a.classList.remove('enter'), 700);
  tabs(true, r.v);
  if (r.v !== 'chat') refreshUnread();
  window.scrollTo(0, 0);
  try { await (V[r.v] || home)(r.p); } catch (e) { err(e); }
}
function tabs(show, cur) {
  const t = $('#tabs'); t.hidden = !show; if (!show) return;
  const T = [['home', 'Entdecken', P.home], ['play', 'Zocken', P.pad], ['create', '', P.plus], ['chats', 'Chats', P.chat], ['me', 'Profil', P.user]];
  t.innerHTML = `<div class="tabs-in">${T.map(([k, l, ic]) => k === 'create'
    ? `<a class="tab" href="#/create" aria-label="Plan erstellen"><span class="plus">${I(ic, 26, '#fff', 2.6)}</span></a>`
    : `<a class="tab" id="tab-${k}" href="#/${k}" ${cur === k || (k === 'chats' && cur === 'chat') ? 'aria-current="page"' : ''}>${I(ic, 22)}${l}${k === 'chats' && unreadTotal() ? `<span class="badge">${unreadTotal() > 99 ? '99+' : unreadTotal()}</span>` : ''}</a>`).join('')}</div>`;
}
const topbar = (extra = '') => `<div class="top">${LOGO(34)}<span class="wm">wezy</span><span class="sp"></span>${extra}</div>`;
const backbar = (extra = '') => `<div class="top"><button class="ib" id="bk" aria-label="Zurück">${I(P.back, 22)}</button><span class="sp"></span>${extra}</div>`;
function bindBack(fallback) { const b = $('#bk'); if (b) b.onclick = () => history.length > 1 ? history.back() : go(fallback); }

// ---------- Setup fehlt ----------
function setupMissing() {
  if (C.SUPABASE_URL && !window.supabase) return `<div class="onb">${LOGO(64)}<h1 class="big">Keine Verbindung</h1><p class="mut">Die App konnte nicht geladen werden. Prüf dein Internet und lade die Seite neu.</p><button class="btn p" onclick="location.reload()">Neu laden</button></div>`;
  return `<div class="onb">${LOGO(64)}<h1 class="big">Fast fertig</h1><p class="mut">Die App ist noch nicht mit der Datenbank verbunden. Trag in <b>config.js</b> die Supabase-URL und den anon-Key ein.</p></div>`;
}

// ---------- Login / Registrierung ----------
function auth(mode = 'start') {
  const a = $('#app');
  if (mode === 'start') {
    a.innerHTML = `<div class="onb" style="gap:14px"><div class="row">${LOGO(40)}<span class="wm" style="font-size:24px">wezy</span></div><canvas class="hero-cv" id="pc" aria-hidden="true"></canvas><h1 class="big" style="font-size:38px">Worauf hast<br><span class="grad-t">du Lust?</span></h1><p class="mut" style="margin:0;font-size:17px">Sag, was du machen willst. Wezy findet Leute, die genau das auch wollen. Zocken, Sport, Kino, Lernen und mehr.</p><button class="btn p shine" id="reg">Konto erstellen</button><button class="btn s" id="log">Ich habe schon ein Konto</button></div>`;
    sparkCanvas($('#pc'));
    $('#reg').onclick = () => { stopFx(); auth('register'); };
    $('#log').onclick = () => { stopFx(); auth('login'); };
    return;
  }
  const reg = mode === 'register';
  a.innerHTML = `<div class="onb"><button class="ib" id="bk2" aria-label="Zurück">${I(P.back, 22)}</button><h1 class="big">${reg ? 'Konto erstellen' : 'Willkommen zurück'}</h1>
  <form class="col" id="af" style="gap:12px">
   <label class="fl" for="em">E-Mail</label><input class="inp" id="em" type="email" autocomplete="email" required>
   <label class="fl" for="pw">Passwort${reg ? ' (mind. 8 Zeichen)' : ''}</label><input class="inp" id="pw" type="password" minlength="8" autocomplete="${reg ? 'new-password' : 'current-password'}" required>
   <button class="btn p" id="go">${reg ? 'Weiter' : 'Anmelden'}</button>
  </form>
  ${reg ? '' : '<button class="btn s" id="fpw" style="min-height:44px">Passwort vergessen?</button>'}
  <p class="fnt" style="font-size:13px;margin:0">${reg ? 'Mit dem Konto stimmst du unseren Regeln zu: respektvoll bleiben, nur öffentliche Treffpunkte, keine Fake-Profile.' : ''}</p></div>`;
  $('#bk2').onclick = () => auth('start');
  $('#af').onsubmit = e => {
    e.preventDefault();
    const em = $('#em').value.trim(), pw = $('#pw').value;
    busy($('#go'), async () => {
      if (reg) {
        const d = await api.signUp(em, pw);
        if (d.session) { render(); return; }
        a.innerHTML = `<div class="onb">${LOGO(64)}<h1 class="big">Check dein Postfach</h1><p class="mut">Wir haben dir eine E-Mail an <b>${esc(em)}</b> geschickt. Tippe auf den Link darin, dann geht’s weiter.</p><p class="fnt" style="font-size:13px">Nichts da? Schau im Spam-Ordner.</p><button class="btn s" id="tl">Zur Anmeldung</button></div>`;
        $('#tl').onclick = () => auth('login');
      } else { await api.signIn(em, pw); if (!S.me) render(); }
    });
  };
  const f = $('#fpw'); if (f) f.onclick = () => {
    const em = $('#em').value.trim(); if (!em) { $('#em').focus(); toast('Gib zuerst deine E-Mail ein.', 'o'); return; }
    busy(f, async () => { await api.resetPassword(em); toast('Wir haben dir einen Link zum Zurücksetzen geschickt.', 'g'); });
  };
}
function recovery() {
  $('#app').innerHTML = `<div class="onb"><h1 class="big">Neues Passwort</h1><form class="col" id="rf"><label class="fl" for="np">Neues Passwort (mind. 8 Zeichen)</label><input class="inp" id="np" type="password" minlength="8" autocomplete="new-password" required><button class="btn p" id="go">Speichern</button></form></div>`;
  $('#rf').onsubmit = e => { e.preventDefault(); busy($('#go'), async () => { await api.setPassword($('#np').value); S.recovery = false; toast('Passwort geändert.', 'g'); location.hash = '#/home'; render(); }); };
}

// ---------- Profil anlegen ----------
function onboarding() {
  const st = { games: [] };
  const maxD = new Date(); maxD.setFullYear(maxD.getFullYear() - 13);
  $('#app').innerHTML = `<div class="onb" style="justify-content:flex-start;padding-top:30px"><span class="hc v" style="align-self:flex-start">Fast geschafft</span><h1 class="big">Wer bist du?</h1>
  <form class="col" id="of" style="gap:12px">
   <label class="fl" for="nm">Vorname oder Spitzname</label><input class="inp" id="nm" maxlength="20" minlength="2" required autocomplete="nickname" placeholder="z. B. Lena">
   <label class="fl" for="bd">Geburtsdatum</label><input class="inp" id="bd" type="date" required max="${maxD.toISOString().slice(0, 10)}" min="1920-01-01">
   <p class="fnt" style="font-size:13px;margin:0">Du siehst nur Leute aus deiner Altersgruppe (13–15, 16–17 oder 18+). Erwachsene und Minderjährige werden nie zusammengebracht. Das Geburtsdatum kann später nicht geändert werden und ist für niemanden sichtbar.</p>
   <label class="fl">Was zockst du? (optional)</label><div class="seg">${GAMES.map(g => `<button type="button" class="chip" data-g="${esc(g)}" aria-pressed="false">${esc(g)}</button>`).join('')}</div>
   <label class="row" style="align-items:flex-start;gap:12px;margin-top:6px"><input type="checkbox" id="cs" required style="width:22px;height:22px;flex:none;margin-top:2px;accent-color:#8B5CF6"><span style="font-size:14px">Ich stimme der ${C.DATENSCHUTZ_URL ? `<a href="${esc(C.DATENSCHUTZ_URL)}" target="_blank" rel="noopener">Datenschutzerklärung</a>` : 'Datenschutzerklärung'} zu. <b>Wenn ich unter 16 bin, sind meine Eltern einverstanden.</b></span></label>
   <button class="btn p" id="go">Los geht’s</button>
  </form></div>`;
  $$('[data-g]').forEach(b => b.onclick = () => { const g = b.dataset.g; st.games = st.games.includes(g) ? st.games.filter(x => x !== g) : [...st.games, g]; b.setAttribute('aria-pressed', st.games.includes(g)); });
  $('#of').onsubmit = e => {
    e.preventDefault();
    busy($('#go'), async () => {
      await api.createProfile({ name: $('#nm').value.trim(), birthdate: $('#bd').value, games: st.games, consent: $('#cs').checked });
      S.me = await api.me(); go('home');
    });
  };
}

// ---------- Entdecken ----------
function planCard(p) {
  const n = (p.members || []).length, full = n >= p.size, c = (CI[p.category] || CI.sonst)[1];
  const mine = p.creator === api.uid(), joined = (p.members || []).some(m => m.user_id === api.uid());
  return `<a class="sk" href="#/plan/${p.id}" style="--c:${c};text-decoration:none;color:inherit"><div class="row" style="align-items:flex-start;gap:12px">${cic(p.category)}<div class="sp" style="min-width:0"><div class="kick">${esc(catName(p.category))} · ${esc(fmtWhen(p.starts_at))}</div><h3 style="margin-top:3px">${esc(p.title)}</h3></div>${mine ? '<span class="hc v" style="padding:4px 10px;font-size:11px">Dein Plan</span>' : joined ? '<span class="hc g" style="padding:4px 10px;font-size:11px">Dabei</span>' : ''}</div>
  <div class="row" style="gap:6px;flex-wrap:wrap"><span class="tag">${p.online ? I(P.globe, 13) + ' Online' : I(P.pin, 13) + ' ' + esc(p.place_name || PLACES[p.place_type] || '')}</span></div>
  <div class="row"><span class="avs">${(p.members || []).slice(0, 4).map(m => av(nameOf(m.user_id), m.user_id, 28)).join('')}</span><span class="mut num" style="font-size:13px">${full ? 'Voll' : n + '/' + p.size + ' dabei'}</span><span class="sp"></span><div class="bar" style="width:90px"><i style="width:${Math.min(100, n / p.size * 100)}%"></i></div></div></a>`;
}
async function home() {
  const a = $('#app');
  a.innerHTML = topbar() + `<h1 class="big" style="font-size:28px;margin:6px 0 14px">Hey ${esc(S.me.name)},<br>worauf hast du Lust?</h1><div class="col"><div class="card" style="height:120px;opacity:.4"></div><div class="card" style="height:120px;opacity:.25"></div></div>`;
  const [plans, counts] = await Promise.all([api.listPlans(), api.queueCounts().catch(() => [])]);
  S.plans = plans;
  await loadNames(plans.flatMap(p => (p.members || []).map(m => m.user_id)));
  if (route().v !== 'home') return;
  const q = S.query.toLowerCase();
  const list = plans.filter(p => (S.filter === 'alle' || p.category === S.filter) && (!q || p.title.toLowerCase().includes(q) || (p.place_name || '').toLowerCase().includes(q)));
  const soon = list.filter(p => new Date(p.starts_at) - Date.now() < 3 * 3600e3);
  const later = list.filter(p => !soon.includes(p));
  const total = counts.reduce((s, c) => s + Number(c.n), 0);
  a.innerHTML = topbar() + `
  <h1 class="big" style="font-size:28px;margin:6px 0 14px">Hey ${esc(S.me.name)},<br>worauf hast du Lust?</h1>
  <form class="pill" id="ask" role="search"><span class="wv" aria-hidden="true"><i></i><i></i><i></i><i></i></span><input id="q" placeholder="z. B. Kino, Gym, GTA …" value="${esc(S.query)}" autocomplete="off" aria-label="Suchen"><button class="ib" style="border:0;background:var(--grad)" aria-label="Suchen">${I(P.send, 18, '#fff', 2.6)}</button></form>
  <div class="chips" style="margin-top:14px">${[['alle', 'Alle'], ...CATS].map(c => `<button class="chip" data-f="${c[0]}" aria-pressed="${S.filter === c[0]}" style="display:inline-flex;align-items:center;gap:7px">${CI[c[0]] ? I(CI[c[0]][0], 16, S.filter === c[0] ? CI[c[0]][1] : 'currentColor') : ''}${c[1]}</button>`).join('')}</div>
  ${S.filter === 'alle' && !q ? `<div class="card v live" style="margin-top:14px"><div class="row"><span class="dot g livedot"></span><b style="font-size:12px;letter-spacing:.14em;color:var(--grn)">LIVE</b><span class="sp"></span><span class="mut" style="font-size:13px">Altersgruppe ${esc(AGEL[S.me.age_group])}</span></div>
    ${total ? `<div><span class="num grad-t D" style="font-size:38px;font-weight:800;line-height:1">${total}</span><div style="font-weight:700;font-size:15px;margin-top:4px">${total === 1 ? 'sucht' : 'suchen'} gerade Mitspieler</div></div><div class="games">${counts.slice(0, 4).map(g => `<div class="gt"><span>${esc(g.game)}</span><span class="num" style="color:var(--vio)">${g.n}</span></div>`).join('')}</div>`
      : `<div style="font-weight:700;font-size:16px">Gerade sucht niemand. Sei der Erste, andere werden automatisch mit dir gematcht.</div>`}
    <a class="btn p shine" href="#/play" style="text-decoration:none">${I(P.pad, 22, '#fff')}Ich will jetzt zocken</a></div>` : ''}
  ${soon.length ? `<div class="sec">Jetzt & gleich</div><div class="col">${soon.map(planCard).join('')}</div>` : ''}
  <div class="sec">${q ? 'Ergebnisse' : 'Pläne für dich'}</div><div class="col">${later.map(planCard).join('') || (soon.length ? '' : `<div class="card col" style="align-items:flex-start"><b>${q ? 'Nichts gefunden.' : 'Noch keine Pläne in deiner Altersgruppe.'}</b><span class="mut">Mach den ersten. Andere sehen ihn sofort.</span><button class="btn p" id="mkq">Plan${q ? ` „${esc(S.query)}“` : ''} erstellen</button></div>`)}</div>`;
  $$('[data-f]').forEach(b => b.onclick = () => { S.filter = b.dataset.f; home(); });
  $('#ask').onsubmit = e => { e.preventDefault(); S.query = $('#q').value.trim(); home(); };
  const mk = $('#mkq'); if (mk) mk.onclick = () => { draft.title = S.query; S.query = ''; go('create'); };
}

// ---------- Plan-Details ----------
async function detail(id) {
  const a = $('#app');
  const p = await api.getPlan(id);
  if (!p) { a.innerHTML = backbar() + `<div class="card" style="margin-top:20px"><b>Diesen Plan gibt es nicht mehr</b><p class="mut">Er wurde gelöscht oder ist nicht für deine Altersgruppe.</p></div>`; bindBack('home'); return; }
  const ids = (p.members || []).map(m => m.user_id); await loadNames(ids.concat(p.creator));
  const n = ids.length, joined = ids.includes(api.uid()), mine = p.creator === api.uid(), full = n >= p.size && !joined;
  a.innerHTML = backbar(`<button class="ib" id="rep" aria-label="Melden">${I(P.flag, 20)}</button>`) + `
  <div class="row" style="gap:6px;flex-wrap:wrap"><span class="hc v">${esc(catName(p.category))}</span><span class="hc">Nur ${esc(AGEL[S.me.age_group])}</span>${p.online ? `<span class="hc">${I(P.globe, 14)}Online</span>` : `<span class="hc">${I(P.pin, 14)}Öffentlicher Ort</span>`}</div>
  <h1 class="big" style="font-size:26px;margin:14px 0">${esc(p.title)}</h1>
  <div class="card col"><div class="row">${I(P.clk, 20, 'var(--vio)')}<span>${esc(fmtWhen(p.starts_at))}</span></div><div class="row">${I(p.online ? P.globe : P.pin, 20, 'var(--vio)')}<span>${p.online ? (p.game ? esc(p.game) : 'Online') : esc((PLACES[p.place_type] || '') + (p.place_name ? ' · ' + p.place_name : ''))}</span></div>${p.online ? '' : `<div class="row">${I(P.shield, 20, 'var(--grn)')}<span class="mut" style="font-size:14px">Trefft euch nur an öffentlichen Orten. Sag jemandem Bescheid, wo du bist.</span></div>`}</div>
  <div class="sec">Dabei · ${n}/${p.size}</div><div class="bar" style="margin-bottom:12px"><i style="width:${Math.min(100, n / p.size * 100)}%"></i></div>
  <div class="card col" style="gap:12px">${ids.map(u => `<div class="row">${av(nameOf(u), u, 40)}<div class="sp"><b>${esc(nameOf(u))}${u === api.uid() ? ' (du)' : ''}</b>${u === p.creator ? '<div class="mut" style="font-size:13px">Hat den Plan erstellt</div>' : ''}</div>${u !== api.uid() ? `<button class="ib" data-u="${u}" aria-label="${esc(nameOf(u))} melden oder blockieren">${I(P.flag, 18)}</button>` : ''}</div>`).join('')}</div>
  <div style="height:16px"></div>
  ${joined ? `<a class="btn p" href="#/chat/${p.id}" style="text-decoration:none">${I(P.chat, 20, '#fff')}Zum Gruppenchat</a><div style="height:10px"></div>${mine ? `<button class="btn o" id="del">${I(P.trash, 18)}Plan löschen</button>` : `<button class="btn s" id="leave">Doch nicht dabei</button>`}`
    : `<button class="btn p" id="join" ${full ? 'disabled' : ''}>${full ? 'Leider voll' : 'Bin dabei'}</button>`}`;
  bindBack('home');
  $('#rep').onclick = () => safetySheet({ user: mine ? null : p.creator, plan: p.id });
  $$('[data-u]').forEach(b => b.onclick = () => safetySheet({ user: b.dataset.u, plan: p.id }));
  const j = $('#join'); if (j) j.onclick = () => busy(j, async () => { await api.joinPlan(p.id); toast(`${I(P.chk, 16, '#6EE7B7', 3)} Du bist dabei. Der Gruppenchat ist offen.`, 'g'); go('chat', p.id); });
  const lv = $('#leave'); if (lv) lv.onclick = () => busy(lv, async () => { await api.leavePlan(p.id); toast('Du bist raus.'); detail(id); });
  const dl = $('#del'); if (dl) dl.onclick = () => confirmSheet('Plan löschen?', 'Der Plan und der Gruppenchat werden für alle gelöscht.', 'Ja, löschen', async () => { await api.deletePlan(p.id); toast('Plan gelöscht.'); go('home'); });
}

// ---------- Plan erstellen ----------
let draft = { title: '', cat: 'freizeit', online: false, place: 'cafe', placeName: '', when: 'soon', custom: '', size: 4 };
function whenToDate(w, custom) {
  const d = new Date();
  if (w === 'now') return d;
  if (w === 'soon') return new Date(d.getTime() + 30 * 60000);
  if (w === 'evening') { const e = new Date(d); e.setHours(19, 0, 0, 0); if (e < d) e.setDate(e.getDate() + 1); return e; }
  if (w === 'tomorrow') { const e = new Date(d); e.setDate(e.getDate() + 1); e.setHours(17, 0, 0, 0); return e; }
  if (w === 'custom' && custom) return new Date(custom);
  return null;
}
function create() {
  const a = $('#app');
  const W = [['now', 'Jetzt'], ['soon', 'In 30 Min'], ['evening', 'Heute Abend'], ['tomorrow', 'Morgen'], ['custom', 'Uhrzeit wählen']];
  a.innerHTML = topbar() + `<h1 class="big" style="font-size:28px;margin:6px 0 14px">Neuer Plan</h1>
  <form class="col" id="cf2" style="gap:14px">
  <label class="fl" for="ct">Worauf hast du Lust?</label><input class="inp" id="ct" maxlength="80" placeholder="z. B. Wer kommt mit ins Kino?" value="${esc(draft.title)}">
  <label class="fl">Kategorie</label><div class="seg">${CATS.map(c => `<button type="button" class="chip" data-cat="${c[0]}" aria-pressed="${draft.cat === c[0]}">${c[1]}</button>`).join('')}</div>
  <label class="fl">Wo?</label><div class="seg"><button type="button" class="chip" data-on="1" aria-pressed="${draft.online}">Online</button><button type="button" class="chip" data-on="0" aria-pressed="${!draft.online}">Vor Ort</button></div>
  ${draft.online ? '' : `<label class="fl">Treffpunkt (nur öffentliche Orte)</label><div class="seg">${Object.entries(PLACES).map(([k, v]) => `<button type="button" class="chip" data-pl="${k}" aria-pressed="${draft.place === k}">${v}</button>`).join('')}</div>
  <input class="inp" id="pn" maxlength="80" placeholder="Name vom Ort, z. B. Kino am Markt" value="${esc(draft.placeName)}" aria-label="Name vom Treffpunkt">
  <p class="fnt" style="font-size:13px;margin:-6px 0 0">Keine Privatadressen. Adressen mit Hausnummer werden abgelehnt.</p>`}
  <label class="fl">Wann?</label><div class="seg">${W.map(([k, v]) => `<button type="button" class="chip" data-w="${k}" aria-pressed="${draft.when === k}">${v}</button>`).join('')}</div>
  ${draft.when === 'custom' ? `<input class="inp" id="cw" type="datetime-local" value="${esc(draft.custom)}" aria-label="Datum und Uhrzeit">` : ''}
  <div class="card row" style="padding:12px 16px"><span class="sp"><b>Wie viele insgesamt?</b><div class="mut" style="font-size:13px">Mit dir</div></span><div class="step"><button type="button" class="ib" id="sm" aria-label="Weniger">−</button><b class="num" id="sz">${draft.size}</b><button type="button" class="ib" id="sp2" aria-label="Mehr">+</button></div></div>
  <div class="card row" style="padding:12px 16px">${I(P.shield, 20, 'var(--grn)')}<span class="mut" style="font-size:14px">Sichtbar nur für deine Altersgruppe (${esc(AGEL[S.me.age_group])}).</span></div>
  <button class="btn p" id="pub">Plan veröffentlichen</button></form>`;
  const keep = () => { draft.title = $('#ct').value; const pn = $('#pn'); if (pn) draft.placeName = pn.value; const cw = $('#cw'); if (cw) draft.custom = cw.value; };
  $$('[data-cat]').forEach(b => b.onclick = () => { keep(); draft.cat = b.dataset.cat; if (draft.cat === 'gaming') draft.online = true; create(); });
  $$('[data-on]').forEach(b => b.onclick = () => { keep(); draft.online = b.dataset.on === '1'; if (!draft.online && draft.cat === 'gaming') draft.cat = 'freizeit'; create(); });
  $$('[data-pl]').forEach(b => b.onclick = () => { keep(); draft.place = b.dataset.pl; create(); });
  $$('[data-w]').forEach(b => b.onclick = () => { keep(); draft.when = b.dataset.w; create(); });
  $('#sm').onclick = () => { keep(); draft.size = Math.max(2, draft.size - 1); $('#sz').textContent = draft.size; };
  $('#sp2').onclick = () => { keep(); draft.size = Math.min(20, draft.size + 1); $('#sz').textContent = draft.size; };
  $('#cf2').onsubmit = e => {
    e.preventDefault(); keep();
    if (draft.title.trim().length < 3) { $('#ct').focus(); toast('Schreib kurz, worauf du Lust hast.', 'o'); return; }
    const when = whenToDate(draft.when, draft.custom);
    if (!when || isNaN(when)) { toast('Wähl eine Uhrzeit.', 'o'); return; }
    busy($('#pub'), async () => {
      const id = await api.createPlan({ title: draft.title.trim(), category: draft.cat, online: draft.online, place_type: draft.online ? 'online' : draft.place, place_name: draft.online ? null : (draft.placeName.trim() || null), starts_at: when.toISOString(), size: draft.size });
      draft = { title: '', cat: 'freizeit', online: false, place: 'cafe', placeName: '', when: 'soon', custom: '', size: 4 };
      toast(`${LOGO(16)} Dein Plan ist live.`); go('plan', id);
    });
  };
}

// ---------- Chats ----------
async function chats() {
  const a = $('#app');
  a.innerHTML = topbar() + `<h1 class="big" style="font-size:28px;margin:6px 0 14px">Chats</h1><div class="card" style="height:80px;opacity:.3"></div>`;
  const plans = await api.myPlans();
  await refreshUnread();
  const last = await api.lastMessages(plans.map(p => p.id)).catch(() => []);
  const lastBy = {}; last.forEach(m => { if (!lastBy[m.plan_id]) lastBy[m.plan_id] = m; });
  await loadNames(last.map(m => m.user_id));
  if (route().v !== 'chats') return;
  plans.sort((x, y) => new Date((lastBy[y.id] || y).created_at) - new Date((lastBy[x.id] || x).created_at));
  const lobbies = plans.filter(p => p.is_lobby), others = plans.filter(p => !p.is_lobby);
  const row = p => { const m = lastBy[p.id]; return `<a class="sk" href="#/chat/${p.id}" style="flex-direction:row;align-items:center;gap:12px;text-decoration:none;color:inherit">${cic(p.category)}<div class="sp" style="min-width:0"><b style="display:block;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${esc(p.title)}</b><span class="mut" style="font-size:13px;display:block;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${m ? esc(nameOf(m.user_id) + ': ' + m.body) : 'Noch keine Nachrichten'}</span></div><div class="col" style="gap:4px;align-items:flex-end">${m ? `<span class="fnt" style="font-size:12px">${fmtTime(m.created_at)}</span>` : ''}${S.unread[p.id] ? `<span class="hc v" style="padding:2px 9px;font-size:12px">${S.unread[p.id]}</span>` : ''}</div></a>`; };
  a.innerHTML = topbar() + `<h1 class="big" style="font-size:28px;margin:6px 0 14px">Chats</h1>
  ${lobbies.length ? `<div class="sec">Deine Lobbys & Squads</div><div class="col">${lobbies.map(row).join('')}</div>` : ''}
  <div class="sec">Pläne</div><div class="col">${others.map(row).join('') || `<div class="card col" style="align-items:flex-start"><b>Noch keine Chats.</b><span class="mut">Tritt einem Plan bei oder erstell einen. Dann öffnet sich hier der Gruppenchat.</span><a class="btn p" href="#/home" style="text-decoration:none">Pläne entdecken</a></div>`}</div>`;
}
async function chat(id) {
  const a = $('#app');
  const p = await api.getPlan(id);
  if (!p) { go('chats'); return; }
  const ids = (p.members || []).map(m => m.user_id);
  if (!ids.includes(api.uid())) { go('plan', id); return; }
  let msgs = await api.messages(id);
  await loadNames(ids.concat(msgs.map(m => m.user_id)));
  if (route().v !== 'chat') return;
  const hidden = u => S.blocked.includes(u);
  const bubble = m => hidden(m.user_id) ? '' : (/^Match gefunden!/.test(m.body) || /^👋 .{1,40} ist beigetreten$/u.test(m.body)) ? `<div class="sys">${esc(m.body)}</div>` : m.user_id === api.uid() ? `<div class="m me">${esc(m.body)}</div>` : `<div class="m"><small>${esc(nameOf(m.user_id))}</small>${esc(m.body)}</div>`;
  a.innerHTML = `<div class="top"><button class="ib" id="bk" aria-label="Zurück">${I(P.back, 22)}</button><a class="sp" href="#/${p.is_lobby ? 'chat' : 'plan'}/${p.id}" style="min-width:0;text-decoration:none;color:inherit"><b style="display:block;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${esc(p.title)}</b><span class="mut" style="font-size:12px">${ids.length} im Chat${p.is_lobby ? ' · Lobby' : ''}</span></a><button class="ib" id="rep" aria-label="Melden">${I(P.flag, 20)}</button></div>
  ${p.is_lobby ? `<div class="card v row" style="gap:10px;font-size:14px">${I(P.pad, 22, '#C4B5FD')}<span>Tauscht eure Spielernamen und ladet euch in <b>${esc(p.game || 'eurem Spiel')}</b> ein. Gezockt wird im Spiel selbst.</span></div><div style="height:8px"></div>` : ''}
  <div class="card o row" style="gap:10px;font-size:13px">${I(P.shield, 20, '#FCD34D')}<span>Teile keine Adresse oder Handynummer. Trefft euch nur an öffentlichen Orten.</span></div>
  <div class="msgs" id="msgs">${msgs.length ? msgs.map(bubble).join('') : '<div class="sys">Sag Hallo 👋</div>'}</div>
  <div style="height:70px"></div>
  <form class="compose" id="cf"><div class="pill"><input id="ci" placeholder="Nachricht …" autocomplete="off" maxlength="500" aria-label="Nachricht"><button class="ib" style="border:0;background:var(--grad)" aria-label="Senden">${I(P.send, 18, '#fff', 2.6)}</button></div></form>`;
  bindBack('chats');
  $('#rep').onclick = () => memberSheet(p, ids);
  const scroll = () => window.scrollTo(0, document.body.scrollHeight);
  scroll();
  let mrT; const markRead = () => { clearTimeout(mrT); mrT = setTimeout(async () => { try { await api.markRead(id); delete S.unread[id]; refreshUnread(); } catch (e) { } }, 400); };
  markRead();
  const seen = new Set(msgs.map(m => m.id));
  S.unsub = api.subscribe(id, async m => {
    if (seen.has(m.id)) return; seen.add(m.id);
    await loadNames([m.user_id]);
    const box = $('#msgs'); if (!box) return;
    const sys = box.querySelector('.sys'); if (sys && /Sag Hallo/.test(sys.textContent)) sys.remove();
    box.insertAdjacentHTML('beforeend', bubble(m)); scroll(); markRead();
  }, null);
  // Falls Live-Updates mal hängen: alle 8 Sekunden nachladen
  const refresh = async () => {
    try {
      const fresh = await api.messages(id); await loadNames(fresh.map(m => m.user_id));
      const box = $('#msgs'); if (!box) return;
      const nw = fresh.filter(m => !seen.has(m.id)); nw.forEach(m => { seen.add(m.id); const sys = box.querySelector('.sys'); if (sys && /Sag Hallo/.test(sys.textContent)) sys.remove(); box.insertAdjacentHTML('beforeend', bubble(m)); scroll(); }); if (nw.length) markRead();
    } catch (e) { }
  };
  const poll = setInterval(refresh, 8000);
  const unsubRT = S.unsub; S.unsub = () => { clearInterval(poll); unsubRT && unsubRT(); };
  $('#cf').onsubmit = async e => {
    e.preventDefault();
    const i = $('#ci'), t = i.value.trim(); if (!t) return;
    i.value = '';
    try { await api.send(id, t); setTimeout(refresh, 1200); } catch (er) { i.value = t; err(er); }
  };
}
function memberSheet(p, ids) {
  const others = ids.filter(u => u !== api.uid());
  const l = $('#layer');
  l.innerHTML = `<div class="sheet-bg" id="sb"><div class="sheet" role="dialog" aria-label="Mitglieder"><div class="row"><b class="D" style="font-size:18px">Mitglieder</b><span class="sp"></span><button class="ib" id="sx" aria-label="Schließen">${I(P.x, 20)}</button></div>
  ${others.map(u => `<div class="row">${av(nameOf(u), u, 38)}<b class="sp">${esc(nameOf(u))}</b><button class="btn s" style="width:auto;min-height:40px" data-u="${u}">Melden / Blockieren</button></div>`).join('') || '<span class="mut">Noch niemand außer dir.</span>'}
  ${p.is_lobby ? `<button class="btn s" id="lv">Lobby verlassen</button>` : ''}</div></div>`;
  const close = () => l.innerHTML = '';
  $('#sx').onclick = close; $('#sb').onclick = e => { if (e.target.id === 'sb') close(); };
  $$('#layer [data-u]').forEach(b => b.onclick = () => safetySheet({ user: b.dataset.u, plan: p.id }));
  const lv = $('#lv'); if (lv) lv.onclick = () => busy(lv, async () => { await api.leavePlan(p.id); close(); go('chats'); });
}

// ---------- Melden / Blockieren ----------
function safetySheet({ user, plan }) {
  const l = $('#layer');
  const R = ['Belästigung oder Beleidigung', 'Fake-Profil oder falsches Alter', 'Unangemessene Inhalte', 'Fragt nach privaten Daten oder Treffen allein', 'Etwas anderes'];
  const nm = user ? nameOf(user) : null;
  l.innerHTML = `<div class="sheet-bg" id="sb"><div class="sheet" role="dialog" aria-label="Melden"><div class="row"><b class="D" style="font-size:18px">${nm ? esc(nm) + ' melden' : 'Plan melden'}</b><span class="sp"></span><button class="ib" id="sx" aria-label="Schließen">${I(P.x, 20)}</button></div>
  <span class="mut">Was ist passiert? Wir prüfen jede Meldung. ${nm ? esc(nm) + ' erfährt nicht, dass du gemeldet hast.' : ''}</span>
  ${R.map((r, i) => `<button class="btn s" style="justify-content:flex-start" data-r="${i}">${r}</button>`).join('')}
  ${user ? `<button class="btn o" id="blk">${esc(nm)} blockieren</button>` : ''}
  <p class="fnt" style="font-size:12px;margin:0">In Gefahr? Ruf die 110. Hilfe und Beratung für Jugendliche: Nummer gegen Kummer 116 111.</p></div></div>`;
  const close = () => l.innerHTML = '';
  $('#sx').onclick = close; $('#sb').onclick = e => { if (e.target.id === 'sb') close(); };
  $$('#layer [data-r]').forEach(b => b.onclick = () => busy(b, async () => { await api.report({ user, plan, reason: R[+b.dataset.r] }); close(); toast(`${I(P.chk, 16, '#6EE7B7', 3)} Danke. Deine Meldung wird geprüft.`, 'g'); }));
  const bl = $('#blk'); if (bl) bl.onclick = () => busy(bl, async () => { await api.block(user); S.blocked.push(user); close(); toast(`${esc(nm)} ist blockiert. Ihr seht euch nicht mehr.`, 'o'); go('home'); });
}
function confirmSheet(title, text, yes, fn) {
  const l = $('#layer');
  l.innerHTML = `<div class="sheet-bg" id="sb"><div class="sheet" role="dialog" aria-label="${esc(title)}"><b class="D" style="font-size:18px">${esc(title)}</b><span class="mut">${esc(text)}</span><button class="btn o" id="ry">${esc(yes)}</button><button class="btn s" id="rn">Abbrechen</button></div></div>`;
  $('#rn').onclick = () => l.innerHTML = '';
  $('#ry').onclick = () => busy($('#ry'), async () => { await fn(); l.innerHTML = ''; });
}

// ---------- Zocken / Quick Match ----------
let pm = { game: null, mode: 'Duo', mic: true, lang: 'Deutsch' };
function play() {
  const a = $('#app');
  if (!pm.game) pm.game = (S.me.games && S.me.games[0]) || 'GTA Online';
  const custom = !GAMES.includes(pm.game);
  a.innerHTML = topbar() + `<h1 class="big" style="font-size:28px;margin:6px 0 14px">Was willst du<br>zocken?</h1>
  <div class="games">${GAMES.map(g => `<button class="chip" style="min-height:54px;border-radius:18px;font-size:15px" data-g="${esc(g)}" aria-pressed="${pm.game === g}">${esc(g)}</button>`).join('')}</div>
  <input class="inp" id="og" style="margin-top:10px" maxlength="40" placeholder="Anderes Spiel …" value="${custom ? esc(pm.game) : ''}" aria-label="Anderes Spiel">
  <div class="sec">Modus</div><div class="seg">${[['Duo', 'Duo · 2'], ['Squad', 'Squad · 4']].map(([m, l]) => `<button class="chip" data-m="${m}" aria-pressed="${pm.mode === m}">${l}</button>`).join('')}</div>
  <div class="card" style="margin-top:14px;padding:6px 16px"><div class="row" style="min-height:54px"><span>${I(P.mic, 20)}</span><span class="sp">Mit Mikro</span><button class="switch" role="switch" id="mic" aria-checked="${pm.mic}" aria-label="Mit Mikro"></button></div><div class="row" style="min-height:54px;border-top:1px solid var(--line)"><span>${I(P.globe, 20)}</span><span class="sp">Sprache</span><select class="inp" id="lang" style="width:auto;min-height:40px">${['Deutsch', 'Englisch', 'Türkisch', 'Arabisch', 'Polnisch'].map(l => `<option ${pm.lang === l ? 'selected' : ''}>${l}</option>`).join('')}</select></div><div class="row" style="min-height:54px;border-top:1px solid var(--line)"><span>${I(P.shield, 20)}</span><span class="sp">Altersgruppe</span><span class="hc v">${esc(AGEL[S.me.age_group])}</span></div></div>
  <div style="height:16px"></div><button class="btn p shine" id="go">${I(P.pad, 22, '#fff')}Ich will jetzt zocken</button>`;
  $$('[data-g]').forEach(b => b.onclick = () => { pm.game = b.dataset.g; play(); });
  $('#og').oninput = e => { const v = e.target.value.trim(); if (v.length >= 2) { pm.game = v; $$('[data-g]').forEach(b => b.setAttribute('aria-pressed', 'false')); } };
  $$('[data-m]').forEach(b => b.onclick = () => { pm.mode = b.dataset.m; play(); });
  $('#mic').onclick = () => { pm.mic = !pm.mic; $('#mic').setAttribute('aria-checked', pm.mic); };
  $('#lang').onchange = e => pm.lang = e.target.value;
  $('#go').onclick = () => queue();
}
function stopFx() { cancelAnimationFrame(S.raf); clearInterval(S.qTimer); S.qTimer = null; }
async function queue() {
  const l = $('#layer'), need = pm.mode === 'Squad' ? 4 : 2; let sec = 0, done = false;
  l.innerHTML = `<div class="full"><div class="in"><div class="row" style="width:100%;justify-content:space-between"><span class="hc"><span class="dot r"></span><span id="qt" class="num">0:00</span></span><span class="hc v">${esc(pm.game)} · ${pm.mode}</span></div><canvas id="pc" aria-hidden="true"></canvas><div class="D" style="font-size:22px;font-weight:800">Suche Mitspieler …</div><div class="mut" style="text-align:center">${esc(pm.lang)} · ${pm.mic ? 'mit Mikro' : 'ohne Mikro'} · ${esc(AGEL[S.me.age_group])}<br>Du kannst die App offen lassen, wir suchen weiter.</div><span class="sp"></span><button class="btn s" id="qx">Abbrechen</button></div></div>`;
  sparkCanvas($('#pc'));
  const finish = planId => { if (done) return; done = true; stopFx(); match(planId, need); };
  const attempt = async () => { try { const r = await api.enterQueue(pm.game, pm.mode, pm.mic, pm.lang); if (r) finish(r); } catch (e) { stopFx(); l.innerHTML = ''; err(e); done = true; } };
  $('#qx').onclick = async () => { done = true; stopFx(); l.innerHTML = ''; try { await api.leaveQueue(); } catch (e) { } };
  await attempt();
  if (done) return;
  S.qTimer = setInterval(async () => {
    sec++; const q = $('#qt'); if (q) q.textContent = Math.floor(sec / 60) + ':' + String(sec % 60).padStart(2, '0');
    if (sec % 3 === 0) { try { const m = await api.queueStatus(); if (m) finish(m); } catch (e) { } }
    if (sec % 15 === 0 && !done) attempt();
    if (sec >= 900 && !done) { done = true; stopFx(); l.innerHTML = ''; api.leaveQueue().catch(() => {}); toast('Gerade findet sich niemand. Versuch es später nochmal oder erstell einen Plan.', 'o'); }
  }, 1000);
}
async function match(planId, need) {
  const l = $('#layer');
  let ids = [];
  try { const p = await api.getPlan(planId); ids = (p && p.members || []).map(m => m.user_id); await loadNames(ids); } catch (e) { }
  l.innerHTML = `<div class="full"><canvas id="burst" aria-hidden="true"></canvas><div class="in" style="justify-content:center;position:relative"><span class="hc v">${esc(pm.game)} · ${pm.mode}</span><div class="ring"><span class="D num" style="font-size:54px;font-weight:800;text-shadow:0 0 30px rgba(167,139,250,.9)">${need}/${need}</span></div><div class="D grad-t" style="font-size:32px;font-weight:800;text-align:center">Match gefunden!</div><div class="avs">${ids.map(u => av(nameOf(u), u, 52)).join('')}</div><span class="sp"></span><button class="btn p shine" id="acc">Zur Lobby</button><button class="btn s" id="dec">Ablehnen</button></div></div>`;
  burst($('#burst'));
  $('#acc').onclick = () => { stopFx(); l.innerHTML = ''; api.leaveQueue().catch(() => {}); go('chat', planId); };
  $('#dec').onclick = async () => { stopFx(); l.innerHTML = ''; try { await api.leavePlan(planId); await api.leaveQueue(); } catch (e) { } };
}

// ---------- Profil ----------
async function profile() {
  const a = $('#app'), me = S.me;
  a.innerHTML = topbar() + `<div class="col" style="align-items:center;text-align:center;margin-top:8px"><span class="ringav">${av(me.name, me.id, 96)}</span><h1 class="big" style="font-size:26px">${esc(me.name)}</h1><div class="row" style="flex-wrap:wrap;justify-content:center"><span class="hc">Altersgruppe ${esc(AGEL[me.age_group])}</span>${me.founder_no <= 1000 ? `<span class="hc o">${I(P.star, 14, '#FCD34D')}Gründungsmitglied #${String(me.founder_no).padStart(4, '0')}</span>` : ''}</div></div>
  <div class="sec">Name</div><form class="row" id="nf"><input class="inp" id="nn" maxlength="20" minlength="2" value="${esc(me.name)}" aria-label="Name"><button class="btn s" style="width:auto" id="ns">Speichern</button></form>
  <div class="sec">Deine Games</div><div class="seg">${GAMES.map(g => `<button class="chip" data-g="${esc(g)}" aria-pressed="${(me.games || []).includes(g)}">${esc(g)}</button>`).join('')}</div>
  <div class="sec">Sicherheit</div><div class="card col"><div class="row">${I(P.shield, 18, 'var(--grn)')}<span class="sp" style="font-size:14px">Du siehst nur Leute aus deiner Altersgruppe. Dein Geburtsdatum sieht niemand.</span></div><div class="row" style="min-height:40px"><span class="sp">Blockiert</span><span class="mut">${S.blocked.length} ${S.blocked.length === 1 ? 'Person' : 'Personen'}</span>${S.blocked.length ? `<button class="btn s" style="width:auto;min-height:38px" id="ub">Alle entblocken</button>` : ''}</div></div>
  <div class="card v col" style="margin-top:14px"><div class="row"><b class="D" style="font-size:16px">Wezy+</b><span class="sp"></span><span class="hc v">Kommt bald</span></div><span class="mut" style="font-size:14px">Eigene Designs und Extras. Gründungsmitglieder bekommen 6 Monate gratis.</span></div>
  <div style="height:14px"></div><button class="btn s" id="lo">${I(P.out, 18)}Abmelden</button>
  <div style="height:10px"></div><button class="btn o" id="da">${I(P.trash, 18)}Konto löschen</button>
  <p class="fnt" style="font-size:12px;text-align:center">${C.IMPRESSUM_URL ? `<a href="${esc(C.IMPRESSUM_URL)}" target="_blank" rel="noopener">Impressum</a> · ` : ''}${C.DATENSCHUTZ_URL ? `<a href="${esc(C.DATENSCHUTZ_URL)}" target="_blank" rel="noopener">Datenschutz</a>` : ''}</p>`;
  $('#nf').onsubmit = e => { e.preventDefault(); busy($('#ns'), async () => { const n = $('#nn').value.trim(); await api.updateProfile({ name: n }); S.me.name = n; toast('Gespeichert.', 'g'); }); };
  $$('[data-g]').forEach(b => b.onclick = async () => { const g = b.dataset.g, cur = me.games || []; const nxt = cur.includes(g) ? cur.filter(x => x !== g) : [...cur, g]; try { await api.updateProfile({ games: nxt }); me.games = nxt; b.setAttribute('aria-pressed', nxt.includes(g)); } catch (e) { err(e); } });
  const ub = $('#ub'); if (ub) ub.onclick = () => busy(ub, async () => { for (const u of S.blocked) await api.unblock(u); S.blocked = []; S.names = {}; toast('Alle entblockt.'); profile(); });
  $('#lo').onclick = async () => { await api.signOut(); S.me = null; S.names = {}; location.hash = ''; render(); };
  $('#da').onclick = () => confirmSheet('Konto wirklich löschen?', 'Dein Profil, deine Pläne und Nachrichten werden endgültig gelöscht. Das kann nicht rückgängig gemacht werden.', 'Ja, endgültig löschen', async () => { await api.deleteAccount(); S.me = null; location.hash = ''; render(); toast('Dein Konto wurde gelöscht.'); });
}

// ---------- Effekte ----------
function sparkCanvas(cv) {
  if (!cv) return; const ctx = cv.getContext('2d'); const dpr = Math.min(2, window.devicePixelRatio || 1); const W = cv.width = cv.clientWidth * dpr, H = cv.height = cv.clientHeight * dpr;
  const poly = [[14.1, 3.2], [6.7, 13.3], [11.6, 13.3], [10.2, 20.8], [17.9, 10.3], [12.9, 10.3]];
  const inP = (x, y) => { let c = false; for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) { const [xi, yi] = poly[i], [xj, yj] = poly[j]; if (((yi > y) != (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi)) c = !c; } return c; };
  const pts = []; while (pts.length < 800) { const x = Math.random() * 24, y = Math.random() * 24; if (inP(x, y)) { const a = Math.random() * 6.28, r = 8 + Math.random() * 10; pts.push({ x: x - 12, y: y - 12, z: (Math.random() - .5) * 2.4, ph: Math.random() * 6.28, sx: Math.cos(a) * r, sy: Math.sin(a) * r, sz: (Math.random() - .5) * 16, dl: Math.random() * .5 }); } }
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches; const t0 = performance.now();
  function f() { if (!cv.isConnected) return; const t = reduce ? 5 : (performance.now() - t0) / 1000; ctx.clearRect(0, 0, W, H); const ang = Math.sin(t * .7) * .55, ca = Math.cos(ang), sa = Math.sin(ang); const sc = Math.min(W, H) / 22; const pulse = 1 + Math.sin(t * 3.2) * .025;
    const g = ctx.createRadialGradient(W / 2, H / 2, 0, W / 2, H / 2, Math.min(W, H) * .45); g.addColorStop(0, 'rgba(139,92,246,.22)'); g.addColorStop(1, 'rgba(139,92,246,0)'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    ctx.globalCompositeOperation = 'lighter'; for (const p of pts) { let k = Math.min(1, Math.max(0, (t - p.dl) / 1.3)); k = 1 - Math.pow(1 - k, 3); const px = p.sx + (p.x - p.sx) * k, py = p.sy + (p.y - p.sy) * k, pz = p.sz + (p.z - p.sz) * k; const rx = px * ca + pz * sa, rz = -px * sa + pz * ca; const d = 30 / (30 + rz); const x = W / 2 + rx * sc * d * pulse, y = H / 2 + py * sc * d * pulse; const m = (py + 12) / 24; const tw = .55 + .45 * Math.sin(t * 3 + p.ph); ctx.fillStyle = `rgba(${Math.round(167 + 77 * m)},${Math.round(139 - 25 * m)},${Math.round(250 - 68 * m)},${tw})`; const s = 1.9 * d * dpr; ctx.fillRect(x - s / 2, y - s / 2, s, s); }
    ctx.globalCompositeOperation = 'source-over'; if (!reduce) S.raf = requestAnimationFrame(f); }
  f();
}
function burst(cv) {
  if (!cv) return; const ctx = cv.getContext('2d'); const dpr = Math.min(2, window.devicePixelRatio || 1); const W = cv.width = cv.clientWidth * dpr, H = cv.height = cv.clientHeight * dpr; const cx = W / 2, cy = H * .36;
  const ps = Array.from({ length: 220 }, () => { const a = Math.random() * 6.28, v = (2 + Math.random() * 9) * dpr; return { x: cx, y: cy, vx: Math.cos(a) * v, vy: Math.sin(a) * v, c: Math.random() < .5 ? '167,139,250' : '244,114,182', l: 1 }; });
  function f() { if (!cv.isConnected) return; ctx.clearRect(0, 0, W, H); ctx.globalCompositeOperation = 'lighter'; let alive = 0; for (const p of ps) { if (p.l <= 0) continue; alive++; p.x += p.vx; p.y += p.vy; p.vx *= .965; p.vy = p.vy * .965 + .06 * dpr; p.l -= .011; ctx.fillStyle = `rgba(${p.c},${Math.max(0, p.l)})`; const s = 2.6 * dpr; ctx.fillRect(p.x - s / 2, p.y - s / 2, s, s); } ctx.globalCompositeOperation = 'source-over'; if (alive) S.raf = requestAnimationFrame(f); }
  f();
}

// ---------- Start ----------
// Nur bei echten Wechseln neu zeichnen (SIGNED_IN kommt auch beim Zurückwechseln in den Tab)
if (window.api) api.onAuth(ev => {
  if (ev === 'PASSWORD_RECOVERY') { S.recovery = true; render(); return; }
  if (ev === 'SIGNED_OUT') { S.me = null; render(); return; }
  if (ev === 'SIGNED_IN' && !S.me && !S.rendering) render();
});
render();
})();
