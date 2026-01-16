import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AgentSelection } from '../../components/landing/AgentSelection';
import { api } from '../../services/api';
import { Agent, Category } from '../../types';
import { getCategoryConfig } from '../../config/categoryConfig';
import { Loader } from '../../components/ui/Loader';

export default function AgentsPage() {
    const { categoryId } = useParams();
    const navigate = useNavigate();
    const [agents, setAgents] = useState<Agent[]>([]);
    const [category, setCategory] = useState<Category | null>(null);

    useEffect(() => {
        const loadData = async () => {
            if (!categoryId) return;
            try {
                const agentsResponse: any = await api.getAgentsByCategory(categoryId);
                setAgents(agentsResponse.agents || []);

                const catsResponse: any = await api.getCategories();
                const foundCat = (catsResponse.categories || []).find((c: any) => c.id === categoryId);
                if (foundCat) {
                    setCategory({
                        ...foundCat,
                        color: getCategoryConfig(foundCat.name).color
                    });
                }

            } catch (err) {
                console.error('Error loading agents:', err);
            }
        };
        loadData();
    }, [categoryId]);



    if (!category) return <div className="min-h-screen bg-grafite flex items-center justify-center"><Loader text="Cargando categoría..." size="lg" /></div>;

    return (
        <AgentSelection
            category={category}
            agents={agents}
            onSelectAgent={(agentId) => navigate(`/chat/${agentId}`)}
            onBack={() => navigate('/')}
        />
    );
}
