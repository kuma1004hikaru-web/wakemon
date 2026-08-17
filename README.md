# ワケモン - ごみ分別モンスター育成

ごみを正しく分別してモンスターを育てる、SDGs学習ゲーム(PWA対応)。
4日間(1サイクル)ごみを「えさ」としてあげると、分別の良し悪しに応じて
モンスターが分岐進化し、完成した姿がずかんに登録されます。

## 遊び方

- ブラウザで `index.html` を開く(後述のローカルサーバー推奨)
- 🍱 出てきたごみ(ペットボトル、たべのこし等)を選び、正しい分別先を答えて「えさ」をあげる。まちがえるとよごれ度が上がり、正しい分別方法が表示される
- 目標「1人1日440g」(国の計画の目標値)を超えると警告が出る。全国平均475g(環境省調べ)はくらべる目安として表示
- 4日たつと完成。ずかん(📖)にコレクションされる

## 開発

ビルドツール不要。ファイルを編集してブラウザをリロードするだけ。
Service Worker を使っているため、`file://` 直開きではなくローカルサーバーで確認する:

```
cd wakemon
python -m http.server 8000
# または: npx serve .
```

ブラウザで http://localhost:8000 を開く。
※ 開発中に古いキャッシュが残る場合は、DevTools > Application > Service Workers で
  「Update on reload」を有効にするか、`sw.js` の `CACHE_NAME` の版数を上げる。

## ディレクトリ構成

```
index.html        HTML骨格(画面のDOMとscript読み込み順)
manifest.json     PWA設定(ホーム画面追加・アイコン)
sw.js             Service Worker(オフラインキャッシュ)
css/style.css     全スタイル
js/
  data/waste.js     ごみカテゴリのデータ(重さ・汚染度・豆知識)
  data/monsters.js  モンスターデータ(たまごグループ・進化分岐表・画像割り当て)
  storage.js        セーブデータ(localStorage)
  game.js           ゲームロジック(汚れ度計算・進化分岐の決定)
  render.js         プレースホルダーモンスターのSVG描画
  ui/modal.js       モーダル表示
  ui/raise.js       育成画面・えさやりモーダル・HUD
  ui/dex.js         ずかん画面
  main.js           ゲーム進行(えさやり・日送り・完成)・初期化
assets/art/       モンスターの完成イラスト(slot-<相関図番号>.png)
icons/            PWA用アプリアイコン
```

## モンスター画像の追加方法

1. 画像を `assets/art/slot-<番号>.png` として保存(番号は相関図のスロット番号)
2. `js/data/monsters.js` の `CUSTOM_ART` に1行追加
3. `sw.js` の `APP_SHELL` にパスを追加し、`CACHE_NAME` の版数を上げる

画像が無いスロットは自動でSVGのプレースホルダーが表示されます。
