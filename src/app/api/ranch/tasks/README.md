# Tasks API (`/src/app/api/ranch/tasks`)

REST API endpoint for task creation and management.

## 📁 File

```
tasks/
└── route.ts              # GET and POST handlers
```

## 🎯 Purpose

This endpoint handles the task lifecycle:

1. **Create** new tasks from user intents
2. **Route** intents to appropriate species via Collie
3. **Process** tasks asynchronously
4. **Query** task status and history

## 🔌 API Specification

### `GET /api/ranch/tasks`

Retrieve tasks from the system.

**Query Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string | No | Get specific task by ID |
| `active` | boolean | No | Filter to active tasks only |

**Response (Recent Tasks):**

```
GET /api/ranch/tasks
```

```json
{
  "success": true,
  "data": [
    {
      "id": "task_1705315800000_abc123",
      "intent": {
        "id": "intent_1705315800000",
        "content": "Analyze this email...",
        "source": {
          "type": "api",
          "channelId": "default",
          "userId": "system"
        },
        "timestamp": "2024-01-15T10:30:00Z"
      },
      "routing": {
        "species": "cattle",
        "confidence": 0.85,
        "reasoning": "Matched keywords: analyze, email",
        "alternativeSpecies": ["falcon", "horse"]
      },
      "species": {
        "name": "cattle",
        "fitness": 0.75
      },
      "status": "completed",
      "result": {
        "success": true,
        "output": "Analysis complete...",
        "tokensUsed": 125,
        "latencyMs": 234
      },
      "startedAt": "2024-01-15T10:30:00Z",
      "completedAt": "2024-01-15T10:30:01Z"
    }
  ],
  "timestamp": "2024-01-15T10:31:00Z"
}
```

**Response (Active Tasks):**

```
GET /api/ranch/tasks?active=true
```

Returns only tasks with status `queued` or `processing`.

### `POST /api/ranch/tasks`

Create a new task.

**Request Body:**

```json
{
  "content": "Analyze this email and extract key action items",
  "source": {
    "type": "discord",
    "channelId": "general",
    "userId": "user-123"
  }
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `content` | string | Yes | The user's intent/query |
| `source` | object | No | Channel information (defaults to API) |

**Response:**

```json
{
  "success": true,
  "data": {
    "id": "task_1705315800000_abc123",
    "intent": { ... },
    "routing": {
      "species": "cattle",
      "confidence": 0.85,
      "reasoning": "Matched keywords: analyze, email"
    },
    "status": "queued",
    "startedAt": "2024-01-15T10:30:00Z"
  },
  "timestamp": "2024-01-15T10:30:00Z"
}
```

## 🔄 Task Lifecycle

```
┌─────────┐     ┌─────────┐     ┌────────────┐     ┌───────────┐
│ queued  │────►│ routing │────►│ processing │────►│ completed │
└─────────┘     └─────────┘     └────────────┘     └───────────┘
                                        │
                                        ▼
                                  ┌───────────┐
                                  │  failed   │
                                  └───────────┘
```

| Status | Description |
|--------|-------------|
| `queued` | Task created, waiting to route |
| `routing` | Collie determining best species |
| `processing` | Species handling the task |
| `completed` | Task finished successfully |
| `failed` | Task encountered an error |

## 🔧 Implementation Details

### Dependencies

```typescript
import { collieOrchestrator } from '@/lib/collie';
import { APIResponse, Task, Intent } from '@/types/ranch';
```

### Core Methods Used

| Method | Purpose |
|--------|---------|
| `collieOrchestrator.createTask(intent)` | Create and route new task |
| `collieOrchestrator.processTask(id)` | Execute task processing |
| `collieOrchestrator.getTask(id)` | Get specific task |
| `collieOrchestrator.getActiveTasks()` | Get active tasks |
| `collieOrchestrator.getRecentTasks(limit)` | Get recent history |

### Asynchronous Processing

Tasks are processed asynchronously after creation:

```typescript
// Create task synchronously
const task = collieOrchestrator.createTask(intent);

// Process asynchronously (don't await)
collieOrchestrator.processTask(task.id).catch(console.error);
```

This allows immediate response with task creation, while processing continues in the background.

## 📊 Usage Examples

### Frontend (React)

```typescript
// Create a new task
const createTask = async (content: string) => {
  const response = await fetch('/api/ranch/tasks', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ content })
  });
  return response.json();
};

// Poll for task completion
const pollTask = async (taskId: string) => {
  const response = await fetch(`/api/ranch/tasks?id=${taskId}`);
  const { data: task } = await response.json();
  
  if (task.status === 'processing') {
    await new Promise(r => setTimeout(r, 1000));
    return pollTask(taskId);
  }
  return task;
};
```

### cURL

```bash
# Create task
curl -X POST http://localhost:3000/api/ranch/tasks \
  -H "Content-Type: application/json" \
  -d '{"content": "Search for recent AI news"}'

# Get recent tasks
curl http://localhost:3000/api/ranch/tasks

# Get active tasks
curl "http://localhost:3000/api/ranch/tasks?active=true"

# Get specific task
curl "http://localhost:3000/api/ranch/tasks?id=task_123"
```

## 🔗 Related

- [Collie Orchestrator Library](../../../lib/collie.ts)
- [Task Types](../../../types/ranch.ts)
- [Task Panel Component](../../../components/ranch/task-panel.tsx)
