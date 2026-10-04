(() => {
  const w=window,d=document;
  // V93/V94 state bridge: the core app declares `s` with top-level `let`,
  // which is intentionally not a window property. Older enhancement modules
  // use window.s, so expose the SAME live object instead of a copy.
  if (typeof s !== 'undefined') w.s=s;
  if(!d.body)return;
  d.documentElement.style.touchAction='manipulation';
  d.body.style.touchAction='manipulation';
  const style=d.createElement('style');
  style.textContent='html,body{touch-action:manipulation;-webkit-tap-highlight-color:transparent}button,.tile,[onclick]{touch-action:manipulation;-webkit-user-select:none;user-select:none}button:disabled{opacity:.55}';
  d.head.appendChild(style);

  // iPhone/iPad tap reliability: keep the normal DOM click path, but provide
  // one controlled fallback for touch releases. The fallback only runs when
  // the browser does not successfully deliver the native click, and it
  // suppresses the duplicate native click that WebKit may emit afterward.
  if(!w.__pcTouchFallbackInstalled){
    w.__pcTouchFallbackInstalled=true;
    const down=new Map(),synthetic=new WeakSet();
    let syntheticDispatch=false;
    const actionable=target=>{
      if(!target||!target.closest)return null;
      const el=target.closest('button,[onclick],.tile');
      if(!el||el.disabled)return null;
      return el;
    };
    d.addEventListener('pointerdown',e=>{
      if(e.pointerType!=='touch')return;
      const el=actionable(e.target);
      if(!el)return;
      down.set(e.pointerId,{el,x:e.clientX,y:e.clientY});
    },true);
    d.addEventListener('pointerup',e=>{
      if(e.pointerType!=='touch')return;
      const info=down.get(e.pointerId);down.delete(e.pointerId);
      if(!info)return;
      const el=actionable(e.target);
      const moved=Math.hypot(e.clientX-info.x,e.clientY-info.y)>12;
      if(!el||el!==info.el||moved)return;
      if(el.dataset.pcTouchBusy==='1')return;
      el.dataset.pcTouchBusy='1';
      synthetic.add(el);
      syntheticDispatch=true;
      try{el.click();}finally{syntheticDispatch=false;}
      setTimeout(()=>{synthetic.delete(el);el.dataset.pcTouchBusy='';},700);
    },true);
    d.addEventListener('pointercancel',e=>{down.delete(e.pointerId)},true);
    d.addEventListener('click',e=>{
      const el=actionable(e.target);
      if(!el||!synthetic.has(el))return;
      if(syntheticDispatch)return;
      synthetic.delete(el);
      e.preventDefault();
      e.stopImmediatePropagation();
    },true);
  }

  if(d.querySelector('[data-v93-battle]'))return;
  let playerHP=120,battleLocked=false;
  const battle=d.querySelector('#battle'),enemyText=d.querySelector('#enemyText'),logBox=d.querySelector('#battleLog');
  if(!battle||!enemyText||typeof w.attack!=='function'||typeof w.newFight!=='function')return;

  const panel=d.createElement('section');
  panel.dataset.v93Battle='1';
  panel.style.cssText='margin-top:12px;padding:12px;border-radius:15px;background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.1)';
  panel.innerHTML='<div style="display:flex;justify-content:space-between;font-size:11px;font-weight:900;margin-bottom:5px"><span>❤️ Nova Vanguard HP</span><b data-v93-hp-text>120 / 120 HP</b></div><div style="height:10px;background:rgba(255,255,255,.1);border-radius:99px;overflow:hidden"><div data-v93-hp-bar style="height:100%;width:100%;background:linear-gradient(90deg,#39d98a,#21c7a8);border-radius:99px"></div></div><div data-v93-state style="margin-top:6px;font-size:10px;opacity:.7">Both Champs take turns attacking.</div>';
  battle.querySelector('.card')?.prepend(panel);
  const hpText=panel.querySelector('[data-v93-hp-text]'),hpBar=panel.querySelector('[data-v93-hp-bar]'),state=panel.querySelector('[data-v93-state]');
  const writeLog=m=>{if(!logBox)return;const p=d.createElement('div');p.className='line';p.textContent=m;logBox.prepend(p);while(logBox.children.length>8)logBox.lastChild.remove();};
  const render=()=>{hpText.textContent=playerHP+' / 120 HP';hpBar.style.width=(playerHP/120*100)+'%';state.textContent=battleLocked?'Battle over — tap New Fight to start again.':'Both Champs take turns attacking.';};
  const enemyHP=()=>{const m=(enemyText.textContent||'').match(/(\d+)\s*\/\s*120/);return m?Number(m[1]):null;};
  const originalAttack=w.attack,originalNewFight=w.newFight;
  w.attack=n=>{if(battleLocked||playerHP<=0){w.toast?.('Start a new fight');return;}originalAttack(n);const rem=enemyHP();if(rem===0){battleLocked=true;render();return;}const dmg=8+Math.floor(Math.random()*9);playerHP=Math.max(0,playerHP-dmg);writeLog('👾 Void Warden hits Nova Vanguard for '+dmg+' damage.');render();if(playerHP===0){battleLocked=true;writeLog('💫 Nova Vanguard was defeated. Tap New Fight to try again.');w.toast?.('Nova Vanguard was defeated');}};
  w.newFight=()=>{originalNewFight();playerHP=120;battleLocked=false;render();writeLog('❤️ Nova Vanguard returns with full HP.');};
  render();
  writeLog('⚔️ V93 Battle System ready — 120 HP each.');
})();
