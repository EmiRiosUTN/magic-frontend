import React from 'react';
import { ArrowRight, Sparkles, Zap, Shield, Globe } from 'lucide-react';
import { Button } from '../ui/Button';
import { AGENTS } from '../../constants/agents';
import * as Icons from 'lucide-react';

interface LandingPageProps {
  onEnter: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onEnter }) => {
  const features = [
    {
      icon: Zap,
      title: 'Potencia Instantánea',
      description: 'Accede a múltiples modelos de IA en un solo lugar',
    },
    {
      icon: Shield,
      title: 'Seguro y Privado',
      description: 'Tus datos y API keys se guardan localmente',
    },
    {
      icon: Globe,
      title: 'Multimodal',
      description: 'Texto, imágenes, código y más en una plataforma',
    },
  ];

  const topAgents = AGENTS.slice(0, 6);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <nav className="border-b border-slate-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center">
              <Sparkles size={20} className="text-white" />
            </div>
            <span className="text-xl font-bold text-slate-900">AI Agents</span>
          </div>
          <Button onClick={onEnter} variant="ghost" size="sm">
            Entrar
            <ArrowRight size={16} className="ml-2" />
          </Button>
        </div>
      </nav>

      <main>
        <section className="max-w-7xl mx-auto px-6 py-20 md:py-32">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900/5 rounded-full mb-8">
              <Sparkles size={16} className="text-slate-700" />
              <span className="text-sm font-medium text-slate-700">
                Powered by OpenAI & Gemini
              </span>
            </div>

            <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-6 leading-tight">
              Tu equipo de agentes de IA
              <span className="block text-slate-600">siempre disponible</span>
            </h1>

            <p className="text-lg text-slate-600 mb-10 leading-relaxed">
              Accede a especialistas en redacción, código, diseño y análisis de datos.
              Todo en una plataforma moderna y fácil de usar.
            </p>

            <div className="flex items-center justify-center gap-4">
              <Button onClick={onEnter} size="lg" className="gap-2">
                Comenzar ahora
                <ArrowRight size={20} />
              </Button>
            </div>
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-6 py-16">
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="bg-white p-8 rounded-2xl border border-slate-200 hover:border-slate-300 transition-colors"
                >
                  <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center mb-4">
                    <Icon size={24} className="text-slate-700" />
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-slate-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-6 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Agentes especializados
            </h2>
            <p className="text-lg text-slate-600">
              Cada uno experto en su área, listos para ayudarte
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {topAgents.map((agent) => {
              const Icon = Icons[agent.icon as keyof typeof Icons] as React.ComponentType<{
                size?: number;
                className?: string;
              }>;

              return (
                <div
                  key={agent.id}
                  className="bg-white p-6 rounded-2xl border border-slate-200 hover:shadow-lg hover:border-slate-300 transition-all"
                >
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-slate-100 rounded-xl flex-shrink-0">
                      {Icon && <Icon size={24} className="text-slate-700" />}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900 mb-2">
                        {agent.name}
                      </h3>
                      <p className="text-sm text-slate-600 leading-relaxed">
                        {agent.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="text-center mt-12">
            <Button onClick={onEnter} variant="secondary" size="lg">
              Ver todos los agentes
              <ArrowRight size={20} className="ml-2" />
            </Button>
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-6 py-20 mb-20">
          <div className="bg-slate-900 rounded-3xl p-12 md:p-16 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Listo para comenzar?
            </h2>
            <p className="text-lg text-slate-300 mb-8 max-w-2xl mx-auto">
              Configura tus API keys y empieza a trabajar con los mejores
              modelos de IA del mercado
            </p>
            <Button
              onClick={onEnter}
              variant="secondary"
              size="lg"
              className="bg-white text-slate-900 hover:bg-slate-100"
            >
              Acceder a la plataforma
              <ArrowRight size={20} className="ml-2" />
            </Button>
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center">
                <Sparkles size={16} className="text-white" />
              </div>
              <span className="font-semibold text-slate-900">AI Agents</span>
            </div>
            <p className="text-sm text-slate-500">
              Powered by OpenAI & Gemini
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};
