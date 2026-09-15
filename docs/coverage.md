# Coverage registry

This report maps every taxonomy bullet to its authored guide. `implemented` means content exists; structural validation checks references, while semantic and browser evidence are recorded separately in verification.md. No readiness score or production certification is inferred.

## Content requirements

| ID | Requirement | Guide | Verification | Status |
|---|---|---|---|---|
| C01.01 | Process mapping, users, stakeholders, goals, process owner, current pain and baseline. | /guides/business-discovery | Content reference validation plus semantic review of the matching guide section. | implemented |
| C01.02 | Process simplification before automation; stable rules versus judgment and ambiguity. | /guides/business-discovery | Content reference validation plus semantic review of the matching guide section. | implemented |
| C01.03 | Volume, variability, exceptions, seasonality, data readiness and access feasibility. | /guides/business-discovery | Content reference validation plus semantic review of the matching guide section. | implemented |
| C01.04 | Manual versus conventional automation versus fixed AI workflow versus autonomous agent. | /guides/business-discovery | Content reference validation plus semantic review of the matching guide section. | implemented |
| C01.05 | Error economics: wrong action, missed action, delay, escalation, review and rework. | /guides/business-discovery | Content reference validation plus semantic review of the matching guide section. | implemented |
| C01.06 | Success criteria, acceptance thresholds, scope, exclusions, autonomy levels. | /guides/business-discovery | Content reference validation plus semantic review of the matching guide section. | implemented |
| C01.07 | Reversibility, impact, human capacity, opportunity cost, feasibility, ROI. | /guides/business-discovery | Content reference validation plus semantic review of the matching guide section. | implemented |
| C01.08 | Prioritization, small experiments, stop/continue criteria, validating real adoption. | /guides/business-discovery | Content reference validation plus semantic review of the matching guide section. | implemented |
| C01.09 | How to say "we need more evidence" or "do not automate this." | /guides/business-discovery | Content reference validation plus semantic review of the matching guide section. | implemented |
| C02.01 | SOLID, separation of concerns, explicit contracts, domain boundaries, dependency inversion. | /guides/architecture | Content reference validation plus semantic review of the matching guide section. | implemented |
| C02.02 | Typed inputs/outputs plus semantic validation; schema validity is not correctness. | /guides/architecture | Content reference validation plus semantic review of the matching guide section. | implemented |
| C02.03 | Business invariants, explicit state/transitions, authoritative systems, ownership. | /guides/architecture | Content reference validation plus semantic review of the matching guide section. | implemented |
| C02.04 | Deterministic rules around probabilistic decisions; bounded autonomy. | /guides/architecture | Content reference validation plus semantic review of the matching guide section. | implemented |
| C02.05 | Synchronous/API, queued, scheduled, event-driven, and long-running execution. | /guides/architecture | Content reference validation plus semantic review of the matching guide section. | implemented |
| C02.06 | Distributed-system fundamentals: consistency, concurrency, transaction boundaries. | /guides/architecture | Content reference validation plus semantic review of the matching guide section. | implemented |
| C02.07 | Build only necessary abstraction; one step does not imply one agent. | /guides/architecture | Content reference validation plus semantic review of the matching guide section. | implemented |
| C02.08 | Deployment boundaries, modularity, portability, maintainability, change isolation. | /guides/architecture | Content reference validation plus semantic review of the matching guide section. | implemented |
| C02.09 | Risk-proportionate design, uncertainty, architectural decision records. | /guides/architecture | Content reference validation plus semantic review of the matching guide section. | implemented |
| C03.01 | Sequential pipelines/prompt chaining, routing, fan-out/fan-in, aggregation. | /guides/workflow-patterns | Content reference validation plus semantic review of the matching guide section. | implemented |
| C03.02 | Orchestrator–workers, handoffs, plan/execute, evaluator–optimizer. | /guides/workflow-patterns | Content reference validation plus semantic review of the matching guide section. | implemented |
| C03.03 | Human interrupt/resume, durable state machines, saga/compensating actions. | /guides/workflow-patterns | Content reference validation plus semantic review of the matching guide section. | implemented |
| C03.04 | Single-agent/multitool versus multi-agent; dependencies and parallelizability. | /guides/workflow-patterns | Content reference validation plus semantic review of the matching guide section. | implemented |
| C03.05 | Task boundaries, ownership, delegation contracts, outputs, tools and context. | /guides/workflow-patterns | Content reference validation plus semantic review of the matching guide section. | implemented |
| C03.06 | Conflicting results, correlated model errors, shared-state races. | /guides/workflow-patterns | Content reference validation plus semantic review of the matching guide section. | implemented |
| C03.07 | Parent/child lifecycle, shared resource budgets, depth/width limits. | /guides/workflow-patterns | Content reference validation plus semantic review of the matching guide section. | implemented |
| C03.08 | Repeated handoff, stalled convergence, cancellation propagation, stopping. | /guides/workflow-patterns | Content reference validation plus semantic review of the matching guide section. | implemented |
| C03.09 | Asynchronous versus synchronous coordination trade-offs. | /guides/workflow-patterns | Content reference validation plus semantic review of the matching guide section. | implemented |
| C03.10 | Pattern examples and failure modes; avoid multi-agent complexity without evidence. | /guides/workflow-patterns | Content reference validation plus semantic review of the matching guide section. | implemented |
| C04.01 | Discover current ecosystem rather than restrict to names from this discussion. | /guides/framework-selection | Content reference validation plus semantic review of the matching guide section. | implemented |
| C04.02 | Compare conventional workflow engines, event platforms, agent runtimes, managed cloud platforms, low-code tools, and thin custom implementations. | /guides/framework-selection | Content reference validation plus semantic review of the matching guide section. | implemented |
| C04.03 | Candidates to investigate, not predetermined winners: LangGraph/LangChain, Microsoft Agent Framework, CrewAI, Google ADK, PydanticAI, AutoGen where current, Semantic Kernel where current, LlamaIndex, Haystack, Agno, Strands, provider SDKs, Temporal, Azure Durable Functions, Dapr Workflow, n8n, and other relevant maintained options. | /guides/framework-selection | Content reference validation plus semantic review of the matching guide section. | implemented |
| C04.04 | Hindsight, Flue, Paperclip and similar products may occupy complementary layers; verify exact current scope and maturity. | /guides/framework-selection | Content reference validation plus semantic review of the matching guide section. | implemented |
| C04.05 | Treat names as research leads; verify current status, successor/deprecation, version, license, features and production limitations. | /guides/framework-selection | Content reference validation plus semantic review of the matching guide section. | implemented |
| C04.06 | Distinguish model, provider/router, SDK, harness, orchestrator, memory layer, retrieval system, and developer coding subscription. | /guides/framework-selection | Content reference validation plus semantic review of the matching guide section. | implemented |
| C04.07 | Hard requirements: persistence, approvals, failure semantics, security, deployment, stack fit, operations, budget. | /guides/framework-selection | Content reference validation plus semantic review of the matching guide section. | implemented |
| C04.08 | Team skills, maintainability, build/buy, managed/self-hosted, licensing, costs, lock-in, export and migration. | /guides/framework-selection | Content reference validation plus semantic review of the matching guide section. | implemented |
| C04.09 | Comparable POCs using common tasks, failure tests, budgets, and documented weights. | /guides/framework-selection | Content reference validation plus semantic review of the matching guide section. | implemented |
| C04.10 | Model task quality, tool calling, structured outputs, latency, language/document needs, context and privacy. | /guides/framework-selection | Content reference validation plus semantic review of the matching guide section. | implemented |
| C04.11 | Routing, fallback equivalence, provider outages, model retirement, version pinning where possible. | /guides/framework-selection | Content reference validation plus semantic review of the matching guide section. | implemented |
| C04.12 | Prompting versus retrieval versus fine-tuning; choose the intervention matching the failure. | /guides/framework-selection | Content reference validation plus semantic review of the matching guide section. | implemented |
| C04.13 | Record assumptions and revisit criteria; never rank models solely on public benchmarks. | /guides/framework-selection | Content reference validation plus semantic review of the matching guide section. | implemented |
| C05.01 | Clear instructions, examples, instruction hierarchy, structured outputs and grounding. | /guides/context-engineering | Content reference validation plus semantic review of the matching guide section. | implemented |
| C05.02 | Context assembly: task, instructions, tools, history, state, retrieved evidence. | /guides/context-engineering | Content reference validation plus semantic review of the matching guide section. | implemented |
| C05.03 | Token allocation, output/tool-result headroom, just-in-time retrieval. | /guides/context-engineering | Content reference validation plus semantic review of the matching guide section. | implemented |
| C05.04 | Sliding window, summarization, compaction, tool-result clearing, external artifacts. | /guides/context-engineering | Content reference validation plus semantic review of the matching guide section. | implemented |
| C05.05 | Test preservation of goals, constraints, pending actions and evidence after compaction. | /guides/context-engineering | Content reference validation plus semantic review of the matching guide section. | implemented |
| C05.06 | Context isolation between projects, tenants, agents and trust levels. | /guides/context-engineering | Content reference validation plus semantic review of the matching guide section. | implemented |
| C05.07 | Distinguish storage loss, retrieval omission, attention failure and stale knowledge. | /guides/context-engineering | Content reference validation plus semantic review of the matching guide section. | implemented |
| C05.08 | RAG versus direct API/SQL access; RAG versus long context; when neither is required. | /guides/retrieval | Content reference validation plus semantic review of the matching guide section. | implemented |
| C05.09 | Ingestion, parsing/OCR, tables, chunking, embeddings, metadata, indexes. | /guides/retrieval | Content reference validation plus semantic review of the matching guide section. | implemented |
| C05.10 | Keyword/vector/hybrid retrieval, reranking, query transformation and access filtering. | /guides/retrieval | Content reference validation plus semantic review of the matching guide section. | implemented |
| C05.11 | Recall/relevance, groundedness, completeness, citation support, conflicting sources. | /guides/retrieval | Content reference validation plus semantic review of the matching guide section. | implemented |
| C05.12 | Document updates, deletions, freshness, lineage, authoritative source selection. | /guides/retrieval | Content reference validation plus semantic review of the matching guide section. | implemented |
| C05.13 | Execution state versus conversation versus long-term memory versus business database. | /guides/memory | Content reference validation plus semantic review of the matching guide section. | implemented |
| C05.14 | Semantic facts/preferences, episodic examples, procedural guidance. | /guides/memory | Content reference validation plus semantic review of the matching guide section. | implemented |
| C05.15 | Explicit/inferred memory writes, synchronous/background writes, approval of sensitive changes. | /guides/memory | Content reference validation plus semantic review of the matching guide section. | implemented |
| C05.16 | Namespaces, provenance, confidence limitations, deduplication, contradictions. | /guides/memory | Content reference validation plus semantic review of the matching guide section. | implemented |
| C05.17 | TTL, correction, deletion propagation, retention, poisoning, stale assumptions. | /guides/memory | Content reference validation plus semantic review of the matching guide section. | implemented |
| C05.18 | Relational/key-value/vector/graph storage choices, driven by access patterns. | /guides/memory | Content reference validation plus semantic review of the matching guide section. | implemented |
| C05.19 | Memory is not automatic learning or truth; critical permissions are not conversational memories. | /guides/memory | Content reference validation plus semantic review of the matching guide section. | implemented |
| C06.01 | Names, descriptions, schemas, non-overlap, discovery, restricted tool sets. | /guides/tool-design | Content reference validation plus semantic review of the matching guide section. | implemented |
| C06.02 | Fine-grained wrappers versus business operations; ergonomics and tool-choice evaluation. | /guides/tool-design | Content reference validation plus semantic review of the matching guide section. | implemented |
| C06.03 | Argument validation, identifiers, ownership, preconditions and postconditions. | /guides/tool-design | Content reference validation plus semantic review of the matching guide section. | implemented |
| C06.04 | Dispatch, sequential/parallel calls, pagination, bounded results and useful errors. | /guides/tool-design | Content reference validation plus semantic review of the matching guide section. | implemented |
| C06.05 | Read versus write tools, dry-run/preview, approval-bound exact actions. | /guides/tool-design | Content reference validation plus semantic review of the matching guide section. | implemented |
| C06.06 | API/database contracts, external outcome verification and reconciliation. | /guides/tool-design | Content reference validation plus semantic review of the matching guide section. | implemented |
| C06.07 | MCP suitability versus direct integration; protocols do not replace authorization. | /guides/tool-design | Content reference validation plus semantic review of the matching guide section. | implemented |
| C06.08 | Dependency hygiene, testable boundaries, coding standards, reviews. | /guides/tool-design | Content reference validation plus semantic review of the matching guide section. | implemented |
| C06.09 | Review AI-generated code and claims; avoid unnecessary frameworks, agents and abstractions. | /guides/tool-design | Content reference validation plus semantic review of the matching guide section. | implemented |
| C06.10 | Clear documentation and examples; implementation must remain understandable by another engineer. | /guides/tool-design | Content reference validation plus semantic review of the matching guide section. | implemented |
| C07.01 | Connection/read/overall deadlines; retry classification and retry ownership. | /guides/durable-execution | Content reference validation plus semantic review of the matching guide section. | implemented |
| C07.02 | Backoff/jitter, retry budgets, circuit breakers, dependency isolation. | /guides/durable-execution | Content reference validation plus semantic review of the matching guide section. | implemented |
| C07.03 | Idempotency, unknown outcomes after timeout, outbox/inbox, deduplication. | /guides/durable-execution | Content reference validation plus semantic review of the matching guide section. | implemented |
| C07.04 | Checkpoints, replay versus fresh rerun, side-effect boundaries. | /guides/durable-execution | Content reference validation plus semantic review of the matching guide section. | implemented |
| C07.05 | Queue limits, duplicate/out-of-order events, dead letters, backpressure. | /guides/durable-execution | Content reference validation plus semantic review of the matching guide section. | implemented |
| C07.06 | Heartbeat versus real progress, watchdogs, repeated-action detection. | /guides/durable-execution | Content reference validation plus semantic review of the matching guide section. | implemented |
| C07.07 | Worker leases/ownership and fencing stale workers; safe reassignment. | /guides/durable-execution | Content reference validation plus semantic review of the matching guide section. | implemented |
| C07.08 | Cancellation, graceful shutdown, resource cleanup, bounded delegation. | /guides/durable-execution | Content reference validation plus semantic review of the matching guide section. | implemented |
| C07.09 | Approval timeouts, stale approvals, revalidation of current business state. | /guides/durable-execution | Content reference validation plus semantic review of the matching guide section. | implemented |
| C07.10 | Recovery, compensation, manual fallback, restore/reconciliation procedures. | /guides/durable-execution | Content reference validation plus semantic review of the matching guide section. | implemented |
| C07.11 | Fault injection, worker-kill tests, dependency outages and duplicate-action checks. | /guides/durable-execution | Content reference validation plus semantic review of the matching guide section. | implemented |
| C07.12 | No promise of exactly-once external effects merely because execution is durable. | /guides/durable-execution | Content reference validation plus semantic review of the matching guide section. | implemented |
| C08.01 | Risk assessment, workflow inventory, action boundaries, abuse cases. | /guides/security | Content reference validation plus semantic review of the matching guide section. | implemented |
| C08.02 | Prompt injection, untrusted tools/documents, poisoned memory, exfiltration. | /guides/security | Content reference validation plus semantic review of the matching guide section. | implemented |
| C08.03 | Identity, delegated authority, least privilege, tenant isolation and secrets. | /guides/security | Content reference validation plus semantic review of the matching guide section. | implemented |
| C08.04 | Connector provenance, MCP authentication/authorization, supply-chain changes. | /guides/security | Content reference validation plus semantic review of the matching guide section. | implemented |
| C08.05 | Sandboxing, filesystem/network/egress restrictions for code/browser agents. | /guides/security | Content reference validation plus semantic review of the matching guide section. | implemented |
| C08.06 | Approval controls bound to exact action; revocation and time-of-check/time-of-use. | /guides/security | Content reference validation plus semantic review of the matching guide section. | implemented |
| C08.07 | Input/output handling, retention, data minimization, log redaction. | /guides/security | Content reference validation plus semantic review of the matching guide section. | implemented |
| C08.08 | Fairness, accessibility, explainability, appeals where decisions affect people. | /guides/security | Content reference validation plus semantic review of the matching guide section. | implemented |
| C08.09 | Applicability of company policy/legal review; no invented compliance certification. | /guides/security | Content reference validation plus semantic review of the matching guide section. | implemented |
| C08.10 | Business/process owner, engineering owner, security/domain reviewer, budget owner, operations owner, release authority. | /guides/security | Content reference validation plus semantic review of the matching guide section. | implemented |
| C08.11 | One startup employee may hold multiple roles, but responsibilities remain named. | /guides/security | Content reference validation plus semantic review of the matching guide section. | implemented |
| C08.12 | Governance aligned with Govern/Map/Measure/Manage as guidance, not blanket legal obligation. | /guides/security | Content reference validation plus semantic review of the matching guide section. | implemented |
| C08.13 | Incident ownership, escalation, release/increased-autonomy approval, shutdown. | /guides/security | Content reference validation plus semantic review of the matching guide section. | implemented |
| C08.14 | Independent review proportionate to impact and accepted residual risk. | /guides/security | Content reference validation plus semantic review of the matching guide section. | implemented |
| C09.01 | Acceptance criteria, ground-truth owner, uncertainty and disagreement resolution. | /guides/evaluations | Content reference validation plus semantic review of the matching guide section. | implemented |
| C09.02 | Unit, integration, contract, end-to-end, load, security and failure tests. | /guides/evaluations | Content reference validation plus semantic review of the matching guide section. | implemented |
| C09.03 | Representative cases, holdouts, dataset versions, contamination and overfitting. | /guides/evaluations | Content reference validation plus semantic review of the matching guide section. | implemented |
| C09.04 | Code graders, model judges, human review, rubric design and judge calibration. | /guides/evaluations | Content reference validation plus semantic review of the matching guide section. | implemented |
| C09.05 | Outcome versus trajectory evaluation; allow valid alternate paths while enforcing invariants. | /guides/evaluations | Content reference validation plus semantic review of the matching guide section. | implemented |
| C09.06 | Repeated runs, reliability distributions, sampling uncertainty and rare severe failures. | /guides/evaluations | Content reference validation plus semantic review of the matching guide section. | implemented |
| C09.07 | Segment results by task difficulty, language, document type and consequence. | /guides/evaluations | Content reference validation plus semantic review of the matching guide section. | implemented |
| C09.08 | Component evals for retrieval, memory, routing, tools, context and delegation. | /guides/evaluations | Content reference validation plus semantic review of the matching guide section. | implemented |
| C09.09 | Hallucinated facts/IDs/recommendations/completion claims and distinct checks. | /guides/evaluations | Content reference validation plus semantic review of the matching guide section. | implemented |
| C09.10 | Abstention and escalation evaluation; false positives versus false negatives. | /guides/evaluations | Content reference validation plus semantic review of the matching guide section. | implemented |
| C09.11 | Low temperature, RAG, valid JSON or another model's agreement are not guarantees. | /guides/evaluations | Content reference validation plus semantic review of the matching guide section. | implemented |
| C09.12 | Isolated test environments, resets, safe fixtures, no production side effects. | /guides/evaluations | Content reference validation plus semantic review of the matching guide section. | implemented |
| C09.13 | Regression gates, sensitivity to real failures, production sampling. | /guides/evaluations | Content reference validation plus semantic review of the matching guide section. | implemented |
| C09.14 | Attribute failures to model, context, tools, runtime, data or test. | /guides/evaluations | Content reference validation plus semantic review of the matching guide section. | implemented |
| C09.15 | Evaluate full business outcomes including external state and review/rework. | /guides/evaluations | Content reference validation plus semantic review of the matching guide section. | implemented |
| C10.01 | Total cost per verified successful task, including failures and human review. | /guides/cost-capacity | Content reference validation plus semantic review of the matching guide section. | implemented |
| C10.02 | Models, input/output tokens, caching, embeddings, retrieval, tools, infrastructure and observability. | /guides/cost-capacity | Content reference validation plus semantic review of the matching guide section. | implemented |
| C10.03 | Latency distribution, throughput, concurrency and queue wait; not averages alone. | /guides/cost-capacity | Content reference validation plus semantic review of the matching guide section. | implemented |
| C10.04 | Attribution per workflow/project/tenant/model/tool. | /guides/cost-capacity | Content reference validation plus semantic review of the matching guide section. | implemented |
| C10.05 | Concurrency-safe budget reservations and reconciliation with billed usage. | /guides/cost-capacity | Content reference validation plus semantic review of the matching guide section. | implemented |
| C10.06 | Shared parent/child/retry budgets; limits on calls, output, time and delegation. | /guides/cost-capacity | Content reference validation plus semantic review of the matching guide section. | implemented |
| C10.07 | Delayed billing and in-flight requests; alerts are not hard spending caps. | /guides/cost-capacity | Content reference validation plus semantic review of the matching guide section. | implemented |
| C10.08 | Quotas, forecasts, budget exhaustion behaviour, load shedding and escalation. | /guides/cost-capacity | Content reference validation plus semantic review of the matching guide section. | implemented |
| C10.09 | Validated cheaper fallback, batching, cache correctness/freshness/isolation. | /guides/cost-capacity | Content reference validation plus semantic review of the matching guide section. | implemented |
| C10.10 | Model quality/cost trade-offs; cheap calls may create more retries and rework. | /guides/cost-capacity | Content reference validation plus semantic review of the matching guide section. | implemented |
| C10.11 | Avoid buying capacity before value is demonstrated. | /guides/cost-capacity | Content reference validation plus semantic review of the matching guide section. | implemented |
| C10.12 | Estimation calculators with explicit user inputs, units and assumptions; no invented live prices. | /guides/cost-capacity | Content reference validation plus semantic review of the matching guide section. | implemented |
| C11.01 | Production operating contract: allowed actions, completion evidence, limits, owner. | /guides/release-operations | Content reference validation plus semantic review of the matching guide section. | implemented |
| C11.02 | Release evidence pack with risk-appropriate requirements and known gaps. | /guides/release-operations | Content reference validation plus semantic review of the matching guide section. | implemented |
| C11.03 | Shadow execution without writes, pilots, staged release and stop conditions. | /guides/release-operations | Content reference validation plus semantic review of the matching guide section. | implemented |
| C11.04 | Version prompts/models/tools/indexes/memory policy/workflow/evaluation datasets. | /guides/release-operations | Content reference validation plus semantic review of the matching guide section. | implemented |
| C11.05 | In-flight upgrades, compatible state migration, old-version drain or parallel versions. | /guides/release-operations | Content reference validation plus semantic review of the matching guide section. | implemented |
| C11.06 | Traces tied to business IDs with redaction; logs, metrics and decision evidence. | /guides/release-operations | Content reference validation plus semantic review of the matching guide section. | implemented |
| C11.07 | Quality/progress objectives alongside availability; correct HTTP does not mean correct work. | /guides/release-operations | Content reference validation plus semantic review of the matching guide section. | implemented |
| C11.08 | On-call, incident response, rollback, kill switches, fallback and recovery drills. | /guides/release-operations | Content reference validation plus semantic review of the matching guide section. | implemented |
| C11.09 | Production checks and user feedback can reveal failures offline benchmarks miss. | /guides/release-operations | Content reference validation plus semantic review of the matching guide section. | implemented |
| C11.10 | Root causes into regression cases; reviewed updates rather than uncontrolled self-modification. | /guides/release-operations | Content reference validation plus semantic review of the matching guide section. | implemented |
| C11.11 | Realized ROI, adoption, revisit architecture, retire unsuccessful automation. | /guides/release-operations | Content reference validation plus semantic review of the matching guide section. | implemented |
| C11.12 | Backup and restore, disaster recovery scope, dependency changes and deprecation. | /guides/release-operations | Content reference validation plus semantic review of the matching guide section. | implemented |
| C12.01 | Discovery questions, design reviews, proposing options, communicating uncertainty. | /guides/leadership | Content reference validation plus semantic review of the matching guide section. | implemented |
| C12.02 | Executive framing: outcome, evidence, cost, risks, alternatives and next decision. | /guides/leadership | Content reference validation plus semantic review of the matching guide section. | implemented |
| C12.03 | Decision records, assumptions, evidence and revisit triggers. | /guides/leadership | Content reference validation plus semantic review of the matching guide section. | implemented |
| C12.04 | Adoption, user training, approval UX, review fatigue and capacity. | /guides/leadership | Content reference validation plus semantic review of the matching guide section. | implemented |
| C12.05 | Clear action/evidence/consequence presentation, manual takeover and corrections. | /guides/leadership | Content reference validation plus semantic review of the matching guide section. | implemented |
| C12.06 | Team ownership, handover, documentation, learning-gap assessment. | /guides/leadership | Content reference validation plus semantic review of the matching guide section. | implemented |
| C12.07 | General first-day/week/month guidance for joining an automation team. | /guides/leadership | Content reference validation plus semantic review of the matching guide section. | implemented |
| C12.08 | Transfer backend skills while learning probabilistic-system evaluation. | /guides/leadership | Content reference validation plus semantic review of the matching guide section. | implemented |
| C12.09 | Reusable question-to-guide navigation and daily stage checklists. | /guides/leadership | Content reference validation plus semantic review of the matching guide section. | implemented |
| C12.10 | No employer-specific internal assumptions. | /guides/leadership | Content reference validation plus semantic review of the matching guide section. | implemented |
| C13.01 | Execution loop: model -> proposed tool calls -> validation -> dispatch -> results -> next step or verified completion. | /guides/harness-engineering | Content reference validation plus semantic review of the matching guide section. | implemented |
| C13.02 | Model adapters, structured outputs, streaming and usage accounting. | /guides/harness-engineering | Content reference validation plus semantic review of the matching guide section. | implemented |
| C13.03 | Tool registry, selection, schemas, policy checks, dispatch and result normalization. | /guides/harness-engineering | Content reference validation plus semantic review of the matching guide section. | implemented |
| C13.04 | Context assembly and compaction; instruction/data trust separation. | /guides/harness-engineering | Content reference validation plus semantic review of the matching guide section. | implemented |
| C13.05 | State/checkpoint management and restoration. | /guides/harness-engineering | Content reference validation plus semantic review of the matching guide section. | implemented |
| C13.06 | Memory/retrieval hooks and isolation. | /guides/harness-engineering | Content reference validation plus semantic review of the matching guide section. | implemented |
| C13.07 | Limits, deadlines, retry/cancellation and progress controls. | /guides/harness-engineering | Content reference validation plus semantic review of the matching guide section. | implemented |
| C13.08 | Authorization, exact-action approvals and sandbox execution. | /guides/harness-engineering | Content reference validation plus semantic review of the matching guide section. | implemented |
| C13.09 | Child agents, handoffs, task ownership, shared budgets and aggregation. | /guides/harness-engineering | Content reference validation plus semantic review of the matching guide section. | implemented |
| C13.10 | Verification hooks, traces, evaluation integration and configuration versions. | /guides/harness-engineering | Content reference validation plus semantic review of the matching guide section. | implemented |
| C13.11 | Worker lifecycle, startup, shutdown, recovery and deployment. | /guides/harness-engineering | Content reference validation plus semantic review of the matching guide section. | implemented |
| C13.12 | What framework provides versus what application must implement/configure. | /guides/harness-engineering | Content reference validation plus semantic review of the matching guide section. | implemented |
| C13.13 | Thin custom harness versus framework runtime; avoid unnecessary universal frameworks. | /guides/harness-engineering | Content reference validation plus semantic review of the matching guide section. | implemented |
| C13.14 | Teach how components fit together without duplicating entire specialist chapters. | /guides/harness-engineering | Content reference validation plus semantic review of the matching guide section. | implemented |

