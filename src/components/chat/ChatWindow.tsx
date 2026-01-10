import React from 'react';
import { Agent, Chat } from '../../types';
import { MessageList } from './MessageList';
import { MessageInput } from './MessageInput';
import * as Icons from 'lucide-react';

interface ChatWindowProps {
  agent: Agent;
  chat: Chat | null;
  onSendMessage: (message: string) => void;
  isLoading: boolean;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({
  agent,
  chat,
  onSendMessage,
  isLoading,
}) => {
  const Icon = Icons[agent.icon as keyof typeof Icons] as React.ComponentType<{ size?: number; className?: string }>;

  return (
    <div className="flex-1 flex flex-col bg-slate-50 relative">
      <div className="bg-white border-b border-slate-200 px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-slate-100 rounded-lg">
            {Icon && <Icon size={20} className="text-slate-700" />}
          </div>
          <div>
            <h2 className="text-lg font-semibold text-slate-900">{agent.name}</h2>
            <p className="text-xs text-slate-600">{agent.description}</p>
          </div>
        </div>
      </div>

      <MessageList messages={chat?.messages || []} />

      <MessageInput onSendMessage={onSendMessage} disabled={isLoading} />

      {isLoading && (
        <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 bg-white px-4 py-2 rounded-full shadow-lg border border-slate-200">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
            <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
            <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            <span className="text-sm text-slate-600 ml-2">Pensando...</span>
          </div>
        </div>
      )}
    </div>
  );
};
