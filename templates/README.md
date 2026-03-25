# Templates (`/templates`)

breed.md templates for defining custom agent configurations.

## 📁 Files

```
templates/
├── email-analyst.md       # Email processing agent
├── quick-search.md        # Fast search agent
└── data-pipeline.md       # ETL processing agent
```

## 📝 Template Overview

### Email Analyst (`email-analyst.md`)

A cattle species specialized for email processing and analysis.

**Use Case:** Processing emails, extracting action items, prioritizing messages

**Key Features:**
- Professional tone
- Concise output
- Email processing capability
- Priority detection

```markdown
# species
cattle

# capabilities
- email_processing (weight: 1.0)
- analysis (weight: 0.9)
- summarization (weight: 0.7)
- priority_detection (weight: 0.8)

# personality
tone: professional
verbosity: concise
creativity: 0.3
```

---

### Quick Search (`quick-search.md`)

A falcon species optimized for fast information retrieval.

**Use Case:** Quick searches, real-time lookups, information retrieval

**Key Features:**
- Casual tone
- High speed
- Search capabilities
- Caching optimization

```markdown
# species
falcon

# capabilities
- search (weight: 1.0)
- quick_lookup (weight: 0.95)
- indexing (weight: 0.8)
- caching (weight: 0.9)

# personality
tone: casual
verbosity: concise
creativity: 0.2
```

---

### Data Pipeline (`data-pipeline.md`)

A horse species for ETL and data processing.

**Use Case:** Data transformation, batch processing, streaming pipelines

**Key Features:**
- Technical tone
- Detailed output
- ETL capabilities
- Batch processing

```markdown
# species
horse

# capabilities
- etl (weight: 1.0)
- data_pipeline (weight: 0.95)
- transformation (weight: 0.9)
- batch_processing (weight: 0.85)

# personality
tone: technical
verbosity: detailed
creativity: 0.2
```

---

## 🧬 breed.md Format

### Required Sections

| Section | Description |
|---------|-------------|
| `# species` | Species type (cattle, duck, goat, etc.) |
| `# name` | Agent name |
| `# description` | Agent purpose |

### Optional Sections

| Section | Description |
|---------|-------------|
| `# capabilities` | Skills with weights |
| `# personality` | Tone, verbosity, creativity |
| `# model` | Model configuration |
| `# evolution` | Evolution parameters |
| `# constraints` | Behavioral constraints |

### Capability Weight Format

```markdown
# capabilities
- capability_name (weight: 0.9)
- another_capability (weight: 0.7)
```

Weights range from 0.0 to 1.0, indicating importance.

### Personality Options

```markdown
# personality
tone: formal | casual | technical | friendly
verbosity: concise | normal | detailed
creativity: 0.0 - 1.0
risk_tolerance: 0.0 - 1.0
```

### Model Configuration

```markdown
# model
base_model: phi-3-mini
lora: adapter-name-v1
temperature: 0.5
max_tokens: 1024
top_p: 0.9
```

### Evolution Configuration

```markdown
# evolution
mutation_rate: 0.1
crossover_rate: 0.7
selection_pressure: 0.3
elite_count: 2
```

---

## 🚀 Creating Custom Templates

1. **Copy an existing template** as a starting point
2. **Modify the species** to match your use case
3. **Adjust capabilities** with appropriate weights
4. **Set personality** to match desired behavior
5. **Configure model** settings
6. **Save** with a descriptive name

### Example: Customer Support Agent

```markdown
# species
sheep

# name
Customer Support Agent

# description
A consensus-focused agent for customer support and mediation.

# capabilities
- customer_support (weight: 1.0)
- conflict_resolution (weight: 0.9)
- ticket_triage (weight: 0.8)
- faq_matching (weight: 0.7)

# personality
tone: friendly
verbosity: normal
creativity: 0.4
risk_tolerance: 0.2

# model
base_model: phi-3-mini
temperature: 0.6
max_tokens: 512

# constraints
- required: Always be polite and professional
- forbidden: Never share customer data
- preferred: Offer multiple solutions
```

---

## 🔄 Using Templates

Templates are parsed by the `BreedParser`:

```typescript
import { breedParser } from '@/lib/breed-parser';
import { speciesRegistry } from '@/lib/species';

// Parse a template file
const result = breedParser.parseFile('./templates/email-analyst.md');

if (result.success && result.dna) {
  // Load into species registry
  const species = speciesRegistry.loadFromDNA(result.dna);
  console.log('Loaded species:', species.name);
}
```

### Hot Reload

```typescript
// Watch for template changes
breedParser.watch('./templates/email-analyst.md');

// Subscribe to changes
breedParser.subscribe((dna, path) => {
  console.log('Template updated:', path);
  speciesRegistry.loadFromDNA(dna);
});
```

---

## 📚 Related

- [Breed Parser Library](../src/lib/breed-parser.ts)
- [Species Registry Library](../src/lib/species.ts)
- [API Reference](../docs/api-reference.md)
