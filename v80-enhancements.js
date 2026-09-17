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

    // V80: use the player's local calendar day for daily rewards.
    const oldDaily = w.daily;
    w.daily = function () {
      const day = localDay();
      if (w.s.daily === day) { w.toast('Daily already claimed'); return; }
      w.s.daily = day;
      w.s.dust += 40;
      w.addXP(20);
      w.save();
      w.toast('+40 Dust');
    };

    // V80: prevent social missions from paying rewards after the 3/3 goal.
    w.social = function () {
      if (w.s.social >= 3) { w.toast('All social missions complete'); return; }
      w.s.social += 1;
      w.s.dust += 10;
      w.addXP(25);
      w.save();
      w.toast('Social mission +1');
    };

    // V80: use local calendar day for the fictional daily spin too.
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

    // V80 visual badge: make the playable screen clearly identify the current build.
    const note = d.querySelector('.hero .note');
    if (note && note.textContent.includes('V77')) note.textContent = note.textContent.replace('V77','V80');
    const title = d.querySelector('title');
    if (title) title.textContent = 'Pixel Champs V80 — Cosmic Universe';

    w.render();
  });
})();
