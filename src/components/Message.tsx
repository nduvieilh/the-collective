import React from 'react';
import type { Message as MessageType } from '../types';

interface MessageProps {
  message: MessageType;
}

export const Message: React.FC<MessageProps> = ({ message }) => {
  const isBot = message.senderType === 'bot';
  const timestamp = message.timestamp.toLocaleTimeString([], { 
    hour: '2-digit', 
    minute: '2-digit' 
  });

  return (
    <div className={`flex ${isBot ? 'justify-start' : 'justify-end'} mb-4`}>
      <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
        isBot 
          ? 'bg-gray-200 text-gray-800' 
          : 'bg-blue-500 text-white'
      }`}>
        <div className="flex items-center justify-between mb-1">
          <span className={`text-sm font-semibold ${
            isBot ? 'text-gray-600' : 'text-blue-100'
          }`}>
            {message.sender}
          </span>
          <span className={`text-xs ${
            isBot ? 'text-gray-500' : 'text-blue-200'
          }`}>
            {timestamp}
          </span>
        </div>
        <p className="text-sm whitespace-pre-wrap">{message.content}</p>
      </div>
    </div>
  );
};
