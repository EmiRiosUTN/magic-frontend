import { useState, useEffect } from 'react';
import {
    DndContext,
    DragEndEvent,
    DragOverEvent,
    DragOverlay,
    DragStartEvent,
    PointerSensor,
    useSensor,
    useSensors,
    closestCorners,
} from '@dnd-kit/core';
import { ArrowLeft, Plus, Settings } from 'lucide-react';
import { Project, Section, Card } from '../../types/tasks';
import { SectionColumn } from './SectionColumn';
import { TaskCard } from './TaskCard';
import { CreateSectionModal } from './CreateSectionModal';
import { EditSectionModal } from './EditSectionModal';
import { CreateCardModal } from './CreateCardModal';
import { EditCardModal } from './EditCardModal';
import { api } from '../../services/api';
import { useTranslation } from '../../hooks/useTranslation';

interface BoardViewProps {
    projectId: string;
    onBack: () => void;
}

export function BoardView({ projectId, onBack }: BoardViewProps) {
    const { t } = useTranslation();
    const [project, setProject] = useState<Project | null>(null);
    const [sections, setSections] = useState<Section[]>([]);
    const [activeCard, setActiveCard] = useState<Card | null>(null);
    const [isCreateSectionModalOpen, setIsCreateSectionModalOpen] = useState(false);
    const [editingSectionId, setEditingSectionId] = useState<string | null>(null);
    const [createCardSectionId, setCreateCardSectionId] = useState<string | null>(null);
    const [editingCard, setEditingCard] = useState<Card | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [activeDragItem, setActiveDragItem] = useState<{ sectionId: string; index: number } | null>(null);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        })
    );

    useEffect(() => {
        loadProject();
    }, [projectId]);

    const loadProject = async () => {
        try {
            setIsLoading(true);
            const response: any = await api.getProject(projectId);
            setProject(response);
            setSections(response.sections || []);
        } catch (error) {
            console.error('Error loading project:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCreateSection = async (name: string) => {
        try {
            await api.createSection({ projectId, name });
            await loadProject();
        } catch (error) {
            console.error('Error creating section:', error);
            alert('Error al crear la sección');
        }
    };

    const handleDeleteSection = async (sectionId: string) => {
        if (!confirm('¿Estás seguro de que quieres eliminar esta sección y todas sus tareas?')) {
            return;
        }
        try {
            await api.deleteSection(sectionId);
            await loadProject();
        } catch (error) {
            console.error('Error deleting section:', error);
            alert('Error al eliminar la sección');
        }
    };

    const handleUpdateSection = async (sectionId: string, name: string) => {
        try {
            await api.updateSection(sectionId, { name });
            await loadProject();
        } catch (error) {
            console.error('Error updating section:', error);
            alert('Error al actualizar la sección');
        }
    };

    const handleCreateCard = async (data: { title: string; description?: string; priority?: string; dueDate?: string }) => {
        if (!createCardSectionId) return;
        try {
            await api.createCard({ ...data, sectionId: createCardSectionId });
            await loadProject();
        } catch (error) {
            console.error('Error creating card:', error);
            alert('Error al crear la tarea');
        }
    };

    const handleUpdateCard = async (cardId: string, data: any) => {
        try {
            await api.updateCard(cardId, data);
            await loadProject();
        } catch (error) {
            console.error('Error updating card:', error);
            alert('Error al actualizar la tarea');
        }
    };

    const handleDeleteCard = async (cardId: string) => {
        try {
            await api.deleteCard(cardId);
            await loadProject();
        } catch (error) {
            console.error('Error deleting card:', error);
            alert('Error al eliminar la tarea');
        }
    };

    const handleDragStart = (event: DragStartEvent) => {
        const { active } = event;
        const cardId = active.id as string;
        const card = findCard(cardId);
        setActiveCard(card);

        if (card) {
            const section = sections.find(s => s.id === card.sectionId);
            const index = section?.cards?.findIndex(c => c.id === cardId) ?? -1;
            if (section && index !== -1) {
                setActiveDragItem({ sectionId: section.id, index });
            }
        }
    };

    const handleDragOver = (event: DragOverEvent) => {
        const { active, over } = event;
        if (!over) return;

        const activeId = active.id as string;
        const overId = over.id as string;

        const activeCard = findCard(activeId);
        const overCard = findCard(overId);

        if (!activeCard) return;

        const activeSectionId = activeCard.sectionId;
        const overSectionId = overCard?.sectionId || overId;

        if (activeSectionId === overSectionId) return;

        setSections((sections) => {
            const activeSection = sections.find(s => s.id === activeSectionId);
            const overSection = sections.find(s => s.id === overSectionId);

            if (!activeSection || !overSection) return sections;

            const activeCards = activeSection.cards || [];
            const overCards = overSection.cards || [];

            const activeIndex = activeCards.findIndex(c => c.id === activeId);
            const overIndex = overCard ? overCards.findIndex(c => c.id === overId) : overCards.length;

            return sections.map(section => {
                if (section.id === activeSectionId) {
                    return {
                        ...section,
                        cards: activeCards.filter(c => c.id !== activeId),
                    };
                }
                if (section.id === overSectionId) {
                    const newCards = [...overCards];
                    newCards.splice(overIndex, 0, { ...activeCard, sectionId: overSectionId });
                    return {
                        ...section,
                        cards: newCards,
                    };
                }
                return section;
            });
        });
    };

    const handleDragEnd = async (event: DragEndEvent) => {
        const { active } = event;
        const activeId = active.id as string;

        // Retrieve original position
        const originalState = activeDragItem;

        // Reset drag states
        setActiveCard(null);
        setActiveDragItem(null);

        if (!originalState) {
            console.log('❌ [FRONTEND] No original state found');
            return;
        }

        // Find where the card IS NOW in the state (updated by handleDragOver)
        let currentSectionId = '';
        let currentIndex = -1;

        for (const section of sections) {
            const index = section.cards?.findIndex(c => c.id === activeId);
            if (index !== undefined && index !== -1) {
                currentSectionId = section.id;
                currentIndex = index;
                break;
            }
        }

        console.log('🏁 [FRONTEND] Drag Result Check', {
            cardId: activeId,
            startedAt: originalState,
            endedAt: { sectionId: currentSectionId, index: currentIndex }
        });

        if (currentIndex === -1 || !currentSectionId) {
            console.error('❌ [FRONTEND] Card lost after drag');
            return;
        }

        // Compare Start vs End
        const hasChanged =
            originalState.sectionId !== currentSectionId ||
            originalState.index !== currentIndex;

        if (hasChanged) {
            try {
                console.log('📤 [FRONTEND] Persisting change...', {
                    cardId: activeId,
                    targetSectionId: currentSectionId,
                    newPosition: currentIndex
                });

                await api.moveCard(activeId, {
                    targetSectionId: currentSectionId,
                    newPosition: currentIndex,
                });
                console.log('✅ [FRONTEND] Change persisted!');
            } catch (error) {
                console.error('Error persisting drag:', error);
                await loadProject(); // Revert on error
            }
        }
    };

    const findCard = (id: string): Card | null => {
        for (const section of sections) {
            const card = section.cards?.find(c => c.id === id);
            if (card) return card;
        }
        return null;
    };

    const handleCardClick = (cardId: string) => {
        const card = findCard(cardId);
        if (card) setEditingCard(card);
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (!project) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="text-center">
                    <p className="text-slate-600 mb-4">Proyecto no encontrado</p>
                    <button onClick={onBack} className="px-4 py-2 bg-blue-600 text-white rounded-lg">
                        Volver
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-100 via-slate-50 to-blue-50 font-roboto">
            <div className="border-b border-slate-200 bg-white px-6 py-4">
                <div className="flex items-center gap-4">
                    <button
                        onClick={onBack}
                        className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                    >
                        <ArrowLeft size={20} />
                    </button>

                    <div
                        className="w-10 h-10 rounded-lg flex items-center justify-center"
                        style={{ backgroundColor: project.color || '#3B82F6' }}
                    >
                        <Settings className="text-white" size={20} />
                    </div>

                    <div className="flex-1">
                        <h1 className="text-xl font-semibold text-slate-900">{project.name}</h1>
                        {project.description && (
                            <p className="text-sm text-slate-600">{project.description}</p>
                        )}
                    </div>

                    <button
                        onClick={() => setIsCreateSectionModalOpen(true)}
                        className="p-2 bg-slate-800 text-sm text-white rounded-lg hover:bg-slate-700 transition-colors flex items-center gap-1"
                    >
                        <Plus size={14} className="text-white" />
                        {t('newSection')}
                    </button>
                </div>
            </div>

            <div className="p-6 overflow-x-auto bg-gradient-to-br from-slate-100/50 to-transparent">
                <DndContext
                    sensors={sensors}
                    collisionDetection={closestCorners}
                    onDragStart={handleDragStart}
                    onDragOver={handleDragOver}
                    onDragEnd={handleDragEnd}
                >
                    <div className="flex gap-4 pb-4">
                        {sections.map((section) => (
                            <SectionColumn
                                key={section.id}
                                section={section}
                                onAddCard={() => setCreateCardSectionId(section.id)}
                                onCardClick={handleCardClick}
                                onDeleteSection={() => handleDeleteSection(section.id)}
                                onEditSection={() => setEditingSectionId(section.id)}
                            />
                        ))}

                        {sections.length === 0 && (
                            <div className="flex items-center justify-center w-full py-20">
                                <div className="text-center">
                                    <p className="text-slate-600 mb-4">{t('noSectionsInProject')}</p>
                                    <button
                                        onClick={() => setIsCreateSectionModalOpen(true)}
                                        className="px-4 py-2 bg-blue-800 text-white rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center gap-1"
                                    >
                                        <Plus size={20} />
                                        {t('createFirstSection')}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    <DragOverlay>
                        {activeCard ? <TaskCard card={activeCard} onClick={() => { }} /> : null}
                    </DragOverlay>
                </DndContext>
            </div>

            <CreateSectionModal
                isOpen={isCreateSectionModalOpen}
                onClose={() => setIsCreateSectionModalOpen(false)}
                onSubmit={handleCreateSection}
            />

            {editingSectionId && (
                <EditSectionModal
                    isOpen={true}
                    onClose={() => setEditingSectionId(null)}
                    onSubmit={(name) => {
                        handleUpdateSection(editingSectionId, name);
                        setEditingSectionId(null);
                    }}
                    currentName={sections.find(s => s.id === editingSectionId)?.name || ''}
                />
            )}

            <CreateCardModal
                isOpen={createCardSectionId !== null}
                onClose={() => setCreateCardSectionId(null)}
                onSubmit={handleCreateCard}
            />

            {editingCard && (
                <EditCardModal
                    isOpen={true}
                    onClose={() => setEditingCard(null)}
                    onSubmit={(data) => handleUpdateCard(editingCard.id, data)}
                    onDelete={() => {
                        handleDeleteCard(editingCard.id);
                        setEditingCard(null);
                    }}
                    card={editingCard}
                />
            )}
        </div>
    );
}
