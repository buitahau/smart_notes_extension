import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Note } from '@services/note-service';
import type { AsyncQueryStatus } from '@services/async-query-service';

export interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: string;
  notes?: Note[];
  intent?: string;
  queryId?: string;
  queryStatus?: AsyncQueryStatus;
}

interface ChatContextType {
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  addMessage: (message: Message) => void;
  clearMessages: () => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const useChat = () => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};

interface ChatProviderProps {
  children: ReactNode;
}

export const ChatProvider: React.FC<ChatProviderProps> = ({ children }) => {
  const [messages, setMessages] = useState<Message[]>([]);

  const addMessage = (message: Message) => {
    setMessages((prev) => [...prev, message]);
  };

  const clearMessages = () => {
    setMessages([]);
  };

  const value: ChatContextType = {
    messages,
    setMessages,
    addMessage,
    clearMessages,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};
