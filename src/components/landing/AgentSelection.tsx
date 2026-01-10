import React from 'react';
import { Agent, Category } from '../../types';
import * as Icons from 'lucide-react';
import { ArrowLeft } from 'lucide-react';
import { IconButton } from '../ui/IconButton';
import { getCategoryIcon } from '../icons/CategoryIcons';

interface AgentSelectionProps {
  category: Category;
  agents: Agent[];
  onSelectAgent: (agentId: string) => void;
  onBack: () => void;
}

export const AgentSelection: React.FC<AgentSelectionProps> = ({
  category,
  agents,
  onSelectAgent,
  onBack,
}) => {
  const CategoryIcon = getCategoryIcon(category.id);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 flex flex-col">
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center gap-4 mb-4">
            <IconButton
              icon={<ArrowLeft size={20} />}
              onClick={onBack}
              label="Volver"
              className="hover:bg-slate-200"
            />
            <div className={`w-12 h-12 bg-gradient-to-br ${category.color} rounded-xl flex items-center justify-center shadow-lg`}>
              <CategoryIcon size={24} className="text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">{category.name}</h1>
              <p className="text-sm text-slate-600">{category.description}</p>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="mb-8">
            <p className="text-slate-600">
              Selecciona el agente especializado que mejor se ajuste a tu necesidad
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {agents.map((agent) => {
              const Icon = Icons[agent.icon as keyof typeof Icons] as React.ComponentType<{
                size?: number;
                className?: string;
              }>;

              return (
                <button
                  key={agent.id}
                  onClick={() => onSelectAgent(agent.id)}
                  className="group bg-white p-6 rounded-2xl border-2 border-slate-200 hover:border-slate-400 hover:shadow-xl transition-all text-left"
                >
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-slate-100 rounded-xl flex-shrink-0 group-hover:bg-slate-900 transition-colors">
                      {Icon && <Icon size={24} className="text-slate-700 group-hover:text-white transition-colors" />}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-slate-800">
                        {agent.name}
                      </h3>
                      <p className="text-sm text-slate-600 leading-relaxed mb-3">
                        {agent.description}
                      </p>
                      <div className="flex items-center gap-2">
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          agent.model === 'openai'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-blue-100 text-blue-700'
                        }`}>
                          {agent.model === 'openai' ? 'OpenAI' : 'Gemini'}
                        </span>
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
};
