# Claude Code Workshop — Hands-on (Task Manager)

AI駆動開発ワークショップ 第2回のハンズオン用プロジェクトです。
ブラウザだけで動くシンプルなタスク管理アプリ（純粋な HTML / CSS / JavaScript、ビルド不要）。

## 動かし方

1. このリポジトリを ZIP でダウンロード（緑色の **Code** ボタン → **Download ZIP**）するか、`git clone` します。
2. 任意の場所に解凍し、VS Code で **ファイル → フォルダーを開く** からそのフォルダーを開きます。
3. `index.html` をエクスプローラー（Finder）でダブルクリックするとブラウザで動作確認できます。
4. 同じフォルダーで Claude Code 拡張機能を起動します。

## 構成

- `index.html` — エントリポイント
- `css/` — スタイル（base / layout / components / utilities）
- `js/` — 機能ごとに1ファイル（app / task / storage / ui / filter / calendar / drag / modal / stats）
- `data/categories.js` — カテゴリ定義

## 使い方

ハンズオンの題材・手順は講義資料（lecture.md）に従ってください。
