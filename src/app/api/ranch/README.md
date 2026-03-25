# Ranch API (`/src/app/api/ranch`)

Core API endpoints for the AI Ranch system.

## 📁 Structure

```
ranch/
├── species/               # Species management API
│   └── route.ts
├── tasks/                 # Task management API
│   └── route.ts
└── evolution/             # Evolution control API
    └── route.ts
```

## 🎯 Purpose

This directory contains all REST API endpoints specific to the AI Ranch domain:

1. **Species API** - Manage the 8 agent species
2. **Tasks API** - Create, route, and process tasks
3. **Evolution API** - Control and monitor Night School evolution

## 🔄 Data Flow

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│   Species    │     │    Tasks     │     │  Evolution   │
│   Registry   │◄────┤   Manager    │────►│    System    │
└──────────────┘     └──────────────┘     └──────────────┘
       ▲                    ▲                    │
       │                    │                    │
       └────────────────────┴────────────────────┘
                          │
                          ▼
              ┌──────────────────────┐
              │   REST API Routes    │
              │  (this directory)    │
              └──────────────────────┘
```

## 🎨 Design Patterns

### Singleton Instances

Each route imports singleton instances from the lib:

```typescript
import { speciesRegistry } from '@/lib/species';
import { collieOrchestrator } from '@/lib/collie';
import { nightSchool } from '@/lib/night-school';
```

### Type Safety

All responses are typed using the `APIResponse<T>` generic:

```typescript
return NextResponse.json<APIResponse<Species[]>>({
  success: true,
  data: allSpecies,
  timestamp: new Date(),
});
```

### Error Handling

Consistent error responses:

```typescript
return NextResponse.json<APIResponse<null>>({
  success: false,
  error: `Species '${name}' not found`,
  timestamp: new Date(),
}, { status: 404 });
```

## 📊 Rate Limits (Recommended)

| Endpoint | Rate Limit | Reason |
|----------|------------|--------|
| Species | 100 req/min | Read-heavy |
| Tasks | 60 req/min | Processing intensive |
| Evolution | 10 req/min | Long-running operations |

## 🚀 Future Endpoints

Planned additions:

- `GET/POST /api/ranch/breeds` - breed.md management
- `GET/POST /api/ranch/channels` - Channel connectors
- `GET /api/ranch/metrics` - System metrics aggregation
- `WS /api/ranch/ws` - WebSocket for real-time updates

## 📚 Related

- [Species API Details](./species/README.md)
- [Tasks API Details](./tasks/README.md)
- [Evolution API Details](./evolution/README.md)
