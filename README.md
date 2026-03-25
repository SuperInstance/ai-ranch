# AI Ranch 🐄

<div align="center">

**Self-Evolving AI Agent System**

A Next.js implementation of the SuperInstance architecture for local-first, continuously improving AI agents.

[![Version](https://img.shields.io/badge/version-0.3.0-orange.svg)](https://github.com/SuperInstance/ai-ranch)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Next.js](https://img.shields.io/badge/Next.js-15-black.svg)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue.svg)](https://www.typescriptlang.org)

</div>

---

## 🌟 Features

### 🧬 Species Registry
8 specialized agent types, each optimized for different tasks:

| Species | Role | Best For |
|---------|------|----------|
| 🧠 Cattle | Heavy Reasoning | Analysis, email processing, document review |
| 🦆 Duck | Network | API calls, webhooks, HTTP requests |
| 🧭 Goat | Navigation | Pathfinding, spatial reasoning |
| ☁️ Sheep | Consensus | Voting, mediation, group decisions |
| ⚡ Horse | ETL | Data pipelines, batch processing |
| 👁️ Falcon | Search | Quick lookups, reconnaissance |
| 🐛 Hog | Diagnostics | Logging, debugging, tracing |
| 🥚 Chicken | Monitoring | Alerts, health checks, watchdog |

### 🐕 Collie Orchestrator
Intelligent routing system that analyzes intent and dispatches to the optimal species:
- Keyword-based matching with confidence scoring
- Species fitness consideration
- Alternative species suggestions

### 📝 breed.md DNA System
Define agent behavior through markdown configuration:
```markdown
# species
cattle

# name
Email Analyst

# capabilities
- email_processing (weight: 1.0)
- analysis (weight: 0.9)

# personality
tone: professional
creativity: 0.3
```

### 🌙 Night School Evolution
Daily evolution cycle running at 02:00 AM:
1. **Evaluate** - Score species fitness based on task history
2. **Cull** - Remove underperforming species
3. **Breed** - Create offspring from top performers
4. **Distill** - Cloud training for offspring
5. **Quarantine** - Test offspring in sandbox
6. **Promote** - Promote successful offspring

### 📊 Web Dashboard
Real-time monitoring interface:
- Species panel with traits and capabilities
- Task manager with routing visualization
- Evolution history and metrics
- System metrics (latency, tokens/s, VRAM)

## 🚀 Quick Start

```bash
# Clone the repository
git clone https://github.com/SuperInstance/ai-ranch.git
cd ai-ranch

# Install dependencies
bun install

# Start development server
bun run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the dashboard.

## 📖 API Reference

### Species
```bash
# List all species
GET /api/ranch/species

# Get specific species
GET /api/ranch/species?name=cattle

# Update species
POST /api/ranch/species
{ "name": "cattle", "updates": { "fitness": 0.85 } }
```

### Tasks
```bash
# Create task
POST /api/ranch/tasks
{ "content": "Analyze this email..." }

# Get tasks
GET /api/ranch/tasks

# Get active tasks
GET /api/ranch/tasks?active=true
```

### Evolution
```bash
# Get evolution history
GET /api/ranch/evolution

# Trigger evolution
POST /api/ranch/evolution
```

## 🏗️ Architecture

```
src/
├── app/
│   ├── api/ranch/          # REST API endpoints
│   ├── layout.tsx          # Root layout
│   └── page.tsx            # Dashboard page
├── components/
│   ├── ranch/              # Dashboard components
│   └── ui/                 # shadcn/ui components
├── lib/
│   ├── breed-parser.ts     # breed.md parser
│   ├── collie.ts           # Orchestrator
│   ├── night-school.ts     # Evolution system
│   └── species.ts          # Species registry
└── types/
    └── ranch.ts            # TypeScript types
```

## 🎯 Roadmap

### Phase 1: MVP (Current)
- [x] Species Registry
- [x] Collie Orchestrator
- [x] breed.md Parser
- [x] Night School Evolution
- [x] Web Dashboard
- [x] REST API

### Phase 2: Production
- [ ] TensorRT-LLM Integration
- [ ] LoRA Hot-Swap
- [ ] Discord/Telegram Connectors
- [ ] CUDA Graph Reflex Cache
- [ ] Real Benchmarks

### Phase 3: Scale
- [ ] Multi-Jetson Sync
- [ ] CRDT Memory Pasture
- [ ] Cloud Distillation
- [ ] Community Gene Pool

## 🤝 Contributing

Contributions are welcome! Please read our contributing guidelines before submitting PRs.

## 📄 License

MIT License - see [LICENSE](LICENSE) for details.

---

<div align="center">

Built with ❤️ for the edge AI community

**[SuperInstance](https://github.com/SuperInstance)** | **[Documentation](./docs)** | **[API Reference](./docs/api-reference.md)**

</div>
