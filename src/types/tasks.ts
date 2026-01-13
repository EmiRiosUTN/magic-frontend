export enum Priority {
    LOW = 'LOW',
    MEDIUM = 'MEDIUM',
    HIGH = 'HIGH',
    URGENT = 'URGENT',
}

export interface Project {
    id: string;
    userId: string;
    name: string;
    description?: string;
    color?: string;
    isArchived: boolean;
    createdAt: string;
    updatedAt: string;
    sections?: Section[];
}

export interface Section {
    id: string;
    projectId: string;
    name: string;
    position: number;
    createdAt: string;
    updatedAt: string;
    cards?: Card[];
}

export interface Card {
    id: string;
    sectionId: string;
    title: string;
    description?: string;
    position: number;
    priority: Priority;
    dueDate?: string;
    reminderEnabled?: boolean;
    reminderDaysBefore?: number;
    reminderSent?: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface CreateProjectDto {
    name: string;
    description?: string;
    color?: string;
}

export interface UpdateProjectDto {
    name?: string;
    description?: string;
    color?: string;
    isArchived?: boolean;
}

export interface CreateSectionDto {
    projectId: string;
    name: string;
}

export interface UpdateSectionDto {
    name: string;
}

export interface ReorderSectionsDto {
    projectId: string;
    sections: { id: string; position: number }[];
}

export interface CreateCardDto {
    sectionId: string;
    title: string;
    description?: string;
    priority?: Priority;
    dueDate?: string;
    reminderEnabled?: boolean;
    reminderDaysBefore?: number;
}

export interface UpdateCardDto {
    title?: string;
    description?: string;
    priority?: Priority;
    dueDate?: string;
    reminderEnabled?: boolean;
    reminderDaysBefore?: number;
}

export interface MoveCardDto {
    targetSectionId: string;
    newPosition: number;
}
