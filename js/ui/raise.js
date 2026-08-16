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
    return '<div class="warning hard">😷 <div>'+t('warn.locked')+'</div></div>';
  }
  if (lvl === 2){
    if (overDouble){
      return '<div class="warning hard">⚠️ <div>'+t('warn.hardOver', { g: formatGrams(STATE.todayGrams), limit: formatGrams(HARD_LIMIT_G) })+'</div></div>';
    }
    return '<div class="warning hard">⚠️ <div>'+t('warn.hardDirty')+'</div></div>';
  }
  if (lvl === 1){
    if (overAvg){
      return '<div class="warning soft">💡 <div>'+t('warn.softOver', { g: formatGrams(STATE.todayGrams), limit: formatGrams(SOFT_LIMIT_G) })+'</div></div>';
    }
    return '<div class="warning soft">💡 <div>'+t('warn.softDirty')+'</div></div>';
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
    '<div class="stat-label"><span>'+t('stats.today')+'</span><span>'+formatGrams(STATE.todayGrams)+'</span></div>' +
    '<div class="stat-track">' +
      '<div class="stat-fill" style="width:'+gaugePct+'%; background:'+gaugeColor+';"></div>' +
      '<div class="gauge-marker" style="left:'+markerPct+'%;"></div>' +
    '</div>' +
    '<div class="stat-caption">'+t('stats.avgCaption', { g: formatGrams(SOFT_LIMIT_G) })+'</div>' +
  '</div>' +
  '<div class="stat-row">' +
    '<div class="stat-label"><span>'+t('stats.pollution')+'</span><span>'+Math.round(STATE.pollution)+' / 100</span></div>' +
    '<div class="stat-track"><div class="stat-fill" style="width:'+STATE.pollution+'%; background:'+pColor+';"></div></div>' +
  '</div>' +
  '<div class="stat-row" style="margin-bottom:2px;">' +
    '<div class="stat-label"><span>'+t('stats.recycle')+'</span><span>'+Math.round(STATE.eco)+' pt</span></div>' +
    '<div class="stat-track"><div class="stat-fill" style="width:'+ecoPct+'%; background:var(--marigold);"></div></div>' +
  '</div>';
}

function openStatsDetail(){
  document.getElementById('feedModalRoot').innerHTML =
    '<div class="feed-modal-overlay" id="statsDetailOverlay">' +
      '<div class="feed-modal-card" style="border-radius:24px; max-width:400px; margin:auto;">' +
        '<div class="feed-modal-header"><b>'+t('stats.title')+'</b><button class="feed-modal-close" id="statsDetailClose">✕</button></div>' +
        renderSceneStats() +
        renderWarning() +
      '</div>' +
    '</div>';
  document.getElementById('statsDetailClose').addEventListener('click', closeFeedModal);
  document.getElementById('statsDetailOverlay').addEventListener('click', function(e){
    if (e.target.id === 'statsDetailOverlay') closeFeedModal();
  });
}

/* ============================================================
   Language picker: shown once on the very first run, and any time
   from the ⚙️ button. Re-renders every visible screen on change.
   ============================================================ */
function renderLangPicker(showBack){
  let cards = '';
  LANGS.forEach(function(l){
    cards += '<button class="lang-card'+(l.code === LANG ? ' current' : '')+'" data-lang="'+l.code+'">' +
      '<b>'+l.label+'</b><span>'+l.sub+'</span>' +
    '</button>';
  });
  return '' +
    '<div class="egg-pick-overlay lang-overlay" id="langPickOverlay">' +
      '<div class="egg-pick-title">'+t('lang.title')+'</div>' +
      '<div class="egg-pick-sub">'+t('lang.sub')+'</div>' +
      '<div class="lang-grid">'+cards+'</div>' +
      (showBack ? '<button class="shuffle-btn" id="langCloseBtn">'+t('common.close')+'</button>' : '') +
    '</div>';
}

let LANG_PICKER_NEXT = null;   // what to run once the picker is dismissed

