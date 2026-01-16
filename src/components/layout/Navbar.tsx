import React from 'react';
import { LogOut, Shield, ListTodo, Settings } from 'lucide-react';
import { Button } from '../ui/Button';
import { useTranslation } from '../../hooks/useTranslation';

interface NavbarProps {
    userRole?: string;
    onLogout?: () => void;
    onAdminClick?: () => void;
    onLogoClick?: () => void;
    onTasksClick?: () => void;
    onSettingsClick?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ userRole, onLogout, onAdminClick, onLogoClick, onTasksClick, onSettingsClick }) => {
    const { t } = useTranslation();
    return (
        <nav className="bg-[#1B1B1B] drop-shadow-sm drop-shadow-black px-4 py-3 fixed top-0 left-0 w-full z-50 h-16">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
                <div className="flex items-center">
                    <h1
                        onClick={onLogoClick}
                        className="font-merriweather text-xl font-bold text-plum cursor-pointer hover:text-swirl transition-colors"
                    >
                        Multi-Agent AI
                    </h1>
                </div>
                <div className="flex items-center gap-2">
                    {userRole && (
                        <>
                            <Button
                                onClick={onTasksClick}
                                className="text-swirl hover:text-plum bg-transparent hover:bg-transparent"
                            >
                                <ListTodo size={20} className="mr-2" />
                                {t('tasks')}
                            </Button>
                            {userRole === 'ADMIN' && (
                                <Button
                                    onClick={onAdminClick}
                                    className="text-swirl hover:text-plum bg-transparent hover:bg-transparent"
                                >
                                    <Shield size={20} className="mr-2" />
                                    {t('admin')}
                                </Button>
                            )}
                            <Button
                                onClick={onSettingsClick}
                                className="text-swirl hover:text-plum bg-transparent hover:bg-transparent"
                            >
                                <Settings size={20} className="mr-2" />
                                {t('settings')}
                            </Button>
                            <div className="h-6 w-px bg-brass mx-2" />
                            <Button
                                onClick={onLogout}
                                className="text-swirl hover:text-plum bg-transparent hover:bg-transparent"
                            >
                                <LogOut size={20} className="mr-2" />
                                {t('logout')}
                            </Button>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};
