(() => {
  const frame = document.querySelector('.game');
  if (!frame) return;

  const initFrame = () => {
    const w = frame.contentWindow;
    const d = frame.contentDocument;
    if (!w || !d) return;
    if (d.documentElement) {
      d.documentElement.style.touchAction = 'manipulation';
      if (d.body) d.body.style.touchAction = 'manipulation';
      const touchStyle = d.createElement('style');
      touchStyle.textContent = `
        html, body { touch-action: manipulation; -webkit-tap-highlight-color: transparent; }
        button, .tile, [onclick] { touch-action: manipulation; -webkit-user-select: none; user-select: none; }
      `;
      if (d.head && !d.querySelector('[data-pc-touch-style]')) {
        touchStyle.dataset.pcTouchStyle = '1';
        d.head.appendChild(touchStyle);
      }
    }

    // Parent-level tap proxy for iOS/WebKit iframe touches.
    if (!frame.dataset.pcTapBridge) {
      frame.dataset.pcTapBridge = '1';
      let start = null;

      frame.addEventListener('touchstart', (e) => {
        const t = e.touches && e.touches[0];
        if (t) start = { x: t.clientX, y: t.clientY };
      }, { passive: true });

      frame.addEventListener('touchend', (e) => {
        const t = e.changedTouches && e.changedTouches[0];
        if (!t || !start) return;
        const dx = t.clientX - start.x;
        const dy = t.clientY - start.y;
        start = null;
        if (Math.hypot(dx, dy) > 18) return;

        const rect = frame.getBoundingClientRect();
        const x = t.clientX - rect.left;
        const y = t.clientY - rect.top;
        if (x < 0 || y < 0 || x > rect.width || y > rect.height) return;

        const raw = d.elementFromPoint(x, y);
        const target = raw && raw.closest ? raw.closest('button, [onclick], .tile') : null;
        if (!target || target.disabled) return;

        w.__pcSuppressTrustedClickUntil = Date.now() + 800;
        try { target.click(); } catch (_) {}
      }, { passive: true });
    }

    d.addEventListener('click', (e) => {
      if (e.isTrusted && Date.now() < (w.__pcSuppressTrustedClickUntil || 0)) {
        e.preventDefault();
        e.stopPropagation();
        w.__pcSuppressTrustedClickUntil = 0;
      }
    }, true);

    if (d.body && !d.body.dataset.pcTouchListeners) {
      d.body.dataset.pcTouchListeners = '1';
      d.body.addEventListener('touchstart', () => {}, { passive: true });
      d.body.addEventListener('touchend', () => {}, { passive: true });
      d.body.addEventListener('pointerdown', () => {}, { passive: true });
    }

    if (d.querySelector('[data-v93-battle]')) return;

    let playerHP = 120;
    let battleLocked = false;
    const battle = d.querySelector('#battle');
    const enemyBar = d.querySelector('#enemy');
    const enemyText = d.querySelector('#enemyText');
    const logBox = d.querySelector('#battleLog');
    if (!battle || !enemyBar || !enemyText) return;

    const style = d.createElement('style');
    style.textContent = `
      [data-v93-battle] { margin-top: 12px; padding: 12px; border-radius: 15px; background: rgba(255,255,255,.05); border: 1px solid rgba(255,255,255,.1); }
      [data-v93-battle] .v93-label { display:flex; justify-content:space-between; font-size:11px; font-weight:900; margin-bottom:5px; }
      [data-v93-battle] .v93-hp { height:10px; background:rgba(255,255,255,.1); border-radius:99px; overflow:hidden; }
      [data-v93-battle] .v93-bar { height:100%; width:100%; background:linear-gradient(90deg,#39d98a,#21c7a8); border-radius:99px; transition:width .2s; }
      [data-v93-battle] .v93-state { margin-top:6px; font-size:10px; opacity:.7; }
    `;
    if (d.head) d.head.appendChild(style);

    const panel = d.createElement('section');
    panel.dataset.v93Battle = '1';
    panel.innerHTML = `
      <div class="v93-label"><span>❤️ Nova Vanguard HP</span><b data-v93-hp-text>120 / 120 HP</b></div>
      <div class="v93-hp"><div class="v93-bar" data-v93-hp-bar></div></div>
      <div class="v93-state" data-v93-state>Both Champs take turns attacking.</div>
    `;
    battle.querySelector('.card')?.prepend(panel);

    const hpText = panel.querySelector('[data-v93-hp-text]');
    const hpBar = panel.querySelector('[data-v93-hp-bar]');
    const state = panel.querySelector('[data-v93-state]');

    const writeLog = (message) => {
      if (!logBox) return;
      const p = d.createElement('div');
      p.className = 'line';
      p.textContent = message;
      logBox.prepend(p);
      while (logBox.children.length > 8) logBox.lastChild.remove();
    };

    const renderHP = () => {
      hpText.textContent = playerHP + ' / 120 HP';
      hpBar.style.width = (playerHP / 120 * 100) + '%';
      state.textContent = battleLocked
        ? 'Battle over — tap New Fight to start again.'
        : 'Both Champs take turns attacking.';
    };

    const getEnemyHP = () => {
      const m = (enemyText.textContent || '').match(/(\\d+)\\s*\/\\s*120/);
      return m ? Number(m[1]) : null;
    };

    const originalAttack = typeof w.attack === 'function' ? w.attack : null;
    const originalNewFight = typeof w.newFight === 'function' ? w.newFight : null;
    if (!originalAttack || !originalNewFight) return;

    w.attack = function(n) {
      if (battleLocked || playerHP <= 0) {
        if (typeof w.toast === 'function') w.toast('Start a new fight');
        return;
      }
      originalAttack(n);
      const remaining = getEnemyHP();
      if (remaining === 0) {
        battleLocked = true;
        state.textContent = 'Victory — rewards granted!';
        renderHP();
        return;
      }
      const enemyDamage = 8 + Math.floor(Math.random() * 9);
      playerHP = Math.max(0, playerHP - enemyDamage);
      writeLog('👾 Void Warden hits Nova Vanguard for ' + enemyDamage + ' damage.');
      renderHP();
      if (playerHP === 0) {
        battleLocked = true;
        writeLog('💫 Nova Vanguard was defeated. Tap New Fight to try again.');
        state.textContent = 'Defeated — tap New Fight.';
        if (typeof w.toast === 'function') w.toast('Nova Vanguard was defeated');
      }
    };

    w.newFight = function() {
      originalNewFight();
      playerHP = 120;
      battleLocked = false;
      renderHP();
      writeLog('❤️ Nova Vanguard returns with full HP.');
    };

    renderHP();
    writeLog('⚔️ V93 Battle System ready — 120 HP each.');
  };

  if (document.readyState === 'loading') {
    window.addEventListener('load', () => {
      if (frame.contentDocument && frame.contentDocument.readyState === 'complete') initFrame();
      else frame.addEventListener('load', initFrame, { once: true });
    }, { once: true });
  } else if (frame.contentDocument && frame.contentDocument.readyState === 'complete') {
    initFrame();
  } else {
    frame.addEventListener('load', initFrame, { once: true });
  }
})();