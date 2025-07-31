import React, { useEffect, useRef } from 'react';
import { Message } from './Message';
import type { Message as MessageType } from '../types';

interface ChatMessagesProps {
  messages: MessageType[];
  isLoading: boolean;
}

export const ChatMessages: React.FC<ChatMessagesProps> = ({ messages, isLoading }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
      {messages.length === 0 ? (
        <div className="flex items-center justify-center h-full">
          <div className="text-center glass-panel rounded-2xl p-8 fade-in">
            <p className="text-xl mb-2 text-white font-semibold text-shadow-strong">Welcome to The Collective!</p>
            <p className="text-sm text-white text-opacity-90 text-shadow-medium">Start a conversation with the AI bots by typing a message below.</p>
          </div>
        </div>
      ) : (
        <>
          {messages.map((message) => (
            <Message key={message.id} message={message} />
          ))}
          {isLoading && (
            <div className="flex justify-start mb-4">
              <div className="max-w-xs lg:max-w-md px-4 py-3 rounded-2xl glass-panel fade-in">
                <div className="flex items-center space-x-3">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-white rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                  <span className="text-sm text-white font-medium text-shadow-light">Bots are thinking...</span>
                </div>
              </div>
            </div>
          )}
        </>
      )}
      <div ref={messagesEndRef} />
    </div>
  );
};
