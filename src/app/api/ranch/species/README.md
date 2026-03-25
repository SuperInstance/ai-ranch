# Species API (`/src/app/api/ranch/species`)

REST API endpoint for managing the Species Registry.

## 📁 File

```
species/
└── route.ts              # GET and POST handlers
```

## 🎯 Purpose

This endpoint provides CRUD operations for the Species Registry, allowing clients to:

- List all available species with their traits and fitness
- Query a specific species by name
- Update species properties (fitness, traits, etc.)

## 🔌 API Specification

### `GET /api/ranch/species`

List all species or query a specific one.

**Query Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `name` | string | No | Get specific species by name |

**Response (List All):**

```json
{
  "success": true,
  "data": [
    {
      "name": "cattle",
      "description": "Heavy reasoning agent...",
      "capabilities": ["reasoning", "analysis", "email-processing"],
      "modelHint": "phi-3-mini",
      "loraAdapter": "cattle-reasoning-v1",
      "traits": {
        "patience": 0.9,
        "thoroughness": 0.85,
        "creativity": 0.4,
        "speed": 0.3
      },
      "fitness": 0.75,
      "generation": 2,
      "createdAt": "2024-01-15T10:00:00Z",
      "updatedAt": "2024-01-15T12:30:00Z"
    },
    // ... more species
  ],
  "timestamp": "2024-01-15T12:30:00Z"
}
```

**Response (Single Species):**

```
GET /api/ranch/species?name=cattle
```

```json
{
  "success": true,
  "data": {
    "name": "cattle",
    "description": "...",
    // ... species object
  },
  "timestamp": "2024-01-15T12:30:00Z"
}
```

### `POST /api/ranch/species`

Update a species.

**Request Body:**

```json
{
  "name": "cattle",
  "updates": {
    "fitness": 0.85,
    "traits": {
      "patience": 0.95
    }
  }
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "name": "cattle",
    "fitness": 0.85,
    // ... updated species
  },
  "timestamp": "2024-01-15T12:30:00Z"
}
```

## 🔧 Implementation Details

### Dependencies

```typescript
import { speciesRegistry } from '@/lib/species';
import { APIResponse, Species } from '@/types/ranch';
```

### Core Methods Used

| Method | Purpose |
|--------|---------|
| `speciesRegistry.get(name)` | Get single species |
| `speciesRegistry.getAll()` | Get all species |
| `speciesRegistry.update(name, updates)` | Update species |

### Error Handling

| Scenario | Status | Error Message |
|----------|--------|---------------|
| Species not found | 404 | `Species 'unknown' not found` |
| Missing name in POST | 400 | `Species name is required` |
| Server error | 500 | Internal error message |

## 📊 Usage Examples

### Frontend (React)

```typescript
// Fetch all species
const response = await fetch('/api/ranch/species');
const { data: species } = await response.json();

// Get specific species
const response = await fetch('/api/ranch/species?name=cattle');
const { data: cattle } = await response.json();

// Update species fitness
await fetch('/api/ranch/species', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'cattle',
    updates: { fitness: 0.9 }
  })
});
```

### cURL

```bash
# List all species
curl http://localhost:3000/api/ranch/species

# Get specific species
curl "http://localhost:3000/api/ranch/species?name=falcon"

# Update species
curl -X POST http://localhost:3000/api/ranch/species \
  -H "Content-Type: application/json" \
  -d '{"name": "cattle", "updates": {"fitness": 0.85}}'
```

## 🔗 Related

- [Species Registry Library](../../../lib/species.ts)
- [Species Types](../../../types/ranch.ts)
- [Species Panel Component](../../../components/ranch/species-panel.tsx)
