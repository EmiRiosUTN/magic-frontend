import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CategorySelection } from '../components/landing/CategorySelection';
import { api } from '../services/api';
import { Category } from '../types';
import { getCategoryConfig } from '../config/categoryConfig';
import { useAuth } from '../contexts/AuthContext';
import LandingPage from './landing/page';
import { DashboardLayout } from '../components/layout/DashboardLayout';

const CategoryBrowser = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        const loadCategories = async () => {
            try {
                const response: any = await api.getCategories();
                const categoriesData = (response.categories || []).map((cat: any) => ({
                    ...cat,
                    color: getCategoryConfig(cat.name).color,
                }));
                setCategories(categoriesData);
            } catch (err) {
                console.error('Error loading categories:', err);
            }
        };
        loadCategories();
    }, []);

    return (
        <CategorySelection
            categories={categories}
            onSelectCategory={(categoryId: string) => navigate(`/agents/${categoryId}`)}
            onSelectAgent={(agentId: string) => navigate(`/chat/${agentId}`)}
        />
    );
};

export default function RootPage() {
    const { isAuthenticated, isLoading } = useAuth();

    if (isLoading) {
        return <div className="min-h-screen flex items-center justify-center">Cargando...</div>;
    }

    if (!isAuthenticated) {
        return <LandingPage />;
    }

    return (
        <DashboardLayout>
            <CategoryBrowser />
        </DashboardLayout>
    );
}
