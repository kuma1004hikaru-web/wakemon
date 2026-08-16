/* ============================================================
   Game actions
   ============================================================ */
function showToast(text){
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = text;
  toast.classList.add('show');
  if (TOAST_TIMER) clearTimeout(TOAST_TIMER);
  TOAST_TIMER = setTimeout(function(){ toast.classList.remove('show'); }, 2600);
}

function chooseEgg(groupIdx){
  if (!EGG_GROUPS[groupIdx]) return;
  STATE.groupIdx = groupIdx;
  STATE.eggChosen = true;
  closeModal();
  flushPendingSave();
  saveGameData({ state: STATE, lifetime: LIFETIME });
  renderRaiseView();
  renderTitleMonster();
}

// Feed straight from the dictionary. The player already looked the answer
// up, so it counts as a correct sort and runs through exactly the same
// rules as the quiz — same grams, dirtiness and recycling points.
async function onFeedFromDict(dictItem, btn){
  if (!canFeedNow() || !dictCanFeed(dictItem)) return;
  const item = dictToTrash(dictItem);
  const wasBad = STATE.isBadLocked;

  applySortedFeed(STATE, item, item.categoryId);
  LIFETIME[item.categoryId] = (LIFETIME[item.categoryId] || 0) + item.grams;
  recordDailyTrash(item.grams);
  ensureDayDate(STATE);

  scheduleSaveGameData();
  renderRaiseView();
  renderLifetimeBanner();

  // show the result on the card itself rather than closing the dictionary
  if (btn){
    const row = btn.parentElement;
    row.innerHTML = '<span class="dict-fed">'+t('search.fed', { g: item.grams })+'</span>';
  }

  if (!wasBad && STATE.isBadLocked){
    closeSearch();
    flushPendingSave();
    await failCycle();
  }
}

async function onSortAnswer(itemId, categoryId){
  if (STATE.day > CYCLE_DAYS) return;
  const item = trashById(itemId);
  if (!item) return;
  const wasBad = STATE.isBadLocked;
  const correct = applySortedFeed(STATE, item, categoryId);
  LIFETIME[item.categoryId] = (LIFETIME[item.categoryId] || 0) + item.grams;
  recordDailyTrash(item.grams);
  ensureDayDate(STATE);   // the game-day starts counting from the first feed

  // back to the pick screen with fresh choices + feedback banner
  FEED_SELECTED = null;
  FEED_RESULT = { correct: correct, item: item };
  rollFeedPick();

  // Failure: pollution just maxed out → the run ends right now and the
  // monster turns into this type's ハズレ (No.31/32/33).
  if (!wasBad && STATE.isBadLocked){
    flushPendingSave();
    renderLifetimeBanner();
    await failCycle();
    return;
  }

  scheduleSaveGameData();
  renderRaiseView();
  refreshFeedModalBody();
  renderLifetimeBanner();
}

async function failCycle(){
  closeFeedModal();
  const gi = STATE.groupIdx;
  const hazSlot = hazureSlotForGroup(gi);
  const key = 'slot' + hazSlot;
  if (!COLLECTION[key]){
    COLLECTION[key] = { count: 0, firstDate: new Date().toISOString() };
  }
  COLLECTION[key].count += 1;
  flushPendingSave();
  await saveCollection(COLLECTION);

  const total = cycleTotal(STATE);
  const finishedGroupIdx = gi;

  renderRaiseView(); // show the current monster, then break it down with the effect
  playEvolveEffect(function(){
    openModal(
      t('result.fail'),
      tMon(hazSlot,'name'),
      tMon(hazSlot,'desc') + ' ' + t('result.failTail'),
      [
        { label:t('result.cycleTotal'), value: formatGrams(total) }
      ],
      'bad',
      hazureArtHTML(gi),
      [{ text:t('result.next'), action: function(){
          closeModal();
          BAD_ALERT_SHOWN = false;
          STATE = freshState(finishedGroupIdx);
          flushPendingSave();
          saveGameData({ state: STATE, lifetime: LIFETIME });
          renderRaiseView();
          renderDexView();
          setTimeout(maybeShowEggPicker, 250); // pick the next egg
        }, primary:true }]
    );
  });
}

