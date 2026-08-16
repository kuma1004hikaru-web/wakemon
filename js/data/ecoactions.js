/* ============================================================
   エコアクション（ごみを"出さなかった"行動）
   ============================================================
   ゲーム本編は「ごみを入れる」ことで進むので、現実で目指したい
   「ごみを減らす」と向きが逆になりがち。ここでチェックした行動は
   ごみを増やさずにリサイクルpだけを増やすので、減らすほど良く
   育つ、という関係になる。

   p … もらえるリサイクルポイント
   ============================================================ */
const ECO_ACTIONS = [
  { id:'mybag',    icon:'🛍️', p:15 },
  { id:'bottle',   icon:'🥤', p:15 },
  { id:'finish',   icon:'🍚', p:10 },
  { id:'refill',   icon:'🧴', p:10 },
  { id:'repair',   icon:'🔧', p:20 },
  { id:'separate', icon:'♻️', p:10 },
];

const ECO_KEY = 'wakemon-eco';

/* ------------------------------------------------------------
   保存の形
   { done: { 'YYYY-MM-DD': ['mybag','bottle'] }, streak: n, best: n }
   ------------------------------------------------------------ */
function loadEco(){
  try{
    const raw = localStorage.getItem(ECO_KEY);
    const o = raw ? JSON.parse(raw) : null;
    return (o && typeof o === 'object') ? { done: o.done || {}, streak: o.streak || 0, best: o.best || 0 } : { done:{}, streak:0, best:0 };
  }catch(e){ return { done:{}, streak:0, best:0 }; }
}
function saveEco(eco){
  try{ localStorage.setItem(ECO_KEY, JSON.stringify(eco)); }catch(e){}
}

function ecoDoneToday(){
  return (ECO_DATA.done[todayKey()] || []).slice();
}
function ecoIsDone(id){
  return ecoDoneToday().indexOf(id) >= 0;
}

// 連続日数：今日からさかのぼって、1つでもチェックした日が続いた数。
// 今日まだ何もしていなくても、昨日までの記録は途切れさせない。
function ecoStreak(){
  let n = 0;
  const d = new Date();
  const list = ECO_DATA.done[todayKey()] || [];
  if (!list.length) d.setDate(d.getDate() - 1);   // 今日はこれからでもOK
  for (let i = 0; i < 400; i++){
    const key = dateKeyOf(d);
    if ((ECO_DATA.done[key] || []).length) { n++; d.setDate(d.getDate() - 1); }
    else break;
  }
  return n;
}

// チェックのオン/オフ。オンにしたぶんだけリサイクルpが増える
// （オフに戻してもポイントは減らさない＝ずるの余地はあるが、
//  子ども向けなので押し間違いをとがめない方をとった）。
function ecoToggle(id){
  const key = todayKey();
  const list = (ECO_DATA.done[key] || []).slice();
  const at = list.indexOf(id);
  let gained = 0;
  if (at >= 0){
    list.splice(at, 1);
  } else {
    list.push(id);
    const act = ECO_ACTIONS.find(function(a){ return a.id === id; });
    gained = act ? act.p : 0;
  }
  ECO_DATA.done[key] = list;

  // 30日より古い記録は捨てる
  const keys = Object.keys(ECO_DATA.done).sort();
  while (keys.length > 30) delete ECO_DATA.done[keys.shift()];

  ECO_DATA.streak = ecoStreak();
  if (ECO_DATA.streak > ECO_DATA.best) ECO_DATA.best = ECO_DATA.streak;
  saveEco(ECO_DATA);
  return gained;
}

/* ============================================================
   現実のものへの換算
   ============================================================
   だいたいの目安。数字が実感に変わると人に話したくなる。 */
const ECO_EQUIV = [
  { id:'toiletroll', icon:'🧻', from:'paper',   per:400  },  // 紙400g ≒ トイレットペーパー1ロール
  { id:'petbottle',  icon:'🥤', from:'recycle', per:25   },  // 資源25g ≒ ペットボトル1本
  { id:'compostbag', icon:'🌱', from:'compost', per:1000 },  // 生ごみ1kg ≒ 堆肥バケツ1つ
];

function ecoEquivalents(){
  return ECO_EQUIV.map(function(e){
    const grams = (LIFETIME && LIFETIME[e.from]) || 0;
    return { id:e.id, icon:e.icon, n: Math.floor(grams / e.per), grams: grams };
  }).filter(function(e){ return e.n > 0; });
}

/* ============================================================
   先週とくらべる
   ============================================================ */
function weekAverage(offsetWeeks){
  const now = new Date();
  let sum = 0, days = 0;
  for (let i = 0; i < 7; i++){
    const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() - i - offsetWeeks * 7);
    const v = DAILY_LOG[dateKeyOf(d)];
    if (typeof v === 'number'){ sum += v; days++; }
  }
  return days ? { avg: sum / days, days: days } : null;
}

// 今週と先週の平均をくらべる。どちらかに記録が無ければ null。
function weekComparison(){
  const now = weekAverage(0), prev = weekAverage(1);
  if (!now || !prev) return null;
  return { now: now.avg, prev: prev.avg, diff: prev.avg - now.avg };
}

let ECO_DATA = { done:{}, streak:0, best:0 };
