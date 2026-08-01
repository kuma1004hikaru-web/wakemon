// Kept intact but unused for now — old 5-species x 3-tier system. May be
// merged with the new branching-tree system once all artwork is ready.
const LEGACY_SPECIES = [
  { id:'forest', baby:'モリノコ', accessory:'leaf', color:'#3F8F5C',
    great:{ name:'リーフガーディアン', desc:'落ち葉や紙をほぼ資源に変えて育った、森の頂点に立つ精霊。' },
    normal:{ name:'コノハのせいれい', desc:'落ち葉や紙をそれなりに資源に変えて育った、森の小さな精霊。' },
    bad:{ name:'カレキゾンビ', desc:'ごみだらけの森で育ってしまい、元気をなくした姿。' } },
  { id:'river', baby:'シズクン', accessory:'fin', color:'#3AA0C8',
    great:{ name:'セイリュードラゴン', desc:'きれいな水のように澄んだうろこを持つ、伝説級のドラゴンに進化した。' },
    normal:{ name:'みずたまトカゲ', desc:'水をそこそこ大切にして育った、素朴なトカゲ。' },
    bad:{ name:'ヘドロン', desc:'たくさんのごみが流れ込み、どろどろになってしまった。' } },
  { id:'ocean', baby:'ウミノコ', accessory:'shell', color:'#2FB6A3',
    great:{ name:'サンゴエンジェル', desc:'サンゴ礁のように色とりどりの羽を持つ、海を守る天使に進化した。' },
    normal:{ name:'のんびりウミガメ', desc:'まずまず大切に育った、のんびり屋のウミガメ。' },
    bad:{ name:'プラゴミガメ', desc:'甲羅にプラスチックごみがからまってしまったカメ。' } },
  { id:'sky', baby:'ソラノコ', accessory:'cloud', color:'#6FB6E8',
    great:{ name:'クリーンウイング', desc:'澄みきった青空を飛ぶ、すがすがしい風の使いに進化した。' },
    normal:{ name:'ふわふわクラウド', desc:'ほどほどにきれいな空で育った、ふわふわの雲の子。' },
    bad:{ name:'スモッグバット', desc:'スモッグまみれの空をさまよう、うつむいたコウモリ。' } },
  { id:'earth', baby:'ツチノコ', accessory:'gem', color:'#D9A441',
    great:{ name:'ミネラルゴーレム', desc:'分別された資源が結晶になった、力強いゴーレムに進化した。' },
    normal:{ name:'つちだるま', desc:'そこそこ資源を大切にして育った、素朴などろんこ人形。' },
    bad:{ name:'サビサビロボ', desc:'金属くずをうまく再利用できず、錆びついてしまった。' } },
];

// ============================================================
// NEW branching evolution tree, matching the correlation diagram.
// Each "egg group" (Gp1 / Gp11 / Gp21) branches at day 2 into one of
// 3 mid-tier paths, then at day 4 completion into one of 2 finals per
// path. Numbers match the diagram's node numbers exactly, so real
// artwork can be dropped into the right slot later — every rendering
// of a monster also shows its slot number as a small badge for that
// reason.
// ============================================================
// Real uploaded artwork, keyed by correlation-diagram slot number. Falls
// back to the procedural placeholder monster if a slot has no custom art.
const CUSTOM_ART = {
  1:  'assets/art/slot-1.png',
  2:  'assets/art/slot-2.png',
  3:  'assets/art/slot-3.png',
  4:  'assets/art/slot-4.png',
  5:  'assets/art/slot-5.png',
  6:  'assets/art/slot-6.png',
  7:  'assets/art/slot-7.png',
  8:  'assets/art/slot-8.png',
  9:  'assets/art/slot-9.png',
  10: 'assets/art/slot-10.png',
  11: 'assets/art/slot-11.png',
  12: 'assets/art/slot-12.png',
  13: 'assets/art/slot-13.png',
  14: 'assets/art/slot-14.png',
  15: 'assets/art/slot-15.png',
  16: 'assets/art/slot-16.png',
  17: 'assets/art/slot-17.png',
  18: 'assets/art/slot-18.png',
  19: 'assets/art/slot-19.png',
  20: 'assets/art/slot-20.png',
  21: 'assets/art/slot-21.png',
  31: 'assets/art/slot-31.png',
  32: 'assets/art/slot-32.png',
};

