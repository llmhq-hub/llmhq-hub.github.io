# LLMHQ Website UI Spec — Final

This document defines the messaging, content, structure, and design direction for the LLM Headquarters website (llmhq-hub.github.io). Use this as the source of truth when building or updating the site.

---

## Brand

- **Name:** LLM Headquarters (LLMhq)
- **Tone:** Engineering-focused, honest, no hype. Speak like a senior engineer explaining something to a peer.

---

## Product Hierarchy

```
LLM Headquarters (umbrella brand)
├── PromptOps  — prompt versioning & management (foundation layer)
└── ReleaseOps — bundle, promote, attribute, analyze (orchestration layer)
```

- PromptOps is the entry point. ReleaseOps builds on top of it.
- Each works standalone. Together they form a complete workflow.
- Dependency is one-directional: ReleaseOps depends on PromptOps via PromptBridge, never the reverse.
- Progressive adoption: users start with PromptOps, graduate to ReleaseOps when ready.

---

## Landing Page Structure

The page flow follows a "show → explain → convince" structure. Lead with the visual punch, then explain how it works, then establish principles. Do NOT lead with philosophy or abstract pipeline diagrams.

---

### Section 1: Hero

**Headline:**
"Every artifact in your stack has version control. Except the ones that define your agent."

**Sub-headline:**
"Version, bundle, and ship the artifacts that define your agent. Git-native. Local-first."

**Bridge line (below sub-headline, before visual):**
"Prompts. Policies. Model configs. These define your agent — and right now, they're unversioned."

No trust badges in the hero. No install command in the hero. No "Operational infrastructure for AI agents" category label. The hero is problem → solution → stakes. Nothing else.

---

### Section 2: The Key Moment (Moved Up — This Is the Visual Punch)

This is the first visual the visitor sees after the hero text. It shows the product's value in one image before any explanation.

**Layout:** Side-by-side comparison.

**Left side:**
v1.0.0 — Conservative
"Escalate any refund over **$50**"
$120 refund → escalate_ticket

**Right side:**
v1.1.0 — Permissive
"Auto-approve up to **$200**"
$120 refund → approve_refund

**Below the comparison:**
"Attribution traced to: line 15 in system prompt — threshold changed from $50 to $200"

**CTA immediately after:**
[See the demos →] (links to /demos/)

This section should be visually striking — it's the "aha" moment. Color-code the two sides (e.g., amber/caution for conservative, green for permissive). Make the threshold numbers bold and large.

---

### Section 3: How It Works

Title: "How it works"

Four steps with code examples. Each step is self-contained — a reader can stop at any step and still get value. Tell a continuous story: the same agent (support-agent) and the same scenario (refund threshold) should thread through all four steps.

**Step 1: Version your prompts (PromptOps)**

Description: Write prompts as YAML templates with variables. PromptOps auto-versions them on every git commit — semantic tags, diff tracking, and version history out of the box. Reference any version in code: `:v1.2.0`, `:latest`, or even `:unstaged` for testing uncommitted changes.

Code block — support-system.yaml:
```yaml
id: support-system
description: Customer support agent
variables:
  customer_name: { required: true }
  request: { required: true }
template: |
  You are a support agent for Acme Corp.

  REFUND POLICY:
  - Auto-approve refunds up to $200
  - Escalate refunds over $200
  - Never approve if customer is abusive
```

**Step 2: Bundle and promote (ReleaseOps)**

Description: ReleaseOps bundles your versioned prompts with tool policies and model config into an immutable, SHA-256 content-addressed artifact. Promote through environments with eval gates. Rollback in one command. Every action recorded in an audit trail.

Code block — app.py:
```python
from llmhq_releaseops.runtime import RuntimeLoader

loader = RuntimeLoader()
content = loader.load_bundle_content("support-agent@prod")

# Everything resolved and ready to use
model    = content["model"]       # {"model": "claude-sonnet-4-5", ...}
prompts  = content["prompts"]     # {"system": "You are a support agent..."}
policies = content["policies"]    # {"tools": {"allowed": [...]}, ...}

# Metadata auto-injected into OTel spans (silent no-op if OTel not configured)
```

