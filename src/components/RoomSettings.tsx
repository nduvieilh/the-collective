import React, { useState } from 'react';
import { useRoom } from '../contexts/AppContext';

interface RoomSettingsProps {
  onClearMessages: () => void;
}

export const RoomSettings: React.FC<RoomSettingsProps> = ({
  onClearMessages,
}) => {
  const { roomSettings, roomPresets, updateRoomSettings, applyRoomPreset, resetToDefault } = useRoom();
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bg-white border-b border-gray-200 p-4">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <h1 className="text-xl font-bold text-gray-800">{roomSettings.name}</h1>
          <p className="text-sm text-gray-600">{roomSettings.description}</p>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={onClearMessages}
            className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            Clear Chat
          </button>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            {isExpanded ? 'Hide Settings' : 'Room Settings'}
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Room Name
              </label>
              <input
                type="text"
                value={roomSettings.name}
                onChange={(e) => updateRoomSettings({ name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <input
                type="text"
                value={roomSettings.description}
                onChange={(e) => updateRoomSettings({ description: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Setting/Theme
              </label>
              <input
                type="text"
                value={roomSettings.setting}
                onChange={(e) => updateRoomSettings({ setting: e.target.value })}
                placeholder="e.g., Medieval tavern, Corporate meeting, Cozy coffee shop..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Room Context
              </label>
              <textarea
                value={roomSettings.context}
                onChange={(e) => updateRoomSettings({ context: e.target.value })}
                placeholder="Additional context that influences how bots behave in this room..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={3}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Max Bots
              </label>
              <input
                type="number"
                min="1"
                max="10"
                value={roomSettings.maxBots}
                onChange={(e) => updateRoomSettings({ maxBots: parseInt(e.target.value) || 1 })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Primary Color
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={roomSettings.primaryColor}
                  onChange={(e) => updateRoomSettings({ primaryColor: e.target.value })}
                  className="w-16 h-10 border border-gray-300 rounded cursor-pointer"
                />
                <input
                  type="text"
                  value={roomSettings.primaryColor}
                  onChange={(e) => updateRoomSettings({ primaryColor: e.target.value })}
                  placeholder="#6366f1"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Background Image URL
              </label>
              <input
                type="url"
                value={roomSettings.backgroundImage}
                onChange={(e) => updateRoomSettings({ backgroundImage: e.target.value })}
                placeholder="https://example.com/image.jpg"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Room Presets Section */}
          <div className="mt-6 p-4 bg-blue-50 rounded-md">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium text-blue-800">Room Presets</h3>
              <button
                onClick={resetToDefault}
                className="px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                Reset to Default
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {roomPresets.map((preset) => (
                <div
                  key={preset.id}
                  className="bg-white rounded-lg border border-blue-200 overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => applyRoomPreset(preset.id)}
                >
                  <div 
                    className="h-16 bg-cover bg-center"
                    style={{ 
                      backgroundImage: `url(${preset.backgroundImage})`,
                      backgroundColor: preset.primaryColor 
                    }}
                  />
                  <div className="p-3">
                    <h4 className="font-medium text-sm text-gray-800">{preset.name}</h4>
                    <p className="text-xs text-gray-600 mt-1">{preset.description}</p>
                    <div className="flex items-center justify-between mt-2">
                      <span 
                        className="w-4 h-4 rounded-full border border-gray-300"
                        style={{ backgroundColor: preset.primaryColor }}
                      />
                      <span className="text-xs text-gray-500">{preset.maxBots} bots max</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Legacy Quick Settings for backward compatibility */}
          <div className="mt-4 p-3 bg-gray-50 rounded-md">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Quick Theme Updates</h3>
            <div className="flex flex-wrap gap-2">
              {[
                { name: 'Medieval Tavern', setting: 'A bustling medieval tavern with adventurers sharing tales', context: 'Bots should speak in a fantasy medieval style, discussing quests, magic, and adventures.' },
                { name: 'Corporate Meeting', setting: 'A professional corporate meeting room', context: 'Bots should maintain professional demeanor, discuss business topics, and use corporate language.' },
                { name: 'Cozy Coffee Shop', setting: 'A warm, inviting coffee shop with comfortable seating', context: 'Bots should be casual and friendly, discussing everyday topics over coffee.' },
                { name: 'Sci-Fi Station', setting: 'A futuristic space station orbiting a distant planet', context: 'Bots should discuss technology, space exploration, and futuristic concepts.' },
              ].map((preset) => (
                <button
                  key={preset.name}
                  onClick={() => updateRoomSettings({ 
                    setting: preset.setting, 
                    context: preset.context 
                  })}
                  className="px-3 py-1 text-xs bg-gray-100 text-gray-600 rounded hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
                >
                  {preset.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
