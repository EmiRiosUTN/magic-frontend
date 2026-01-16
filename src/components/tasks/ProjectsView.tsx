import { useState, useEffect } from 'react';
import { Plus, Archive, ArchiveRestore } from 'lucide-react';
import { Project } from '../../types/tasks';
import { ProjectCard } from './ProjectCard';
import { CreateProjectModal } from './CreateProjectModal';
import { api } from '../../services/api';
import { useTranslation } from '../../hooks/useTranslation';

interface ProjectsViewProps {
    onSelectProject: (projectId: string) => void;
}

export function ProjectsView({ onSelectProject }: ProjectsViewProps) {
    const { t } = useTranslation();
    const [projects, setProjects] = useState<Project[]>([]);
    const [showArchived, setShowArchived] = useState(false);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadProjects();
    }, [showArchived]);

    const loadProjects = async () => {
        try {
            setIsLoading(true);
            const response: any = await api.getProjects(showArchived);
            setProjects(response.projects || []);
        } catch (error) {
            console.error('Error loading projects:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCreateProject = async (data: { name: string; description?: string; color?: string }) => {
        try {
            await api.createProject(data);
            await loadProjects();
        } catch (error) {
            console.error('Error creating project:', error);
            alert(t('errorLoadingData'));
        }
    };

    const activeProjects = projects.filter(p => !p.isArchived);
    const archivedProjects = projects.filter(p => p.isArchived);
    const displayProjects = showArchived ? archivedProjects : activeProjects;

    return (
        <div className="min-h-screen bg-grafite font-roboto">
            <div className="max-w-7xl mx-auto px-6 py-8">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-2xl font-semibold text-swirl mb-2">{t('myProjects')}</h1>
                        <p className="text-oyster text-sm">
                            {activeProjects.length} {activeProjects.length === 1 ? t('project') : t('projects').toLowerCase()} {activeProjects.length === 1 ? 'activo' : t('activeProjects')}
                        </p>
                    </div>

                    <div className="flex gap-3 text-sm">
                        <button
                            onClick={() => setShowArchived(!showArchived)}
                            className="px-4 py-2 bg-plum text-oyster rounded-lg hover:bg-plum/80 transition-colors flex items-center gap-2"
                        >
                            {showArchived ? <ArchiveRestore size={18} /> : <Archive size={18} />}
                            {showArchived ? 'Ver activos' : t('viewArchived')}
                        </button>

                        <button
                            onClick={() => setIsCreateModalOpen(true)}
                            className="px-4 py-2 bg-navy text-oyster rounded-lg hover:bg-navy/80 transition-colors flex items-center gap-2"
                        >
                            <Plus size={18} />
                            {t('newProject')}
                        </button>
                    </div>
                </div>

                {isLoading ? (
                    <div className="flex items-center justify-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    </div>
                ) : displayProjects.length === 0 ? (
                    <div className="text-center py-20">
                        <div className="text-slate-400 mb-4">
                            <Archive size={64} className="mx-auto" />
                        </div>
                        <h3 className="text-xl font-semibold text-slate-900 mb-2">
                            {showArchived ? 'No hay proyectos archivados' : 'No hay proyectos'}
                        </h3>
                        <p className="text-slate-600 mb-6">
                            {showArchived
                                ? 'Los proyectos archivados aparecerán aquí'
                                : 'Crea tu primer proyecto para comenzar'}
                        </p>
                        {!showArchived && (
                            <button
                                onClick={() => setIsCreateModalOpen(true)}
                                className="px-6 py-3 bg-navy text-white rounded-lg hover:bg-navy/80 transition-colors inline-flex items-center gap-2"
                            >
                                <Plus size={20} />
                                {t('create')} {t('project')}
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {displayProjects.map((project) => (
                            <ProjectCard
                                key={project.id}
                                project={project}
                                onClick={() => onSelectProject(project.id)}
                            />
                        ))}
                    </div>
                )}
            </div>

            <CreateProjectModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                onSubmit={handleCreateProject}
            />
        </div>
    );
}
