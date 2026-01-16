import React from 'react';
import { Agent, Chat } from '../../types';
import { MessageList } from './MessageList';
import { MessageInput } from './MessageInput';
import { Spinner } from '../ui/spinner';

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
  return (
    <div className="flex-1 flex flex-col bg-grafite relative overflow-hidden">

      <MessageList messages={chat?.messages || []} />

      <MessageInput onSendMessage={onSendMessage} disabled={isLoading} />

      {isLoading && (
        <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 bg-smoke px-4 py-2 rounded-full shadow-lg border border-haze/30">
          <div className="flex items-center gap-2">
            <Spinner className="h-4 w-4 text-copper" />
            <span className="text-sm text-oyster ml-2">Pensando...</span>
          </div>
        </div>
      )}
    </div>
  );
};
