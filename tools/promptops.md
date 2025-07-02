---
layout: tool
title: "PromptOps"
description: "Git-native prompt management and testing framework"
---

# PromptOps
**Git-native prompt management and testing framework for production LLM workflows**

## Features

### 🔄 Automated Git Versioning
Zero-manual versioning with git hooks and semantic version detection

### 📝 Uncommitted Change Testing
Test prompts instantly with `:unstaged`, `:working`, `:latest` references

### 🧪 Version-Aware Testing
Test different prompt versions with comprehensive validation

### 📊 Markdown Reports
Automatic generation of version change documentation

### ⚙️ Git Hook Automation
Pre-commit and post-commit hooks for seamless developer workflow

## Installation

```bash
pip install llmhq-promptops
```

## Quick Start

```bash
# Create a new project with git hooks
promptops init repo

# Create a new prompt template
promptops create prompt welcome-message

# Test uncommitted changes
promptops test --prompt welcome-message:unstaged

# Check status of all prompts
promptops test status
```

## Python SDK

```python
from llmhq_promptops import get_prompt

# Smart default (unstaged if different, else working)
prompt = get_prompt("user-onboarding")

# Specific version references
prompt = get_prompt("user-onboarding:v1.2.1")
prompt = get_prompt("user-onboarding:unstaged")
prompt = get_prompt("user-onboarding:working")

# With variables
rendered = get_prompt("user-onboarding", {
    "user_name": "Alice", 
    "plan": "Pro"
})
```

## Framework Integration

Works with any LLM framework:

```python
from llmhq_promptops import get_prompt

# Get versioned prompt
prompt_text = get_prompt("user-onboarding:working", {
    "user_name": "John", 
    "plan": "Enterprise"
})

# Use with OpenAI
import openai
response = openai.chat.completions.create(
    model="gpt-4",
    messages=[{"role": "user", "content": prompt_text}]
)

# Use with Anthropic
import anthropic
client = anthropic.Anthropic()
response = client.messages.create(
    model="claude-3-sonnet-20240229",
    messages=[{"role": "user", "content": prompt_text}]
)
```

## Links

- [PyPI Package](https://pypi.org/project/llmhq-promptops/)
- [GitHub Repository](https://github.com/llmhq-hub/promptops)
- [Report Issues](https://github.com/llmhq-hub/promptops/issues)
- [Discussions](https://github.com/llmhq-hub/promptops/discussions)

## Requirements

- Python 3.8+
- Git (required for versioning)
- Dependencies: Typer, Jinja2, PyYAML, GitPython