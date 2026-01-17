import { useState, useEffect, useRef } from 'react';
import { Search, X, Loader2 } from 'lucide-react';
import { searchService, SearchResult } from '../../services/searchService';
import { useTranslation } from '../../hooks/useTranslation';

interface SearchBarProps {
    onSelectAgent: (agentId: string) => void;
    placeholder?: string;
    categoryId?: string; // Optional: filter by category
}

export function SearchBar({ onSelectAgent, placeholder, categoryId }: SearchBarProps) {
    const { language } = useTranslation();
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<SearchResult[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const searchRef = useRef<HTMLDivElement>(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Debounced search
    useEffect(() => {
        if (query.length < 3) {
            setResults([]);
            setIsOpen(false);
            return;
        }

        setIsLoading(true);
        const timer = setTimeout(async () => {
            try {
                const searchResults = await searchService.searchAgents(query, 10);

                // Filter by category if specified
                const filteredResults = categoryId
                    ? searchResults.filter(r => r.categoryId === categoryId)
                    : searchResults;

                setResults(filteredResults);
                setIsOpen(filteredResults.length > 0);
            } catch (error) {
                console.error('Search error:', error);
                setResults([]);
            } finally {
                setIsLoading(false);
            }
        }, 300); // 300ms debounce

        return () => clearTimeout(timer);
    }, [query, categoryId]);

    const handleSelectAgent = (agentId: string) => {
        onSelectAgent(agentId);
        setQuery('');
        setIsOpen(false);
    };

    const handleClear = () => {
        setQuery('');
        setResults([]);
        setIsOpen(false);
    };

    return (
        <div ref={searchRef} className="relative w-full">
            {/* Search Input */}
            <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-haze" size={20} />
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder={placeholder || 'Buscar agente... (ej: redactor de mails)'}
                    className="w-full pl-12 pr-12 py-3 bg-smoke text-oyster placeholder:text-nevada rounded-lg border border-haze/30 focus:outline-none focus:ring-2 focus:ring-copper focus:border-transparent transition-all"
                />
                {query && (
                    <button
                        onClick={handleClear}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-haze hover:text-oyster transition-colors"
                    >
                        <X size={20} />
                    </button>
                )}
                {isLoading && (
                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                        <Loader2 className="animate-spin text-copper" size={20} />
                    </div>
                )}
            </div>

            {/* Results Dropdown */}
            {isOpen && results.length > 0 && (
                <div className="absolute top-full mt-2 w-full bg-smoke rounded-lg shadow-2xl border border-haze/30 max-h-96 overflow-y-auto z-50">
                    {results.map((agent) => (
                        <button
                            key={agent.id}
                            onClick={() => handleSelectAgent(agent.id)}
                            className="w-full p-4 hover:bg-haze/30 transition-colors text-left border-b border-haze/20 last:border-b-0"
                        >
                            <div className="flex items-start justify-between gap-3">
                                <div className="flex-1 min-w-0">
                                    <h4 className="text-oyster font-medium truncate">
                                        {language === 'en' ? agent.nameEn : agent.nameEs}
                                    </h4>
                                    <p className="text-nevada text-sm mt-1 line-clamp-2">
                                        {language === 'en' ? agent.descriptionEn : agent.descriptionEs}
                                    </p>
                                </div>
                                <div className="flex-shrink-0">
                                    <span className="text-xs text-copper font-medium bg-copper/10 px-2 py-1 rounded">
                                        {(agent.similarity * 100).toFixed(0)}%
                                    </span>
                                </div>
                            </div>
                        </button>
                    ))}
                </div>
            )}

            {/* No Results */}
            {isOpen && query.length >= 3 && results.length === 0 && !isLoading && (
                <div className="absolute top-full mt-2 w-full bg-smoke rounded-lg shadow-2xl border border-haze/30 p-6 text-center z-50">
                    <p className="text-nevada">
                        No se encontraron agentes
                    </p>
                    <p className="text-haze text-sm mt-1">
                        Intenta con otra búsqueda
                    </p>
                </div>
            )}
        </div>
    );
}
