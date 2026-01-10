import React from 'react';
import { Settings } from 'lucide-react';
import { Agent } from '../../types';
import { AgentCard } from '../agents/AgentCard';
import { IconButton } from '../ui/IconButton';

interface SidebarProps {
  agents: Agent[];
  selectedAgentId: string | null;
  onSelectAgent: (agentId: string) => void;
  onOpenSettings: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  agents,
  selectedAgentId,
  onSelectAgent,
  onOpenSettings,
}) => {
  return (
    <aside className="w-80 bg-slate-50 border-r border-slate-200 flex flex-col h-screen">
      <div className="p-6 border-b border-slate-200">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-2xl font-bold text-slate-900">AI Agents</h1>
          <IconButton
            icon={<Settings size={20} />}
            onClick={onOpenSettings}
            label="Settings"
            className="hover:bg-slate-200"
          />
        </div>
        <p className="text-sm text-slate-600">
          Selecciona un agente para comenzar
        </p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {agents.map((agent) => (
          <AgentCard
            key={agent.id}
            agent={agent}
            isActive={selectedAgentId === agent.id}
            onClick={() => onSelectAgent(agent.id)}
          />
        ))}
      </div>

      <div className="p-4 border-t border-slate-200">
        <div className="text-xs text-slate-500 text-center">
          <p>Powered by OpenAI & Gemini</p>
        </div>
      </div>
    </aside>
  );
};
