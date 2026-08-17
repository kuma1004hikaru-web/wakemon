/* ============================================================
   ワケモン - ごみ分別モンスター育成ゲーム
   ============================================================ */

// gramsPerClick: typical real weight of one item (PET bottle, banana peel, etc.)
// pollutionPerItem: dirtiness added for ONE correctly sorted item of this
//   category. Deliberately not per-gram: sorting a heavy item correctly is
//   good behaviour and must never be punished — weight instead feeds the
//   daily quantity gauge (SOFT_LIMIT_G) and its overage penalty.
// ecoRate: recycling points per gram, so bulky recyclables are worth more.
const WASTE_CATEGORIES = [
  { id:'recycle',     label:'資源ごみ',   sub:'プラ・缶・びん',   icon:'♻️', color:'#3AA0C8',
    gramsPerClick:25, unit:'ペットボトル1本分', pollutionPerItem:0.5, ecoRate:0.16,
    tip:'細かく砕かれて服やバッグに生まれ変わるよ。' },
  { id:'paper',       label:'紙ごみ',     sub:'新聞・段ボール',   icon:'📄', color:'#D9A441',
    gramsPerClick:30, unit:'チラシ数枚分', pollutionPerItem:0.5, ecoRate:0.10,
    tip:'新しいダンボールやトイレットペーパーになるよ。' },
  { id:'compost',     label:'生ごみ',     sub:'食べ残し',        icon:'🍂', color:'#4C9A5A',
    gramsPerClick:40, unit:'野菜の皮', pollutionPerItem:0.5, ecoRate:0.075,
    tip:'堆肥（コンポスト）にすれば畑の栄養になるよ。' },
  { id:'burnable',    label:'燃えるごみ', sub:'汚れた紙など',    icon:'🔥', color:'#E4772E',
    gramsPerClick:20, unit:'汚れた紙', pollutionPerItem:2.5, ecoRate:0,
    tip:'食べ残しを減らすと、ごみを減らせるよ。' },
  { id:'nonburnable', label:'燃えないごみ・こわれもの', sub:'金属・陶器など', icon:'⚠️', color:'#8A8577',
    gramsPerClick:18, unit:'小さな金属くず', pollutionPerItem:3, ecoRate:0,
    tip:'直して長く使うことも考えてみよう。' },
];

// 環境省「一般廃棄物の排出及び処理状況等（令和5年度）」より
// 家庭から出るごみは全国平均で 1人1日あたり 475g（比べる目安として残す）
const AVG_G = 475;                // national average — reference line only
// 国の目標（第四次循環型社会形成推進基本計画）：家庭系ごみ 1人1日 440g
const TARGET_G = 440;             // the goal the player should stay under
const SOFT_LIMIT_G = TARGET_G;    // warnings and the gauge marker follow the goal
const HARD_LIMIT_G = AVG_G * 2;   // 2x the average (950g) — danger zone

// えさやりクイズに出てくる具体的なごみ。categoryId が正解の分別先で、
// grams はそのごみ1つぶんのだいたいの重さ。
const TRASH_ITEMS = [
  { id:'petbottle', name:'ペットボトル', icon:'🧴', grams:25,  categoryId:'recycle',
    hint:'キャップとラベルを外して資源ごみへ！服やバッグに生まれ変わるよ。' },
  { id:'can',       name:'あきかん',     icon:'🥫', grams:15,  categoryId:'recycle',
    hint:'軽くすすいで出そう。何度でも新しい缶になれるよ。' },
  { id:'bin',       name:'あきびん',     icon:'🍾', grams:200, categoryId:'recycle',
    hint:'びんはくり返し使えるリサイクルの優等生！' },
  { id:'newspaper', name:'しんぶんし',   icon:'📰', grams:100, categoryId:'paper',
    hint:'ひもでしばって紙ごみへ。トイレットペーパーになるよ。' },
  { id:'cardboard', name:'だんボール',   icon:'📦', grams:150, categoryId:'paper',
    hint:'たたんで重ねて紙ごみへ。新しいダンボールになるよ。' },
  { id:'flyer',     name:'チラシ1まい',  icon:'📄', grams:5,   categoryId:'paper',
    hint:'きれいな紙は紙ごみでリサイクルできるよ。' },
  { id:'leftover',  name:'たべのこし',   icon:'🍚', grams:150, categoryId:'compost',
    hint:'茶わん1ぱいで約150g。堆肥になるけど、残さず食べるのがいちばん！' },
  { id:'banana',    name:'バナナのかわ', icon:'🍌', grams:30,  categoryId:'compost',
    hint:'生ごみは水気をよく切ってから出そう。' },
  { id:'vegscraps', name:'やさいのくず', icon:'🥬', grams:50,  categoryId:'compost',
    hint:'コンポストに入れると畑の栄養になるよ。' },
  { id:'tissue',    name:'よごれたティッシュ', icon:'🧻', grams:10, categoryId:'burnable',
    hint:'汚れた紙はリサイクルできないから燃えるごみへ。' },
  { id:'snackbag',  name:'おかしのふくろ', icon:'🍬', grams:10, categoryId:'burnable',
    hint:'食べもので汚れたふくろは燃えるごみ。地域のルールも見てみよう。' },
  { id:'papercup',  name:'よごれた紙コップ', icon:'🥤', grams:10, categoryId:'burnable',
    hint:'汚れた紙コップは紙ごみにできないんだ。燃えるごみへ。' },
  { id:'brokencup', name:'われた茶わん', icon:'🍵', grams:250, categoryId:'nonburnable',
    hint:'割れものは新聞紙に包んで「キケン」と書いて出そう。' },
  { id:'umbrella',  name:'こわれたかさ', icon:'☂️', grams:400, categoryId:'nonburnable',
    hint:'金属の骨は燃えないごみ。直して長く使えたらもっといいね。' },
  { id:'battery',   name:'かんでんち',   icon:'🔋', grams:25,  categoryId:'nonburnable',
    hint:'電池は回収ボックスがある町も多いよ。お店で聞いてみよう。' },
];

function trashById(id){ return TRASH_ITEMS.find(function(t){ return t.id === id; }); }
