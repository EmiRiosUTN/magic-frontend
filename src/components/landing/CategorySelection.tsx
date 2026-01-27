import React from 'react';
import { Category } from '../../types';
import * as Icons from 'lucide-react';
import { useTranslation } from '../../hooks/useTranslation';
import { SearchBar } from '../search/SearchBar';

interface CategorySelectionProps {
  categories: Category[];
  onSelectCategory: (categoryId: string) => void;
  onSelectAgent: (agentId: string) => void;
}

const getCategoryClasses = (icon: string) => {
  const classMap: Record<string, { gradient: string; text: string; border: string; hover: string }> = {
    'Image': {
      gradient: 'bg-gradient-to-br from-blue-700 to-blue-600',
      text: 'text-blue-700',
      border: 'border-blue-700',
      hover: 'hover:border-blue-700 hover:border-t-4 hover:from-blue-700 hover:to-blue-600'
    },
    'Pencil': {
      gradient: 'bg-gradient-to-br from-green-700 to-green-600',
      text: 'text-green-700',
      border: 'border-green-700',
      hover: 'hover:border-green-700 hover:border-t-4 hover:from-green-700 hover:to-green-600'
    },
    'Code': {
      gradient: 'bg-gradient-to-br from-red-700 to-red-600',
      text: 'text-red-700',
      border: 'border-red-700',
      hover: 'hover:border-red-700 hover:border-t-4 hover:from-red-700 hover:to-red-600'
    },
    'BarChart3': {
      gradient: 'bg-gradient-to-br from-purple-700 to-purple-600',
      text: 'text-purple-700',
      border: 'border-purple-700',
      hover: 'hover:border-purple-700 hover:border-t-4 hover:from-purple-700 hover:to-purple-600'
    },
    'Smartphone': {
      gradient: 'bg-gradient-to-br from-indigo-700 to-indigo-600',
      text: 'text-indigo-700',
      border: 'border-indigo-700',
      hover: 'hover:border-indigo-700 hover:border-t-4 hover:from-indigo-700 hover:to-indigo-600'
    },
    'Video': {
      gradient: 'bg-gradient-to-br from-teal-700 to-teal-600',
      text: 'text-teal-700',
      border: 'border-teal-700',
      hover: 'hover:border-teal-700 hover:border-t-4 hover:from-teal-700 hover:to-teal-600'
    },
  };

  return classMap[icon] || {
    gradient: 'bg-gradient-to-br from-slate-500 to-slate-400',
    text: 'text-slate-500',
    border: 'border-slate-500',
    hover: 'hover:border-slate-500 hover:border-t-4'
  };
};

export const CategorySelection: React.FC<CategorySelectionProps> = ({
  categories,
  onSelectCategory,
  onSelectAgent,
}) => {
  const { t } = useTranslation();
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-grafite via-[#3d2d37] to-[#4a3a44]">
      <header>
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 md:py-6">
          <div className="text-center">
            <h1 className="text-3xl md:text-5xl font-light text-swirl mb-2 font-inter">
              {t('selectCategory')}
            </h1>
            <p className="text-haze font-roboto mb-6 text-sm md:text-base">
              {t('selectCategoryDesc')}
            </p>
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <SearchBar
                onSelectAgent={onSelectAgent}
                placeholder="Buscar agente... (ej: redactor de mails)"
              />
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {categories.map((category) => {
              const Icon = Icons[category.icon as keyof typeof Icons] as React.ComponentType<{
                size?: number;
                className?: string;
              }>;

              const classes = getCategoryClasses(category.icon);

              return (
                <button
                  key={category.id}
                  onClick={() => onSelectCategory(category.id)}
                  className={`group relative bg-grafite p-6 md:p-8 rounded-2xl ${classes.hover} transition-all text-left overflow-hidden`}
                >
                  <div className={`absolute inset-0 ${classes.gradient} opacity-0 group-hover:opacity-5 transition-opacity`} />

                  <div className="relative">
                    <div className={`w-14 h-14 ${classes.gradient} rounded-xl flex items-center justify-center mb-4 shadow-lg`}>
                      {Icon && <Icon size={28} className="text-white" />}
                    </div>

                    <h3 className="text-xl font-medium text-swirl mb-2 font-inter">
                      {category.name}
                    </h3>
                    <p className="text-sm text-haze leading-relaxed font-roboto">
                      {category.description}
                    </p>

                    <div className={`mt-6 flex items-center text-sm font-medium ${classes.text} transition-colors`}>
                      <span>{t('viewAgents')}</span>
                      <svg
                        className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
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
