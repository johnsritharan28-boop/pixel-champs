(() => {
  const frame = document.querySelector('.game');
  if (!frame) return;

  const localDay = () => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
  };

  frame.addEventListener('load', () => {
    const w = frame.contentWindow;
    const d = frame.contentDocument;
    if (!w || !d) return;

    const arenaKey = 'pixelChampsArenaV82';
    const today = localDay();
    let arena;
    try { arena = JSON.parse(localStorage.getItem(arenaKey) || 'null'); } catch (_) { arena = null; }
    if (!arena || arena.day !== today) arena = { day: today, hp: 300, cleared: false };

    const card = d.querySelector('#arena .card');
    if (card) {
      const actions = card.querySelector('.actions');
      const note = card.querySelector('.note');
      const button = actions && actions.querySelector('button');
      if (button) {
        const refresh = () => {
          button.disabled = arena.cleared;
          button.textContent = arena.cleared ? '🏆 Arena Cleared Today' : '⚡ Strike the Void Titan';
          if (note) note.textContent = arena.cleared
            ? 'Void Titan defeated today! Come back tomorrow for a fresh Arena run.'
            : `Void Titan HP: ${arena.hp} / 300 • Daily Arena challenge.`;
        };

        localStorage.setItem(arenaKey, JSON.stringify(arena));
        refresh();

        button.onclick = () => {
          const day = localDay();
          if (arena.day !== day) arena = { day, hp: 300, cleared: false };
          if (arena.cleared) { w.toast('Arena already cleared today'); return; }

          const damage = 75 + Math.floor(Math.random() * 46);
          arena.hp = Math.max(0, arena.hp - damage);
          if (arena.hp <= 0) {
            arena.cleared = true;
            localStorage.setItem(arenaKey, JSON.stringify(arena));
            w.s.tokens += 2;
            w.s.dust += 140;
            w.s.wins += 1;
            w.addXP(140);
            w.save();
            refresh();
            if (note) note.textContent = 'Void Titan defeated! +140 Dust • +2 Tokens • +140 XP';
            w.toast('Arena cleared!');
          } else {
            localStorage.setItem(arenaKey, JSON.stringify(arena));
            if (note) note.textContent = `Void Titan HP: ${arena.hp} / 300 • Hit for ${damage} damage.`;
            w.toast(`Titan hit! ${arena.hp} HP remaining`);
          }
        };
      }
    }

    const note = d.querySelector('.hero .note');
    if (note) note.textContent = note.textContent.replace(/V77|V80|V81/g, 'V82');
    const title = d.querySelector('title');
    if (title) title.textContent = 'Pixel Champs V82 — Cosmic Universe';

    w.render();
  });
})();