// Name + blurb per slot. The dex, the completion modal and the scene caption
// all read from here, so a monster is identified by its name rather than its
// correlation-diagram number (the number stays as a small reference tag).
const MONSTER_INFO = {
  // ---- はっぱタイプ ----
  1:  { name:'はっぱのたまご', desc:'葉っぱがついた、みどりのたまご。紙や生ごみが とくいなモンスターが生まれる。' },
  2:  { name:'モリスラ',       desc:'落ち葉や紙をたべて育つ、森のスライム。まだどんな姿になるかわからない。' },
  3:  { name:'ホシノメ',       desc:'生ごみからめばえた小さな芽。あたまの星が げんきのしるし。' },
  4:  { name:'ハッパネコ',     desc:'葉っぱのしっぽをもつ森のネコ。ごみが多いと ごきげんななめ。' },
  5:  { name:'キノコノコ',     desc:'生ごみを土にかえしてくれる、赤いかさのキノコ。分別がうまくいくと元気に育つ。', rarity:2 },
  6:  { name:'モリノヌシ',     desc:'木の角と葉のたてがみをもつ、森のぬし。きれいに分別された資源だけで育つ。', rarity:4 },
  7:  { name:'ホシガメ',       desc:'こうらに星がうかぶ、のんびりやのカメ。ゆっくり ちゃんと分別する子のところに来る。', rarity:2 },
  8:  { name:'モリノチョウロウ', desc:'長い年月をかけて育った森の長老。つえをついて、ごみの分け方を教えてくれる。', rarity:3 },
  9:  { name:'ミツガシラオウ', desc:'三つの顔をもつ森のネコの王さま。王冠は 資源を大切にしたしるし。', rarity:4 },
  10: { name:'シゴトネコ',     desc:'スーツを着こなす まじめなネコ。きちんとしているけれど、ちょっと つかれぎみ。', rarity:1 },
  // ---- みずタイプ ----
  11: { name:'みずのたまご',   desc:'しずくもようの青いたまご。びんや かんが とくいなモンスターが生まれる。' },
  12: { name:'ボトルン',       desc:'水がはいったペットボトルのすがた。ちゃんと分別されると 資源に生まれかわる。' },
  13: { name:'ウキワアザラシ', desc:'うきわをかぶった あそびずきのアザラシ。海がきれいだと よろこぶ。' },
  14: { name:'カサクラゲ',     desc:'こわれたかさが 海にながれてクラゲになった。かさは 燃えないごみへ。' },
  15: { name:'ホシボトル',     desc:'ボトルの中で星が育っている、ふしぎなすがた。きれいな水の しるし。', rarity:2 },
  16: { name:'ヤドカリン',     desc:'すてられたボトルを やどにしたヤドカリ。本当は 貝がらの家がいいらしい。', rarity:1 },
  17: { name:'バケツアザラシ', desc:'赤いバケツがトレードマークのアザラシ。バケツは大事にながく使おう。', rarity:1 },
  18: { name:'アザラシキング', desc:'マントと王冠を身につけた海の王さま。きれいな海を おさめている。', rarity:4 },
  19: { name:'ミズキリン',     desc:'水色のもようをもつ 首の長いキリン。高いところから 海を見わたす。', rarity:3 },
  20: { name:'ホシトナカイ',   desc:'体に星がかがやくトナカイ。資源をたくさん集めた子のところにあらわれる。', rarity:3 },
  // ---- ほのおタイプ ----
  21: { name:'ほのおのたまご', desc:'炎につつまれた赤いたまご。もえるごみが とくいなモンスターが生まれる。' },
  22: { name:'ヒノコ',         desc:'小さな火をともす ほのおの子。まだ どんな姿になるかわからない。' },
  23: { name:'スミコロ',       desc:'もえたあとの炭から生まれた。まだ ほんのり あたたかい。' },
  24: { name:'ケムリノコ',     desc:'もやしたごみのけむりから生まれた。ごみを減らすと きえていく。' },
  25: { name:'フェニックス',   desc:'熱をエネルギーにかえて 生まれかわる鳥。ごみを資源にする力をもつ。', rarity:4 },
  26: { name:'マグマゴーレム', desc:'灰がかたまってできた 岩の体をもつモンスター。力もちで たよりになる。', rarity:3 },
  27: { name:'タイマツネコ',   desc:'しっぽの火で みんなをてらすネコ。火のあつかいは じょうず。', rarity:2 },
  28: { name:'ストーブベア',   desc:'おなかがストーブになっているクマ。ふゆは みんなが集まってくる。', rarity:2 },
  29: { name:'ハイフキドリ',   desc:'灰をまきちらしながら飛ぶ鳥。もやすごみが多いと あらわれる。', rarity:1 },
  30: { name:'スモッグドラゴン', desc:'けむりで空をよごしてしまうドラゴン。ごみを減らすと おとなしくなる。', rarity:3 },
  // ---- ハズレ ----
  31: { name:'カレボック',     desc:'ごみだらけの森で育ってしまい、かれてしまった木。次は ごみを減らしてみよう。' },
  32: { name:'ヘドロン',       desc:'よごれた水にしずんで どろどろになってしまった。正しく分別すれば 出会わずにすむ。' },
  33: { name:'モクモク',       desc:'もやしすぎて 空をよごすけむりのかたまり。もえるごみを減らすのが たいせつ。' },
};

