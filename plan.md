# AI & Automation Playbook — Product, Content, Engineering and Deployment Plan

Status: Approved product direction; implementation brief for Astra in Codex.
Prepared: 2026-09-15.
Repository: https://github.com/abhirajgawai/ai-automation-playbook
Target URL: https://playbook.abhiraj.net

## 1. Mission and intended outcome

Build a polished, interactive, practical reference application that Abhi can use every day while discovering, designing, implementing, evaluating, deploying, and operating production AI and automation systems.

The user calls this a daily "bible": a dependable navigation aid through uncertainty. It must help an engineer ask better questions, select appropriate approaches, recognize missing evidence, diagnose failures, and make defensible decisions. It must not imply that following a checklist guarantees correctness or eliminates hallucinations.

This is a general-purpose playbook, not a specification for one business workflow and not an internal company knowledge base. It should work across employers, projects, domains, and technology stacks. Use hypothetical examples and public sources only. Do not publish personal conversation history, private emails, employer information, or credentials.

Audience: a senior software engineer experienced in .NET, APIs, web applications, testing, and backend architecture, extending that foundation into production AI/automation. Explain new AI concepts clearly without turning every page into a beginner tutorial. Include .NET/Azure examples where useful, but do not make them defaults that exclude other stacks.

The application is itself a static reference and decision-support tool. It does not run agents, inspect a user's code automatically, make production changes, or call paid model APIs.

## 2. Settled product and infrastructure decisions

- React + TypeScript, with React Flow for meaningful interactive decision graphs.
- Static frontend; no application backend, SQLite, hosted database, accounts, or paid AI API for this release.
- Structured, versioned content separate from presentation; JSON is preferred.
- Personal project reviews, notes, answers, and bookmarks persist only in the browser.
- Export/import is required. There is no automatic cross-device sync.
- Public website initially. Protection can be added later at the hosting layer.
- Mobile and desktop access, keyboard accessibility, light and dark themes.
- Build and deploy directly on the same Ubuntu VPS where Codex is already configured.
- Docker is installed. Do not assume Node, npm, a proxy, Compose, or browser-test dependencies are installed.
- Repository was empty when this plan was prepared.
- User configured a DNS A record: host playbook, value 187.127.219.78, automatic TTL.
- This IP is user-configured, not independently verified here. Verify the target VPS identity and live DNS before deployment.
- Existing apex and www records serve the user's portfolio elsewhere. Preserve them.
- The user has authorized deployment of this new application, its containers, application-specific storage, and web-server routing while preserving existing services.
- GitHub authentication in this VPS environment must be verified; access from another chat does not establish it.
- This Markdown file is an implementation handoff, explicitly requested by the user. The delivered playbook experience must be a website, not a Markdown document viewer.

## 3. Execution mandate and flexibility

Proceed autonomously through implementation, substantive content authoring, verification, and deployment. Do not stop after a scaffold, proposed plan, screenshot, or placeholder dashboard. An overnight run is the intent, not a reason to claim unverified completion.

You have broad discretion over visual design, component organization, search library, local persistence mechanism, information architecture, additional useful guides, and implementation details. Improve this plan when evidence supports doing so. Record material deviations and their rationale.

Boundaries:
- Follow actual environment permissions and repository instructions. Never bypass approval or access controls.
- Do not buy services, configure paid integrations, or introduce paid runtime dependencies.
- Do not delete or disrupt existing sites, agents, containers, networks, volumes, proxy routes, firewall rules, or SSH access.
- Do not expose Docker's socket or a development server publicly.
- Do not add a backend, authentication service, runtime LLM, or telemetry that sends user notes off-device without a new user decision.
- Never commit credentials, certificate private keys, local exports, or server configuration containing secrets.
- Research publicly available current documentation. Do not fabricate sources, framework capabilities, test results, pricing, or dates.
- If a choice is reversible and within scope, decide and document it. Ask only when a genuinely consequential missing decision cannot be safely resolved.
- If infrastructure access or DNS blocks deployment, continue all independent work and deliver a tested deployable build with exact outstanding steps.
- Maintain progress in the repository so another context window/session can continue without reconstructing this conversation.

## 4. Product success criteria