// Opening the app on a new calendar date rolls the day forward on its own,
// so nobody has to remember to press a button. One open = at most one day,
// so being away a week just resumes rather than skipping the whole cycle.
async function maybeAutoAdvanceDay(){
  if (!STATE || !STATE.eggChosen) return;
  if (!realDateChanged(STATE)) return;
  await onNextDay();
}

async function onNextDay(){
  // One real day = one game day. Until the calendar date changes the
  // button is disabled, so this is just a safety net.
  if (!canAdvanceDay(STATE)) return;

  if (STATE.day < CYCLE_DAYS){
    const stageBefore = stageForDay(STATE.day);
    const enteringDay2 = STATE.day === 1;
    STATE.day += 1;
    STATE.todayGrams = 0;
    STATE.dayDate = todayKey();
    if (enteringDay2 && STATE.pathIndex === null){
      resolvePathBranch(STATE);
    }
    flushPendingSave();
    await saveGameData({ state: STATE, lifetime: LIFETIME });
    closeFeedModal();
    if (stageForDay(STATE.day) > stageBefore){
      // the monster grows into a new stage: play the effect over the old
      // look, then re-render to reveal the new form
      playEvolveEffect(function(){ renderRaiseView(); });
    } else {
      renderRaiseView();
    }
  } else {
    await finishCycle();
  }
}

async function finishCycle(){
  closeFeedModal();
  // Normally failure ends the run mid-feed; this covers a save that was
  // already maxed out before reaching day 4.
  if (STATE.isBadLocked){ await failCycle(); return; }
  if (STATE.pathIndex === null) resolvePathBranch(STATE); // safety net
  resolveFinalBranch(STATE);

  const group = groupByIdx(STATE.groupIdx);
  const finalSlot = currentSlot(STATE);
  const tier = tierForPath(STATE.pathIndex);
  const key = 'slot' + finalSlot;
  const finalName = tMon(finalSlot,'name');
  const finalDesc = tMon(finalSlot,'desc');

  if (!COLLECTION[key]){
    COLLECTION[key] = { count: 0, firstDate: new Date().toISOString() };
  }
  COLLECTION[key].count += 1;
  // Also register the 2〜3日目 (mid-tier) form this cycle grew through, so it
  // stops being a dex silhouette once actually raised.
  const midSlot = PATH_LAYOUT[STATE.groupIdx][STATE.pathIndex].slot;
  const midKey = 'slot' + midSlot;
  if (!COLLECTION[midKey]){
    COLLECTION[midKey] = { count: 0, firstDate: new Date().toISOString() };
  }
  COLLECTION[midKey].count += 1;
  flushPendingSave();
  await saveCollection(COLLECTION);

  const total = cycleTotal(STATE);
  const finishedGroupIdx = STATE.groupIdx;
  const eyebrow = rarityStars(finalSlot) + ' ' + tRarityLabel(rarityOf(finalSlot));

  // evolution flourish over the scene, then the reveal modal
  playEvolveEffect(function(){
    openModal(
      eyebrow,
      finalName,
      finalDesc,
      [
        { label:t('result.rarity'), value: tRarityLabel(rarityOf(finalSlot)) },
        { label:t('result.cycleTotal'), value: formatGrams(total) },
        { label:t('stats.recycle'), value: Math.round(STATE.eco) + ' pt' }
      ],
      tier,
      monsterSVG(STATE, 3),
      [{ text:t('result.next'), action: function(){
          closeModal();
          BAD_ALERT_SHOWN = false;
          STATE = freshState(finishedGroupIdx);
          flushPendingSave();
          saveGameData({ state: STATE, lifetime: LIFETIME });
          renderRaiseView();
          renderDexView();
          setTimeout(maybeShowEggPicker, 250); // pick the next egg
        }, primary:true }]
    );
  });
}

