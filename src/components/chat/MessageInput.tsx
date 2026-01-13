import React, { useState, useRef, useEffect } from 'react';
import { Send } from 'lucide-react';
import { IconButton } from '../ui/IconButton';

interface MessageInputProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
}

export const MessageInput: React.FC<MessageInputProps> = ({ onSendMessage, disabled }) => {
  const [message, setMessage] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [message]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !disabled) {
      onSendMessage(message.trim());
      setMessage('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter') {
      if (e.shiftKey) {
        // Handle auto-bullet functionality
        const target = e.target as HTMLTextAreaElement;
        const { value, selectionStart, selectionEnd } = target;

        // Get text before cursor
        const textBeforeCursor = value.substring(0, selectionStart);
        // Get curren line content
        const currentLineStart = textBeforeCursor.lastIndexOf('\n') + 1;
        const currentLine = textBeforeCursor.substring(currentLineStart);

        // Check for bullet patterns: "- ", "* ", or "1. "
        const bulletMatch = currentLine.match(/^(\s*)([-*]|\d+\.)\s/);

        if (bulletMatch) {
          // If the line is empty (just the bullet), clear it
          if (currentLine.trim() === bulletMatch[0].trim()) {
            e.preventDefault();
            const newValue = value.substring(0, currentLineStart) + value.substring(selectionEnd);
            setMessage(newValue);
            // We need to set cursor position after render, but simplistic approach first
            setTimeout(() => {
              if (textareaRef.current) {
                textareaRef.current.selectionStart = textareaRef.current.selectionEnd = currentLineStart;
              }
            }, 0);
            return;
          }

          // Otherwise, continue the list
          e.preventDefault();
          const nextBullet = bulletMatch[2].match(/\d+\./)
            ? `${parseInt(bulletMatch[2]) + 1}. `
            : bulletMatch[0];

          const newValue =
            value.substring(0, selectionStart) +
            '\n' + (bulletMatch[1] + nextBullet) +
            value.substring(selectionEnd);

          setMessage(newValue);

          const newCursorPos = selectionStart + 1 + bulletMatch[1].length + nextBullet.length;
          setTimeout(() => {
            if (textareaRef.current) {
              textareaRef.current.selectionStart = textareaRef.current.selectionEnd = newCursorPos;
            }
          }, 0);
        }
      } else {
        // Send message on simple Enter
        e.preventDefault();
        handleSubmit(e);
      }
    }
  };

  return (
    <div className="p-4 bg-transparent">
      <form onSubmit={handleSubmit} className="max-w-4xl mx-auto relative">
        <div className="bg-white rounded-xl shadow-lg border-0 ring-1 ring-slate-100 flex items-end p-2 gap-2 transition-shadow hover:shadow-xl focus-within:shadow-xl focus-within:ring-slate-200">
          <textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Envía un mensaje..."
            disabled={disabled}
            rows={1}
            className="flex-1 resize-none py-3 pl-2 bg-transparent border-0 text-slate-700 placeholder:text-slate-400 focus:ring-0 focus:outline-0 max-h-32 text-base leading-relaxed"
            style={{ minHeight: '52px' }}
          />
          <div className="pb-1 pr-1">
            <IconButton
              icon={<Send size={20} className="stroke-[2.5px]" />}
              type="submit"
              disabled={!message.trim() || disabled}
              label="Send message"
              className="bg-blue-600 text-white hover:bg-blue-500 disabled:bg-slate-200 disabled:text-slate-400 rounded-xl w-10 h-10 flex items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95 shadow-md hover:shadow-lg disabled:shadow-none disabled:scale-100"
            />
          </div>
        </div>
      </form>
    </div>
  );
};