## Product, engineering and deployment requirements

Each bullet outside the taxonomy is retained below for a requirement-by-requirement final audit. Section context is kept; implementation evidence is in the named files and final checks are in verification.md. Procedural instructions are evaluated against the work record rather than a browser screen.

| ID | Section | Requirement | Evidence location |
|---|---|---|---|
| P001 | 5.1 Main navigation | Home / Continue | src/features/pages.tsx; src/lib/decisions.ts; src/features/DecisionGraph.tsx |
| P002 | 5.1 Main navigation | Start a Problem | src/features/pages.tsx; src/lib/decisions.ts; src/features/DecisionGraph.tsx |
| P003 | 5.1 Main navigation | Explore Playbook | src/features/pages.tsx; src/lib/decisions.ts; src/features/DecisionGraph.tsx |
| P004 | 5.1 Main navigation | Review a Design | src/features/pages.tsx; src/lib/decisions.ts; src/features/DecisionGraph.tsx |
| P005 | 5.1 Main navigation | Troubleshoot | src/features/pages.tsx; src/lib/decisions.ts; src/features/DecisionGraph.tsx |
| P006 | 5.1 Main navigation | Compare Approaches | src/features/pages.tsx; src/lib/decisions.ts; src/features/DecisionGraph.tsx |
| P007 | 5.1 Main navigation | My Projects | src/features/pages.tsx; src/lib/decisions.ts; src/features/DecisionGraph.tsx |
| P008 | 5.1 Main navigation | Bookmarks | src/features/pages.tsx; src/lib/decisions.ts; src/features/DecisionGraph.tsx |
| P009 | 5.1 Main navigation | Glossary | src/features/pages.tsx; src/lib/decisions.ts; src/features/DecisionGraph.tsx |
| P010 | 5.1 Main navigation | Sources / What's Changed | src/features/pages.tsx; src/lib/decisions.ts; src/features/DecisionGraph.tsx |
| P011 | 5.1 Main navigation | Settings / Export & Import | src/features/pages.tsx; src/lib/decisions.ts; src/features/DecisionGraph.tsx |
| P012 | 5.2 Home | Prominent search. | src/features/pages.tsx; src/lib/decisions.ts; src/features/DecisionGraph.tsx |
| P013 | 5.2 Home | Four primary actions: start a problem, explore, review a design, troubleshoot. | src/features/pages.tsx; src/lib/decisions.ts; src/features/DecisionGraph.tsx |
| P014 | 5.2 Home | Resume recent project or guide. | src/features/pages.tsx; src/lib/decisions.ts; src/features/DecisionGraph.tsx |
| P015 | 5.2 Home | Clear category overview, saved items, and unresolved review items. | src/features/pages.tsx; src/lib/decisions.ts; src/features/DecisionGraph.tsx |
| P016 | 5.2 Home | First-use explanation of local-only storage; no fake statistics or fictional activity. | src/features/pages.tsx; src/lib/decisions.ts; src/features/DecisionGraph.tsx |
| P017 | 5.2 Home | Sensible empty states. | src/features/pages.tsx; src/lib/decisions.ts; src/features/DecisionGraph.tsx |
| P018 | 5.3 Start a Problem | Intended business outcome and current process. | src/features/pages.tsx; src/lib/decisions.ts; src/features/DecisionGraph.tsx |
| P019 | 5.3 Start a Problem | Available data, systems, process stability, and exceptions. | src/features/pages.tsx; src/lib/decisions.ts; src/features/DecisionGraph.tsx |
| P020 | 5.3 Start a Problem | Whether fixed rules can solve the task. | src/features/pages.tsx; src/lib/decisions.ts; src/features/DecisionGraph.tsx |
| P021 | 5.3 Start a Problem | Consequence and reversibility of errors. | src/features/pages.tsx; src/lib/decisions.ts; src/features/DecisionGraph.tsx |
| P022 | 5.3 Start a Problem | Read-only, draft, approved action, or autonomous action. | src/features/pages.tsx; src/lib/decisions.ts; src/features/DecisionGraph.tsx |
| P023 | 5.3 Start a Problem | Synchronous versus long-running requirements. | src/features/pages.tsx; src/lib/decisions.ts; src/features/DecisionGraph.tsx |
| P024 | 5.3 Start a Problem | Volume, latency, budget, human-review capacity. | src/features/pages.tsx; src/lib/decisions.ts; src/features/DecisionGraph.tsx |
| P025 | 5.3 Start a Problem | Existing stack and operational constraints. | src/features/pages.tsx; src/lib/decisions.ts; src/features/DecisionGraph.tsx |
| P026 | 5.6 Troubleshoot | Agent stalls, loops, repeats actions, or delegates endlessly. | src/features/pages.tsx; src/lib/decisions.ts; src/features/DecisionGraph.tsx |
| P027 | 5.6 Troubleshoot | Worker crashes or recovery duplicates business actions. | src/features/pages.tsx; src/lib/decisions.ts; src/features/DecisionGraph.tsx |
| P028 | 5.6 Troubleshoot | Context is missing, truncated, contradictory, or ignored. | src/features/pages.tsx; src/lib/decisions.ts; src/features/DecisionGraph.tsx |
| P029 | 5.6 Troubleshoot | Memory is stale, wrong, polluted, or crosses user boundaries. | src/features/pages.tsx; src/lib/decisions.ts; src/features/DecisionGraph.tsx |
| P030 | 5.6 Troubleshoot | Retrieval returns irrelevant/incomplete/unauthorized information. | src/features/pages.tsx; src/lib/decisions.ts; src/features/DecisionGraph.tsx |
| P031 | 5.6 Troubleshoot | Wrong tool, malformed arguments, tool timeout, or false success. | src/features/pages.tsx; src/lib/decisions.ts; src/features/DecisionGraph.tsx |
| P032 | 5.6 Troubleshoot | Costs increase, latency worsens, queues grow, provider limits hit. | src/features/pages.tsx; src/lib/decisions.ts; src/features/DecisionGraph.tsx |
| P033 | 5.6 Troubleshoot | Offline evaluations pass but users report poor quality. | src/features/pages.tsx; src/lib/decisions.ts; src/features/DecisionGraph.tsx |
| P034 | 5.6 Troubleshoot | New model/prompt/framework deployment causes regression. | src/features/pages.tsx; src/lib/decisions.ts; src/features/DecisionGraph.tsx |
| P035 | 7. Content quality and research contract | Stable ID, title, category, tags, stage, applicability and related questions. | src/content/guides.json; src/content/sources.json; docs/framework-research.md; docs/content-review.md |
| P036 | 7. Content quality and research contract | Plain-language summary and definition. | src/content/guides.json; src/content/sources.json; docs/framework-research.md; docs/content-review.md |
| P037 | 7. Content quality and research contract | When required, when optional, when unnecessary. | src/content/guides.json; src/content/sources.json; docs/framework-research.md; docs/content-review.md |
| P038 | 7. Content quality and research contract | Alternatives and a comparison of benefits/costs/limitations. | src/content/guides.json; src/content/sources.json; docs/framework-research.md; docs/content-review.md |
| P039 | 7. Content quality and research contract | Decision criteria, prerequisites and unknowns to resolve. | src/content/guides.json; src/content/sources.json; docs/framework-research.md; docs/content-review.md |
| P040 | 7. Content quality and research contract | Practical example, common failures and diagnostic evidence. | src/content/guides.json; src/content/sources.json; docs/framework-research.md; docs/content-review.md |
| P041 | 7. Content quality and research contract | Checklist/evidence requirements, owner and reconsideration triggers. | src/content/guides.json; src/content/sources.json; docs/framework-research.md; docs/content-review.md |
| P042 | 7. Content quality and research contract | Sources with URL, title, actual reviewed date, and version where relevant. | src/content/guides.json; src/content/sources.json; docs/framework-research.md; docs/content-review.md |
| P043 | 7. Content quality and research contract | Links to related guides without circular dependence. | src/content/guides.json; src/content/sources.json; docs/framework-research.md; docs/content-review.md |
| P044 | 7. Content quality and research contract | https://www.anthropic.com/engineering/building-effective-agents | src/content/guides.json; src/content/sources.json; docs/framework-research.md; docs/content-review.md |
| P045 | 7. Content quality and research contract | https://www.anthropic.com/engineering/multi-agent-research-system | src/content/guides.json; src/content/sources.json; docs/framework-research.md; docs/content-review.md |
| P046 | 7. Content quality and research contract | https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents | src/content/guides.json; src/content/sources.json; docs/framework-research.md; docs/content-review.md |
| P047 | 7. Content quality and research contract | https://www.anthropic.com/engineering/writing-tools-for-agents | src/content/guides.json; src/content/sources.json; docs/framework-research.md; docs/content-review.md |
| P048 | 7. Content quality and research contract | https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents | src/content/guides.json; src/content/sources.json; docs/framework-research.md; docs/content-review.md |
| P049 | 7. Content quality and research contract | https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents | src/content/guides.json; src/content/sources.json; docs/framework-research.md; docs/content-review.md |
| P050 | 7. Content quality and research contract | https://www.anthropic.com/engineering/a-postmortem-of-three-recent-issues | src/content/guides.json; src/content/sources.json; docs/framework-research.md; docs/content-review.md |
| P051 | 7. Content quality and research contract | https://docs.langchain.com/oss/python/langgraph/functional-api | src/content/guides.json; src/content/sources.json; docs/framework-research.md; docs/content-review.md |
| P052 | 7. Content quality and research contract | https://docs.langchain.com/oss/python/concepts/memory | src/content/guides.json; src/content/sources.json; docs/framework-research.md; docs/content-review.md |
| P053 | 7. Content quality and research contract | https://learn.microsoft.com/en-us/azure/architecture/ai-ml/guide/ai-agent-design-patterns | src/content/guides.json; src/content/sources.json; docs/framework-research.md; docs/content-review.md |
| P054 | 7. Content quality and research contract | https://learn.microsoft.com/en-us/azure/foundry/concepts/evaluation-evaluators/rag-evaluators | src/content/guides.json; src/content/sources.json; docs/framework-research.md; docs/content-review.md |
| P055 | 7. Content quality and research contract | https://docs.temporal.io/encyclopedia/detecting-activity-failures | src/content/guides.json; src/content/sources.json; docs/framework-research.md; docs/content-review.md |
| P056 | 7. Content quality and research contract | https://docs.aws.amazon.com/wellarchitected/latest/reliability-pillar/rel_mitigate_interaction_failure_limit_retries.html | src/content/guides.json; src/content/sources.json; docs/framework-research.md; docs/content-review.md |
| P057 | 7. Content quality and research contract | https://airc.nist.gov/airmf-resources/airmf/5-sec-core/ | src/content/guides.json; src/content/sources.json; docs/framework-research.md; docs/content-review.md |
| P058 | 7. Content quality and research contract | https://genai.owasp.org/resource/owasp-top-10-for-agentic-applications-for-2026/ | src/content/guides.json; src/content/sources.json; docs/framework-research.md; docs/content-review.md |
| P059 | 7. Content quality and research contract | https://modelcontextprotocol.io/docs/ | src/content/guides.json; src/content/sources.json; docs/framework-research.md; docs/content-review.md |
| P060 | 7. Content quality and research contract | https://www.finops.org/framework/technology-categories/ai/ | src/content/guides.json; src/content/sources.json; docs/framework-research.md; docs/content-review.md |
| P061 | 7. Content quality and research contract | https://reactflow.dev/ | src/content/guides.json; src/content/sources.json; docs/framework-research.md; docs/content-review.md |
| P062 | 7. Content quality and research contract | https://vite.dev/ | src/content/guides.json; src/content/sources.json; docs/framework-research.md; docs/content-review.md |
| P063 | 7. Content quality and research contract | Research agents duplicated work, overdelegated and ran too long; clearer tasks, effort controls, tracing and resumability helped. | src/content/guides.json; src/content/sources.json; docs/framework-research.md; docs/content-review.md |
| P064 | 7. Content quality and research contract | Long-running coding experiments lost continuity or declared completion prematurely; progress artifacts and end-to-end checks helped. | src/content/guides.json; src/content/sources.json; docs/framework-research.md; docs/content-review.md |
| P065 | 7. Content quality and research contract | Infrastructure changes degraded model quality despite existing tests; production quality checks and user feedback mattered. | src/content/guides.json; src/content/sources.json; docs/framework-research.md; docs/content-review.md |
| P066 | 7. Content quality and research contract | Retry amplification and uncertain side effects require bounded retries and idempotency. | src/content/guides.json; src/content/sources.json; docs/framework-research.md; docs/content-review.md |
| P067 | 8. UX and visual direction | Strong typography, comfortable line lengths, hierarchy, whitespace and restrained colour. | src/styles.css; src/features/DecisionGraph.tsx; tests/browser/acceptance.spec.ts |
| P068 | 8. UX and visual direction | Dark/light themes with adequate contrast; no decorative dashboard clutter. | src/styles.css; src/features/DecisionGraph.tsx; tests/browser/acceptance.spec.ts |
| P069 | 8. UX and visual direction | Compact summaries followed by usable depth. | src/styles.css; src/features/DecisionGraph.tsx; tests/browser/acceptance.spec.ts |
| P070 | 8. UX and visual direction | Clear tables for comparisons; diagrams only when they aid understanding. | src/styles.css; src/features/DecisionGraph.tsx; tests/browser/acceptance.spec.ts |
| P071 | 8. UX and visual direction | React Flow graphs: readable labels, selection detail panel, fit/reset controls, useful branch highlighting. | src/styles.css; src/features/DecisionGraph.tsx; tests/browser/acceptance.spec.ts |
| P072 | 8. UX and visual direction | Accessible linear alternative to every important graph; no drag-only essential interaction. | src/styles.css; src/features/DecisionGraph.tsx; tests/browser/acceptance.spec.ts |
| P073 | 8. UX and visual direction | Keyboard navigation, visible focus, semantic headings, reduced-motion support. | src/styles.css; src/features/DecisionGraph.tsx; tests/browser/acceptance.spec.ts |
| P074 | 8. UX and visual direction | Responsive layouts; avoid squeezed tables and giant graph canvases on phones. | src/styles.css; src/features/DecisionGraph.tsx; tests/browser/acceptance.spec.ts |
| P075 | 8. UX and visual direction | Explain technical terms through glossary links, not unexplained jargon. | src/styles.css; src/features/DecisionGraph.tsx; tests/browser/acceptance.spec.ts |
| P076 | 8. UX and visual direction | Differentiate evidence gaps from normal informational notes. | src/styles.css; src/features/DecisionGraph.tsx; tests/browser/acceptance.spec.ts |
| P077 | 8. UX and visual direction | Show source freshness without implying automatic updates. | src/styles.css; src/features/DecisionGraph.tsx; tests/browser/acceptance.spec.ts |
| P078 | 8. UX and visual direction | No conversational AI placeholder or fake "Ask AI" input. | src/styles.css; src/features/DecisionGraph.tsx; tests/browser/acceptance.spec.ts |
| P079 | 8. UX and visual direction | Use content-driven visual design; prioritize readability over animations. | src/styles.css; src/features/DecisionGraph.tsx; tests/browser/acceptance.spec.ts |
| P080 | 9.2 Suggested organization | src/app: routing, layout, providers, errors | src/lib/persistence.ts; src/app/StateContext.tsx; deploy/Caddyfile; package-lock.json |
| P081 | 9.2 Suggested organization | src/components: shared UI and accessibility primitives | src/lib/persistence.ts; src/app/StateContext.tsx; deploy/Caddyfile; package-lock.json |
| P082 | 9.2 Suggested organization | src/features: explorer, decisions, reviews, troubleshooting, comparisons, projects | src/lib/persistence.ts; src/app/StateContext.tsx; deploy/Caddyfile; package-lock.json |
| P083 | 9.2 Suggested organization | src/content: categories, guides, checklists, flows, glossary, sources | src/lib/persistence.ts; src/app/StateContext.tsx; deploy/Caddyfile; package-lock.json |
| P084 | 9.2 Suggested organization | src/lib: validation, search, decisions, persistence, migrations, export/import | src/lib/persistence.ts; src/app/StateContext.tsx; deploy/Caddyfile; package-lock.json |
| P085 | 9.2 Suggested organization | tests: meaningful unit/content and browser tests | src/lib/persistence.ts; src/app/StateContext.tsx; deploy/Caddyfile; package-lock.json |
| P086 | 9.2 Suggested organization | deploy: Docker and deployment assets | src/lib/persistence.ts; src/app/StateContext.tsx; deploy/Caddyfile; package-lock.json |
| P087 | 9.2 Suggested organization | docs: decisions, coverage, progress, verification, operations | src/lib/persistence.ts; src/app/StateContext.tsx; deploy/Caddyfile; package-lock.json |
| P088 | 9.3 Shared content model | Category | src/lib/persistence.ts; src/app/StateContext.tsx; deploy/Caddyfile; package-lock.json |
| P089 | 9.3 Shared content model | Guide | src/lib/persistence.ts; src/app/StateContext.tsx; deploy/Caddyfile; package-lock.json |
| P090 | 9.3 Shared content model | Source | src/lib/persistence.ts; src/app/StateContext.tsx; deploy/Caddyfile; package-lock.json |
| P091 | 9.3 Shared content model | Checklist and checklist item | src/lib/persistence.ts; src/app/StateContext.tsx; deploy/Caddyfile; package-lock.json |
| P092 | 9.3 Shared content model | Decision flow/node/edge | src/lib/persistence.ts; src/app/StateContext.tsx; deploy/Caddyfile; package-lock.json |
| P093 | 9.3 Shared content model | Troubleshooting flow | src/lib/persistence.ts; src/app/StateContext.tsx; deploy/Caddyfile; package-lock.json |
| P094 | 9.3 Shared content model | Comparison option/criterion | src/lib/persistence.ts; src/app/StateContext.tsx; deploy/Caddyfile; package-lock.json |
| P095 | 9.3 Shared content model | Glossary term | src/lib/persistence.ts; src/app/StateContext.tsx; deploy/Caddyfile; package-lock.json |
| P096 | 9.3 Shared content model | Project and project review | src/lib/persistence.ts; src/app/StateContext.tsx; deploy/Caddyfile; package-lock.json |
| P097 | 9.3 Shared content model | Personal bookmark/note | src/lib/persistence.ts; src/app/StateContext.tsx; deploy/Caddyfile; package-lock.json |
| P098 | 9.3 Shared content model | Content release and application storage schema version | src/lib/persistence.ts; src/app/StateContext.tsx; deploy/Caddyfile; package-lock.json |
| P099 | 9.4 Local persistence | Guard against unavailable storage, quota errors and corrupt JSON. | src/lib/persistence.ts; src/app/StateContext.tsx; deploy/Caddyfile; package-lock.json |
| P100 | 9.4 Local persistence | Do not silently erase old data during migration. | src/lib/persistence.ts; src/app/StateContext.tsx; deploy/Caddyfile; package-lock.json |
| P101 | 9.4 Local persistence | Export all personal data with schema version and timestamps. | src/lib/persistence.ts; src/app/StateContext.tsx; deploy/Caddyfile; package-lock.json |
| P102 | 9.4 Local persistence | Import validates type, size, schema and IDs; preview merge/replace choice. | src/lib/persistence.ts; src/app/StateContext.tsx; deploy/Caddyfile; package-lock.json |
| P103 | 9.4 Local persistence | Escape imported text; never execute imported HTML/scripts. | src/lib/persistence.ts; src/app/StateContext.tsx; deploy/Caddyfile; package-lock.json |
| P104 | 9.4 Local persistence | Handle unknown/removed content IDs without losing notes. | src/lib/persistence.ts; src/app/StateContext.tsx; deploy/Caddyfile; package-lock.json |
| P105 | 9.4 Local persistence | Support reset with confirmation. | src/lib/persistence.ts; src/app/StateContext.tsx; deploy/Caddyfile; package-lock.json |
| P106 | 9.4 Local persistence | Explain browser-local and origin-specific storage; HTTP/IP and final HTTPS domain do not share it. | src/lib/persistence.ts; src/app/StateContext.tsx; deploy/Caddyfile; package-lock.json |
| P107 | 9.4 Local persistence | No analytics that exports personal content. | src/lib/persistence.ts; src/app/StateContext.tsx; deploy/Caddyfile; package-lock.json |
| P108 | 9.4 Local persistence | Accessibility and saved state must work independently of graph interaction. | src/lib/persistence.ts; src/app/StateContext.tsx; deploy/Caddyfile; package-lock.json |
| P109 | 9.5 Routing, security and performance | Deep links survive refresh through SPA fallback. | src/lib/persistence.ts; src/app/StateContext.tsx; deploy/Caddyfile; package-lock.json |
| P110 | 9.5 Routing, security and performance | Correct caching: revalidate entry HTML; fingerprinted assets can be immutable. | src/lib/persistence.ts; src/app/StateContext.tsx; deploy/Caddyfile; package-lock.json |
| P111 | 9.5 Routing, security and performance | Avoid stale HTML/asset combinations during deployment. | src/lib/persistence.ts; src/app/StateContext.tsx; deploy/Caddyfile; package-lock.json |
| P112 | 9.5 Routing, security and performance | Lazy-load heavy diagrams/routes if helpful. | src/lib/persistence.ts; src/app/StateContext.tsx; deploy/Caddyfile; package-lock.json |
| P113 | 9.5 Routing, security and performance | Bundle core content/search locally or in static chunks. | src/lib/persistence.ts; src/app/StateContext.tsx; deploy/Caddyfile; package-lock.json |
| P114 | 9.5 Routing, security and performance | Sanitize content rendering; no unsanitized HTML. | src/lib/persistence.ts; src/app/StateContext.tsx; deploy/Caddyfile; package-lock.json |
| P115 | 9.5 Routing, security and performance | Safe external links and appropriate response security headers. | src/lib/persistence.ts; src/app/StateContext.tsx; deploy/Caddyfile; package-lock.json |
| P116 | 9.5 Routing, security and performance | If service workers/offline mode are added, implement explicit update handling and test stale versions; otherwise omit. | src/lib/persistence.ts; src/app/StateContext.tsx; deploy/Caddyfile; package-lock.json |
| P117 | 9.5 Routing, security and performance | Public bundle must contain no private materials or secrets. | src/lib/persistence.ts; src/app/StateContext.tsx; deploy/Caddyfile; package-lock.json |
| P118 | 10. Coverage and evidence deliverables | Stable requirement ID. | docs/coverage.md; docs/verification.md; README.md; docs/operations.md |
| P119 | 10. Coverage and evidence deliverables | Guide/page/flow/checklist location. | docs/coverage.md; docs/verification.md; README.md; docs/operations.md |
| P120 | 10. Coverage and evidence deliverables | Applicable verification. | docs/coverage.md; docs/verification.md; README.md; docs/operations.md |
| P121 | 10. Coverage and evidence deliverables | Status: pending/implemented/verified/blocked. | docs/coverage.md; docs/verification.md; README.md; docs/operations.md |
| P122 | 10. Coverage and evidence deliverables | Notes on intentional consolidation or limitations. | docs/coverage.md; docs/verification.md; README.md; docs/operations.md |
| P123 | 10. Coverage and evidence deliverables | Working application, complete structured content and source registry. | docs/coverage.md; docs/verification.md; README.md; docs/operations.md |
| P124 | 10. Coverage and evidence deliverables | Dockerfile, Compose or equivalent reproducible deployment configuration. | docs/coverage.md; docs/verification.md; README.md; docs/operations.md |
| P125 | 10. Coverage and evidence deliverables | Lockfile and example configuration without secrets. | docs/coverage.md; docs/verification.md; README.md; docs/operations.md |
| P126 | 10. Coverage and evidence deliverables | README with setup/build/test/deploy instructions. | docs/coverage.md; docs/verification.md; README.md; docs/operations.md |
| P127 | 10. Coverage and evidence deliverables | docs/coverage.md or equivalent generated report. | docs/coverage.md; docs/verification.md; README.md; docs/operations.md |
| P128 | 10. Coverage and evidence deliverables | docs/decisions.md. | docs/coverage.md; docs/verification.md; README.md; docs/operations.md |
| P129 | 10. Coverage and evidence deliverables | docs/progress.md for restart/compaction continuity. | docs/coverage.md; docs/verification.md; README.md; docs/operations.md |
| P130 | 10. Coverage and evidence deliverables | docs/verification.md with actual checks and results. | docs/coverage.md; docs/verification.md; README.md; docs/operations.md |
| P131 | 10. Coverage and evidence deliverables | docs/operations.md for updates, rollback, DNS/HTTPS and troubleshooting. | docs/coverage.md; docs/verification.md; README.md; docs/operations.md |
| P132 | 10. Coverage and evidence deliverables | Final handover with URL, commit, image/version, limitations and blockers. | docs/coverage.md; docs/verification.md; README.md; docs/operations.md |
| P133 | 11.1 Content integrity | All categories present and all coverage entries mapped. | tests; scripts/validate-content.mjs; docs/verification.md |
| P134 | 11.1 Content integrity | No duplicate IDs, broken internal links, dangling source/guide references. | tests; scripts/validate-content.mjs; docs/verification.md |
| P135 | 11.1 Content integrity | Decision branches reachable; unknown answers handled; no unintentional cycles/dead ends. | tests; scripts/validate-content.mjs; docs/verification.md |
| P136 | 11.1 Content integrity | Terminal paths give an explanation and next checks. | tests; scripts/validate-content.mjs; docs/verification.md |
| P137 | 11.1 Content integrity | No placeholder text, fake stats or unsourced framework claims. | tests; scripts/validate-content.mjs; docs/verification.md |
| P138 | 11.1 Content integrity | Manual review of all category coverage; deep review of representative guides. | tests; scripts/validate-content.mjs; docs/verification.md |
| P139 | 11.3 Engineering checks | Typecheck, content validation, production build. | tests; scripts/validate-content.mjs; docs/verification.md |
| P140 | 11.3 Engineering checks | Unit tests for decision rules, persistence migrations, import validation and calculations. | tests; scripts/validate-content.mjs; docs/verification.md |
| P141 | 11.3 Engineering checks | Browser tests for key journeys and visual inspection at desktop/mobile sizes. | tests; scripts/validate-content.mjs; docs/verification.md |
| P142 | 11.3 Engineering checks | Storage failure and malformed data handling. | tests; scripts/validate-content.mjs; docs/verification.md |
| P143 | 11.3 Engineering checks | No browser console errors during core journeys. | tests; scripts/validate-content.mjs; docs/verification.md |
| P144 | 11.3 Engineering checks | Basic accessibility checks plus manual keyboard use. | tests; scripts/validate-content.mjs; docs/verification.md |
| P145 | 11.3 Engineering checks | Inspect network traffic: no unintended paid or personal-data requests. | tests; scripts/validate-content.mjs; docs/verification.md |
| P146 | 11.3 Engineering checks | Container restart and health check. | tests; scripts/validate-content.mjs; docs/verification.md |
| P147 | 11.3 Engineering checks | Deployment does not disturb existing routes/containers. | tests; scripts/validate-content.mjs; docs/verification.md |
| P148 | 12.1 Inspect before mutation | Confirm directory, Git status and any AGENTS.md instructions. | Dockerfile; compose.yaml; deploy/Caddyfile; docs/operations.md; docs/verification.md |
| P149 | 12.1 Inspect before mutation | Inspect OS, CPU/RAM/disk, Docker/Compose, existing containers and restart policies. | Dockerfile; compose.yaml; deploy/Caddyfile; docs/operations.md; docs/verification.md |
| P150 | 12.1 Inspect before mutation | Inspect listeners on 80/443 and existing Nginx/Caddy/Traefik configurations. | Dockerfile; compose.yaml; deploy/Caddyfile; docs/operations.md; docs/verification.md |
| P151 | 12.1 Inspect before mutation | Inspect firewall status without modifying SSH rules. | Dockerfile; compose.yaml; deploy/Caddyfile; docs/operations.md; docs/verification.md |
| P152 | 12.1 Inspect before mutation | Verify public IP matches expected target and DNS A/AAAA behaviour. | Dockerfile; compose.yaml; deploy/Caddyfile; docs/operations.md; docs/verification.md |
| P153 | 12.1 Inspect before mutation | Check repository read and push authentication without printing secrets. | Dockerfile; compose.yaml; deploy/Caddyfile; docs/operations.md; docs/verification.md |
| P154 | 12.1 Inspect before mutation | Check current site availability before changes. | Dockerfile; compose.yaml; deploy/Caddyfile; docs/operations.md; docs/verification.md |
| P155 | 12.2 Build | Clone/use repository in a dedicated application directory. | Dockerfile; compose.yaml; deploy/Caddyfile; docs/operations.md; docs/verification.md |
| P156 | 12.2 Build | Build with a multi-stage Dockerfile: Node build stage, static server runtime. | Dockerfile; compose.yaml; deploy/Caddyfile; docs/operations.md; docs/verification.md |
| P157 | 12.2 Build | Include SPA fallback and a health endpoint or static health resource. | Dockerfile; compose.yaml; deploy/Caddyfile; docs/operations.md; docs/verification.md |
| P158 | 12.2 Build | Set sensible restart policy and resource/log rotation settings for VPS capacity. | Dockerfile; compose.yaml; deploy/Caddyfile; docs/operations.md; docs/verification.md |
| P159 | 12.2 Build | Never run Vite's development server as production hosting. | Dockerfile; compose.yaml; deploy/Caddyfile; docs/operations.md; docs/verification.md |
| P160 | 12.2 Build | Pin deployable image/tag or record the exact build commit. | Dockerfile; compose.yaml; deploy/Caddyfile; docs/operations.md; docs/verification.md |
| P161 | 12.3 Publish | Reuse the existing reverse proxy where present; add only the playbook host route. | Dockerfile; compose.yaml; deploy/Caddyfile; docs/operations.md; docs/verification.md |
| P162 | 12.3 Publish | If none exists, choose a maintainable proxy/static server such as Caddy with automatic HTTPS. | Dockerfile; compose.yaml; deploy/Caddyfile; docs/operations.md; docs/verification.md |
| P163 | 12.3 Publish | Route playbook.abhiraj.net to this application only. | Dockerfile; compose.yaml; deploy/Caddyfile; docs/operations.md; docs/verification.md |
| P164 | 12.3 Publish | Validate configuration before reload. | Dockerfile; compose.yaml; deploy/Caddyfile; docs/operations.md; docs/verification.md |
| P165 | 12.3 Publish | Ensure inbound HTTP/HTTPS work; provider-level firewall changes may require user action. | Dockerfile; compose.yaml; deploy/Caddyfile; docs/operations.md; docs/verification.md |
| P166 | 12.3 Publish | Obtain trusted TLS and persist certificate state where applicable. | Dockerfile; compose.yaml; deploy/Caddyfile; docs/operations.md; docs/verification.md |
| P167 | 12.3 Publish | Redirect HTTP to HTTPS. | Dockerfile; compose.yaml; deploy/Caddyfile; docs/operations.md; docs/verification.md |
| P168 | 12.3 Publish | Check CAA/AAAA records if certificate issuance or routing fails. | Dockerfile; compose.yaml; deploy/Caddyfile; docs/operations.md; docs/verification.md |
| P169 | 12.3 Publish | DNS must be verified; do not assume screenshot means propagation completed. | Dockerfile; compose.yaml; deploy/Caddyfile; docs/operations.md; docs/verification.md |
| P170 | 12.3 Publish | Do not modify apex/www DNS or domain nameservers. | Dockerfile; compose.yaml; deploy/Caddyfile; docs/operations.md; docs/verification.md |
| P171 | 12.4 Validate and recover | Verify HTTPS certificate, homepage, assets, nested routes, representative interaction, and restart. | Dockerfile; compose.yaml; deploy/Caddyfile; docs/operations.md; docs/verification.md |
| P172 | 12.4 Validate and recover | Verify original services remain healthy. | Dockerfile; compose.yaml; deploy/Caddyfile; docs/operations.md; docs/verification.md |
| P173 | 12.4 Validate and recover | Record release commit/image and deployment command. | Dockerfile; compose.yaml; deploy/Caddyfile; docs/operations.md; docs/verification.md |
| P174 | 12.4 Validate and recover | Retain a rollback path; do not discard previous working images/config until new release passes. | Dockerfile; compose.yaml; deploy/Caddyfile; docs/operations.md; docs/verification.md |
| P175 | 12.4 Validate and recover | Document rollback and certificate renewal checks. | Dockerfile; compose.yaml; deploy/Caddyfile; docs/operations.md; docs/verification.md |
| P176 | 12.4 Validate and recover | Website content/source is recoverable from Git. User browser-local notes require user exports; server backups do not capture them. | Dockerfile; compose.yaml; deploy/Caddyfile; docs/operations.md; docs/verification.md |
| P177 | 12.5 If blocked | Exact blocker and evidence. | Dockerfile; compose.yaml; deploy/Caddyfile; docs/operations.md; docs/verification.md |
| P178 | 12.5 If blocked | Work completed. | Dockerfile; compose.yaml; deploy/Caddyfile; docs/operations.md; docs/verification.md |
| P179 | 12.5 If blocked | Safe next action and who must do it. | Dockerfile; compose.yaml; deploy/Caddyfile; docs/operations.md; docs/verification.md |
| P180 | 12.5 If blocked | Whether a local/private preview is available. | Dockerfile; compose.yaml; deploy/Caddyfile; docs/operations.md; docs/verification.md |
| P181 | 14. Definition of done | All agreed categories and subtopics substantively covered or specifically identified as blocked/unverified. | docs/verification.md; docs/handover.md |
| P182 | 14. Definition of done | User-facing website is polished, readable, responsive and navigable. | docs/verification.md; docs/handover.md |
| P183 | 14. Definition of done | Start/explore/review/troubleshoot/search paths work. | docs/verification.md; docs/handover.md |
| P184 | 14. Definition of done | Decisions explain rationale and unresolved evidence. | docs/verification.md; docs/handover.md |
| P185 | 14. Definition of done | React Flow is functional, useful and accompanied by accessible alternatives. | docs/verification.md; docs/handover.md |
| P186 | 14. Definition of done | Project-local progress, notes, bookmarks and export/import work. | docs/verification.md; docs/handover.md |
| P187 | 14. Definition of done | No backend/database/runtime LLM introduced. | docs/verification.md; docs/handover.md |
| P188 | 14. Definition of done | Content is generic/public, sourced, versioned and maintainable. | docs/verification.md; docs/handover.md |
| P189 | 14. Definition of done | Coverage and test reports reflect actual evidence. | docs/verification.md; docs/handover.md |
| P190 | 14. Definition of done | Docker deployment is reproducible. | docs/verification.md; docs/handover.md |
| P191 | 14. Definition of done | Target HTTPS site works, or deployment blocker is explicitly reported. | docs/verification.md; docs/handover.md |
| P192 | 14. Definition of done | Existing services preserved. | docs/verification.md; docs/handover.md |
| P193 | 14. Definition of done | Code and documentation pushed to the repository, or exact authentication/push blocker reported. | docs/verification.md; docs/handover.md |
| P194 | 14. Definition of done | Operations, update, rollback and recovery instructions are available. | docs/verification.md; docs/handover.md |
| P195 | 14. Definition of done | Final response reports actual status, URL, commit, tests and material limitations. | docs/verification.md; docs/handover.md |
