import React from 'react';
import { Category } from '../../types';
import { getCategoryConfig } from '../../config/categoryConfig';


interface CategorySelectionProps {
  categories: Category[];
  onSelectCategory: (categoryId: string) => void;
}

export const CategorySelection: React.FC<CategorySelectionProps> = ({
  categories,
  onSelectCategory,
}) => {
  return (
    <div className="min-h-screen page-bg flex flex-col">
      <header>
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="text-center">
            <h1 className="text-5xl font-bold text-slate-700 mb-2 font-ubuntu">
              Selecciona una categoría
            </h1>
            <p className="text-slate-600 font-roboto">
              Elige el tipo de agente que necesitas para tu tarea
            </p>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category) => {
              const { icon: Icon, textColor, borderColor } = getCategoryConfig(category.name);

              return (
                <button
                  key={category.id}
                  onClick={() => onSelectCategory(category.id)}
                  className={`group relative bg-white p-8 rounded-2xl ${borderColor} transition-all text-left overflow-hidden`}
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-0 group-hover:opacity-5 transition-opacity`} />

                  <div className="relative">
                    <div className={`w-14 h-14 bg-gradient-to-br ${category.color} rounded-xl flex items-center justify-center mb-4 shadow-lg`}>
                      <Icon size={28} className="text-white" />
                    </div>

                    <h3 className="text-xl font-bold text-slate-900 mb-2 font-ubuntu">
                      {category.name}
                    </h3>
                    <p className="text-sm text-slate-600 leading-relaxed font-roboto">
                      {category.description}
                    </p>

                    <div className={`mt-6 flex items-center text-sm font-medium ${textColor} transition-colors`}>
                      <span>Ver agentes</span>
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
