import React from 'react';
import { LogOut, Shield } from 'lucide-react';
import { Button } from '../ui/Button';

interface NavbarProps {
    userRole?: string;
    onLogout: () => void;
    onAdminClick: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ userRole, onLogout, onAdminClick }) => {
    return (
        <nav className="bg-white shadow-sm border-b border-slate-200 px-4 py-3 sticky top-0 z-40">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
                <div className="flex items-center">
                    <h1 className="font-merriweather text-xl font-bold text-slate-800">
                        Multi-Agent AI
                    </h1>
                </div>
                <div className="flex items-center gap-2">
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
