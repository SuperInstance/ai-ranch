# AI Ranch API Reference

## Overview

The AI Ranch provides a RESTful API for interacting with the self-evolving agent system.

## Base URL

```
http://localhost:3000/api/ranch
```

## Endpoints

### Species

#### List All Species

```http
GET /api/ranch/species
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "name": "cattle",
      "description": "Heavy reasoning agent for complex analysis",
      "capabilities": ["reasoning", "analysis", "email-processing"],
      "fitness": 0.75,
      "generation": 2
    }
  ],
  "timestamp": "2024-01-15T10:30:00Z"
}
```

#### Get Single Species

```http
GET /api/ranch/species?name=cattle
```

#### Update Species

```http
POST /api/ranch/species
Content-Type: application/json

{
  "name": "cattle",
  "updates": {
    "fitness": 0.85
  }
}
```

### Tasks

#### List Tasks

```http
GET /api/ranch/tasks
```

#### Get Active Tasks

```http
GET /api/ranch/tasks?active=true
```

#### Create Task

```http
POST /api/ranch/tasks
Content-Type: application/json

{
  "content": "Analyze this email and extract key action items",
  "source": {
    "type": "api",
    "channelId": "default",
    "userId": "user-123"
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "task_1705315800000_abc123",
    "intent": {
      "content": "Analyze this email...",
      "source": { "type": "api", "channelId": "default", "userId": "user-123" }
    },
    "routing": {
      "species": "cattle",
      "confidence": 0.85,
      "reasoning": "Matched keywords: analyze, email"
    },
    "status": "queued"
  },
  "timestamp": "2024-01-15T10:30:00Z"
}
```

### Evolution

#### Get Evolution History

```http
GET /api/ranch/evolution
```

#### Get Current Evolution Cycle

```http
GET /api/ranch/evolution?current=true
```

#### Trigger Evolution

```http
POST /api/ranch/evolution
```

## Species Types

| Species | Description | Best For |
|---------|-------------|----------|
| cattle | Heavy reasoning | Analysis, email processing |
| duck | Network specialist | API calls, webhooks |
| goat | Navigation | Pathfinding, spatial reasoning |
| sheep | Consensus | Voting, mediation |
| horse | ETL specialist | Data pipelines, batch processing |
| falcon | Fast search | Quick lookups, reconnaissance |
| hog | Diagnostics | Logging, debugging |
| chicken | Monitoring | Alerts, health checks |

## Task Status

| Status | Description |
|--------|-------------|
| queued | Task waiting in queue |
| routing | Collie determining species |
| processing | Species handling task |
| completed | Task finished successfully |
| failed | Task encountered error |

## Evolution Phases

1. **Evaluate** - Score species fitness
2. **Cull** - Remove underperforming species
3. **Breed** - Create offspring from top performers
4. **Distill** - Cloud training for offspring
5. **Quarantine** - Test offspring in sandbox
6. **Promote** - Promote successful offspring

## Error Responses

```json
{
  "success": false,
  "error": "Species 'unknown' not found",
  "timestamp": "2024-01-15T10:30:00Z"
}
```

## Rate Limits

- Species endpoints: 100 req/min
- Task endpoints: 60 req/min
- Evolution endpoints: 10 req/min
