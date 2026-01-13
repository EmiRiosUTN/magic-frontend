import React, { useState } from 'react';
import { Users, FolderKanban, Bot, ArrowLeft, Mail } from 'lucide-react';
import { IconButton } from '../ui/IconButton';
import { UserManagement } from './UserManagement';
import { CategoryManagement } from './CategoryManagement';
import { AgentManagement } from './AgentManagement';
import { EmailConfig } from './EmailConfig';

type AdminTab = 'users' | 'categories' | 'agents' | 'email';

interface AdminPanelProps {
  onBack: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState<AdminTab>('users');

  const tabs = [
    { id: 'users' as AdminTab, label: 'Usuarios', icon: Users },
    { id: 'categories' as AdminTab, label: 'Categorías', icon: FolderKanban },
    { id: 'agents' as AdminTab, label: 'Agentes', icon: Bot },
    { id: 'email' as AdminTab, label: 'Email', icon: Mail },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 flex flex-col">
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center gap-4">
            <IconButton
              icon={<ArrowLeft size={20} />}
              onClick={onBack}
              label="Volver"
              className="hover:bg-slate-200"
            />
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Panel de Administración</h1>
              <p className="text-sm text-slate-600">Gestiona usuarios, categorías, agentes y configuración</p>
            </div>
          </div>

          <div className="flex gap-2 mt-6">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${activeTab === tab.id
                    ? 'bg-slate-900 text-white'
                    : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                    }`}
                >
                  <Icon size={18} />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto px-6 py-8">
          {activeTab === 'users' && <UserManagement />}
          {activeTab === 'categories' && <CategoryManagement />}
          {activeTab === 'agents' && <AgentManagement />}
          {activeTab === 'email' && <EmailConfig />}
        </div>
      </main>
    </div>
  );
};
