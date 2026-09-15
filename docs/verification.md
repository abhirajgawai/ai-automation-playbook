# Verification evidence

Status: implementation and final acceptance in progress. Do not interpret this file as a completed release until the final results below are recorded.

## Confirmed baseline

- Fresh clone at base commit `6039925`, no prior application or user edits.
- GitHub authenticated; push dry-run succeeded.
- VPS IPv4 and playbook A record both `187.127.219.78`; no AAAA returned.
- HTTP/HTTPS ports unused before this deployment; no existing nginx/Caddy config.
- Existing `hermes` container running with `unless-stopped` on port 8642.
- Apex and www portfolio returned HTTP 200 from Vercel before changes.
- Node 22.22.1, Docker Compose 5.5.0; 3.8 GiB RAM plus swap.

## Content

`node scripts/validate-content.mjs` passed: 13 categories, 15 guides, 159 mapped taxonomy topics, 60 checklist items, nine troubleshooting paths, 18 technology options and 81 source records. It checks unique IDs, valid references, guide fields, HTTPS sources, stages and exact plan-to-section mapping. Semantic quality is assessed separately.

## Frontend review

An independent review identified corrupt-storage overwrite, incomplete nested import validation, merge loss, project routing and missing UI fields. Fixes and regression evidence are tracked in `ui-report.md` and `frontend-review.md`. Initial empty-content build/unit success was not treated as final acceptance.

## Final acceptance

Pending final browser, production image, HTTPS, restart, unchanged-service and repository checks.
