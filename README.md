# AI Ranch 🐄

<div align="center">

**Self-Evolving AI Agent System**

A Next.js implementation of the SuperInstance architecture for local-first, continuously improving AI agents.

[![Version](https://img.shields.io/badge/version-0.3.0-orange.svg)](https://github.com/SuperInstance/ai-ranch)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Next.js](https://img.shields.io/badge/Next.js-15-black.svg)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue.svg)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38bdf8.svg)](https://tailwindcss.com)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)

[Quick Start](#-quick-start) • [Documentation](./docs) • [API Reference](./docs/api-reference.md) • [Architecture](#-architecture)

</div>

---

## 📑 Table of Contents

1. [Overview](#overview)
2. [Features](#-features)
3. [Quick Start](#-quick-start)
4. [Architecture](#-architecture)
5. [Core Concepts](#-core-concepts)
6. [API Reference](#-api-reference)
7. [Configuration](#-configuration)
8. [Development](#-development)
9. [Roadmap](#-roadmap)
10. [Contributing](#-contributing)

---

## Overview

AI Ranch is a **self-evolving AI agent system** that runs continuously, improving its performance through nightly evolution cycles. Inspired by natural selection, the system maintains a population of specialized AI "species" that compete, breed, and evolve based on task performance.

### Key Differentiators

| Feature | AI Ranch | Traditional Agents |
|---------|----------|-------------------|
| Evolution | ✅ Self-improving | ❌ Static |
| Local-first | ✅ Runs on edge | ❌ Cloud-dependent |
| Small binary | ✅ Single deployment | ❌ Multiple services |
| DNA-driven | ✅ breed.md configs | ❌ Hard-coded |
| Multi-species | ✅ 8 agent types | ❌ Single agent |

---

## 🌟 Features

### 🧬 Species Registry

8 specialized agent types, each optimized for different tasks:

| Species | Icon | Role | Key Traits | Best For |
|---------|------|------|------------|----------|
| **Cattle** | 🧠 | Heavy Reasoning | patience: 0.9, speed: 0.3 | Analysis, email processing, document review |
| **Duck** | 🦆 | Network | speed: 0.8 | API calls, webhooks, HTTP requests |
| **Goat** | 🧭 | Navigation | balanced | Pathfinding, spatial reasoning, mapping |
| **Sheep** | ☁️ | Consensus | patience: 0.9 | Voting, mediation, group decisions |
| **Horse** | ⚡ | ETL | thoroughness: 0.9 | Data pipelines, batch processing |
| **Falcon** | 👁️ | Search | speed: 0.95 | Quick lookups, reconnaissance |
| **Hog** | 🐛 | Diagnostics | thoroughness: 0.95 | Logging, debugging, tracing |
| **Chicken** | 🥚 | Monitoring | speed: 0.9 | Alerts, health checks, watchdog |

### 🐕 Collie Orchestrator

Intelligent routing system that analyzes intent and dispatches to the optimal species:

```
User Intent → Keyword Analysis → Species Scoring → Fitness Weighting → Selection
     │              │                  │                   │              │
     ▼              ▼                  ▼                   ▼              ▼
"Analyze this   "analyze",        cattle: 0.85      × 0.75 fitness   → cattle
 email..."      "email"           duck: 0.42
```

**Features:**
- Keyword-based matching with confidence scoring
- Species fitness consideration (better performers get priority)
- Alternative species suggestions for fallback
- Real-time routing decisions

### 📝 breed.md DNA System

Define agent behavior through simple markdown configuration:

```markdown
# species
cattle

# name
Email Analyst

# description
Specialized in email processing and analysis

# capabilities
- email_processing (weight: 1.0)
- analysis (weight: 0.9)
- summarization (weight: 0.7)
- priority_detection (weight: 0.8)

# personality
tone: professional
verbosity: concise
creativity: 0.3
risk_tolerance: 0.2

# model
base_model: phi-3-mini
lora: cattle-reasoning-v1
temperature: 0.5
max_tokens: 1024

# evolution
mutation_rate: 0.1
crossover_rate: 0.7
selection_pressure: 0.3
elite_count: 2

# constraints
- forbidden: Do not send emails without approval
- required: Always include a summary
- preferred: Use bullet points for clarity
```

### 🌙 Night School Evolution

Daily evolution cycle running at 02:00 AM:

```
┌────────────┐     ┌────────┐     ┌────────┐     ┌──────────┐
│  EVALUATE  │────►│  CULL  │────►│ BREED  │────►│ DISTILL  │
│  Score fit │     │ Remove │     │ Create │     │  Train   │
│            │     │  weak  │     │offspring│    │          │
└────────────┘     └────────┘     └────────┘     └──────────┘
                                                    │
                                                    ▼
┌────────────┐     ┌────────────┐            ┌───────────┐
│  COMPLETE  │◄────│  PROMOTE   │◄───────────│QUARANTINE │
│            │     │ Add to pop │            │   Test    │
└────────────┘     └────────────┘            └───────────┘
```

| Phase | Description | Duration |
|-------|-------------|----------|
| **Evaluate** | Score species fitness based on task history | ~100ms |
| **Cull** | Remove species below 0.3 fitness threshold | ~50ms |
| **Breed** | Create offspring from top performers via crossover | ~100ms |
| **Distill** | Cloud training for new offspring | ~100ms |
| **Quarantine** | Test offspring in sandbox (80% pass rate) | ~50ms |
| **Promote** | Add successful offspring to population | ~50ms |

### 📊 Web Dashboard

Real-time monitoring interface built with React and Tailwind CSS:

**Features:**
- **Species Panel**: View all species with traits, capabilities, fitness scores
- **Task Manager**: Create tasks, view routing decisions, see results
- **Evolution Panel**: Monitor Night School cycles, trigger manual evolution
- **Metrics Bar**: Real-time system metrics (requests, latency, tokens/s)

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ or Bun
- npm, yarn, or bun package manager

### Installation

```bash
# Clone the repository
git clone https://github.com/SuperInstance/ai-ranch.git
cd ai-ranch

# Install dependencies
bun install
# or
npm install

# Start development server
bun run dev
# or
npm run dev
```

### First Steps

1. **Open the Dashboard**

   Navigate to `http://localhost:3000` in your browser.

2. **Submit Your First Task**

   In the Task Panel, enter:
   ```
   Analyze this email and extract key action items
   ```

   Watch as the Collie routes it to the **cattle** species.

3. **Explore Species**

   Click the "Species" tab to see all 8 agent types with their traits.

4. **Trigger Evolution**

   Click "Run Evolution" in the Evolution tab to see Night School in action.

### Using the API

```bash
# Create a task
curl -X POST http://localhost:3000/api/ranch/tasks \
  -H "Content-Type: application/json" \
  -d '{"content": "Search for recent AI news"}'

# Get all species
curl http://localhost:3000/api/ranch/species

# Trigger evolution
curl -X POST http://localhost:3000/api/ranch/evolution
```

---

## 🏗️ Architecture

### Directory Structure

```
ai-ranch/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── api/ranch/         # REST API endpoints
│   │   │   ├── species/       # Species CRUD
│   │   │   ├── tasks/         # Task management
│   │   │   └── evolution/     # Evolution control
│   │   ├── globals.css        # Global styles
│   │   ├── layout.tsx         # Root layout
│   │   └── page.tsx           # Dashboard page
│   │
│   ├── components/            # React Components
│   │   ├── ranch/            # Ranch-specific
│   │   │   ├── dashboard.tsx
│   │   │   ├── species-panel.tsx
│   │   │   ├── task-panel.tsx
│   │   │   └── evolution-panel.tsx
│   │   └── ui/               # Reusable primitives
│   │
│   ├── lib/                   # Core Library
│   │   ├── breed-parser.ts   # breed.md parser
│   │   ├── collie.ts         # Orchestrator
│   │   ├── night-school.ts   # Evolution system
│   │   ├── species.ts        # Species registry
│   │   └── utils.ts          # Utilities
│   │
│   └── types/                 # TypeScript Types
│       └── ranch.ts          # All type definitions
│
├── docs/                      # Documentation
│   ├── api-reference.md      # API docs
│   └── quick-start.md        # Getting started
│
├── templates/                 # breed.md Templates
│   ├── email-analyst.md
│   ├── quick-search.md
│   └── data-pipeline.md
│
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── README.md
```

### System Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                           CLIENT LAYER                              │
│  ┌────────────────────────────────────────────────────────────────┐ │
│  │                    Web Dashboard (React)                        │ │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐            │ │
│  │  │   Species   │  │    Task     │  │  Evolution  │            │ │
│  │  │    Panel    │  │    Panel    │  │    Panel    │            │ │
│  │  └─────────────┘  └─────────────┘  └─────────────┘            │ │
│  └────────────────────────────────────────────────────────────────┘ │
└───────────────────────────────┬─────────────────────────────────────┘
                                │ HTTP/WebSocket
                                ▼
┌─────────────────────────────────────────────────────────────────────┐
│                           API LAYER                                 │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐                │
│  │  /species   │  │   /tasks    │  │ /evolution  │                │
│  │   route.ts  │  │   route.ts  │  │   route.ts  │                │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘                │
└─────────┼────────────────┼────────────────┼────────────────────────┘
          │                │                │
          ▼                ▼                ▼
┌─────────────────────────────────────────────────────────────────────┐
│                         CORE LIBRARY                                │
│                                                                     │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │                    Species Registry                           │  │
│  │  ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐     │  │
│  │  │ cattle │ │  duck  │ │  goat  │ │ sheep  │ │ horse  │ ... │  │
│  │  │ fitness│ │ fitness│ │ fitness│ │ fitness│ │ fitness│     │  │
│  │  └────────┘ └────────┘ └────────┘ └────────┘ └────────┘     │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                                ▲                                    │
│                                │                                    │
│  ┌──────────────────┐    ┌─────┴─────┐    ┌──────────────────┐    │
│  │   Breed Parser   │◄───│   Collie  │───►│  Night School    │    │
│  │  (breed.md DNA)  │    │Orchestrator│    │   (Evolution)    │    │
│  └──────────────────┘    └───────────┘    └──────────────────┘    │
│                                │                                    │
│                                ▼                                    │
│                         ┌───────────┐                              │
│                         │Task Queue │                              │
│                         └───────────┘                              │
└─────────────────────────────────────────────────────────────────────┘
```

### Data Flow

```
1. User submits task intent
   └─► Task Panel → POST /api/ranch/tasks

2. Collie analyzes and routes
   └─► CollieOrchestrator.route(intent) → RoutingDecision

3. Task is created and queued
   └─► CollieOrchestrator.createTask(intent) → Task

4. Species processes task
   └─► CollieOrchestrator.processTask(taskId) → TaskResult

5. Fitness is updated
   └─► SpeciesRegistry.updateFitness(species, newFitness)

6. Night School evolves population (02:00 AM)
   └─► NightSchool.runCycle() → EvolutionCycle
```

---

## 🎓 Core Concepts

### Species

A **Species** represents a specialized AI agent with unique traits:

```typescript
interface Species {
  name: SpeciesName;           // cattle, duck, goat, etc.
  description: string;          // Purpose description
  capabilities: string[];       // Skills this species has
  modelHint: string;           // Recommended model
  loraAdapter?: string;        // LoRA adapter name
  traits: {
    patience: number;          // 0-1
    thoroughness: number;      // 0-1
    creativity: number;        // 0-1
    speed: number;             // 0-1
  };
  fitness: number;             // Performance score (0-1)
  generation: number;          // Evolution generation
}
```

### Intent Routing

The Collie Orchestrator routes intents using keyword matching:

```typescript
// Routing keywords per species
const ROUTING_KEYWORDS = {
  cattle: ['analyze', 'explain', 'review', 'email', 'reasoning'],
  duck: ['api', 'fetch', 'request', 'http', 'webhook'],
  goat: ['navigate', 'path', 'route', 'find', 'location'],
  sheep: ['consensus', 'vote', 'agree', 'decide', 'group'],
  horse: ['process', 'transform', 'batch', 'pipeline', 'etl'],
  falcon: ['search', 'find', 'quick', 'lookup', 'retrieve'],
  hog: ['debug', 'log', 'diagnose', 'error', 'trace'],
  chicken: ['monitor', 'watch', 'alert', 'notify', 'status'],
};
```

### Evolution

Night School improves the population through genetic algorithms:

**Fitness Calculation:**
```typescript
compositeScore = 
  successRate * 0.4 +      // Task success rate
  impactWeight * 0.2 +     // Task importance
  latencyScore * 0.2 +     // Response time
  qualityScore * 0.2;      // Output quality
```

**Crossover:**
```typescript
offspring.traits.patience = 
  (parent1.traits.patience + parent2.traits.patience) / 2 
  + (Math.random() - 0.5) * 0.1;  // Mutation
```

---

## 📖 API Reference

### Base URL

```
http://localhost:3000/api/ranch
```

### Endpoints

#### Species

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/species` | List all species |
| `GET` | `/species?name=cattle` | Get specific species |
| `POST` | `/species` | Update species |

**Examples:**
```bash
# List all species
curl http://localhost:3000/api/ranch/species

# Update fitness
curl -X POST http://localhost:3000/api/ranch/species \
  -H "Content-Type: application/json" \
  -d '{"name": "cattle", "updates": {"fitness": 0.85}}'
```

#### Tasks

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/tasks` | List recent tasks |
| `GET` | `/tasks?active=true` | Get active tasks |
| `GET` | `/tasks?id=xxx` | Get specific task |
| `POST` | `/tasks` | Create new task |

**Examples:**
```bash
# Create task
curl -X POST http://localhost:3000/api/ranch/tasks \
  -H "Content-Type: application/json" \
  -d '{"content": "Analyze this dataset"}'

# Get active tasks
curl "http://localhost:3000/api/ranch/tasks?active=true"
```

#### Evolution

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/evolution` | Get evolution history |
| `GET` | `/evolution?current=true` | Get current cycle |
| `POST` | `/evolution` | Trigger evolution |

**Examples:**
```bash
# Get history
curl http://localhost:3000/api/ranch/evolution

# Trigger manual evolution
curl -X POST http://localhost:3000/api/ranch/evolution
```

---

## ⚙️ Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
# Server
PORT=3000
NODE_ENV=development

# Evolution
NIGHT_SCHOOL_HOUR=2
MIN_FITNESS_THRESHOLD=0.3
MAX_FITNESS_THRESHOLD=0.95

# Model (future)
TENSORRT_ENABLED=false
DEFAULT_MODEL=phi-3-mini
```

### breed.md Templates

See the [`/templates`](./templates) directory for examples:

- `email-analyst.md` - Email processing agent
- `quick-search.md` - Fast search agent
- `data-pipeline.md` - ETL agent

---

## 🔧 Development

### Scripts

```bash
bun run dev      # Start development server
bun run build    # Build for production
bun run start    # Start production server
bun run lint     # Run ESLint
```

### Tech Stack

| Technology | Purpose |
|------------|---------|
| Next.js 15 | React framework with App Router |
| TypeScript | Type safety |
| Tailwind CSS 4 | Styling |
| Radix UI | Accessible primitives |
| Lucide React | Icons |

### Project Structure

Each directory has its own README for detailed documentation:

- [`/src`](./src/README.md) - Source code overview
- [`/src/app`](./src/app/README.md) - Next.js App Router
- [`/src/components`](./src/components/README.md) - React components
- [`/src/lib`](./src/lib/README.md) - Core library
- [`/src/types`](./src/types/README.md) - Type definitions
- [`/docs`](./docs/README.md) - Documentation
- [`/templates`](./templates/README.md) - breed.md templates

---

## 🎯 Roadmap

### Phase 1: MVP (Current) ✅

- [x] Species Registry with 8 agent types
- [x] Collie Orchestrator with keyword routing
- [x] breed.md DNA parser
- [x] Night School evolution system
- [x] Web dashboard
- [x] REST API

### Phase 2: Production

- [ ] TensorRT-LLM integration for real inference
- [ ] LoRA hot-swap for runtime adapter changes
- [ ] Discord/Telegram channel connectors
- [ ] CUDA Graph reflex cache for <5ms latency
- [ ] Real benchmarks on Jetson hardware

### Phase 3: Scale

- [ ] Multi-Jetson synchronization
- [ ] CRDT Memory Pasture for distributed state
- [ ] Cloud distillation integration
- [ ] Community gene pool

---

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Style

- Use TypeScript strict mode
- Follow existing code patterns
- Add JSDoc comments for public functions
- Update documentation for API changes

---

## 📄 License

MIT License - see [LICENSE](LICENSE) for details.

---

## 🙏 Acknowledgments

- Inspired by [SuperInstance](https://github.com/SuperInstance/superinstance) architecture
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Icons from [Lucide](https://lucide.dev/)

---

<div align="center">

**Built with ❤️ for the edge AI community**

[⬆ Back to Top](#ai-ranch-)

</div>
