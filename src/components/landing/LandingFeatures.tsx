import React from 'react';
import { Zap, Shield, Globe } from 'lucide-react';

export const LandingFeatures: React.FC = () => {
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

    return (
        <section className="max-w-7xl mx-auto px-6 py-10">
            <div className="grid md:grid-cols-3 gap-10">
                {features.map((feature, index) => {
                    const Icon = feature.icon;
                    return (
                        <div
                            key={index}
                            className="bg-neutral-900 p-8 rounded-2xl hover:scale-105 transition-all"
                        >
                            <div className="flex flex-row items-center gap-3 mb-2">
                                <div className="w-10 h-10 bg-swirl rounded-xl flex items-center justify-center">
                                    <Icon size={24} className="text-grafite" />
                                </div>
                                <h3 className="text-xl font-semibold text-swirl">
                                    {feature.title}
                                </h3>
                            </div>
                            <p className="text-swirl/70 text-sm leading-relaxed">
                                {feature.description}
                            </p>
                        </div>
                    );
                })}
            </div>
        </section>
    );
};
