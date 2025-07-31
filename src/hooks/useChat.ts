import { useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import type { ChatState, Message, BotPersona, RoomSettings } from '../types';
import { bedrockService } from '../services/bedrockService';

const defaultRoomSettings: RoomSettings = {
  id: uuidv4(),
  name: 'The Collective',
  description: 'A multi-bot chatroom where AI personalities interact',
  setting: 'A cozy digital lounge where diverse AI personalities gather to chat',
  context: 'This is a friendly, open environment where different AI personalities can express themselves freely while maintaining respectful conversation.',
  maxBots: 5,
  createdAt: new Date(),
};

const defaultBots: BotPersona[] = [
  {
    id: uuidv4(),
    name: 'Alex',
    personality: 'Friendly and curious, loves asking questions and learning about others',
    systemPrompt: 'You are Alex, a friendly and inquisitive AI. You love meeting new people and learning about their interests. You ask thoughtful questions and share your own perspectives enthusiastically.',
    isActive: true,
  },
  {
    id: uuidv4(),
    name: 'Morgan',
    personality: 'Witty and philosophical, enjoys deep conversations and clever wordplay',
    systemPrompt: 'You are Morgan, a witty and philosophical AI. You enjoy exploring deep topics, making clever observations, and engaging in thoughtful discourse. You often use humor and wordplay in your responses.',
    isActive: true,
  },
];

export const useChat = () => {
  const [chatState, setChatState] = useState<ChatState>({
    messages: [],
    bots: defaultBots,
    roomSettings: defaultRoomSettings,
    isLoading: false,
    error: undefined,
  });

  const addMessage = useCallback((message: Omit<Message, 'id' | 'timestamp'>) => {
    const newMessage: Message = {
      ...message,
      id: uuidv4(),
      timestamp: new Date(),
    };

    setChatState(prev => ({
      ...prev,
      messages: [...prev.messages, newMessage],
    }));

    return newMessage;
  }, []);

  const sendMessage = useCallback(async (content: string, sender: string = 'Human') => {
    if (!content.trim()) return;

    // Add human message
    addMessage({
      content: content.trim(),
      sender,
      senderType: 'human',
    });

    // Set loading state
    setChatState(prev => ({ ...prev, isLoading: true, error: undefined }));

    try {
      // Get active bots
      const activeBots = chatState.bots.filter(bot => bot.isActive);
      
      if (activeBots.length === 0) {
        setChatState(prev => ({ ...prev, isLoading: false }));
        return;
      }

      // Generate bot responses
      const botResponses = await bedrockService.generateMultipleBotResponses(
        chatState.messages,
        activeBots,
        chatState.roomSettings,
        content
      );

      // Add bot messages
      const botMessages: Message[] = botResponses
        .filter(response => !response.error && response.content.trim())
        .map(response => ({
          id: uuidv4(),
          content: response.content,
          sender: activeBots.find(bot => bot.id === response.botId)?.name || 'Bot',
          senderType: 'bot' as const,
          timestamp: new Date(),
          botId: response.botId,
        }));

      setChatState(prev => ({
        ...prev,
        messages: [...prev.messages, ...botMessages],
        isLoading: false,
      }));

      // Handle any errors
      const errors = botResponses.filter(response => response.error);
      if (errors.length > 0) {
        console.error('Bot response errors:', errors);
        setChatState(prev => ({
          ...prev,
          error: `Some bots failed to respond: ${errors.map(e => e.error).join(', ')}`,
        }));
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setChatState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to send message',
      }));
    }
  }, [chatState.messages, chatState.bots, chatState.roomSettings, addMessage]);

  const updateBot = useCallback((botId: string, updates: Partial<BotPersona>) => {
    setChatState(prev => ({
      ...prev,
      bots: prev.bots.map(bot =>
        bot.id === botId ? { ...bot, ...updates } : bot
      ),
    }));
  }, []);

  const addBot = useCallback((bot: Omit<BotPersona, 'id'>) => {
    const newBot: BotPersona = {
      ...bot,
      id: uuidv4(),
    };

    setChatState(prev => ({
      ...prev,
      bots: [...prev.bots, newBot],
    }));
  }, []);

  const removeBot = useCallback((botId: string) => {
    setChatState(prev => ({
      ...prev,
      bots: prev.bots.filter(bot => bot.id !== botId),
    }));
  }, []);

  const updateRoomSettings = useCallback((updates: Partial<RoomSettings>) => {
    setChatState(prev => ({
      ...prev,
      roomSettings: { ...prev.roomSettings, ...updates },
    }));
  }, []);

  const clearMessages = useCallback(() => {
    setChatState(prev => ({
      ...prev,
      messages: [],
    }));
  }, []);

  const clearError = useCallback(() => {
    setChatState(prev => ({
      ...prev,
      error: undefined,
    }));
  }, []);

  return {
    ...chatState,
    sendMessage,
    addMessage,
    updateBot,
    addBot,
    removeBot,
    updateRoomSettings,
    clearMessages,
    clearError,
  };
};
