# Templates (`/templates`)

breed.md templates for defining custom agent configurations.

## 📁 Available Templates

| Template | Species | Use Case |
|----------|---------|----------|
| `email-analyst.md` | Cattle | Email processing and analysis |
| `quick-search.md` | Falcon | Fast information retrieval |
| `data-pipeline.md` | Horse | ETL and data processing |
| `customer-support.md` | Cattle | Customer service and ticket management |
| `api-gateway.md` | Duck | API integration and webhooks |
| `security-analyst.md` | Hog | Security analysis and incident response |
| `project-manager.md` | Sheep | Project coordination and consensus |
| `data-engineer.md` | Horse | Data transformation and pipelines |
| `system-monitor.md` | Chicken | System monitoring and alerts |
| `research-assistant.md` | Falcon | Research and information synthesis |
| `code-navigator.md` | Goat | Code navigation and architecture |

---

## 📝 Template Details

### Email Analyst (`email-analyst.md`)
**Species:** Cattle | **Priority:** Professional

A cattle species specialized for email processing and analysis.

**Capabilities:**
- email_processing (weight: 1.0)
- analysis (weight: 0.9)
- summarization (weight: 0.7)
- priority_detection (weight: 0.8)

---

### Quick Search (`quick-search.md`)
**Species:** Falcon | **Priority:** Speed

A falcon species optimized for fast information retrieval.

**Capabilities:**
- search (weight: 1.0)
- quick_lookup (weight: 0.95)
- indexing (weight: 0.8)
- caching (weight: 0.9)

---

### Data Pipeline (`data-pipeline.md`)
**Species:** Horse | **Priority:** Reliability

A horse species for ETL and data processing.

**Capabilities:**
- etl (weight: 1.0)
- data_pipeline (weight: 0.95)
- transformation (weight: 0.9)
- batch_processing (weight: 0.85)

---

### Customer Support (`customer-support.md`)
**Species:** Cattle | **Priority:** Empathy

A patient and empathetic agent for customer support.

**Capabilities:**
- customer_support (weight: 1.0)
- conflict_resolution (weight: 0.95)
- ticket_triage (weight: 0.85)
- faq_matching (weight: 0.8)

---

### API Gateway (`api-gateway.md`)
**Species:** Duck | **Priority:** Speed

A fast and reliable agent for API integration.

**Capabilities:**
- api_integration (weight: 1.0)
- webhook_handling (weight: 0.95)
- rate_limiting (weight: 0.85)
- error_retry (weight: 0.9)

---

### Security Analyst (`security-analyst.md`)
**Species:** Hog | **Priority:** Thoroughness

A thorough agent for security analysis and incident response.

**Capabilities:**
- security_analysis (weight: 1.0)
- vulnerability_detection (weight: 0.95)
- log_analysis (weight: 0.9)
- incident_response (weight: 0.85)

---

### Project Manager (`project-manager.md`)
**Species:** Sheep | **Priority:** Consensus

A consensus-building agent for project coordination.

**Capabilities:**
- project_coordination (weight: 1.0)
- team_alignment (weight: 0.95)
- decision_facilitation (weight: 0.9)
- risk_assessment (weight: 0.85)

---

### Data Engineer (`data-engineer.md`)
**Species:** Horse | **Priority:** Accuracy

A reliable agent for ETL pipelines and database operations.

**Capabilities:**
- etl_pipelines (weight: 1.0)
- data_transformation (weight: 0.95)
- database_operations (weight: 0.9)
- data_validation (weight: 0.85)

---

### System Monitor (`system-monitor.md`)
**Species:** Chicken | **Priority:** Alertness

An alert agent for system monitoring and health checks.

**Capabilities:**
- system_monitoring (weight: 1.0)
- health_checks (weight: 0.95)
- anomaly_detection (weight: 0.9)
- alert_management (weight: 0.85)

---

### Research Assistant (`research-assistant.md`)
**Species:** Falcon | **Priority:** Comprehensiveness

A fast and comprehensive agent for research.

**Capabilities:**
- web_research (weight: 1.0)
- information_synthesis (weight: 0.95)
- source_verification (weight: 0.85)
- citation_tracking (weight: 0.8)

---

### Code Navigator (`code-navigator.md`)
**Species:** Goat | **Priority:** Navigation

An intelligent agent for code navigation and architecture analysis.

**Capabilities:**
- code_navigation (weight: 1.0)
- architecture_analysis (weight: 0.9)
- dependency_tracking (weight: 0.85)
- code_search (weight: 0.95)

---

## 🧬 breed.md Format Reference

### Required Sections

| Section | Description |
|---------|-------------|
| `# species` | Species type (cattle, duck, goat, sheep, horse, falcon, hog, chicken) |
| `# name` | Agent display name |
| `# description` | Agent purpose and role |

### Optional Sections

| Section | Description |
|---------|-------------|
| `# capabilities` | Skills with weights (0.0-1.0) |
| `# personality` | Tone, verbosity, creativity, risk_tolerance |
| `# model` | base_model, lora, temperature, max_tokens, top_p |
| `# evolution` | mutation_rate, crossover_rate, selection_pressure, elite_count |
| `# constraints` | required, forbidden, preferred behaviors |

### Example Template

```markdown
# species
cattle

# name
My Custom Agent

# description
A specialized agent for [specific use case].

# capabilities
- capability_1 (weight: 1.0)
- capability_2 (weight: 0.9)
- capability_3 (weight: 0.7)

# personality
tone: professional
verbosity: normal
creativity: 0.5
risk_tolerance: 0.3

# model
base_model: phi-3-mini
temperature: 0.7
max_tokens: 1024

# evolution
mutation_rate: 0.1
crossover_rate: 0.7
selection_pressure: 0.3
elite_count: 2

# constraints
- required: [what must always be done]
- forbidden: [what must never be done]
- preferred: [preferred behaviors]
```

---

## 🚀 Creating Custom Templates

1. **Copy an existing template** as a starting point
2. **Choose appropriate species** for your use case
3. **Define capabilities** with appropriate weights
4. **Set personality** to match desired behavior
5. **Configure model** settings for your LLM
6. **Add constraints** for safety and compliance
7. **Save** with a descriptive name (kebab-case)

### Species Selection Guide

| Species | Best For | Key Traits |
|---------|----------|------------|
| Cattle | Heavy reasoning, analysis | patience: 0.9, speed: 0.3 |
| Duck | Network, API calls | speed: 0.8 |
| Goat | Navigation, spatial | balanced |
| Sheep | Consensus, voting | patience: 0.9 |
| Horse | ETL, data pipelines | thoroughness: 0.9 |
| Falcon | Search, reconnaissance | speed: 0.95 |
| Hog | Diagnostics, logging | thoroughness: 0.95 |
| Chicken | Monitoring, alerts | speed: 0.9 |

---

## 📚 Related

- [Breed Parser Library](../src/lib/breed-parser.ts)
- [Species Registry Library](../src/lib/species.ts)
- [API Reference](../docs/api-reference.md)
- [Examples Directory](../examples/)
