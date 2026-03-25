# Type Definitions (`/src/types`)

TypeScript type definitions for the AI Ranch system.

## 📁 Files

```
types/
└── ranch.ts               # All system types
```

## 🎯 Type Categories

### 1. Species Types

```typescript
// Species identifier
export type SpeciesName = 
  | 'cattle' | 'duck' | 'goat' | 'sheep' 
  | 'horse' | 'falcon' | 'hog' | 'chicken';

// Complete species definition
export interface Species {
  name: SpeciesName;
  description: string;
  capabilities: string[];
  modelHint: string;
  loraAdapter?: string;
  traits: {
    patience: number;
    thoroughness: number;
    creativity: number;
    speed: number;
  };
  fitness: number;
  generation: number;
  createdAt: Date;
  updatedAt: Date;
}
```

---

### 2. Breed DNA Types

```typescript
// breed.md configuration
export interface BreedDNA {
  species: SpeciesName;
  name: string;
  description: string;
  capabilities: Capability[];
  personality: Personality;
  constraints: Constraint[];
  modelConfig: ModelConfig;
  evolution: EvolutionConfig;
}

export interface Capability {
  name: string;
  weight: number;
  examples: string[];
}

export interface Personality {
  tone: 'formal' | 'casual' | 'technical' | 'friendly';
  verbosity: 'concise' | 'normal' | 'detailed';
  creativity: number;
  riskTolerance: number;
}

export interface ModelConfig {
  baseModel: string;
  loraAdapters: string[];
  temperature: number;
  maxTokens: number;
  topP: number;
}

export interface EvolutionConfig {
  mutationRate: number;
  crossoverRate: number;
  selectionPressure: number;
  eliteCount: number;
}
```

---

### 3. Collie Orchestrator Types

```typescript
// Incoming intent
export interface Intent {
  id: string;
  content: string;
  source: Channel;
  metadata: Record<string, unknown>;
  timestamp: Date;
}

// Channel information
export interface Channel {
  type: 'discord' | 'telegram' | 'slack' | 'web' | 'api';
  channelId: string;
  userId: string;
}

// Routing decision
export interface RoutingDecision {
  species: SpeciesName;
  confidence: number;
  reasoning: string;
  alternativeSpecies: SpeciesName[];
}

// Task definition
export interface Task {
  id: string;
  intent: Intent;
  routing: RoutingDecision;
  species: Species;
  status: TaskStatus;
  result?: TaskResult;
  startedAt: Date;
  completedAt?: Date;
}

export type TaskStatus = 
  | 'queued' | 'routing' | 'processing' 
  | 'completed' | 'failed';

export interface TaskResult {
  success: boolean;
  output: string;
  tokensUsed: number;
  latencyMs: number;
  metadata: Record<string, unknown>;
}
```

---

### 4. Evolution Types

```typescript
// Evolution cycle
export interface EvolutionCycle {
  id: string;
  startedAt: Date;
  completedAt?: Date;
  phase: EvolutionPhase;
  population: Species[];
  offspring: Species[];
  graveyard: Species[];
  metrics: EvolutionMetrics;
}

export type EvolutionPhase = 
  | 'evaluate' | 'cull' | 'breed' 
  | 'distill' | 'quarantine' | 'promote' 
  | 'complete';

export interface EvolutionMetrics {
  averageFitness: number;
  bestFitness: number;
  worstFitness: number;
  diversityIndex: number;
  improvementRate: number;
}

export interface FitnessScore {
  speciesId: string;
  successRate: number;
  impactWeight: number;
  latencyScore: number;
  qualityScore: number;
  compositeScore: number;
}
```

---

### 5. Memory Types

```typescript
// Memory storage (CRDT-like)
export interface Memory {
  id: string;
  content: string;
  embedding?: number[];
  source: string;
  timestamp: Date;
  vectorClock: Record<string, number>;
  tombstone: boolean;
}

export interface MemoryPasture {
  id: string;
  memories: Map<string, Memory>;
  vectorClock: Record<string, number>;
  syncStatus: SyncStatus;
}
```

---

### 6. Dashboard Types

```typescript
// Dashboard state
export interface DashboardState {
  species: Species[];
  activeTasks: Task[];
  recentActivity: ActivityLog[];
  metrics: SystemMetrics;
  evolutionStatus: EvolutionCycle | null;
}

export interface ActivityLog {
  id: string;
  timestamp: Date;
  type: 'task' | 'evolution' | 'system' | 'error';
  message: string;
  details?: Record<string, unknown>;
}

export interface SystemMetrics {
  totalRequests: number;
  successRate: number;
  averageLatency: number;
  tokensPerSecond: number;
  vramUsage: number;
  activeSpecies: number;
  lastEvolution: Date | null;
}
```

---

### 7. API Types

```typescript
// Generic API response
export interface APIResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: Date;
}

// WebSocket message
export interface WebSocketMessage {
  type: 'task_update' | 'evolution' | 'metrics' | 'log';
  payload: unknown;
  timestamp: Date;
}
```

## 📊 Type Relationships

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│   BreedDNA   │────►│    Species   │◄────│EvolutionCycle│
└──────────────┘     └──────┬───────┘     └──────────────┘
                            │
                            ▼
                     ┌──────────────┐
                     │    Intent    │
                     └──────┬───────┘
                            │
                            ▼
                     ┌──────────────┐
                     │RoutingDecision│
                     └──────┬───────┘
                            │
                            ▼
                     ┌──────────────┐
                     │     Task     │
                     └──────┬───────┘
                            │
                            ▼
                     ┌──────────────┐
                     │  TaskResult  │
                     └──────────────┘
```

## 🔧 Usage

Import types in your files:

```typescript
import { 
  Species, 
  SpeciesName, 
  Task, 
  TaskStatus,
  EvolutionCycle,
  APIResponse 
} from '@/types/ranch';
```

Use with generic API response:

```typescript
const response = await fetch('/api/ranch/species');
const data: APIResponse<Species[]> = await response.json();
```

## 📚 Related

- [Core Library](../lib/README.md)
- [API Routes](../app/api/ranch/README.md)
