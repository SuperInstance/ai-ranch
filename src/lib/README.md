# Core Library (`/src/lib`)

Business logic and core functionality for the AI Ranch system.

## 📁 Files

```
lib/
├── breed-parser.ts        # breed.md DNA parser
├── collie.ts              # Orchestrator (routing)
├── night-school.ts        # Evolution system
├── species.ts             # Species registry
└── utils.ts               # Utility functions
```

## 🎯 Module Overview

### `species.ts` - Species Registry

Manages the 8 agent species and their properties.

**Key Classes:**
- `SpeciesRegistry` - Singleton class for species management

**Key Functions:**
```typescript
// Get all species
speciesRegistry.getAll(): Species[]

// Get specific species
speciesRegistry.get(name: SpeciesName): Species | undefined

// Update species
speciesRegistry.update(name: SpeciesName, updates: Partial<Species>): Species | undefined

// Update fitness score
speciesRegistry.updateFitness(name: SpeciesName, fitness: number): void

// Create offspring (evolution)
speciesRegistry.createOffspring(parent1: SpeciesName, parent2: SpeciesName): Species

// Load from breed.md
speciesRegistry.loadFromDNA(dna: BreedDNA): Species
```

**Default Species:**
| Species | Role | Traits |
|---------|------|--------|
| cattle | Heavy reasoning | patience: 0.9, speed: 0.3 |
| duck | Network | speed: 0.8 |
| goat | Navigation | balanced |
| sheep | Consensus | patience: 0.9 |
| horse | ETL | thoroughness: 0.9 |
| falcon | Fast search | speed: 0.95 |
| hog | Diagnostics | thoroughness: 0.95 |
| chicken | Monitoring | speed: 0.9 |

---

### `collie.ts` - Orchestrator

Routes intents to appropriate species and manages tasks.

**Key Classes:**
- `CollieOrchestrator` - Singleton class for orchestration

**Key Functions:**
```typescript
// Route intent to species
collieOrchestrator.route(intent: Intent): RoutingDecision

// Create new task
collieOrchestrator.createTask(intent: Intent): Task

// Process task
collieOrchestrator.processTask(taskId: string): Promise<TaskResult>

// Query tasks
collieOrchestrator.getTask(taskId: string): Task | undefined
collieOrchestrator.getActiveTasks(): Task[]
collieOrchestrator.getRecentTasks(limit: number): Task[]
```

**Routing Logic:**
```
Intent → Keyword Matching → Species Scoring → Fitness Weighting → Selection
```

---

### `night-school.ts` - Evolution System

Implements the Night School evolution cycle.

**Key Classes:**
- `NightSchool` - Singleton class for evolution

**Key Functions:**
```typescript
// Start scheduler
nightSchool.start(): void

// Stop scheduler
nightSchool.stop(): void

// Run evolution cycle
nightSchool.runCycle(): Promise<EvolutionCycle>

// Query state
nightSchool.getCurrentCycle(): EvolutionCycle | null
nightSchool.getCycleHistory(): EvolutionCycle[]
```

**Evolution Phases:**
1. **Evaluate** - Score species fitness
2. **Cull** - Remove underperformers (< 0.3 fitness)
3. **Breed** - Create offspring from top performers
4. **Distill** - Cloud training simulation
5. **Quarantine** - Test offspring (80% pass rate)
6. **Promote** - Add successful offspring to population

---

### `breed-parser.ts` - DNA Parser

Parses breed.md files to define agent behavior.

**Key Classes:**
- `BreedParser` - Parser class

**Key Functions:**
```typescript
// Parse breed.md content
parser.parse(content: string): ParseResult

// Parse from file
parser.parseFile(filePath: string): ParseResult

// Watch for changes
parser.watch(filePath: string): void
parser.unwatch(filePath: string): void
```

**breed.md Sections:**
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

# model
base_model: phi-3-mini
temperature: 0.5

# evolution
mutation_rate: 0.1
crossover_rate: 0.7
```

---

### `utils.ts` - Utilities

Common utility functions.

**Key Functions:**
```typescript
// Merge Tailwind classes
cn(...inputs: ClassValue[]): string
```

## 🔄 Data Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                        EXTERNAL INPUT                           │
│  breed.md files | API requests | Scheduled triggers             │
└─────────────────────────────┬───────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                          LIBRARY LAYER                          │
│                                                                 │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │   Breed      │  │   Species    │  │ Night School │          │
│  │   Parser     │──►│   Registry   │◄──│   Evolution  │          │
│  └──────────────┘  └──────┬───────┘  └──────────────┘          │
│                           │                                     │
│                           ▼                                     │
│                    ┌──────────────┐                             │
│                    │    Collie    │                             │
│                    │ Orchestrator │                             │
│                    └──────────────┘                             │
└─────────────────────────────┬───────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                         API LAYER                               │
│  /api/ranch/species | /api/ranch/tasks | /api/ranch/evolution  │
└─────────────────────────────────────────────────────────────────┘
```

## 🧪 Singleton Pattern

All core classes use the singleton pattern:

```typescript
class SpeciesRegistry {
  private static instance: SpeciesRegistry;
  
  static getInstance(): SpeciesRegistry {
    if (!SpeciesRegistry.instance) {
      SpeciesRegistry.instance = new SpeciesRegistry();
    }
    return SpeciesRegistry.instance;
  }
}

// Export singleton instance
export const speciesRegistry = new SpeciesRegistry();
```

## 📡 Event System

Core classes support event subscriptions:

```typescript
// Species events
speciesRegistry.subscribe((species: Species[]) => {
  console.log('Species updated:', species);
});

// Task events
collieOrchestrator.subscribe((task: Task) => {
  console.log('Task updated:', task);
});

// Evolution events
nightSchool.subscribe((cycle: EvolutionCycle) => {
  console.log('Evolution phase:', cycle.phase);
});
```

## 📚 Related

- [Types](../types/README.md)
- [API Routes](../app/api/ranch/README.md)