The application must let a user:
1. Find relevant guidance quickly through question-oriented search and browsing.
2. Follow a new problem from business discovery to release considerations.
3. Understand alternatives and trade-offs rather than receive unexplained recommendations.
4. Record project-specific design reviews and supporting evidence.
5. Troubleshoot cost, progress, context, memory, retrieval, tool, and quality failures.
6. Reopen saved work after a browser restart.
7. Export and restore all personal state.
8. Read substantive coverage of all 13 categories.
9. Distinguish durable principles from time-sensitive technology comparisons.
10. Access the deployed site over HTTPS without affecting existing services.

Checklist completion is not production certification. Show unresolved evidence, assumptions, exceptions, and manual review needs. Avoid a misleading single "AI readiness score."

## 5. Information architecture and user journeys

### 5.1 Main navigation

Recommended sections:
- Home / Continue
- Start a Problem
- Explore Playbook
- Review a Design
- Troubleshoot
- Compare Approaches
- My Projects
- Bookmarks
- Glossary
- Sources / What's Changed
- Settings / Export & Import

Use judgment to consolidate navigation without hiding capabilities.

### 5.2 Home

Create a useful workspace, not a marketing landing page:
- Prominent search.
- Four primary actions: start a problem, explore, review a design, troubleshoot.
- Resume recent project or guide.
- Clear category overview, saved items, and unresolved review items.
- First-use explanation of local-only storage; no fake statistics or fictional activity.
- Sensible empty states.

### 5.3 Start a Problem

Create a named local project or explore without saving. Ask short questions covering:
- Intended business outcome and current process.
- Available data, systems, process stability, and exceptions.
- Whether fixed rules can solve the task.
- Consequence and reversibility of errors.
- Read-only, draft, approved action, or autonomous action.
- Synchronous versus long-running requirements.
- Volume, latency, budget, human-review capacity.
- Existing stack and operational constraints.

Every question supports "unknown" where appropriate. The result is a transparent list of relevant decisions, guides, checks, and evidence gaps. Explain which answers triggered guidance. Do not pretend these rules are an AI architecture consultant or automatically choose a universally best framework.

Changing an upstream answer must invalidate or recompute dependent results rather than leave stale recommendations.

### 5.4 Explore a guide

Each guide has a concise summary, when to use it, alternatives, trade-offs, common mistakes, decision criteria, verification, sources, and related material. Use progressive disclosure for depth, not hidden critical warnings. Support deep links and browser back/forward.

### 5.5 Review a Design

Stages: discovery, architecture, implementation, pre-release, operations.
Statuses: not reviewed, satisfied, needs evidence, unresolved, not applicable.
Allow evidence notes/URLs, rationale for non-applicability, assumptions, owner text, and revisit triggers.
Each project is independent. Show coverage and unresolved issues, not false certification.
Capture content version at review time; flag relevant changed guidance after an update.

### 5.6 Troubleshoot

Start from a symptom, then narrow plausible causes, diagnostic evidence, safe mitigation, and durable fixes.
Core symptoms:
- Agent stalls, loops, repeats actions, or delegates endlessly.
- Worker crashes or recovery duplicates business actions.
- Context is missing, truncated, contradictory, or ignored.
- Memory is stale, wrong, polluted, or crosses user boundaries.
- Retrieval returns irrelevant/incomplete/unauthorized information.
- Wrong tool, malformed arguments, tool timeout, or false success.
- Costs increase, latency worsens, queues grow, provider limits hit.
- Offline evaluations pass but users report poor quality.
- New model/prompt/framework deployment causes regression.

Distinguish symptoms from diagnoses. Do not suggest unconditional retries for uncertain side effects.

### 5.7 Comparisons

Provide approachable side-by-side comparisons of architectures, patterns, context strategies, memory strategies, evaluation approaches, tool designs, and framework categories.
Technology entries need source, verification date, supported language/deployment notes, limitations, and evidence status.
Separate mandatory requirements from weighted preferences. Unknown capability is "unverified", not "unsupported."
A scorecard assists investigation; it must not conceal weights or fabricate precision.

## 6. Complete content taxonomy: 13 mandatory categories

Assign stable IDs C01–C13. Every bullet below must map to authored content and appropriate verification in a coverage registry. It need not have its own page if a coherent guide covers it.

### C01 — Business discovery, suitability, and value

- Process mapping, users, stakeholders, goals, process owner, current pain and baseline.
- Process simplification before automation; stable rules versus judgment and ambiguity.
- Volume, variability, exceptions, seasonality, data readiness and access feasibility.
- Manual versus conventional automation versus fixed AI workflow versus autonomous agent.
- Error economics: wrong action, missed action, delay, escalation, review and rework.
- Success criteria, acceptance thresholds, scope, exclusions, autonomy levels.
- Reversibility, impact, human capacity, opportunity cost, feasibility, ROI.
- Prioritization, small experiments, stop/continue criteria, validating real adoption.
- How to say "we need more evidence" or "do not automate this."

