(() => {
  const frame = document.querySelector('.game');
  if (!frame) return;

  frame.addEventListener('load', () => {
    const w = frame.contentWindow;
    const d = frame.contentDocument;
    if (!w || !d || !w.s) return;

    const key = 'pixelChampsBattleStreakV86';
    let streak = 0;
    let best = 0;
    try {
      const saved = JSON.parse(localStorage.getItem(key) || 'null');
      streak = Number(saved?.streak || 0);
      best = Number(saved?.best || 0);
    } catch (_) {}

    const card = d.querySelector('#battle .card');
    if (!card) return;
    const actions = card.querySelector('.actions');
    const buttons = actions ? Array.from(actions.querySelectorAll('button')) : [];
    const strike = buttons.find(b => /star strike/i.test(b.textContent));
    const burst = buttons.find(b => /nova burst/i.test(b.textContent));
    const newFight = buttons.find(b => /new fight/i.test(b.textContent));
    if (!strike && !burst) return;

    const panel = d.createElement('div');
    panel.className = 'card';
    panel.style.marginTop = '12px';
    panel.innerHTML = '<b>🔥 Battle Streak</b><div class="note" data-v86-streak></div>';
    card.parentNode.insertBefore(panel, card.nextSibling);
    const status = panel.querySelector('[data-v86-streak]');

    const save = () => localStorage.setItem(key, JSON.stringify({ streak, best }));
    const render = () => {
      const next = streak < 3 ? 3 : streak < 5 ? 5 : streak < 10 ? 10 : null;
      status.textContent = next
        ? `${streak} win${streak === 1 ? '' : 's'} in a row • Best: ${best} • Next milestone: ${next}`
        : `🔥 ${streak}-win streak • Best: ${best} • Cosmic streak master!`;
    };

    const originalToast = typeof w.toast === 'function' ? w.toast.bind(w) : null;
    const reward = () => {
      streak += 1;
      best = Math.max(best, streak);
      let dust = 0;
      let xp = 0;
      if (streak === 3) { dust = 30; xp = 30; }
      if (streak === 5) { dust = 60; xp = 60; }
      if (streak === 10) { dust = 150; xp = 150; }
      if (dust) {
        w.s.dust += dust;
        w.addXP(xp);
        w.save();
        if (originalToast) originalToast(`🔥 ${streak}-win streak! +${dust} Dust • +${xp} XP`);
      }
      save();
      render();
    };

    const wrap = (button) => {
      if (!button) return;
      button.addEventListener('click', () => {
        const before = Number(w.s.wins || 0);
        setTimeout(() => {
          if (Number(w.s.wins || 0) > before) reward();
        }, 0);
      });
    };
    wrap(strike);
    wrap(burst);

    if (newFight) {
      newFight.addEventListener('click', () => {
        render();
      });
    }

    render();
    const heroNote = d.querySelector('.hero .note');
    if (heroNote) heroNote.textContent = heroNote.textContent.replace(/V77|V80|V81|V82|V83|V84|V85/g, 'V86');
    const title = d.querySelector('title');
    if (title) title.textContent = 'Pixel Champs V86 — Cosmic Universe';
    w.render();
  });
})();
