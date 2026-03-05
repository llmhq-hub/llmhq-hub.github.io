# LLMHQ Website UI Spec

This document defines the messaging, content, structure, and design direction for the LLM Headquarters website (llmhq-hub.github.io). Use this as the source of truth when building or updating the site.

---

## Brand

- **Name:** LLM Headquarters (LLMhq)
- **Tagline:** "Operational infrastructure for AI agents."
- **One-liner:** Git-native release engineering for AI agents. Local-first. No lock-in.
- **Tone:** Engineering-focused, honest, no hype. Speak like a senior engineer explaining something to a peer. Never say "revolutionary", "game-changing", "AI-powered", or "comprehensive solution".

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

## Three Core Principles (Must Be Above the Fold)

These differentiate LLMhq from every competitor. They are not features — they are the philosophy. Display them prominently near the top of the landing page.

### 1. Git-Native
All state lives in YAML files tracked by git. No proprietary database. Bundle manifests, environment configs, promotion history, eval reports — all in the repo. `git log` is the audit trail. `git diff` shows what changed.

**Short label:** "Git-Native"
**One-liner:** "Powered by the same ol' git."
**Detail:** "Your prompts, bundles, and promotion history are YAML files in your repo. No new systems to learn."

### 2. Local-First
Nothing phones home. No API keys required to version prompts. No SaaS dashboard. Prompts never leave the machine unless the user pushes them.

**Short label:** "Local-First"
**One-liner:** "Your prompts stay in your repo. Your logic stays on your machine."
**Detail:** "No data leaves your environment. Run everything locally with zero external dependencies."

### 3. No Vendor Lock-In
MIT licensed. Framework-agnostic (works with OpenAI, Anthropic, local models). Integrates with existing observability (OpenTelemetry, LangSmith) rather than replacing it. All data is readable YAML — stop using LLMhq tomorrow and everything is still there.

**Short label:** "No Lock-In"
**One-liner:** "MIT licensed. Walk away anytime."
**Detail:** "Framework-agnostic. Works with your existing tools. All artifacts are plain YAML in git."

---

## Landing Page Structure

### Section 1: Hero

**Headline:** "Changed a prompt. Agent behaved differently in production. Which line?"

**Sub-headline:** "Git-native release engineering for AI agents. Local-first. No lock-in. No data leaving your machine."

**Trust badges (inline, horizontal):** Git-Native | Local-First | MIT Licensed

**Primary CTA:** `pip install llmhq-promptops` — "Start versioning your prompts"
**Secondary CTA:** "See the demos →" (links to /demos/ page)

### Section 2: Philosophy

Title: "What makes this different"

Display the three principles (git-native, local-first, no lock-in) as cards or columns. Each card has the short label, one-liner, and detail text from the section above. Use icons or minimal illustrations — no stock photos.

### Section 3: Progressive Workflow

Title: "One workflow, two tools"

Show the numbered pipeline. Make the PromptOps → ReleaseOps boundary explicit.

```
PromptOps                          ReleaseOps
─────────                          ──────────
1. Write    →  YAML template       3. Bundle   →  Prompt + policy + model config
2. Version  →  Git auto-tags       4. Promote  →  dev → staging → prod with gates
                                   5. Monitor  →  Attribution + behavioral analytics
```

Include a callout: "Each tool works standalone. Start with what you need."

### Section 4: How It Works (Expanded)

Four steps with code examples. Each step should feel self-contained — a reader can stop at any step and still get value.

**Step 1: Version your prompts (PromptOps)**
- Write prompts as YAML templates with Jinja2 variables
- Auto-versioned on every git commit via hooks
- Semantic versioning: PATCH (content change), MINOR (new variable), MAJOR (breaking change)
- Reference any version: `:v1.2.0`, `:latest`, `:unstaged`
- Code example: the YAML template + `get_prompt()` call

**Step 2: Bundle and promote (ReleaseOps)**
- Bundles prompt refs + tool policies + model config into an immutable artifact
- SHA-256 content-addressed — cryptographic proof that staging = prod
- Promotion state machine: DRAFT → CANDIDATE → STAGED → PROD
- Eval gates block promotion if quality thresholds aren't met
- Rollback promotes previous version forward, creates audit entry
- Code example: `RuntimeLoader().load_bundle("support-agent@prod")`

