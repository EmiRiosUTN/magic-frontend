import React, { useState, useEffect } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Check, Mail, Globe } from 'lucide-react';
import { api } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import { Language } from '../../types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const [notificationEmail, setNotificationEmail] = useState('');
  const [language, setLanguage] = useState<Language>('ES');
  const [saved, setSaved] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen && user) {
      setNotificationEmail(user.notificationEmail || user.email || '');
      setLanguage(user.language || 'ES');
      setSaved(false);
    }
  }, [isOpen, user]);

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const updates: { notificationEmail?: string; language?: Language } = {};

      if (notificationEmail !== user?.notificationEmail) {
        updates.notificationEmail = notificationEmail;
      }

      if (language !== user?.language) {
        updates.language = language;
      }

      if (Object.keys(updates).length > 0) {
        await api.updateProfile(updates);
      }

      setSaved(true);
      setTimeout(() => {
        onClose();
      }, 1000);
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Error al guardar la configuración');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Configuración">
      <div className="space-y-6">
        {/* Email Notifications Section */}
        <div>
          <h3 className="text-sm font-semibold text-slate-900 mb-3 flex items-center gap-2">
            <Mail size={16} />
            Notificaciones
          </h3>
          <p className="text-sm text-slate-600 mb-4">
            Recibe recordatorios y alertas en esta dirección.
          </p>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Email de Notificaciones
            </label>
            <input
              type="email"
              value={notificationEmail}
              onChange={(e) => setNotificationEmail(e.target.value)}
              placeholder="tu@email.com"
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent"
            />
          </div>
        </div>

        <div className="border-t border-slate-200 my-4" />

        {/* Language Section */}
        <div>
          <h3 className="text-sm font-semibold text-slate-900 mb-3 flex items-center gap-2">
            <Globe size={16} />
            Idioma
          </h3>
          <p className="text-sm text-slate-600 mb-4">
            Selecciona tu idioma preferido para la interfaz.
          </p>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setLanguage('ES')}
              className={`px-4 py-3 rounded-lg text-sm font-medium transition-all ${language === 'ES'
                  ? 'bg-slate-900 text-white ring-2 ring-offset-2 ring-slate-900'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
            >
              🇪🇸 Español
            </button>
            <button
              type="button"
              onClick={() => setLanguage('EN')}
              className={`px-4 py-3 rounded-lg text-sm font-medium transition-all ${language === 'EN'
                  ? 'bg-slate-900 text-white ring-2 ring-offset-2 ring-slate-900'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
            >
              🇬🇧 English
            </button>
          </div>
        </div>

        <div className="pt-4 flex gap-3">
          <Button
            variant="secondary"
            className="flex-1"
            onClick={onClose}
            disabled={isLoading || saved}
          >
            Cancelar
          </Button>
          <Button
            variant="primary"
            className="flex-1"
            onClick={handleSave}
            disabled={isLoading || saved}
          >
            {saved ? (
              <span className="flex items-center gap-2">
                <Check size={16} />
                Guardado
              </span>
            ) : (
              isLoading ? 'Guardando...' : 'Guardar'
            )}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
