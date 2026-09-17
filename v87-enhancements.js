(() => {
  const frame = document.querySelector('.game');
  if (!frame) return;

  frame.addEventListener('load', () => {
    const w = frame.contentWindow;
    const d = frame.contentDocument;
    if (!w || !d || !w.s) return;

    const signs = [
      ['Aries','♈','Flame Rush',90],['Taurus','♉','Cosmic Guard',80],['Gemini','♊','Twin Strike',105],
      ['Cancer','♋','Lunar Shell',85],['Leo','♌','Solar Roar',120],['Virgo','♍','Astral Precision',110],
      ['Libra','♎','Balance Break',100],['Scorpio','♏','Shadow Sting',115],['Sagittarius','♐','Star Arrow',95],
      ['Capricorn','♑','Void Climb',100],['Aquarius','♒','Nebula Wave',110],['Pisces','♓','Dream Surge',90]
    ];
    const archiveKey = 'pixelChampsV77';
    let owned = [];
    try { owned = JSON.parse(localStorage.getItem(archiveKey) || '{}').signs || []; } catch (_) {}
    const unlocked = signs.filter((s, i) => owned.includes(i) || owned.includes(s[0])).slice(0, 3);
    const active = unlocked[0] || signs[0];

    const battle = d.querySelector('#battle .card');
    if (!battle) return;
    const old = d.querySelector('[data-v87-panel]');
    if (old) old.remove();

    const panel = d.createElement('div');
    panel.className = 'card';
    panel.dataset.v87Panel = '1';
    panel.style.marginTop = '12px';
    panel.innerHTML = `<b>🌠 Zodiac Combat</b><div class="note">${active[1]} ${active[0]} • ${active[2]} • ${unlocked.length ? 'Unlocked' : 'Awakening'}</div><div class="actions"><button type="button">${active[1]} ${active[2]}</button></div><div class="note" data-v87-status>Cosmic ability ready. Uses a fictional battle charge.</div>`;
    battle.parentNode.insertBefore(panel, battle.nextSibling);
    const button = panel.querySelector('button');
    const status = panel.querySelector('[data-v87-status]');
    const today = () => { const x = new Date(); return `${x.getFullYear()}-${String(x.getMonth()+1).padStart(2,'0')}-${String(x.getDate()).padStart(2,'0')}`; };
    const chargeKey = 'pixelChampsZodiacChargeV87';
    let chargeDay = localStorage.getItem(chargeKey) || '';
    let used = chargeDay === today();

    button.onclick = () => {
      if (used) { status.textContent = 'Zodiac ability already used today. A fresh fictional charge returns tomorrow.'; w.toast('Zodiac charge spent'); return; }
      used = true; localStorage.setItem(chargeKey, today());
      const damage = active[3] + Math.floor(Math.random() * 21);
      status.textContent = `${active[1]} ${active[2]} activated! ${damage} cosmic damage dealt • Daily charge spent.`;
      w.toast(`${active[2]}! -${damage} HP`);
    };
    if (used) button.disabled = true;
    const heroNote = d.querySelector('.hero .note');
    if (heroNote) heroNote.textContent = heroNote.textContent.replace(/V77|V80|V81|V82|V83|V84|V85|V86/g, 'V87');
    const title = d.querySelector('title');
    if (title) title.textContent = 'Pixel Champs V87 — Cosmic Universe';
    w.render();
  });
})();