### C02 — System design principles and architecture

- SOLID, separation of concerns, explicit contracts, domain boundaries, dependency inversion.
- Typed inputs/outputs plus semantic validation; schema validity is not correctness.
- Business invariants, explicit state/transitions, authoritative systems, ownership.
- Deterministic rules around probabilistic decisions; bounded autonomy.
- Synchronous/API, queued, scheduled, event-driven, and long-running execution.
- Distributed-system fundamentals: consistency, concurrency, transaction boundaries.
- Build only necessary abstraction; one step does not imply one agent.
- Deployment boundaries, modularity, portability, maintainability, change isolation.
- Risk-proportionate design, uncertainty, architectural decision records.

### C03 — Workflow and multi-agent patterns

- Sequential pipelines/prompt chaining, routing, fan-out/fan-in, aggregation.
- Orchestrator–workers, handoffs, plan/execute, evaluator–optimizer.
- Human interrupt/resume, durable state machines, saga/compensating actions.
- Single-agent/multitool versus multi-agent; dependencies and parallelizability.
- Task boundaries, ownership, delegation contracts, outputs, tools and context.
- Conflicting results, correlated model errors, shared-state races.
- Parent/child lifecycle, shared resource budgets, depth/width limits.
- Repeated handoff, stalled convergence, cancellation propagation, stopping.
- Asynchronous versus synchronous coordination trade-offs.
- Pattern examples and failure modes; avoid multi-agent complexity without evidence.

### C04 — Framework, platform, model, and provider selection

- Discover current ecosystem rather than restrict to names from this discussion.
- Compare conventional workflow engines, event platforms, agent runtimes, managed cloud platforms, low-code tools, and thin custom implementations.
- Candidates to investigate, not predetermined winners: LangGraph/LangChain, Microsoft Agent Framework, CrewAI, Google ADK, PydanticAI, AutoGen where current, Semantic Kernel where current, LlamaIndex, Haystack, Agno, Strands, provider SDKs, Temporal, Azure Durable Functions, Dapr Workflow, n8n, and other relevant maintained options.
- Hindsight, Flue, Paperclip and similar products may occupy complementary layers; verify exact current scope and maturity.
- Treat names as research leads; verify current status, successor/deprecation, version, license, features and production limitations.
- Distinguish model, provider/router, SDK, harness, orchestrator, memory layer, retrieval system, and developer coding subscription.
- Hard requirements: persistence, approvals, failure semantics, security, deployment, stack fit, operations, budget.
- Team skills, maintainability, build/buy, managed/self-hosted, licensing, costs, lock-in, export and migration.
- Comparable POCs using common tasks, failure tests, budgets, and documented weights.
- Model task quality, tool calling, structured outputs, latency, language/document needs, context and privacy.
- Routing, fallback equivalence, provider outages, model retirement, version pinning where possible.
- Prompting versus retrieval versus fine-tuning; choose the intervention matching the failure.
- Record assumptions and revisit criteria; never rank models solely on public benchmarks.

### C05 — Prompts, context, data, retrieval, and memory

- Clear instructions, examples, instruction hierarchy, structured outputs and grounding.
- Context assembly: task, instructions, tools, history, state, retrieved evidence.
- Token allocation, output/tool-result headroom, just-in-time retrieval.
- Sliding window, summarization, compaction, tool-result clearing, external artifacts.
- Test preservation of goals, constraints, pending actions and evidence after compaction.
- Context isolation between projects, tenants, agents and trust levels.
- Distinguish storage loss, retrieval omission, attention failure and stale knowledge.
- RAG versus direct API/SQL access; RAG versus long context; when neither is required.
- Ingestion, parsing/OCR, tables, chunking, embeddings, metadata, indexes.
- Keyword/vector/hybrid retrieval, reranking, query transformation and access filtering.
- Recall/relevance, groundedness, completeness, citation support, conflicting sources.
- Document updates, deletions, freshness, lineage, authoritative source selection.
- Execution state versus conversation versus long-term memory versus business database.
- Semantic facts/preferences, episodic examples, procedural guidance.
- Explicit/inferred memory writes, synchronous/background writes, approval of sensitive changes.
- Namespaces, provenance, confidence limitations, deduplication, contradictions.
- TTL, correction, deletion propagation, retention, poisoning, stale assumptions.
- Relational/key-value/vector/graph storage choices, driven by access patterns.
- Memory is not automatic learning or truth; critical permissions are not conversational memories.

