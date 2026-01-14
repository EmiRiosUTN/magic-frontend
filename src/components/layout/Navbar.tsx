import React from 'react';
import { LogOut, Shield, ListTodo, Settings } from 'lucide-react';
import { Button } from '../ui/Button';

interface NavbarProps {
    userRole?: string;
    onLogout: () => void;
    onAdminClick: () => void;
    onLogoClick?: () => void;
    onTasksClick?: () => void;
    onSettingsClick?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ userRole, onLogout, onAdminClick, onLogoClick, onTasksClick, onSettingsClick }) => {
    return (
        <nav className="bg-white shadow-sm border-b border-slate-200 px-4 py-3 fixed top-0 left-0 w-full z-50 h-16">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
                <div className="flex items-center">
                    <h1
                        onClick={onLogoClick}
                        className="font-merriweather text-xl font-bold text-slate-800 cursor-pointer hover:text-blue-600 transition-colors"
                    >
                        Multi-Agent AI
                    </h1>
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        variant="ghost"
                        onClick={onTasksClick}
                        className="text-slate-600 hover:text-slate-900"
                    >
                        <ListTodo size={20} className="mr-2" />
                        Tareas
                    </Button>
                    {userRole === 'ADMIN' && (
                        <Button
                            variant="ghost"
                            onClick={onAdminClick}
                            className="text-slate-600 hover:text-slate-900"
                        >
                            <Shield size={20} className="mr-2" />
                            Admin
                        </Button>
                    )}
                    <Button
                        variant="ghost"
                        onClick={onSettingsClick}
                        className="text-slate-600 hover:text-slate-900"
                    >
                        <Settings size={20} className="mr-2" />
                        Configuración
                    </Button>
                    <div className="h-6 w-px bg-slate-200 mx-2" />
                    <Button
                        variant="ghost"
                        onClick={onLogout}
                        className="text-slate-600 hover:text-slate-900"
                    >
                        <LogOut size={20} className="mr-2" />
                        Salir
                    </Button>
                </div>
            </div>
        </nav>
    );
};
