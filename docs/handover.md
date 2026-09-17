# Release handover

## Access

- Live application: https://playbook.abhiraj.net
- Source: https://github.com/abhirajgawai/ai-automation-playbook
- Deployed application commit: `32e73b9528c4`
- Deployed image: `ai-playbook:32e73b9528c4`

## What is delivered

The static playbook includes explainable problem discovery, 15 substantive guides, search, project-scoped reviews, evidence-narrowing troubleshooting, technology comparison, an explicit cost model, bookmarks, notes, glossary, sources and guarded JSON backup/restore. It covers all 159 C01–C13 taxonomy rows structurally and retains the separate semantic review record in `content-review.md`.

## Operations

Run all commands from the repository root. Standard commands are documented in `operations.md`. The service is Docker Compose project `ai-playbook`, service `web`, and container `ai-playbook-web-1`. Caddy manages HTTPS automatically. Do not alter the unrelated `hermes` container.

## Verification and limitations

See `verification.md` for exact local and live evidence. The release passed 12 unit tests and 11 local plus 11 live browser journeys. The known non-blocking limitation is a build-time main-chunk size warning from bundling the full offline-readable content corpus. Technology evidence is dated and must be rechecked at least every 90 days; the comparison is guidance, not a live benchmark or endorsement.
