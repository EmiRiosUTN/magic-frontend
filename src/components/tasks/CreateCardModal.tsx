import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Priority } from '../../types/tasks';

interface CreateCardModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: { title: string; description?: string; priority?: Priority; dueDate?: string }) => void;
}

const PRIORITIES = [
    { value: Priority.LOW, label: 'Baja', color: 'bg-green-100 text-green-800' },
    { value: Priority.MEDIUM, label: 'Media', color: 'bg-yellow-100 text-yellow-800' },
    { value: Priority.HIGH, label: 'Alta', color: 'bg-orange-100 text-orange-800' },
    { value: Priority.URGENT, label: 'Urgente', color: 'bg-red-100 text-red-800' },
];

export function CreateCardModal({ isOpen, onClose, onSubmit }: CreateCardModalProps) {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [priority, setPriority] = useState<Priority>(Priority.MEDIUM);
    const [dueDate, setDueDate] = useState('');

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
        });
        handleClose();
    };

    const handleClose = () => {
        setTitle('');
        setDescription('');
        setPriority(Priority.MEDIUM);
        setDueDate('');
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
                <div className="flex items-center justify-between p-6 border-b border-slate-200">
                    <h2 className="text-xl font-semibold text-slate-900">Nueva Tarea</h2>
                    <button
                        onClick={handleClose}
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
                            autoFocus
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

                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={handleClose}
                            className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={!title.trim()}
                        >
                            Crear
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
