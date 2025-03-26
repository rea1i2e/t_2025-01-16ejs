# ejsを使った静的コーディング環境

## 使用環境
- Node.js バージョン14系以上
- npm バージョン8以上
- バージョンは、以下のコマンドで確認
  - `node -v`
  - `npm -v`

## 導入手順
- `cd` コマンドで、`gulp/`へ移動
- `npm i` を実行
- `gulp/`に`node_modules`、`package-lock.json`が生成されたことを確認
- `npx gulp`でタスクランナー起動
- `srcフォルダ`内のみで構築する
- `srcフォルダ`内に入力した情報は自動的に`distフォルダ`に反映されます
- `distフォルダ`はアップロードするファイルなので編集は厳禁

## テンプレートファイルの特徴
  - src/sass/global/_breakpoints.scssにある変数を`pc` or `sp`に設定することで、spファースト・pcファーストの切り替えが可能です。（初期値：`sp`）
  - サイズ指定は、原則rem()を使います
  - font-sizeは、maxrem()の単位を使うことで、10px未満にならないように指定できます。
  - picture.ejsを使うことで、pictureタグを出力可能です。
  - src/root/内にファイルを設置すると、dist直下にコピーされます。（画像やJSファイルなど圧縮せずそのまま設置したいとき）
  - サイト内のパス指定（相対パス） href="<% ROOT_PATH + json[`jsonファイルで指定したページのキー`][`path`] %>"
  - 例：<% ROOT_PATH + json[`components`][`path`] %>
  - サイト外のパス指定（絶対パス） href="<% DOMAIN + json[`jsonファイルで指定したページのキー`][`path`] %>"
  - 例：<% DOMAIN + json[`about`][`path`] %>
  - 詳細は、以下のNotionページで説明しています。
https://rea1i2e.notion.site/EJS-17d0f4d891158097b04cf986ebe3078f?pvs=4
  
## その他
- 提出時は`npx gulp build`コマンドで、`assets/`内の不要なファイル（`scr/`で削除したもの）を削除できます。
