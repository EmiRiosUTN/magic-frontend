import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Button } from '../ui/Button';

interface LandingCTAProps {
    onEnter: () => void;
}

export const LandingCTA: React.FC<LandingCTAProps> = ({ onEnter }) => {
    return (
        <section className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-10 mb-6 md:mb-10">
            <div className="bg-gradient-to-br from-grafite via-neutral-900 to-neutral-800 rounded-3xl p-6 md:p-16 text-center">
                <h2 className="text-2xl md:text-4xl font-bold text-oyster mb-4">
                    Listo para comenzar?
                </h2>
                <p className="text-base md:text-lg text-oyster/70 mb-8 max-w-2xl mx-auto">
                    Configura tus API keys y empieza a trabajar con los mejores
                    modelos de IA del mercado
                </p>
                <Button
                    onClick={onEnter}
                    variant="secondary"
                    size="lg"
                    className="bg-swirl text-grafite hover:bg-swirl/90 w-full md:w-auto"
                >
                    Acceder a la plataforma
                    <ArrowRight size={20} className="ml-2" />
                </Button>
            </div>
        </section>
    );
};
