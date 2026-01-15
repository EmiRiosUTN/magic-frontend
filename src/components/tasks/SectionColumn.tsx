import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Plus, Trash2 } from 'lucide-react';
import { Section } from '../../types/tasks';
import { TaskCard } from './TaskCard';
import { useTranslation } from '../../hooks/useTranslation';

interface SectionColumnProps {
    section: Section;
    onAddCard: () => void;
    onCardClick: (cardId: string) => void;
    onUpdateSection: (newName: string) => void;
    onDeleteSection: () => void;
    onDeleteTask: (cardId: string) => void;
}

export function SectionColumn({ section, onAddCard, onCardClick, onDeleteSection, onUpdateSection, onDeleteTask }: SectionColumnProps) {
    const { t } = useTranslation();
    const { setNodeRef } = useDroppable({
        id: section.id,
        data: { type: 'section', section }
    });

    const cards = section.cards || [];
    const [isEditing, setIsEditing] = React.useState(false);
    const [title, setTitle] = React.useState(section.name);

    React.useEffect(() => {
        setTitle(section.name);
    }, [section.name]);

    const handleSubmit = () => {
        if (title.trim() && title !== section.name) {
            onUpdateSection(title.trim());
        } else {
            setTitle(section.name);
        }
        setIsEditing(false);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSubmit();
        } else if (e.key === 'Escape') {
            setTitle(section.name);
            setIsEditing(false);
        }
    };

    return (
        <div className="font-roboto flex-shrink-0 w-80 h-full max-h-full pb-2">
            <div className="bg-slate-50 rounded-2xl border border-slate-200 flex flex-col h-full max-h-full shadow-sm">
                {/* Header */}
                <div className="p-4 pb-2 flex items-center justify-between">
                    <div className="flex items-center gap-2 flex-1 mr-2">
                        {isEditing ? (
                            <input
                                autoFocus
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                onBlur={handleSubmit}
                                onKeyDown={handleKeyDown}
                                className="font-bold text-lg text-slate-800 bg-white border-2 border-blue-500 rounded px-1.5 py-0.5 w-full outline-none"
                            />
                        ) : (
                            <h3
                                onClick={() => setIsEditing(true)}
                                className="font-bold text-slate-800 text-lg cursor-text hover:bg-slate-200/50 rounded px-1.5 py-0.5 transition-colors truncate"
                                title="Click para editar"
                            >
                                {section.name}
                            </h3>
                        )}
                        <span className="text-xs font-medium text-slate-400 bg-slate-200/60 px-2 py-0.5 rounded-full flex-shrink-0">
                            {cards.length} {cards.length === 1 ? t('task') : t('tasksCount')}
                        </span>
                    </div>
                    <div className="flex gap-1">
                        <button
                            onClick={onDeleteSection}
                            className="text-slate-400 hover:text-red-600 transition-colors p-1.5 hover:bg-white rounded-md"
                            title="Eliminar sección"
                        >
                            <Trash2 size={14} />
                        </button>
                    </div>

                </div>


                {/* Scrollable Tasks Area */}
                <div className="flex-1 overflow-y-auto px-3 py-2 custom-scrollbar">
                    <div
                        ref={setNodeRef}
                        className="flex flex-col gap-3 min-h-[100px]"
                    >
                        <SortableContext items={cards.map(c => c.id)} strategy={verticalListSortingStrategy}>
                            {cards.map((card) => (
                                <TaskCard
                                    key={card.id}
                                    card={card}
                                    onClick={() => onCardClick(card.id)}
                                    onDelete={() => onDeleteTask(card.id)}
                                />
                            ))}
                        </SortableContext>
                    </div>
                </div>

                {/* Add Button */}
                <div className="p-3 pt-0">
                    <button
                        onClick={onAddCard}
                        className="w-full py-2.5 px-4 rounded-xl border-2 border-dashed border-slate-300 text-slate-500 
                        hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50/50 
                        transition-all duration-200 flex items-center justify-center gap-2 font-medium text-sm group bg-white/50"
                    >
                        <div className="bg-slate-200 group-hover:bg-blue-200 rounded p-0.5 transition-colors">
                            <Plus size={14} className="text-slate-500 group-hover:text-blue-600" />
                        </div>
                        Agregar tarea
                    </button>
                </div>
            </div>
        </div>
    );
}
