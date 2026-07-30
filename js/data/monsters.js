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
  8:  'assets/art/slot-8.png',
  9:  'assets/art/slot-9.png',
  10: 'assets/art/slot-10.png',
  11: 'assets/art/slot-11.png',
  12: 'assets/art/slot-12.png',
  13: 'assets/art/slot-13.png',
  15: 'assets/art/slot-15.png',
  16: 'assets/art/slot-16.png',
  17: 'assets/art/slot-17.png',
  18: 'assets/art/slot-18.png',
  20: 'assets/art/slot-20.png',
  21: 'assets/art/slot-21.png',
  31: 'assets/art/slot-31.png',
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
