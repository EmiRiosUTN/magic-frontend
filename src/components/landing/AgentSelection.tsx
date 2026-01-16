import React from 'react';
import { Agent, Category } from '../../types';
import * as Icons from 'lucide-react';
import { ArrowLeft } from 'lucide-react';
import { IconButton } from '../ui/IconButton';
import { useTranslation } from '../../hooks/useTranslation';

interface AgentSelectionProps {
  category: Category;
  agents: Agent[];
  onSelectAgent: (agentId: string) => void;
  onBack: () => void;
}

// Helper function to get complete Tailwind gradient class
const getCategoryGradient = (icon: string) => {
  const gradientMap: Record<string, string> = {
    'Image': 'bg-gradient-to-br from-blue-700 to-blue-600',
    'Pencil': 'bg-gradient-to-br from-green-700 to-green-600',
    'Code': 'bg-gradient-to-br from-red-700 to-red-600',
    'BarChart3': 'bg-gradient-to-br from-purple-700 to-purple-600',
    'Smartphone': 'bg-gradient-to-br from-indigo-700 to-indigo-600',
    'Video': 'bg-gradient-to-br from-teal-700 to-teal-600',
  };
  return gradientMap[icon] || 'bg-gradient-to-br from-slate-500 to-slate-400';
};

export const AgentSelection: React.FC<AgentSelectionProps> = ({
  category,
  agents,
  onSelectAgent,
  onBack,
}) => {
  const { t } = useTranslation();

  // Get category icon from lucide-react
  const CategoryIcon = Icons[category.icon as keyof typeof Icons] as React.ComponentType<{
    size?: number;
    className?: string;
  }>;

  const gradientClass = getCategoryGradient(category.icon);

  return (
    <div className="min-h-screen bg-grafite flex flex-col">
      <header>
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center gap-4 mb-4">
            <IconButton
              icon={<ArrowLeft size={20} />}
              onClick={onBack}
              label="Volver"
              className="text-swirl hover:bg-transparent hover:text-swirl/80"
            />
            <div className={`w-12 h-12 ${gradientClass} rounded-xl flex items-center justify-center shadow-lg`}>
              {CategoryIcon && <CategoryIcon size={24} className="text-swirl" />}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-swirl">{category.name}</h1>
              <p className="text-sm text-swirl">{category.description}</p>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-8">
            <p className="text-haze">
              {t('selectAgentDesc')}
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
                  className="group bg-neutral-900 p-6 rounded-2xl hover:shadow-xl transition-all text-left"
                >
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-swirl rounded-xl flex-shrink-0 group-hover:bg-plum transition-colors">
                      {Icon && <Icon size={24} className="text-slate-700 transition-colors" />}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-swirl mb-2 group-hover:text-plum">
                        {agent.name}
                      </h3>
                      <p className="text-sm text-haze leading-relaxed mb-3">
                        {agent.description}
                      </p>
                      <div className="flex items-center gap-2">
                        <span className={`text-xs px-2 py-1 rounded-full ${agent.model === 'openai'
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
