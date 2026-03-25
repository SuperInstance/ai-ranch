/**
 * Telegram Channel Connector
 * 
 * Connects AI Ranch to Telegram for bot functionality.
 */

import { Intent, Channel } from '@/types/ranch';

export interface TelegramConfig {
  token: string;
  webhookUrl?: string;
}

export interface TelegramMessage {
  message_id: number;
  text: string;
  chat: {
    id: number;
    type: string;
  };
  from: {
    id: number;
    username?: string;
    is_bot: boolean;
  };
}

export class TelegramConnector {
  private config: TelegramConfig;
  private listeners: Set<(message: TelegramMessage) => void> = new Set();
  private isConnected: boolean = false;

  constructor(config: TelegramConfig) {
    this.config = config;
  }

  /**
   * Start the Telegram bot
   */
  async start(): Promise<void> {
    console.log('[Telegram] Starting connector...');
    console.log(`[Telegram] Token: ${this.config.token.slice(0, 10)}...`);
    
    this.isConnected = true;
    console.log('[Telegram] Connected (simulated)');
  }

  /**
   * Stop the Telegram bot
   */
  async stop(): Promise<void> {
    console.log('[Telegram] Stopping connector...');
    this.isConnected = false;
  }

  /**
   * Subscribe to incoming messages
   */
  onMessage(listener: (message: TelegramMessage) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  /**
   * Send a message to a chat
   */
  async send(chatId: number, text: string): Promise<void> {
    if (!this.isConnected) {
      throw new Error('Telegram connector not connected');
    }

    console.log(`[Telegram] Sending to ${chatId}: ${text.slice(0, 50)}...`);
  }

  /**
   * Convert Telegram message to Ranch Intent
   */
  toIntent(message: TelegramMessage): Intent {
    return {
      id: `telegram_${message.message_id}`,
      content: message.text,
      source: {
        type: 'telegram',
        channelId: message.chat.id.toString(),
        userId: message.from.id.toString(),
      },
      metadata: {
        username: message.from.username,
        isBot: message.from.is_bot,
        chatType: message.chat.type,
      },
      timestamp: new Date(),
    };
  }

  isHealthy(): boolean {
    return this.isConnected;
  }
}

export const createTelegramConnector = (config: TelegramConfig): TelegramConnector => {
  return new TelegramConnector(config);
};
