import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { Bell, Plus, Trash2, Calendar, Clock } from 'lucide-react';

interface Reminder {
    id: string;
    title: string;
    description?: string;
    triggerAt: string;
    isSent: boolean;
}

export function RemindersView() {
    const [reminders, setReminders] = useState<Reminder[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [newReminder, setNewReminder] = useState({
        title: '',
        description: '',
        date: '',
        time: '',
    });

    useEffect(() => {
        loadReminders();
    }, []);

    const loadReminders = async () => {
        try {
            setIsLoading(true);
            const response: any = await api.getReminders();
            setReminders(response);
        } catch (error) {
            console.error('Error loading reminders:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const triggerAt = new Date(`${newReminder.date}T${newReminder.time}`).toISOString();
            await api.createReminder({
                title: newReminder.title,
                description: newReminder.description,
                triggerAt,
            });
            setIsCreateModalOpen(false);
            setNewReminder({ title: '', description: '', date: '', time: '' });
            loadReminders();
        } catch (error) {
            console.error('Error creating reminder:', error);
            alert('Error al crear el recordatorio');
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('¿Estás seguro de eliminar este recordatorio?')) return;
        try {
            await api.deleteReminder(id);
            loadReminders();
        } catch (error) {
            console.error('Error deleting reminder:', error);
        }
    };

    return (
        <div className="p-6 max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                        <Bell className="text-blue-600" />
                        Recordatorios
                    </h1>
                    <p className="text-slate-600">Gestiona tus alertas y recordatorios personales</p>
                </div>
                <button
                    onClick={() => setIsCreateModalOpen(true)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 font-medium"
                >
                    <Plus size={20} />
                    Nuevo Recordatorio
                </button>
            </div>

            {isLoading ? (
                <div className="flex justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-copper"></div>
                </div>
            ) : reminders.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-slate-200">
                    <Bell className="mx-auto text-slate-300 mb-3" size={48} />
                    <p className="text-slate-500 text-lg">No tienes recordatorios pendientes</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {reminders.map((reminder) => (
                        <div key={reminder.id} className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow relative group">
                            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                    onClick={() => handleDelete(reminder.id)}
                                    className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>

                            <h3 className="font-semibold text-lg text-slate-900 mb-2 pr-8">{reminder.title}</h3>
                            {reminder.description && (
                                <p className="text-slate-600 text-sm mb-4 line-clamp-2">{reminder.description}</p>
                            )}

                            <div className="flex items-center gap-4 text-sm text-slate-500 mt-auto pt-4 border-t border-slate-100">
                                <div className="flex items-center gap-1.5">
                                    <Calendar size={14} />
                                    {new Date(reminder.triggerAt).toLocaleDateString()}
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <Clock size={14} />
                                    {new Date(reminder.triggerAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {isCreateModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
                        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
                            <h2 className="text-lg font-semibold text-slate-900">Nuevo Recordatorio</h2>
                            <button
                                onClick={() => setIsCreateModalOpen(false)}
                                className="text-slate-400 hover:text-slate-600"
                            >
                                ✕
                            </button>
                        </div>
                        <form onSubmit={handleCreate} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Título</label>
                                <input
                                    type="text"
                                    required
                                    value={newReminder.title}
                                    onChange={e => setNewReminder({ ...newReminder, title: e.target.value })}
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                    placeholder="Ej: Llamar a cliente"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Descripción</label>
                                <textarea
                                    value={newReminder.description}
                                    onChange={e => setNewReminder({ ...newReminder, description: e.target.value })}
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none h-24"
                                    placeholder="Detalles adicionales..."
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Fecha</label>
                                    <input
                                        type="date"
                                        required
                                        value={newReminder.date}
                                        onChange={e => setNewReminder({ ...newReminder, date: e.target.value })}
                                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Hora</label>
                                    <input
                                        type="time"
                                        required
                                        value={newReminder.time}
                                        onChange={e => setNewReminder({ ...newReminder, time: e.target.value })}
                                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                    />
                                </div>
                            </div>
                            <div className="pt-4 flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => setIsCreateModalOpen(false)}
                                    className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    Crear Recordatorio
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
