# Nexus Pages

> [Nexus Bot](https://github.com/OCxeRu2951/DiscordBot-Nexus) の公開情報サイト

[![Cloudflare Pages](https://img.shields.io/badge/デプロイ先-Cloudflare%20Pages-f07830?logo=cloudflare&logoColor=white)](https://nexus-pages.pages.dev)
[![License](https://img.shields.io/badge/ライセンス-AGPL--3.0-blue)](./LICENSE)

[Click here for the English README.](../README.md)

---

## 概要

Nexus PagesはNexus Botの公開情報サイトです。Bot導入ガイド・法的ドキュメント・申請状況確認ページを提供します。

## ページ一覧

| パス | 内容 |
| --- | --- |
| `/` | Bot紹介・導入ガイド |
| `/install` | 機能一覧・開発進捗・導入手順 |
| `/status` | 申請状況確認（ID検索） |
| `/terms` | 利用規約 |
| `/privacy` | プライバシーポリシー |

## 機能

- **導入ガイド** — 機能一覧・アニメーション付き進捗グラフ・ステップ別導入手順
- **申請状況確認** — 申請ID（`APL-YYYYMMDD-XXXX`）で承認・拒否状況を検索（内容・コメントは非表示）
- **ダーク / ライトモード** — システム設定に応じた自動切り替え・手動切り替え
- **多言語対応** — 日本語・英語
- **ミニマルデザイン** — オレンジ（`#f07830`）と黒（`#0f0e0c`）のテーマ

## 技術スタック

| レイヤー | 技術 |
| --- | --- |
| ページ | 静的HTML + CSS + Vanilla JS |
| API | Cloudflare Pages Functions |
| データベース | Turso (libSQL) — 読み取り専用（申請状況エンドポイントのみ） |
| ホスティング | Cloudflare Pages |

## プロジェクト構成

```dir
nexus-pages/
├── public/
│   ├── index.html      # Bot紹介ページ（導入ガイド）
│   ├── install.html
│   ├── terms.html
│   ├── privacy.html
│   ├── status.html
│   ├── shared.css      # 共通スタイル（ダーク/ライトテーマ）
│   ├── shared.js       # テーマ・言語切り替え
│   └── favicon.svg
├── functions/
│   └── api/
│       ├── _utils/
│       │   └── db.js
│       └── applications/
│           └── [id].js  # 公開ステータスAPIエンドポイント
├── wrangler.toml
└── package.json
```

## API

### `GET /api/applications/:id`

申請IDでステータスを返します。プライバシー保護のため、内容・コメントは**返しません**。

**リクエスト**

```
GET /api/applications/APL-20260514-XXXX
```

**レスポンス**

```json
{
  "id": "APL-20260514-XXXX",
  "status": "approved",
  "created_at": 1747180800000,
  "resolved_at": 1747267200000,
  "username": "example_user"
}
```

**statusの値:** `pending`（未処理） / `approved`（承認） / `rejected`（拒否） / `revoked`（取消）

## 開発環境のセットアップ

### 前提条件

- Node.js 20以上
- Wrangler CLI

### セットアップ

```bash
git clone https://github.com/OCxeRu2951/Nexus-Pages.git
cd nexus-pages
npm install
```

プロジェクトルートに `.dev.vars` を作成します。

```env
TURSO_URL=libsql://your-db.turso.io
TURSO_AUTH_TOKEN=your_turso_token
```

### ローカル起動

```bash
npm run dev
```

`http://localhost:8788` をブラウザで開いてください。

### デプロイ

```bash
npx wrangler pages deploy public --project-name=nexus-pages --branch=main
```

## 環境変数

| 名前 | 説明 |
| --- | --- |
| `TURSO_URL` | TursoデータベースのURL |
| `TURSO_AUTH_TOKEN` | Tursoの認証トークン |

## 関連リポジトリ

- [Nexus Bot](https://github.com/OCxeRu2951/DiscordBot-Nexus) — Bot本体
- [Nexus Dashboard](https://github.com/OCxeRu2951/Nexus-Dashboard) — 管理ダッシュボード

## ライセンス

[AGPL-3.0](./LICENSE) © 2026 OCxeRu2951
