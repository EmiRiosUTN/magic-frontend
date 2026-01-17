import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useTranslation } from '../../hooks/useTranslation';

interface CreateSectionModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (name: string) => void;
}

export function CreateSectionModal({ isOpen, onClose, onSubmit }: CreateSectionModalProps) {
    const { t } = useTranslation();
    const [name, setName] = useState('');

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) return;
        onSubmit(name.trim());
        handleClose();
    };

    const handleClose = () => {
        setName('');
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 font-roboto">
            <div className="bg-grafite rounded-xl shadow-2xl max-w-sm w-full">
                <div className="flex items-center justify-between p-6 border-b border-smoke">
                    <h2 className="text-lg font-semibold text-swirl">{t('newSection')}</h2>
                    <button
                        onClick={handleClose}
                        className="text-swirl hover:cursor-pointer transition-colors"
                    >
                        <X size={16} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-swirl mb-2">
                            {t('sectionName')} *
                        </label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full text-sm px-4 py-2 bg-smoke text-oyster placeholder:text-nevada border border-haze/30 rounded-lg focus:ring-2 focus:ring-copper focus:border-transparent outline-none transition-all"
                            placeholder="Ejemplo: Cosas para hacer"
                            maxLength={100}
                            required
                            autoFocus
                        />
                    </div>

                    <div className="flex gap-3 pt-2 text-sm">
                        <button
                            type="button"
                            onClick={handleClose}
                            className="flex-1 py-2 text-swirl bg-oxid rounded-lg hover:bg-oxid/80 transition-colors"
                        >
                            {t('cancel')}
                        </button>
                        <button
                            type="submit"
                            className="flex-1 py-2 bg-navy text-swirl rounded-lg hover:bg-navy/80 hover:cursor-pointer transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={!name.trim()}
                        >
                            {t('create')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
