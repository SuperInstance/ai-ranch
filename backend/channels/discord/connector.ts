/**
 * Discord Channel Connector
 * 
 * Connects AI Ranch to Discord servers for bot functionality.
 */

import { Intent, Channel, Task } from '@/types/ranch';

export interface DiscordConfig {
  token: string;
  clientId: string;
  guildId?: string;
  prefix?: string;
}

export interface DiscordMessage {
  id: string;
  content: string;
  channelId: string;
  author: {
    id: string;
    username: string;
    bot: boolean;
  };
  reply: (content: string) => Promise<void>;
}

export class DiscordConnector {
  private config: DiscordConfig;
  private listeners: Set<(message: DiscordMessage) => void> = new Set();
  private isConnected: boolean = false;

  constructor(config: DiscordConfig) {
    this.config = {
      prefix: '!',
      ...config,
    };
  }

  /**
   * Start the Discord bot
   */
  async start(): Promise<void> {
    // Scaffold: In production, this would connect to Discord Gateway
    console.log('[Discord] Starting connector...');
    console.log(`[Discord] Token: ${this.config.token.slice(0, 10)}...`);
    console.log(`[Discord] Client ID: ${this.config.clientId}`);
    
    this.isConnected = true;
    console.log('[Discord] Connected (simulated)');
  }

  /**
   * Stop the Discord bot
   */
  async stop(): Promise<void> {
    console.log('[Discord] Stopping connector...');
    this.isConnected = false;
  }

  /**
   * Subscribe to incoming messages
   */
  onMessage(listener: (message: DiscordMessage) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  /**
   * Send a message to a channel
   */
  async send(channelId: string, content: string): Promise<void> {
    if (!this.isConnected) {
      throw new Error('Discord connector not connected');
    }

    // Scaffold: In production, this would send via Discord API
    console.log(`[Discord] Sending to ${channelId}: ${content.slice(0, 50)}...`);
  }

  /**
   * Convert Discord message to Ranch Intent
   */
  toIntent(message: DiscordMessage): Intent {
    return {
      id: `discord_${message.id}`,
      content: message.content.replace(new RegExp(`^${this.config.prefix}`), '').trim(),
      source: {
        type: 'discord',
        channelId: message.channelId,
        userId: message.author.id,
      },
      metadata: {
        username: message.author.username,
        isBot: message.author.bot,
      },
      timestamp: new Date(),
    };
  }

  /**
   * Check if connector is healthy
   */
  isHealthy(): boolean {
    return this.isConnected;
  }
}

// Export singleton factory
export const createDiscordConnector = (config: DiscordConfig): DiscordConnector => {
  return new DiscordConnector(config);
};
