import React from 'react';
import { useRoom } from '../contexts/AppContext';
import type { Message as MessageType } from '../types';

interface MessageProps {
  message: MessageType;
}

export const Message: React.FC<MessageProps> = ({ message }) => {
  const { roomSettings } = useRoom();
  const isBot = message.senderType === 'bot';
  const timestamp = message.timestamp.toLocaleTimeString([], { 
    hour: '2-digit', 
    minute: '2-digit' 
  });

  return (
    <div className={`flex ${isBot ? 'justify-start' : 'justify-end'} mb-4`}>
      <div className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl shadow-lg fade-in ${
        isBot 
          ? 'glass-panel text-white' 
          : 'border-white border-opacity-40 text-white'
      }`}
      style={!isBot ? { 
        backgroundColor: `${roomSettings.primaryColor}40`, // 25% opacity for glass effect
        borderColor: `${roomSettings.primaryColor}80`,
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.2)'
      } : {}}
      >
        <div className="flex items-center justify-between mb-1">
          <span className="text-sm font-semibold text-white text-shadow-medium">
            {message.sender}
          </span>
          <span className="text-xs text-white text-opacity-80 text-shadow-light">
            {timestamp}
          </span>
        </div>
        <p className="text-sm whitespace-pre-wrap leading-relaxed text-white text-shadow-light">{message.content}</p>
      </div>
    </div>
  );
};
