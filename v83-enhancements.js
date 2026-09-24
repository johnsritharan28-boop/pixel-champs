(() => {
  const frame = document.querySelector('.game');
  if (!frame) return;

  frame.addEventListener('load', () => {
    const w = frame.contentWindow;
    const d = frame.contentDocument;
    if (!w || !d || !w.s) return;

    const progression = [
      { stage: 1, xp: 0, wins: 0, label: 'Awakened Vanguard', emoji: '🌙' },
      { stage: 2, xp: 250, wins: 3, label: 'Starlight Vanguard', emoji: '✨' },
      { stage: 3, xp: 600, wins: 8, label: 'Nova Vanguard', emoji: '🌟' },
      { stage: 4, xp: 1200, wins: 15, label: 'Astral Vanguard', emoji: '☄️' },
      { stage: 5, xp: 2200, wins: 25, label: 'Cosmic Vanguard', emoji: '🌌' }
    ];

    const getStage = () => {
      let current = progression[0];
      for (const p of progression) {
        if ((w.s.xp || 0) >= p.xp && (w.s.wins || 0) >= p.wins) current = p;
      }
      return current;
    };

    const card = d.querySelector('#champ .card');
    if (card) {
      const note = card.querySelector('.note');
      const current = card.querySelector('.grid');
      const stage = getStage();
      const next = progression[stage.stage] || null;
      const pct = next
        ? Math.min(100, Math.round(Math.min((w.s.xp || 0) / next.xp, (w.s.wins || 0) / next.wins) * 100))
        : 100;
      const panel = d.createElement('div');
      panel.className = 'card';
      panel.style.marginTop = '12px';
      panel.innerHTML = `<b>${stage.emoji} Stage ${stage.stage} — ${stage.label}</b><div class="note">${next ? `Progress to Stage ${next.stage}: ${pct}% • ${w.s.xp || 0}/${next.xp} XP • ${w.s.wins || 0}/${next.wins} wins` : 'Maximum Champ stage reached.'}</div><div style="height:8px;border-radius:999px;background:rgba(255,255,255,.08);overflow:hidden;margin-top:8px"><div style="height:100%;width:${pct}%;background:linear-gradient(90deg,#7c3aed,#22d3ee);border-radius:999px"></div></div>`;
      card.parentNode.insertBefore(panel, card.nextSibling);
      if (note && !note.textContent.includes('V83')) note.textContent = `${note.textContent} • V83 progression active`;
    }

    const heroNote = d.querySelector('.hero .note');
    if (heroNote) heroNote.textContent = heroNote.textContent.replace(/V77|V80|V81|V82/g, 'V83');
    const title = d.querySelector('title');
    if (title) title.textContent = 'Pixel Champs V83 — Cosmic Universe';

    w.render();
  });
})();