### C06 — Tools, integration, and implementation quality

- Names, descriptions, schemas, non-overlap, discovery, restricted tool sets.
- Fine-grained wrappers versus business operations; ergonomics and tool-choice evaluation.
- Argument validation, identifiers, ownership, preconditions and postconditions.
- Dispatch, sequential/parallel calls, pagination, bounded results and useful errors.
- Read versus write tools, dry-run/preview, approval-bound exact actions.
- API/database contracts, external outcome verification and reconciliation.
- MCP suitability versus direct integration; protocols do not replace authorization.
- Dependency hygiene, testable boundaries, coding standards, reviews.
- Review AI-generated code and claims; avoid unnecessary frameworks, agents and abstractions.
- Clear documentation and examples; implementation must remain understandable by another engineer.

### C07 — Reliability, durable execution, and recovery

- Connection/read/overall deadlines; retry classification and retry ownership.
- Backoff/jitter, retry budgets, circuit breakers, dependency isolation.
- Idempotency, unknown outcomes after timeout, outbox/inbox, deduplication.
- Checkpoints, replay versus fresh rerun, side-effect boundaries.
- Queue limits, duplicate/out-of-order events, dead letters, backpressure.
- Heartbeat versus real progress, watchdogs, repeated-action detection.
- Worker leases/ownership and fencing stale workers; safe reassignment.
- Cancellation, graceful shutdown, resource cleanup, bounded delegation.
- Approval timeouts, stale approvals, revalidation of current business state.
- Recovery, compensation, manual fallback, restore/reconciliation procedures.
- Fault injection, worker-kill tests, dependency outages and duplicate-action checks.
- No promise of exactly-once external effects merely because execution is durable.

### C08 — Security, privacy, governance, and human control

- Risk assessment, workflow inventory, action boundaries, abuse cases.
- Prompt injection, untrusted tools/documents, poisoned memory, exfiltration.
- Identity, delegated authority, least privilege, tenant isolation and secrets.
- Connector provenance, MCP authentication/authorization, supply-chain changes.
- Sandboxing, filesystem/network/egress restrictions for code/browser agents.
- Approval controls bound to exact action; revocation and time-of-check/time-of-use.
- Input/output handling, retention, data minimization, log redaction.
- Fairness, accessibility, explainability, appeals where decisions affect people.
- Applicability of company policy/legal review; no invented compliance certification.
- Business/process owner, engineering owner, security/domain reviewer, budget owner, operations owner, release authority.
- One startup employee may hold multiple roles, but responsibilities remain named.
- Governance aligned with Govern/Map/Measure/Manage as guidance, not blanket legal obligation.
- Incident ownership, escalation, release/increased-autonomy approval, shutdown.
- Independent review proportionate to impact and accepted residual risk.

### C09 — Testing, evaluations, and correctness evidence

- Acceptance criteria, ground-truth owner, uncertainty and disagreement resolution.
- Unit, integration, contract, end-to-end, load, security and failure tests.
- Representative cases, holdouts, dataset versions, contamination and overfitting.
- Code graders, model judges, human review, rubric design and judge calibration.
- Outcome versus trajectory evaluation; allow valid alternate paths while enforcing invariants.
- Repeated runs, reliability distributions, sampling uncertainty and rare severe failures.
- Segment results by task difficulty, language, document type and consequence.
- Component evals for retrieval, memory, routing, tools, context and delegation.
- Hallucinated facts/IDs/recommendations/completion claims and distinct checks.
- Abstention and escalation evaluation; false positives versus false negatives.
- Low temperature, RAG, valid JSON or another model's agreement are not guarantees.
- Isolated test environments, resets, safe fixtures, no production side effects.
- Regression gates, sensitivity to real failures, production sampling.
- Attribute failures to model, context, tools, runtime, data or test.
- Evaluate full business outcomes including external state and review/rework.

### C10 — Cost, performance, and capacity

