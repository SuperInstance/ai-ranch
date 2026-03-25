# Ranch Components (`/src/components/ranch`)

Domain-specific React components for the AI Ranch dashboard.

## 📁 Files

```
ranch/
├── dashboard.tsx          # Main dashboard layout
├── evolution-panel.tsx    # Evolution control panel
├── species-panel.tsx      # Species registry panel
└── task-panel.tsx         # Task management panel
```

## 🎯 Component Overview

### Dashboard (`dashboard.tsx`)

The main dashboard component that orchestrates the entire UI.

**Features:**
- Metrics bar (requests, latency, tokens/s, VRAM)
- Tabbed navigation (Tasks, Species, Evolution)
- Real-time metric updates
- Header with status indicators

**Usage:**
```tsx
import RanchDashboard from '@/components/ranch/dashboard';

export default function Home() {
  return <RanchDashboard />;
}
```

**Structure:**
```
┌────────────────────────────────────────────┐
│ HEADER: Logo + Status Badges               │
├────────────────────────────────────────────┤
│ METRICS BAR: Requests | Latency | VRAM...  │
├────────────────────────────────────────────┤
│ TABS: [Tasks] [Species] [Evolution]        │
├────────────────────────────────────────────┤
│                                            │
│              TAB CONTENT                   │
│                                            │
└────────────────────────────────────────────┘
```

---

### SpeciesPanel (`species-panel.tsx`)

Displays and manages the Species Registry.

**Features:**
- List of all 8 species with fitness indicators
- Species selection with detail view
- Traits visualization (progress bars)
- Capabilities display (badges)
- Real-time updates (5s polling)

**State:**
```tsx
const [species, setSpecies] = useState<Species[]>([]);
const [loading, setLoading] = useState(true);
const [selectedSpecies, setSelectedSpecies] = useState<Species | null>(null);
```

**Structure:**
```
┌────────────────┬───────────────────────────┐
│ SPECIES LIST   │ SPECIES DETAILS           │
│                │                           │
│ [cattle] Gen 2 │ Overview | Traits | Caps  │
│ ████████ 75%   │ ────────────────────────  │
│                │ Description...            │
│ [duck] Gen 1   │                           │
│ ██████ 68%     │ Model: phi-3-mini         │
│                │ LoRA: cattle-reasoning    │
│ ...            │                           │
│                │ Traits:                   │
│                │ patience    ████████ 90%  │
│                │ thoroughness███████ 85%   │
└────────────────┴───────────────────────────┘
```

---

### TaskPanel (`task-panel.tsx`)

Task creation and monitoring interface.

**Features:**
- Text input for new tasks
- Task submission with Enter key
- Recent tasks list with status badges
- Routing information display
- Result output display

**State:**
```tsx
const [tasks, setTasks] = useState<Task[]>([]);
const [loading, setLoading] = useState(true);
const [input, setInput] = useState('');
const [submitting, setSubmitting] = useState(false);
```

**Structure:**
```
┌────────────────────────────────────────────┐
│ INPUT AREA                                  │
│ ┌────────────────────────────────┐ [Send]  │
│ │ Enter a task or query...       │         │
│ └────────────────────────────────┘         │
├────────────────────────────────────────────┤
│ RECENT TASKS                                │
│                                            │
│ ┌──────────────────────────────────────┐  │
│ │ Analyze this email...                │  │
│ │ [✓ completed] [cattle] [234ms]       │  │
│ │ Analysis complete...                 │  │
│ └──────────────────────────────────────┘  │
│                                            │
│ ┌──────────────────────────────────────┐  │
│ │ Search for AI news                   │  │
│ │ [◐ processing] [falcon]              │  │
│ └──────────────────────────────────────┘  │
└────────────────────────────────────────────┘
```

---

### EvolutionPanel (`evolution-panel.tsx`)

Night School evolution control and monitoring.

**Features:**
- Current cycle status with progress bar
- Metrics grid (avg fitness, diversity, etc.)
- Evolution history list
- Manual evolution trigger button

**State:**
```tsx
const [currentCycle, setCurrentCycle] = useState<EvolutionCycle | null>(null);
const [history, setHistory] = useState<EvolutionCycle[]>([]);
const [loading, setLoading] = useState(true);
const [triggering, setTriggering] = useState(false);
```

**Structure:**
```
┌────────────────────────────────────────────┐
│ HEADER: Night School        [Run Evolution]│
├────────────────────────────────────────────┤
│ CURRENT CYCLE (if running)                 │
│ Phase: Breeding ████████████░░░░ 50%       │
├────────────────────────────────────────────┤
│ METRICS                                     │
│ ┌──────────┐ ┌──────────┐ ┌──────────┐    │
│ │Avg: 65%  │ │Best: 87% │ │Div: .234 │    │
│ └──────────┘ └──────────┘ └──────────┘    │
├────────────────────────────────────────────┤
│ HISTORY                                     │
│ ┌──────────────────────────────────────┐  │
│ │ ✓ complete    2024-01-15 02:00       │  │
│ │   Offspring: 2 | Culled: 1           │  │
│ └──────────────────────────────────────┘  │
└────────────────────────────────────────────┘
```

## 🎨 Styling Conventions

### Species Colors

Each species has a unique color scheme:

```tsx
const SPECIES_COLORS: Record<string, string> = {
  cattle: 'bg-amber-100 text-amber-800 border-amber-200',
  duck: 'bg-sky-100 text-sky-800 border-sky-200',
  goat: 'bg-stone-100 text-stone-800 border-stone-200',
  sheep: 'bg-slate-100 text-slate-800 border-slate-200',
  horse: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  falcon: 'bg-violet-100 text-violet-800 border-violet-200',
  hog: 'bg-rose-100 text-rose-800 border-rose-200',
  chicken: 'bg-orange-100 text-orange-800 border-orange-200',
};
```

### Status Colors

Task status indicators:

```tsx
const STATUS_COLORS: Record<string, string> = {
  queued: 'bg-gray-100 text-gray-800',
  routing: 'bg-blue-100 text-blue-800',
  processing: 'bg-amber-100 text-amber-800',
  completed: 'bg-green-100 text-green-800',
  failed: 'bg-red-100 text-red-800',
};
```

## 📊 Data Flow

```
┌─────────────────┐
│   API Routes    │
│ /api/ranch/*    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   useEffect()   │
│   + fetch()     │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│    useState()   │
│   local state   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│    JSX Render   │
│   components    │
└─────────────────┘
```

## 🔗 Dependencies

All ranch components depend on:

- `@/components/ui/*` - UI primitives
- `lucide-react` - Icons
- `@/types/ranch` - TypeScript types

## 📚 Related

- [UI Components](../ui/README.md)
- [API Routes](../../app/api/ranch/README.md)
- [Types](../../types/ranch.ts)
