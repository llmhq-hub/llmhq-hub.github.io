---
layout: default
title: "Getting Started"
description: "Get started with LLM Headquarters tools"
---

# Getting Started

Welcome to LLM Headquarters! This guide will help you get started with our production-ready tools for LLM workflows.

## PromptOps Quick Start

PromptOps is our flagship tool for git-native prompt management and testing.

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

## Key Concepts

### Version References

- `:unstaged` - Test uncommitted changes
- `:working` - Current working directory state
- `:latest` - Latest git tag
- `:v1.2.3` - Specific version tag

### Smart Defaults

When no version is specified, PromptOps uses intelligent defaults:
- If unstaged changes exist, use `:unstaged`
- Otherwise, use `:working`

## Next Steps

- Explore the [Tools](/tools/) section for more details
- Check out specific tool documentation
- Join our [GitHub Discussions](https://github.com/orgs/llmhq-hub/discussions)

## Support

- [GitHub Issues](https://github.com/llmhq-hub/promptops/issues)
- [Discussions](https://github.com/orgs/llmhq-hub/discussions)
- [Documentation](/tools/)