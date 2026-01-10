import React, { useState } from 'react';
import { MessageSquarePlus, Trash2, X, Menu } from 'lucide-react';
import { Conversation } from '../../types';
import { IconButton } from '../ui/IconButton';

interface ConversationSidebarProps {
  conversations: Conversation[];
  currentConversationId: string | null;
  agentName: string;
  onSelectConversation: (conversationId: string) => void;
  onNewConversation: () => void;
  onDeleteConversation: (conversationId: string) => void;
  maxConversations: number;
}

export const ConversationSidebar: React.FC<ConversationSidebarProps> = ({
  conversations,
  currentConversationId,
  agentName,
  onSelectConversation,
  onNewConversation,
  onDeleteConversation,
  maxConversations,
}) => {
  const [isOpen, setIsOpen] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (conversationId: string, e: React.MouseEvent) => {
    e.stopPropagation();

    if (deletingId === conversationId) {
      onDeleteConversation(conversationId);
      setDeletingId(null);
    } else {
      setDeletingId(conversationId);
      setTimeout(() => setDeletingId(null), 3000);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Ahora';
    if (diffMins < 60) return `Hace ${diffMins}m`;
    if (diffHours < 24) return `Hace ${diffHours}h`;
    if (diffDays < 7) return `Hace ${diffDays}d`;

    return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
  };

  if (!isOpen) {
    return (
      <div className="fixed left-4 top-20 z-40">
        <button
          onClick={() => setIsOpen(true)}
          className="bg-white p-3 rounded-lg shadow-lg hover:bg-slate-50 transition-colors border border-slate-200"
        >
          <Menu size={20} className="text-slate-700" />
        </button>
      </div>
    );
  }

  return (
    <div className="w-80 bg-white border-r border-slate-200 flex flex-col h-full">
      <div className="p-4 border-b border-slate-200">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-slate-900">Conversaciones</h3>
          <IconButton
            icon={<X size={18} />}
            onClick={() => setIsOpen(false)}
            label="Cerrar"
            className="hover:bg-slate-100"
          />
        </div>

        <button
          onClick={onNewConversation}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors font-medium text-sm"
        >
          <MessageSquarePlus size={18} />
          Nueva Conversación
        </button>

        <div className="mt-3 text-xs text-slate-500 text-center">
          {conversations.length} / {maxConversations} conversaciones
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {conversations.length === 0 ? (
          <div className="p-6 text-center">
            <div className="text-slate-400 mb-2">
              <MessageSquarePlus size={32} className="mx-auto" />
            </div>
            <p className="text-sm text-slate-600">No hay conversaciones</p>
            <p className="text-xs text-slate-500 mt-1">
              Crea una nueva para comenzar
            </p>
          </div>
        ) : (
          <div className="p-2 space-y-1">
            {conversations.map((conversation) => {
              const isActive = conversation.id === currentConversationId;
              const isDeleting = deletingId === conversation.id;

              return (
                <div
                  key={conversation.id}
                  onClick={() => onSelectConversation(conversation.id)}
                  className={`group relative p-3 rounded-lg cursor-pointer transition-all ${
                    isActive
                      ? 'bg-slate-900 text-white shadow-sm'
                      : 'hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <h4 className={`font-medium text-sm truncate ${
                        isActive ? 'text-white' : 'text-slate-900'
                      }`}>
                        {conversation.title}
                      </h4>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`text-xs ${
                          isActive ? 'text-slate-300' : 'text-slate-500'
                        }`}>
                          {conversation.messageCount} mensajes
                        </span>
                        <span className={`text-xs ${
                          isActive ? 'text-slate-400' : 'text-slate-400'
                        }`}>
                          •
                        </span>
                        <span className={`text-xs ${
                          isActive ? 'text-slate-300' : 'text-slate-500'
                        }`}>
                          {formatDate(conversation.lastMessageAt)}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={(e) => handleDelete(conversation.id, e)}
                      className={`p-1.5 rounded transition-colors ${
                        isDeleting
                          ? 'bg-red-500 text-white'
                          : isActive
                          ? 'hover:bg-slate-800 text-slate-300 opacity-0 group-hover:opacity-100'
                          : 'hover:bg-red-50 text-slate-400 hover:text-red-600 opacity-0 group-hover:opacity-100'
                      }`}
                      title={isDeleting ? 'Click de nuevo para confirmar' : 'Eliminar'}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>

                  {isDeleting && (
                    <div className="absolute inset-0 bg-red-500 bg-opacity-10 rounded-lg pointer-events-none" />
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="p-4 border-t border-slate-200 bg-slate-50">
        <div className="text-xs text-slate-600">
          <p className="font-medium mb-1">{agentName}</p>
          <p className="text-slate-500">
            Límite: {maxConversations} conversaciones máximo
          </p>
        </div>
      </div>
    </div>
  );
};
