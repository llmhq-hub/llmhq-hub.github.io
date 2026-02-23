---
layout: default
title: "LLM Headquarters"
description: "Production-ready tools for LLM workflows"
---

# LLM Headquarters
**Production-ready tools for LLM workflows**

## Our Tools

### 🚀 PromptOps
Git-native prompt management and testing framework

- **Automated semantic versioning** - Zero-manual version management
- **Uncommitted change testing** - Test prompts with `:unstaged`, `:working`, `:latest` references
- **Framework-agnostic design** - Works with OpenAI, Anthropic, any LLM provider
- **Version-aware testing** - Comprehensive validation across prompt versions

[Learn More](/tools/promptops) | [PyPI](https://pypi.org/project/llmhq-promptops/) | [GitHub](https://github.com/llmhq-hub/promptops)

### 📦 ReleaseOps
Release engineering infrastructure for AI agent behavior

- **Bundle versioning** - Immutable, SHA-256 content-addressed behavior artifacts
- **Gated promotion** - Move bundles through dev → staging → prod with quality gates
- **Automated evaluation** - Pluggable judges (exact match, regex, LLM-as-judge)
- **Production observability** - OpenTelemetry integration and behavior attribution

[Learn More](/tools/releaseops) | [PyPI](https://pypi.org/project/llmhq-releaseops/) | [GitHub](https://github.com/llmhq-hub/releaseops)

### 🔧 Coming Soon
More tools for the LLM development lifecycle
- Performance monitoring
- Cost optimization

## Quick Start

### PromptOps

```bash
pip install llmhq-promptops
promptops init repo
```

```python
from llmhq_promptops import get_prompt

# Smart default (unstaged if different, else working)
prompt = get_prompt("user-onboarding")

# Test uncommitted changes
prompt = get_prompt("user-onboarding:unstaged")

# Specific version
prompt = get_prompt("user-onboarding:v1.2.1")
```

### ReleaseOps

```bash
pip install llmhq-releaseops
releaseops init
```

```python
from llmhq_releaseops.runtime import RuntimeLoader

loader = RuntimeLoader()
bundle, metadata = loader.load_bundle("support-agent@prod")
# bundle.model_config, bundle.prompts, bundle.policies — all resolved
# metadata is automatically injected into OpenTelemetry spans
```

## Community

- [GitHub Organization](https://github.com/llmhq-hub)
- [PromptOps Issues](https://github.com/llmhq-hub/promptops/issues)
- [ReleaseOps Issues](https://github.com/llmhq-hub/releaseops/issues)
- [Discussions](https://github.com/orgs/llmhq-hub/discussions)

---

*Building the future of LLM development workflows*
