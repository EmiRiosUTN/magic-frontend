import React, { useState, useRef, useEffect } from 'react';
import { Send, Paperclip, X } from 'lucide-react';
import { IconButton } from '../ui/IconButton';

interface MessageInputProps {
  onSendMessage: (message: string, file?: File) => void;
  disabled?: boolean;
}

export const MessageInput: React.FC<MessageInputProps> = ({ onSendMessage, disabled }) => {
  const [message, setMessage] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [message]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if ((message.trim() || file) && !disabled) {
      onSendMessage(message.trim(), file || undefined);
      setMessage('');
      setFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
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
        {file && (
          <div className="mb-2 px-4">
            <div className="inline-flex items-center gap-2 bg-white/10 p-2 rounded-lg border border-white/10 text-oyster">
              <span className="text-sm truncate max-w-[200px]">{file.name}</span>
              <button
                type="button"
                onClick={() => {
                  setFile(null);
                  if (fileInputRef.current) fileInputRef.current.value = '';
                }}
                className="hover:text-red-400 transition-colors"
              >
                <X size={16} />
              </button>
            </div>
          </div>
        )}
        <div className="bg-smoke rounded-xl shadow-lg border-0 ring-1 ring-haze/30 flex items-end p-2 gap-2 transition-shadow hover:shadow-xl focus-within:shadow-xl focus-within:ring-copper/50">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            className="hidden"
            accept="image/*,video/*"
          />
          <div className="pb-1 pl-1">
            <IconButton
              icon={<Paperclip size={20} className="stroke-[2.5px]" />}
              onClick={() => fileInputRef.current?.click()}
              disabled={disabled}
              label="Attach file"
              className="text-oyster hover:text-copper hover:bg-haze/10 rounded-xl w-10 h-10 flex items-center justify-center transition-all duration-200"
            />
          </div>
          <textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Envía un mensaje..."
            disabled={disabled}
            rows={1}
            className="flex-1 resize-none py-3 pl-2 bg-transparent border-0 text-oyster placeholder:text-nevada focus:ring-0 focus:outline-0 max-h-32 text-base leading-relaxed"
            style={{ minHeight: '52px' }}
          />
          <div className="pb-1 pr-1">
            <IconButton
              icon={<Send size={20} className="stroke-[2.5px]" />}
              type="submit"
              disabled={(!message.trim() && !file) || disabled}
              label="Send message"
              className="bg-copper text-grafite hover:bg-copper/90 disabled:bg-haze/30 disabled:text-haze rounded-xl w-10 h-10 flex items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95 shadow-md hover:shadow-lg disabled:shadow-none disabled:scale-100"
            />
          </div>
        </div>
      </form>
    </div>
  );
};
