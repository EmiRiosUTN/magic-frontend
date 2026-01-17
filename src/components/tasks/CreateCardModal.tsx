import React, { useState } from 'react';
import { X, Bell } from 'lucide-react';
import { Priority } from '../../types/tasks';
import { useTranslation } from '../../hooks/useTranslation';

interface CreateCardModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: {
        title: string;
        description?: string;
        priority?: Priority;
        dueDate?: string;
        reminderEnabled?: boolean;
        reminderDaysBefore?: number;
    }) => void;
}



export function CreateCardModal({ isOpen, onClose, onSubmit }: CreateCardModalProps) {
    const { t } = useTranslation();
    const PRIORITIES = [
        { value: Priority.LOW, label: t('low'), color: 'bg-olive text-swirl' },
        { value: Priority.MEDIUM, label: t('medium'), color: 'bg-copper text-grafite' },
        { value: Priority.HIGH, label: t('high'), color: 'bg-oxid text-swirl' },
        { value: Priority.URGENT, label: t('urgent'), color: 'bg-plum text-grafite' },
    ];
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [priority, setPriority] = useState<Priority>(Priority.MEDIUM);
    const [dueDate, setDueDate] = useState('');
    const [reminderEnabled, setReminderEnabled] = useState(false);
    const [reminderDaysBefore, setReminderDaysBefore] = useState(1);

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim()) return;

        // Convert date to ISO string if provided
        const formattedDueDate = dueDate ? new Date(dueDate).toISOString() : undefined;

        onSubmit({
            title: title.trim(),
            description: description.trim() || undefined,
            priority,
            dueDate: formattedDueDate,
            reminderEnabled: dueDate ? reminderEnabled : false,
            reminderDaysBefore: dueDate && reminderEnabled ? reminderDaysBefore : undefined,
        });
        handleClose();
    };

    const handleClose = () => {
        setTitle('');
        setDescription('');
        setPriority(Priority.MEDIUM);
        setDueDate('');
        setReminderEnabled(false);
        setReminderDaysBefore(1);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 font-roboto">
            <div className="bg-grafite rounded-xl shadow-2xl max-w-md w-full">
                <div className="flex items-center justify-between p-6 border-b border-smoke">
                    <h2 className="text-lg font-medium text-swirl">{t('addTask')}</h2>
                    <button
                        onClick={handleClose}
                        className="text-swirl hover:text-slate-600 transition-colors"
                    >
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-swirl mb-2">
                            {t('taskTitle')} *
                        </label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full px-4 py-2 bg-smoke text-oyster placeholder:text-nevada border border-haze/30 text-sm rounded-lg focus:ring-2 focus:ring-copper focus:border-transparent outline-none transition-all"
                            placeholder="Ejemplo: Implementar login"
                            maxLength={200}
                            required
                            autoFocus
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-swirl mb-2">
                            {t('taskDescription')}
                        </label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full px-4 py-2 bg-smoke text-oyster placeholder:text-nevada border border-haze/30 text-sm rounded-lg focus:ring-2 focus:ring-copper focus:border-transparent outline-none transition-all resize-none"
                            placeholder="Describe la tarea..."
                            rows={3}
                            maxLength={5000}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-swirl mb-2">
                            {t('priority')}
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                            {PRIORITIES.map((p) => (
                                <button
                                    key={p.value}
                                    type="button"
                                    onClick={() => setPriority(p.value)}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${priority === p.value
                                            ? `${p.color} ring-2 ring-offset-2 ring-offset-grafite`
                                            : 'bg-smoke text-oyster hover:bg-haze/50'
                                        }`}
                                >
                                    {p.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-swirl mb-2">
                            {t('dueDate')}
                        </label>
                        <input
                            type="date"
                            value={dueDate}
                            onChange={(e) => setDueDate(e.target.value)}
                            className="w-full px-4 py-2 bg-smoke text-oyster border border-haze/30 text-sm rounded-lg focus:ring-2 focus:ring-copper focus:border-transparent outline-none transition-all"
                        />
                    </div>

                    {/* Reminder Configuration */}
                    {dueDate && (
                        <div className="border-t border-smoke pt-4">
                            <div className="flex items-center justify-between mb-3">
                                <label className="block text-sm font-medium text-swirl flex items-center gap-2">
                                    <Bell size={16} className="text-copper" />
                                    Recordatorio
                                </label>
                                <button
                                    type="button"
                                    onClick={() => setReminderEnabled(!reminderEnabled)}
                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${reminderEnabled ? 'bg-copper' : 'bg-haze'
                                        }`}
                                >
                                    <span
                                        className={`inline-block h-4 w-4 transform rounded-full bg-oyster transition-transform ${reminderEnabled ? 'translate-x-6' : 'translate-x-1'
                                            }`}
                                    />
                                </button>
                            </div>
                            {reminderEnabled && (
                                <div>
                                    <label className="block text-xs text-swirl mb-2">
                                        Recordar con cuántos días de anticipación
                                    </label>
                                    <select
                                        value={reminderDaysBefore}
                                        onChange={(e) => setReminderDaysBefore(Number(e.target.value))}
                                        className="w-full px-4 py-2 bg-smoke text-oyster border border-haze/30 text-sm rounded-lg focus:ring-2 focus:ring-copper focus:border-transparent outline-none transition-all"
                                    >
                                        <option value={0}>El mismo día</option>
                                        <option value={1}>1 día antes</option>
                                        <option value={2}>2 días antes</option>
                                        <option value={3}>3 días antes</option>
                                        <option value={7}>1 semana antes</option>
                                        <option value={14}>2 semanas antes</option>
                                    </select>
                                </div>
                            )}
                        </div>
                    )}

                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={handleClose}
                            className="flex-1 px-4 py-2 text-sm border border-smoke text-swirl bg-oxid rounded-lg hover:bg-oxid/80 rounded-lg transition-colors"
                        >
                            {t('cancel')}
                        </button>
                        <button
                            type="submit"
                            className="flex-1 px-4 py-2 text-sm bg-navy text-swirl rounded-lg hover:bg-navy/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={!title.trim()}
                        >
                            {t('create')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
