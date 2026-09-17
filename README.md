# AI & Automation Playbook

A static engineering reference and local project workspace at https://playbook.abhiraj.net.

The playbook covers all 13 categories in [plan.md](plan.md), with 15 substantive guides, 159 mapped topics, 60 review checks, nine troubleshooting paths, a technology catalogue and glossary. It helps record evidence and uncertainty; checklist completion is not production certification.

Navigation is organized into three modes — Learn (guides, glossary, sources, topic exploration), Decide (start a problem, comparisons, decision paths) and Operate (projects, design review, troubleshooting, saved work) — with React Flow diagrams used wherever spatial or state relationships are clearer than prose, and a complete keyboard-accessible linear text alternative for every diagram. Existing URLs and deep links are unchanged.

## Development

Requires Node 22.12+ and npm. Dependencies are resolved by the committed lockfile.

```sh
npm ci
npm run dev -- --host 127.0.0.1
npm run typecheck
npm test
node scripts/validate-content.mjs
npm run build
```

Browser tests use Playwright Chromium. Install with `npx playwright install chromium --with-deps`, then run `npx playwright test`. See [verification](docs/verification.md) for actual evidence and limitations.

## Deploy

```sh
docker compose build
docker compose up -d
docker compose ps
```

This configuration binds HTTP/HTTPS on the host and serves only `playbook.abhiraj.net`. Check ports and existing reverse proxies before using it on another machine. Caddy obtains and renews TLS certificates in a persistent Docker volume. It also redirects HTTP to HTTPS. See [operations](docs/operations.md) for updates and rollback.

## Content and personal data

Content lives in `src/content/*.json`, separately from presentation. Stable IDs connect guides, sources, checks and troubleshooting. `scripts/validate-content.mjs` checks references and matches every taxonomy bullet in the plan to an authored section. This structural check complements semantic review; it is not a factual accuracy certificate.

Personal projects, answers, reviews, notes and bookmarks live only in browser storage. There are no accounts, analytics, remote content requests, runtime models or backend databases. Export personal data before clearing browser storage or changing devices/origins. Server backups do not contain browser notes.

Technology entries are a dated research snapshot. A reviewed source does not prove every capability or a production guarantee. Unverified licensing, language parity, deployment and failure semantics must be investigated for the intended project.

## Maintenance

Update content and source dates only after actual review. Keep IDs stable; preserve old personal notes when an ID disappears. Increment `CONTENT_VERSION` when guidance changes so reviews can show that their evidence predates the guidance. Run content, unit, browser and production checks before deploying.