**Step 3: Know why behavior changed (Attribution)**
- Three analyzers: prompt, policy, model config
- Confidence scoring (0.0–1.0): HIGH >= 0.80, MEDIUM >= 0.50, LOW < 0.50
- Line-level attribution: traces behavior to specific prompt lines
- Code example: the attribution terminal output showing v1.0.0 vs v1.1.0

**Important framing for attribution:** Always include the honest disclaimer: "Pattern matching with confidence scoring — not causal claims. Points engineers to the right place to investigate." This builds trust. Never remove this.

**Step 4: Compare versions (Analytics)**
- Latency percentiles, token usage, tool call distributions, error rates
- Version comparison with significance levels (major/moderate/minor)
- Overall assessment: improvement / regression / neutral / mixed
- Integrates with OpenTelemetry and LangSmith

### Section 5: Demos

Title: "See it in action"

Link to each standalone demo with a one-line description. See the Demos section below for full specs.

### Section 6: Get Started

Progressive install, not all-or-nothing.

```
# Start with prompt versioning
pip install llmhq-promptops
promptops init repo

# Add release engineering when you're ready
pip install llmhq-releaseops
releaseops init

# Or install everything
pip install llmhq-promptops llmhq-releaseops
```

### Section 7: Community / Footer

- GitHub: https://github.com/llmhq-hub
- PromptOps on PyPI
- ReleaseOps on PyPI
- Discussions link
- MIT License

---

## Demos (/demos/)

Each demo is standalone, runs in the browser or terminal, requires no API keys, and demonstrates one clear value proposition. They should be listed on a /demos/ index page with short descriptions.

### Demo 1: Prompt Versioning (PromptOps)

**Title:** "Version your prompts in 60 seconds"
**What it shows:** The PromptOps lifecycle — writing a YAML prompt, auto-versioning on commit, testing unstaged changes, resolving different versions.
**Key moments:**
- Create a prompt YAML template with variables
- Edit the template (change a threshold or policy line)
- Show that git hooks auto-increment the version (PATCH/MINOR/MAJOR detection)
- Resolve `:unstaged` vs `:working` vs `:v1.0.0` — same prompt, different content
- Render with variables using `get_prompt("name", {"key": "value"})`
**Standalone value:** Even without ReleaseOps, users understand why auto-versioned prompts in git are better than text files or hardcoded strings.

### Demo 2: Bundle & Promote (ReleaseOps Core)

