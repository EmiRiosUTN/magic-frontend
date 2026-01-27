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
    const [isMenuOpen, setIsMenuOpen] = React.useState(false);

    return (
        <nav className="bg-[#1B1B1B] drop-shadow-sm drop-shadow-black px-4 py-3 fixed top-0 left-0 w-full z-50 h-16">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
                <div className="flex items-center">
                    <div
                        onClick={onLogoClick}
                        className="flex items-center gap-2 cursor-pointer group"
                    >
                        <img
                            src="/images/logo-11.webp"
                            alt="Logo"
                            className="h-10 w-auto object-contain transition-transform group-hover:scale-105"
                        />
                    </div>
                </div>

                {/* Desktop Menu */}
                <div className="hidden md:flex items-center gap-2">
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

                {/* Mobile Menu Toggle */}
                <div className="md:hidden flex items-center">
                    {userRole && (
                        <Button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="text-swirl bg-transparent hover:bg-white/10 p-2"
                        >
                            {isMenuOpen ? <LogOut size={24} className="rotate-180" /> : <Settings size={24} />}
                        </Button>
                    )}
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            {isMenuOpen && userRole && (
                <div className="md:hidden absolute top-16 left-0 w-full bg-[#1B1B1B] border-t border-white/10 shadow-lg flex flex-col p-4 gap-2">
                    <Button
                        onClick={() => {
                            onTasksClick?.();
                            setIsMenuOpen(false);
                        }}
                        className="text-swirl hover:text-plum bg-transparent hover:bg-white/5 justify-start"
                    >
                        <ListTodo size={20} className="mr-3" />
                        {t('tasks')}
                    </Button>

                    {userRole === 'ADMIN' && (
                        <Button
                            onClick={() => {
                                onAdminClick?.();
                                setIsMenuOpen(false);
                            }}
                            className="text-swirl hover:text-plum bg-transparent hover:bg-white/5 justify-start"
                        >
                            <Shield size={20} className="mr-3" />
                            {t('admin')}
                        </Button>
                    )}

                    <Button
                        onClick={() => {
                            onSettingsClick?.();
                            setIsMenuOpen(false);
                        }}
                        className="text-swirl hover:text-plum bg-transparent hover:bg-white/5 justify-start"
                    >
                        <Settings size={20} className="mr-3" />
                        {t('settings')}
                    </Button>

                    <div className="h-px w-full bg-white/10 my-1" />

                    <Button
                        onClick={() => {
                            onLogout?.();
                            setIsMenuOpen(false);
                        }}
                        className="text-swirl hover:text-plum bg-transparent hover:bg-white/5 justify-start"
                    >
                        <LogOut size={20} className="mr-3" />
                        {t('logout')}
                    </Button>
                </div>
            )}
        </nav>
    );
};
