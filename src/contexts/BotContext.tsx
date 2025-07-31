import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { v4 as uuidv4 } from 'uuid';
import type { BotPersona } from '../types';
import defaultBotsData from '../data/defaultBots.json';
import botTemplatesData from '../data/botTemplates.json';

interface BotTemplate {
  id: string;
  name: string;
  personality: string;
  systemPrompt: string;
}

interface BotContextType {
  bots: BotPersona[];
  botTemplates: BotTemplate[];
  updateBot: (botId: string, updates: Partial<BotPersona>) => void;
  addBot: (bot: Omit<BotPersona, 'id'>) => void;
  addBotFromTemplate: (templateId: string, customName?: string) => void;
  removeBot: (botId: string) => void;
  resetToDefaults: () => void;
  getActiveBots: () => BotPersona[];
}

const BotContext = createContext<BotContextType | undefined>(undefined);

const STORAGE_KEY = 'collective-bots';

const createBotFromTemplate = (template: BotTemplate, customName?: string): Omit<BotPersona, 'id'> => ({
  name: customName || template.name,
  personality: template.personality,
  systemPrompt: template.systemPrompt,
  isActive: true,
});

const getDefaultBots = (): BotPersona[] => {
  return defaultBotsData.bots.map(bot => ({
    ...bot,
    id: uuidv4(), // Generate new IDs for each session
  }));
};

const loadBots = (): BotPersona[] => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      // Ensure all bots have valid IDs
      return parsed.map((bot: any) => ({
        ...bot,
        id: bot.id || uuidv4(),
      }));
    }
  } catch (error) {
    console.error('Error loading bots:', error);
  }
  return getDefaultBots();
};

const saveBots = (bots: BotPersona[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(bots));
  } catch (error) {
    console.error('Error saving bots:', error);
  }
};

interface BotProviderProps {
  children: ReactNode;
}

export const BotProvider: React.FC<BotProviderProps> = ({ children }) => {
  const [bots, setBots] = useState<BotPersona[]>(loadBots);

  useEffect(() => {
    saveBots(bots);
  }, [bots]);

  const updateBot = (botId: string, updates: Partial<BotPersona>) => {
    setBots(prev => prev.map(bot =>
      bot.id === botId ? { ...bot, ...updates } : bot
    ));
  };

  const addBot = (bot: Omit<BotPersona, 'id'>) => {
    const newBot: BotPersona = {
      ...bot,
      id: uuidv4(),
    };
    setBots(prev => [...prev, newBot]);
  };

  const addBotFromTemplate = (templateId: string, customName?: string) => {
    const template = botTemplatesData.templates.find(t => t.id === templateId);
    if (template) {
      const botData = createBotFromTemplate(template, customName);
      addBot(botData);
    }
  };

  const removeBot = (botId: string) => {
    setBots(prev => prev.filter(bot => bot.id !== botId));
  };

  const resetToDefaults = () => {
    setBots(getDefaultBots());
  };

  const getActiveBots = () => {
    return bots.filter(bot => bot.isActive);
  };

  const value: BotContextType = {
    bots,
    botTemplates: botTemplatesData.templates,
    updateBot,
    addBot,
    addBotFromTemplate,
    removeBot,
    resetToDefaults,
    getActiveBots,
  };

  return (
    <BotContext.Provider value={value}>
      {children}
    </BotContext.Provider>
  );
};

export const useBots = (): BotContextType => {
  const context = useContext(BotContext);
  if (context === undefined) {
    throw new Error('useBots must be used within a BotProvider');
  }
  return context;
};
