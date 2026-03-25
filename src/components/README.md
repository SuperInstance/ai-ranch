# Components (`/src/components`)

React components for the AI Ranch dashboard.

## 📁 Structure

```
components/
├── ranch/                 # Ranch-specific components
│   ├── dashboard.tsx     # Main dashboard layout
│   ├── evolution-panel.tsx
│   ├── species-panel.tsx
│   └── task-panel.tsx
│
└── ui/                    # Reusable UI primitives
    ├── badge.tsx
    ├── button.tsx
    ├── card.tsx
    ├── input.tsx
    ├── progress.tsx
    ├── scroll-area.tsx
    ├── tabs.tsx
    └── textarea.tsx
```

## 🎯 Component Categories

### Ranch Components (`/ranch`)

Domain-specific components for the AI Ranch system:

| Component | Purpose |
|-----------|---------|
| `Dashboard` | Main layout with metrics bar and tabs |
| `SpeciesPanel` | View and manage species registry |
| `TaskPanel` | Create and monitor tasks |
| `EvolutionPanel` | Night School evolution control |

### UI Components (`/ui`)

Reusable primitives based on shadcn/ui (Radix + Tailwind):

| Component | Purpose |
|-----------|---------|
| `Badge` | Status indicators and labels |
| `Button` | Interactive buttons |
| `Card` | Content containers |
| `Input` | Single-line text input |
| `Textarea` | Multi-line text input |
| `Progress` | Progress bars |
| `Tabs` | Tabbed navigation |
| `ScrollArea` | Scrollable containers |

## 🎨 Design System

### Theming

Components use CSS variables for theming:

```css
/* Light mode */
--background: 0 0% 100%;
--foreground: 222.2 84% 4.9%;
--primary: 222.2 47.4% 11.2%;
--muted: 210 40% 96.1%;
--accent: 210 40% 96.1%;
--border: 214.3 31.8% 91.4%;
```

### Responsive Design

All components are mobile-first:

```tsx
// Responsive grid example
<div className="grid gap-4 md:grid-cols-3">
  {/* Mobile: 1 col, Tablet+: 3 cols */}
</div>
```

### Dark Mode

Dark mode is handled via `next-themes`:

```tsx
<ThemeProvider
  attribute="class"
  defaultTheme="system"
  enableSystem
>
  {children}
</ThemeProvider>
```

## 📝 Component Guidelines

### Client Components

All interactive components use `'use client'`:

```tsx
'use client';

import { useState } from 'react';
// ... component code
```

### Props Pattern

Use TypeScript interfaces for props:

```tsx
interface SpeciesPanelProps {
  initialSpecies?: Species[];
  onSpeciesSelect?: (species: Species) => void;
}

export function SpeciesPanel({ initialSpecies, onSpeciesSelect }: SpeciesPanelProps) {
  // ...
}
```

### Styling

Use Tailwind utility classes:

```tsx
<div className="flex items-center gap-2 p-4 bg-muted rounded-lg">
  <Icon className="h-5 w-5 text-primary" />
  <span className="font-medium">Content</span>
</div>
```

### State Management

Use React hooks for local state:

```tsx
const [species, setSpecies] = useState<Species[]>([]);
const [loading, setLoading] = useState(true);
```

## 🔄 Data Fetching

Components fetch data from the API:

```tsx
useEffect(() => {
  const fetchData = async () => {
    const response = await fetch('/api/ranch/species');
    const data = await response.json();
    if (data.success) {
      setSpecies(data.data);
    }
  };
  
  fetchData();
  const interval = setInterval(fetchData, 5000);
  return () => clearInterval(interval);
}, []);
```

## 📚 Related

- [Ranch Components](./ranch/README.md)
- [UI Components](./ui/README.md)
