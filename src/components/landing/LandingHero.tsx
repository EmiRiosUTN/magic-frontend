import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '../ui/Button';

interface LandingHeroProps {
    onEnter: () => void;
}

export const LandingHero: React.FC<LandingHeroProps> = ({ onEnter }) => {
    return (
        <section className="max-w-7xl mx-auto px-6 py-10">
            <div className="text-center max-w-3xl mx-auto">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900/5 rounded-full mb-8">
                    <Sparkles size={16} className="text-plum" />
                    <span className="text-sm font-medium text-swirl">
                        Powered by OpenAI & Gemini
                    </span>
                </div>

                <h1 className="text-5xl font-bold text-swirl/70 mb-4 leading-tight font-inter">
                    Tu equipo de agentes de IA
                    <span className="block text-swirl">siempre disponible</span>
                </h1>

                <p className="text-lg text-swirl mb-10 leading-relaxed">
                    Accede a especialistas en redacción, código, diseño y análisis de datos.
                    Todo en una plataforma moderna y fácil de usar.
                </p>

                <div className="flex items-center justify-center gap-4">
                    <Button onClick={onEnter} size="lg" className="gap-2 bg-plum font-inter font-semibold hover:bg-plum/80">
                        Comenzar ahora
                        <ArrowRight size={20} />
                    </Button>
                </div>
            </div>
        </section>
    );
};