function openLangPicker(next){
  LANG_PICKER_NEXT = next || null;
  document.getElementById('modalRoot').innerHTML = renderLangPicker(true);
  document.querySelectorAll('.lang-card').forEach(function(btn){
    btn.addEventListener('click', function(){ applyLang(btn.getAttribute('data-lang')); });
  });
  document.getElementById('langCloseBtn').addEventListener('click', function(){
    closeModal();
    const n = LANG_PICKER_NEXT; LANG_PICKER_NEXT = null;
    if (n) n();
  });
}

// Swap language and repaint everything currently on screen, keeping the
// picker open so the change is visible before continuing.
function applyLang(code){
  setLang(code);
  applyStaticText();
  renderRaiseView();
  renderLifetimeBanner();
  renderTitleMonster();
  if (ACTIVE_TAB === 'dex') renderDexView();
  openLangPicker(LANG_PICKER_NEXT);
}

// Fill the bits of markup that live in index.html.
function applyStaticText(){
  document.querySelectorAll('[data-i18n]').forEach(function(el){
    el.innerHTML = t(el.getAttribute('data-i18n'));
  });
  document.querySelectorAll('[data-i18n-title]').forEach(function(el){
    el.setAttribute('title', t(el.getAttribute('data-i18n-title')));
  });
}

/* ============================================================
   Egg picker: shown before a new monster starts so the player
   chooses which type to raise instead of getting a random one.
   ============================================================ */
function renderEggPicker(){
  let cards = '';
  EGG_GROUPS.forEach(function(g, gi){
    const meta = GROUP_META[g.shape] || { icon:'❔' };
    const art = customArtHTML(g.slot) || eggSVG(g.color, null);
    cards += '<button class="egg-card" data-egg="'+gi+'">' +
      '<div class="egg-card-art">'+art+'</div>' +
      '<b>'+meta.icon+' '+tType(g.shape,'label')+'</b>' +
      '<span>'+tType(g.shape,'blurb')+'</span>' +
    '</button>';
  });
  return '' +
    '<div class="egg-pick-overlay" id="eggPickOverlay">' +
      '<div class="egg-pick-title">'+t('egg.title')+'</div>' +
      '<div class="egg-pick-sub">'+t('egg.sub')+'</div>' +
      '<div class="egg-grid">'+cards+'</div>' +
    '</div>';
}

function openEggPicker(){
  document.getElementById('modalRoot').innerHTML = renderEggPicker();
  document.querySelectorAll('.egg-card').forEach(function(btn){
    btn.addEventListener('click', function(){
      chooseEgg(parseInt(btn.getAttribute('data-egg'), 10));
    });
  });
}

// Only interrupt when a fresh monster is still waiting on a choice;
// otherwise see whether the calendar rolled the day forward while away.
function maybeShowEggPicker(){
  if (STATE && !STATE.eggChosen){ openEggPicker(); return; }
  setTimeout(maybeAutoAdvanceDay, 200);
}

/* ============================================================
   Weekly trash log: bar chart of grams per real calendar day for
   the last 7 days, with the national-average line for scale.
   ============================================================ */
function weekBarColor(v){
  if (v > HARD_LIMIT_G) return '#E4572E';
  if (v > SOFT_LIMIT_G) return '#F4B740';
  return '#3FB05A';
}

