# Consultancy Ranch Example

A multi-agent configuration for consultancy and professional services.

## 🎯 Use Case

Perfect for:
- Consulting firms
- Professional services
- Multi-client workflows
- Complex analysis tasks

## 📁 Configuration

### Active Species

| Species | Role | Priority |
|---------|------|----------|
| Cattle | Deep analysis | Primary |
| Sheep | Consensus building | Primary |
| Horse | Data processing | Secondary |
| Falcon | Research | Secondary |

### Setup

```bash
# Copy breeds
cp -r breeds/ /path/to/ai-ranch/templates/

# Configure environment
cp .env.example .env
# Edit .env with your API keys

# Start ranch
bun run dev
```

## 🔧 Specialized Breeds

### Client Communication (Cattle)
```markdown
# personality
tone: professional
verbosity: normal
creativity: 0.3
```

### Analysis Report (Horse)
```markdown
# capabilities
- data_analysis (weight: 1.0)
- report_generation (weight: 0.95)
- visualization (weight: 0.8)
```

## 📊 Workflow

1. **Intake**: Sheep gathers requirements
2. **Analysis**: Cattle performs deep analysis
3. **Research**: Falcon gathers supporting data
4. **Processing**: Horse prepares deliverables
5. **Review**: Sheep ensures alignment

## 📈 Scaling

For larger teams:
- Add multiple Cattle instances
- Enable Night School evolution
- Configure channel connectors for client communication
