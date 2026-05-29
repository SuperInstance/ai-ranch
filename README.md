# AI Ranch 🐄

**Self-evolving AI agent system** — a Next.js implementation of the SuperInstance architecture for local-first, continuously improving AI agents. Agents compete, breed, and evolve based on task performance.

## What This Gives You

- **Self-improving agents** — nightly evolution cycles select the best performers
- **8 agent species** — specialized types for different tasks (coding, research, creative, ops)
- **DNA-driven configuration** — agent traits defined in `breed.md` configs
- **Local-first** — runs on your infrastructure, no cloud dependency
- **Next.js dashboard** — monitor evolution, species, and performance in real time

## Quick Start

```bash
git clone https://github.com/SuperInstance/ai-ranch.git
cd ai-ranch
bun install
bun dev
```

Open [localhost:3000](http://localhost:3000).

## Architecture

| Layer | Technology |
|-------|-----------|
| Dashboard | Next.js 15, React, TypeScript, Tailwind CSS |
| Agent Runtime | Python (ranch, herd, pasture, brand) |
| Evolution | Nightly cycles with selection, crossover, mutation |

## Testing

```bash
bun test          # Frontend
pytest            # Python backend
```

## How It Fits

The agent lifecycle manager in the SuperInstance ecosystem. Uses `SmartCRDT` for distributed state, `plato-training` for agent evaluation, and `a2a-protocol` for inter-agent communication.

## License

MIT