Note: Do NOT mention "PromptBridge" in user-facing copy — it's an internal implementation detail. Just say "ReleaseOps reads your versioned prompts."

Note: Do NOT say "Rollback instantly" — say "Rollback in one command." The mechanism is promoting the previous version forward.

**Step 3: Know why behavior changed (Attribution)**

Description: When behavior shifts between versions, attribution traces each agent action back to the specific prompt lines and policy rules that influenced it. Pattern matching with confidence scoring — not causal claims. Points engineers to the right place to investigate.

Code block — terminal:
```
# Why did v1.0.0 ESCALATE the $120 refund?
Primary influence (confidence: 0.82, HIGH):
  Source: prompt (support-system@v1.0.0)
  Line 15: "Escalate any refund over $50"

# Why did v1.1.0 APPROVE it?
Primary influence (confidence: 0.82, HIGH):
  Source: prompt (support-system@v1.1.0)
  Line 13: "Auto-approve up to $200"
```

**CRITICAL:** Always include the honest disclaimer "Pattern matching with confidence scoring — not causal claims." Never remove this. It builds trust.

**CRITICAL:** Attribution confidence labels must be accurate. HIGH >= 0.80, MEDIUM >= 0.50, LOW < 0.50. Never show a confidence of 0.70 labeled as HIGH.

**Step 4: Compare versions (Analytics)**

Description: Aggregate behavioral metrics per version — latency percentiles, token usage, tool call distributions, error rates. Compare any two versions with weighted significance levels. Overall assessment: improvement, regression, neutral, or mixed. Integrates with OpenTelemetry and LangSmith.

Code block — terminal:
```
# Compare behavioral metrics across versions
releaseops analytics compare support-agent@1.0.0 support-agent@1.1.0

  Metric              Baseline  Candidate    Change  Significance
  ------------------- --------- ---------- --------- -----------
  error_rate              0.00       0.00      0.0%  negligible
  avg_latency_ms        124.44     124.44      0.0%  negligible
  approve_refund          1/5        2/5     +100%   major
  escalate_ticket         3/5        2/5      -33%   major

  Overall: neutral (performance stable, behavior shifted)
```

**Integration callout (after the four steps, before the install section):**

Title: "Fits into what you already run"

Display as a two-column before/after stack diagram. Communicates one idea: **"Your stack stays the same. LLMhq adds one layer."**

**Left column — "Your current stack"** (3 boxes, top-to-bottom with arrows):
1. **Agent Framework** — subtitle: "LangChain, CrewAI, raw API calls"
2. **LLM Provider** — subtitle: "OpenAI, Anthropic, local models"
3. **Observability** — subtitle: "OpenTelemetry, LangSmith, Datadog"

**Right column — "With LLMhq"** (4 boxes, LLMhq inserted between Agent Framework and LLM Provider):
1. **Agent Framework** — tag: "unchanged"
2. **LLMhq** — visually distinct (accent blue border + subtle glow), features: "Versioning · Bundling · Promotion · Attribution"
3. **LLM Provider** — tag: "unchanged"
4. **Observability** — tag: "enriched with release metadata"

