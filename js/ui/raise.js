/* ============================================================
   Rendering
   ============================================================ */
function stageForDay(day){
  if (day <= 1) return 0;
  if (day === 2) return 1;
  return 2; // day 3 and day 4 (in-progress) show the "teen" stage; final reveal happens in modal at stage 3
}

function pollutionColor(p){
  if (p < 40) return '#4FB0A5';
  if (p < 75) return '#F4B740';
  return '#E4572E';
}

function renderDayPips(){
  let html = '';
  for (let i=1;i<=CYCLE_DAYS;i++){
    const filled = i < STATE.day;
    const current = i === STATE.day;
    html += '<svg class="day-pip '+(filled?'filled':'')+' '+(current?'current':'')+'" viewBox="0 0 24 24" width="20" height="20">' +
      '<path d="M12 2 C 6 6, 4 12, 12 22 C 20 12, 18 6, 12 2 Z" fill="'+(filled||current?'#2F6F5E':'#C9CBBE')+'"/>' +
      '</svg>';
  }
  return html;
}

function renderParticles(pollution){
  const positions = [[18,20],[80,10],[10,60],[85,55],[50,8],[60,75]];
  const cleanCount = pollution < 50 ? 4 : (pollution < 80 ? 2 : 0);
  const grimeCount = pollution >= 50 ? Math.min(6, Math.round(pollution/18)) : 0;
  let html = '';
  for (let i=0;i<positions.length;i++){
    const isGrime = i < grimeCount;
    const isSparkle = !isGrime && i < (grimeCount + cleanCount);
    if (!isGrime && !isSparkle) continue;
    const size = isGrime ? (5 + (i%3)*2) : (3 + (i%2)*2);
    html += '<div class="particle '+(isGrime?'grime':'sparkle')+'" style="left:'+positions[i][0]+'%; top:'+positions[i][1]+'%; width:'+size+'px; height:'+size+'px; animation-delay:'+(i*0.4)+'s;"></div>';
  }
  return html;
}

function renderWarning(){
  const lvl = warningLevel(STATE);
  const overAvg = STATE.todayGrams > SOFT_LIMIT_G;
  const overDouble = STATE.todayGrams > HARD_LIMIT_G;
  if (STATE.isBadLocked){
    return '<div class="warning hard">😷 <div>ごみの量や分別ミスが積み重なって、モンスターが汚れてしまった…。このサイクルは「はずれ」の姿で完成しそう。次はもう少し減らして、正しく分別してみよう。</div></div>';
  }
  if (lvl === 2){
    if (overDouble){
      return '<div class="warning hard">⚠️ <div>今日はもう'+formatGrams(STATE.todayGrams)+'！全国平均の2倍('+formatGrams(HARD_LIMIT_G)+')に近いよ。このままだとモンスターが汚れてしまうよ。</div></div>';
    }
    return '<div class="warning hard">⚠️ <div>よごれ度がかなり高くなってきたよ！燃えるごみ・燃えないごみが多いかも。資源ごみや生ごみに分別できないか見直してみよう。</div></div>';
  }
  if (lvl === 1){
    if (overAvg){
      return '<div class="warning soft">💡 <div>今日は'+formatGrams(STATE.todayGrams)+'。全国平均('+formatGrams(SOFT_LIMIT_G)+')を超えたよ。ちょっと減らせないか考えてみよう。</div></div>';
    }
    return '<div class="warning soft">💡 <div>よごれ度が少しずつ上がってきているよ。分別の仕方を見直してみよう。</div></div>';
  }
  return '';
}

function renderMiniHud(){
  const pColor = pollutionColor(STATE.pollution);
  const ecoPct = Math.min(100, Math.round((STATE.eco/200)*100));
  const gaugePct = Math.min(100, Math.round((STATE.todayGrams/HARD_LIMIT_G)*100));
  const gaugeColor = STATE.todayGrams > HARD_LIMIT_G ? '#E4572E' : (STATE.todayGrams > SOFT_LIMIT_G ? '#F4B740' : '#3FB05A');
  return '' +
  '<div class="hud-row"><span class="hud-icon">🗑️</span>' +
    '<div class="hud-track"><div class="hud-fill" style="width:'+gaugePct+'%; background:'+gaugeColor+';"></div></div>' +
    '<span class="hud-val">'+formatGrams(STATE.todayGrams)+'</span></div>' +
  '<div class="hud-row"><span class="hud-icon">😷</span>' +
    '<div class="hud-track"><div class="hud-fill" style="width:'+STATE.pollution+'%; background:'+pColor+';"></div></div>' +
    '<span class="hud-val">'+Math.round(STATE.pollution)+'</span></div>' +
  '<div class="hud-row"><span class="hud-icon">♻️</span>' +
    '<div class="hud-track"><div class="hud-fill" style="width:'+ecoPct+'%; background:var(--marigold);"></div></div>' +
    '<span class="hud-val">'+Math.round(STATE.eco)+'</span></div>';
}

