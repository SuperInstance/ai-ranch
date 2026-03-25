# Source Code (`/src`)

This directory contains all source code for the AI Ranch system, organized following Next.js 15 App Router conventions.

## 📁 Directory Structure

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API Routes (REST endpoints)
│   │   └── ranch/         # Ranch-specific API routes
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page (Dashboard)
│
├── components/            # React Components
│   ├── ranch/            # Ranch-specific components
│   └── ui/               # Reusable UI components (shadcn/ui)
│
├── lib/                   # Core Library & Business Logic
│   ├── breed-parser.ts   # breed.md DNA parser
│   ├── collie.ts         # Orchestrator (routing)
│   ├── night-school.ts   # Evolution system
│   ├── species.ts        # Species registry
│   └── utils.ts          # Utility functions
│
└── types/                 # TypeScript Type Definitions
    └── ranch.ts          # All system types
```

## 🧭 Architecture Overview

### Data Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER INTERFACE                          │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐              │
│  │   Species   │  │    Task     │  │  Evolution  │              │
│  │    Panel    │  │    Panel    │  │    Panel    │              │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘              │
└─────────┼────────────────┼────────────────┼─────────────────────┘
          │                │                │
          ▼                ▼                ▼
┌─────────────────────────────────────────────────────────────────┐
│                        REST API LAYER                           │
│  /api/ranch/species  /api/ranch/tasks  /api/ranch/evolution    │
└─────────────────────────────┬───────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                        CORE LIBRARY                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │   Species    │  │    Collie    │  │ Night School │          │
│  │   Registry   │◄─┤  Orchestrator│◄─┤   Evolution  │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
│         │                │                                       │
│         ▼                ▼                                       │
│  ┌──────────────┐  ┌──────────────┐                             │
│  │   Breed      │  │    Task      │                             │
│  │   Parser     │  │   Manager    │                             │
│  └──────────────┘  └──────────────┘                             │
└─────────────────────────────────────────────────────────────────┘
```

## 🔑 Key Concepts

### 1. Species System
Located in `lib/species.ts`, the Species Registry manages 8 agent types:
- Each species has traits, capabilities, fitness score, and generation
- Supports hot-reload via breed.md files
- Tracks evolutionary history

### 2. Collie Orchestrator
Located in `lib/collie.ts`, handles:
- Intent parsing and keyword matching
- Species selection with confidence scoring
- Task lifecycle management

### 3. Night School Evolution
Located in `lib/night-school.ts`, implements:
- Daily evolution cycle (02:00 AM)
- 6 phases: evaluate → cull → breed → distill → quarantine → promote
- Fitness-based selection

### 4. breed.md DNA System
Located in `lib/breed-parser.ts`:
- Parses markdown configuration files
- Defines species behavior and capabilities
- Supports hot-reload for live updates

## 🚀 Getting Started

1. **Explore Types**: Start with `types/ranch.ts` to understand data structures
2. **Read Core Logic**: Review `lib/species.ts` and `lib/collie.ts`
3. **Check API**: See `app/api/` for REST endpoints
4. **View Components**: Check `components/ranch/` for UI implementation

## 📝 Coding Conventions

- **TypeScript**: All files use strict TypeScript
- **Server/Client**: `'use client'` directive for client components
- **Imports**: Use `@/` alias for absolute imports
- **Exports**: Prefer named exports over default exports
- **Naming**: camelCase for variables, PascalCase for components/types
