(() => {
  const frame = document.querySelector('.game');
  if (!frame) return;

  frame.addEventListener('load', () => {
    const w = frame.contentWindow;
    const d = frame.contentDocument;
    if (!w || !d || !w.s) return;

    const key = 'pixelChampsPassportV90';
    const today = () => {
      const x = new Date();
      return `${x.getFullYear()}-${String(x.getMonth()+1).padStart(2,'0')}-${String(x.getDate()).padStart(2,'0')}`;
    };
    let data;
    try { data = JSON.parse(localStorage.getItem(key) || 'null'); } catch (_) { data = null; }
    if (!data) data = { visits: 0, lastVisit: '', claimed: false };
    if (data.lastVisit !== today()) { data.claimed = false; data.visits = Number(data.visits || 0) + 1; data.lastVisit = today(); }
    const save = () => localStorage.setItem(key, JSON.stringify(data));

    const home = d.querySelector('#home');
    if (!home) return;
    d.querySelector('[data-v90-passport]')?.remove();

    const style = d.createElement('style');
    style.textContent = `
      [data-v90-passport]{margin-top:12px;padding:16px;border-radius:20px;background:linear-gradient(145deg,#11183a,#080d22);border:1px solid rgba(56,189,248,.35);box-shadow:0 14px 30px rgba(0,0,0,.22)}
      [data-v90-passport] .v90-head{display:flex;justify-content:space-between;align-items:center;gap:10px}
      [data-v90-passport] .v90-title{font-size:19px;font-weight:950}
      [data-v90-passport] .v90-rank{font-size:11px;font-weight:950;padding:7px 10px;border-radius:999px;background:rgba(56,189,248,.12);border:1px solid rgba(56,189,248,.28)}
      [data-v90-passport] .v90-note{font-size:11px;opacity:.68;margin:5px 0 13px}
      [data-v90-passport] .v90-progress{height:9px;border-radius:999px;background:#202747;overflow:hidden;border:1px solid #30385f}
      [data-v90-passport] .v90-fill{height:100%;width:0%;border-radius:999px;background:linear-gradient(90deg,#38bdf8,#a78bfa);transition:width .25s ease}
      [data-v90-passport] .v90-stats{display:grid;grid-template-columns:repeat(3,1fr);gap:7px;margin-top:10px}
      [data-v90-passport] .v90-stat{padding:9px;border-radius:13px;background:rgba(255,255,255,.045);text-align:center}
      [data-v90-passport] .v90-num{font-size:15px;font-weight:950}.v90-label{font-size:9px;opacity:.62;margin-top:2px}
      [data-v90-passport] .v90-mission{margin-top:12px;padding:11px;border-radius:14px;background:rgba(167,139,250,.09);border:1px solid rgba(167,139,250,.2)}
      [data-v90-passport] .v90-mission b{font-size:12px}.v90-small{font-size:10px;opacity:.68;margin-top:3px}
      [data-v90-passport] button{margin-top:9px;width:100%;font-weight:950}.v90-done{opacity:.7}
    `;
    d.head.appendChild(style);

    const card = d.createElement('section');
    card.dataset.v90Passport = '1';
    card.innerHTML = `<div class="v90-head"><div class="v90-title">🪪 Cosmic Passport</div><div class="v90-rank" data-v90-rank>Rookie</div></div><div class="v90-note">Your long-term cosmic journey • fictional in-game progression</div><div class="v90-progress"><div class="v90-fill" data-v90-fill></div></div><div class="v90-stats"><div class="v90-stat"><div class="v90-num" data-v90-ach>0</div><div class="v90-label">Achievements</div></div><div class="v90-stat"><div class="v90-num" data-v90-battles>0</div><div class="v90-label">Battles</div></div><div class="v90-stat"><div class="v90-num" data-v90-visits>0</div><div class="v90-label">Visits</div></div></div><div class="v90-mission"><b>☀️ Daily Orbit</b><div class="v90-small">Check in once per day for a small fictional Dust + XP bonus.</div><button type="button" data-v90-claim>Claim Daily Orbit</button></div>`;
    home.appendChild(card);

    const rankFor = (points) => {
      if (points >= 30) return ['Cosmic Legend', 30, 40];
      if (points >= 20) return ['Star Voyager', 20, 30];
      if (points >= 12) return ['Zodiac Explorer', 12, 20];
      if (points >= 6) return ['Cosmic Challenger', 6, 12];
      return ['Cosmic Rookie', 0, 6];
    };

    const render = () => {
      let collection = { unlocked: {}, stats: {} };
      try { collection = JSON.parse(localStorage.getItem('pixelChampsCollectionV89') || '{}'); } catch (_) {}
      const unlocked = Object.keys(collection.unlocked || {}).length;
      const battles = Number(collection.stats?.battles || 0);
      const points = unlocked + Math.min(10, Math.floor(battles / 2)) + Math.min(5, Number(data.visits || 0));
      const [rank, start, next] = rankFor(points);
      const pct = next === start ? 100 : Math.max(0, Math.min(100, ((points - start) / (next - start)) * 100));
      card.querySelector('[data-v90-rank]').textContent = rank;
      card.querySelector('[data-v90-fill]').style.width = `${pct}%`;
      card.querySelector('[data-v90-ach]').textContent = unlocked;
      card.querySelector('[data-v90-battles]').textContent = battles;
      card.querySelector('[data-v90-visits]').textContent = data.visits;
      const btn = card.querySelector('[data-v90-claim]');
      btn.disabled = !!data.claimed;
      btn.textContent = data.claimed ? '✓ Daily Orbit Claimed' : 'Claim Daily Orbit';
      btn.classList.toggle('v90-done', !!data.claimed);
    };

    card.querySelector('[data-v90-claim]').onclick = () => {
      if (data.claimed) return;
      data.claimed = true;
      w.s.dust = Number(w.s.dust || 0) + 10;
      if (typeof w.addXP === 'function') w.addXP(10);
      if (typeof w.save === 'function') w.save();
      save();
      render();
      if (typeof w.toast === 'function') w.toast('☀️ Daily Orbit: +10 Dust • +10 XP');
    };

    render();
    save();
    const title = d.querySelector('title');
    if (title) title.textContent = 'Pixel Champs V90 — Cosmic Passport';
    w.render();
  });
})();
