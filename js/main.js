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

async function onSortAnswer(itemId, categoryId){
  if (STATE.day > CYCLE_DAYS) return;
  const item = trashById(itemId);
  if (!item) return;
  const wasBad = STATE.isBadLocked;
  const correct = applySortedFeed(STATE, item, categoryId);
  LIFETIME[item.categoryId] = (LIFETIME[item.categoryId] || 0) + item.grams;
  recordDailyTrash(item.grams);

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
      '…そだて しっぱい',
      'No.' + hazSlot,
      'ごみを出しすぎたり、分別をまちがえすぎて、モンスターが「ハズレ」に変わってしまった…。育成はここで終わり。次はごみを減らして、正しく分別してみよう！',
      [
        { label:'このサイクルのごみ合計', value: formatGrams(total) }
      ],
      'bad',
      hazureArtHTML(gi),
      [{ text:'次のモンスターへ →', action: function(){
          closeModal();
          BAD_ALERT_SHOWN = false;
          STATE = freshState(finishedGroupIdx);
          flushPendingSave();
          saveGameData({ state: STATE, lifetime: LIFETIME });
          renderRaiseView();
          renderDexView();
        }, primary:true }]
    );
  });
}

async function onNextDay(){
  if (STATE.day < CYCLE_DAYS){
    const stageBefore = stageForDay(STATE.day);
    const enteringDay2 = STATE.day === 1;
    STATE.day += 1;
    STATE.todayGrams = 0;
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
  const placeholderName = 'No.' + finalSlot;
  const placeholderDesc = '相関図の'+finalSlot+'番のモンスター（画像はこれから当てはめ予定）';

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
  const eyebrow = tier === 'great' ? '🌟 かんぺき！' : (tier === 'normal' ? '🎉 完成！' : '…完成');

  // evolution flourish over the scene, then the reveal modal
  playEvolveEffect(function(){
    openModal(
      eyebrow,
      placeholderName,
      placeholderDesc,
      [
        { label:'このサイクルのごみ合計', value: formatGrams(total) },
        { label:'リサイクル度', value: Math.round(STATE.eco) + ' pt' }
      ],
      tier,
      monsterSVG(STATE, 3),
      [{ text:'次のモンスターへ →', action: function(){
          closeModal();
          BAD_ALERT_SHOWN = false;
          STATE = freshState(finishedGroupIdx);
          flushPendingSave();
          saveGameData({ state: STATE, lifetime: LIFETIME });
          renderRaiseView();
          renderDexView();
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

function resetAll(){
  openModal(
    '確認',
    'データをリセットしますか？',
    'これまで育てたモンスターの記録もすべて消えます。この操作は元に戻せません。',
    null, 'bad', null,
    [
      { text:'キャンセル', action: closeModal, primary:false },
      { text:'リセットする', action: performReset, primary:true }
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
}

function showIntro(){
  openModal(
    'はじめに',
    'ようこそ、ワケモンへ！',
    'ごみを分別して、選択式でモンスターに「餌」としてあげよう。うまく分別できるとすくすく育つよ。',
    null, 'good', null,
    [{ text:'あそびかたを見る', action: showIntro2, primary:true }]
  );
}
function showIntro2(){
  document.getElementById('modalRoot').innerHTML =
    '<div class="modal-overlay"><div class="modal-card">' +
      '<div class="modal-eyebrow">あそびかた</div>' +
      '<h2 class="good">4日間で1匹そだてよう</h2>' +
      '<ul class="intro-list">' +
        '<li>🍱 出てきたごみを選んで、どこに分別するかクイズに答えよう。正解すると上手に育つよ（実際のグラム数が加算される）</li>' +
        '<li>❌ 分別をまちがえるとよごれ度が上がるけど、正しい分別方法を教えてもらえるよ</li>' +
        '<li>⚖️ 全国平均「1人1日475g」（環境省調べ）を超えると警告、2倍(950g)に近づくと危険！</li>' +
        '<li>🌟 分別バッチリ・出しすぎなしなら「かんぺき」、ほどほどなら「ふつう」、出しすぎ＆分別ミスが重なると「はずれ」になるよ</li>' +
        '<li>📊 出したごみの量はグラム表示のグラフでいつでも確認できるよ</li>' +
        '<li>📖 4日たったら完成！ずかんに登録して次の子を育てよう</li>' +
      '</ul>' +
      '<button class="primary-btn" id="introCloseBtn">はじめる！</button>' +
    '</div></div>';
  document.getElementById('introCloseBtn').addEventListener('click', closeModal);
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

function dismissTitleScreen(){
  const el = document.getElementById('titleScreen');
  if (!el) return;
  el.classList.add('hide');
  if (PENDING_FIRST_RUN_INTRO){
    PENDING_FIRST_RUN_INTRO = false;
    setTimeout(showIntro, 350);
  }
}

function initTitleScreen(){
  const el = document.getElementById('titleScreen');
  if (!el) return;
  el.addEventListener('click', dismissTitleScreen, { once:true });
}

async function init(){
  initTitleScreen();
  document.getElementById('resetBtn').addEventListener('click', resetAll);

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
