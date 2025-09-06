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

## JavaScriptのバンドル設定
- `src/js/`配下のJavaScriptファイルは、webpackでバンドルされます
- エントリーポイントは`src/js/index.js`です
- バンドルされたファイルは`dist/assets/js/bundle.js`に出力されます
- モジュール分割の例：
  - `src/js/index.js` - メインのエントリーポイント
  - `src/js/_drawer.js` - ドロワーメニュー関連のモジュール
  - `src/js/_slider.js` - スライダー関連のモジュール
  - `src/js/_modal.js` - モーダル関連のモジュール
  - アンダースコア（_）で始まるファイルは、モジュールファイルとして扱われます

## テンプレートファイルの特徴
  - src/sass/global/_breakpoints.scssにある変数を`pc` or `sp`に設定することで、spファースト・pcファーストの切り替えが可能です。（初期値：`sp`）
  - サイズ指定は、原則rem()を使います
  - font-sizeは、maxrem()の単位を使うことで、10px未満にならないように指定できます。
  - picture.ejsを使うことで、pictureタグを出力可能です。
  - src/root/内にファイルを設置すると、dist直下にコピーされます。（画像やJSファイルなど圧縮せずそのまま設置したいとき）
  - サイト内のパス指定（相対パス） href="<% ROOT_PATH + json[`jsonファイルで指定したページのキー`][`path`] %>"
  - 例：<%- ROOT_PATH + json[`components`][`path`] %>
  - サイト外のパス指定（絶対パス） href="<%- DOMAIN + json[`jsonファイルで指定したページのキー`][`path`] %>"
  - 例：<%- DOMAIN + json[`about`][`path`] %>
  - 詳細は、以下のNotionページで説明しています。
https://rea1i2e.notion.site/EJS-17d0f4d891158097b04cf986ebe3078f?pvs=4
  
## その他
- 提出時は`npx gulp build`コマンドで、`assets/`内の不要なファイル（`scr/`で削除したもの）を削除できます。

## GitHub Actions自動デプロイ

このプロジェクトには、GitHub Actionsを使用した自動デプロイ機能が設定されています。

### 自動デプロイの仕組み
- `main`ブランチにコードをプッシュすると自動的にデプロイが実行されます
- ビルドプロセス（`npx gulp build`）が自動実行され、`dist`フォルダが生成されます
- 生成された`dist`フォルダの内容がFTPサーバーに自動アップロードされます
- デプロイ結果がDiscordに通知されます（設定済みの場合）

### 必要な設定
#### 1. GitHub Secretsの設定
リポジトリの Settings → Secrets and variables → Actions で以下を設定してください：

| Secret名 | 説明 | 必要性 |
|----------|------|--------|
| `FTP_SERVER` | FTPサーバーのアドレス | 必須 |
| `FTP_USERNAME` | FTPユーザー名 | 必須 |
| `FTP_PASSWORD` | FTPパスワード | 必須 |
| `DISCORD_WEBHOOK` | Discord通知用Webhook URL | オプション |
| `TEST_URL` | テスト環境のURL | オプション |

#### 2. デプロイ設定ファイル
- `.github/workflows/main.yml` - 自動デプロイの設定ファイル
- このファイルは既に設定済みです

### デプロイの流れ
1. **コードチェックアウト** - GitHubからソースコードを取得
2. **Node.js環境セットアップ** - Node.js 20をインストール
3. **依存関係キャッシュ** - npm依存関係を高速化のためキャッシュ
4. **依存関係インストール** - `npm install`を実行
5. **プロジェクトビルド** - `npm run build`（= `gulp build`）を実行
6. **ビルド結果検証** - `dist`フォルダが正常に生成されているか確認
7. **FTPデプロイ** - `dist`フォルダの内容をサーバーにアップロード
8. **Discord通知** - 成功・失敗結果をDiscordに送信

### 手動デプロイとの違い
| 項目 | 手動デプロイ | 自動デプロイ |
|------|-------------|-------------|
| 作業者 | 開発者が手動実行 | GitHub Actionsが自動実行 |
| ビルド | `npx gulp build` | 自動で`npm run build` |
| アップロード | FTPクライアントで手動 | 自動でFTPアップロード |
| 通知 | なし | Discord通知あり |
| 時間 | 5-10分 | 2-3分 |
| エラー対応 | 手動で確認・修正 | ログで詳細確認可能 |

### トラブルシューティング
#### デプロイが失敗した場合
1. GitHubリポジトリの「Actions」タブでログを確認
2. エラーメッセージを確認して以下をチェック：
   - FTP認証情報（Secrets）が正しく設定されているか
   - `gulp/package.json`に`"build": "gulp build"`スクリプトがあるか
   - ビルドエラーがないか

#### よくあるエラー
- **`ENOENT: no such file or directory, scandir './dist/'`**
  → ビルドが失敗して`dist`フォルダが生成されていません
  → ローカルで`cd gulp && npm run build`を実行してエラーを確認

- **FTP connection failed**
  → FTP認証情報（Server, Username, Password）をGitHub Secretsで再確認

### デプロイ状況の確認方法
- **GitHub**: リポジトリの「Actions」タブで実行状況・ログを確認
- **Discord**: 設定済みの場合、チャンネルに成功・失敗通知が届きます

## その他
- 提出時は`npx gulp build`コマンドで、`assets/`内の不要なファイル（`scr/`で削除したもの）を削除できます。
- 本番環境では自動デプロイを活用することで、効率的な開発・公開が可能です。
