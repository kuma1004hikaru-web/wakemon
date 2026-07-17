/* ============================================================
   ワケモン - ごみ分別モンスター育成ゲーム
   ============================================================ */

// gramsPerClick: typical real weight of one item (PET bottle, banana peel, etc.)
// pollutionRate / ecoRate: impact per gram, calibrated so a day matching the
// national average composition (see AVG_DAY_COMPOSITION_G below) yields
// moderate, non-fatal pollution — worse-than-average sorting or quantity
// is what tips a monster into its "bad" form.
const WASTE_CATEGORIES = [
  { id:'recycle',     label:'資源ごみ',   sub:'プラ・缶・びん',   icon:'♻️', color:'#3AA0C8',
    gramsPerClick:25, unit:'ペットボトル1本分', pollutionRate:0.02, ecoRate:0.16,
    tip:'細かく砕かれて服やバッグに生まれ変わるよ。' },
  { id:'paper',       label:'紙ごみ',     sub:'新聞・段ボール',   icon:'📄', color:'#D9A441',
    gramsPerClick:30, unit:'チラシ数枚分', pollutionRate:0.02, ecoRate:0.10,
    tip:'新しいダンボールやトイレットペーパーになるよ。' },
  { id:'compost',     label:'生ごみ',     sub:'食べ残し',        icon:'🍂', color:'#4C9A5A',
    gramsPerClick:40, unit:'野菜の皮', pollutionRate:0.00, ecoRate:0.075,
    tip:'堆肥（コンポスト）にすれば畑の栄養になるよ。' },
  { id:'burnable',    label:'燃えるごみ', sub:'汚れた紙など',    icon:'🔥', color:'#E4772E',
    gramsPerClick:20, unit:'汚れた紙', pollutionRate:0.15, ecoRate:0,
    tip:'食べ残しを減らすと、ごみを減らせるよ。' },
  { id:'nonburnable', label:'燃えないごみ・こわれもの', sub:'金属・陶器など', icon:'⚠️', color:'#8A8577',
    gramsPerClick:18, unit:'小さな金属くず', pollutionRate:0.25, ecoRate:0,
    tip:'直して長く使うことも考えてみよう。' },
];

// 環境省「一般廃棄物の排出及び処理状況等（令和5年度）」より
// 家庭から出るごみは全国平均で 1人1日あたり 475g
const SOFT_LIMIT_G = 475;         // national average (household waste, per person/day)
const HARD_LIMIT_G = SOFT_LIMIT_G * 2; // 2x average — danger zone
const AVG_SOURCE_LABEL = '環境省(令和5年度)調べ：家庭ごみの全国平均は1人1日475g';
