# AI Ranch Quick Start

Get your self-evolving AI Ranch up and running in 5 minutes.

## Prerequisites

- Node.js 18+
- npm or bun

## Installation

```bash
# Clone the repository
git clone https://github.com/your-org/ai-ranch.git
cd ai-ranch

# Install dependencies
npm install
# or
bun install

# Start the development server
npm run dev
# or
bun run dev
```

## First Steps

### 1. Open the Dashboard

Navigate to `http://localhost:3000` to see the AI Ranch dashboard.

### 2. Submit Your First Task

Use the task panel to submit a query:

```
Analyze this email and extract key action items
```

The Collie orchestrator will route your task to the appropriate species (in this case, `cattle`).

### 3. View Species Details

Click on the "Species" tab to see all available species:

- **Cattle** - Heavy reasoning and analysis
- **Duck** - Network and API operations
- **Goat** - Navigation and spatial reasoning
- **Sheep** - Consensus and voting
- **Horse** - ETL and data pipelines
- **Falcon** - Fast search and reconnaissance
- **Hog** - Logging and diagnostics
- **Chicken** - Monitoring and alerts

### 4. Trigger Evolution

Click "Run Evolution" in the Evolution tab to see the Night School process:

1. **Evaluate** - Species are scored
2. **Cull** - Underperformers removed
3. **Breed** - New offspring created
4. **Distill** - Offspring trained
5. **Quarantine** - Offspring tested
6. **Promote** - Successful offspring promoted

## Using the API

### Create a Task via API

```bash
curl -X POST http://localhost:3000/api/ranch/tasks \
  -H "Content-Type: application/json" \
  -d '{"content": "Search for recent AI news"}'
```

### Get Species Information

```bash
curl http://localhost:3000/api/ranch/species
```

### Trigger Evolution

```bash
curl -X POST http://localhost:3000/api/ranch/evolution
```

## Understanding breed.md

The `breed.md` file defines agent DNA. Create one in the `templates/` directory:

```markdown
# species
cattle

# name
Email Analyst

# description
An agent specialized in processing and analyzing emails.

# capabilities
- email_processing (weight: 1.0)
- analysis (weight: 0.9)
- summarization (weight: 0.7)

# personality
tone: professional
verbosity: concise
creativity: 0.3

# model
base_model: phi-3-mini
lora: cattle-reasoning-v1
temperature: 0.5
```

## Night School

Night School runs automatically at 02:00 AM daily. During this time:

1. Species fitness is evaluated based on task history
2. Underperforming species are culled
3. Top performers breed to create offspring
4. Offspring are trained and tested
5. Successful offspring are promoted to the population

## Next Steps

- Explore the [API Reference](./api-reference.md)
- Create custom breed.md templates
- Configure channel connectors (Discord, Telegram)
- Set up TensorRT-LLM for GPU acceleration
