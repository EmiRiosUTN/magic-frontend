import React from 'react';
import { Agent, Category } from '../../types';
import * as Icons from 'lucide-react';
import { ArrowLeft } from 'lucide-react';
import { IconButton } from '../ui/IconButton';
import { useTranslation } from '../../hooks/useTranslation';
import { SearchBar } from '../search/SearchBar';

interface AgentSelectionProps {
  category: Category;
  agents: Agent[];
  onSelectAgent: (agentId: string) => void;
  onBack: () => void;
  categoryId?: string;
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
  categoryId,
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
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 md:py-6">
          <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
            <div className="flex items-center gap-4">
              <IconButton
                icon={<ArrowLeft size={20} />}
                onClick={onBack}
                label="Volver"
                className="text-swirl hover:bg-transparent hover:text-swirl/80"
              />
              <div className={`w-12 h-12 ${gradientClass} rounded-xl flex items-center justify-center shadow-lg`}>
                {CategoryIcon && <CategoryIcon size={24} className="text-swirl" />}
              </div>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-swirl">{category.name}</h1>
              <p className="text-sm text-swirl/80">{category.description}</p>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto px-4 md:px-6 pb-8">
          <div className="mb-6 md:mb-8">
            <p className="text-haze mb-4 text-sm md:text-base">
              {t('selectAgentDesc')}
            </p>
            {/* Search Bar */}
            <SearchBar
              onSelectAgent={onSelectAgent}
              placeholder={`Buscar en ${category.name}...`}
              categoryId={categoryId}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {agents
              .sort((a, b) => {
                // Force "Generar vídeos" (Veo) to be first
                const videoAgentId = '00000000-0000-0000-0000-000000000003';
                if (a.id === videoAgentId) return -1;
                if (b.id === videoAgentId) return 1;
                return 0;
              })
              .map((agent) => {
                const Icon = Icons[agent.icon as keyof typeof Icons] as React.ComponentType<{
                  size?: number;
                  className?: string;
                }>;

                return (
                  <button
                    key={agent.id}
                    onClick={() => onSelectAgent(agent.id)}
                    className="group bg-neutral-900 p-4 md:p-6 rounded-2xl hover:shadow-xl transition-all text-left"
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
