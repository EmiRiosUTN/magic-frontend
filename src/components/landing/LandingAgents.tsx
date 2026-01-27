import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Button } from '../ui/Button';
import { AGENTS } from '../../constants/agents';
import * as Icons from 'lucide-react';

interface LandingAgentsProps {
    onEnter: () => void;
}

export const LandingAgents: React.FC<LandingAgentsProps> = ({ onEnter }) => {
    const topAgents = AGENTS.slice(0, 6);

    return (
        <section className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-10">
            <div className="text-center mb-8 md:mb-12">
                <h2 className="text-2xl md:text-4xl font-bold text-oyster mb-4">
                    Agentes especializados
                </h2>
                <p className="text-base md:text-lg text-oyster/70">
                    Cada uno experto en su área, listos para ayudarte
                </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {topAgents.map((agent) => {
                    const Icon = Icons[agent.icon as keyof typeof Icons] as React.ComponentType<{
                        size?: number;
                        className?: string;
                    }>;

                    return (
                        <div
                            key={agent.id}
                            className="bg-plum/30 p-5 md:p-6 rounded-2xl hover:shadow-lg hover:scale-105 transition-all relative overflow-hidden"
                        >
                            <div className="absolute top-0 left-0 w-full h-[100px] pointer-events-none bg-gradient-to-b from-grafite/40 to-transparent" />

                            <div className="relative z-10 flex items-start gap-4">
                                <div className="p-3 bg-swirl rounded-xl flex-shrink-0">
                                    {Icon && <Icon size={24} className="text-oyster" />}
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-swirl mb-2">
                                        {agent.name}
                                    </h3>
                                    <p className="text-sm text-swirl/70 leading-relaxed">
                                        {agent.description}
                                    </p>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="text-center mt-8 md:mt-12">
                <Button onClick={onEnter} variant="secondary" size="lg" className="w-full md:w-auto">
                    Ver todos los agentes
                    <ArrowRight size={20} className="ml-2" />
                </Button>
            </div>
        </section>
    );
};
