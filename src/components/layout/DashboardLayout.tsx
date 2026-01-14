import React, { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Navbar } from './Navbar';
import { useAuth } from '../../contexts/AuthContext';
import { SettingsModal } from '../settings/SettingsModal';

export const DashboardLayout: React.FC = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);

    return (
        <div className="min-h-screen bg-slate-50 pt-16">
            <Navbar
                userRole={user?.role}
                onLogout={() => {
                    logout();
                    navigate('/login');
                }}
                onAdminClick={() => navigate('/admin')}
                onLogoClick={() => navigate('/')}
                onTasksClick={() => navigate('/tasks')}
                onSettingsClick={() => setIsSettingsOpen(true)}
            />
            <Outlet />
            <SettingsModal
                isOpen={isSettingsOpen}
                onClose={() => setIsSettingsOpen(false)}
            />
        </div>
    );
};
