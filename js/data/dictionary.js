/* ============================================================
   ごみのじてん（検索用）
   ============================================================
   name … 表示名（漢字あり）
   kana … ひらがな読み。検索とひらがなモードの表示に使う
   alt  … 別の言い方（検索でだけ使う。表示しない）
   cat  … WASTE_CATEGORIES の id、または 'special'
   tip  … ひとことアドバイス

   'special' は5分別のどれにも入らないもの（家電・危険物など）。
   分別ルールは市区町村で違うので、画面に注意書きを出している。
   ============================================================ */
const DICT_SPECIAL = { id:'special', icon:'🏪', color:'#7C6BB0' };

const DICT_ITEMS = [
  /* ---------------- 資源ごみ ---------------- */
  { name:'ペットボトル', kana:'ぺっとぼとる', cat:'recycle', tip:'キャップとラベルを外して、中をゆすいでね。' },
  { name:'ペットボトルのキャップ', kana:'ぺっとぼとるのきゃっぷ', alt:'ふた', cat:'recycle', tip:'本体と分けて出そう。集めている学校もあるよ。' },
  { name:'ペットボトルのラベル', kana:'ぺっとぼとるのらべる', cat:'recycle', tip:'はがしてプラスチックの資源へ。' },
  { name:'あきかん', kana:'あきかん', alt:'空き缶 かん アルミ缶 スチール缶', cat:'recycle', tip:'軽くすすいでね。何度でも新しい缶になれるよ。' },
  { name:'あきびん', kana:'あきびん', alt:'空き瓶 びん ガラスびん', cat:'recycle', tip:'すすいでから。ふたは外して別に出そう。' },
  { name:'びんのふた（金属）', kana:'びんのふた', cat:'recycle', tip:'金属のふたは資源。町のルールも見てみよう。' },
  { name:'プラスチックのトレー', kana:'ぷらすちっくのとれー', alt:'とれい 食品トレー', cat:'recycle', tip:'洗って乾かしてね。お店に回収箱があることも。' },
  { name:'おかしの空き箱（プラ）', kana:'おかしのあきばこ', cat:'recycle', tip:'プラマークがついていたら資源プラへ。' },
  { name:'シャンプーのボトル', kana:'しゃんぷーのぼとる', alt:'詰め替え容器', cat:'recycle', tip:'中を洗って出そう。' },
  { name:'洗剤の容器', kana:'せんざいのようき', cat:'recycle', tip:'中身を使い切って、洗ってから。' },
  { name:'たまごのパック', kana:'たまごのぱっく', cat:'recycle', tip:'洗って乾かせば資源プラ。' },
  { name:'牛乳パック', kana:'ぎゅうにゅうぱっく', alt:'紙パック', cat:'recycle', tip:'洗って開いて乾かす。スーパーの回収箱が便利！' },
  { name:'アルミホイル', kana:'あるみほいる', cat:'nonburnable', tip:'よごれていたら燃えないごみのことが多いよ。' },
  { name:'空きかん（スプレー以外）', kana:'あきかん', cat:'recycle', tip:'中を空にしてすすいでね。' },
  { name:'ビニール袋', kana:'びにーるぶくろ', alt:'レジ袋 ポリ袋', cat:'recycle', tip:'きれいならプラ資源、汚れていたら燃えるごみ。' },
  { name:'カップめんの容器', kana:'かっぷめんのようき', cat:'recycle', tip:'洗ってから。汚れが落ちなければ燃えるごみへ。' },
  { name:'ヨーグルトの容器', kana:'よーぐるとのようき', cat:'recycle', tip:'洗って乾かしてね。' },
  { name:'ペットボトルのケース', kana:'ぺっとぼとるのけーす', cat:'recycle', tip:'プラスチックの資源へ。' },

  /* ---------------- 紙ごみ ---------------- */
  { name:'しんぶんし', kana:'しんぶんし', alt:'新聞紙 新聞', cat:'paper', tip:'ひもでしばって出そう。トイレットペーパーになるよ。' },
  { name:'ざっし', kana:'ざっし', alt:'雑誌 マンガ 本', cat:'paper', tip:'ひもでしばってね。' },
  { name:'だんボール', kana:'だんぼーる', alt:'段ボール ダンボール', cat:'paper', tip:'たたんで重ねてね。新しいダンボールになるよ。' },
  { name:'チラシ', kana:'ちらし', alt:'広告', cat:'paper', tip:'きれいな紙は立派な資源。' },
  { name:'紙袋', kana:'かみぶくろ', cat:'paper', tip:'持ち手が紙でなければ外してね。' },
  { name:'ノート', kana:'のーと', cat:'paper', tip:'金具（リング）は外して燃えないごみへ。' },
  { name:'コピー用紙', kana:'こぴーようし', alt:'プリント', cat:'paper', tip:'雑がみとしてまとめて出せるよ。' },
  { name:'ティッシュの箱', kana:'てぃっしゅのはこ', cat:'paper', tip:'取り出し口のビニールは外してね。' },
  { name:'おかしの紙箱', kana:'おかしのかみばこ', cat:'paper', tip:'きれいなら紙ごみ（雑がみ）へ。' },
  { name:'封筒', kana:'ふうとう', cat:'paper', tip:'ビニールの窓は外してね。' },
  { name:'トイレットペーパーの芯', kana:'といれっとぺーぱーのしん', cat:'paper', tip:'雑がみでリサイクルできるよ。' },
  { name:'包装紙', kana:'ほうそうし', cat:'paper', tip:'きれいなら紙ごみへ。' },

  /* ---------------- 生ごみ ---------------- */
  { name:'たべのこし', kana:'たべのこし', alt:'食べ残し 残飯', cat:'compost', tip:'水気をよく切ってね。残さず食べるのがいちばん！' },
  { name:'やさいのくず', kana:'やさいのくず', alt:'野菜くず 皮', cat:'compost', tip:'コンポストにすると畑の栄養になるよ。' },
  { name:'くだものの皮', kana:'くだもののかわ', alt:'みかんの皮 りんごの皮', cat:'compost', tip:'水気を切って出そう。' },
  { name:'バナナのかわ', kana:'ばななのかわ', cat:'compost', tip:'生ごみとして出そう。' },
  { name:'たまごのから', kana:'たまごのから', alt:'卵の殻', cat:'compost', tip:'生ごみへ。細かくすると土に還りやすいよ。' },
  { name:'魚のほね', kana:'さかなのほね', alt:'骨', cat:'compost', tip:'水気を切って生ごみへ。' },
  { name:'お茶がら', kana:'おちゃがら', alt:'茶殻 コーヒーかす', cat:'compost', tip:'よく絞ってから出そう。' },
  { name:'パンのみみ', kana:'ぱんのみみ', cat:'compost', tip:'食べきれるとうれしいね。' },

  /* ---------------- 燃えるごみ ---------------- */
  { name:'よごれたティッシュ', kana:'よごれたてぃっしゅ', alt:'ちり紙 鼻紙', cat:'burnable', tip:'汚れた紙はリサイクルできないんだ。' },
  { name:'よごれた紙コップ', kana:'よごれたかみこっぷ', cat:'burnable', tip:'洗えないものは燃えるごみへ。' },
  { name:'おかしのふくろ', kana:'おかしのふくろ', alt:'スナック菓子の袋', cat:'burnable', tip:'食べもので汚れた袋は燃えるごみ。' },
  { name:'ピザの箱', kana:'ぴざのはこ', cat:'burnable', tip:'油やチーズがついた紙はリサイクルできないよ。' },
  { name:'紙おむつ', kana:'かみおむつ', alt:'おむつ', cat:'burnable', tip:'汚れを取ってから出そう。' },
  { name:'マスク', kana:'ますく', cat:'burnable', tip:'袋に入れて出すと安心だね。' },
  { name:'わりばし', kana:'わりばし', alt:'割り箸', cat:'burnable', tip:'木でできているので燃えるごみ。' },
  { name:'つまようじ', kana:'つまようじ', cat:'burnable', tip:'先が危ないので紙に包んでね。' },
  { name:'ゴム', kana:'ごむ', alt:'輪ゴム 消しゴム', cat:'burnable', tip:'ゴム製品は燃えるごみのことが多いよ。' },
  { name:'革のもの', kana:'かわのもの', alt:'革 かばん ベルト', cat:'burnable', tip:'小さいものは燃えるごみ。大きいものは粗大ごみへ。' },
  { name:'ぬいぐるみ', kana:'ぬいぐるみ', cat:'burnable', tip:'大きいものは粗大ごみになることも。' },
  { name:'布・服', kana:'ぬの ふく', alt:'洋服 タオル 衣類', cat:'burnable', tip:'まだ着られるなら古着回収に出そう！' },
  { name:'くつ', kana:'くつ', alt:'靴 スニーカー', cat:'burnable', tip:'金属が多いものは燃えないごみのことも。' },
  { name:'歯ブラシ', kana:'はぶらし', cat:'burnable', tip:'小さなプラスチックは燃えるごみが多いよ。' },
  { name:'ストロー', kana:'すとろー', cat:'burnable', tip:'使わない工夫（マイストロー）もいいね。' },
  { name:'ラップ', kana:'らっぷ', cat:'burnable', tip:'食品で汚れているので燃えるごみ。' },
  { name:'発泡スチロール', kana:'はっぽうすちろーる', alt:'はっぽうスチロール', cat:'recycle', tip:'きれいなら資源プラ。汚れていたら燃えるごみへ。' },
  { name:'保冷剤', kana:'ほれいざい', cat:'burnable', tip:'中身は出さずそのまま出そう。' },
  { name:'ペットのトイレ砂', kana:'ぺっとのといれすな', cat:'burnable', tip:'紙製のものが多いよ。町のルールを見てね。' },
  { name:'そうじきのごみパック', kana:'そうじきのごみぱっく', cat:'burnable', tip:'そのまま燃えるごみへ。' },
  { name:'カイロ', kana:'かいろ', alt:'使い捨てカイロ', cat:'burnable', tip:'中身は鉄だけど、燃えるごみの町が多いよ。' },
  { name:'クレヨン', kana:'くれよん', cat:'burnable', tip:'ろうでできているので燃えるごみ。' },
  { name:'写真', kana:'しゃしん', cat:'burnable', tip:'ふつうの紙とちがうのでリサイクル不可。' },
  { name:'レシート', kana:'れしーと', cat:'burnable', tip:'特殊な紙なので雑がみに混ぜないでね。' },

  /* ---------------- 燃えないごみ・こわれもの ---------------- */
  { name:'われた茶わん', kana:'われたちゃわん', alt:'茶碗 食器 お皿', cat:'nonburnable', tip:'新聞紙に包んで「キケン」と書いてね。' },
  { name:'われたガラス', kana:'われたがらす', alt:'ガラス コップ', cat:'nonburnable', tip:'厚紙に包んで危なくないようにしよう。' },
  { name:'こわれたかさ', kana:'こわれたかさ', alt:'傘 かさ', cat:'nonburnable', tip:'骨は金属。直して長く使えるともっといいね。' },
  { name:'かんでんち', kana:'かんでんち', alt:'乾電池 電池', cat:'nonburnable', tip:'回収ボックスがあるお店も多いよ。' },
  { name:'なべ・フライパン', kana:'なべ ふらいぱん', cat:'nonburnable', tip:'金属は資源として集める町もあるよ。' },
  { name:'はさみ', kana:'はさみ', cat:'nonburnable', tip:'刃を紙で包んで出そう。' },
  { name:'かみそり', kana:'かみそり', alt:'カミソリ 刃', cat:'nonburnable', tip:'必ず紙に包んで「キケン」と書こう。' },
  { name:'くぎ・ねじ', kana:'くぎ ねじ', cat:'nonburnable', tip:'小さくても危ないので包んでね。' },
  { name:'はりがね', kana:'はりがね', alt:'針金', cat:'nonburnable', tip:'短く切って出そう。' },
  { name:'かがみ', kana:'かがみ', alt:'鏡', cat:'nonburnable', tip:'割れやすいので包んで出してね。' },
  { name:'電球', kana:'でんきゅう', alt:'蛍光灯 LED', cat:'nonburnable', tip:'蛍光灯は別回収の町が多いよ。ケースに入れてね。' },
  { name:'せともの', kana:'せともの', alt:'陶器 花びん', cat:'nonburnable', tip:'割れものは包んでね。' },
  { name:'かさ立て', kana:'かさたて', cat:'nonburnable', tip:'大きければ粗大ごみになることも。' },
  { name:'おもちゃ（電池なし）', kana:'おもちゃ', cat:'nonburnable', tip:'まだ遊べるなら誰かにゆずろう！' },
  { name:'とけい', kana:'とけい', alt:'時計', cat:'nonburnable', tip:'電池は抜いて別に出そう。' },
  { name:'かぎ', kana:'かぎ', alt:'鍵', cat:'nonburnable', tip:'金属としてまとめる町もあるよ。' },
  { name:'CD・DVD', kana:'しーでぃー でぃーぶいでぃー', cat:'nonburnable', tip:'ケースはプラ資源のことが多いよ。' },
  { name:'ライター', kana:'らいたー', cat:'special', tip:'中のガスを使い切って！別回収の町が多い危険物だよ。' },
  { name:'スプレーかん', kana:'すぷれーかん', alt:'スプレー缶 殺虫剤', cat:'special', tip:'中身を使い切って、穴あけのルールを町で確認してね。' },
  { name:'はさみ以外の刃物', kana:'はもの', alt:'包丁 ナイフ', cat:'nonburnable', tip:'必ず包んで「キケン」と書こう。' },

  /* ---------------- そのほか（回収へ） ---------------- */
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