/* ============================================================
   Tabs / reset / init
   ============================================================ */
function setTab(tab){
  ACTIVE_TAB = tab;
  document.getElementById('raiseView').style.display = tab === 'raise' ? 'block' : 'none';
  // flex (not block) so the dex book can stretch to the full screen height —
  // an inline "block" here would override the stylesheet's flex layout.
  document.getElementById('dexView').style.display = tab === 'dex' ? 'flex' : 'none';
  document.body.classList.toggle('raise-fullscreen', tab === 'raise');
  document.body.classList.toggle('dex-fullscreen', tab === 'dex');
  if (tab === 'dex') renderDexView();
  if (tab === 'raise') renderRaiseView();
}

// ⚙️ opens a small settings menu (language / reset) instead of jumping
// straight to the destructive reset confirm.
function openSettings(){
  openModal(
    '⚙️',
    t('lang.settings'),
    '',
    null, 'good', null,
    [
      { text: t('lang.settings'), action: function(){ openLangPicker(null); }, primary:true },
      { text: t('common.settings'), action: resetAll, primary:false },
      { text: t('common.close'), action: closeModal, primary:false }
    ]
  );
}

function resetAll(){
  openModal(
    t('reset.title'),
    t('reset.q'),
    t('reset.body'),
    null, 'bad', null,
    [
      { text:t('common.cancel'), action: closeModal, primary:false },
      { text:t('reset.do'), action: performReset, primary:true }
    ]
  );
}

async function performReset(){
  closeModal();
  flushPendingSave();
  deleteAllSaves();
  STATE = freshState(null);
  LIFETIME = emptyBreakdown();
  COLLECTION = {};
  DAILY_LOG = {};
  BAD_ALERT_SHOWN = false;
  await saveGameData({ state: STATE, lifetime: LIFETIME });
  await saveCollection(COLLECTION);
  renderRaiseView();
  renderDexView();
  renderLifetimeBanner();
  setTimeout(maybeShowEggPicker, 250); // start over by picking an egg
}

function showIntro(){
  openModal(
    t('intro.eyebrow'),
    t('intro.title'),
    t('intro.body'),
    null, 'good', null,
    [{ text:t('intro.see'), action: showIntro2, primary:true }]
  );
}
function showIntro2(){
  document.getElementById('modalRoot').innerHTML =
    '<div class="modal-overlay"><div class="modal-card">' +
      '<div class="modal-eyebrow">'+t('howto.eyebrow')+'</div>' +
      '<h2 class="good">'+t('howto.title')+'</h2>' +
      '<ul class="intro-list">' +
        '<li>'+t('howto.1')+'</li>' +
        '<li>'+t('howto.2')+'</li>' +
        '<li>'+t('howto.3')+'</li>' +
        '<li>'+t('howto.4')+'</li>' +
        '<li>'+t('howto.5')+'</li>' +
        '<li>'+t('howto.6')+'</li>' +
      '</ul>' +
      '<button class="primary-btn" id="introCloseBtn">'+t('howto.start')+'</button>' +
    '</div></div>';
  document.getElementById('introCloseBtn').addEventListener('click', function(){
    closeModal();
    // first run: straight from "how to play" into picking the first egg
    setTimeout(maybeShowEggPicker, 200);
  });
}

