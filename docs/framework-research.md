# Framework and platform research

Reviewed: **2026-09-15**. This is a point-in-time engineering reference, not a ranking. Each summary is original and based on the linked primary documentation or official repository. “Unverified” means the reviewed sources did not establish the fact; it does not mean unsupported. Product editions and hosted services can have terms different from their open-source SDKs.

## Agent frameworks and runtimes

### LangGraph / LangChain

- **Scope/status:** LangChain is the higher-level agent framework and integrations layer; LangGraph is its lower-level orchestration runtime for long-running, stateful agents. LangGraph documents persistence, durable execution, streaming and human-in-the-loop. It can be used without LangChain. Both are current projects.
- **Languages/deployment:** The reviewed LangGraph page is Python-specific. Local/self-managed execution and LangSmith-hosted deployment are documented; JavaScript/TypeScript parity and exact hosted feature boundaries were not verified here.
- **License:** MIT for the open-source repositories; LangSmith is a separate commercial platform.
- **Limitations/checks:** Low-level LangGraph deliberately does not abstract prompt or agent architecture. Durable execution still requires deterministic/replay-safe design and idempotent side effects; exact operational guarantees depend on the checkpointer and deployment choice.
- **Sources:** [LangGraph overview](https://docs.langchain.com/oss/python/langgraph/overview), [durable execution](https://docs.langchain.com/oss/python/langgraph/durable-execution), [LangChain repository](https://github.com/langchain-ai/langchain), [LangGraph repository](https://github.com/langchain-ai/langgraph)

### Microsoft Agent Framework

- **Scope/status:** Current Microsoft framework for agents, an opinionated harness, graph/functional workflows and provider/hosting integrations. Microsoft’s official resource page identifies a production-ready 1.0 release for .NET and Python in April 2026 and provides migration paths from AutoGen and Semantic Kernel orchestration.
- **Languages/deployment:** Current docs expose C#, Python and Go views. Hosting docs cover self-hosting, Azure Functions/durable hosting, and Microsoft Foundry hosted agents; exact cross-language feature parity is unverified.
- **License:** MIT for the SDK repository. Managed Microsoft services and third-party providers have separate terms.
- **Limitations/checks:** Provider and tool features vary. Microsoft explicitly advises simpler direct model calls when orchestration is not needed. Migration suitability from mature AutoGen/Semantic Kernel systems requires feature-by-feature validation.
- **Sources:** [overview](https://learn.microsoft.com/en-us/agent-framework/overview/), [agents](https://learn.microsoft.com/en-us/agent-framework/concepts/agents/), [hosting](https://learn.microsoft.com/en-us/agent-framework/integrations/hosting/), [official repository](https://github.com/microsoft/agent-framework), [Microsoft resource index](https://microsoft.github.io/agent-resources/develop-agents/)

### CrewAI

- **Scope/status:** Maintained Python framework with two principal abstractions: role-based collaborating “Crews” and event-driven “Flows” that can include deterministic code, model calls and crews. CrewAI AMP is a separate managed deployment/monitoring product.
- **Languages/deployment:** Python. The framework is self-hostable as application code; AMP documents managed deployment from GitHub, Studio or CLI and REST access.
- **License:** MIT for the open-source framework; AMP terms are separate.
- **Limitations/checks:** Crews add autonomy and coordination overhead; Flows are the more explicit control path. Exact persistence, replay and failure guarantees of a chosen deployment were not established by the overview and need a failure POC. Optional sharing can collect crew/task inputs and outputs when enabled.
- **Sources:** [official repository](https://github.com/crewAIInc/crewAI), [Flows](https://docs.crewai.com/en/concepts/flows), [AMP](https://docs.crewai.com/enterprise/introduction)

### Google Agent Development Kit (ADK)

- **Scope/status:** Current Google-led, model- and deployment-agnostic agent development kit covering agents, tools, sessions/memory, evaluation and multi-agent composition. It integrates closely with Gemini and Google Cloud without requiring them.
- **Languages/deployment:** Official docs expose Python, Java, Go, JavaScript and Kotlin material. Deployment guidance includes local use, Agent Engine/Agent Runtime, Cloud Run and GKE; parity varies and must be checked for the selected SDK.
- **License:** Apache-2.0 for Google’s ADK repositories.
- **Limitations/checks:** Managed Google deployment capabilities and SDK features are not necessarily portable across runtimes or languages. Confirm service region, identity, session persistence and model/tool support for the target environment.
- **Sources:** [ADK documentation](https://google.github.io/adk-docs/), [deployment](https://google.github.io/adk-docs/deploy/), [Python repository](https://github.com/google/adk-python), [Java repository](https://github.com/google/adk-java)

### PydanticAI

- **Scope/status:** Current Python SDK centered on typed agent inputs, dependencies, tools and structured outputs, with graph, evaluation, observability, harness and realtime capabilities.
- **Languages/deployment:** Python. It runs as ordinary application code and documents durable integrations with Temporal, DBOS, Prefect, Restate and AWS Lambda durable functions; hosting remains the application/operator’s responsibility unless using a separate service.
- **License:** MIT for the repository.
- **Limitations/checks:** Typing/schema validation does not establish semantic correctness. Durable integrations replay work and therefore still demand deterministic workflow code and idempotent side effects; retry defaults vary by engine (the docs flag unbounded Temporal activity attempts unless configured).
- **Sources:** [overview](https://pydantic.dev/docs/ai/overview/), [durable execution](https://github.com/pydantic/pydantic-ai/blob/main/docs/durable_execution/overview.md), [retries](https://pydantic.dev/docs/ai/core-concepts/retries/), [repository](https://github.com/pydantic/pydantic-ai)

### AutoGen

- **Scope/status:** Microsoft Research framework with AgentChat (high-level conversational agents), Core (event-driven actor/runtime layer), extensions and Studio. AutoGen 0.4 was a breaking rewrite of 0.2. Microsoft now directs new production orchestration evaluation toward Microsoft Agent Framework, while AutoGen remains relevant existing/research technology.
- **Languages/deployment:** AgentChat is Python 3.10+. Core documents distributed/multilanguage scenarios and a local Python runtime; exact production support for non-Python workers is unverified.
- **License:** MIT. The `pyautogen` package after 0.2.34 is not controlled by Microsoft; use official package names/repository.
- **Limitations/checks:** 0.2 and 0.4 APIs differ materially, and the old migration guide listed feature gaps. State save/load is not by itself crash-safe durable execution. Establish maintenance/migration strategy before new adoption.
- **Sources:** [current docs](https://microsoft.github.io/autogen/dev/), [0.2 to 0.4 migration](https://microsoft.github.io/autogen/0.4.4/user-guide/agentchat-user-guide/migration-guide.html), [runtime](https://microsoft.github.io/autogen/dev/user-guide/core-user-guide/framework/agent-and-agent-runtime.html), [MAF migration](https://learn.microsoft.com/en-us/agent-framework/migration-guide/from-autogen/)

### Semantic Kernel

- **Scope/status:** Maintained Microsoft SDK for model integration, plugins/functions, prompt templates, memory/connectors and agent-related application features. Microsoft Agent Framework is now the primary Microsoft lead for new multi-agent orchestration; Semantic Kernel remains relevant where its kernel/plugin abstractions or existing investments fit.
- **Languages/deployment:** C#/.NET, Python and Java are documented. It is an embeddable SDK rather than a hosting service; deploy with the surrounding application or connected Azure services.
- **License:** MIT.
- **Limitations/checks:** Do not conflate Semantic Kernel’s agent APIs with the newer Microsoft Agent Framework. Some agent features historically used provider APIs with their own lifecycle/deprecation constraints; verify each chosen agent type and migration path.
- **Sources:** [Semantic Kernel overview](https://learn.microsoft.com/en-us/semantic-kernel/overview/), [agent framework](https://learn.microsoft.com/en-us/semantic-kernel/frameworks/agent/), [repository](https://github.com/microsoft/semantic-kernel), [MAF migration](https://learn.microsoft.com/en-us/agent-framework/migration-guide/from-semantic-kernel/)

### LlamaIndex

- **Scope/status:** Maintained data-centric framework for ingestion, indexing, retrieval/RAG, agents and event-driven workflows. Its older Query Pipeline is feature-frozen/deprecated in favor of Workflows.
- **Languages/deployment:** Python and TypeScript are documented, but exact feature parity is unverified. Workflows can be packaged as application services; LlamaCloud/LlamaDeploy-related managed capabilities and terms are separate.
- **License:** MIT for the core repository.
- **Limitations/checks:** The broad connector ecosystem varies in maintenance and operational behavior. Persistence and durable/replay behavior depend on selected workflow/runtime integrations; validate update/delete propagation and access filtering for RAG workloads.
- **Sources:** [official documentation](https://docs.llamaindex.ai/), [agents and workflows](https://docs.llamaindex.ai/en/stable/understanding/agent/), [Query Pipeline deprecation](https://docs.llamaindex.ai/en/stable/module_guides/querying/pipeline/), [repository](https://github.com/run-llama/llama_index)

### Haystack

- **Scope/status:** Maintained Python framework for component-based LLM, retrieval and agentic pipelines. Directed multigraph pipelines support branches, loops and concurrent flows; agents can be built from pipeline components.
- **Languages/deployment:** Python. Official images support container deployment, and Hayhooks can expose pipelines as services. Managed/enterprise deepset products are separate.
- **License:** Apache-2.0 for Haystack.
- **Limitations/checks:** Pipeline durability, cross-process checkpoints and exactly-once effects are not established by the core pipeline overview. Integration packages have independent compatibility and should be pinned/tested.
- **Sources:** [pipelines](https://docs.haystack.deepset.ai/docs/pipelines), [agents](https://docs.haystack.deepset.ai/docs/agent), [Docker](https://docs.haystack.deepset.ai/docs/docker), [repository](https://github.com/deepset-ai/haystack)

### Agno

- **Scope/status:** Current Python stack spanning an agent/team/workflow SDK, AgentOS runtime and a control-plane UI. It emphasizes self-hosted services, sessions, memory, knowledge, guardrails, human review and observability.
- **Languages/deployment:** Python SDK; production runtime is commonly exposed through a containerized/FastAPI service in the operator’s cloud. Other SDK languages were not verified.
- **License:** Apache-2.0 for the core SDK. Control-plane/cloud licensing and feature boundaries require separate verification.
- **Limitations/checks:** Framework, runtime and control plane are distinct layers. Agno sends limited model-usage telemetry by default according to its repository; it can be disabled. Validate stateless runtime/database responsibilities and durable failure behavior.
- **Sources:** [documentation](https://docs.agno.com/), [official organization](https://github.com/agno-agi), [repository](https://github.com/agno-agi/agno)

### Strands Agents

- **Scope/status:** Current open agent harness SDK originating from Amazon production systems, with tools, hooks, MCP, structured output, sessions and multi-agent patterns.
- **Languages/deployment:** Python and TypeScript. Docs list Lambda, Fargate, EKS, Bedrock AgentCore, Docker, Kubernetes and Terraform paths, while supporting non-AWS model providers. TypeScript moved from an archived standalone repository into the `harness-sdk` monorepo.
- **License:** Apache-2.0 across official projects.
- **Limitations/checks:** AWS integrations are optional but have separate service semantics and costs. Feature parity across Python/TypeScript and durable guarantees for each deployment path require verification; the harness alone does not make external effects exactly-once.
- **Sources:** [documentation](https://strands-agents.github.io/docs/), [official organization](https://github.com/strands-agents), [examples](https://strandsagents.com/docs/examples/)

## Durable workflow and automation platforms

### Temporal

- **Scope/status:** Mature durable-execution platform for application workflows and activities; it is not agent-specific. A self-hosted server and Temporal Cloud are available.
- **Languages/deployment:** Official SDKs cover Go, Java, PHP, Python, TypeScript and .NET. Workers run in the application environment and connect to self-hosted Temporal Service or Cloud.
- **License:** MIT for the open-source server and SDKs; Temporal Cloud has commercial terms.
- **Limitations/checks:** Workflow code must remain deterministic under replay and version changes. Activities can execute more than once after ambiguous failures, so idempotency remains an application duty. Operating the self-hosted service adds database, upgrades and observability work.
- **Sources:** [platform docs](https://docs.temporal.io/), [workflow definition](https://docs.temporal.io/workflows), [activity failures](https://docs.temporal.io/encyclopedia/detecting-activity-failures), [server repository](https://github.com/temporalio/temporal)

### Azure Durable Functions

- **Scope/status:** Azure Functions extension built on Durable Task for stateful serverless orchestrations, activities and entities. It manages checkpoints, retries and recovery; standalone self-hosted Durable Task SDKs are now another hosting model.
- **Languages/deployment:** Durable Functions supports C#, JavaScript, TypeScript, Python, PowerShell and Java on Azure. The broader Durable Task self-hosted matrix differs; PowerShell is not self-hosted and experimental community Go is not recommended for production.
- **License:** Open-source Durable Functions/Task SDK repositories use MIT; Azure hosting and Durable Task Scheduler are paid services with separate terms.
- **Limitations/checks:** Orchestrators replay and must obey deterministic-code restrictions. Storage provider, plan limits, execution duration, history growth and versioning need workload-specific checks. External activities are not guaranteed exactly once.
- **Sources:** [Durable Functions overview](https://learn.microsoft.com/en-us/azure/azure-functions/durable/durable-functions-overview), [Durable Task](https://learn.microsoft.com/en-us/azure/azure-functions/durable/what-is-durable-task), [code constraints](https://learn.microsoft.com/en-us/azure/azure-functions/durable/durable-functions-code-constraints)

### Dapr Workflow

- **Scope/status:** Current Dapr building block for long-running, fault-tolerant application workflows, integrated with Dapr service invocation, pub/sub, state and bindings. Runtime scheduling occurs in the Dapr sidecar.
- **Languages/deployment:** SDKs are documented for Python, JavaScript, .NET, Java and Go. Runs wherever the application plus Dapr runtime/sidecar run, including self-managed and Kubernetes environments.
- **License:** Apache-2.0 for Dapr.
- **Limitations/checks:** Only compatible state stores may be used. Workflow functions must be deterministic and same-thread constraints apply. Default dispatch payload ceiling is 4 MiB; near-limit histories can stall. Cosmos DB and DynamoDB have documented complexity limitations.
- **Sources:** [overview](https://docs.dapr.io/developing-applications/building-blocks/workflow/workflow-overview/), [features and limitations](https://docs.dapr.io/developing-applications/building-blocks/workflow/workflow-features-concepts/), [repository](https://github.com/dapr/dapr)

### n8n

- **Scope/status:** Maintained visual/low-code workflow automation product with a large integration catalog, code nodes and AI/agent nodes. It is a general automation platform, not primarily a durable code-first agent runtime.
- **Languages/deployment:** Node.js-based application; workflows are configured visually and JavaScript/Python code support is feature-specific. n8n Cloud and self-hosted Docker/npm deployments exist; scaled queue mode adds Redis and database requirements.
- **License:** Source-available Sustainable Use License for most code, not OSI open source; enterprise files/features have a proprietary license. Internal business use is generally permitted, while white-label/hosting-for-fee and some customer-credential product uses require agreement.
- **Limitations/checks:** Node behavior, credential handling, execution retention and retry semantics vary. Community nodes expand supply-chain risk. Confirm queue-mode topology, binary-data storage, licensing and idempotency before production writes.
- **Sources:** [hosting](https://docs.n8n.io/hosting/), [queue mode](https://docs.n8n.io/hosting/scaling/queue-mode/), [license FAQ](https://docs.n8n.io/privacy-and-security/sustainable-use-license/), [license text](https://github.com/n8n-io/n8n/blob/master/LICENSE.md)

## Complementary and emerging leads

### Hindsight

- **Scope/status:** Active Vectorize project providing long-term agent memory with retain, recall and reflect operations and structured factual, experiential and belief-like memory. It complements an agent/runtime rather than replacing orchestration.
- **Languages/deployment:** Server-oriented API with documented SDK/integration paths and self-hosting; exact supported client-language matrix was not verified. Hindsight Cloud is separate.
- **License:** The repository currently identifies an open-source project, but the exact license text/edition boundaries were **not verified** from a reviewed primary license page; check before adoption.
- **Limitations/checks:** Published benchmark claims are not universal production evidence. Memory can be stale, inferred or poisoned; applications still need tenant isolation, provenance, deletion propagation and authorization outside conversational memory.
- **Sources:** [official repository](https://github.com/vectorize-io/hindsight), [documentation](https://hindsight.vectorize.io/), [ACL demo paper](https://aclanthology.org/2026.acl-demo.27/)

### Flue

- **Scope/status:** Emerging TypeScript agent framework/harness built around synchronous agent functions plus hooks for models, tools, sandboxes, skills, subagents and persisted state. It can run standalone or integrate with workflow systems.
- **Languages/deployment:** TypeScript/JavaScript. Official material describes local, CI, backend and Cloudflare-oriented deployment plus orchestration through Cloudflare Workflows or Inngest.
- **License:** Marketed as open, but the exact repository license and commercial-service boundaries were **unverified** from the reviewed pages.
- **Limitations/checks:** Newer ecosystem with less independently established maturity. Agent definition functions must be synchronous; async work moves to tools/hooks/resources. Verify database adapter durability, migrations, sandbox isolation and non-Cloudflare production behavior.
- **Sources:** [overview](https://flueframework.com/), [agents](https://flueframework.com/docs/guide/building-agents/), [Agent API](https://flueframework.com/docs/reference/agent-api/)

### Paperclip

- **Scope/status:** Emerging control plane for organizing external coding/agent runtimes as “AI employees”: companies, org structure, assignments/issues, approvals, budgets, costs and audit records. It is a management/orchestration layer above Claude, Codex, Gemini or custom adapters, not a model SDK.
- **Languages/deployment:** Product implementation/runtime adapters can be installed locally, with Docker or on a server. Agent language depends on the external adapter. Exact platform language/runtime requirements were not verified.
- **License:** Presented as open source, but the exact license and edition boundaries were **unverified** from a reviewed primary license page.
- **Limitations/checks:** Heartbeat execution is burst-based, not a continuously running worker. Reliability depends on adapter session persistence and agent cooperation with task APIs. Human organizational metaphors do not supply transactionality, safe delegation or semantic correctness.
- **Sources:** [documentation](https://docs.paperclip.ing/), [agent execution model](https://paperclip.inc/docs/guides/agent-developer/how-agents-work/), [repository](https://github.com/paperclipai/paperclip)

## Selection implications

- Compare within layers first: SDK/harness, durable workflow engine, low-code automation, managed hosting, retrieval/memory and control plane solve different problems and may be combined.
- Treat deployment claims as leads for a common proof of concept. Test worker death, replay, approval expiry, cancellation, duplicated/unknown tool outcomes, provider outage, state migration, trace export and tenant isolation.
- Make hard gates explicit: language/stack, self-hosting or region, persistence and recovery semantics, identity/authorization, data residency, license, operator burden and export/migration.
- Do not score an unverified capability as zero. Record it as an evidence task, with owner and revisit date.
- Prefer direct provider SDKs or a thin typed loop when the workload does not need orchestration abstractions. Add a durable workflow engine when business execution must survive process failure; an agent framework’s saved chat state alone is not equivalent.
