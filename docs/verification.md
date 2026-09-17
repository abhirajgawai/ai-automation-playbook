# Verification evidence

Status: release acceptance passed on 2026-09-17 UTC.

## Confirmed baseline

- Fresh clone at base commit `6039925`, no prior application or user edits.
- GitHub authenticated; push dry-run succeeded.
- VPS IPv4 and playbook A record both `187.127.219.78`; no AAAA returned.
- HTTP/HTTPS ports unused before this deployment; no existing nginx/Caddy config.
- Existing `hermes` container running with `unless-stopped` on port 8642.
- Apex and www portfolio returned HTTP 200 from Vercel before changes.
- Node 22.22.1, Docker Compose 5.5.0; 3.8 GiB RAM plus swap.

## Content

`node scripts/validate-content.mjs` passed: 13 categories, 15 guides, 159 mapped taxonomy topics, 60 checklist items, nine troubleshooting paths, 20 technology options and 82 source records. It checks unique IDs, valid references, guide fields, HTTPS sources, stages and exact plan-to-section mapping. Semantic quality and its remediation trail are recorded separately in `content-review.md`.

## Frontend review

An independent review identified corrupt-storage overwrite, incomplete nested import validation, merge loss, project routing and missing UI fields. Fixes and regression evidence are tracked in `ui-report.md` and `frontend-review.md`. Initial empty-content build/unit success was not treated as final acceptance.

## Local release acceptance

- `npm test`: 12/12 unit tests passed.
- `npm run typecheck`: passed.
- `npm run build`: passed, including the content validator above.
- `npx playwright test`: 11/11 browser journeys passed in Chromium. Coverage includes primary routes, zero external runtime requests, search and refreshed deep links, project isolation, notes/bookmarks, corrupt-storage recovery, review evidence, troubleshooting narrowing, invalid-import safety, keyboard access, mobile overflow and serious/critical axe checks.
- `git diff --check`: passed before the release commit.
- Vite emitted one non-blocking warning for the 546.73 kB uncompressed main JavaScript chunk; the complete local content corpus accounts for most of it, while React Flow is separately lazy-loaded.

## Production release acceptance

- Application commit: `32e73b9528c4`.
- Image: `ai-playbook:32e73b9528c4`; image ID `sha256:827a9de31c641e23586758b1423f7f76ba4c0f4b290d0a856f538c50939068a9`; size 24,471,132 bytes.
- Container health reached `healthy` after deployment and again after an explicit `docker compose restart web`.
- `http://playbook.abhiraj.net` returned 308 to HTTPS. The homepage and `/guides/durable-execution` returned 200.
- TLS certificate CN is `playbook.abhiraj.net`, issued by Let's Encrypt, valid 2026-09-15 through 2026-12-14. HSTS, CSP, permissions, referrer, content-type and frame protections were present.
- The full 11-test Playwright suite passed against `https://playbook.abhiraj.net` after deployment.
- Runtime is bounded to 256 MiB RAM and 0.5 CPU, uses `unless-stopped`, `no-new-privileges`, and rotated JSON logs (10 MiB × 3).
- Existing `hermes` remained up on port 8642. `https://abhiraj.net` and `https://www.abhiraj.net` continued to return 200.

The production application has no backend, runtime AI calls, analytics or external data requests. Personal data remains in the visitor's browser unless they export it.
