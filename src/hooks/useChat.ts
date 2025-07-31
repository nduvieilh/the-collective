import { useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import type { Message, BotPersona, RoomSettings } from '../types';
import { bedrockService } from '../services/bedrockService';

interface ChatState {
  messages: Message[];
  isLoading: boolean;
  error?: string;
}

export const useChat = () => {
  const [chatState, setChatState] = useState<ChatState>({
    messages: [],
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

  const sendMessage = useCallback(async (
    content: string, 
    activeBots: BotPersona[], 
    roomSettings: RoomSettings,
    sender: string = 'Human'
  ) => {
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
      if (activeBots.length === 0) {
        setChatState(prev => ({ ...prev, isLoading: false }));
        return;
      }

      // Generate bot responses
      const botResponses = await bedrockService.generateMultipleBotResponses(
        chatState.messages,
        activeBots,
        roomSettings,
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
  }, [chatState.messages, addMessage]);

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
    clearMessages,
    clearError,
  };
};
