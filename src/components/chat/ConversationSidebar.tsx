import React, { useState } from 'react';
import { MessageSquarePlus, Trash2, X } from 'lucide-react';
import { Conversation } from '../../types';
import { IconButton } from '../ui/IconButton';
import { ConfirmationModal } from '../ui/ConfirmationModal';

interface ConversationSidebarProps {
  conversations: Conversation[];
  currentConversationId: string | null;
  agentName: string;
  onSelectConversation: (conversationId: string) => void;
  onNewConversation: () => void;
  onDeleteConversation: (conversationId: string) => void;
  maxConversations: number;
  isOpen: boolean;
  onClose: () => void;
}

export const ConversationSidebar: React.FC<ConversationSidebarProps> = ({
  conversations,
  currentConversationId,
  agentName,
  onSelectConversation,
  onNewConversation,
  onDeleteConversation,
  maxConversations,
  isOpen,
  onClose,
}) => {
  const [confirmationState, setConfirmationState] = useState<{
    isOpen: boolean;
    conversationId: string | null;
  }>({
    isOpen: false,
    conversationId: null,
  });

  const handleDeleteClick = (conversationId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setConfirmationState({
      isOpen: true,
      conversationId: conversationId,
    });
  };

  const handleConfirmDelete = () => {
    if (confirmationState.conversationId) {
      onDeleteConversation(confirmationState.conversationId);
      setConfirmationState({ isOpen: false, conversationId: null });
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

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={onClose}
        />
      )}

      <div className={`
        fixed md:relative 
        inset-y-0 left-0 
        w-80 bg-grafite 
        flex flex-col h-full 
        z-50 
        transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div className="p-4 border-b border-smoke">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-oyster">Conversaciones</h3>
            <IconButton
              icon={<X size={18} />}
              onClick={onClose}
              label="Cerrar"
              className="md:hidden hover:bg-smoke text-oyster"
            />
          </div>

          <button
            onClick={onNewConversation}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-navy/70 text-oyster rounded-lg hover:bg-navy/90 transition-colors font-medium text-sm"
          >
            <MessageSquarePlus size={18} />
            Nueva conversación
          </button>

          <div className="mt-3 text-xs text-oyster text-center">
            {conversations.length} / {maxConversations} conversaciones
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {conversations.length === 0 ? (
            <div className="p-6 text-center">
              <div className="text-haze mb-2">
                <MessageSquarePlus size={32} className="mx-auto" />
              </div>
              <p className="text-sm text-nevada">No hay conversaciones</p>
              <p className="text-xs text-haze mt-1">
                Crea una nueva para comenzar
              </p>
            </div>
          ) : (
            <div className="p-2 space-y-1">
              {conversations.map((conversation) => {
                const isActive = conversation.id === currentConversationId;

                return (
                  <div
                    key={conversation.id}
                    onClick={() => onSelectConversation(conversation.id)}
                    className={`group relative p-3 rounded-lg cursor-pointer transition-all ${isActive
                      ? 'shadow-sm bg-smoke/40'
                      : 'hover:bg-smoke bg-[#161616]'
                      }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <h4 className={`font-medium text-sm truncate ${isActive ? 'text-oyster' : 'text-oyster'
                          }`}>
                          {conversation.title}
                        </h4>
                        <div className="flex items-center gap-2 mt-1">
                          <span className={`text-xs ${isActive ? 'text-nevada' : 'text-nevada'
                            }`}>
                            {conversation.messageCount} mensajes
                          </span>
                          <span className={`text-xs ${isActive ? 'text-nevada' : 'text-haze'
                            }`}>
                            •
                          </span>
                          <span className={`text-xs ${isActive ? 'text-nevada' : 'text-nevada'
                            }`}>
                            {formatDate(conversation.lastMessageAt)}
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={(e) => handleDeleteClick(conversation.id, e)}
                        className={`p-1.5 rounded transition-colors ${isActive
                          ? 'hover:bg-oxid text-swirl opacity-0 group-hover:opacity-100'
                          : 'hover:bg-oxid/20 text-swirl hover:text-oxid opacity-0 group-hover:opacity-100'
                          }`}
                        title="Eliminar"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="p-4 border-t border-smoke bg-smoke">
          <div className="text-xs text-nevada">
            <p className="font-medium mb-1">{agentName}</p>
            <p className="text-haze">
              Límite: {maxConversations} conversaciones máximo
            </p>
          </div>
        </div>
      </div>

      <ConfirmationModal
        isOpen={confirmationState.isOpen}
        onClose={() => setConfirmationState({ isOpen: false, conversationId: null })}
        onConfirm={handleConfirmDelete}
        title="Eliminar conversación"
        message="¿Estás seguro de que quieres eliminar esta conversación? Esta acción no se puede deshacer."
        confirmText="Eliminar"
        cancelText="Cancelar"
        type="danger"

      />
    </>
  );
};
