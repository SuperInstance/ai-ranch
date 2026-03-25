# Research Ranch Example

A research-focused configuration for academic and industry research.

## 🎯 Use Case

Perfect for:
- Academic research
- Market research
- Competitive analysis
- Literature reviews

## 📁 Configuration

### Active Species

| Species | Role | Priority |
|---------|------|----------|
| Falcon | Research | Primary |
| Cattle | Analysis | Primary |
| Horse | Data processing | Secondary |
| Sheep | Consensus | Secondary |

### Setup

```bash
# Copy breeds
cp -r breeds/ /path/to/ai-ranch/templates/

# Configure research sources
# Edit config/sources.json with your research databases

# Start ranch
bun run dev
```

## 🔧 Research Workflow

1. **Query Formulation**: Sheep refines research questions
2. **Literature Search**: Falcon gathers sources
3. **Analysis**: Cattle synthesizes findings
4. **Data Processing**: Horse organizes results
5. **Report Generation**: Cattle creates final output

## 📊 Output Formats

| Format | Use Case |
|--------|----------|
| Summary | Quick overview |
| Detailed Report | Comprehensive analysis |
| Annotated Bibliography | Source tracking |
| Presentation | Stakeholder communication |

## 🔍 Source Integration

Configure sources in `config/sources.json`:

```json
{
  "sources": [
    { "name": "arxiv", "type": "api", "priority": 1 },
    { "name": "pubmed", "type": "api", "priority": 2 },
    { "name": "semantic_scholar", "type": "api", "priority": 1 }
  ]
}
```
