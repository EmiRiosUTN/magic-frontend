import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Message } from '../../types';
import { User, Bot, PlayCircle } from 'lucide-react';
import { MediaModal } from './MediaModal';

interface MessageBubbleProps {
  message: Message;
}

// Extracted component to avoid re-creation on every render
const ImageRenderer: React.FC<any> = ({ node, ...props }) => {
  const [imgError, setImgError] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const isVideo = props.src && (/\.(mp4|webm|mov)$/i.test(props.src) || props.src.endsWith('#.mp4'));

  if (imgError) {
    return (
      <span className="block p-4 bg-smoke rounded-lg border border-white/10 flex items-center gap-3 text-oyster">
        <span className="w-8 h-8 rounded-full bg-grafite flex items-center justify-center">
          <span className="text-xs">⚠️</span>
        </span>
        <span className="flex flex-col">
          <span className="text-sm font-medium text-swirl">No se pudo cargar {isVideo ? 'el video' : 'la imagen'}</span>
          <span className="text-xs text-haze truncate max-w-[200px]">{props.alt || 'Archivo desconocido'}</span>
        </span>
      </span>
    );
  }

  return (
    <>
      <div
        onClick={() => setIsOpen(true)}
        className="relative cursor-pointer group inline-block"
      >
        {isVideo ? (
          <div className="relative rounded-lg overflow-hidden bg-black/20 border border-white/10 max-h-60 flex items-center justify-center min-w-[200px] min-h-[150px]">
            <video
              src={props.src}
              className="max-h-60 object-contain opacity-80 group-hover:opacity-60 transition-opacity"
              muted
              preload="metadata"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <PlayCircle size={48} className="text-white/80 drop-shadow-lg group-hover:scale-110 transition-transform" />
            </div>
          </div>
        ) : (
          /* eslint-disable-next-line jsx-a11y/alt-text */
          <img
            {...props}
            className="rounded-lg hover:opacity-80 transition-opacity max-h-60 object-contain bg-black/20"
            onError={() => setImgError(true)}
          />
        )}
      </div>
      <MediaModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        src={props.src || ''}
        type={isVideo ? 'video' : 'image'}
        alt={props.alt}
      />
    </>
  );
};

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const isUser = message.role.toLowerCase() === 'user';

  const isVideoUrl = (url: string) => {
    return /\.(mp4|webm|mov)$/i.test(url) || url.endsWith('#.mp4');
  };

  return (
    <>
      <div className={`flex gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
        <div
          className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${isUser ? 'bg-smoke' : 'bg-grafite'
            }`}
        >
          {isUser ? (
            <User size={16} className="text-oyster" />
          ) : (
            <Bot size={16} className="text-oyster" />
          )}
        </div>

        <div
          className={`flex flex-col max-w-[75%] ${isUser ? 'items-end' : 'items-start'
            }`}
        >
          <div
            className={`text-oyster ${isUser
              ? 'px-4 py-3 rounded-2xl bg-smoke'
              : 'bg-transparent'
              }`}
          >
            {isUser ? (
              <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
            ) : (
              <div className="text-sm leading-relaxed prose prose-invert prose-sm max-w-none markdown-content">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    img: ImageRenderer, // Use stable component
                    a: ({ node, href, children, ...props }) => {
                      if (href && isVideoUrl(href)) {
                        return (
                          <div
                            className="relative group cursor-pointer inline-block"
                            onClick={(e) => {
                              // Video handling temporarily disabled or needs refactoring
                              e.preventDefault();
                              window.open(href, '_blank');
                            }}
                          >
                            <div className="flex items-center gap-2 p-2 bg-black/20 rounded-lg hover:bg-black/30 transition-colors border border-white/10">
                              <PlayCircle size={20} className="text-swirl" />
                              <span className="text-swirl font-medium underline decoration-1 underline-offset-4">
                                {children}
                              </span>
                            </div>
                          </div>
                        );
                      }
                      return (
                        <a href={href} target="_blank" rel="noopener noreferrer" className="text-swirl underline" {...props}>
                          {children}
                        </a>
                      );
                    }
                  }}
                >
                  {message.content}
                </ReactMarkdown>
              </div>
            )}
          </div>
          <span className="text-xs text-haze mt-1 px-2 block">
            {new Date(message.createdAt).toLocaleTimeString('es-ES', {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </span>
        </div>
      </div>
    </>
  );
};
