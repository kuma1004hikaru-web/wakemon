
const POLLUTION_CAP = 100;
const CYCLE_DAYS = 4;
// "sortPollution" tracks pollution from category mix alone (no overage-for-
// quantity penalty). Cycles that never hit the pollution cap are split into
// great/normal using this cleaner signal, since the quantity-overage penalty
// compounds hard across 4 days and would otherwise swamp the comparison.
const GREAT_TIER_MAX = 25;


function catById(id){ return WASTE_CATEGORIES.find(function(c){ return c.id === id; }); }
function groupByIdx(idx){ return EGG_GROUPS[idx]; }

function emptyBreakdown(){
  const o = {};
  WASTE_CATEGORIES.forEach(function(c){ o[c.id] = 0; });
  return o;
}

function randomGroupIdx(excludeIdx){
  const pool = [0,1,2].filter(function(i){ return i !== excludeIdx; });
  const list = pool.length ? pool : [0,1,2];
  return list[Math.floor(Math.random() * list.length)];
}

function freshState(prevGroupIdx){
  return {
    day: 1,
    todayGrams: 0,
    cycleBreakdown: emptyBreakdown(),
    pollution: 0,
    sortPollution: 0,
    eco: 0,
    isBadLocked: false,
    // groupIdx starts on a random type so every render has something valid to
    // draw, but the player picks the real one in the egg picker before
    // feeding starts (eggChosen flips to true once they do).
    groupIdx: randomGroupIdx(prevGroupIdx),
    eggChosen: false,
    pathIndex: null,
    finalIndex: null,
    // Real calendar date this game-day started on. One real day = one game
    // day, so the cycle only moves forward when the date actually changes.
    dayDate: null,
  };
}

/* ============================================================
   実際の日付で1日を数える
   ============================================================
   dayDate holds the real date the current game-day began. It is filled
   in lazily on first feed/open so a monster picked at 23:59 does not
   burn its whole day. DEV_MODE (?dev=1) bypasses the wait for testing. */
let DEV_MODE = false;

function todayKey(){ return dateKeyOf(new Date()); }

function ensureDayDate(state){
  if (!state.dayDate){ state.dayDate = todayKey(); return true; }
  return false;
}

// True when the real date has moved past the day this game-day started.
// Ignores DEV_MODE — this is the honest calendar check used to decide
// whether to roll the day forward automatically.
function realDateChanged(state){
  return !!state.dayDate && state.dayDate !== todayKey();
}

// Whether the "next day" button may be pressed. Dev mode unlocks it so a
// whole cycle can be tested without waiting for real days to pass.
function canAdvanceDay(state){
  if (DEV_MODE) return true;
  return realDateChanged(state);
}

// Ratio of "good" (recycle/paper/compost) grams within a breakdown object,
// used to weight the branch decisions. Neutral 0.5 if nothing fed yet.
function goodRatio(breakdown){
  const good = (breakdown.recycle||0) + (breakdown.paper||0) + (breakdown.compost||0);
  const total = WASTE_CATEGORIES.reduce(function(s,c){ return s + (breakdown[c.id]||0); }, 0);
  if (total <= 0) return 0.5;
  return good / total;
}

function weightedPick(weights){
  const total = weights.reduce(function(a,b){ return a+b; }, 0);
  let r = Math.random() * total;
  for (let i=0;i<weights.length;i++){
    if (r < weights[i]) return i;
    r -= weights[i];
  }
  return weights.length - 1;
}

// How rare a whole path feels: the mean of its two finals' pick weights.
// Used so a path leading to two でんせつ monsters is itself less likely.
function pathRarityWeight(groupIdx, pathIndex, r){
  const finals = PATH_LAYOUT[groupIdx][pathIndex].finals;
  return (rarityWeight(finals[0], r) + rarityWeight(finals[1], r)) / 2;
}

// Called exactly at the day1->day2 transition (cycleBreakdown at this
// moment reflects day1 only). Behaviour picks the side of the tree,
// rarity rescales how often each side actually comes up.
function resolvePathBranch(state){
  if (state.isBadLocked){ state.pathIndex = 2; return; }
  const r = goodRatio(state.cycleBreakdown);
  const gi = state.groupIdx;
  const w0 = (15 + 70*r)     * pathRarityWeight(gi, 0, r);  // favored by good day-1 sorting
  const w1 = 35              * pathRarityWeight(gi, 1, r);  // steady middle option
  const w2 = (15 + 70*(1-r)) * pathRarityWeight(gi, 2, r);  // favored by messy day-1 sorting
  state.pathIndex = weightedPick([w0, w1, w2]);
}

