(() => {
  const w=window,d=document;
  // V95 touch bridge: expose the live core state object to legacy enhancement modules.
  if (typeof s !== 'undefined') w.s=s;
  if(!d.body)return;
  d.documentElement.style.touchAction='manipulation';
  d.body.style.touchAction='manipulation';
  const style=d.createElement('style');
  style.textContent='html,body{touch-action:manipulation;-webkit-tap-highlight-color:transparent}button,.tile,[onclick]{touch-action:manipulation;-webkit-user-select:none;user-select:none}button:disabled{opacity:.55}';
  d.head.appendChild(style);

  // Test branch: preserve native WebKit clicks only. The synthetic tap fallback
  // is intentionally omitted here so we can isolate whether it suppresses taps.
  // Core button handlers and the V93 battle logic below are unchanged.
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
  writeLog('⚔️ V95 Battle System ready — 120 HP each.');
})();