function renderSceneStats(){
  const pColor = pollutionColor(STATE.pollution);
  const ecoPct = Math.min(100, Math.round((STATE.eco/200)*100));
  const gaugePct = Math.min(100, Math.round((STATE.todayGrams/HARD_LIMIT_G)*100));
  const gaugeColor = STATE.todayGrams > HARD_LIMIT_G ? '#E4572E' : (STATE.todayGrams > SOFT_LIMIT_G ? '#F4B740' : '#3FB05A');
  const markerPct = Math.round((SOFT_LIMIT_G/HARD_LIMIT_G)*100);
  return '' +
  '<div class="stat-row">' +
    '<div class="stat-label"><span>今日出したゴミ</span><span>'+formatGrams(STATE.todayGrams)+'</span></div>' +
    '<div class="stat-track">' +
      '<div class="stat-fill" style="width:'+gaugePct+'%; background:'+gaugeColor+';"></div>' +
      '<div class="gauge-marker" style="left:'+markerPct+'%;"></div>' +
    '</div>' +
    '<div class="stat-caption">全国平均 '+formatGrams(SOFT_LIMIT_G)+'／日（環境省 令和5年度調べ）</div>' +
  '</div>' +
  '<div class="stat-row">' +
    '<div class="stat-label"><span>汚れ度</span><span>'+Math.round(STATE.pollution)+' / 100</span></div>' +
    '<div class="stat-track"><div class="stat-fill" style="width:'+STATE.pollution+'%; background:'+pColor+';"></div></div>' +
  '</div>' +
  '<div class="stat-row" style="margin-bottom:2px;">' +
    '<div class="stat-label"><span>リサイクル度</span><span>'+Math.round(STATE.eco)+' pt</span></div>' +
    '<div class="stat-track"><div class="stat-fill" style="width:'+ecoPct+'%; background:var(--marigold);"></div></div>' +
  '</div>';
}

function openStatsDetail(){
  document.getElementById('feedModalRoot').innerHTML =
    '<div class="feed-modal-overlay" id="statsDetailOverlay">' +
      '<div class="feed-modal-card" style="border-radius:24px; max-width:400px; margin:auto;">' +
        '<div class="feed-modal-header"><b>📊 いまのようす</b><button class="feed-modal-close" id="statsDetailClose">✕</button></div>' +
        renderSceneStats() +
        renderWarning() +
      '</div>' +
    '</div>';
  document.getElementById('statsDetailClose').addEventListener('click', closeFeedModal);
  document.getElementById('statsDetailOverlay').addEventListener('click', function(e){
    if (e.target.id === 'statsDetailOverlay') closeFeedModal();
  });
}

function renderGraph(){
  const values = WASTE_CATEGORIES.map(function(c){ return STATE.cycleBreakdown[c.id] || 0; });
  const max = Math.max(50, values.reduce(function(a,b){ return Math.max(a,b); }, 0));
  let cols = '';
  WASTE_CATEGORIES.forEach(function(c){
    const v = STATE.cycleBreakdown[c.id] || 0;
    const hPct = Math.round((v/max)*100);
    cols += '<div class="graph-col">' +
      '<div class="graph-count">'+formatGrams(v)+'</div>' +
      '<div class="graph-bar-track"><div class="graph-bar" style="height:'+hPct+'%; background:'+c.color+';"></div></div>' +
      '<div class="graph-icon">'+c.icon+'</div>' +
    '</div>';
  });
  return '<div class="graph-title"><span>このサイクルで出したごみ</span><b>合計 '+formatGrams(cycleTotal(STATE))+'</b></div>' +
    '<div class="graph">'+cols+'</div>';
}

function renderFeedButtons(){
  let html = '<div class="feed-grid">';
  WASTE_CATEGORIES.forEach(function(c){
    html += '<button class="feed-tile" data-cat="'+c.id+'" style="--tile-color:'+c.color+';">' +
      '<div class="feed-gram">+'+c.gramsPerClick+'g</div>' +
      '<div class="feed-icon">'+c.icon+'</div>' +
      '<b>'+c.label+'</b>' +
      '<span>'+c.sub+'</span>' +
    '</button>';
  });
  html += '</div>';
  return html;
}

/* ============================================================
   Feed modal (bottom sheet): graph + tiles + day-advance action
   ============================================================ */