function renderWeeklyChart(){
  const keys = lastNDateKeys(7);
  const values = keys.map(function(k){ return DAILY_LOG[k] || 0; });
  const maxV = values.reduce(function(a,b){ return Math.max(a,b); }, SOFT_LIMIT_G) * 1.15;
  const avgPct = Math.round((SOFT_LIMIT_G / maxV) * 100);

  let cols = '';
  keys.forEach(function(k, i){
    const v = values[i];
    const hPct = Math.max(v > 0 ? 3 : 0, Math.round((v / maxV) * 100));
    const parts = k.split('-');
    const label = parseInt(parts[1], 10) + '/' + parseInt(parts[2], 10);
    const isToday = i === keys.length - 1;
    cols += '<div class="week-col'+(isToday ? ' today' : '')+'">' +
      '<div class="week-val">'+(v > 0 ? formatGrams(v) : '－')+'</div>' +
      '<div class="week-bar-track"><div class="week-bar" style="height:'+hPct+'%; background:'+weekBarColor(v)+';"></div></div>' +
      '<div class="week-day">'+(isToday ? t('week.today') : label)+'</div>' +
    '</div>';
  });

  return '' +
    '<div class="week-chart">' +
      '<div class="week-avg-line" style="bottom:'+avgPct+'%;"><span>'+t('week.avg', { g: formatGrams(SOFT_LIMIT_G) })+'</span></div>' +
      cols +
    '</div>' +
    '<div class="stat-caption">'+AVG_SOURCE_LABEL+'</div>';
}

