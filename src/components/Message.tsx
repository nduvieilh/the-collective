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
      <div className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl backdrop-blur-sm border shadow-lg ${
        isBot 
          ? 'bg-white bg-opacity-20 border-white border-opacity-30 text-white' 
          : 'border-white border-opacity-40 text-white'
      }`}
      style={!isBot ? { 
        backgroundColor: `${roomSettings.primaryColor}80`, // 50% opacity
        borderColor: roomSettings.primaryColor 
      } : {}}
      >
        <div className="flex items-center justify-between mb-1">
          <span className={`text-sm font-semibold ${
            isBot ? 'text-white text-opacity-90' : 'text-white'
          }`}>
            {message.sender}
          </span>
          <span className={`text-xs ${
            isBot ? 'text-white text-opacity-70' : 'text-white text-opacity-80'
          }`}>
            {timestamp}
          </span>
        </div>
        <p className="text-sm whitespace-pre-wrap leading-relaxed">{message.content}</p>
      </div>
    </div>
  );
};
