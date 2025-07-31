import { useState } from 'react';
import { useChat } from './hooks/useChat';
import { useRoom, useBots } from './contexts/AppContext';
import { BedrockConfig } from './components/BedrockConfig';
import { RoomSettings } from './components/RoomSettings';
import { ChatMessages } from './components/ChatMessages';
import { MessageInput } from './components/MessageInput';
import { BotConfig } from './components/BotConfig';
import './App.css';

function App() {
  const [isBedrockConfigured, setIsBedrockConfigured] = useState(false);
  const [showBotConfig, setShowBotConfig] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  
  const { messages, isLoading, error, sendMessage, clearMessages, clearError } = useChat();
  const { roomSettings } = useRoom();
  const { bots, getActiveBots } = useBots();

  const handleBedrockConfigured = () => {
    setIsBedrockConfigured(true);
  };

  const handleSendMessage = (content: string) => {
    const activeBots = getActiveBots();
    sendMessage(content, activeBots, roomSettings);
  };

  const activeBots = getActiveBots();

  return (
    <div 
      className="app-container h-screen flex flex-col relative overflow-hidden"
      style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url(${roomSettings.backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}
    >
      {/* Settings Overlay */}
      {showSettings && (
        <div className="absolute inset-0 bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Settings</h2>
                <button
                  onClick={() => setShowSettings(false)}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ×
                </button>
              </div>
              <BedrockConfig onConfigured={handleBedrockConfigured} />
              <div className="mt-6">
                <RoomSettings onClearMessages={clearMessages} />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main UI Container - Centered and Smaller */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-4xl h-full max-h-[800px] flex flex-col glass-panel-strong rounded-3xl mobile-full-width fade-in">
          
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-white border-opacity-30">
            <div className="flex items-center space-x-4">
              <h1 
                className="text-3xl font-bold text-shadow-strong"
                style={{ color: roomSettings.primaryColor }}
              >
                {roomSettings.name}
              </h1>
              <div className="flex items-center space-x-2">
                {activeBots.map((bot, index) => (
                  <div
                    key={bot.id}
                    className="flex items-center justify-center w-10 h-10 rounded-full text-white font-semibold text-sm shadow-lg"
                    style={{ backgroundColor: roomSettings.primaryColor }}
                    title={bot.name}
                  >
                    {bot.name.charAt(0).toUpperCase()}
                  </div>
                ))}
                <button
                  onClick={() => setShowBotConfig(!showBotConfig)}
                  className="flex items-center justify-center w-10 h-10 rounded-full bg-white bg-opacity-20 text-white hover:bg-opacity-30 transition-all duration-200 shadow-lg btn-hover-lift focus-ring"
                  title="Configure bots"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </button>
              </div>
            </div>
            
            <button
              onClick={() => setShowSettings(true)}
              className="flex items-center justify-center w-10 h-10 rounded-full bg-white bg-opacity-20 text-white hover:bg-opacity-30 transition-all duration-200 shadow-lg btn-hover-lift focus-ring"
              title="Settings"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>
          </div>

          {/* Chat Area */}
          <div className="flex-1 flex overflow-hidden">
            <div className="flex-1 flex flex-col">
              {/* Error Display */}
              {error && (
                <div className="mx-6 mt-4 bg-red-500 bg-opacity-90 text-white p-4 rounded-lg shadow-lg">
                  <div className="flex items-center justify-between">
                    <p className="text-sm">{error}</p>
                    <button
                      onClick={clearError}
                      className="text-white hover:text-red-200 ml-4"
                    >
                      ×
                    </button>
                  </div>
                </div>
              )}

              {/* Messages - More opaque background */}
              <div className="flex-1 overflow-hidden bg-opacity-20 backdrop-blur-sm m-4 rounded-2xl">
                <ChatMessages messages={messages} isLoading={isLoading} />
              </div>

              {/* Message Input */}
              <div className="p-6">
                <MessageInput
                  onSendMessage={handleSendMessage}
                  isLoading={isLoading}
                  disabled={!isBedrockConfigured}
                />
              </div>
            </div>

            {/* Bot Configuration Sidebar */}
            {showBotConfig && (
              <div className="w-80 border-l overflow-y-auto border-white border-opacity-30 glass-panel slide-in-right mobile-hide">
                <BotConfig />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
