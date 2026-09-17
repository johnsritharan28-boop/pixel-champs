(() => {
  const frame = document.querySelector('.game');
  if (!frame) return;

  frame.addEventListener('load', () => {
    const w = frame.contentWindow;
    const d = frame.contentDocument;
    if (!w || !d || !w.s) return;

    const home = d.querySelector('#home');
    if (!home) return;
    d.querySelector('[data-v91-social]')?.remove();

    const key = 'pixelChampsSocialV91';
    let data;
    try { data = JSON.parse(localStorage.getItem(key) || 'null'); } catch (_) { data = null; }
    if (!data) data = { cheers: 0, spotlight: 0 };
    data.cheers = Number(data.cheers || 0);
    data.spotlight = Number(data.spotlight || 0);
    const save = () => localStorage.setItem(key, JSON.stringify(data));

    const style = d.createElement('style');
    style.textContent = `
      [data-v91-social]{margin-top:12px;padding:16px;border-radius:20px;background:linear-gradient(145deg,#17133b,#0b1028);border:1px solid rgba(244,114,182,.35);box-shadow:0 14px 30px rgba(0,0,0,.22)}
      [data-v91-social] .v91-head{display:flex;justify-content:space-between;align-items:center;gap:10px}
      [data-v91-social] .v91-title{font-size:19px;font-weight:950}
      [data-v91-social] .v91-pill{font-size:10px;font-weight:900;padding:7px 9px;border-radius:999px;background:rgba(244,114,182,.11);border:1px solid rgba(244,114,182,.25)}
      [data-v91-social] .v91-note{font-size:11px;opacity:.68;margin:5px 0 12px}
      [data-v91-social] .v91-profile{display:flex;align-items:center;gap:10px;padding:11px;border-radius:15px;background:rgba(255,255,255,.045);border:1px solid rgba(255,255,255,.07)}
      [data-v91-social] .v91-avatar{width:42px;height:42px;border-radius:14px;display:grid;place-items:center;font-size:23px;background:linear-gradient(145deg,#2a225d,#111633)}
      [data-v91-social] .v91-name{font-size:13px;font-weight:950}.v91-sub{font-size:9px;opacity:.62;margin-top:2px}
      [data-v91-social] .v91-feed{display:grid;gap:8px;margin-top:10px}
      [data-v91-social] .v91-post{padding:10px;border-radius:14px;background:rgba(255,255,255,.035);border:1px solid rgba(255,255,255,.06)}
      [data-v91-social] .v91-post b{font-size:11px}.v91-post p{font-size:10px;line-height:1.35;opacity:.74;margin:4px 0 7px}
      [data-v91-social] .v91-actions{display:flex;gap:7px}.v91-actions button{flex:1;font-size:10px;font-weight:900;padding:8px 6px}
      [data-v91-social] .v91-footer{display:flex;justify-content:space-between;gap:8px;margin-top:10px;font-size:9px;opacity:.6}
    `;
    d.head.appendChild(style);

    const card = d.createElement('section');
    card.dataset.v91Social = '1';
    card.innerHTML = `
      <div class="v91-head"><div class="v91-title">🌌 Cosmic Social Hub</div><div class="v91-pill">LOCAL HUB</div></div>
      <div class="v91-note">A lightweight community-style space for Pixel Champs • no real-time chat or real-money activity.</div>
      <div class="v91-profile"><div class="v91-avatar">🪐</div><div><div class="v91-name">Cosmic Champ</div><div class="v91-sub">Your in-game profile • ${data.cheers} cheers received</div></div></div>
      <div class="v91-feed">
        <article class="v91-post"><b>⚔️ Nova Knight</b><p>Just cleared a Cosmic Battle. The galaxy is looking good tonight!</p><div class="v91-actions"><button type="button" data-cheer="nova">👏 Cheer</button><button type="button" data-spot="nova">⭐ Spotlight</button></div></article>
        <article class="v91-post"><b>✨ Luna Runner</b><p>Seven Stars streak completed. Keep the cosmic momentum going!</p><div class="v91-actions"><button type="button" data-cheer="luna">👏 Cheer</button><button type="button" data-spot="luna">⭐ Spotlight</button></div></article>
        <article class="v91-post"><b>🌠 Zodiac Ace</b><p>Daily Orbit checked in. Small steps, big constellation.</p><div class="v91-actions"><button type="button" data-cheer="zodiac">👏 Cheer</button><button type="button" data-spot="zodiac">⭐ Spotlight</button></div></article>
      </div>
      <div class="v91-footer"><span data-v91-stats>Cheers ${data.cheers} • Spotlights ${data.spotlight}</span><span>Fictional in-game community</span></div>`;
    home.appendChild(card);

    const render = () => {
      card.querySelector('[data-v91-stats]').textContent = `Cheers ${data.cheers} • Spotlights ${data.spotlight}`;
      const sub = card.querySelector('.v91-sub');
      if (sub) sub.textContent = `Your in-game profile • ${data.cheers} cheers received`;
    };

    card.querySelectorAll('[data-cheer]').forEach(btn => btn.onclick = () => {
      data.cheers += 1;
      save(); render();
      if (typeof w.toast === 'function') w.toast('👏 Cosmic cheer sent!');
    });
    card.querySelectorAll('[data-spot]').forEach(btn => btn.onclick = () => {
      data.spotlight += 1;
      save(); render();
      if (typeof w.toast === 'function') w.toast('⭐ Added to your Cosmic Spotlight!');
    });

    render();
    save();
    const title = d.querySelector('title');
    if (title) title.textContent = 'Pixel Champs V91 — Cosmic Social Hub';
    w.render();
  });
})();