- Total cost per verified successful task, including failures and human review.
- Models, input/output tokens, caching, embeddings, retrieval, tools, infrastructure and observability.
- Latency distribution, throughput, concurrency and queue wait; not averages alone.
- Attribution per workflow/project/tenant/model/tool.
- Concurrency-safe budget reservations and reconciliation with billed usage.
- Shared parent/child/retry budgets; limits on calls, output, time and delegation.
- Delayed billing and in-flight requests; alerts are not hard spending caps.
- Quotas, forecasts, budget exhaustion behaviour, load shedding and escalation.
- Validated cheaper fallback, batching, cache correctness/freshness/isolation.
- Model quality/cost trade-offs; cheap calls may create more retries and rework.
- Avoid buying capacity before value is demonstrated.
- Estimation calculators with explicit user inputs, units and assumptions; no invented live prices.

### C11 — Release, operations, and improvement

- Production operating contract: allowed actions, completion evidence, limits, owner.
- Release evidence pack with risk-appropriate requirements and known gaps.
- Shadow execution without writes, pilots, staged release and stop conditions.
- Version prompts/models/tools/indexes/memory policy/workflow/evaluation datasets.
- In-flight upgrades, compatible state migration, old-version drain or parallel versions.
- Traces tied to business IDs with redaction; logs, metrics and decision evidence.
- Quality/progress objectives alongside availability; correct HTTP does not mean correct work.
- On-call, incident response, rollback, kill switches, fallback and recovery drills.
- Production checks and user feedback can reveal failures offline benchmarks miss.
- Root causes into regression cases; reviewed updates rather than uncontrolled self-modification.
- Realized ROI, adoption, revisit architecture, retire unsuccessful automation.
- Backup and restore, disaster recovery scope, dependency changes and deprecation.

### C12 — Leadership, adoption, and daily engineering practice

- Discovery questions, design reviews, proposing options, communicating uncertainty.
- Executive framing: outcome, evidence, cost, risks, alternatives and next decision.
- Decision records, assumptions, evidence and revisit triggers.
- Adoption, user training, approval UX, review fatigue and capacity.
- Clear action/evidence/consequence presentation, manual takeover and corrections.
- Team ownership, handover, documentation, learning-gap assessment.
- General first-day/week/month guidance for joining an automation team.
- Transfer backend skills while learning probabilistic-system evaluation.
- Reusable question-to-guide navigation and daily stage checklists.
- No employer-specific internal assumptions.

### C13 — Agent harness engineering

Explain the integrated runtime around an agent, linking to deeper categories:
- Execution loop: model -> proposed tool calls -> validation -> dispatch -> results -> next step or verified completion.
- Model adapters, structured outputs, streaming and usage accounting.
- Tool registry, selection, schemas, policy checks, dispatch and result normalization.
- Context assembly and compaction; instruction/data trust separation.
- State/checkpoint management and restoration.
- Memory/retrieval hooks and isolation.
- Limits, deadlines, retry/cancellation and progress controls.
- Authorization, exact-action approvals and sandbox execution.
- Child agents, handoffs, task ownership, shared budgets and aggregation.
- Verification hooks, traces, evaluation integration and configuration versions.
- Worker lifecycle, startup, shutdown, recovery and deployment.
- What framework provides versus what application must implement/configure.
- Thin custom harness versus framework runtime; avoid unnecessary universal frameworks.
- Teach how components fit together without duplicating entire specialist chapters.

## 7. Content quality and research contract

This is a substantive authoring task as well as a software task. Do not populate 13 cards with superficial summaries and declare success.

For each guide include, where applicable:
- Stable ID, title, category, tags, stage, applicability and related questions.
- Plain-language summary and definition.
- When required, when optional, when unnecessary.
- Alternatives and a comparison of benefits/costs/limitations.
- Decision criteria, prerequisites and unknowns to resolve.
- Practical example, common failures and diagnostic evidence.
- Checklist/evidence requirements, owner and reconsideration triggers.
- Sources with URL, title, actual reviewed date, and version where relevant.
- Links to related guides without circular dependence.

Use real primary sources; verify current framework claims while implementing. Separate:
1. Durable engineering principle.
2. Documented implementation behaviour for a version.
3. Author recommendation/inference.
4. Hypothetical illustrative example.

Do not claim a source was reviewed unless actually inspected. If unavailable, mark unverified or omit that claim. Summarize in original language rather than copying source text. Avoid fake benchmark results and unsupported "best framework" rankings.

