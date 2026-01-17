import React, { useState } from 'react';
import { api } from '../../services/api';
import { Save, Mail } from 'lucide-react';

export function EmailConfig() {
    const [config, setConfig] = useState({
        smtpHost: '',
        smtpPort: 587,
        smtpUser: '',
        smtpPassword: '',
        fromEmail: '',
        fromName: 'Multi-Agent AI',
    });

    const [isSaving, setIsSaving] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            await api.updateEmailConfig(config);
            alert('Configuración de correo actualizada correctamente');
        } catch (error) {
            console.error('Error updating email config:', error);
            alert('Error al actualizar la configuración');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-blue-50 rounded-lg">
                    <Mail className="text-blue-600" size={24} />
                </div>
                <div>
                    <h2 className="text-lg font-semibold text-slate-900">Configuración de correo</h2>
                    <p className="text-sm text-slate-600">Configura el servidor SMTP para el envío de notificaciones</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
                <div className="grid grid-cols-2 gap-6">
                    <div className="col-span-2 sm:col-span-1">
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                            Host SMTP
                        </label>
                        <input
                            type="text"
                            required
                            value={config.smtpHost}
                            onChange={(e) => setConfig({ ...config, smtpHost: e.target.value })}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                            placeholder="smtp.example.com"
                        />
                    </div>

                    <div className="col-span-2 sm:col-span-1">
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                            Puerto SMTP
                        </label>
                        <input
                            type="number"
                            required
                            value={config.smtpPort}
                            onChange={(e) => setConfig({ ...config, smtpPort: parseInt(e.target.value) })}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                            placeholder="587"
                        />
                    </div>

                    <div className="col-span-2 sm:col-span-1">
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                            Usuario SMTP
                        </label>
                        <input
                            type="text"
                            required
                            value={config.smtpUser}
                            onChange={(e) => setConfig({ ...config, smtpUser: e.target.value })}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                            placeholder="user@example.com"
                        />
                    </div>

                    <div className="col-span-2 sm:col-span-1">
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                            Contraseña SMTP
                        </label>
                        <input
                            type="password"
                            value={config.smtpPassword}
                            onChange={(e) => setConfig({ ...config, smtpPassword: e.target.value })}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                            placeholder="••••••••"
                        />
                        <p className="mt-1 text-xs text-slate-500">Déjalo vacío para mantener la contraseña actual</p>
                    </div>

                    <div className="col-span-2">
                        <hr className="my-2 border-slate-100" />
                    </div>

                    <div className="col-span-2 sm:col-span-1">
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                            Email del Remitente
                        </label>
                        <input
                            type="email"
                            required
                            value={config.fromEmail}
                            onChange={(e) => setConfig({ ...config, fromEmail: e.target.value })}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                            placeholder="notifications@example.com"
                        />
                    </div>

                    <div className="col-span-2 sm:col-span-1">
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                            Nombre del Remitente
                        </label>
                        <input
                            type="text"
                            required
                            value={config.fromName}
                            onChange={(e) => setConfig({ ...config, fromName: e.target.value })}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                            placeholder="MagicAI Notificaciones"
                        />
                    </div>
                </div>

                <div className="flex justify-end pt-4">
                    <button
                        type="submit"
                        disabled={isSaving}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                    >
                        <Save size={18} />
                        {isSaving ? 'Guardando...' : 'Guardar Configuración'}
                    </button>
                </div>
            </form>
        </div>
    );
}
