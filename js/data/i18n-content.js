/* ============================================================
   コンテンツの翻訳（モンスター名・ごみ・カテゴリ・タイプ）
   ============================================================
   日本語(ja)は monsters.js / waste.js の元データをそのまま使うので
   ここには置かない。訳が抜けているキーは日本語にフォールバックする。
   ============================================================ */
const CONTENT_I18N = {

  /* ================= ひらがな ================= */
  hira: {
    rarity: { 1:'ふつう', 2:'めずらしい', 3:'レア', 4:'でんせつ' },
    type: {
      forest:{ label:'はっぱタイプ', blurb:'かみや なまごみが とくい' },
      river: { label:'みずタイプ',   blurb:'びん・かんが とくい' },
      earth: { label:'ほのおタイプ', blurb:'もえるごみが とくい' },
    },
    cat: {
      recycle:    { label:'しげんごみ', sub:'プラ・かん・びん', tip:'こまかく くだかれて ふくや バッグに うまれかわるよ。' },
      paper:      { label:'かみごみ',   sub:'しんぶん・だんボール', tip:'あたらしい だんボールや トイレットペーパーに なるよ。' },
      compost:    { label:'なまごみ',   sub:'たべのこし', tip:'たいひに すれば はたけの えいように なるよ。' },
      burnable:   { label:'もえるごみ', sub:'よごれた かみ など', tip:'たべのこしを へらすと ごみを へらせるよ。' },
      nonburnable:{ label:'もえないごみ・こわれもの', sub:'きんぞく・とうき など', tip:'なおして ながく つかうことも かんがえてみよう。' },
    },
    trash: {
      petbottle:{ name:'ペットボトル', hint:'キャップと ラベルを はずして しげんごみへ！ふくや バッグに うまれかわるよ。' },
      can:      { name:'あきかん',     hint:'かるく すすいで だそう。なんども あたらしい かんに なれるよ。' },
      bin:      { name:'あきびん',     hint:'びんは くりかえし つかえる リサイクルの ゆうとうせい！' },
      newspaper:{ name:'しんぶんし',   hint:'ひもで しばって かみごみへ。トイレットペーパーに なるよ。' },
      cardboard:{ name:'だんボール',   hint:'たたんで かさねて かみごみへ。あたらしい だんボールに なるよ。' },
      flyer:    { name:'チラシ1まい',  hint:'きれいな かみは かみごみで リサイクルできるよ。' },
      leftover: { name:'たべのこし',   hint:'ちゃわん1ぱいで やく150g。のこさず たべるのが いちばん！' },
      banana:   { name:'バナナのかわ', hint:'なまごみは みずけを よく きってから だそう。' },
      vegscraps:{ name:'やさいのくず', hint:'コンポストに いれると はたけの えいように なるよ。' },
      tissue:   { name:'よごれた ティッシュ', hint:'よごれた かみは リサイクルできないから もえるごみへ。' },
      snackbag: { name:'おかしの ふくろ',     hint:'たべもので よごれた ふくろは もえるごみ。まちの ルールも みてみよう。' },
      papercup: { name:'よごれた かみコップ', hint:'よごれた かみコップは かみごみに できないんだ。もえるごみへ。' },
      brokencup:{ name:'われた ちゃわん',     hint:'われものは しんぶんしに つつんで「キケン」と かいて だそう。' },
      umbrella: { name:'こわれた かさ',       hint:'きんぞくの ほねは もえないごみ。なおして ながく つかえたら もっといいね。' },
      battery:  { name:'かんでんち',          hint:'でんちは かいしゅうボックスが ある まちも おおいよ。おみせで きいてみよう。' },
    },
    mon: {
      1:{ desc:'はっぱが ついた みどりの たまご。かみや なまごみが とくいな モンスターが うまれるよ。' },
      2:{ desc:'おちばや かみを たべて そだつ もりの スライム。まだ どんな すがたに なるか わからない。' },
      3:{ desc:'なまごみから めばえた ちいさな め。あたまの ほしが げんきの しるし。' },
      4:{ desc:'はっぱの しっぽを もつ もりの ネコ。ごみが おおいと ごきげん ななめ。' },
      5:{ desc:'なまごみを つちに かえしてくれる あかい かさの キノコ。' },
      6:{ desc:'きの つのと はの たてがみを もつ もりの ぬし。きれいに わけた しげんだけで そだつ。' },
      7:{ desc:'こうらに ほしが うかぶ のんびりやの カメ。' },
      8:{ desc:'ながい としつきを かけて そだった もりの ちょうろう。つえを ついている。' },
      9:{ desc:'みっつの かおを もつ もりの ネコの おうさま。' },
      10:{ desc:'スーツを きこなす まじめな ネコ。ちょっと つかれぎみ。' },
      11:{ desc:'しずくもようの あおい たまご。びんや かんが とくいな モンスターが うまれるよ。' },
      12:{ desc:'みずが はいった ペットボトルの すがた。ちゃんと わけると しげんに うまれかわる。' },
      13:{ desc:'うきわを かぶった あそびずきの アザラシ。うみが きれいだと よろこぶ。' },
      14:{ desc:'こわれた かさが うみに ながれて クラゲに なった。' },
      15:{ desc:'ボトルの なかで ほしが そだっている ふしぎな すがた。' },
      16:{ desc:'すてられた ボトルを やどに した ヤドカリ。ほんとうは かいがらの いえが いいらしい。' },
      17:{ desc:'あかい バケツが トレードマークの アザラシ。' },
      18:{ desc:'マントと おうかんを つけた うみの おうさま。' },
      19:{ desc:'みずいろの もようを もつ くびの ながい キリン。' },
      20:{ desc:'からだに ほしが かがやく トナカイ。しげんを たくさん あつめた ことろに あらわれる。' },
      21:{ desc:'ほのおに つつまれた あかい たまご。もえるごみが とくいな モンスターが うまれるよ。' },
      22:{ desc:'ひを ともしたばかりの ちいさな ロウソク。まだ どんな すがたに なるか わからない。' },
      23:{ desc:'うまれたての ちいさな ドラゴン。ほっぺが あかくて、まだ ひは はけない。' },
      24:{ desc:'ほのおに つつまれた イノシシの こ。もえるごみの においに さそわれて でてくる。' },
      25:{ desc:'みっつの ほのおを ともす ロウソクの おうさま。しげんを たいせつに した こに あらわれる。' },
      26:{ desc:'あたまに ロウソクを のせた ネコ。よみちを いっしょに あるいてくれる。' },
      27:{ desc:'するどい つのと おおきな つばさを もつ ほのおの ドラゴン。きちんと わけた こだけが であえる。' },
      28:{ desc:'ちいさな つばさで ぱたぱた とぶ あかい ドラゴン。げんき いっぱい。' },
      29:{ desc:'こんぼうと よろいを みにつけた イノシシの せんし。もえるごみを へらす ちからもち。' },
      30:{ desc:'せなかに ほのおを まとった イノシシ。もやすごみが おおいと あらわれる。' },
      31:{ desc:'ごみだらけの もりで そだってしまい、かれてしまった き。' },
      32:{ desc:'よごれた みずに しずんで どろどろに なってしまった。' },
      33:{ desc:'わけられなかった ごみを のみこんで ふくらんだ けむりの かたまり。かさも かんも ボトルも、ただしく わければ しげんに なったのに…。' },
    },
  },

  /* ================= English ================= */
  en: {
    rarity: { 1:'Common', 2:'Uncommon', 3:'Rare', 4:'Legendary' },
    type: {
      forest:{ label:'Leaf type', blurb:'Good with paper & food waste' },
      river: { label:'Water type', blurb:'Good with bottles & cans' },
      earth: { label:'Fire type', blurb:'Good with burnable trash' },
    },
    cat: {
      recycle:    { label:'Recyclables', sub:'Plastic, cans, bottles', tip:'It gets shredded and reborn as clothes or bags.' },
      paper:      { label:'Paper', sub:'Newspaper, cardboard', tip:'It becomes new cardboard or toilet paper.' },
      compost:    { label:'Food waste', sub:'Leftovers', tip:'Turned into compost, it feeds the fields.' },
      burnable:   { label:'Burnable', sub:'Dirty paper etc.', tip:'Eating everything up means less trash.' },
      nonburnable:{ label:'Non-burnable / broken items', sub:'Metal, ceramics', tip:'Think about repairing it and using it longer.' },
    },
    trash: {
      petbottle:{ name:'PET bottle', hint:'Take off the cap and label — it becomes clothes and bags!' },
      can:      { name:'Empty can', hint:'Rinse it lightly. It can become a new can again and again.' },
      bin:      { name:'Empty glass bottle', hint:'Glass bottles can be reused over and over — a recycling star!' },
      newspaper:{ name:'Newspaper', hint:'Tie it up with string. It becomes toilet paper.' },
      cardboard:{ name:'Cardboard', hint:'Flatten and stack it. It becomes new cardboard.' },
      flyer:    { name:'One flyer', hint:'Clean paper can be recycled as paper trash.' },
      leftover: { name:'Leftover food', hint:'One bowl is about 150g. Best of all is finishing your food!' },
      banana:   { name:'Banana peel', hint:'Drain food waste well before throwing it away.' },
      vegscraps:{ name:'Vegetable scraps', hint:'In a compost bin it turns into food for the fields.' },
      tissue:   { name:'Used tissue', hint:'Dirty paper cannot be recycled, so it is burnable.' },
      snackbag: { name:'Snack bag', hint:'Bags dirty with food are burnable. Check your town rules too.' },
      papercup: { name:'Dirty paper cup', hint:'A dirty paper cup cannot go with paper. It is burnable.' },
      brokencup:{ name:'Broken bowl', hint:'Wrap broken things in newspaper and mark them "danger".' },
      umbrella: { name:'Broken umbrella', hint:'The metal ribs are non-burnable. Repairing it would be even better.' },
      battery:  { name:'Battery', hint:'Many towns have collection boxes. Ask at a shop.' },
    },
    mon: {
      1:{ name:'Leaf Egg', desc:'A green egg with a leaf. A monster good with paper and food waste hatches from it.' },
      2:{ name:'Forest Slime', desc:'A forest slime that grows on fallen leaves and paper. Its future shape is still unknown.' },
      3:{ name:'Star Sprout', desc:'A little sprout grown from food waste. The star on its head shows it is healthy.' },
      4:{ name:'Leaf Cat', desc:'A forest cat with a leafy tail. Too much trash puts it in a bad mood.' },
      5:{ name:'Mushlet', desc:'A red-capped mushroom that returns food waste to the soil.' },
      6:{ name:'Forest Lord', desc:'Lord of the forest, with wooden horns and a mane of leaves. It grows only on well-sorted resources.' },
      7:{ name:'Star Turtle', desc:'An easy-going turtle with a star on its shell.' },
      8:{ name:'Forest Elder', desc:'An elder of the forest grown over many years. It leans on a cane and teaches how to sort.' },
      9:{ name:'Three-Head King', desc:'King of the forest cats, with three faces. The crown is proof that resources were treasured.' },
      10:{ name:'Office Cat', desc:'A serious cat in a smart suit. Tidy, but a little tired.' },
      11:{ name:'Water Egg', desc:'A blue egg with droplet patterns. A monster good with bottles and cans hatches from it.' },
      12:{ name:'Bottlin', desc:'A PET bottle filled with water. Sorted properly, it is reborn as a resource.' },
      13:{ name:'Floatie Seal', desc:'A playful seal wearing a swim ring. It is happy when the sea is clean.' },
      14:{ name:'Brolly Jelly', desc:'A broken umbrella that drifted into the sea and became a jellyfish.' },
      15:{ name:'Star Bottle', desc:'A star growing inside a bottle — a sign of clean water.' },
      16:{ name:'Hermit Bottle', desc:'A hermit crab using a thrown-away bottle as its home. It would prefer a shell.' },
      17:{ name:'Bucket Seal', desc:'A seal whose trademark is a red bucket. Take care of buckets and use them a long time.' },
      18:{ name:'Seal King', desc:'The king of the sea, wearing a cape and a crown. It rules over clean waters.' },
      19:{ name:'Aqua Giraffe', desc:'A long-necked giraffe with pale blue patterns. It watches the sea from high up.' },
      20:{ name:'Star Reindeer', desc:'A reindeer with stars shining on its body. It appears for those who collect many resources.' },
      21:{ name:'Flame Egg', desc:'A red egg wrapped in flames. A monster good with burnable trash hatches from it.' },
      22:{ name:'Candlet', desc:'A little candle that has just been lit. Its future shape is still unknown.' },
      23:{ name:'Draglet', desc:'A tiny newborn dragon with rosy cheeks. It cannot breathe fire yet.' },
      24:{ name:'Emberboar', desc:'A boar cub wrapped in flames. The smell of burnable trash draws it out.' },
      25:{ name:'Candelabrion', desc:'The candle king, burning three flames. It appears for those who treasure resources.' },
      26:{ name:'Candle Cat', desc:'A cat carrying a candle on its head. It walks the night roads with you.' },
      27:{ name:'Flame Dragon', desc:'A fire dragon with sharp horns and broad wings. Only careful sorters meet it.' },
      28:{ name:'Red Draglet', desc:'A red dragon fluttering on little wings. Full of energy.' },
      29:{ name:'Boar King', desc:'A boar warrior with a club and armour. Strong enough to cut down burnable trash.' },
      30:{ name:'Blazeboar', desc:'A boar with flames along its back. It appears when there is a lot of burnable trash.' },
      31:{ name:'Witherwood', desc:'A tree that withered after growing in a forest full of trash. Try making less trash next time.' },
      32:{ name:'Sludgen', desc:'It sank into dirty water and turned to sludge. Sort correctly and you will never meet it.' },
      33:{ name:'Smogblob', desc:'A lump of smoke swollen with trash that was never sorted. The umbrella, the can, the bottle — all of it could have been a resource.' },
    },
  },

  /* ================= 中文（简体） ================= */
  zh: {
    rarity: { 1:'普通', 2:'少见', 3:'稀有', 4:'传说' },
    type: {
      forest:{ label:'树叶属性', blurb:'擅长纸类和厨余' },
      river: { label:'水属性',   blurb:'擅长瓶子和罐子' },
      earth: { label:'火属性',   blurb:'擅长可燃垃圾' },
    },
    cat: {
      recycle:    { label:'资源垃圾', sub:'塑料・罐・瓶', tip:'会被粉碎，变成衣服或包包。' },
      paper:      { label:'纸类垃圾', sub:'报纸・纸箱', tip:'会变成新的纸箱或卫生纸。' },
      compost:    { label:'厨余垃圾', sub:'剩饭剩菜', tip:'做成堆肥就能成为田里的养分。' },
      burnable:   { label:'可燃垃圾', sub:'脏纸等', tip:'少剩饭菜就能减少垃圾。' },
      nonburnable:{ label:'不可燃垃圾・破损物', sub:'金属・陶瓷等', tip:'也可以想想修好后长久使用。' },
    },
    trash: {
      petbottle:{ name:'塑料瓶', hint:'取下瓶盖和标签再放进资源垃圾！会变成衣服和包包。' },
      can:      { name:'空罐',   hint:'稍微冲洗一下再扔。可以反复变成新罐子。' },
      bin:      { name:'空瓶',   hint:'玻璃瓶可以反复使用，是回收的优等生！' },
      newspaper:{ name:'报纸',   hint:'用绳子捆好放进纸类。会变成卫生纸。' },
      cardboard:{ name:'纸箱',   hint:'折叠叠好放进纸类。会变成新的纸箱。' },
      flyer:    { name:'一张传单', hint:'干净的纸可以作为纸类回收。' },
      leftover: { name:'剩饭',   hint:'一碗大约150g。最好还是不剩饭！' },
      banana:   { name:'香蕉皮', hint:'厨余垃圾要沥干水分再扔。' },
      vegscraps:{ name:'菜屑',   hint:'放进堆肥箱就能成为田里的养分。' },
      tissue:   { name:'用过的纸巾', hint:'脏纸不能回收，要放可燃垃圾。' },
      snackbag: { name:'零食包装袋', hint:'沾了食物的袋子是可燃垃圾。也看看你所在城市的规则。' },
      papercup: { name:'脏纸杯', hint:'脏纸杯不能放进纸类，要放可燃垃圾。' },
      brokencup:{ name:'破碗',   hint:'易碎物用报纸包好，写上「危险」再扔。' },
      umbrella: { name:'坏掉的雨伞', hint:'金属伞骨是不可燃垃圾。能修好长久使用就更好了。' },
      battery:  { name:'电池',   hint:'很多城市都有回收箱，可以去店里问问。' },
    },
    mon: {
      1:{ name:'树叶蛋', desc:'带着叶子的绿色蛋。会孵出擅长纸类和厨余的怪兽。' },
      2:{ name:'森史莱姆', desc:'吃落叶和纸长大的森林史莱姆。还不知道会长成什么样。' },
      3:{ name:'星芽', desc:'从厨余中发芽的小苗。头上的星星是健康的证明。' },
      4:{ name:'树叶猫', desc:'有着叶子尾巴的森林猫。垃圾太多就会心情不好。' },
      5:{ name:'小蘑菇', desc:'把厨余还给土壤的红伞蘑菇。' },
      6:{ name:'森之主', desc:'有木角和树叶鬃毛的森林之主。只有好好分类的资源才能养大它。' },
      7:{ name:'星龟', desc:'龟壳上浮着星星的悠闲乌龟。' },
      8:{ name:'森之长老', desc:'经过漫长岁月长成的森林长老。拄着拐杖，教大家怎么分类。' },
      9:{ name:'三头王', desc:'有三张脸的森林猫之王。王冠是珍惜资源的证明。' },
      10:{ name:'上班猫', desc:'穿着西装的认真猫咪。很整齐，但有点累。' },
      11:{ name:'水之蛋', desc:'有水滴花纹的蓝色蛋。会孵出擅长瓶子和罐子的怪兽。' },
      12:{ name:'瓶宝', desc:'装着水的塑料瓶。好好分类就能重生为资源。' },
      13:{ name:'泳圈海豹', desc:'戴着泳圈、爱玩的海豹。海干净的时候它最开心。' },
      14:{ name:'雨伞水母', desc:'坏掉的雨伞流进海里，变成了水母。' },
      15:{ name:'星星瓶', desc:'瓶子里长出星星的神奇模样，是干净水的象征。' },
      16:{ name:'寄居瓶', desc:'把被丢弃的瓶子当家的寄居蟹。其实它更想要贝壳的家。' },
      17:{ name:'水桶海豹', desc:'以红色水桶为标志的海豹。水桶要爱惜、长久使用。' },
      18:{ name:'海豹之王', desc:'披着斗篷、戴着王冠的海之王，守护干净的大海。' },
      19:{ name:'水色长颈鹿', desc:'有水色花纹的长颈鹿，从高处眺望大海。' },
      20:{ name:'星星驯鹿', desc:'身上闪着星星的驯鹿。会出现在收集了很多资源的孩子面前。' },
      21:{ name:'火焰蛋', desc:'被火焰包围的红色蛋。会孵出擅长可燃垃圾的怪兽。' },
      22:{ name:'小蜡烛', desc:'刚点上火的小蜡烛。还不知道会长成什么样。' },
      23:{ name:'小龙宝', desc:'刚出生的小龙，脸颊红红的，还不会喷火。' },
      24:{ name:'火苗野猪', desc:'被火焰包围的野猪宝宝。闻到可燃垃圾的味道就会出现。' },
      25:{ name:'烛台王', desc:'点着三团火焰的蜡烛之王。会出现在珍惜资源的孩子面前。' },
      26:{ name:'蜡烛猫', desc:'头上顶着蜡烛的猫。会陪你走夜路。' },
      27:{ name:'烈焰龙', desc:'有尖角和大翅膀的火焰之龙。只有好好分类的孩子才能遇到。' },
      28:{ name:'红小龙', desc:'用小翅膀扑扇着飞的红龙。精神满满。' },
      29:{ name:'野猪王', desc:'带着木棒和盔甲的野猪战士。力气大，能减少可燃垃圾。' },
      30:{ name:'炎背猪', desc:'背上带着火焰的野猪。可燃垃圾多的时候就会出现。' },
      31:{ name:'枯木怪', desc:'在满是垃圾的森林里长大，最后枯萎的树。下次试着少扔一点垃圾吧。' },
      32:{ name:'淤泥怪', desc:'沉进脏水里变得黏糊糊的样子。好好分类就不会遇到它。' },
      33:{ name:'烟团', desc:'吞下没有分类的垃圾而胀大的烟团。雨伞、罐子、瓶子，本来都能变成资源的…' },
    },
  },

  /* ================= 한국어 ================= */
  ko: {
    rarity: { 1:'보통', 2:'조금 드묾', 3:'레어', 4:'전설' },
    type: {
      forest:{ label:'잎사귀 타입', blurb:'종이와 음식물에 강해요' },
      river: { label:'물 타입',     blurb:'병과 캔에 강해요' },
      earth: { label:'불꽃 타입',   blurb:'타는 쓰레기에 강해요' },
    },
    cat: {
      recycle:    { label:'재활용 쓰레기', sub:'플라스틱・캔・병', tip:'잘게 부서져서 옷이나 가방으로 다시 태어나요.' },
      paper:      { label:'종이 쓰레기', sub:'신문・골판지', tip:'새 골판지나 화장지가 돼요.' },
      compost:    { label:'음식물 쓰레기', sub:'남은 음식', tip:'퇴비로 만들면 밭의 영양분이 돼요.' },
      burnable:   { label:'타는 쓰레기', sub:'더러운 종이 등', tip:'음식을 남기지 않으면 쓰레기를 줄일 수 있어요.' },
      nonburnable:{ label:'안 타는 쓰레기・깨진 물건', sub:'금속・도자기 등', tip:'고쳐서 오래 쓰는 것도 생각해봐요.' },
    },
    trash: {
      petbottle:{ name:'페트병', hint:'뚜껑과 라벨을 떼고 재활용으로! 옷이나 가방으로 다시 태어나요.' },
      can:      { name:'빈 캔',  hint:'가볍게 헹궈서 버려요. 몇 번이고 새 캔이 될 수 있어요.' },
      bin:      { name:'빈 병',  hint:'유리병은 여러 번 다시 쓸 수 있는 재활용 우등생!' },
      newspaper:{ name:'신문지', hint:'끈으로 묶어서 종이류로. 화장지가 돼요.' },
      cardboard:{ name:'골판지', hint:'접어서 쌓아 종이류로. 새 골판지가 돼요.' },
      flyer:    { name:'전단지 한 장', hint:'깨끗한 종이는 종이류로 재활용할 수 있어요.' },
      leftover: { name:'남은 음식', hint:'한 공기에 약 150g. 남기지 않고 먹는 게 제일 좋아요!' },
      banana:   { name:'바나나 껍질', hint:'음식물 쓰레기는 물기를 잘 빼고 버려요.' },
      vegscraps:{ name:'채소 부스러기', hint:'퇴비통에 넣으면 밭의 영양분이 돼요.' },
      tissue:   { name:'더러운 휴지', hint:'더러운 종이는 재활용이 안 되니 타는 쓰레기로.' },
      snackbag: { name:'과자 봉지', hint:'음식이 묻은 봉지는 타는 쓰레기. 동네 규칙도 확인해봐요.' },
      papercup: { name:'더러운 종이컵', hint:'더러운 종이컵은 종이류로 못 가요. 타는 쓰레기로.' },
      brokencup:{ name:'깨진 그릇', hint:'깨진 것은 신문지에 싸고 「위험」이라고 써서 버려요.' },
      umbrella: { name:'망가진 우산', hint:'금속 살은 안 타는 쓰레기. 고쳐서 오래 쓰면 더 좋아요.' },
      battery:  { name:'건전지', hint:'수거함이 있는 동네가 많아요. 가게에서 물어봐요.' },
    },
    mon: {
      1:{ name:'잎사귀 알', desc:'잎이 달린 초록 알. 종이와 음식물에 강한 몬스터가 태어나요.' },
      2:{ name:'숲슬라임', desc:'낙엽과 종이를 먹고 자라는 숲의 슬라임. 아직 어떤 모습이 될지 몰라요.' },
      3:{ name:'별새싹', desc:'음식물에서 싹튼 작은 새싹. 머리의 별이 건강하다는 표시예요.' },
      4:{ name:'잎사귀 고양이', desc:'잎사귀 꼬리를 가진 숲의 고양이. 쓰레기가 많으면 기분이 나빠져요.' },
      5:{ name:'버섯이', desc:'음식물을 흙으로 되돌려주는 빨간 갓의 버섯.' },
      6:{ name:'숲의 주인', desc:'나무 뿔과 잎 갈기를 가진 숲의 주인. 잘 분리한 자원으로만 자라요.' },
      7:{ name:'별거북', desc:'등딱지에 별이 떠 있는 느긋한 거북.' },
      8:{ name:'숲의 장로', desc:'오랜 세월에 걸쳐 자란 숲의 장로. 지팡이를 짚고 분리 방법을 알려줘요.' },
      9:{ name:'세머리 왕', desc:'세 개의 얼굴을 가진 숲 고양이의 왕. 왕관은 자원을 소중히 한 증표예요.' },
      10:{ name:'정장 고양이', desc:'정장을 차려입은 성실한 고양이. 단정하지만 조금 지쳐 보여요.' },
      11:{ name:'물의 알', desc:'물방울 무늬의 파란 알. 병과 캔에 강한 몬스터가 태어나요.' },
      12:{ name:'보틀린', desc:'물이 든 페트병의 모습. 제대로 분리하면 자원으로 다시 태어나요.' },
      13:{ name:'튜브 물범', desc:'튜브를 쓴 장난기 많은 물범. 바다가 깨끗하면 기뻐해요.' },
      14:{ name:'우산 해파리', desc:'망가진 우산이 바다로 흘러가 해파리가 되었어요.' },
      15:{ name:'별병', desc:'병 속에서 별이 자라는 신기한 모습. 깨끗한 물의 표시예요.' },
      16:{ name:'소라게린', desc:'버려진 병을 집으로 삼은 소라게. 사실은 조개껍데기 집이 좋대요.' },
      17:{ name:'양동이 물범', desc:'빨간 양동이가 트레이드마크인 물범. 양동이는 아껴서 오래 써요.' },
      18:{ name:'물범 킹', desc:'망토와 왕관을 쓴 바다의 왕. 깨끗한 바다를 다스려요.' },
      19:{ name:'물기린', desc:'물빛 무늬를 가진 목이 긴 기린. 높은 곳에서 바다를 바라봐요.' },
      20:{ name:'별순록', desc:'몸에 별이 빛나는 순록. 자원을 많이 모은 아이에게 나타나요.' },
      21:{ name:'불꽃 알', desc:'불꽃에 둘러싸인 빨간 알. 타는 쓰레기에 강한 몬스터가 태어나요.' },
      22:{ name:'꼬마초', desc:'막 불을 붙인 작은 양초. 아직 어떤 모습이 될지 몰라요.' },
      23:{ name:'꼬마드래곤', desc:'갓 태어난 작은 드래곤. 볼이 발그레하고 아직 불을 못 뿜어요.' },
      24:{ name:'불꽃멧돼지', desc:'불꽃에 둘러싸인 멧돼지 아기. 타는 쓰레기 냄새를 맡고 나와요.' },
      25:{ name:'촛대왕', desc:'세 개의 불꽃을 밝히는 양초의 왕. 자원을 소중히 한 아이에게 나타나요.' },
      26:{ name:'양초 고양이', desc:'머리에 양초를 얹은 고양이. 밤길을 함께 걸어줘요.' },
      27:{ name:'불꽃 드래곤', desc:'날카로운 뿔과 큰 날개를 가진 불꽃의 드래곤. 잘 분리한 아이만 만날 수 있어요.' },
      28:{ name:'빨강 드래곤', desc:'작은 날개로 파닥파닥 나는 빨간 드래곤. 기운이 넘쳐요.' },
      29:{ name:'멧돼지 킹', desc:'곤봉과 갑옷을 갖춘 멧돼지 전사. 타는 쓰레기를 줄이는 힘센 친구.' },
      30:{ name:'불등 멧돼지', desc:'등에 불꽃을 두른 멧돼지. 타는 쓰레기가 많으면 나타나요.' },
      31:{ name:'마른나무', desc:'쓰레기투성이 숲에서 자라 말라버린 나무. 다음에는 쓰레기를 줄여봐요.' },
      32:{ name:'헤드론', desc:'더러운 물에 가라앉아 흐물흐물해졌어요. 바르게 분리하면 만나지 않아요.' },
      33:{ name:'뭉게연기', desc:'분리하지 않은 쓰레기를 삼켜 부풀어 오른 연기 덩어리. 우산도 캔도 병도, 제대로 분리했다면 자원이 되었을 텐데…' },
    },
  },
};

