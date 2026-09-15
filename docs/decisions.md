# Implementation decisions

- **Static React/TypeScript/Vite:** matches the approved plan, builds a self-contained bundle and needs no runtime paid API.
- **Structured JSON content:** 159 taxonomy bullets have explicit authored sections. Guides contain applicability, prerequisites, alternatives, examples, failure diagnostics, verification, ownership and revisit triggers. Original engineering recommendations are distinguished from dated technology documentation and hypothetical examples.
- **React Flow with linear controls:** diagrams explain decision relationships; essential navigation and decisions remain accessible without dragging a canvas.
- **localStorage:** the expected personal data is a small collection of text notes and reviews. A 2 MB import cap bounds processing. Storage exceptions and corrupt data require visible recovery, and imports are validated before replacement. This is not a multi-device collaborative database.
- **No service worker:** avoids a stale-cache update lifecycle. HTML revalidates and fingerprinted assets are immutable. Deployment replaces the static image as one release.
- **Caddy container:** ports 80/443 were unused and no existing proxy was configured. A dedicated Compose project owns only the new service and its certificate/config volumes. The existing Hermes service on 8642 and portfolio DNS remain untouched.
- **No fabricated rankings:** documented product facts are separated from user-entered requirements and preference weights. Unknown evidence is not the same as unsupported capability.
- **Scope:** no company-specific material, personal conversation history, credentials or private sources are published. Content is an engineering reference, not certification or individualized legal guidance.
- **Research limitation:** exact installed versions and exhaustive feature parity across every framework are not claimed. The comparison screen identifies verification gaps and directs users to a common failure-testing proof of concept.
