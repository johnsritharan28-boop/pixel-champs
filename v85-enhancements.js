(() => {
  const frame = document.querySelector('.game');
  if (!frame) return;

  frame.addEventListener('load', () => {
    const w = frame.contentWindow;
    const d = frame.contentDocument;
    if (!w || !d) return;

    const battle = d.querySelector('#battle .card');
    if (!battle) return;

    const note = battle.querySelector('.note');
    const hpBar = battle.querySelector('.hp');
    const fill = hpBar && hpBar.querySelector('.bar');
    const actions = battle.querySelector('.actions');
    const buttons = actions ? Array.from(actions.querySelectorAll('button')) : [];
    const attack = buttons.find(b => /star strike/i.test(b.textContent));
    const burst = buttons.find(b => /nova burst/i.test(b.textContent));
    if (!attack && !burst) return;

    const maxHP = 500;
    let hp = Number(battle.dataset.v85Hp || maxHP);
    if (!Number.isFinite(hp) || hp <= 0) hp = maxHP;

    const render = (message) => {
      hp = Math.max(0, hp);
      battle.dataset.v85Hp = String(hp);
      if (fill) fill.style.width = `${Math.round((hp / maxHP) * 100)}%`;
      if (note) note.textContent = message || `Void Warden HP: ${hp} / ${maxHP}`;
    };

    const hit = (base, label) => {
      if (hp <= 0) { w.toast('Void Warden defeated — start a new fight'); return; }
      const damage = base + Math.floor(Math.random() * 31);
      hp = Math.max(0, hp - damage);
      if (hp === 0) {
        w.s.wins += 1;
        w.s.dust += 90;
        w.s.tokens += 1;
        w.addXP(100);
        w.save();
        render(`🏆 ${label} finished the Void Warden! +90 Dust • +1 Token • +100 XP`);
        w.toast('Battle won!');
      } else {
        render(`⚡ ${label} dealt ${damage} damage • Void Warden: ${hp} / ${maxHP} HP`);
        w.toast(`-${damage} HP`);
      }
    };

    if (attack) {
      attack.textContent = '⚔️ Star Strike';
      attack.onclick = () => hit(70, 'Star Strike');
    }
    if (burst) {
      burst.textContent = '💥 Nova Burst';
      burst.onclick = () => hit(120, 'Nova Burst');
    }

    const fightButtons = buttons.filter(b => /new fight/i.test(b.textContent));
    fightButtons.forEach(button => {
      button.onclick = () => { hp = maxHP; render('Void Warden restored to 500 HP • New fight ready.'); w.toast('New fight started'); };
    });

    render();
    const heroNote = d.querySelector('.hero .note');
    if (heroNote) heroNote.textContent = heroNote.textContent.replace(/V77|V80|V81|V82|V83|V84/g, 'V85');
    const title = d.querySelector('title');
    if (title) title.textContent = 'Pixel Champs V85 — Cosmic Universe';
    w.render();
  });
})();
