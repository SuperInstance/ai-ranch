# UI Components (`/src/components/ui`)

Reusable UI primitives built with Radix UI and Tailwind CSS.

## 📁 Files

```
ui/
├── badge.tsx              # Status indicators and labels
├── button.tsx             # Interactive buttons
├── card.tsx               # Content containers
├── input.tsx              # Single-line text input
├── textarea.tsx           # Multi-line text input
├── progress.tsx           # Progress bars
├── scroll-area.tsx        # Scrollable containers
└── tabs.tsx               # Tabbed navigation
```

## 🎯 Component Reference

### Badge

Status indicators and labels.

```tsx
import { Badge } from '@/components/ui/badge';

// Variants
<Badge>Default</Badge>
<Badge variant="secondary">Secondary</Badge>
<Badge variant="outline">Outline</Badge>
<Badge variant="destructive">Error</Badge>
```

**Props:**
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `default \| secondary \| outline \| destructive` | `default` | Badge style |

---

### Button

Interactive buttons with variants.

```tsx
import { Button } from '@/components/ui/button';

// Variants
<Button>Default</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="destructive">Delete</Button>

// Sizes
<Button size="sm">Small</Button>
<Button size="default">Default</Button>
<Button size="lg">Large</Button>
<Button size="icon"><Icon /></Button>
```

**Props:**
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `default \| secondary \| outline \| ghost \| destructive \| link` | `default` | Button style |
| `size` | `default \| sm \| lg \| icon` | `default` | Button size |
| `asChild` | `boolean` | `false` | Render as child element |

---

### Card

Content containers with header, content, and footer.

```tsx
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';

<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
    <CardDescription>Description</CardDescription>
  </CardHeader>
  <CardContent>
    Content goes here
  </CardContent>
  <CardFooter>
    Footer actions
  </CardFooter>
</Card>
```

---

### Input

Single-line text input.

```tsx
import { Input } from '@/components/ui/input';

<Input placeholder="Enter text..." />
<Input type="email" />
<Input disabled />
```

**Props:**
Standard HTML input attributes.

---

### Textarea

Multi-line text input.

```tsx
import { Textarea } from '@/components/ui/textarea';

<Textarea placeholder="Enter long text..." />
<Textarea className="min-h-[100px]" />
```

**Props:**
Standard HTML textarea attributes.

---

### Progress

Progress bars for visualizing completion.

```tsx
import { Progress } from '@/components/ui/progress';

<Progress value={75} />  {/* 75% complete */}
<Progress value={100} /> {/* Full */}
```

**Props:**
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `number` | - | Progress percentage (0-100) |

---

### ScrollArea

Scrollable containers with custom scrollbars.

```tsx
import { ScrollArea } from '@/components/ui/scroll-area';

<ScrollArea className="h-[400px]">
  <div className="p-4">
    {/* Long content here */}
  </div>
</ScrollArea>
```

---

### Tabs

Tabbed navigation for organizing content.

```tsx
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

<Tabs defaultValue="overview">
  <TabsList>
    <TabsTrigger value="overview">Overview</TabsTrigger>
    <TabsTrigger value="details">Details</TabsTrigger>
  </TabsList>
  
  <TabsContent value="overview">
    Overview content
  </TabsContent>
  
  <TabsContent value="details">
    Details content
  </TabsContent>
</Tabs>
```

---

## 🎨 Theming

All components use CSS variables for consistent theming:

```css
/* Light mode */
:root {
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  --card: 0 0% 100%;
  --primary: 222.2 47.4% 11.2%;
  --secondary: 210 40% 96.1%;
  --muted: 210 40% 96.1%;
  --accent: 210 40% 96.1%;
  --destructive: 0 84.2% 60.2%;
  --border: 214.3 31.8% 91.4%;
  --ring: 222.2 84% 4.9%;
}

/* Dark mode */
.dark {
  --background: 222.2 84% 4.9%;
  --foreground: 210 40% 98%;
  /* ... */
}
```

## 📦 Dependencies

| Package | Purpose |
|---------|---------|
| `@radix-ui/react-slot` | Polymorphic components |
| `@radix-ui/react-progress` | Progress primitive |
| `@radix-ui/react-tabs` | Tabs primitive |
| `@radix-ui/react-scroll-area` | Scroll area primitive |
| `class-variance-authority` | Variant management |
| `clsx` | Class merging |
| `tailwind-merge` | Tailwind class deduplication |

## 🔧 Utility Functions

```tsx
// lib/utils.ts
import { cn } from '@/lib/utils';

// Merge classes with conditional logic
<div className={cn(
  'base-class',
  isActive && 'active-class',
  className
)} />
```

## 📚 Origin

These components are based on [shadcn/ui](https://ui.shadcn.com/) - a collection of reusable components built with:

- **Radix UI** - Unstyled, accessible primitives
- **Tailwind CSS** - Utility-first styling
- **TypeScript** - Type safety

The components are copied directly into the project for full customization control.

## 📚 Related

- [Ranch Components](../ranch/README.md)
- [shadcn/ui Documentation](https://ui.shadcn.com/docs)
