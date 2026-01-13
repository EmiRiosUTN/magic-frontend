import React, { useState, useEffect } from 'react';
import { X, Trash2 } from 'lucide-react';
import { Priority, Card } from '../../types/tasks';

interface EditCardModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: {
        title?: string;
        description?: string;
        priority?: Priority;
        dueDate?: string;
        reminderEnabled?: boolean;
        reminderDaysBefore?: number;
    }) => void;
    onDelete: () => void;
    card: Card;
}

const PRIORITIES = [
    { value: Priority.LOW, label: 'Baja', color: 'bg-green-100 text-green-800' },
    { value: Priority.MEDIUM, label: 'Media', color: 'bg-yellow-100 text-yellow-800' },
    { value: Priority.HIGH, label: 'Alta', color: 'bg-orange-100 text-orange-800' },
    { value: Priority.URGENT, label: 'Urgente', color: 'bg-red-100 text-red-800' },
];

export function EditCardModal({ isOpen, onClose, onSubmit, onDelete, card }: EditCardModalProps) {
    const [title, setTitle] = useState(card.title);
    const [description, setDescription] = useState(card.description || '');
    const [priority, setPriority] = useState<Priority>(card.priority);
    const [dueDate, setDueDate] = useState(card.dueDate ? card.dueDate.split('T')[0] : '');
    const [reminderEnabled, setReminderEnabled] = useState(card.reminderEnabled || false);
    const [reminderDaysBefore, setReminderDaysBefore] = useState(card.reminderDaysBefore || 1);

    useEffect(() => {
        if (isOpen) {
            setTitle(card.title);
            setDescription(card.description || '');
            setPriority(card.priority);
            setDueDate(card.dueDate ? card.dueDate.split('T')[0] : '');
            setReminderEnabled(card.reminderEnabled || false);
            setReminderDaysBefore(card.reminderDaysBefore || 1);
        }
    }, [isOpen, card]);

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
        onClose();
    };

    const handleDelete = () => {
        if (confirm('¿Estás seguro de que quieres eliminar esta tarea?')) {
            onDelete();
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
                <div className="flex items-center justify-between p-6 border-b border-slate-200">
                    <h2 className="text-xl font-semibold text-slate-900">Editar Tarea</h2>
                    <button
                        onClick={onClose}
                        className="text-slate-400 hover:text-slate-600 transition-colors"
                    >
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            Título *
                        </label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                            placeholder="Ej: Implementar login"
                            maxLength={200}
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            Descripción
                        </label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none"
                            placeholder="Describe la tarea..."
                            rows={3}
                            maxLength={5000}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            Prioridad
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                            {PRIORITIES.map((p) => (
                                <button
                                    key={p.value}
                                    type="button"
                                    onClick={() => setPriority(p.value)}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${priority === p.value
                                        ? `${p.color} ring-2 ring-offset-2 ring-slate-900`
                                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                        }`}
                                >
                                    {p.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            Fecha de vencimiento
                        </label>
                        <input
                            type="date"
                            value={dueDate}
                            onChange={(e) => setDueDate(e.target.value)}
                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                        />
                    </div>

                    {/* Reminder Configuration */}
                    {dueDate && (
                        <div className="border-t border-slate-200 pt-4">
                            <div className="flex items-center justify-between mb-3">
                                <label className="block text-sm font-medium text-slate-700">
                                    🔔 Recordatorio
                                </label>
                                <button
                                    type="button"
                                    onClick={() => setReminderEnabled(!reminderEnabled)}
                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${reminderEnabled ? 'bg-blue-600' : 'bg-slate-300'
                                        }`}
                                >
                                    <span
                                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${reminderEnabled ? 'translate-x-6' : 'translate-x-1'
                                            }`}
                                    />
                                </button>
                            </div>
                            {reminderEnabled && (
                                <div>
                                    <label className="block text-xs text-slate-600 mb-2">
                                        Recordar con cuántos días de anticipación
                                    </label>
                                    <select
                                        value={reminderDaysBefore}
                                        onChange={(e) => setReminderDaysBefore(Number(e.target.value))}
                                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
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

                    <div className="flex gap-3 pt-4 border-t border-slate-200">
                        <button
                            type="button"
                            onClick={handleDelete}
                            className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors flex items-center gap-2"
                        >
                            <Trash2 size={18} />
                            Eliminar
                        </button>
                        <div className="flex-1" />
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={!title.trim()}
                        >
                            Guardar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