Visual rules:
- Stack boxes identical in both columns (same size, border, bg) — except the LLMhq box
- LLMhq box uses accent color (#2563eb) border + blue glow
- Down-arrows between boxes as connectors
- Responsive: columns stack vertically on mobile (≤768px)

Below the diagram, italic callout: "LLMhq sits between your agent artifacts and your existing infrastructure. It doesn't replace anything — it adds version control, release engineering, and behavioral observability to whatever you're already running."

---

### Section 4: Product Relationship + Install

**Lead sentence:**
"Start with PromptOps. Add ReleaseOps when you need bundles, promotion, and attribution."

**Install block — progressive, not all-or-nothing:**
```bash
# Start with prompt versioning
pip install llmhq-promptops
promptops init repo

# Add release engineering when you're ready
pip install llmhq-releaseops
releaseops init

# Or install everything
pip install llmhq-promptops llmhq-releaseops
```

---

### Section 5: What Makes This Different (Philosophy)

Title: "What makes this different"

Display as four cards or a 2x2 grid. Each card has a short label, one-liner, and detail text.

**Card 1: Git-Native**
- One-liner: "Powered by the same ol' git."
- Detail: "Your prompts, bundles, and promotion history are YAML files in your repo. No new systems to learn. `git log` is the audit trail. `git diff` shows what changed."

**Card 2: Local-First**
- One-liner: "Your prompts stay in your repo. Your logic stays on your machine."
- Detail: "Nothing phones home. No API keys required to version prompts. No SaaS dashboard. Run everything locally with zero external dependencies."

**Card 3: No Lock-In**
- One-liner: "MIT licensed. Walk away anytime."
- Detail: "Framework-agnostic. Works with OpenAI, Anthropic, or local models. All artifacts are plain YAML in git. Stop using LLMhq tomorrow — everything is still in your repo."

**Card 4: Works With Your Existing Stack**
- One-liner: "Adds to your tools. Replaces none of them."
- Detail: "Already using OpenTelemetry? Release metadata auto-injects into your existing spans. Using LangSmith? Query your existing traces filtered by bundle version. Not using either? Everything still works — observability integrations are additive, never required. Keep your LLM provider, your agent framework, your monitoring setup. LLMhq layers on top."

---

### Section 6: Demos Link

Title: "See the full workflow"

"The interactive demos run both tools end-to-end with real scenarios. No API keys needed."

[Browse the Demos →] (links to /demos/)

---

### Section 7: Community / Footer

- GitHub: https://github.com/llmhq-hub
- PromptOps on PyPI: https://pypi.org/project/llmhq-promptops/
- ReleaseOps on PyPI: https://pypi.org/project/llmhq-releaseops/
- Discussions: https://github.com/orgs/llmhq-hub/discussions
- © 2026 LLM Headquarters. Built for the LLM development community.

---

## Demos Page (/demos/)

Demos are already built. The task is presenting them on the demos page in an embedded terminal replay format (asciinema-style).

Each demo is standalone, requires no API keys, and demonstrates one clear value proposition. List them on the /demos/ index page with short descriptions and embedded replays.

### Demo 1: Prompt Versioning (PromptOps)

**Title:** "Version your prompts in 60 seconds"
**What it shows:** The PromptOps lifecycle — writing a YAML prompt, auto-versioning on commit, testing unstaged changes, resolving different versions.
**Key moments:**
- Create a prompt YAML template with variables
- Edit the template (change a threshold or policy line)
- Show that git hooks auto-increment the version (PATCH/MINOR/MAJOR detection)
- Resolve `:unstaged` vs `:working` vs `:v1.0.0` — same prompt, different content
- Render with variables using `get_prompt("name", {"key": "value"})`

### Demo 2: Bundle & Promote (ReleaseOps Core)

**Title:** "Bundle, promote, and rollback"
**What it shows:** Creating an immutable bundle from versioned prompts + policies + model config, promoting through environments with gates, rolling back.
**Key moments:**
- Create a bundle: prompt refs + policy files + model config → SHA-256 content-addressed manifest
- Inspect the bundle: show the YAML manifest, the hash, the artifact refs
- Promote dev → staging → prod (show enforced path — can't skip to prod)
- Verify integrity: the hash in staging matches what was created in dev
- Rollback: promote previous version forward, see the audit trail entry

### Demo 3: Eval Gates

**Title:** "Quality gates that block bad releases"
**What it shows:** Running an eval suite against a bundle before promotion, and a failed eval blocking promotion.
**Key moments:**
- Define an eval suite with test cases and assertions
- Run eval with deterministic judges (ExactMatch, Contains, Regex)
- Show a passing eval → promotion allowed
- Modify the prompt to introduce a regression
- Run eval again → failing assertions → promotion blocked
- Show the eval report (markdown or JSON)

### Demo 4: Attribution

**Title:** "Which prompt line changed the behavior?"
**What it shows:** Two versions of the same agent handling identical requests differently, with attribution tracing the divergence to a specific prompt line.
**Key moments:**
- Two prompt versions: v1.0.0 (escalate refunds over $50) vs v1.1.0 (auto-approve up to $200)
- Same customer request: $120 refund
- v1.0.0 escalates, v1.1.0 approves
- Attribution output with confidence score and level (e.g., confidence: 0.82, HIGH)
**Important:** HIGH requires >= 0.80. MEDIUM >= 0.50. LOW < 0.50. Always include "Pattern matching with confidence scoring — not causal claims."

### Demo 5: Behavioral Analytics

**Title:** "What changed between versions?"
**What it shows:** Comparing behavioral metrics across two bundle versions — latency, token usage, tool call distributions, error rates — with significance assessment.
**Key moments:**
- Run both versions against the same set of scenarios
- Aggregate metrics per version
- Compare with significance levels: major (>25% change), moderate (>10%), minor (>5%)
- Overall assessment: improvement / regression / neutral / mixed

### Demo 6: Full Lifecycle (End-to-End)

**Title:** "The full workflow: version → bundle → promote → monitor"
**What it shows:** The complete pipeline across both tools.
**Scenario:** 5 customer requests, two prompt versions, one behavioral divergence (the $120 refund).
**Four acts:**
1. PromptOps: version two prompts (conservative and permissive refund thresholds)
2. ReleaseOps: bundle each into a release, promote through environments
3. Attribution: trace the behavioral divergence to the exact prompt line
4. Analytics: compare metrics across the two versions

### Demo Format

All demos use embedded terminal replay (asciinema-style) on the demos page. This means:
- Pre-recorded terminal sessions embedded in the page
- Playback controls (play, pause, speed)
- Dark terminal aesthetic with syntax-highlighted output
- No backend required — static assets hosted on GitHub Pages
- Each demo should be watchable in under 2 minutes

---

## PromptOps Capabilities (for /tools/ or dedicated page)

### What It Does
- Automated semantic versioning via git hooks (zero manual version management)
- YAML prompt templates with Jinja2 variable rendering
- Version references: `:unstaged`, `:working`, `:latest`, `:v1.2.0`
- Test uncommitted changes instantly without committing
- Pre-commit hook: detects changes, analyzes for semver, updates version, re-stages
- Post-commit hook: creates git tags, runs validation, generates audit logs
- Python SDK: `get_prompt()`, `PromptManager`, `has_uncommitted_changes()`, `get_prompt_diff()`
- CLI: `promptops init`, `promptops create prompt`, `promptops test`, `promptops hooks`
- Framework-agnostic: works with OpenAI, Anthropic, or any LLM
- Markdown report generation for version changes

### Semantic Versioning Rules
- PATCH (1.0.0 → 1.0.1): Template content changes only
- MINOR (1.0.0 → 1.1.0): New variables added (backward compatible)
- MAJOR (1.0.0 → 2.0.0): Required variables removed (breaking change)

### Version Reference Table
| Reference | Resolves To | Use Case |
|---|---|---|
| `prompt-name` | Smart default (unstaged if different, else working) | Development |
| `:unstaged` | Uncommitted changes in working directory | Testing changes |
| `:working` | Latest committed version (HEAD) | Production |
| `:latest` | Alias for `:working` | Production |
| `:v1.2.3` | Specific semantic version | Reproducible builds |

---

## ReleaseOps Capabilities (for /tools/ or dedicated page)

### Phase 1: Bundle Lifecycle
- **Bundles:** Immutable, SHA-256 content-addressed manifests of prompts + policies + model config
- **Environments:** Named deployment targets (dev/staging/prod) with pinned bundle versions
- **Promotion:** State machine (DRAFT → CANDIDATE → STAGED → PROD → ROLLED_BACK) with enforced paths
- **Eval gates:** Block promotion if no passing eval report exists
- **Rollback:** Promotes previous version forward, creates new history entry, skips gates
- **Content addressing:** SHA-256 hash of all artifacts — cryptographic verification across environments
- **Storage:** All state in YAML files in `.releaseops/`, tracked by git
- **PromptBridge:** Reads versioned prompts from PromptOps, bundles them into releases

### Phase 1: Eval Engine
- **Judge types:** ExactMatch, Contains, Regex (deterministic), LLM-as-Judge (OpenAI + Anthropic), Composite (require-all or weighted majority)
- **Error isolation:** Individual case failures don't break the suite
- **Reporters:** Markdown and JSON output
- **Promotion gating:** Eval results can block or allow environment promotion

### Phase 2: Behavioral Intelligence Layer
- **Telemetry Foundation:** TelemetryContext injected into OpenTelemetry spans with `releaseops.` prefix. Thread-safe context via contextvars. Auto-injection is on by default via RuntimeLoader — if OTel is configured in the user's app, span attributes are set automatically. If OTel is not configured, injection is a silent no-op.
- **Runtime SDK:** One-liner integration. `load_bundle("agent@prod")` resolves bundle, loads content, injects telemetry automatically. Context manager (`load_bundle_context`) for automatic cleanup. `load_bundle_content()` returns fully resolved content including rendered prompt text and parsed policy YAML.
- **Attribution Engine:** 3 analyzers (prompt, policy, model config). Confidence scoring 0.0–1.0 with levels: HIGH >= 0.80, MEDIUM >= 0.50, LOW < 0.50. Confidence is calculated from base scores plus bonuses (multi-keyword match, verb match, density scoring). Keyword extraction, line-level search, context extraction. Error isolation — individual analyzer failures return partial results. Framed as heuristic pattern matching, not causal analysis.
- **Behavioral Analytics:** Latency percentiles, token usage, tool call distributions, error rates. Version comparison with weighted significance (major >25%, moderate >10%, minor >5%). Overall assessment: improvement / regression / neutral / mixed.
- **LangSmith Integration:** REST API via httpx (optional dep). Query and filter traces by releaseops metadata. Attach metadata to runs, tag runs.

### Important Technical Nuances (Accuracy Matters)
- `bundle.policies` returns `Dict[str, ArtifactRef]` — file path references, not loaded content. To get resolved policy content, use `loader.load_bundle_content("agent@prod")` which returns `{"policies": {role: parsed_yaml_dict}}`.
- `bundle.prompts` also returns refs. Resolved prompt text comes from `load_bundle_content()`.
- The site and demos should not imply that `bundle.policies` or `bundle.prompts` give you usable content directly. Either use `load_bundle_content()` in examples, or clearly label the refs as references that need resolution.

### CLI Commands
```
releaseops init
releaseops bundle create/list/inspect/verify/diff
releaseops env list/get/set/history
releaseops promote promote
releaseops rollback
releaseops eval list/create/report/run
releaseops telemetry show/inject
releaseops attribution explain/analyze-batch
releaseops analytics metrics/compare/report
```

---

## Design Direction

### Visual Identity
- Clean, minimal, developer-focused. Think Stripe docs meets Vercel's landing page.
- Dark mode friendly. Monospace code blocks should feel native, not bolted on.
- No stock photography. No abstract AI imagery. No gradients-on-gradients.
- Color-code functionally: PromptOps → ReleaseOps boundary, promotion states, attribution confidence (green for HIGH, amber for MEDIUM, red for LOW).
- The "key moment" side-by-side should be visually striking — amber/caution for conservative, green for permissive.

### Typography
- Monospace for anything code-related (install commands, CLI output, code snippets)
- Clean sans-serif for body text
- Headings should be direct and short

### Code Examples
- Always show real, working code — not pseudocode
- Keep examples minimal. The `load_bundle_content()` one-liner is the hook.
- Terminal output should look like a real terminal (dark background, monospace, colored output)
- NEVER show truncated code with `# claude...` or `# {"syst...` — either show the full output or trim the example to fewer lines that display completely

### Key Visual Moments
1. The v1.0.0 vs v1.1.0 side-by-side — the "aha" moment (hero section)
2. The YAML prompt template — "oh, it's just a YAML file in my repo"
3. The `load_bundle_content()` one-liner — "that's all?"
4. The attribution terminal output — tracing to the exact line

---

## Language Rules

### Always Use
- "git-native" (not "git-based" or "git-compatible")
- "local-first" (not "self-hosted" or "on-premise")
- "content-addressed" (not "hashed")
- "behavioral attribution" (not "root cause analysis")
- "pattern matching with confidence scoring" (not "causal analysis")
- "promotion gates" (not "deployment")
- "framework-agnostic" (not "works with LangChain")
- "immutable bundles" (not "snapshots")
- "rollback in one command" (not "rollback instantly")

### Never Use
- "AI-powered" (the tools manage AI artifacts, they aren't AI themselves)
- "revolutionary" or "game-changing"
- "comprehensive solution" (implies all-or-nothing)
- "root cause" (overpromises attribution)
- "platform" (implies hosted SaaS — say "infrastructure" or "toolkit")
- "PromptBridge" in user-facing copy (internal implementation detail)

---

## Key Code Snippets (Use These on the Site)

### PromptOps — Get a versioned prompt
```python
from llmhq_promptops import get_prompt

# Smart default — unstaged if different, else working
prompt = get_prompt("user-onboarding")

# Specific version
prompt = get_prompt("user-onboarding:v1.2.1")

# Test uncommitted changes
prompt = get_prompt("user-onboarding:unstaged")

# With variables
rendered = get_prompt("user-onboarding", {"user_name": "Alice", "plan": "Pro"})
```

### ReleaseOps — Load fully resolved content
```python
from llmhq_releaseops.runtime import RuntimeLoader

loader = RuntimeLoader()
content = loader.load_bundle_content("support-agent@prod")

# Everything resolved and ready to use
model    = content["model"]       # {"model": "claude-sonnet-4-5", ...}
prompts  = content["prompts"]     # {"system": "You are a support agent..."}
policies = content["policies"]    # {"tools": {"allowed": [...]}, ...}

# Metadata auto-injected into OTel spans (silent no-op if OTel not configured)
```

### ReleaseOps — Promotion
```bash
releaseops bundle create support-agent \
  --artifact system=onboarding:v1.2.0 \
  --model claude-sonnet-4-5 --provider anthropic

releaseops promote promote support-agent 1.0.0 dev
releaseops promote promote support-agent 1.0.0 staging
releaseops promote promote support-agent 1.0.0 prod
```

### Attribution Output
```
# Why did v1.0.0 ESCALATE the $120 refund?
Primary influence (confidence: 0.82, HIGH):
  Source: prompt (support-system@v1.0.0)
  Line 15: "Escalate any refund over $50"

# Why did v1.1.0 APPROVE it?
Primary influence (confidence: 0.82, HIGH):
  Source: prompt (support-system@v1.1.0)
  Line 13: "Auto-approve up to $200"
```

### YAML Prompt Template
```yaml
id: support-system
description: Customer support agent
variables:
  customer_name: { required: true }
  request: { required: true }
template: |
  You are a support agent for Acme Corp.

  REFUND POLICY:
  - Auto-approve refunds up to $200
  - Escalate refunds over $200
  - Never approve if customer is abusive
```