export interface Message {
  id: string;
  content: string;
  sender: string;
  senderType: 'human' | 'bot';
  timestamp: Date;
  botId?: string;
}

export interface BotPersona {
  id: string;
  name: string;
  personality: string;
  avatar?: string;
  systemPrompt: string;
  isActive: boolean;
}

export interface RoomSettings {
  id: string;
  name: string;
  description: string;
  setting: string; // e.g., "Medieval tavern", "Corporate meeting", etc.
  context: string; // Additional context that influences bot behavior
  maxBots: number;
  primaryColor: string; // Hex color for theming
  backgroundImage: string; // URL for background image
  createdAt: Date;
}

export interface ChatState {
  messages: Message[];
  bots: BotPersona[];
  roomSettings: RoomSettings;
  isLoading: boolean;
  error?: string;
}

export interface BedrockConfig {
  region: string;
  accessKeyId: string;
  secretAccessKey: string;
  modelId: string;
}

export interface BotResponse {
  content: string;
  botId: string;
  error?: string;
}
