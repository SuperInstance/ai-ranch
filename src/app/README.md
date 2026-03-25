# App Router (`/src/app`)

Next.js 15 App Router directory containing pages and API routes.

## 📁 Structure

```
app/
├── api/                    # API Routes
│   └── ranch/             # Ranch API endpoints
├── globals.css            # Global CSS styles
├── layout.tsx             # Root layout (providers, themes)
└── page.tsx               # Home page → Dashboard
```

## 🎯 Purpose

This directory follows Next.js 15 App Router conventions:

- **`layout.tsx`** - Root layout that wraps all pages
  - Sets up theme provider (next-themes)
  - Configures fonts (Inter)
  - Defines metadata

- **`page.tsx`** - Home page component
  - Renders the main Ranch Dashboard
  - Entry point for the web UI

- **`globals.css`** - Global styles
  - CSS variables for theming
  - Tailwind CSS imports
  - Light/dark mode support

- **`api/`** - API route handlers
  - RESTful endpoints for the backend
  - Server-side logic

## 🔗 Route Mapping

| URL Path | File | Description |
|----------|------|-------------|
| `/` | `page.tsx` | Main dashboard |
| `/api/ranch/species` | `api/ranch/species/route.ts` | Species CRUD |
| `/api/ranch/tasks` | `api/ranch/tasks/route.ts` | Task management |
| `/api/ranch/evolution` | `api/ranch/evolution/route.ts` | Evolution control |

## 🎨 Styling

The app uses Tailwind CSS 4 with CSS variables for theming:

```css
/* Light mode (default) */
:root {
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  ...
}

/* Dark mode */
.dark {
  --background: 222.2 84% 4.9%;
  --foreground: 210 40% 98%;
  ...
}
```

## 📚 Related

- [Next.js App Router Docs](https://nextjs.org/docs/app)
- [API Routes](./api/README.md)
