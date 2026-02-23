---
layout: tool
title: "ReleaseOps"
description: "Release engineering infrastructure for AI agent behavior"
---

# ReleaseOps
**Release engineering for AI agent behavior — bundle, promote, evaluate, and observe behavior artifacts**

## Why ReleaseOps?

AI agents ship behavior through prompts, policies, and model configurations — not deterministic code. When something breaks in production, there's no `git blame` for "why did the agent start approving refunds it shouldn't?" ReleaseOps brings standard release engineering to these behavior artifacts, so you always know what's running, what changed, and why.

## Features

### 📦 Bundle Creation
Compose prompts, policies, and model configs into immutable, content-addressed artifacts verified with SHA-256 hashing.

### 🚀 Gated Promotion
Move bundles through environments (dev → staging → prod) with configurable quality gates: evaluation, approval, and soak time.

### ⏪ Instant Rollback
Revert to any previous bundle version instantly with a full audit trail of every promotion and rollback.

### 🧪 Automated Evaluation
Run test suites with pluggable judges — exact match, regex, LLM-as-judge (OpenAI/Anthropic), or composite judges.

### 📡 OpenTelemetry Integration
Automatically inject bundle metadata into OpenTelemetry spans for production observability and tracing.

### 🔍 Behavior Attribution
Trace agent behavior back to specific prompt lines and policy rules that caused it, with confidence scoring.

## Installation

```bash
pip install llmhq-releaseops
```

| Extra | Install | Adds |
|-------|---------|------|
| `eval` | `pip install llmhq-releaseops[eval]` | LLM-as-judge (OpenAI, Anthropic) |
| `langsmith` | `pip install llmhq-releaseops[langsmith]` | LangSmith trace queries |
| `dev` | `pip install llmhq-releaseops[dev]` | pytest, black, mypy |

## Quick Start

```bash
# Initialize release infrastructure
releaseops init

# Create a bundle from prompts and model config
releaseops bundle create support-agent \
  --artifact system=onboarding:v1.2.0 \
  --model claude-sonnet-4-5 --provider anthropic

# Promote through environments
releaseops promote promote support-agent 1.0.0 dev
releaseops promote promote support-agent 1.0.0 staging
releaseops promote promote support-agent 1.0.0 prod

# Check environment status
releaseops env list

# Compare versions when something changes
releaseops analytics compare support-agent@1.0.0 support-agent@1.1.0
```

## Python SDK

```python
from llmhq_releaseops.runtime import RuntimeLoader

loader = RuntimeLoader()
bundle, metadata = loader.load_bundle("support-agent@prod")

# Access bundle data
model = bundle.model_config.model              # e.g., "claude-sonnet-4-5"
temperature = bundle.model_config.temperature  # e.g., 0.7
prompts = bundle.prompts                       # Dict of role -> ArtifactRef
policies = bundle.policies                     # Dict of role -> ArtifactRef

# Metadata is automatically injected into OpenTelemetry spans
```

For async code:

```python
from llmhq_releaseops.runtime import AsyncRuntimeLoader

async_loader = AsyncRuntimeLoader()
bundle, metadata = await async_loader.load_bundle("support-agent@prod")
```

## Key Concepts

- **Bundle** — Immutable, content-addressed manifest of prompts + policies + model config (SHA-256 verified)
- **Environment** — Named deployment target (dev/staging/prod) with a pinned bundle version
- **Promotion** — Moving a bundle through environments with optional quality gates (eval, approval, soak)
- **Telemetry** — Automatic injection of bundle metadata into OpenTelemetry spans
- **Attribution** — Trace agent behavior back to specific prompt lines and policy rules

## Links

- [PyPI Package](https://pypi.org/project/llmhq-releaseops/)
- [GitHub Repository](https://github.com/llmhq-hub/releaseops)
- [Report Issues](https://github.com/llmhq-hub/releaseops/issues)
- [Discussions](https://github.com/orgs/llmhq-hub/discussions)

## Requirements

- Python 3.10+
- Git (required for storage)
- Dependencies: Typer, PyYAML, Jinja2, GitPython, OpenTelemetry, llmhq-promptops
