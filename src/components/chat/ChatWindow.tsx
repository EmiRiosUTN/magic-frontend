import React from 'react';
import { Agent, Chat } from '../../types';
import { MessageList } from './MessageList';
import { MessageInput } from './MessageInput';
import { Spinner } from '../ui/spinner';

import { useAuth } from '../../contexts/AuthContext';
import { AlertCircle } from 'lucide-react';

interface ChatWindowProps {
  agent: Agent;
  chat: Chat | null;
  onSendMessage: (message: string) => void;
  isLoading: boolean;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({
  chat,
  onSendMessage,
  isLoading,
}) => {
  const { user } = useAuth();
  const GLOBAL_LIMIT = 30;
  const isLimitReached = (user?.messageCount || 0) >= GLOBAL_LIMIT;

  return (
    <div className="flex-1 flex flex-col bg-gradient-to-br from-[#161616] to-grafite relative overflow-hidden">

      <MessageList messages={chat?.messages || []} />

      {isLimitReached ? (
        <div className="p-4">
          <div className="max-w-4xl mx-auto bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex items-center gap-3 text-red-200">
            <AlertCircle size={20} className="text-red-400 shrink-0" />
            <p className="font-medium">Has alcanzado el límite de {GLOBAL_LIMIT} consultas permitidas</p>
          </div>
        </div>
      ) : (
        <MessageInput onSendMessage={onSendMessage} disabled={isLoading} />
      )}

      {isLoading && (
        <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 bg-grafite px-4 py-2 rounded-full shadow-lg border border-haze/30">
          <div className="flex items-center gap-2">
            <Spinner className="h-4 w-4 text-copper" />
            <span className="text-sm text-oyster ml-2">Pensando...</span>
          </div>
        </div>
      )}
    </div>
  );
};
