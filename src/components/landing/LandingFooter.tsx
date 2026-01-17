import React from 'react';
import { Sparkles } from 'lucide-react';

export const LandingFooter: React.FC = () => {
    return (
        <footer>
            <div className="max-w-7xl mx-auto px-6 py-8">
                <div className="flex items-center justify-between">
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
