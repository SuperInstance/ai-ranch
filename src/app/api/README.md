# API Routes (`/src/app/api`)

RESTful API endpoints for the AI Ranch backend.

## 📁 Structure

```
api/
└── ranch/                  # Ranch-specific API routes
    ├── species/           # Species management
    │   └── route.ts
    ├── tasks/             # Task management
    │   └── route.ts
    └── evolution/         # Evolution control
        └── route.ts
```

## 🔌 API Design Principles

### Response Format

All endpoints return consistent JSON responses:

```typescript
// Success response
{
  "success": true,
  "data": { ... },
  "timestamp": "2024-01-15T10:30:00Z"
}

// Error response
{
  "success": false,
  "error": "Error message",
  "timestamp": "2024-01-15T10:30:00Z"
}
```

### HTTP Methods

| Method | Purpose | Example |
|--------|---------|---------|
| `GET` | Retrieve data | List all species |
| `POST` | Create/Update | Create a new task |
| `PUT` | Full update | Replace species config |
| `DELETE` | Remove | Delete a species |

### Query Parameters

Used for filtering and pagination:

```
GET /api/ranch/species?name=cattle
GET /api/ranch/tasks?active=true
GET /api/ranch/evolution?current=true
```

## 🎯 Endpoints Overview

| Endpoint | Methods | Description |
|----------|---------|-------------|
| `/api/ranch/species` | GET, POST | Manage species registry |
| `/api/ranch/tasks` | GET, POST | Create and query tasks |
| `/api/ranch/evolution` | GET, POST | Evolution history and control |

## 📊 Request/Response Examples

### Species API

```bash
# List all species
curl http://localhost:3000/api/ranch/species

# Get specific species
curl http://localhost:3000/api/ranch/species?name=cattle

# Update species fitness
curl -X POST http://localhost:3000/api/ranch/species \
  -H "Content-Type: application/json" \
  -d '{"name": "cattle", "updates": {"fitness": 0.85}}'
```

### Tasks API

```bash
# Create a new task
curl -X POST http://localhost:3000/api/ranch/tasks \
  -H "Content-Type: application/json" \
  -d '{"content": "Analyze this email and extract key action items"}'

# Get recent tasks
curl http://localhost:3000/api/ranch/tasks

# Get active tasks only
curl http://localhost:3000/api/ranch/tasks?active=true
```

### Evolution API

```bash
# Get evolution history
curl http://localhost:3000/api/ranch/evolution

# Get current evolution cycle
curl http://localhost:3000/api/ranch/evolution?current=true

# Trigger manual evolution
curl -X POST http://localhost:3000/api/ranch/evolution
```

## 🔒 Error Handling

| Status Code | Meaning | Example |
|-------------|---------|---------|
| 200 | Success | Request completed |
| 400 | Bad Request | Missing required field |
| 404 | Not Found | Species doesn't exist |
| 500 | Server Error | Internal failure |

## 📚 Related

- [Species API](./ranch/species/README.md)
- [Tasks API](./ranch/tasks/README.md)
- [Evolution API](./ranch/evolution/README.md)
