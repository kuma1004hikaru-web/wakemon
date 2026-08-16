/* ============================================================
   ごみのじてん（検索 + そのまま えさやり）
   ============================================================
   name … 表示名（漢字あり）
   kana … ひらがな読み。検索とひらがなモードの表示に使う
   alt  … 別の言い方（検索でだけ使う。表示しない）
   cat  … WASTE_CATEGORIES の id、または 'special'
   g    … 1つぶんのだいたいの重さ(g)。えさにするときに使う
   tip  … ひとことアドバイス

   よごれ度とリサイクルpは、この g とカテゴリから自動で決まる：
     よごれ度 = カテゴリの pollutionPerItem（+ 出しすぎ分）
     リサイクルp = g × カテゴリの ecoRate
   ゲーム本編のえさやりとまったく同じ計算なので、じてんから
   あげても数字がズレない。

   'special' は5分別のどれにも入らないもの（家電・危険物など）。
   モンスターのえさにはできないので g を持たせていない。
   分別ルールは市区町村で違うので、画面に注意書きを出している。
   ============================================================ */
const DICT_SPECIAL = { id:'special', icon:'🏪', color:'#7C6BB0' };

const DICT_ITEMS = [
  /* ---------------- 資源ごみ ---------------- */
  { name:'ペットボトル', g:25, kana:'ぺっとぼとる', cat:'recycle', tip:'キャップとラベルを外して、中をゆすいでね。' },
  { name:'ペットボトルのキャップ', g:2, kana:'ぺっとぼとるのきゃっぷ', alt:'ふた', cat:'recycle', tip:'本体と分けて出そう。集めている学校もあるよ。' },
  { name:'ペットボトルのラベル', g:1, kana:'ぺっとぼとるのらべる', cat:'recycle', tip:'はがしてプラスチックの資源へ。' },
  { name:'あきかん', g:15, kana:'あきかん', alt:'空き缶 かん アルミ缶 スチール缶', cat:'recycle', tip:'軽くすすいでね。何度でも新しい缶になれるよ。' },
  { name:'あきびん', g:200, kana:'あきびん', alt:'空き瓶 びん ガラスびん', cat:'recycle', tip:'すすいでから。ふたは外して別に出そう。' },
  { name:'びんのふた（金属）', g:5, kana:'びんのふた', cat:'recycle', tip:'金属のふたは資源。町のルールも見てみよう。' },
  { name:'プラスチックのトレー', g:8, kana:'ぷらすちっくのとれー', alt:'とれい 食品トレー', cat:'recycle', tip:'洗って乾かしてね。お店に回収箱があることも。' },
  { name:'おかしの空き箱（プラ）', g:5, kana:'おかしのあきばこ', cat:'recycle', tip:'プラマークがついていたら資源プラへ。' },
  { name:'シャンプーのボトル', g:60, kana:'しゃんぷーのぼとる', alt:'詰め替え容器', cat:'recycle', tip:'中を洗って出そう。' },
  { name:'洗剤の容器', g:50, kana:'せんざいのようき', cat:'recycle', tip:'中身を使い切って、洗ってから。' },
  { name:'たまごのパック', g:15, kana:'たまごのぱっく', cat:'recycle', tip:'洗って乾かせば資源プラ。' },
  { name:'牛乳パック', g:30, kana:'ぎゅうにゅうぱっく', alt:'紙パック', cat:'recycle', tip:'洗って開いて乾かす。スーパーの回収箱が便利！' },
  { name:'ビニール袋', g:3, kana:'びにーるぶくろ', alt:'レジ袋 ポリ袋', cat:'recycle', tip:'きれいならプラ資源、汚れていたら燃えるごみ。' },
  { name:'カップめんの容器', g:12, kana:'かっぷめんのようき', cat:'recycle', tip:'洗ってから。汚れが落ちなければ燃えるごみへ。' },
  { name:'ヨーグルトの容器', g:8, kana:'よーぐるとのようき', cat:'recycle', tip:'洗って乾かしてね。' },
  { name:'ペットボトルのケース', g:20, kana:'ぺっとぼとるのけーす', cat:'recycle', tip:'プラスチックの資源へ。' },
  { name:'発泡スチロール', g:20, kana:'はっぽうすちろーる', alt:'はっぽうスチロール', cat:'recycle', tip:'きれいなら資源プラ。汚れていたら燃えるごみへ。' },

  /* ---------------- 紙ごみ ---------------- */
  { name:'しんぶんし', g:100, kana:'しんぶんし', alt:'新聞紙 新聞', cat:'paper', tip:'ひもでしばって出そう。トイレットペーパーになるよ。' },
  { name:'ざっし', g:300, kana:'ざっし', alt:'雑誌 マンガ 本', cat:'paper', tip:'ひもでしばってね。' },
  { name:'だんボール', g:150, kana:'だんぼーる', alt:'段ボール ダンボール', cat:'paper', tip:'たたんで重ねてね。新しいダンボールになるよ。' },
  { name:'チラシ', g:5, kana:'ちらし', alt:'広告', cat:'paper', tip:'きれいな紙は立派な資源。' },
  { name:'紙袋', g:20, kana:'かみぶくろ', cat:'paper', tip:'持ち手が紙でなければ外してね。' },
  { name:'ノート', g:120, kana:'のーと', cat:'paper', tip:'金具（リング）は外して燃えないごみへ。' },
  { name:'コピー用紙', g:5, kana:'こぴーようし', alt:'プリント', cat:'paper', tip:'雑がみとしてまとめて出せるよ。' },
  { name:'ティッシュの箱', g:30, kana:'てぃっしゅのはこ', cat:'paper', tip:'取り出し口のビニールは外してね。' },
  { name:'おかしの紙箱', g:15, kana:'おかしのかみばこ', cat:'paper', tip:'きれいなら紙ごみ（雑がみ）へ。' },
  { name:'封筒', g:5, kana:'ふうとう', cat:'paper', tip:'ビニールの窓は外してね。' },
  { name:'トイレットペーパーの芯', g:5, kana:'といれっとぺーぱーのしん', cat:'paper', tip:'雑がみでリサイクルできるよ。' },
  { name:'包装紙', g:10, kana:'ほうそうし', cat:'paper', tip:'きれいなら紙ごみへ。' },

  /* ---------------- 生ごみ ---------------- */
  { name:'たべのこし', g:150, kana:'たべのこし', alt:'食べ残し 残飯', cat:'compost', tip:'水気をよく切ってね。残さず食べるのがいちばん！' },
  { name:'やさいのくず', g:50, kana:'やさいのくず', alt:'野菜くず 皮', cat:'compost', tip:'コンポストにすると畑の栄養になるよ。' },
  { name:'くだものの皮', g:40, kana:'くだもののかわ', alt:'みかんの皮 りんごの皮', cat:'compost', tip:'水気を切って出そう。' },
  { name:'バナナのかわ', g:30, kana:'ばななのかわ', cat:'compost', tip:'生ごみとして出そう。' },
  { name:'たまごのから', g:6, kana:'たまごのから', alt:'卵の殻', cat:'compost', tip:'生ごみへ。細かくすると土に還りやすいよ。' },
  { name:'魚のほね', g:30, kana:'さかなのほね', alt:'骨', cat:'compost', tip:'水気を切って生ごみへ。' },
  { name:'お茶がら', g:20, kana:'おちゃがら', alt:'茶殻 コーヒーかす', cat:'compost', tip:'よく絞ってから出そう。' },
  { name:'パンのみみ', g:20, kana:'ぱんのみみ', cat:'compost', tip:'食べきれるとうれしいね。' },

  /* ---------------- 燃えるごみ ---------------- */
  { name:'よごれたティッシュ', g:10, kana:'よごれたてぃっしゅ', alt:'ちり紙 鼻紙', cat:'burnable', tip:'汚れた紙はリサイクルできないんだ。' },
  { name:'よごれた紙コップ', g:10, kana:'よごれたかみこっぷ', cat:'burnable', tip:'洗えないものは燃えるごみへ。' },
  { name:'おかしのふくろ', g:10, kana:'おかしのふくろ', alt:'スナック菓子の袋', cat:'burnable', tip:'食べもので汚れた袋は燃えるごみ。' },
  { name:'ピザの箱', g:120, kana:'ぴざのはこ', cat:'burnable', tip:'油やチーズがついた紙はリサイクルできないよ。' },
  { name:'紙おむつ', g:150, kana:'かみおむつ', alt:'おむつ', cat:'burnable', tip:'汚れを取ってから出そう。' },
  { name:'マスク', g:3, kana:'ますく', cat:'burnable', tip:'袋に入れて出すと安心だね。' },
  { name:'わりばし', g:8, kana:'わりばし', alt:'割り箸', cat:'burnable', tip:'木でできているので燃えるごみ。' },
  { name:'つまようじ', g:1, kana:'つまようじ', cat:'burnable', tip:'先が危ないので紙に包んでね。' },
  { name:'ゴム', g:5, kana:'ごむ', alt:'輪ゴム 消しゴム', cat:'burnable', tip:'ゴム製品は燃えるごみのことが多いよ。' },
  { name:'革のもの', g:200, kana:'かわのもの', alt:'革 かばん ベルト', cat:'burnable', tip:'小さいものは燃えるごみ。大きいものは粗大ごみへ。' },
  { name:'ぬいぐるみ', g:150, kana:'ぬいぐるみ', cat:'burnable', tip:'大きいものは粗大ごみになることも。' },
  { name:'布・服', g:300, kana:'ぬの ふく', alt:'洋服 タオル 衣類', cat:'burnable', tip:'まだ着られるなら古着回収に出そう！' },
  { name:'くつ', g:250, kana:'くつ', alt:'靴 スニーカー', cat:'burnable', tip:'金属が多いものは燃えないごみのことも。' },
  { name:'歯ブラシ', g:15, kana:'はぶらし', cat:'burnable', tip:'小さなプラスチックは燃えるごみが多いよ。' },
  { name:'ストロー', g:1, kana:'すとろー', cat:'burnable', tip:'使わない工夫（マイストロー）もいいね。' },
  { name:'ラップ', g:5, kana:'らっぷ', cat:'burnable', tip:'食品で汚れているので燃えるごみ。' },
  { name:'保冷剤', g:60, kana:'ほれいざい', cat:'burnable', tip:'中身は出さずそのまま出そう。' },
  { name:'ペットのトイレ砂', g:200, kana:'ぺっとのといれすな', cat:'burnable', tip:'紙製のものが多いよ。町のルールを見てね。' },
  { name:'そうじきのごみパック', g:80, kana:'そうじきのごみぱっく', cat:'burnable', tip:'そのまま燃えるごみへ。' },
  { name:'カイロ', g:50, kana:'かいろ', alt:'使い捨てカイロ', cat:'burnable', tip:'中身は鉄だけど、燃えるごみの町が多いよ。' },
  { name:'クレヨン', g:5, kana:'くれよん', cat:'burnable', tip:'ろうでできているので燃えるごみ。' },
  { name:'写真', g:2, kana:'しゃしん', cat:'burnable', tip:'ふつうの紙とちがうのでリサイクル不可。' },
  { name:'レシート', g:1, kana:'れしーと', cat:'burnable', tip:'特殊な紙なので雑がみに混ぜないでね。' },

  /* ---------------- 燃えないごみ・こわれもの ---------------- */
  { name:'われた茶わん', g:250, kana:'われたちゃわん', alt:'茶碗 食器 お皿', cat:'nonburnable', tip:'新聞紙に包んで「キケン」と書いてね。' },
  { name:'われたガラス', g:100, kana:'われたがらす', alt:'ガラス コップ', cat:'nonburnable', tip:'厚紙に包んで危なくないようにしよう。' },
  { name:'こわれたかさ', g:400, kana:'こわれたかさ', alt:'傘 かさ', cat:'nonburnable', tip:'骨は金属。直して長く使えるともっといいね。' },
  { name:'かんでんち', g:25, kana:'かんでんち', alt:'乾電池 電池', cat:'nonburnable', tip:'回収ボックスがあるお店も多いよ。' },
  { name:'アルミホイル', g:5, kana:'あるみほいる', cat:'nonburnable', tip:'よごれていたら燃えないごみのことが多いよ。' },
  { name:'なべ・フライパン', g:800, kana:'なべ ふらいぱん', cat:'nonburnable', tip:'金属は資源として集める町もあるよ。' },
  { name:'はさみ', g:60, kana:'はさみ', cat:'nonburnable', tip:'刃を紙で包んで出そう。' },
  { name:'かみそり', g:20, kana:'かみそり', alt:'カミソリ 刃', cat:'nonburnable', tip:'必ず紙に包んで「キケン」と書こう。' },
  { name:'くぎ・ねじ', g:5, kana:'くぎ ねじ', cat:'nonburnable', tip:'小さくても危ないので包んでね。' },
  { name:'はりがね', g:20, kana:'はりがね', alt:'針金', cat:'nonburnable', tip:'短く切って出そう。' },
  { name:'かがみ', g:300, kana:'かがみ', alt:'鏡', cat:'nonburnable', tip:'割れやすいので包んで出してね。' },
  { name:'電球', g:30, kana:'でんきゅう', alt:'蛍光灯 LED', cat:'nonburnable', tip:'蛍光灯は別回収の町が多いよ。ケースに入れてね。' },
  { name:'せともの', g:200, kana:'せともの', alt:'陶器 花びん', cat:'nonburnable', tip:'割れものは包んでね。' },
  { name:'かさ立て', g:1500, kana:'かさたて', cat:'nonburnable', tip:'大きければ粗大ごみになることも。' },
  { name:'おもちゃ（電池なし）', g:150, kana:'おもちゃ', cat:'nonburnable', tip:'まだ遊べるなら誰かにゆずろう！' },
  { name:'とけい', g:80, kana:'とけい', alt:'時計', cat:'nonburnable', tip:'電池は抜いて別に出そう。' },
  { name:'かぎ', g:15, kana:'かぎ', alt:'鍵', cat:'nonburnable', tip:'金属としてまとめる町もあるよ。' },
  { name:'CD・DVD', g:15, kana:'しーでぃー でぃーぶいでぃー', cat:'nonburnable', tip:'ケースはプラ資源のことが多いよ。' },
  { name:'はもの（包丁・ナイフ）', g:100, kana:'はもの', alt:'包丁 ナイフ', cat:'nonburnable', tip:'必ず包んで「キケン」と書こう。' },

  /* ---------------- そのほか（回収へ・えさにはできない） ---------------- */
  { name:'ライター', kana:'らいたー', cat:'special', tip:'中のガスを使い切って！別回収の町が多い危険物だよ。' },
  { name:'スプレーかん', kana:'すぷれーかん', alt:'スプレー缶 殺虫剤', cat:'special', tip:'中身を使い切って、穴あけのルールを町で確認してね。' },
  { name:'テレビ', kana:'てれび', cat:'special', tip:'家電リサイクル法の対象。お店や市に相談してね。' },
  { name:'れいぞうこ', kana:'れいぞうこ', alt:'冷蔵庫', cat:'special', tip:'家電リサイクル法の対象。ごみに出せないよ。' },
  { name:'せんたくき', kana:'せんたくき', alt:'洗濯機', cat:'special', tip:'家電リサイクル法の対象。お店に相談してね。' },
  { name:'エアコン', kana:'えあこん', cat:'special', tip:'家電リサイクル法の対象。専門の回収へ。' },
  { name:'パソコン', kana:'ぱそこん', alt:'PC ノートパソコン', cat:'special', tip:'メーカーが無料で回収してくれることが多いよ。' },
  { name:'スマホ・けいたい', kana:'すまほ けいたい', alt:'携帯 スマートフォン', cat:'special', tip:'小型家電の回収ボックスへ。金・銀が取れる「都市鉱山」！' },
  { name:'じてんしゃ', kana:'じてんしゃ', alt:'自転車', cat:'special', tip:'粗大ごみ。市に申し込んでから出そう。' },
  { name:'ふとん', kana:'ふとん', alt:'布団 まくら', cat:'special', tip:'粗大ごみになることが多いよ。' },
  { name:'つくえ・いす', kana:'つくえ いす', alt:'机 椅子 家具', cat:'special', tip:'粗大ごみ。市に申し込んでね。' },
  { name:'消火器', kana:'しょうかき', cat:'special', tip:'ごみに出せないよ。専門の窓口へ。' },
  { name:'くすり', kana:'くすり', alt:'薬 医療品', cat:'special', tip:'薬局に相談すると安心だよ。' },
  { name:'注射針', kana:'ちゅうしゃばり', cat:'special', tip:'絶対にごみ箱に入れないで！病院に返そう。' },
  { name:'油（食用油）', kana:'あぶら しょくようあぶら', alt:'てんぷら油', cat:'special', tip:'固めるか紙にしみこませて。回収している町もあるよ。' },
  { name:'モバイルバッテリー', kana:'もばいるばってりー', alt:'充電池 リチウム電池', cat:'special', tip:'燃やすと火事になる！回収ボックスへ。' },
  { name:'インクカートリッジ', kana:'いんくかーとりっじ', cat:'special', tip:'お店の回収箱に出せるよ。' },
];

