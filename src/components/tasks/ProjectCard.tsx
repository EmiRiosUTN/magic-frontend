import { useState } from 'react';
import { FolderKanban, Calendar, Archive, ArchiveRestore, Trash2 } from 'lucide-react';
import { Project } from '../../types/tasks';
import { useTranslation } from '../../hooks/useTranslation';
import { ConfirmationModal } from '../ui/ConfirmationModal';

interface ProjectCardProps {
    project: Project;
    onClick: () => void;
    onArchive?: (id: string, isArchived: boolean) => void;
    onDelete?: (id: string) => void;
}

export function ProjectCard({ project, onClick, onArchive, onDelete }: ProjectCardProps) {
    const { t } = useTranslation();
    const sectionCount = project.sections?.length || 0;
    const cardCount = project.sections?.reduce((acc, section) => acc + (section.cards?.length || 0), 0) || 0;
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    const handleArchiveClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        onArchive?.(project.id, !project.isArchived);
    };

    const handleDeleteClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        setShowDeleteConfirm(true);
    };

    const confirmDelete = () => {
        onDelete?.(project.id);
        setShowDeleteConfirm(false);
    };

    return (
        <div
            onClick={onClick}
            className="group bg-smoke rounded-xl shadow-sm drop-shadow-sm p-6 cursor-pointer hover:shadow-lg hover:-translate-y-1 transition-all duration-200 relative"
        >
            {/* Action buttons */}
            <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                    onClick={handleArchiveClick}
                    className="p-2 bg-haze/50 hover:bg-haze rounded-lg transition-colors"
                    title={project.isArchived ? 'Desarchivar' : 'Archivar'}
                >
                    {project.isArchived ? (
                        <ArchiveRestore size={16} className="text-oyster" />
                    ) : (
                        <Archive size={16} className="text-oyster" />
                    )}
                </button>
                {project.isArchived && (
                    <button
                        onClick={handleDeleteClick}
                        className="p-2 bg-oxid/50 hover:bg-oxid rounded-lg transition-colors"
                        title="Eliminar"
                    >
                        <Trash2 size={16} className="text-oyster" />
                    </button>
                )}
            </div>

            <div className="flex items-start gap-4">
                <div
                    className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: project.color || '#3B82F6' }}
                >
                    <FolderKanban className="text-swirl" size={24} />
                </div>

                <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-2">
                        <h3 className="font-semibold text-swirl text-lg truncate">{project.name}</h3>
                        {project.isArchived && (
                            <span className="flex items-center gap-1 text-xs text-grafite bg-haze px-2 py-1 rounded-full flex-shrink-0">
                                <Archive size={12} />
                                Archivado
                            </span>
                        )}
                    </div>

                    {project.description && (
                        <p className="text-sm text-swirl mb-4 line-clamp-2">{project.description}</p>
                    )}

                    <div className="flex items-center gap-4 text-sm text-swirl">
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

            <div className="mt-4 pt-4 border-t border-haze/30 flex items-center justify-between text-xs text-oyster">
                <span>{t('created')} {new Date(project.createdAt).toLocaleDateString('es-ES')}</span>
                <span className="text-plum group-hover:text-plum/80 font-medium">
                    {t('viewBoard')} →
                </span>
            </div>

            <ConfirmationModal
                isOpen={showDeleteConfirm}
                onClose={() => setShowDeleteConfirm(false)}
                onConfirm={confirmDelete}
                title={t('deleteProjectTitle')}
                message={t('deleteProjectMessage').replace('{{name}}', project.name)}
                confirmText={t('delete')}
                cancelText={t('cancel')}
                type="danger"
            />
        </div>
    );
}
