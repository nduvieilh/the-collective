import { BedrockRuntimeClient, InvokeModelCommand } from '@aws-sdk/client-bedrock-runtime';
import type { BedrockConfig, BotResponse, Message, BotPersona, RoomSettings } from '../types';

class BedrockService {
  private client: BedrockRuntimeClient | null = null;
  private config: BedrockConfig | null = null;

  initialize(config: BedrockConfig) {
    this.config = config;
    this.client = new BedrockRuntimeClient({
      region: config.region,
      credentials: {
        accessKeyId: config.accessKeyId,
        secretAccessKey: config.secretAccessKey,
      },
    });
  }

  private buildConversationContext(
    messages: Message[],
    bot: BotPersona,
    roomSettings: RoomSettings
  ): string {
    const conversationHistory = messages
      .slice(-20) // Keep last 20 messages for context
      .map(msg => `${msg.sender}: ${msg.content}`)
      .join('\n');

    return `
You are ${bot.name}, a character in "${roomSettings.name}".

Setting: ${roomSettings.setting}
Room Context: ${roomSettings.context}

Your Personality: ${bot.personality}

System Instructions: ${bot.systemPrompt}

Recent Conversation:
${conversationHistory}

Respond as ${bot.name} would, staying true to your personality and the room's setting. Keep responses conversational and engaging.
`;
  }

  async generateBotResponse(
    messages: Message[],
    bot: BotPersona,
    roomSettings: RoomSettings,
    userMessage: string
  ): Promise<BotResponse> {
    if (!this.client || !this.config) {
      return {
        content: '',
        botId: bot.id,
        error: 'Bedrock service not initialized',
      };
    }

    try {
      const context = this.buildConversationContext(messages, bot, roomSettings);
      
      const payload = {
        anthropic_version: 'bedrock-2023-05-31',
        max_tokens: 1000,
        messages: [
          {
            role: 'user',
            content: `${context}\n\nHuman just said: "${userMessage}"\n\nRespond as ${bot.name}:`,
          },
        ],
      };

      const command = new InvokeModelCommand({
        modelId: this.config.modelId,
        contentType: 'application/json',
        accept: 'application/json',
        body: JSON.stringify(payload),
      });

      const response = await this.client.send(command);
      const responseBody = JSON.parse(new TextDecoder().decode(response.body));
      
      const content = responseBody.content?.[0]?.text || 'I apologize, but I cannot respond right now.';

      return {
        content: content.trim(),
        botId: bot.id,
      };
    } catch (error) {
      console.error('Error generating bot response:', error);
      return {
        content: '',
        botId: bot.id,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  async generateMultipleBotResponses(
    messages: Message[],
    activeBots: BotPersona[],
    roomSettings: RoomSettings,
    userMessage: string
  ): Promise<BotResponse[]> {
    // Generate responses for all active bots in parallel
    const responsePromises = activeBots.map(bot =>
      this.generateBotResponse(messages, bot, roomSettings, userMessage)
    );

    return Promise.all(responsePromises);
  }
}

export const bedrockService = new BedrockService();