function renderFeedModalBody(){
  const isLastDay = STATE.day >= CYCLE_DAYS;
  return '' +
    '<div class="scene-toast" id="toast"></div>' +
    renderGraph() +
    '<div style="height:14px;"></div>' +
    renderFeedButtons() +
    '<button class="primary-btn" id="nextDayBtn">'+(isLastDay ? '🌟 モンスターをかんせいさせる！' : '🌙 今日を終えて次の日へ')+'</button>';
}

function renderFeedModalShell(){
  return '' +
  '<div class="feed-modal-overlay" id="feedModalOverlay">' +
    '<div class="feed-modal-card">' +
      '<div class="feed-modal-header"><b>🍱 えさをあげる</b><button class="feed-modal-close" id="feedModalCloseBtn">✕</button></div>' +
      '<div id="feedModalBody">' + renderFeedModalBody() + '</div>' +
    '</div>' +
  '</div>';
}

function attachFeedModalBodyHandlers(){
  document.querySelectorAll('.feed-tile').forEach(function(btn){
    btn.addEventListener('click', function(){ onFeed(btn.getAttribute('data-cat')); });
  });
  document.getElementById('nextDayBtn').addEventListener('click', onNextDay);
}

function openFeedModal(){
  document.getElementById('feedModalRoot').innerHTML = renderFeedModalShell();
  attachFeedModalBodyHandlers();
  document.getElementById('feedModalCloseBtn').addEventListener('click', closeFeedModal);
  document.getElementById('feedModalOverlay').addEventListener('click', function(e){
    if (e.target.id === 'feedModalOverlay') closeFeedModal();
  });
}

function refreshFeedModalBody(){
  const body = document.getElementById('feedModalBody');
  if (!body) return; // modal not open
  body.innerHTML = renderFeedModalBody();
  attachFeedModalBodyHandlers();
}

function closeFeedModal(){
  document.getElementById('feedModalRoot').innerHTML = '';
}

function renderRaiseView(){
  const group = groupByIdx(STATE.groupIdx);
  const stage = stageForDay(STATE.day);
  const svg = monsterSVG(STATE, stage);
  const sceneSizePx = {0:200, 1:230, 2:260}[stage] || 260;
  const lvl = warningLevel(STATE);
  const warnBadge = STATE.isBadLocked ? '😷' : (lvl === 2 ? '⚠️' : (lvl === 1 ? '💡' : ''));

  const html = '' +
  '<div class="scene-panel">' +
    '<div class="scene-sky"></div>' +
    '<div class="scene-cloud sc1"></div>' +
    '<div class="scene-cloud sc2"></div>' +
    '<div class="scene-ground"></div>' +
    '<div class="scene-topbar">' +
      '<div class="mini-hud" id="miniHud">' +
        renderMiniHud() +
        (warnBadge ? '<div class="hud-warn-badge">'+warnBadge+'</div>' : '') +
      '</div>' +
      '<button class="scene-settings-btn" id="sceneSettingsBtn">⚙️</button>' +
    '</div>' +
    '<div class="scene-monster-area">' +
      '<div class="scene-monster-zone" id="sceneMonsterZone" style="width:'+sceneSizePx+'px; height:'+sceneSizePx+'px;">' + svg + '</div>' +
      '<div class="scene-caption">' +
        '<span class="scene-species">'+group.baby+'（'+STATE.day+'日目/'+CYCLE_DAYS+'日）</span>' +
        '<span class="scene-pips">'+renderDayPips()+'</span>' +
      '</div>' +
    '</div>' +
    '<div class="scene-actions">' +
      '<button class="big-action-btn" id="feedBigBtn"><span class="baticon">🍱</span>えさ<br>あげる</button>' +
      '<button class="big-action-btn" id="dexBigBtn"><span class="baticon">📖</span>ずかん</button>' +
    '</div>' +
  '</div>';

  document.getElementById('raiseView').innerHTML = html;
  attachRaiseHandlers();
}

function attachRaiseHandlers(){
  document.getElementById('feedBigBtn').addEventListener('click', openFeedModal);
  document.getElementById('dexBigBtn').addEventListener('click', function(){ setTab('dex'); });
  document.getElementById('miniHud').addEventListener('click', openStatsDetail);
  document.getElementById('sceneSettingsBtn').addEventListener('click', resetAll);
}

function renderLifetimeBanner(){
  const el = document.getElementById('lifetimeBanner');
  if (!el || !LIFETIME) return;
  const total = WASTE_CATEGORIES.reduce(function(sum,c){ return sum + (LIFETIME[c.id]||0); }, 0);
  el.innerHTML = '<span class="lb-icon">🗑️</span> これまでに出したごみ　<b>'+formatGrams(total)+'</b>';
}
