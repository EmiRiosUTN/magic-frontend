import React from 'react';
import ReactDOM from 'react-dom';
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
  type = 'warning'
}) => {
  if (!isOpen) return null;

  const colors = {
    warning: {
      bg: 'bg-copper/10',
      border: 'border-copper/30',
      icon: 'text-copper',
      button: 'bg-copper hover:bg-copper/90',
    },
    danger: {
      bg: 'bg-oxid/10',
      border: 'border-oxid/30',
      icon: 'text-oxid',
      button: 'bg-oxid hover:bg-oxid/90',
    },
    info: {
      bg: 'bg-navy/10',
      border: 'border-navy/30',
      icon: 'text-navy',
      button: 'bg-navy hover:bg-navy/90',
    },
  };

  const currentColors = colors[type];

  const modalContent = (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-smoke rounded-2xl shadow-2xl max-w-md w-full animate-in zoom-in-95 duration-200 border border-haze/30">
        <div className="p-6">
          <div className="flex items-start gap-4">
            <div className={`flex-shrink-0 w-12 h-12 rounded-full ${currentColors.bg} ${currentColors.border} border-2 flex items-center justify-center`}>
              <AlertTriangle className={currentColors.icon} size={24} />
            </div>

            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-bold text-oyster mb-2">
                {title}
              </h3>
              <p className="text-sm text-nevada leading-relaxed">
                {message}
              </p>
            </div>

            <button
              onClick={onClose}
              className="flex-shrink-0 p-1 hover:bg-haze/50 rounded-lg transition-colors"
            >
              <X size={20} className="text-haze" />
            </button>
          </div>
        </div>

        <div className="flex gap-3 p-6 pt-0">
          <Button
            onClick={onClose}
            variant="secondary"
            className="flex-1 bg-haze text-oyster hover:bg-haze/80"
          >
            {cancelText}
          </Button>
          <Button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            variant={type === 'danger' ? 'danger' : 'primary'}
            className={`flex-1 ${currentColors.button} text-oyster`}
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </div>
  );

  return ReactDOM.createPortal(modalContent, document.body);
};
