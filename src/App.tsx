import { useState } from 'react';
import { useChat } from './hooks/useChat';
import { BedrockConfig } from './components/BedrockConfig';
import { RoomSettings } from './components/RoomSettings';
import { ChatMessages } from './components/ChatMessages';
import { MessageInput } from './components/MessageInput';
import { BotConfig } from './components/BotConfig';

function App() {
  const [isBedrockConfigured, setIsBedrockConfigured] = useState(false);
  const [showBotConfig, setShowBotConfig] = useState(false);
  
  const {
    messages,
    bots,
    roomSettings,
    isLoading,
    error,
    sendMessage,
    updateBot,
    addBot,
    removeBot,
    updateRoomSettings,
    clearMessages,
    clearError,
  } = useChat();

  const handleBedrockConfigured = () => {
    setIsBedrockConfigured(true);
  };

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <BedrockConfig onConfigured={handleBedrockConfigured} />
        <RoomSettings
          roomSettings={roomSettings}
          onUpdateRoomSettings={updateRoomSettings}
          onClearMessages={clearMessages}
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
          {/* Error Display */}
          {error && (
            <div className="bg-red-50 border-l-4 border-red-400 p-4 m-4">
              <div className="flex items-center justify-between">
                <div className="flex">
                  <div className="ml-3">
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                </div>
                <button
                  onClick={clearError}
                  className="text-red-400 hover:text-red-600"
                >
                  ✕
                </button>
              </div>
            </div>
          )}

          {/* Messages */}
          <ChatMessages messages={messages} isLoading={isLoading} />

          {/* Message Input */}
          <MessageInput
            onSendMessage={sendMessage}
            isLoading={isLoading}
            disabled={!isBedrockConfigured}
          />
        </div>

        {/* Bot Configuration Sidebar */}
        {showBotConfig && (
          <BotConfig
            bots={bots}
            onUpdateBot={updateBot}
            onAddBot={addBot}
            onRemoveBot={removeBot}
          />
        )}
      </div>

      {/* Bot Config Toggle */}
      <button
        onClick={() => setShowBotConfig(!showBotConfig)}
        className="fixed bottom-4 right-4 bg-blue-500 text-white p-3 rounded-full shadow-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
        title={showBotConfig ? 'Hide bot configuration' : 'Show bot configuration'}
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
      </button>

      {/* Active Bots Indicator */}
      <div className="fixed bottom-4 left-4 bg-white rounded-lg shadow-lg p-3">
        <div className="text-sm text-gray-600 mb-1">Active Bots:</div>
        <div className="flex flex-wrap gap-1">
          {bots
            .filter(bot => bot.isActive)
            .map(bot => (
              <span
                key={bot.id}
                className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800"
              >
                {bot.name}
              </span>
            ))}
          {bots.filter(bot => bot.isActive).length === 0 && (
            <span className="text-xs text-gray-500">No active bots</span>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
