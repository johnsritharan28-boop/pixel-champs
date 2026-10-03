(() => {
  const frame = document.querySelector('.game');
  if (!frame) return;
  frame.addEventListener('load', () => {
    const w = frame.contentWindow, d = frame.contentDocument;
    if (!w || !d || !w.s) return;
    const home = d.querySelector('#home');
    if (!home) return;
    d.querySelector('[data-v92-loadout]')?.remove();
    const key = 'pixelChampsLoadoutV92';
    const items = [
      ['nebula','🌌','Nebula Core','Cosmic starter core'],
      ['nova','💫','Nova Aura','Bright star aura'],
      ['zodiac','♈️','Zodiac Crest','Constellation crest'],
      ['starlight','✨','Starlight Trail','Shimmering trail']
    ];
    let data;
    try { data = JSON.parse(localStorage.getItem(key) || 'null'); } catch (_) { data = null; }
    if (!data) data = { equipped:'nebula', unlocked:['nebula'] };
    data.unlocked = Array.isArray(data.unlocked) ? data.unlocked : ['nebula'];
    if (!data.unlocked.includes('nebula')) data.unlocked.unshift('nebula');
    const save = () => localStorage.setItem(key, JSON.stringify(data));
    const style = d.createElement('style');
    style.textContent = `
      [data-v92-loadout]{margin-top:12px;padding:16px;border-radius:20px;background:linear-gradient(145deg,#151b3f,#080d22);border:1px solid rgba(34,211,238,.3);box-shadow:0 14px 30px rgba(0,0,0,.22)}
      [data-v92-loadout] .v92-head{display:flex;justify-content:space-between;align-items:center;gap:10px}
      [data-v92-loadout] .v92-title{font-size:19px;font-weight:950}[data-v92-loadout] .v92-pill{font-size:10px;font-weight:900;padding:7px 9px;border-radius:999px;background:rgba(34,211,238,.1);border:1px solid rgba(34,211,238,.22)}
      [data-v92-loadout] .v92-note{font-size:11px;opacity:.68;margin:5px 0 12px}[data-v92-loadout] .v92-grid{display:grid;grid-template-columns:1fr 1fr;gap:8px}
      [data-v92-loadout] .v92-item{padding:11px;border-radius:15px;background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.07)}
      [data-v92-loadout] .v92-item.equipped{border-color:rgba(34,211,238,.55);box-shadow:0 0 0 1px rgba(34,211,238,.12) inset}
      [data-v92-loadout] .v92-icon{font-size:25px}.v92-name{font-size:11px;font-weight:950;margin-top:4px}.v92-desc{font-size:9px;opacity:.62;margin-top:2px}.v92-state{font-size:9px;font-weight:900;margin-top:6px}
      [data-v92-loadout] button{width:100%;margin-top:7px;font-size:10px;font-weight:900;padding:8px 5px}
    `;
    d.head.appendChild(style);
    const card = d.createElement('section'); card.dataset.v92Loadout='1';
    card.innerHTML = `<div class="v92-head"><div class="v92-title">🎨 Cosmic Loadout</div><div class="v92-pill">CUSTOMIZE</div></div><div class="v92-note">Choose your visual cosmic style. Cosmetic choices affect presentation, not power.</div><div class="v92-grid" data-v92-grid></div>`;
    home.appendChild(card);
    const render = () => {
      card.querySelector('[data-v92-grid]').innerHTML = items.map(([id,icon,name,desc]) => {
        const unlocked = data.unlocked.includes(id), equipped = data.equipped === id;
        return `<div class="v92-item ${equipped?'equipped':''}"><div class="v92-icon">${icon}</div><div class="v92-name">${name}</div><div class="v92-desc">${desc}</div><div class="v92-state">${equipped?'✓ Equipped':unlocked?'Unlocked':'🔒 Unlock by playing'}</div><button type="button" data-v92-equip="${id}" ${unlocked && !equipped?'':'disabled'}>${equipped?'Equipped':unlocked?'Equip':'Locked'}</button></div>`;
      }).join('');
      card.querySelectorAll('[data-v92-equip]').forEach(btn => btn.onclick=()=>{ const id=btn.dataset.v92Equip; if(!data.unlocked.includes(id)) return; data.equipped=id; save(); render(); if(typeof w.toast==='function') w.toast('🎨 Cosmic style equipped!'); });
    };
    // Unlock cosmetics through normal play milestones; no gameplay advantage.
    const unlockWatch = () => {
      let c={unlocked:{},stats:{}}; try { c=JSON.parse(localStorage.getItem('pixelChampsCollectionV89')||'{}'); } catch(_){}
      const u=Object.keys(c.unlocked||{}).length, b=Number(c.stats?.battles||0), s=Number(c.stats?.spins||0);
      const unlocks=[]; if(u>=1||b>=1) unlocks.push('nova'); if(u>=3||b>=5) unlocks.push('zodiac'); if(u>=5||s>=3) unlocks.push('starlight');
      let changed=false; unlocks.forEach(id=>{if(!data.unlocked.includes(id)){data.unlocked.push(id);changed=true;}}); if(changed){save();render(); if(typeof w.toast==='function') w.toast('✨ New Cosmic cosmetic unlocked!');}
    };
    render(); unlockWatch(); setInterval(unlockWatch,1500); save();
    const title=d.querySelector('title'); if(title) title.textContent='Pixel Champs V92 — Cosmic Loadout';
    w.render();
  });
})();
