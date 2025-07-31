import React, { useState } from 'react';
import { useBots } from '../contexts/AppContext';

export const BotConfig: React.FC = () => {
  const { bots, botTemplates, updateBot, addBot, addBotFromTemplate, removeBot } = useBots();
  const [isAddingBot, setIsAddingBot] = useState(false);
  const [newBot, setNewBot] = useState({
    name: '',
    personality: '',
    systemPrompt: '',
    isActive: true,
  });

  const handleAddBot = () => {
    if (newBot.name.trim() && newBot.personality.trim()) {
      addBot(newBot);
      setNewBot({
        name: '',
        personality: '',
        systemPrompt: '',
        isActive: true,
      });
      setIsAddingBot(false);
    }
  };

  return (
    <div className="w-80 bg-gray-50 border-l border-gray-200 p-4 overflow-y-auto">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Bot Configuration</h2>
        
        <div className="space-y-4">
          {bots.map((bot) => (
            <div key={bot.id} className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={bot.isActive}
                    onChange={(e) => updateBot(bot.id, { isActive: e.target.checked })}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <input
                    type="text"
                    value={bot.name}
                    onChange={(e) => updateBot(bot.id, { name: e.target.value })}
                    className="font-medium text-gray-800 bg-transparent border-none focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-1"
                  />
                </div>
                <button
                  onClick={() => removeBot(bot.id)}
                  className="text-red-500 hover:text-red-700 text-sm"
                  title="Remove bot"
                >
                  ✕
                </button>
              </div>
              
              <div className="space-y-2">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Personality
                  </label>
                  <textarea
                    value={bot.personality}
                    onChange={(e) => updateBot(bot.id, { personality: e.target.value })}
                    className="w-full text-sm p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={2}
                    placeholder="Describe the bot's personality..."
                  />
                </div>
                
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    System Prompt
                  </label>
                  <textarea
                    value={bot.systemPrompt}
                    onChange={(e) => updateBot(bot.id, { systemPrompt: e.target.value })}
                    className="w-full text-sm p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={3}
                    placeholder="System instructions for the bot..."
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {isAddingBot ? (
          <div className="mt-4 bg-white rounded-lg p-4 border border-gray-200">
            <h3 className="font-medium text-gray-800 mb-3">Add New Bot</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  value={newBot.name}
                  onChange={(e) => setNewBot({ ...newBot, name: e.target.value })}
                  className="w-full text-sm p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Bot name..."
                />
              </div>
              
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Personality
                </label>
                <textarea
                  value={newBot.personality}
                  onChange={(e) => setNewBot({ ...newBot, personality: e.target.value })}
                  className="w-full text-sm p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={2}
                  placeholder="Describe the bot's personality..."
                />
              </div>
              
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  System Prompt
                </label>
                <textarea
                  value={newBot.systemPrompt}
                  onChange={(e) => setNewBot({ ...newBot, systemPrompt: e.target.value })}
                  className="w-full text-sm p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  placeholder="System instructions for the bot..."
                />
              </div>
              
              <div className="flex space-x-2">
                <button
                  onClick={handleAddBot}
                  disabled={!newBot.name.trim() || !newBot.personality.trim()}
                  className="flex-1 px-3 py-2 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Add Bot
                </button>
                <button
                  onClick={() => setIsAddingBot(false)}
                  className="flex-1 px-3 py-2 bg-gray-300 text-gray-700 text-sm rounded hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setIsAddingBot(true)}
            className="mt-4 w-full px-4 py-2 bg-green-500 text-white text-sm rounded hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            + Add New Bot
          </button>
        )}
      </div>
    </div>
  );
};
