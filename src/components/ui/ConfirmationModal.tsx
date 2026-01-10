import React from 'react';
import { AlertTriangle, X } from 'lucide-react';
import { Button } from './Button';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'warning' | 'danger' | 'info';
  conversationToDelete?: {
    title: string;
    messageCount: number;
  };
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  type = 'warning',
  conversationToDelete,
}) => {
  if (!isOpen) return null;

  const colors = {
    warning: {
      bg: 'bg-amber-50',
      border: 'border-amber-200',
      icon: 'text-amber-600',
      button: 'bg-amber-600 hover:bg-amber-700',
    },
    danger: {
      bg: 'bg-red-50',
      border: 'border-red-200',
      icon: 'text-red-600',
      button: 'bg-red-600 hover:bg-red-700',
    },
    info: {
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      icon: 'text-blue-600',
      button: 'bg-blue-600 hover:bg-blue-700',
    },
  };

  const currentColors = colors[type];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full animate-in zoom-in-95 duration-200">
        <div className="p-6">
          <div className="flex items-start gap-4">
            <div className={`flex-shrink-0 w-12 h-12 rounded-full ${currentColors.bg} ${currentColors.border} border-2 flex items-center justify-center`}>
              <AlertTriangle className={currentColors.icon} size={24} />
            </div>

            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-bold text-slate-900 mb-2">
                {title}
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed mb-4">
                {message}
              </p>

              {conversationToDelete && (
                <div className={`p-4 ${currentColors.bg} rounded-lg border ${currentColors.border}`}>
                  <p className="text-sm font-medium text-slate-900 mb-1">
                    Se eliminará:
                  </p>
                  <p className="text-sm text-slate-700 font-medium">
                    "{conversationToDelete.title}"
                  </p>
                  <p className="text-xs text-slate-600 mt-1">
                    {conversationToDelete.messageCount} mensajes
                  </p>
                </div>
              )}
            </div>

            <button
              onClick={onClose}
              className="flex-shrink-0 p-1 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <X size={20} className="text-slate-400" />
            </button>
          </div>
        </div>

        <div className="flex gap-3 p-6 pt-0">
          <Button
            onClick={onClose}
            className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700"
          >
            {cancelText}
          </Button>
          <Button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className={`flex-1 text-white ${currentColors.button}`}
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </div>
  );
};
