import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Calendar, AlertCircle, Bell } from 'lucide-react';
import { Card, Priority } from '../../types/tasks';

interface TaskCardProps {
    card: Card;
    onClick: () => void;
}

const PRIORITY_STYLES = {
    [Priority.LOW]: 'bg-green-100 text-green-800',
    [Priority.MEDIUM]: 'bg-yellow-100 text-yellow-800',
    [Priority.HIGH]: 'bg-orange-100 text-orange-800',
    [Priority.URGENT]: 'bg-red-100 text-red-800',
};

const PRIORITY_LABELS = {
    [Priority.LOW]: 'Baja',
    [Priority.MEDIUM]: 'Media',
    [Priority.HIGH]: 'Alta',
    [Priority.URGENT]: 'Urgente',
};

export function TaskCard({ card, onClick }: TaskCardProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: card.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    const isOverdue = card.dueDate && new Date(card.dueDate) < new Date();

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            onClick={onClick}
            className={`font-roboto bg-white rounded-lg p-4 shadow-sm border border-slate-200 cursor-pointer hover:shadow-lg hover:border-blue-200 transition-all duration-200 ${isDragging ? 'opacity-50 shadow-2xl scale-105 rotate-3' : ''
                }`}
        >
            <h4 className="font-medium text-sm text-slate-900 mb-2 line-clamp-2">{card.title}</h4>

            {card.description && (
                <p className="text-xs text-slate-600 mb-3 line-clamp-2">{card.description}</p>
            )}

            <div className="flex items-center gap-2 flex-wrap">
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${PRIORITY_STYLES[card.priority]}`}>
                    {PRIORITY_LABELS[card.priority]}
                </span>

                {card.reminderEnabled && card.dueDate && (
                    <div className="flex items-center gap-1 text-xs text-blue-600" title={`Recordatorio ${card.reminderDaysBefore} día(s) antes`}>
                        <Bell size={14} />
                    </div>
                )}

                {card.dueDate && (
                    <div className={`flex items-center gap-1 text-xs ${isOverdue ? 'text-red-600' : 'text-slate-600'}`}>
                        {isOverdue && <AlertCircle size={14} />}
                        <Calendar size={14} />
                        <span>{new Date(card.dueDate).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })}</span>
                    </div>
                )}
            </div>
        </div>
    );
}
