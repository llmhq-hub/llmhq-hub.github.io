---
layout: default
title: "Tools"
description: "Production-ready tools for LLM workflows"
---

# Tools

## Available Tools

{% for tool in site.data.tools %}
<div class="tool-card">
  <h3><a href="{{ tool.docs }}">{{ tool.name }}</a></h3>
  <p>{{ tool.description }}</p>
  
  <div class="tool-meta">
    <span class="status status-{{ tool.status }}">{{ tool.status }}</span>
    {% if tool.version != "coming-soon" %}
      <span class="version">v{{ tool.version }}</span>
    {% endif %}
  </div>
  
  {% if tool.features %}
  <ul class="features">
    {% for feature in tool.features %}
      <li>{{ feature }}</li>
    {% endfor %}
  </ul>
  {% endif %}
  
  <div class="tool-links">
    {% if tool.pypi != "" %}
      <a href="{{ tool.pypi }}" class="btn">PyPI</a>
    {% endif %}
    {% if tool.github != "" %}
      <a href="{{ tool.github }}" class="btn">GitHub</a>
    {% endif %}
    {% if tool.docs != "" %}
      <a href="{{ tool.docs }}" class="btn">Documentation</a>
    {% endif %}
  </div>
</div>
{% endfor %}