function normalizeState(s){
  const fresh = freshState(null);
  const merged = Object.assign({}, fresh, s || {});
  merged.cycleBreakdown = Object.assign({}, fresh.cycleBreakdown, (s && s.cycleBreakdown) || {});
  if (typeof merged.todayGrams !== 'number' || isNaN(merged.todayGrams)) merged.todayGrams = 0;
  if (typeof merged.pollution !== 'number' || isNaN(merged.pollution)) merged.pollution = 0;
  if (typeof merged.sortPollution !== 'number' || isNaN(merged.sortPollution)) merged.sortPollution = 0;
  if (typeof merged.eco !== 'number' || isNaN(merged.eco)) merged.eco = 0;
  if (typeof merged.groupIdx !== 'number' || !EGG_GROUPS[merged.groupIdx]) merged.groupIdx = fresh.groupIdx;
  // Saves made before the egg picker existed have no flag — treat those runs
  // as already started so they aren't interrupted by the picker.
  if (!(s && typeof s.eggChosen === 'boolean')) merged.eggChosen = true;
  // Saves from before real-day pacing have no dayDate. Treat their current
  // day as having started yesterday so the player is not made to wait.
  if (!(s && typeof s.dayDate === 'string')) merged.dayDate = null;
  if (typeof merged.pathIndex !== 'number' || merged.pathIndex < 0 || merged.pathIndex > 2) merged.pathIndex = (merged.pathIndex === null ? null : fresh.pathIndex);
  if (typeof merged.finalIndex !== 'number' || merged.finalIndex < 0 || merged.finalIndex > 1) merged.finalIndex = (merged.finalIndex === null ? null : fresh.finalIndex);
  return merged;
}

function renderTitleMonster(){
  const stage = document.getElementById('titleMonsterStage');
  const wrap = document.getElementById('titleMonsterWrap');
  if (!stage || !wrap || !STATE) return;
  stage.innerHTML = monsterSVG(STATE, stageForDay(STATE.day));
  requestAnimationFrame(function(){ wrap.classList.add('ready'); });
}

let PENDING_FIRST_RUN_INTRO = false;
let PENDING_LANG_CHOICE = false;   // true until a language has ever been picked

function dismissTitleScreen(){
  const el = document.getElementById('titleScreen');
  if (!el) return;
  el.classList.add('hide');
  // First run order: language → how to play → egg picker.
  const afterLang = function(){
    if (PENDING_FIRST_RUN_INTRO){
      PENDING_FIRST_RUN_INTRO = false;
      setTimeout(showIntro, 250);
    } else {
      setTimeout(maybeShowEggPicker, 250);
    }
  };
  if (PENDING_LANG_CHOICE){
    PENDING_LANG_CHOICE = false;
    setTimeout(function(){ openLangPicker(afterLang); }, 350);
  } else {
    setTimeout(afterLang, 350);
  }
}

function initTitleScreen(){
  const el = document.getElementById('titleScreen');
  if (!el) return;
  el.addEventListener('click', dismissTitleScreen, { once:true });
}

async function init(){
  // ?dev=1 unlocks the next-day button so a whole 4-day cycle can be
  // tested in one sitting. The public URL stays on real-day pacing.
  try{
    DEV_MODE = new URLSearchParams(location.search).get('dev') === '1';
  }catch(e){ DEV_MODE = false; }

  const savedLang = loadLang();
  if (savedLang) setLang(savedLang);
  PENDING_LANG_CHOICE = !savedLang;
  applyStaticText();

  initTitleScreen();
  document.getElementById('resetBtn').addEventListener('click', openSettings);

  const saved = await loadGameData();
  const savedCollection = await loadCollection();
  const isFirstRun = !saved;

  if (saved && saved.state){
    STATE = normalizeState(saved.state);
    LIFETIME = Object.assign(emptyBreakdown(), saved.lifetime || {});
  } else {
    STATE = freshState(null);
    LIFETIME = emptyBreakdown();
  }
  COLLECTION = savedCollection || {};
  DAILY_LOG = loadDailyLog();
  BAD_ALERT_SHOWN = STATE.isBadLocked; // don't re-trigger alert on reload

  if (!saved){
    await saveGameData({ state: STATE, lifetime: LIFETIME });
  }

  renderRaiseView();
  renderDexView();
  renderLifetimeBanner();
  renderTitleMonster();
  setTab('raise');

  if (isFirstRun){
    PENDING_FIRST_RUN_INTRO = true;
  }
}

window.addEventListener('DOMContentLoaded', init);

if ('serviceWorker' in navigator){
  window.addEventListener('load', function(){
    navigator.serviceWorker.register('sw.js').catch(function(e){
      console.warn('Service Worker registration failed:', e);
    });
  });
}
