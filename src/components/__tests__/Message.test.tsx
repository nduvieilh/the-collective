import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Message } from '../Message';
import type { Message as MessageType } from '../../types';

describe('Message Component', () => {
  const mockHumanMessage: MessageType = {
    id: '1',
    content: 'Hello, this is a test message',
    sender: 'Human',
    senderType: 'human',
    timestamp: new Date('2024-01-01T12:00:00Z'),
  };

  const mockBotMessage: MessageType = {
    id: '2',
    content: 'Hello! Nice to meet you.',
    sender: 'Alex',
    senderType: 'bot',
    timestamp: new Date('2024-01-01T12:01:00Z'),
    botId: 'bot-1',
  };

  it('renders human message correctly', () => {
    render(<Message message={mockHumanMessage} />);
    
    expect(screen.getByText('Hello, this is a test message')).toBeInTheDocument();
    expect(screen.getByText('Human')).toBeInTheDocument();
    expect(screen.getByText('06:00 AM')).toBeInTheDocument();
  });

  it('renders bot message correctly', () => {
    render(<Message message={mockBotMessage} />);
    
    expect(screen.getByText('Hello! Nice to meet you.')).toBeInTheDocument();
    expect(screen.getByText('Alex')).toBeInTheDocument();
    expect(screen.getByText('06:01 AM')).toBeInTheDocument();
  });

  it('applies correct styling for human messages', () => {
    render(<Message message={mockHumanMessage} />);
    
    const messageContainer = screen.getByText('Hello, this is a test message').closest('div');
    expect(messageContainer).toHaveClass('bg-blue-500', 'text-white');
  });

  it('applies correct styling for bot messages', () => {
    render(<Message message={mockBotMessage} />);
    
    const messageContainer = screen.getByText('Hello! Nice to meet you.').closest('div');
    expect(messageContainer).toHaveClass('bg-gray-200', 'text-gray-800');
  });

  it('positions human messages on the right', () => {
    render(<Message message={mockHumanMessage} />);
    
    const outerContainer = screen.getByText('Hello, this is a test message').closest('div')?.parentElement;
    expect(outerContainer).toHaveClass('justify-end');
  });

  it('positions bot messages on the left', () => {
    render(<Message message={mockBotMessage} />);
    
    const outerContainer = screen.getByText('Hello! Nice to meet you.').closest('div')?.parentElement;
    expect(outerContainer).toHaveClass('justify-start');
  });
});
