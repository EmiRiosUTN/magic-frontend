import { Chat, ApiKeys, Message } from '../types';

const STORAGE_KEYS = {
  CHATS: 'ai-agents-chats',
  API_KEYS: 'ai-agents-api-keys',
  ACTIVE_CHAT: 'ai-agents-active-chat',
};

export const storage = {
  // Chats
  getChats(): Chat[] {
    const data = localStorage.getItem(STORAGE_KEYS.CHATS);
    return data ? JSON.parse(data) : [];
  },

  saveChat(chat: Chat): void {
    const chats = this.getChats();
    const index = chats.findIndex(c => c.id === chat.id);

    if (index >= 0) {
      chats[index] = chat;
    } else {
      chats.push(chat);
    }

    localStorage.setItem(STORAGE_KEYS.CHATS, JSON.stringify(chats));
  },

  deleteChat(chatId: string): void {
    const chats = this.getChats().filter(c => c.id !== chatId);
    localStorage.setItem(STORAGE_KEYS.CHATS, JSON.stringify(chats));
  },

  getChatsByAgent(agentId: string): Chat[] {
    return this.getChats().filter(c => c.agentId === agentId);
  },

  getChat(chatId: string): Chat | undefined {
    return this.getChats().find(c => c.id === chatId);
  },

  // API Keys
  getApiKeys(): ApiKeys {
    const data = localStorage.getItem(STORAGE_KEYS.API_KEYS);
    return data ? JSON.parse(data) : { openai: '', gemini: '' };
  },

  saveApiKeys(keys: ApiKeys): void {
    localStorage.setItem(STORAGE_KEYS.API_KEYS, JSON.stringify(keys));
  },

  // Active Chat
  getActiveChat(): string | null {
    return localStorage.getItem(STORAGE_KEYS.ACTIVE_CHAT);
  },

  setActiveChat(chatId: string): void {
    localStorage.setItem(STORAGE_KEYS.ACTIVE_CHAT, chatId);
  },

  clearActiveChat(): void {
    localStorage.removeItem(STORAGE_KEYS.ACTIVE_CHAT);
  },
};

export const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

export const createNewChat = (agentId: string): Chat => {
  return {
    id: generateId(),
    agentId,
    messages: [],
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
};

export const addMessageToChat = (chat: Chat, message: Omit<Message, 'id'>): Chat => {
  return {
    ...chat,
    messages: [
      ...chat.messages,
      {
        ...message,
        id: generateId(),
      },
    ],
    updatedAt: Date.now(),
  };
};
