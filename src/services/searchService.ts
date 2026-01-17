import { api } from './api';

export interface SearchResult {
    id: string;
    categoryId: string;
    nameEs: string;
    nameEn: string;
    descriptionEs: string | null;
    descriptionEn: string | null;
    similarity: number;
}

export const searchService = {
    /**
     * Search agents using semantic similarity
     */
    async searchAgents(query: string, limit: number = 10): Promise<SearchResult[]> {
        try {
            const response = await api.get<{ results: SearchResult[]; count: number }>('/search/agents', {
                params: { query, limit },
            });
            return response.results || [];
        } catch (error) {
            console.error('Search error:', error);
            return [];
        }
    },
};
