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

    // V81: persist Arena completion by local calendar day so a reload cannot farm rewards.
    const arenaKey = 'pixelChampsArenaV81';
    let arena = JSON.parse(localStorage.getItem(arenaKey) || 'null') || { day:'', hp:300, cleared:false };
    const today = localDay();
    if (arena.day !== today) arena = { day:today, hp:300, cleared:false };

    const card = d.querySelector('#arena .card');
    if (!card) return;
    const actions = card.querySelector('.actions');
    const note = card.querySelector('.note');
    if (!actions) return;
    let button = actions.querySelector('button');
    if (!button) return;

    button.textContent = arena.cleared ? '🏆 Arena Cleared Today' : '⚡ Strike the Void Titan';
    button.disabled = arena.cleared;
    if (note) note.textContent = arena.cleared
      ? 'Void Titan defeated today! Come back tomorrow for a fresh Arena run.'
      : `Void Titan HP: ${arena.hp} / 300 • Daily Arena challenge.`;

    button.onclick = () => {
      const day = localDay();
      if (arena.day !== day) arena = { day, hp:300, cleared:false };
      if (arena.cleared) { w.toast('Arena already cleared today'); return; }

      const damage = 75 + Math.floor(Math.random()*46);
      arena.hp = Math.max(0, arena.hp - damage);
      localStorage.setItem(arenaKey, JSON.stringify(arena));

      if (arena.hp <= 0) {
        arena.cleared = true;
        localStorage.setItem(arenaKey, JSON.stringify(arena));
        w.s.tokens += 2;
        w.s.dust += 140;
        w.s.wins += 1;
        w.addXP(140);
        w.save();
        button.textContent = '🏆 Arena Cleared Today';
        button.disabled = true;
        if (note) note.textContent = 'Void Titan defeated! +140 Dust • +2 Tokens • +140 XP';
        w.toast('Arena cleared!');
      } else {
        if (note) note.textContent = `Void Titan HP: ${arena.hp} / 300 • Hit for ${damage} damage.`;
        w.toast(`Titan hit! ${arena.hp} HP remaining`);
      }
    };
  });
})();
