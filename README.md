# Claude Code Workshop — Hands-on (Task Manager)

AI駆動開発ワークショップ 第2回のハンズオン用プロジェクトです。
ブラウザだけで動くシンプルなタスク管理アプリ（純粋な HTML / CSS / JavaScript、ビルド不要）。

## 動かし方

1. `git clone https://github.com/Tsubasa-Kikuchi98/claude-code-workshop-handson.git` で取得します（後述のブランチを使うため、ZIP ダウンロードではなく `git clone` を推奨）。
2. VS Code で **ファイル → フォルダーを開く** からそのフォルダーを開きます。
3. `index.html` をエクスプローラー（Finder）でダブルクリックするとブラウザで動作確認できます。
4. 同じフォルダーで Claude Code 拡張機能を起動します。

## ハンズオンごとのブランチ

各ハンズオンの出発点となる資材を、ブランチに分けて用意しています。当日は講義の指示に従ってブランチを切り替えてください。

| ブランチ | 用途 |
|---------|------|
| `main` | 初期状態（CLAUDE.md・Skill・hook なし） |
| `handson-01-claudemd` | ハンズオン①「CLAUDE.md を書いてみる」の出発点（`CLAUDE.md.sample` 同梱） |
| `handson-02-skill` | ハンズオン②「複数ファイルの Skill」の出発点（`CLAUDE.md` ＋ PR説明文 Skill 一式） |
| `handson-03-hook` | ハンズオン③「hook を発火させてみる」の出発点（hook 設定済み `.claude/settings.json` ） |

切替例：

```bash
git restore . && git clean -fd        # 直前のハンズオンの作業状態をリセット
git checkout handson-02-skill         # ハンズオン②用ブランチへ
```

## 構成

- `index.html` — エントリポイント
- `css/` — スタイル（base / layout / components / utilities）
- `js/` — 機能ごとに1ファイル（app / task / storage / ui / filter / calendar / drag / modal / stats）
- `data/categories.js` — カテゴリ定義

## 使い方

ハンズオンの題材・手順は講義資料（lecture.md）に従ってください。
