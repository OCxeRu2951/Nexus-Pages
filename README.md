# Nexus Pages

> Public information site for [Nexus Bot](https://github.com/OCxeRu2951/DiscordBot-Nexus)

[![Cloudflare Pages](https://img.shields.io/badge/Deployed%20on-Cloudflare%20Pages-f07830?logo=cloudflare&logoColor=white)](https://nexus-pages.pages.dev)
[![License](https://img.shields.io/badge/license-AGPL--3.0-blue)](./LICENSE)

[日本語のREADMEはこちら](./README/ja-README.md)

---

## Overview

Nexus Pages is the public-facing website for Nexus Bot. It provides bot installation guides, legal documents, and an application status checker.

## Pages

| Path | Description |
| --- | --- |
| `/` | Bot introduction and installation guide |
| `/install` | Feature overview, development progress, setup steps |
| `/status` | Application status checker (ID search) |
| `/terms` | Terms of Service |
| `/privacy` | Privacy Policy |

## Features

- **Install Guide** — Feature overview, animated progress chart, step-by-step setup instructions
- **Application Status** — Search by application ID (`APL-YYYYMMDD-XXXX`) to check approval/rejection status
- **Dark / Light Mode** — System preference detection with manual toggle
- **Multilingual** — Japanese and English
- **Minimal Design** — Orange (`#f07830`) and black (`#0f0e0c`) theme

## Tech Stack

| Layer | Technology |
| --- | --- |
| Pages | Static HTML + CSS + Vanilla JS |
| API | Cloudflare Pages Functions |
| Database | Turso (libSQL) — read-only, status endpoint only |
| Hosting | Cloudflare Pages |

## Project Structure

```dir
nexus-pages/
├── public/
│   ├── index.html      # Bot introduction (install guide)
│   ├── install.html
│   ├── terms.html
│   ├── privacy.html
│   ├── status.html
│   ├── shared.css      # Common styles (dark/light theme)
│   ├── shared.js       # Theme and language toggle
│   └── favicon.svg
├── functions/
│   └── api/
│       ├── _utils/
│       │   └── db.js
│       └── applications/
│           └── [id].js  # Public status API endpoint
├── wrangler.toml
└── package.json
```

## API

### `GET /api/applications/:id`

Returns the status of an application by ID. Content and comments are **not** returned for privacy.

**Request**

```search
GET /api/applications/APL-20260514-XXXX
```

**Response**

```json
{
  "id": "APL-20260514-XXXX",
  "status": "approved",
  "created_at": 1747180800000,
  "resolved_at": 1747267200000,
  "username": "example_user"
}
```

**Status values:** `pending` / `approved` / `rejected` / `revoked`

## Development

### Prerequisites

- Node.js 20+
- Wrangler CLI

### Setup

```bash
git clone https://github.com/OCxeRu2951/Nexus-Pages.git
cd nexus-pages
npm install
```

Create `.dev.vars`:

```env
TURSO_URL=libsql://your-db.turso.io
TURSO_AUTH_TOKEN=your_turso_token
```

### Run locally

```bash
npm run dev
```

Open `http://localhost:8788`

### Deploy

```bash
npx wrangler pages deploy public --project-name=nexus-pages --branch=main
```

## Environment Variables

| Name | Description |
|---|---|
| `TURSO_URL` | Turso database URL |
| `TURSO_AUTH_TOKEN` | Turso auth token |

## Related

- [Nexus Bot](https://github.com/OCxeRu2951/DiscordBot-Nexus) — The Discord bot itself
- [Nexus Dashboard](https://github.com/OCxeRu2951/Nexus-Dashboard) — Admin dashboard

## License

[AGPL-3.0](./LICENSE) © 2026 OCxeRu2951
