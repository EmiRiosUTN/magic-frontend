import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useTranslation } from '../../hooks/useTranslation';

interface CreateProjectModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: { name: string; description?: string; color?: string }) => void;
    initialData?: { name: string; description?: string; color?: string };
}

export function CreateProjectModal({ isOpen, onClose, onSubmit, initialData }: CreateProjectModalProps) {
    const { t } = useTranslation();
    const [name, setName] = useState(initialData?.name || '');
    const [description, setDescription] = useState(initialData?.description || '');

    const COLORS = [
        { value: '#3B82F6', label: t('blue') },
        { value: '#10B981', label: t('green') },
        { value: '#8B5CF6', label: t('purple') },
        { value: '#F59E0B', label: t('orange') },
        { value: '#EC4899', label: t('pink') },
        { value: '#14B8A6', label: t('teal') },
    ];

    const [color, setColor] = useState(initialData?.color || COLORS[0].value);

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) return;
        onSubmit({ name: name.trim(), description: description.trim() || undefined, color });
        handleClose();
    };

    const handleClose = () => {
        setName('');
        setDescription('');
        setColor(COLORS[0].value);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 font-roboto">
            <div className="bg-grafite rounded-xl shadow-2xl max-w-md w-full">
                <div className="flex items-center justify-between p-6 border-b border-smoke">
                    <h2 className="text-lg font-medium text-swirl">
                        {initialData ? t('editProject') : t('newProject')}
                    </h2>
                    <button
                        onClick={handleClose}
                        className="text-swirl hover:cursor-pointer transition-colors"
                    >
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-swirl mb-2">
                            {t('projectName')} *
                        </label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full px-4 py-2 text-sm text-grafite border border-smoke rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                            placeholder={t('projectNamePlaceholder')}
                            maxLength={100}
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-swirl mb-2">
                            {t('projectDescription')}
                        </label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full px-4 py-2 text-sm text-grafite border border-smoke rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none"
                            placeholder={t('projectDescriptionPlaceholder')}
                            rows={3}
                            maxLength={1000}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-swirl mb-2">
                            {t('color')}
                        </label>
                        <div className="grid grid-cols-6 gap-2">
                            {COLORS.map((c) => (
                                <button
                                    key={c.value}
                                    type="button"
                                    onClick={() => setColor(c.value)}
                                    className={`w-full aspect-square rounded-lg transition-all ${color === c.value ? 'ring-2 ring-offset-2 ring-grafite scale-110' : 'hover:scale-105'
                                        }`}
                                    style={{ backgroundColor: c.value }}
                                    title={c.label}
                                />
                            ))}
                        </div>
                    </div>

                    <div className="flex gap-3 pt-4 text-sm">
                        <button
                            type="button"
                            onClick={handleClose}
                            className="flex-1 px-4 py-2 border border-smoke text-swirl bg-oxid rounded-lg hover:bg-oxid/80 transition-colors"
                        >
                            {t('cancel')}
                        </button>
                        <button
                            type="submit"
                            className="flex-1 px-4 py-2 bg-navy text-swirl rounded-lg hover:bg-navy/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={!name.trim()}
                        >
                            {initialData ? t('save') : t('create')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
