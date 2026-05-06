# タスク管理アプリ

## プロジェクト概要

ブラウザだけで動くシンプルなタスク管理アプリ。
ビルド不要・依存なし（純粋な HTML / CSS / JavaScript）。
`index.html` をブラウザで開けば動く。

## ディレクトリ構成

- `index.html` — エントリポイント
- `css/` — スタイル
  - `base.css` — CSS変数・リセット
  - `layout.css` — レイアウト
  - `components.css` — UIコンポーネント（`.btn` `.btn-icon` など）
  - `utilities.css` — ユーティリティ
- `js/` — 機能ごとに1ファイル
  - `app.js` — 起動処理
  - `task.js` — タスクのCRUD
  - `storage.js` — localStorage 永続化
  - `ui.js` — DOM描画
  - `data.js` — カテゴリ・優先度・ステータスの定義
  - `filter.js` / `calendar.js` / `drag.js` / `modal.js` / `stats.js` — それぞれの機能

## コーディング規約

- **新しい機能は `js/<feature>.js` として独立したファイルにする**（既存ファイルに混ぜ込まない）
- **状態の永続化は `storage.js` 経由**で localStorage に保存する。`localStorage` を直接呼ばない
- アイコン型のボタンは `.btn-icon` クラスを使う（既存の編集・削除ボタンと揃える）
- テキスト型のボタンは `.btn .btn-primary` または `.btn .btn-secondary`
- 色は CSS変数（`--color-primary` など `base.css` で定義）を使い、新しい色を直接書かない
- コメント・UIテキストは日本語
- 関数は ES5 互換の `function` 宣言（既存コードと揃える）

## やってはいけないこと

- 外部ライブラリの導入（jQuery / React / Vue / npm など）
- ビルドツールの追加（webpack / vite など）
- `localStorage` への直接アクセス（必ず `storage.js` の `loadTasks` / `saveTasks` 経由）
- 既存ファイルへの大規模な書き換え（新しい機能は新しいファイルへ）