/* ============================================================
   検索
   ============================================================ */
// カタカナ→ひらがな、大小文字と空白をならしてから比べる。
function normalizeQuery(s){
  return String(s || '')
    .replace(/[ァ-ヶ]/g, function(c){ return String.fromCharCode(c.charCodeAt(0) - 0x60); })
    .replace(/[Ａ-Ｚａ-ｚ０-９]/g, function(c){ return String.fromCharCode(c.charCodeAt(0) - 0xFEE0); })
    .toLowerCase()
    .replace(/[\s　・、。"']/g, '');
}

function dictSearch(query){
  const q = normalizeQuery(query);
  if (!q) return [];
  const hits = [];
  DICT_ITEMS.forEach(function(item){
    const hay = normalizeQuery(item.name + item.kana + (item.alt || ''));
    const idx = hay.indexOf(q);
    if (idx >= 0) hits.push({ item: item, score: idx });   // 前で一致するほど上に
  });
  hits.sort(function(a,b){ return a.score - b.score; });
  return hits.map(function(h){ return h.item; });
}

function dictByCategory(catId){
  return DICT_ITEMS.filter(function(i){ return i.cat === catId; });
}

// カテゴリの見た目（5分別 + そのほか）
function dictCatMeta(catId){
  if (catId === 'special') return DICT_SPECIAL;
  return catById(catId) || DICT_SPECIAL;
}

// じてんの項目を、えさやりが使う形（TRASH_ITEMS と同じ形）に変換する。
// 'special' は g を持たないので、えさにはできない。
function dictCanFeed(item){ return item.cat !== 'special' && typeof item.g === 'number'; }

function dictToTrash(item){
  return {
    id: 'dict:' + item.name,
    name: item.name,
    icon: dictCatMeta(item.cat).icon,
    grams: item.g,
    categoryId: item.cat,
    hint: item.tip,
  };
}