Seed references to recheck:
- https://www.anthropic.com/engineering/building-effective-agents
- https://www.anthropic.com/engineering/multi-agent-research-system
- https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents
- https://www.anthropic.com/engineering/writing-tools-for-agents
- https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents
- https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents
- https://www.anthropic.com/engineering/a-postmortem-of-three-recent-issues
- https://docs.langchain.com/oss/python/langgraph/functional-api
- https://docs.langchain.com/oss/python/concepts/memory
- https://learn.microsoft.com/en-us/azure/architecture/ai-ml/guide/ai-agent-design-patterns
- https://learn.microsoft.com/en-us/azure/foundry/concepts/evaluation-evaluators/rag-evaluators
- https://docs.temporal.io/encyclopedia/detecting-activity-failures
- https://docs.aws.amazon.com/wellarchitected/latest/reliability-pillar/rel_mitigate_interaction_failure_limit_retries.html
- https://airc.nist.gov/airmf-resources/airmf/5-sec-core/
- https://genai.owasp.org/resource/owasp-top-10-for-agentic-applications-for-2026/
- https://modelcontextprotocol.io/docs/
- https://www.finops.org/framework/technology-categories/ai/
- https://reactflow.dev/
- https://vite.dev/

Published lessons to incorporate with scope/limitations:
- Research agents duplicated work, overdelegated and ran too long; clearer tasks, effort controls, tracing and resumability helped.
- Long-running coding experiments lost continuity or declared completion prematurely; progress artifacts and end-to-end checks helped.
- Infrastructure changes degraded model quality despite existing tests; production quality checks and user feedback mattered.
- Retry amplification and uncertain side effects require bounded retries and idempotency.
Do not generalize vendor-specific token ratios or experimental outcomes into universal laws.

## 8. UX and visual direction

Build an excellent everyday engineering workspace:
- Strong typography, comfortable line lengths, hierarchy, whitespace and restrained colour.
- Dark/light themes with adequate contrast; no decorative dashboard clutter.
- Compact summaries followed by usable depth.
- Clear tables for comparisons; diagrams only when they aid understanding.
- React Flow graphs: readable labels, selection detail panel, fit/reset controls, useful branch highlighting.
- Accessible linear alternative to every important graph; no drag-only essential interaction.
- Keyboard navigation, visible focus, semantic headings, reduced-motion support.
- Responsive layouts; avoid squeezed tables and giant graph canvases on phones.
- Explain technical terms through glossary links, not unexplained jargon.
- Differentiate evidence gaps from normal informational notes.
- Show source freshness without implying automatic updates.
- No conversational AI placeholder or fake "Ask AI" input.
- Use content-driven visual design; prioritize readability over animations.

Validate one complete guide, one decision path and one review screen early, then extend without waiting for cosmetic approval. The user authorized autonomous implementation.

## 9. Technical implementation recommendations

### 9.1 Stack

Use a current compatible stable React/TypeScript/Vite stack, React Flow (@xyflow/react), and an appropriate router. Tailwind or another lightweight styling approach is optional. Choose a local search library such as MiniSearch/FlexSearch after checking compatibility.

Use a lockfile and reproducible install/build. Do not blindly combine latest package versions. No runtime remote content fetch or API needed for core use.

### 9.2 Suggested organization

- src/app: routing, layout, providers, errors
- src/components: shared UI and accessibility primitives
- src/features: explorer, decisions, reviews, troubleshooting, comparisons, projects
- src/content: categories, guides, checklists, flows, glossary, sources
- src/lib: validation, search, decisions, persistence, migrations, export/import
- tests: meaningful unit/content and browser tests
- deploy: Docker and deployment assets
- docs: decisions, coverage, progress, verification, operations

Adapt this structure if a better one is justified.

### 9.3 Shared content model

Maintain stable cross-referenced entities:
- Category
- Guide
- Source
- Checklist and checklist item
- Decision flow/node/edge
- Troubleshooting flow
- Comparison option/criterion
- Glossary term
- Project and project review
- Personal bookmark/note
- Content release and application storage schema version

Checklist items reference guides. Flow results reference guides/checklists. Avoid separate copies of facts in graph labels, pages and comparisons.

Suggested guide fields: id, categoryId, title, summary, tags, stages, applicability, prerequisites, alternatives, tradeoffs, decisionCriteria, examples, failureModes, verification, checklistIds, relatedGuideIds, sourceIds, reviewedAt, contentVersion.

Suggested project fields: id, name, timestamps, answers, reviewStatuses, evidenceNotes, assumptions, applicabilityReasons, reviewedContentVersion.