function openWeeklyLog(){
  document.getElementById('feedModalRoot').innerHTML =
    '<div class="feed-modal-overlay" id="weeklyLogOverlay">' +
      '<div class="feed-modal-card" style="border-radius:24px; max-width:400px; margin:auto;">' +
        '<div class="feed-modal-header"><b>'+t('week.title')+'</b><button class="feed-modal-close" id="weeklyLogClose">✕</button></div>' +
        renderWeeklyChart() +
        '<div class="week-note">'+t('week.note')+'</div>' +
      '</div>' +
    '</div>';
  document.getElementById('weeklyLogClose').addEventListener('click', closeFeedModal);
  document.getElementById('weeklyLogOverlay').addEventListener('click', function(e){
    if (e.target.id === 'weeklyLogOverlay') closeFeedModal();
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
  return '<div class="graph-title"><span>'+t('feed.graphTitle')+'</span><b>'+t('feed.total', { g: formatGrams(cycleTotal(STATE)) })+'</b></div>' +
    '<div class="graph">'+cols+'</div>';
}

/* ------------------------------------------------------------
   Feed sorting quiz state: a few concrete trash items are offered
   ("which trash came out?"), then the player picks which category
   it belongs to. Correct -> normal feed + eco. Wrong -> pollution
   penalty + the right answer is shown.
   ------------------------------------------------------------ */
let FEED_PICK = [];       // current random trash choices
let FEED_SELECTED = null; // item id being sorted, or null (pick mode)
let FEED_RESULT = null;   // { correct, item } feedback from the last answer

function rollFeedPick(){
  const pool = TRASH_ITEMS.slice();
  for (let i = pool.length - 1; i > 0; i--){
    const j = Math.floor(Math.random() * (i + 1));
    const t = pool[i]; pool[i] = pool[j]; pool[j] = t;
  }
  FEED_PICK = pool.slice(0, 4);
}

function renderTrashButtons(){
  let html = '<div class="trash-grid">';
  FEED_PICK.forEach(function(item){
    // neutral tile color so the button itself doesn't leak the answer
    html += '<button class="feed-tile" data-trash="'+item.id+'" style="--tile-color:#8A8577;">' +
      '<div class="feed-gram">'+item.grams+'g</div>' +
      '<div class="feed-icon">'+item.icon+'</div>' +
      '<b>'+tTrash(item,'name')+'</b>' +
      '<span>'+t('feed.where')+'</span>' +
    '</button>';
  });
  html += '</div>';
  return html;
}

function renderSortCategoryButtons(){
  let html = '<div class="feed-grid">';
  WASTE_CATEGORIES.forEach(function(c){
    html += '<button class="feed-tile" data-sort-cat="'+c.id+'" style="--tile-color:'+c.color+';">' +
      '<div class="feed-icon">'+c.icon+'</div>' +
      '<b>'+tCat(c,'label')+'</b>' +
      '<span>'+tCat(c,'sub')+'</span>' +
    '</button>';
  });
  html += '</div>';
  return html;
}

function renderSortFeedback(){
  if (!FEED_RESULT) return '';
  const item = FEED_RESULT.item;
  const cat = catById(item.categoryId);
  const vars = { name: tTrash(item,'name'), cat: tCat(cat,'label'), hint: tTrash(item,'hint') };
  if (FEED_RESULT.correct){
    return '<div class="sort-feedback good"><span>⭕</span><div><b>'+t('feed.correctHead')+'</b>' +
      t('feed.correctBody', vars) + '</div></div>';
  }
  return '<div class="sort-feedback bad"><span>❌</span><div><b>'+t('feed.wrongHead')+'</b>' +
    t('feed.wrongBody', vars) + '</div></div>';
}

/* ============================================================
   Feed modal (bottom sheet): graph + tiles + day-advance action
   ============================================================ */
function renderFeedModalBody(){
  const isLastDay = STATE.day >= CYCLE_DAYS;

  // step 2: category question for the chosen trash item
  if (FEED_SELECTED){
    const item = trashById(FEED_SELECTED);
    return '' +
      '<div class="sort-question">' +
        '<div class="sort-item-big">'+item.icon+'</div>' +
        '<div class="pick-title">'+t('feed.sortQ', { name: tTrash(item,'name'), g: item.grams })+'</div>' +
      '</div>' +
      renderSortCategoryButtons() +
      '<button class="back-btn sort-back" id="sortBackBtn">'+t('feed.other')+'</button>';
  }

  // step 1: which trash came out?
  return '' +
    '<div class="scene-toast" id="toast"></div>' +
    renderSortFeedback() +
    '<div class="pick-title">'+t('feed.pick')+'</div>' +
    renderTrashButtons() +
    '<button class="shuffle-btn" id="shuffleTrashBtn">'+t('feed.shuffle')+'</button>' +
    '<div style="height:12px;"></div>' +
    renderGraph() +
    renderNextDayButton(isLastDay);
}

// One real day = one game day: the button only unlocks once the calendar
// date has moved on (or always, in ?dev=1 test mode).
function renderNextDayButton(isLastDay){
  const ready = canAdvanceDay(STATE);
  const label = ready
    ? (isLastDay ? t('feed.finish') : t('feed.nextDay')) + (DEV_MODE ? ' ⏩' : '')
    : t('feed.waitTomorrow');
  return '<button class="primary-btn'+(ready ? '' : ' waiting')+'" id="nextDayBtn"'+(ready ? '' : ' disabled')+'>' +
    label + '</button>' +
    (ready ? '' : '<div class="wait-note">'+t('feed.waitNote')+'</div>');
}

function renderFeedModalShell(){
  return '' +
  '<div class="feed-modal-overlay" id="feedModalOverlay">' +
    '<div class="feed-modal-card">' +
      '<div class="feed-modal-header"><b>'+t('feed.title')+'</b><button class="feed-modal-close" id="feedModalCloseBtn">✕</button></div>' +
      '<div id="feedModalBody">' + renderFeedModalBody() + '</div>' +
    '</div>' +
  '</div>';
}

function attachFeedModalBodyHandlers(){
  document.querySelectorAll('[data-trash]').forEach(function(btn){
    btn.addEventListener('click', function(){
      FEED_SELECTED = btn.getAttribute('data-trash');
      refreshFeedModalBody();
    });
  });
  document.querySelectorAll('[data-sort-cat]').forEach(function(btn){
    btn.addEventListener('click', function(){
      onSortAnswer(FEED_SELECTED, btn.getAttribute('data-sort-cat'));
    });
  });
  const backBtn = document.getElementById('sortBackBtn');
  if (backBtn) backBtn.addEventListener('click', function(){
    FEED_SELECTED = null;
    refreshFeedModalBody();
  });
  const shuffleBtn = document.getElementById('shuffleTrashBtn');
  if (shuffleBtn) shuffleBtn.addEventListener('click', function(){
    rollFeedPick();
    FEED_RESULT = null;
    refreshFeedModalBody();
  });
  const nextBtn = document.getElementById('nextDayBtn');
  if (nextBtn && !nextBtn.disabled) nextBtn.addEventListener('click', onNextDay);
}

function openFeedModal(){
  rollFeedPick();
  FEED_SELECTED = null;
  FEED_RESULT = null;
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
  // Size the monster relative to the actual screen so it fills a tall phone
  // instead of floating small in a big empty scene. Grows with each stage.
  const stageScale = {0:0.82, 1:0.92, 2:1.0}[stage] || 1.0;
  const sizeCap = Math.min(window.innerWidth * 0.82, window.innerHeight * 0.42);
  const sceneSizePx = Math.round(sizeCap * stageScale);
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
        '<span class="scene-species">'+tMon(currentSlot(STATE),'name')+t('scene.day', { day: STATE.day, total: CYCLE_DAYS })+'</span>' +
        '<span class="scene-pips">'+renderDayPips()+'</span>' +
      '</div>' +
    '</div>' +
    '<div class="scene-actions">' +
      '<button class="action-item" id="feedBigBtn">' +
        '<img class="action-icon" src="assets/ui/icon-feed.png" alt="" />' +
        '<span>'+t('scene.feed')+'</span></button>' +
      '<button class="action-item" id="dexBigBtn">' +
        '<img class="action-icon" src="assets/ui/icon-dex.png" alt="" />' +
        '<span>'+t('scene.dex')+'</span></button>' +
      '<button class="action-item" id="logBigBtn">' +
        '<img class="action-icon" src="assets/ui/icon-log.png" alt="" />' +
        '<span>'+t('scene.log')+'</span></button>' +
      '<button class="action-item" id="searchBigBtn">' +
        '<img class="action-icon" src="assets/ui/icon-search.png" alt="" />' +
        '<span>'+t('scene.search')+'</span></button>' +
    '</div>' +
  '</div>';

  document.getElementById('raiseView').innerHTML = html;
  attachRaiseHandlers();
}

function attachRaiseHandlers(){
  document.getElementById('feedBigBtn').addEventListener('click', openFeedModal);
  document.getElementById('dexBigBtn').addEventListener('click', function(){ setTab('dex'); });
  document.getElementById('logBigBtn').addEventListener('click', openWeeklyLog);
  document.getElementById('miniHud').addEventListener('click', openStatsDetail);
  document.getElementById('sceneSettingsBtn').addEventListener('click', openSettings);
  document.getElementById('searchBigBtn').addEventListener('click', function(){ openSearch(false); });
}

/* ------------------------------------------------------------
   Evolution effect: white flash + sparkles over the scene while the
   monster bounces, then `done` runs (typically a re-render showing
   the new form, or the completion modal).
   ------------------------------------------------------------ */
function playEvolveEffect(done){
  const panel = document.querySelector('.scene-panel');
  const zone = document.getElementById('sceneMonsterZone');
  if (!panel || !zone){ done(); return; }
  const overlay = document.createElement('div');
  overlay.className = 'evo-overlay';
  let html = '<div class="evo-flash"></div>';
  for (let i = 0; i < 7; i++){
    html += '<span class="evo-star" style="left:'+(10 + i*12)+'%; top:'+(30 + ((i*23)%34))+'%; animation-delay:'+(i*0.09)+'s;">✨</span>';
  }
  overlay.innerHTML = html;
  panel.appendChild(overlay);
  zone.classList.add('evolving');
  setTimeout(function(){
    overlay.remove();
    zone.classList.remove('evolving');
    done();
  }, 1400);
}

function renderLifetimeBanner(){
  const el = document.getElementById('lifetimeBanner');
  if (!el || !LIFETIME) return;
  const total = WASTE_CATEGORIES.reduce(function(sum,c){ return sum + (LIFETIME[c.id]||0); }, 0);
  el.innerHTML = '<span class="lb-icon">🗑️</span> '+t('scene.lifetime')+'　<b>'+formatGrams(total)+'</b>';
}
