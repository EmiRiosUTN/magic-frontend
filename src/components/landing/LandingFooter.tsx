import React from 'react';
import { Sparkles } from 'lucide-react';

export const LandingFooter: React.FC = () => {
    return (
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
    );
};