Validate all references, IDs, enums and required fields at build time.

### 9.4 Local persistence

Use versioned localStorage for modest structured data or IndexedDB if more appropriate. Document the decision.
- Guard against unavailable storage, quota errors and corrupt JSON.
- Do not silently erase old data during migration.
- Export all personal data with schema version and timestamps.
- Import validates type, size, schema and IDs; preview merge/replace choice.
- Escape imported text; never execute imported HTML/scripts.
- Handle unknown/removed content IDs without losing notes.
- Support reset with confirmation.
- Explain browser-local and origin-specific storage; HTTP/IP and final HTTPS domain do not share it.
- No analytics that exports personal content.
- Accessibility and saved state must work independently of graph interaction.

### 9.5 Routing, security and performance

- Deep links survive refresh through SPA fallback.
- Correct caching: revalidate entry HTML; fingerprinted assets can be immutable.
- Avoid stale HTML/asset combinations during deployment.
- Lazy-load heavy diagrams/routes if helpful.
- Bundle core content/search locally or in static chunks.
- Sanitize content rendering; no unsanitized HTML.
- Safe external links and appropriate response security headers.
- If service workers/offline mode are added, implement explicit update handling and test stale versions; otherwise omit.
- Public bundle must contain no private materials or secrets.

## 10. Coverage and evidence deliverables

Create a coverage registry mapping every subsection in C01–C13 and every product requirement to:
- Stable requirement ID.
- Guide/page/flow/checklist location.
- Applicable verification.
- Status: pending/implemented/verified/blocked.
- Notes on intentional consolidation or limitations.

Do not use page count or word count as the sole content-quality proxy. Perform a semantic review against this plan, checking substantive decisions rather than keyword presence.

Repository deliverables:
- Working application, complete structured content and source registry.
- Dockerfile, Compose or equivalent reproducible deployment configuration.
- Lockfile and example configuration without secrets.
- README with setup/build/test/deploy instructions.
- docs/coverage.md or equivalent generated report.
- docs/decisions.md.
- docs/progress.md for restart/compaction continuity.
- docs/verification.md with actual checks and results.
- docs/operations.md for updates, rollback, DNS/HTTPS and troubleshooting.
- Final handover with URL, commit, image/version, limitations and blockers.

Markdown is acceptable for engineering documentation, not the user-facing playbook deliverable.

## 11. Test and acceptance plan

### 11.1 Content integrity
- All categories present and all coverage entries mapped.
- No duplicate IDs, broken internal links, dangling source/guide references.
- Decision branches reachable; unknown answers handled; no unintentional cycles/dead ends.
- Terminal paths give an explanation and next checks.
- No placeholder text, fake stats or unsourced framework claims.
- Manual review of all category coverage; deep review of representative guides.

### 11.2 Functional browser scenarios
1. First visit -> explore harness engineering -> related tool guide -> bookmark -> reload.
2. New project -> action-taking workflow -> relevant approval/reliability checks -> save -> reopen.
3. Change upstream answer -> dependent guidance updates correctly.
4. Two projects -> separate statuses and notes.
5. Checklist -> needs evidence / N/A rationale -> save and restore.
6. Export -> clean browser state -> import -> equivalent data.
7. Invalid import -> useful error and existing data preserved.
8. Search for "agent stuck", "memory versus RAG", "framework selection", "duplicate action" and find useful results.
9. Troubleshooting flow -> diagnostic steps -> evidence note.
10. Graph keyboard/linear alternative works on narrow viewport.
11. Direct nested URL refresh works on deployed host.
12. Unknown route and empty search return useful navigation.

### 11.3 Engineering checks
- Typecheck, content validation, production build.
- Unit tests for decision rules, persistence migrations, import validation and calculations.
- Browser tests for key journeys and visual inspection at desktop/mobile sizes.
- Storage failure and malformed data handling.
- No browser console errors during core journeys.
- Basic accessibility checks plus manual keyboard use.
- Inspect network traffic: no unintended paid or personal-data requests.
- Container restart and health check.
- Deployment does not disturb existing routes/containers.

Use meaningful tests for concrete risks, not implementation-mirroring tests or inflated coverage percentages. If browser tooling is unavailable, try a suitable containerized/browser installation within permissions. Report any untested visual/runtime behaviour honestly.

## 12. VPS deployment procedure and safeguards

