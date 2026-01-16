import React from 'react';
import { Message } from '../../types';
import { User, Bot } from 'lucide-react';

interface MessageBubbleProps {
  message: Message;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  // Force lowercase check to avoid case sensitivity issues with the enum
  const isUser = message.role.toLowerCase() === 'user';

  return (
    <div className={`flex gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
      <div
        className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${isUser ? 'bg-copper' : 'bg-smoke'
          }`}
      >
        {isUser ? (
          <User size={16} className="text-grafite" />
        ) : (
          <Bot size={16} className="text-oyster" />
        )}
      </div>

      <div
        className={`flex flex-col max-w-[75%] ${isUser ? 'items-end' : 'items-start'
          }`}
      >
        <div
          className={`px-4 py-3 rounded-2xl ${isUser
            ? 'bg-copper text-grafite'
            : 'bg-smoke text-oyster'
            }`}
        >
          <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
        </div>
        <span className="text-xs text-haze mt-1 px-2 block">
          {new Date(message.timestamp ?? Date.now()).toLocaleTimeString('es-ES', {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </span>
      </div>
    </div>
  );
};
