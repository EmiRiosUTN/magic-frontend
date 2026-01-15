import React from 'react';
import { FolderKanban, Calendar, Archive } from 'lucide-react';
import { Project } from '../../types/tasks';
import { useTranslation } from '../../hooks/useTranslation';

interface ProjectCardProps {
    project: Project;
    onClick: () => void;
}

export function ProjectCard({ project, onClick }: ProjectCardProps) {
    const { t } = useTranslation();
    const sectionCount = project.sections?.length || 0;
    const cardCount = project.sections?.reduce((acc, section) => acc + (section.cards?.length || 0), 0) || 0;

    return (
        <div
            onClick={onClick}
            className="group bg-white rounded-xl shadow-sm border border-slate-200 p-6 cursor-pointer hover:shadow-lg hover:-translate-y-1 transition-all duration-200"
        >
            <div className="flex items-start gap-4">
                <div
                    className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: project.color || '#3B82F6' }}
                >
                    <FolderKanban className="text-white" size={24} />
                </div>

                <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-2">
                        <h3 className="font-semibold text-slate-900 text-lg truncate">{project.name}</h3>
                        {project.isArchived && (
                            <span className="flex items-center gap-1 text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded-full flex-shrink-0">
                                <Archive size={12} />
                                Archivado
                            </span>
                        )}
                    </div>

                    {project.description && (
                        <p className="text-sm text-slate-600 mb-4 line-clamp-2">{project.description}</p>
                    )}

                    <div className="flex items-center gap-4 text-sm text-slate-600">
                        <div className="flex items-center gap-1">
                            <FolderKanban size={16} />
                            <span>{sectionCount} {sectionCount === 1 ? t('section') : t('sections')}</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <Calendar size={16} />
                            <span>{cardCount} {cardCount === 1 ? t('task') : t('tasksCount')}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span>{t('created')} {new Date(project.createdAt).toLocaleDateString('es-ES')}</span>
                <span className="text-blue-600 group-hover:text-blue-700 font-medium">
                    {t('viewBoard')} →
                </span>
            </div>
        </div>
    );
}