/* ============================================================
   コンテンツ翻訳の取り出し（ja は元データにフォールバック）
   ============================================================ */
function tMon(slot, field){
  const pack = CONTENT_I18N[LANG];
  const tr = pack && pack.mon && pack.mon[slot];
  if (tr && tr[field]) return tr[field];
  const base = MONSTER_INFO[slot];
  return base ? (base[field] || '') : '';
}
function tTrash(item, field){
  const pack = CONTENT_I18N[LANG];
  const tr = pack && pack.trash && pack.trash[item.id];
  if (tr && tr[field]) return tr[field];
  return item[field] || '';
}
function tCat(cat, field){
  const pack = CONTENT_I18N[LANG];
  const tr = pack && pack.cat && pack.cat[cat.id];
  if (tr && tr[field]) return tr[field];
  return cat[field] || '';
}
function tType(shape, field){
  const pack = CONTENT_I18N[LANG];
  const tr = pack && pack.type && pack.type[shape];
  if (tr && tr[field]) return tr[field];
  const base = GROUP_META[shape];
  return base ? (base[field] || '') : '';
}
function tRarityLabel(n){
  const pack = CONTENT_I18N[LANG];
  if (pack && pack.rarity && pack.rarity[n]) return pack.rarity[n];
  return RARITY_LABEL[n] || '';
}
