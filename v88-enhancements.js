(() => {
  const frame = document.querySelector('.game');
  if (!frame) return;

  frame.addEventListener('load', () => {
    const w = frame.contentWindow;
    const d = frame.contentDocument;
    if (!w || !d || !w.s) return;

    const key = 'pixelChampsQuestsV88';
    const day = () => { const x = new Date(); return `${x.getFullYear()}-${String(x.getMonth()+1).padStart(2,'0')}-${String(x.getDate()).padStart(2,'0')}`; };
    let data = null;
    try { data = JSON.parse(localStorage.getItem(key) || 'null'); } catch (_) {}
    if (!data || data.day !== day()) data = { day: day(), claimed: {}, progress: {} };

    const quests = [
      { id:'battle', icon:'⚔️', name:'Cosmic Challenger', goal:2, reward:50, xp:50, text:'Complete 2 Cosmic Battles.' },
      { id:'zodiac', icon:'🌠', name:'Zodiac Awakening', goal:1, reward:35, xp:40, text:'Use your daily Zodiac ability.' },
      { id:'spin', icon:'✨', name:'Starlight Spin', goal:1, reward:25, xp:30, text:'Complete a daily Cosmic Spin.' }
    ];

    const home = d.querySelector('#home');
    if (!home) return;
    const old = d.querySelector('[data-v88-quests]');
    if (old) old.remove();

    const card = d.createElement('div');
    card.className = 'card';
    card.dataset.v88Quests = '1';
    card.style.marginTop = '12px';
    card.innerHTML = `<b>🌌 Cosmic Quests</b><div class="note">Daily objectives • Fictional rewards only</div><div data-v88-list></div>`;
    home.appendChild(card);
    const list = card.querySelector('[data-v88-list]');

    const save = () => localStorage.setItem(key, JSON.stringify(data));
    const render = () => {
      list.innerHTML = quests.map(q => {
        const p = Math.min(q.goal, Number(data.progress[q.id] || 0));
        const done = p >= q.goal;
        const claimed = !!data.claimed[q.id];
        return `<div style="padding:10px 0;border-top:1px solid rgba(255,255,255,.08)"><b>${q.icon} ${q.name}</b><div class="note">${q.text} • ${p}/${q.goal}</div><button type="button" data-q="${q.id}" ${done && !claimed ? '' : 'disabled'}>${claimed ? '✓ Reward Claimed' : done ? `Claim +${q.reward} Dust • +${q.xp} XP` : 'In Progress'}</button></div>`;
      }).join('');
      list.querySelectorAll('[data-q]').forEach(btn => btn.onclick = () => {
        const q = quests.find(x => x.id === btn.dataset.q);
        if (!q || data.claimed[q.id] || Number(data.progress[q.id] || 0) < q.goal) return;
        data.claimed[q.id] = true;
        w.s.dust += q.reward;
        w.addXP(q.xp);
        w.save(); save(); render();
        w.toast(`${q.name}: +${q.reward} Dust • +${q.xp} XP`);
      });
    };

    const inc = (id, amount = 1) => {
      if (!data.progress[id]) data.progress[id] = 0;
      data.progress[id] = Math.min(quests.find(q => q.id === id).goal, data.progress[id] + amount);
      save(); render();
    };

    const original = {};
    ['attack','spin','useZodiac'].forEach(name => {
      if (typeof w[name] === 'function') original[name] = w[name];
    });
    if (original.attack) w.attack = (...args) => { const r = original.attack(...args); inc('battle'); return r; };
    if (original.spin) w.spin = (...args) => { const r = original.spin(...args); inc('spin'); return r; };
    if (original.useZodiac) w.useZodiac = (...args) => { const r = original.useZodiac(...args); inc('zodiac'); return r; };

    render();
    save();
    const heroNote = d.querySelector('.hero .note');
    if (heroNote) heroNote.textContent = heroNote.textContent.replace(/V77|V80|V81|V82|V83|V84|V85|V86|V87/g, 'V88');
    const title = d.querySelector('title');
    if (title) title.textContent = 'Pixel Champs V88 — Cosmic Universe';
    w.render();
  });
})();