function monsterName(slot){
  const info = MONSTER_INFO[slot];
  return info ? info.name : 'No.' + slot;
}
function monsterDesc(slot){
  const info = MONSTER_INFO[slot];
  return info ? info.desc : '';
}

/* ============================================================
   レア度 (rarity)
   ============================================================
   Only the 18 collectible finals carry a rarity. RARITY_PICK_WEIGHT
   scales how often each one is picked at cycle completion: a でんせつ
   monster is drawn far less often than a ふつう one even when the
   player sorts perfectly. Sorting behaviour still decides *which side*
   of the tree you land on — rarity only rescales within that. */
const RARITY_LABEL = { 1:'ふつう', 2:'めずらしい', 3:'レア', 4:'でんせつ' };
const RARITY_PICK_WEIGHT = { 1:1.0, 2:0.6, 3:0.3, 4:0.12 };

function rarityOf(slot){
  const info = MONSTER_INFO[slot];
  return (info && info.rarity) || 0;   // 0 = not a collectible final
}
function rarityLabel(slot){ return RARITY_LABEL[rarityOf(slot)] || ''; }

// Pick weight for a final, given how well this cycle was sorted
// (goodRatio 0..1). The rarer the monster, the more sorting skill moves
// the odds: at ratio 0.5 every monster sits on its base weight, good
// sorting multiplies でんせつ odds several times over, sloppy sorting
// nearly removes them. ふつう monsters are unaffected by skill.
function rarityWeight(slot, goodRatioValue){
  const rar = rarityOf(slot);
  if (!rar) return 1;
  const base = RARITY_PICK_WEIGHT[rar] || 1;
  const r = (typeof goodRatioValue === 'number') ? goodRatioValue : 0.5;
  const skill = Math.pow(0.4 + 1.2 * r, rar - 1);
  return base * skill;
}
function rarityStars(slot){
  const r = rarityOf(slot);
  if (!r) return '';
  return '★'.repeat(r) + '☆'.repeat(4 - r);
}

// Friendly type names per egg-group shape. Used by the dex chapters and the
// egg picker shown before a new monster is raised.
const GROUP_META = {
  forest: { icon:'🍃', label:'はっぱタイプ', blurb:'紙や生ごみが とくい' },
  river:  { icon:'💧', label:'みずタイプ',  blurb:'びん・かんが とくい' },
  earth:  { icon:'🔥', label:'ほのおタイプ', blurb:'もえるごみが とくい' },
};

const EGG_GROUPS = [
  { id:'gp1',  slot:1,  baby:'たまご(1)',  color:'#3F8F5C', accessory:'leaf', shape:'forest' },
  { id:'gp11', slot:11, baby:'たまご(11)', color:'#3AA0C8', accessory:'fin',  shape:'river' },
  { id:'gp21', slot:21, baby:'たまご(21)', color:'#D9A441', accessory:'gem',  shape:'earth' },
];

// Per group: 3 paths (mid-tier, chosen at day2), each with 2 finals
// (chosen at day4 completion). Order matters: index 0 is the path/final
// favored by good sorting, index 2 (paths) / index 1 (finals) is favored
// by messy/overfed behavior.
const PATH_LAYOUT = [
  [ { slot:2,  finals:[5,6]   }, { slot:3,  finals:[7,8]   }, { slot:4,  finals:[9,10]  } ],
  [ { slot:12, finals:[15,16] }, { slot:13, finals:[17,18] }, { slot:14, finals:[19,20] } ],
  [ { slot:22, finals:[25,26] }, { slot:23, finals:[27,28] }, { slot:24, finals:[29,30] } ],
];

// ハズレ（育成失敗）モンスター。進化ツリーには入らない、タイプごとの
// 失敗枠。並びは EGG_GROUPS と同じ（はっぱ / みず / ほのお）。育成中に
// よごれ度が最大に達すると、そのタイプのハズレに変わって育成が終了する。
const HAZURE_SLOTS = [31, 32, 33];
function hazureSlotForGroup(gi){ return HAZURE_SLOTS[gi]; }
