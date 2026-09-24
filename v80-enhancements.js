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

    // V82: daily rewards and the fictional spin use the player's local calendar day.
    w.daily = function () {
      const day = localDay();
      if (w.s.daily === day) { w.toast('Daily already claimed'); return; }
      w.s.daily = day;
      w.s.dust += 40;
      w.addXP(20);
      w.save();
      w.toast('+40 Dust');
    };

    w.social = function () {
      if (w.s.social >= 3) { w.toast('All social missions complete'); return; }
      w.s.social += 1;
      w.s.dust += 10;
      w.addXP(25);
      w.save();
      w.toast('Social mission +1');
    };

    w.spin = function () {
      const day = localDay();
      if (w.s.spinDay === day) { w.toast('Spin already used today'); return; }
      w.s.spinDay = day;
      const rewards = [20,35,50,80,120];
      const r = rewards[Math.floor(Math.random()*rewards.length)];
      w.s.dust += r;
      w.addXP(15);
      const orb = d.getElementById('orb');
      const result = d.getElementById('spinResult');
      if (result) result.textContent = `✨ You found ${r} Star Dust!`;
      if (orb) orb.textContent = ['🌙','☀️','💎','☄️','🌟'][Math.floor(Math.random()*5)];
      w.save();
      w.toast('Daily spin reward claimed');
    };

    // V82: Arena progress persists with the player's save and resets on a new local day.
    const day = localDay();
    if (w.s.arenaDay !== day) {
      w.s.arenaDay = day;
      w.s.arenaHP = 300;
      w.s.arenaCleared = false;
      w.save();
    }

    let arenaHP = Number.isFinite(Number(w.s.arenaHP)) ? Number(w.s.arenaHP) : 300;
    let arenaCleared = w.s.arenaCleared === true;
    const arenaCard = d.querySelector('#arena .card');
    if (arenaCard) {
      const actions = arenaCard.querySelector('.actions');
      const note = arenaCard.querySelector('.note');
      if (actions) {
        const button = actions.querySelector('button');
        if (button) {
          const refreshArena = () => {
            if (arenaCleared) {
              button.textContent = '🏆 Arena Cleared Today';
              if (note) note.textContent = 'Void Titan defeated! Return tomorrow for a fresh Arena run.';
            } else {
              button.textContent = '⚡ Strike the Void Titan';
              if (note) note.textContent = `Void Titan HP: ${arenaHP} / 300 • Keep striking to clear the Arena.`;
            }
          };

          button.onclick = () => {
            if (arenaCleared) { w.toast('Arena cleared today — return tomorrow'); return; }
            const damage = 75 + Math.floor(Math.random()*46);
            arenaHP = Math.max(0, arenaHP - damage);
            w.s.arenaHP = arenaHP;
            if (arenaHP <= 0) {
              arenaCleared = true;
              w.s.arenaCleared = true;
              w.s.tokens += 2;
              w.s.dust += 140;
              w.s.wins += 1;
              w.addXP(140);
              w.save();
              button.textContent = '🏆 Arena Cleared Today';
              if (note) note.textContent = 'Void Titan defeated! +140 Dust • +2 Tokens • +140 XP';
              w.toast('Arena cleared!');
            } else {
              w.save();
              if (note) note.textContent = `Void Titan HP: ${arenaHP} / 300 • Hit for ${damage} damage.`;
              w.toast(`Titan hit! ${arenaHP} HP remaining`);
            }
          };
          refreshArena();
        }
      }
    }

    // V82 visual badge.
    const note = d.querySelector('.hero .note');
    if (note) note.textContent = note.textContent.replace(/V77|V80|V81/g, 'V82');
    const title = d.querySelector('title');
    if (title) title.textContent = 'Pixel Champs V82 — Cosmic Universe';

    w.render();
  });
})();
