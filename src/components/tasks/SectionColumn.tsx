import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Plus, Trash2, Edit2 } from 'lucide-react';
import { Section } from '../../types/tasks';
import { TaskCard } from './TaskCard';

interface SectionColumnProps {
    section: Section;
    onAddCard: () => void;
    onCardClick: (cardId: string) => void;
    onDeleteSection: () => void;
    onEditSection: () => void;
}

export function SectionColumn({ section, onAddCard, onCardClick, onDeleteSection, onEditSection }: SectionColumnProps) {
    const { setNodeRef } = useDroppable({
        id: section.id,
    });

    const cards = section.cards || [];

    return (
        <div className="flex-shrink-0 w-80 bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl p-4 shadow-sm border border-slate-200">
            <div className="flex items-center justify-between mb-4">
                <div className="flex-1">
                    <h3 className="font-semibold text-slate-900 text-lg">{section.name}</h3>
                    <p className="text-sm text-slate-600">{cards.length} {cards.length === 1 ? 'tarea' : 'tareas'}</p>
                </div>
                <div className="flex gap-1">
                    <button
                        onClick={onEditSection}
                        className="text-slate-400 hover:text-blue-600 transition-colors p-1.5 hover:bg-white rounded-lg"
                        title="Editar sección"
                    >
                        <Edit2 size={16} />
                    </button>
                    <button
                        onClick={onDeleteSection}
                        className="text-slate-400 hover:text-red-600 transition-colors p-1.5 hover:bg-white rounded-lg"
                        title="Eliminar sección"
                    >
                        <Trash2 size={16} />
                    </button>
                </div>
            </div>

            <button
                onClick={onAddCard}
                className="w-full mb-3 px-4 py-2.5 bg-white border-2 border-dashed border-slate-300 text-slate-600 rounded-lg hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50 transition-all flex items-center justify-center gap-2 font-medium"
            >
                <Plus size={18} />
                Agregar tarea
            </button>

            <div
                ref={setNodeRef}
                className="space-y-3 min-h-[200px] p-2 rounded-lg"
            >
                <SortableContext items={cards.map(c => c.id)} strategy={verticalListSortingStrategy}>
                    {cards.map((card) => (
                        <TaskCard
                            key={card.id}
                            card={card}
                            onClick={() => onCardClick(card.id)}
                        />
                    ))}
                </SortableContext>
            </div>
        </div>
    );
}
