(() => {
  const frame = document.querySelector('.game');
  if (!frame) return;

  frame.addEventListener('load', () => {
    const w = frame.contentWindow;
    const d = frame.contentDocument;
    if (!w || !d || !w.s) return;

    const signs = ['Aries','Taurus','Gemini','Cancer','Leo','Virgo','Libra','Scorpio','Sagittarius','Capricorn','Aquarius','Pisces'];
    const getCount = () => Array.isArray(w.s.signs) ? new Set(w.s.signs).size : 0;

    const zodiac = d.querySelector('#zodiac .card');
    if (zodiac) {
      const panel = d.createElement('div');
      panel.className = 'card';
      panel.style.marginTop = '12px';
      panel.innerHTML = '<b>🌠 Zodiac Collection</b><div class="note" id="zodiacProgress"></div><div class="progress" style="margin-top:8px"><div class="xp" id="zodiacBar" style="width:0%"></div></div><div class="note" id="zodiacStatus" style="margin-top:7px"></div>';
      zodiac.parentNode.insertBefore(panel, zodiac.nextSibling);

      const progress = panel.querySelector('#zodiacProgress');
      const bar = panel.querySelector('#zodiacBar');
      const status = panel.querySelector('#zodiacStatus');
      const refresh = () => {
        const count = Math.min(12, getCount());
        const pct = Math.round(count / 12 * 100);
        if (progress) progress.textContent = `${count} / 12 signs discovered • ${pct}% complete`;
        if (bar) bar.style.width = `${pct}%`;
        if (status) status.textContent = count === 12 ? '🌌 Zodiac Archive complete! All 12 cosmic signs discovered.' : `Discover ${12 - count} more sign${12 - count === 1 ? '' : 's'} to complete the archive.`;
      };
      refresh();

      if (typeof w.discover === 'function') {
        const originalDiscover = w.discover;
        w.discover = function (...args) {
          const result = originalDiscover.apply(this, args);
          refresh();
          return result;
        };
      }
    }

    const heroNote = d.querySelector('.hero .note');
    if (heroNote) heroNote.textContent = heroNote.textContent.replace(/V77|V80|V81|V82|V83/g, 'V84');
    const title = d.querySelector('title');
    if (title) title.textContent = 'Pixel Champs V84 — Cosmic Universe';

    w.render();
  });
})();
