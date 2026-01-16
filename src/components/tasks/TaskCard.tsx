import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Calendar, Bell, Trash2 } from 'lucide-react';
import { Card, Priority } from '../../types/tasks';

interface TaskCardProps {
    card: Card;
    onClick: () => void;
    onDelete: () => void;
}

const PRIORITY_STYLES = {
    [Priority.LOW]: 'bg-green-200 text-green-600',
    [Priority.MEDIUM]: 'bg-orange-100 text-orange-600',
    [Priority.HIGH]: 'bg-red-100 text-red-600',
    [Priority.URGENT]: 'bg-red-200 text-red-900',
};

const PRIORITY_LABELS = {
    [Priority.LOW]: 'Baja',
    [Priority.MEDIUM]: 'Media',
    [Priority.HIGH]: 'Alta',
    [Priority.URGENT]: 'Urgente',
};

export function TaskCard({ card, onClick, onDelete }: TaskCardProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({
        id: card.id,
        data: {
            type: 'card',
            card,
        },
    });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    if (isDragging) {
        return (
            <div
                ref={setNodeRef}
                style={style}
                className="opacity-30 bg-slate-100 p-4 rounded-xl border-dashed border-2 border-slate-300 h-[120px]"
            />
        );
    }

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            onClick={onClick}
            className={`
                group bg-grafite rounded-xl p-5 shadow-sm cursor-grab relative
                hover:-translate-y-1 hover:shadow-md 
                transition-all duration-200 ease-out
                ${isDragging ? 'opacity-50 shadow-2xl scale-105 rotate-2' : ''}
            `}
        >
            <div className="flex items-start justify-between">
                <h4 className="font-medium text-sm text-swirl leading-tight line-clamp-2 pr-6">{card.title}</h4>
                <button
                    onPointerDown={(e) => e.stopPropagation()}
                    onClick={(e) => {
                        e.stopPropagation();
                        onDelete();
                    }}
                    className="absolute top-4 right-4 text-oyster hover:text-plum p-1.5 hover:bg-transparent rounded-md opacity-0 group-hover:opacity-100 transition-all duration-200"
                    title="Eliminar tarea"
                >
                    <Trash2 size={14} />
                </button>
            </div>

            {card.description && (
                <p className="text-sm text-swirl my-2 line-clamp-2">
                    {card.description}
                </p>
            )}

            <div className="flex items-center justify-between mt-3">
                <span className={`text-xs px-2.5 py-1 rounded-md font-semibold ${PRIORITY_STYLES[card.priority]}`}>
                    {PRIORITY_LABELS[card.priority]}
                </span>

                <div className="flex items-center gap-3 text-slate-400">
                    {card.reminderEnabled && (
                        <div className="text-copper" title="Recordatorio activo">
                            <Bell size={14} />
                        </div>
                    )}

                    {card.dueDate && (
                        <div className={`flex items-center gap-1 text-xs ${new Date(card.dueDate) < new Date() ? 'text-swirl font-medium' : ''
                            }`}>
                            <Calendar size={14} />
                            <span>{new Date(card.dueDate).toLocaleDateString()}</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
