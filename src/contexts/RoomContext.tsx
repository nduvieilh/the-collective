import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { v4 as uuidv4 } from 'uuid';
import type { RoomSettings } from '../types';
import roomPresetsData from '../data/roomPresets.json';

interface RoomPreset {
  id: string;
  name: string;
  description: string;
  setting: string;
  context: string;
  maxBots: number;
  primaryColor: string;
  backgroundImage: string;
}

interface RoomContextType {
  roomSettings: RoomSettings;
  roomPresets: RoomPreset[];
  updateRoomSettings: (updates: Partial<RoomSettings>) => void;
  applyRoomPreset: (presetId: string) => void;
  resetToDefault: () => void;
}

const RoomContext = createContext<RoomContextType | undefined>(undefined);

const STORAGE_KEY = 'collective-room-settings';

const createRoomSettingsFromPreset = (preset: RoomPreset): RoomSettings => ({
  id: uuidv4(),
  name: preset.name,
  description: preset.description,
  setting: preset.setting,
  context: preset.context,
  maxBots: preset.maxBots,
  primaryColor: preset.primaryColor,
  backgroundImage: preset.backgroundImage,
  createdAt: new Date(),
});

const getDefaultRoomSettings = (): RoomSettings => {
  return createRoomSettingsFromPreset(roomPresetsData.default);
};

const loadRoomSettings = (): RoomSettings => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      return {
        ...parsed,
        createdAt: new Date(parsed.createdAt),
      };
    }
  } catch (error) {
    console.error('Error loading room settings:', error);
  }
  return getDefaultRoomSettings();
};

const saveRoomSettings = (settings: RoomSettings) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  } catch (error) {
    console.error('Error saving room settings:', error);
  }
};

interface RoomProviderProps {
  children: ReactNode;
}

export const RoomProvider: React.FC<RoomProviderProps> = ({ children }) => {
  const [roomSettings, setRoomSettings] = useState<RoomSettings>(loadRoomSettings);

  useEffect(() => {
    saveRoomSettings(roomSettings);
  }, [roomSettings]);

  const updateRoomSettings = (updates: Partial<RoomSettings>) => {
    setRoomSettings(prev => ({ ...prev, ...updates }));
  };

  const applyRoomPreset = (presetId: string) => {
    const preset = roomPresetsData.presets.find(p => p.id === presetId) || roomPresetsData.default;
    const newSettings = createRoomSettingsFromPreset(preset);
    // Keep the current room ID and creation date
    setRoomSettings(prev => ({
      ...newSettings,
      id: prev.id,
      createdAt: prev.createdAt,
    }));
  };

  const resetToDefault = () => {
    const defaultSettings = getDefaultRoomSettings();
    setRoomSettings(prev => ({
      ...defaultSettings,
      id: prev.id,
      createdAt: prev.createdAt,
    }));
  };

  const value: RoomContextType = {
    roomSettings,
    roomPresets: roomPresetsData.presets,
    updateRoomSettings,
    applyRoomPreset,
    resetToDefault,
  };

  return (
    <RoomContext.Provider value={value}>
      {children}
    </RoomContext.Provider>
  );
};

export const useRoom = (): RoomContextType => {
  const context = useContext(RoomContext);
  if (context === undefined) {
    throw new Error('useRoom must be used within a RoomProvider');
  }
  return context;
};