### 12.1 Inspect before mutation
- Confirm directory, Git status and any AGENTS.md instructions.
- Inspect OS, CPU/RAM/disk, Docker/Compose, existing containers and restart policies.
- Inspect listeners on 80/443 and existing Nginx/Caddy/Traefik configurations.
- Inspect firewall status without modifying SSH rules.
- Verify public IP matches expected target and DNS A/AAAA behaviour.
- Check repository read and push authentication without printing secrets.
- Check current site availability before changes.

Do not install a second proxy competing for occupied ports.

### 12.2 Build
- Clone/use repository in a dedicated application directory.
- Build with a multi-stage Dockerfile: Node build stage, static server runtime.
- Include SPA fallback and a health endpoint or static health resource.
- Set sensible restart policy and resource/log rotation settings for VPS capacity.
- Never run Vite's development server as production hosting.
- Pin deployable image/tag or record the exact build commit.

### 12.3 Publish
- Reuse the existing reverse proxy where present; add only the playbook host route.
- If none exists, choose a maintainable proxy/static server such as Caddy with automatic HTTPS.
- Route playbook.abhiraj.net to this application only.
- Validate configuration before reload.
- Ensure inbound HTTP/HTTPS work; provider-level firewall changes may require user action.
- Obtain trusted TLS and persist certificate state where applicable.
- Redirect HTTP to HTTPS.
- Check CAA/AAAA records if certificate issuance or routing fails.
- DNS must be verified; do not assume screenshot means propagation completed.
- Do not modify apex/www DNS or domain nameservers.

### 12.4 Validate and recover
- Verify HTTPS certificate, homepage, assets, nested routes, representative interaction, and restart.
- Verify original services remain healthy.
- Record release commit/image and deployment command.
- Retain a rollback path; do not discard previous working images/config until new release passes.
- Document rollback and certificate renewal checks.
- Website content/source is recoverable from Git. User browser-local notes require user exports; server backups do not capture them.

### 12.5 If blocked
Do not claim live deployment if DNS/TLS/network fails. Finish tested local container, push code if possible, and state:
- Exact blocker and evidence.
- Work completed.
- Safe next action and who must do it.
- Whether a local/private preview is available.
Do not open arbitrary public ports as a workaround without considering access and existing services.

## 13. Phased implementation with completion gates

1. Inspect environment and repository; record assumptions and baseline services.
2. Create machine-readable content inventory and coverage matrix.
3. Establish schemas, content validation, UI foundation and local persistence.
4. Build a complete vertical slice: agent-suitability path + substantial guide + saved review.
5. Implement all primary journeys, search, diagrams and accessible alternatives.
6. Research and author substantive content across all 13 categories; maintain sources.
7. Build comparisons, troubleshooting and reusable templates/calculators where useful.
8. Audit coverage and run functional, content, accessibility and deployment tests.
9. Deploy through existing infrastructure, verify externally and preserve other services.
10. Commit/push final work and write evidence-based handover.

These phases can overlap where safe. Do not prioritize cosmetic polish over content completeness or operational correctness. Do not defer entire categories to "coming soon." If time/session limits interrupt progress, checkpoint accurately for continuation rather than claiming completion.

## 14. Definition of done

- All agreed categories and subtopics substantively covered or specifically identified as blocked/unverified.
- User-facing website is polished, readable, responsive and navigable.
- Start/explore/review/troubleshoot/search paths work.
- Decisions explain rationale and unresolved evidence.
- React Flow is functional, useful and accompanied by accessible alternatives.
- Project-local progress, notes, bookmarks and export/import work.
- No backend/database/runtime LLM introduced.
- Content is generic/public, sourced, versioned and maintainable.
- Coverage and test reports reflect actual evidence.
- Docker deployment is reproducible.
- Target HTTPS site works, or deployment blocker is explicitly reported.
- Existing services preserved.
- Code and documentation pushed to the repository, or exact authentication/push blocker reported.
- Operations, update, rollback and recovery instructions are available.
- Final response reports actual status, URL, commit, tests and material limitations.

## 15. Final instruction to Astra

Treat this file as the complete handoff. The user should not need to repeat the earlier conversation. Build the useful reference product described here, not merely a UI shell. Use independent judgment to improve its clarity and usability. Keep a durable progress record, investigate issues, validate your claims, and continue through deployment within the established permissions.

The desired result is a daily companion that helps its user reason with evidence, recognize uncertainty, and build dependable AI systems—not a claim that any diagram, model, checklist, or framework can guarantee production safety.
