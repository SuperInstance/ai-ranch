# Evolution API (`/src/app/api/ranch/evolution`)

REST API endpoint for controlling and monitoring the Night School evolution system.

## 📁 File

```
evolution/
└── route.ts              # GET and POST handlers
```

## 🎯 Purpose

This endpoint provides control over the Night School evolution system:

1. **Query** evolution history and current cycle status
2. **Trigger** manual evolution cycles
3. **Monitor** evolution metrics and progress

## 🔌 API Specification

### `GET /api/ranch/evolution`

Retrieve evolution history.

**Query Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `current` | boolean | No | Get current running cycle only |

**Response (History):**

```
GET /api/ranch/evolution
```

```json
{
  "success": true,
  "data": [
    {
      "id": "evolution_1705315800000",
      "startedAt": "2024-01-15T02:00:00Z",
      "completedAt": "2024-01-15T02:05:00Z",
      "phase": "complete",
      "population": [
        { "name": "cattle", "fitness": 0.75, "generation": 2 },
        { "name": "duck", "fitness": 0.68, "generation": 1 }
      ],
      "offspring": [
        { "name": "cattle", "fitness": 0.52, "generation": 3 }
      ],
      "graveyard": [
        { "name": "old_species", "fitness": 0.25, "generation": 0 }
      ],
      "metrics": {
        "averageFitness": 0.65,
        "bestFitness": 0.85,
        "worstFitness": 0.42,
        "diversityIndex": 0.234,
        "improvementRate": 0.05
      }
    }
  ],
  "timestamp": "2024-01-15T10:00:00Z"
}
```

**Response (Current Cycle):**

```
GET /api/ranch/evolution?current=true
```

```json
{
  "success": true,
  "data": {
    "id": "evolution_1705315800000",
    "startedAt": "2024-01-15T02:00:00Z",
    "phase": "breed",
    "population": [ ... ],
    "offspring": [ ... ],
    "graveyard": [],
    "metrics": { ... }
  },
  "timestamp": "2024-01-15T02:02:00Z"
}
```

Returns `null` if no evolution is currently running.

### `POST /api/ranch/evolution`

Trigger a manual evolution cycle.

**Request Body:** None required

**Response:**

```json
{
  "success": true,
  "data": {
    "id": "evolution_1705315800000",
    "startedAt": "2024-01-15T10:00:00Z",
    "completedAt": "2024-01-15T10:05:00Z",
    "phase": "complete",
    "population": [ ... ],
    "offspring": [ ... ],
    "graveyard": [ ... ],
    "metrics": {
      "averageFitness": 0.68,
      "bestFitness": 0.87,
      "worstFitness": 0.45,
      "diversityIndex": 0.245,
      "improvementRate": 0.03
    }
  },
  "timestamp": "2024-01-15T10:05:00Z"
}
```

## 🌙 Evolution Phases

The Night School cycle progresses through 6 phases:

```
┌────────────┐     ┌────────┐     ┌────────┐
│  evaluate  │────►│  cull  │────►│ breed  │
└────────────┘     └────────┘     └────────┘
                                        │
                                        ▼
┌────────────┐     ┌────────────┐     ┌─────────┐
│  complete  │◄────│  promote   │◄────│quarantine│
└────────────┘     └────────────┘     └─────────┘
                         ▲
                         │
                   ┌──────────┐
                   │ distill  │
                   └──────────┘
```

| Phase | Description | Duration |
|-------|-------------|----------|
| `evaluate` | Score species fitness | ~100ms |
| `cull` | Remove underperformers | ~50ms |
| `breed` | Create offspring | ~100ms |
| `distill` | Cloud training | ~100ms |
| `quarantine` | Test offspring | ~50ms |
| `promote` | Promote successful | ~50ms |
| `complete` | Cycle finished | - |

## 📊 Evolution Metrics

| Metric | Description | Range |
|--------|-------------|-------|
| `averageFitness` | Mean fitness of population | 0.0 - 1.0 |
| `bestFitness` | Highest fitness score | 0.0 - 1.0 |
| `worstFitness` | Lowest fitness score | 0.0 - 1.0 |
| `diversityIndex` | Trait variance measure | 0.0+ |
| `improvementRate` | Change from previous cycle | -1.0 - 1.0 |

## 🔧 Implementation Details

### Dependencies

```typescript
import { nightSchool } from '@/lib/night-school';
import { APIResponse, EvolutionCycle } from '@/types/ranch';
```

### Core Methods Used

| Method | Purpose |
|--------|---------|
| `nightSchool.getCurrentCycle()` | Get running cycle |
| `nightSchool.getCycleHistory()` | Get all past cycles |
| `nightSchool.runCycle()` | Execute full evolution |

### Scheduling

Night School runs automatically at 02:00 AM daily. The scheduler is configured in the NightSchool class:

```typescript
// Configuration
const config = {
  scheduleHour: 2,        // 02:00 AM
  minFitnessThreshold: 0.3,
  maxFitnessThreshold: 0.95,
  populationSize: 8,
  mutationRate: 0.1,
  crossoverRate: 0.7,
  eliteCount: 2,
};
```

## 📊 Usage Examples

### Frontend (React)

```typescript
// Get evolution history
const getHistory = async () => {
  const response = await fetch('/api/ranch/evolution');
  return response.json();
};

// Check current cycle
const getCurrentCycle = async () => {
  const response = await fetch('/api/ranch/evolution?current=true');
  return response.json();
};

// Trigger manual evolution
const triggerEvolution = async () => {
  const response = await fetch('/api/ranch/evolution', {
    method: 'POST'
  });
  return response.json();
};
```

### cURL

```bash
# Get evolution history
curl http://localhost:3000/api/ranch/evolution

# Check current cycle
curl "http://localhost:3000/api/ranch/evolution?current=true"

# Trigger manual evolution
curl -X POST http://localhost:3000/api/ranch/evolution
```

## ⚠️ Notes

- Manual evolution blocks until complete (~500ms)
- Running evolution while another is in progress is not recommended
- Evolution results are persisted in the cycle history

## 🔗 Related

- [Night School Library](../../../lib/night-school.ts)
- [Evolution Types](../../../types/ranch.ts)
- [Evolution Panel Component](../../../components/ranch/evolution-panel.tsx)
