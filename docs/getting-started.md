---
layout: default
title: "Getting Started"
description: "Get started with LLM Headquarters tools"
---

# Getting Started

Welcome to LLM Headquarters! This guide will help you get started with our production-ready tools for LLM workflows.

## PromptOps Quick Start

PromptOps is our tool for git-native prompt management and testing.

### Installation

```bash
pip install llmhq-promptops
```

### Initialize a Repository

```bash
# Create a new git repository with PromptOps
promptops init repo

# Or initialize in an existing git repository
cd your-project
promptops init
```

### Create Your First Prompt

```bash
# Create a new prompt template
promptops create prompt welcome-message
```

This creates a `prompts/welcome-message.md` file where you can write your prompt template.

### Test Your Prompts

```bash
# Test the current working version
promptops test --prompt welcome-message

# Test uncommitted changes
promptops test --prompt welcome-message:unstaged

# Test a specific version
promptops test --prompt welcome-message:v1.0.0
```

### Python Integration

```python
from llmhq_promptops import get_prompt

# Get a prompt (smart default behavior)
prompt = get_prompt("welcome-message")

# Get with variables
prompt = get_prompt("welcome-message", {
    "user_name": "Alice",
    "plan": "Pro"
})

# Use with your LLM framework
import openai
response = openai.chat.completions.create(
    model="gpt-4",
    messages=[{"role": "user", "content": prompt}]
)
```

## ReleaseOps Quick Start

ReleaseOps brings release engineering to AI agent behavior — bundle prompts, policies, and model configs into versioned artifacts and promote them through gated environments.

### Installation

```bash
pip install llmhq-releaseops
```

For LLM-as-judge evaluation support:

```bash
pip install llmhq-releaseops[eval]
```

### Initialize Release Infrastructure

```bash
releaseops init
```

This creates `.releaseops/` with environments (dev, staging, prod), bundle storage, and eval directories.

### Create a Bundle

```bash
releaseops bundle create support-agent \
  --artifact system=onboarding:v1.2.0 \
  --model claude-sonnet-4-5 --provider anthropic
```

### Promote Through Environments

```bash
# Promote to dev
releaseops promote promote support-agent 1.0.0 dev

# Then staging, then prod
releaseops promote promote support-agent 1.0.0 staging
releaseops promote promote support-agent 1.0.0 prod
```

### Load at Runtime

```python
from llmhq_releaseops.runtime import RuntimeLoader

loader = RuntimeLoader()
bundle, metadata = loader.load_bundle("support-agent@prod")

# Access resolved bundle data
model = bundle.model_config.model
prompts = bundle.prompts
policies = bundle.policies

# Metadata is automatically injected into OpenTelemetry spans
```

## Key Concepts

### PromptOps Version References

- `:unstaged` - Test uncommitted changes
- `:working` - Current working directory state
- `:latest` - Latest git tag
- `:v1.2.3` - Specific version tag

### ReleaseOps Core Concepts

- **Bundle** - Immutable manifest of prompts + policies + model config (SHA-256 verified)
- **Environment** - Deployment target (dev/staging/prod) with a pinned bundle version
- **Promotion** - Moving a bundle through environments with quality gates
- **Attribution** - Trace agent behavior back to specific prompt lines and policy rules

## Next Steps

- Explore the [Tools](/tools/) section for detailed documentation
- [PromptOps Documentation](/tools/promptops)
- [ReleaseOps Documentation](/tools/releaseops)
- Join our [GitHub Discussions](https://github.com/orgs/llmhq-hub/discussions)

## Support

- [PromptOps Issues](https://github.com/llmhq-hub/promptops/issues)
- [ReleaseOps Issues](https://github.com/llmhq-hub/releaseops/issues)
- [Discussions](https://github.com/orgs/llmhq-hub/discussions)
- [Documentation](/tools/)