// Called at cycle completion. Uses the whole cycle's ratio to weight
// between the 2 finals under whichever path was chosen at day 2, then
// scales each by its rarity.
function resolveFinalBranch(state){
  if (state.isBadLocked){ state.finalIndex = 1; return; }
  const r = goodRatio(state.cycleBreakdown);
  const finals = PATH_LAYOUT[state.groupIdx][state.pathIndex].finals;
  const base0 = 20 + 60*r;
  const w0 = base0         * rarityWeight(finals[0], r);
  const w1 = (100 - base0) * rarityWeight(finals[1], r);
  state.finalIndex = weightedPick([w0, w1]);
}

function currentSlot(state){
  if (state.pathIndex === null) return groupByIdx(state.groupIdx).slot;
  const path = PATH_LAYOUT[state.groupIdx][state.pathIndex];
  if (state.finalIndex === null) return path.slot;
  return path.finals[state.finalIndex];
}

// Extra pollution for the portion of today's total that falls between
// the national average and 2x average, and a steeper rate beyond that.
// Applied only to the slice of *this* feed's grams that crosses each
// bracket, so a single large feed is charged correctly even if it
// straddles a threshold.
function overagePollution(beforeGrams, afterGrams){
  let extra = 0;
  const seg1Start = Math.max(beforeGrams, SOFT_LIMIT_G), seg1End = Math.min(afterGrams, HARD_LIMIT_G);
  if (seg1End > seg1Start) extra += (seg1End - seg1Start) * 0.045;
  const seg2Start = Math.max(beforeGrams, HARD_LIMIT_G), seg2End = afterGrams;
  if (seg2End > seg2Start) extra += (seg2End - seg2Start) * 0.12;
  return extra;
}

// Flat cost of one wrong answer, so a mistake on a 5g flyer and on a 400g
// umbrella teach the same lesson. About 10 mistakes fill the gauge. The
// trash still counts toward its true category either way; a miss only
// adds this penalty and forfeits the eco points.
const MISSORT_PENALTY = 10;

function applySortedFeed(state, item, chosenCategoryId){
  const cat = catById(item.categoryId);
  const grams = item.grams;
  const correct = chosenCategoryId === item.categoryId;
  state.cycleBreakdown[item.categoryId] = (state.cycleBreakdown[item.categoryId] || 0) + grams;
  const before = state.todayGrams;
  const after = before + grams;
  state.todayGrams = after;
  if (correct) state.eco += grams * cat.ecoRate;
  const baseGain = cat.pollutionPerItem + (correct ? 0 : MISSORT_PENALTY);
  state.sortPollution += baseGain;
  let gain = baseGain;
  gain += overagePollution(before, after);
  state.pollution = Math.min(POLLUTION_CAP, state.pollution + gain);
  if (state.pollution >= POLLUTION_CAP) state.isBadLocked = true;
  return correct;
}

// Which of the 3 final forms a completed cycle earns.
function resultTier(state){
  if (state.isBadLocked) return 'bad';
  if (state.sortPollution <= GREAT_TIER_MAX) return 'great';
  return 'normal';
}

function warningLevel(state){
  if (state.todayGrams > HARD_LIMIT_G || state.pollution >= 85) return 2;
  if (state.todayGrams > SOFT_LIMIT_G || state.pollution >= 60) return 1;
  return 0;
}

function cycleTotal(state){
  return WASTE_CATEGORIES.reduce(function(sum,c){ return sum + (state.cycleBreakdown[c.id]||0); }, 0);
}

function formatGrams(g){
  return Math.round(g).toLocaleString('ja-JP') + 'g';
}

/* ============================================================
   App state (in memory, mirrors storage)
   ============================================================ */
let STATE = null;         // current cycle state
let LIFETIME = null;      // lifetime waste totals
let COLLECTION = {};      // dex entries
let DAILY_LOG = {};       // grams fed per real calendar day (weekly chart)
let ACTIVE_TAB = 'raise';
let TOAST_TIMER = null;
let BAD_ALERT_SHOWN = false;

function collectionKey(speciesId, form){ return speciesId + '_' + form; }

/* ============================================================
   Daily trash log (real calendar days, for the weekly chart)
   ============================================================ */
function dateKeyOf(d){
  const m = String(d.getMonth() + 1);
  const day = String(d.getDate());
  return d.getFullYear() + '-' + (m.length < 2 ? '0' + m : m) + '-' + (day.length < 2 ? '0' + day : day);
}

// The last n calendar days as keys, oldest first, ending today.
function lastNDateKeys(n){
  const keys = [];
  const now = new Date();
  for (let i = n - 1; i >= 0; i--){
    const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() - i);
    keys.push(dateKeyOf(d));
  }
  return keys;
}

function recordDailyTrash(grams){
  const key = dateKeyOf(new Date());
  DAILY_LOG[key] = (DAILY_LOG[key] || 0) + grams;
  // keep the log from growing forever — 30 days is plenty for the chart
  const keys = Object.keys(DAILY_LOG).sort();
  while (keys.length > 30){
    delete DAILY_LOG[keys.shift()];
  }
  saveDailyLog(DAILY_LOG);
}
