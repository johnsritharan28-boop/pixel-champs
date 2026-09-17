(() => {
  const frame = document.querySelector('.game');
  if (!frame) return;

  frame.addEventListener('load', () => {
    const w = frame.contentWindow;
    const d = frame.contentDocument;
    if (!w || !d || !w.s) return;

    const key = 'pixelChampsCollectionV89';
    const load = () => {
      try { return JSON.parse(localStorage.getItem(key) || 'null'); } catch (_) { return null; }
    };
    const data = load() || { unlocked: {}, stats: { battles: 0, zodiac: 0, spins: 0, quests: 0, dust: 0, xp: 0 } };
    data.unlocked ||= {};
    data.stats ||= { battles: 0, zodiac: 0, spins: 0, quests: 0, dust: 0, xp: 0 };
    const save = () => localStorage.setItem(key, JSON.stringify(data));

    const achievements = [
      { id:'first-battle', icon:'⚔️', title:'Cosmic Challenger', desc:'Complete your first Cosmic Battle.', test:s=>s.battles>=1 },
      { id:'battle-master', icon:'🔥', title:'Battle Master', desc:'Complete 10 Cosmic Battles.', test:s=>s.battles>=10 },
      { id:'zodiac-awakened', icon:'🌠', title:'Zodiac Awakened', desc:'Use a Zodiac ability for the first time.', test:s=>s.zodiac>=1 },
      { id:'zodiac-keeper', icon:'♈️', title:'Zodiac Keeper', desc:'Use 7 Zodiac abilities.', test:s=>s.zodiac>=7 },
      { id:'starlight', icon:'✨', title:'Starlight Seeker', desc:'Complete your first daily spin.', test:s=>s.spins>=1 },
      { id:'spin-week', icon:'🌟', title:'Seven Stars', desc:'Complete 7 daily spins.', test:s=>s.spins>=7 },
      { id:'quester', icon:'🏆', title:'Quest Initiate', desc:'Claim your first Cosmic Quest reward.', test:s=>s.quests>=1 },
      { id:'quest-legend', icon:'👑', title:'Quest Legend', desc:'Claim 10 Cosmic Quest rewards.', test:s=>s.quests>=10 },
      { id:'dust-collector', icon:'💎', title:'Dust Collector', desc:'Earn 500 fictional Dust.', test:s=>s.dust>=500 },
      { id:'xp-hunter', icon:'🚀', title:'XP Hunter', desc:'Earn 1,000 XP.', test:s=>s.xp>=1000 }
    ];

    const home = d.querySelector('#home');
    if (!home) return;
    d.querySelector('[data-v89-collection]')?.remove();

    const style = d.createElement('style');
    style.textContent = `
      [data-v89-collection]{margin-top:12px;background:linear-gradient(145deg,#171d45,#0b1028);border:1px solid rgba(139,92,246,.42);border-radius:20px;padding:15px;box-shadow:0 12px 28px rgba(0,0,0,.22)}
      [data-v89-collection] .v89-head{display:flex;justify-content:space-between;align-items:center;gap:10px}
      [data-v89-collection] .v89-title{font-size:19px;font-weight:950}
      [data-v89-collection] .v89-count{font-size:12px;font-weight:900;padding:7px 10px;border-radius:999px;background:#242b59;border:1px solid #4a548d}
      [data-v89-collection] .v89-sub{font-size:11px;opacity:.68;margin:4px 0 12px}
      [data-v89-collection] .v89-grid{display:grid;grid-template-columns:1fr 1fr;gap:8px}
      [data-v89-collection] .v89-ach{min-height:92px;border-radius:15px;padding:10px;background:linear-gradient(145deg,#202754,#111632);border:1px solid #343d76}
      [data-v89-collection] .v89-ach.locked{opacity:.48;filter:saturate(.55)}
      [data-v89-collection] .v89-icon{font-size:24px}
      [data-v89-collection] .v89-name{font-size:12px;font-weight:950;margin-top:4px}
      [data-v89-collection] .v89-desc{font-size:10px;line-height:1.3;opacity:.68;margin-top:2px}
      [data-v89-collection] .v89-status{font-size:9px;font-weight:900;margin-top:6px;text-transform:uppercase;letter-spacing:.5px}
      [data-v89-collection] .v89-titlebar{margin-top:12px;padding:10px;border-radius:14px;background:rgba(139,92,246,.12);border:1px solid rgba(139,92,246,.22);font-size:12px;font-weight:850}
    `;
    d.head.appendChild(style);

    const card = d.createElement('section');
    card.dataset.v89Collection = '1';
    card.innerHTML = `<div class="v89-head"><div class="v89-title">🌌 Cosmic Collection</div><div class="v89-count" data-v89-count>0 / ${achievements.length}</div></div><div class="v89-sub">Achievements, titles & milestones • fictional in-game progression</div><div class="v89-grid" data-v89-grid></div><div class="v89-titlebar" data-v89-titlebar>🏷️ Current Title: Cosmic Rookie</div>`;
    home.appendChild(card);

    const grid = card.querySelector('[data-v89-grid]');
    const count = card.querySelector('[data-v89-count]');
    const titlebar = card.querySelector('[data-v89-titlebar]');

    const titles = [
      [0, 'Cosmic Rookie'], [1, 'Cosmic Challenger'], [3, 'Star Seeker'], [5, 'Zodiac Keeper'], [7, 'Cosmic Veteran'], [10, 'Cosmic Legend']
    ];

    const currentTitle = () => {
      const n = achievements.filter(a => data.unlocked[a.id]).length;
      return titles.reduce((best, item) => n >= item[0] ? item[1] : best, 'Cosmic Rookie');
    };

    const render = () => {
      let unlocked = 0;
      grid.innerHTML = achievements.map(a => {
        const is = !!data.unlocked[a.id];
        if (is) unlocked++;
        return `<div class="v89-ach ${is ? '' : 'locked'}"><div class="v89-icon">${is ? a.icon : '🔒'}</div><div class="v89-name">${a.title}</div><div class="v89-desc">${a.desc}</div><div class="v89-status">${is ? '✓ Unlocked' : 'Locked'}</div></div>`;
      }).join('');
      count.textContent = `${unlocked} / ${achievements.length}`;
      titlebar.textContent = `🏷️ Current Title: ${currentTitle()}`;
    };

    const check = () => {
      achievements.forEach(a => {
        if (!data.unlocked[a.id] && a.test(data.stats)) {
          data.unlocked[a.id] = true;
          if (typeof w.toast === 'function') w.toast(`🏆 Achievement Unlocked: ${a.title}`);
        }
      });
      save();
      render();
    };

    const wrap = (name, stat, amount = 1) => {
      if (typeof w[name] !== 'function') return;
      const original = w[name];
      w[name] = (...args) => {
        const beforeDust = Number(w.s.dust || 0);
        const beforeXp = Number(w.s.xp || 0);
        const result = original(...args);
        data.stats[stat] = Number(data.stats[stat] || 0) + amount;
        if (stat === 'quests') data.stats.quests = Math.max(data.stats.quests, amount);
        data.stats.dust = Math.max(data.stats.dust, Number(w.s.dust || 0), beforeDust);
        data.stats.xp = Math.max(data.stats.xp, Number(w.s.xp || 0), beforeXp);
        check();
        return result;
      };
    };

    wrap('attack', 'battles');
    wrap('useZodiac', 'zodiac');
    wrap('spin', 'spins');

    // Watch V88 quest rewards without changing their reward logic.
    const questKey = 'pixelChampsQuestsV88';
    let lastClaimed = {};
    try { lastClaimed = JSON.parse(localStorage.getItem(questKey) || '{}').claimed || {}; } catch (_) {}
    const questWatch = () => {
      try {
        const q = JSON.parse(localStorage.getItem(questKey) || '{}');
        const claimed = q.claimed || {};
        const newlyClaimed = Object.keys(claimed).filter(k => claimed[k] && !lastClaimed[k]);
        if (newlyClaimed.length) data.stats.quests += newlyClaimed.length;
        lastClaimed = claimed;
        data.stats.dust = Math.max(data.stats.dust, Number(w.s.dust || 0));
        data.stats.xp = Math.max(data.stats.xp, Number(w.s.xp || 0));
        check();
      } catch (_) {}
    };
    setInterval(questWatch, 1200);

    render();
    check();
    const title = d.querySelector('title');
    if (title) title.textContent = 'Pixel Champs V89 — Cosmic Collection';
    w.render();
  });
})();
