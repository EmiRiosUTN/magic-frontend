import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CategorySelection } from '../components/landing/CategorySelection';
import { api } from '../services/api';
import { Category } from '../types';
import { getCategoryConfig } from '../config/categoryConfig';

export default function HomePage() {
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
        />
    );
}
