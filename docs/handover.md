# Release handover

## Access

- Live application: https://playbook.abhiraj.net
- Source: https://github.com/abhirajgawai/ai-automation-playbook
- Deployed application commit: `587252c88ee023ba7e706f24520d50868046a9e1` (`587252c`)
- Deployed image: `ai-playbook:587252c` (image ID `sha256:a7a8627b8e54380417ae8192038ec6918fe029813e4a8211e6985900bfd8513e`)
- Previous release (rollback target): commit `32e73b9528c4`, image `ai-playbook:32e73b9528c4` (image ID `sha256:827a9de31c641e23586758b1423f7f76ba4c0f4b290d0a856f538c50939068a9`) — retained on the host.

## What is delivered

This release is the "modern field manual" redesign: a React Flow-based homepage decision map, a consistent ten-part guide learning sequence, a guided multi-step discovery workspace, evidence-driven troubleshooting with a synchronized diagnostic tree, a comparison workspace with a bounded shortlist and explicit-unit cost model, calm project/review/settings workspaces, route-level lazy loading and a recoverable stale-chunk error boundary. Content, local-only data model, deep links and accessibility are preserved from the prior release. It still covers all 159 C01–C13 taxonomy rows structurally (`content-review.md` holds the separate semantic review record).

## Operations

Run all commands from the repository root. Standard commands are documented in `operations.md`. The service is Docker Compose project `ai-playbook`, service `web`, and container `ai-playbook-web-1`. Caddy manages HTTPS automatically. Do not alter the unrelated `hermes` container.

## Verification and limitations

See `verification.md` for exact local and live evidence, including the "Redesign release audit" and "Production release acceptance (redesign, Task 15)" sections. The release passed 32/32 unit tests, a clean typecheck and build, and 66/66 browser journeys both locally and against `https://playbook.abhiraj.net`. Known, documented, non-blocking limitations: a residual header-overflow gap in the untested 900-1199px viewport window (all four mandated viewports are unaffected), and a deliberate warning-color deviation from the design spec's literal hex value to meet WCAG AA contrast. Technology evidence is dated and must be rechecked at least every 90 days; the comparison is guidance, not a live benchmark or endorsement.

## Rollback

```sh
PLAYBOOK_VERSION=32e73b9528c4 docker compose up -d --no-build web
```

Then verify container health and re-run browser journeys per `operations.md`. The prior image was not deleted from the host.
