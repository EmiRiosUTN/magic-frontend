import React from 'react';
import { Agent } from '../../types';
import * as Icons from 'lucide-react';

interface AgentCardProps {
  agent: Agent;
  isActive: boolean;
  onClick: () => void;
}

export const AgentCard: React.FC<AgentCardProps> = ({ agent, isActive, onClick }) => {
  const Icon = Icons[agent.icon as keyof typeof Icons] as React.ComponentType<{ size?: number; className?: string }>;

  return (
    <button
      onClick={onClick}
      className={`w-full text-left p-4 rounded-xl transition-all ${
        isActive
          ? 'bg-slate-900 text-white shadow-lg'
          : 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-200'
      }`}
    >
      <div className="flex items-start gap-3">
        <div
          className={`p-2 rounded-lg ${
            isActive ? 'bg-white/10' : 'bg-slate-100'
          }`}
        >
          {Icon && <Icon size={20} className={isActive ? 'text-white' : 'text-slate-700'} />}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className={`font-semibold text-sm mb-1 ${isActive ? 'text-white' : 'text-slate-900'}`}>
            {agent.name}
          </h3>
          <p className={`text-xs line-clamp-2 ${isActive ? 'text-slate-300' : 'text-slate-500'}`}>
            {agent.description}
          </p>
        </div>
      </div>
    </button>
  );
};