**Title:** "Bundle, promote, and rollback"
**What it shows:** Creating an immutable bundle from versioned prompts + policies + model config, promoting through environments with gates, rolling back.
**Key moments:**
- Create a bundle: prompt refs + policy files + model config → SHA-256 content-addressed manifest
- Inspect the bundle: show the YAML manifest, the hash, the artifact refs
- Promote dev → staging → prod (show enforced path — can't skip to prod)
- Verify integrity: the hash in staging matches what was created in dev
- Rollback: promote previous version forward, see the audit trail entry
**Standalone value:** Users see the promotion state machine and understand why immutable, content-addressed releases matter for AI agents.

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
**Standalone value:** Users see that promotions can be gated by automated quality checks — not just manual approval.

### Demo 4: Attribution

**Title:** "Which prompt line changed the behavior?"
**What it shows:** Two versions of the same agent handling identical requests differently, with attribution tracing the divergence to a specific prompt line.
**Key moments:**
- Two prompt versions: v1.0.0 (escalate refunds over $50) vs v1.1.0 (auto-approve up to $200)
- Same customer request: $120 refund
- v1.0.0 escalates, v1.1.0 approves
- Attribution output showing:
  - Primary influence with confidence score and level (e.g., confidence: 0.82, HIGH)
  - Source: prompt (support-system@v1.0.0), Line 15
  - Source: prompt (support-system@v1.1.0), Line 13
- The "key moment" visualization: one line changes everything
**Important:** Show realistic confidence values. HIGH requires >= 0.80. MEDIUM >= 0.50. LOW < 0.50. Don't show 0.70 labeled as HIGH — that's MEDIUM. Always include the disclaimer: "Pattern matching with confidence scoring — not causal claims."
**Standalone value:** Users see that when behavior diverges between versions, attribution narrows it down to the specific artifact and line.

### Demo 5: Behavioral Analytics

**Title:** "What changed between versions?"
**What it shows:** Comparing behavioral metrics across two bundle versions — latency, token usage, tool call distributions, error rates — with significance assessment.
**Key moments:**
- Run both versions against the same set of scenarios
- Aggregate metrics per version: latency percentiles, token distribution, tool call patterns
- Compare: show which metrics improved, regressed, or stayed neutral
- Significance levels: major (>25% change), moderate (>10%), minor (>5%)
- Overall assessment: improvement / regression / neutral / mixed
**Standalone value:** Users see quantified behavioral differences between versions without needing to guess.

### Demo 6: Full Lifecycle (End-to-End)

**Title:** "The full workflow: version → bundle → promote → monitor"
**What it shows:** The complete pipeline across both tools — from writing a prompt to understanding production behavior.
**Scenario:** 5 customer requests, two prompt versions, one behavioral divergence (the $120 refund).
**Four acts:**
1. PromptOps: version two prompts (conservative and permissive refund thresholds)
2. ReleaseOps: bundle each into a release, promote through environments
3. Attribution: trace the behavioral divergence to the exact prompt line
4. Analytics: compare metrics across the two versions
**This is the existing demo (`examples/demo_full.py`) expanded into an interactive format.**

### Demo Format Options
- **Interactive web demos** (hosted on GitHub Pages): step-through walkthroughs with simulated terminal output, code highlighting, and annotations. No backend required — all simulated.
- **Terminal demos** (runnable locally): `python demo_X.py` scripts that run in ~30 seconds with no API keys. Output is styled terminal text.
- Both formats should exist where possible. Web demos for discoverability, terminal demos for credibility ("it actually runs").

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
- If using color, keep it functional — highlight the PromptOps → ReleaseOps boundary, color-code promotion states, use green/red for attribution confidence levels.

### Typography
- Monospace for anything code-related (install commands, CLI output, code snippets)
- Clean sans-serif for body text
- Headings should be direct and short

### Code Examples
- Always show real, working code — not pseudocode
- Keep examples minimal. The `RuntimeLoader` one-liner is the hook. Don't bury it.
- Terminal output should look like a real terminal (dark background, monospace, colored output where appropriate)

### Key Visual Moments
1. The YAML prompt template — readers should immediately recognize this as "oh, this is just a YAML file in my repo"
2. The `load_bundle()` one-liner — the "wow, that's all?" moment
3. The attribution output — two versions side by side, tracing to the exact line
4. The promotion pipeline — visual flow from dev → staging → prod with gates

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

### Never Use
- "AI-powered" (the tools manage AI artifacts, they aren't AI themselves)
- "revolutionary" or "game-changing"
- "comprehensive solution" (implies all-or-nothing)
- "root cause" (overpromises attribution)
- "platform" (implies hosted SaaS — say "infrastructure" or "toolkit")

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

### ReleaseOps — Load a bundle at runtime (simple)
```python
from llmhq_releaseops.runtime import RuntimeLoader

loader = RuntimeLoader()
bundle, metadata = loader.load_bundle("support-agent@prod")

model = bundle.model_config.model  # "claude-sonnet-4-5"
# metadata auto-injected into OTel spans (silent no-op if OTel not configured)
```

### ReleaseOps — Load fully resolved content
```python
from llmhq_releaseops.runtime import RuntimeLoader

loader = RuntimeLoader()
content = loader.load_bundle_content("support-agent@prod")

# Everything resolved and ready to use
model     = content["model"]        # {"model": "claude-sonnet-4-5", "provider": "anthropic", ...}
prompts   = content["prompts"]      # {"system": "You are a support agent..."}
policies  = content["policies"]     # {"tools": {"allowed": [...]}, "safety": {...}}
metadata  = content["metadata"]     # TelemetryContext (auto-injected into OTel)
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

### Attribution Output (Corrected Confidence Labels)
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

Note: HIGH requires confidence >= 0.80. MEDIUM >= 0.50. LOW < 0.50. Always use accurate labels in demos and site content.

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
