# Backend Directory

Channel connectors and external integrations for AI Ranch.

## 📁 Structure

```
backend/
├── channels/              # Channel connectors
│   ├── discord/          # Discord bot integration
│   ├── telegram/         # Telegram bot integration
│   └── slack/            # Slack app integration
├── providers/            # LLM provider integrations
│   ├── openai/           # OpenAI API
│   ├── anthropic/        # Anthropic Claude
│   └── ollama/           # Local LLM via Ollama
└── README.md             # This file
```

## 🔌 Channel Connectors

Channel connectors allow AI Ranch to receive and respond to messages from various platforms.

### Available Channels

| Channel | Status | Description |
|---------|--------|-------------|
| Discord | 🚧 Scaffold | Discord bot integration |
| Telegram | 📋 Planned | Telegram bot integration |
| Slack | 📋 Planned | Slack app integration |
| Webhook | 📋 Planned | Generic webhook receiver |

### Usage

```typescript
// Example: Discord connector
import { DiscordConnector } from '@/backend/channels/discord';

const discord = new DiscordConnector({
  token: process.env.DISCORD_BOT_TOKEN,
  guildId: process.env.DISCORD_GUILD_ID,
});

discord.on('message', async (message) => {
  const task = await collie.createTask({
    content: message.content,
    source: { type: 'discord', channelId: message.channelId, userId: message.author.id }
  });
  
  const result = await collie.processTask(task.id);
  await message.reply(result.output);
});

discord.start();
```

## 🤖 LLM Providers

LLM providers handle the actual AI inference.

### Available Providers

| Provider | Status | Description |
|----------|--------|-------------|
| OpenAI | 🚧 Scaffold | GPT-4, GPT-3.5 |
| Anthropic | 📋 Planned | Claude models |
| Ollama | 📋 Planned | Local LLM |

### Usage

```typescript
// Example: OpenAI provider
import { OpenAIProvider } from '@/backend/providers/openai';

const llm = new OpenAIProvider({
  apiKey: process.env.OPENAI_API_KEY,
  model: 'gpt-4o-mini',
});

const response = await llm.generate({
  prompt: 'Analyze this email...',
  temperature: 0.7,
  maxTokens: 1024,
});
```

## 🔧 Configuration

Add your credentials to `.env`:

```env
# Discord
DISCORD_BOT_TOKEN=your-token
DISCORD_CLIENT_ID=your-client-id

# Telegram
TELEGRAM_BOT_TOKEN=your-token

# Slack
SLACK_BOT_TOKEN=xoxb-your-token

# LLM Providers
OPENAI_API_KEY=sk-your-key
ANTHROPIC_API_KEY=sk-ant-your-key
OLLAMA_BASE_URL=http://localhost:11434
```

## 📚 Related

- [Main Documentation](../docs/)
- [API Reference](../docs/api-reference.md)
- [Environment Setup](../.env.example)
