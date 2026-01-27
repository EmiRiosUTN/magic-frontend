import React from 'react';
import { Sparkles } from 'lucide-react';

export const LandingFooter: React.FC = () => {
    return (
        <footer>
            <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-8">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4 md:gap-0">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-grafite rounded-lg flex items-center justify-center">
                            <Sparkles size={16} className="text-swirl" />
                        </div>
                        <span className="font-semibold text-swirl">AI Agents</span>
                    </div>
                    <p className="text-sm text-swirl">
                        Powered by OpenAI & Gemini
                    </p>
                </div>
            </div>
        </footer>
    );
};
