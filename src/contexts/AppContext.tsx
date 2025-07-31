import React from 'react';
import type { ReactNode } from 'react';
import { RoomProvider } from './RoomContext';
import { BotProvider } from './BotContext';

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  return (
    <RoomProvider>
      <BotProvider>
        {children}
      </BotProvider>
    </RoomProvider>
  );
};

// Re-export hooks for convenience
export { useRoom } from './RoomContext';
export { useBots } from './BotContext';
