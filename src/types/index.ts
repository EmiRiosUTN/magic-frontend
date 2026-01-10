export type UserRole = 'ADMIN' | 'USER';
export type Language = 'ES' | 'EN';
export type AIProvider = 'OPENAI' | 'GEMINI';
export type MessageRole = 'USER' | 'ASSISTANT' | 'SYSTEM';

export interface SubscriptionType {
  id: string;
  name: string;
  maxConversationsPerAgent: number;
  maxMessagesPerConversation: number;
}

export interface User {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  onboardingCompleted: boolean;
  subscriptionType: SubscriptionType;
  language?: Language;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  icon: string;
  displayOrder: number;
  agentCount?: number;
  color: string;
}

export interface Agent {
  id: string;
  name: string;
  description: string;
  aiProvider: AIProvider;
  modelName?: string;
  hasTools: boolean;
  categoryId?: string;
  category?: {
    id: string;
    name: string;
  };
  icon?: string;
  model?: 'openai' | 'gemini';
}

export interface Conversation {
  id: string;
  title: string;
  messageCount: number;
  lastMessageAt: string;
  createdAt: string;
  agent: {
    id: string;
    nameEs: string;
    nameEn: string;
  };
}

export interface Message {
  id: string;
  role: MessageRole;
  content: string;
  createdAt: string;
  timestamp?: number;
}

export interface Chat {
  id: string;
  agentId: string;
  messages: Message[];
  createdAt: number;
  updatedAt: number;
}

export interface CreateConversationResponse {
  id?: string;
  title?: string;
  agentId?: string;
  createdAt?: string;
  requiresConfirmation?: boolean;
  warning?: string;
  oldestConversation?: {
    id: string;
    title: string;
  };
}

export interface SendMessageResponse {
  userMessage: Message;
  assistantMessage: Message;
}
