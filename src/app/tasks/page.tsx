import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ProjectsView } from '../../components/tasks/ProjectsView';
import { IconButton } from '../../components/ui/IconButton';
import { ArrowLeft } from 'lucide-react';

export default function TasksPage() {
    const navigate = useNavigate();
    return (
        <div className="relative">
            <div className="fixed top-20 right-4 z-50">
                <IconButton
                    icon={<ArrowLeft size={20} />}
                    onClick={() => navigate('/')}
                    label="Volver"
                    className="bg-white shadow-lg hover:bg-slate-100"
                />
            </div>
            <ProjectsView
                onSelectProject={(projectId) => navigate(`/board/${projectId}`)}
            />
        </div>
    );
}
