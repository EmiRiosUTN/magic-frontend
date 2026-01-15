
import {
    Image,
    Pencil,
    Code,
    BarChart3,
    Smartphone,
    Video,
    LucideIcon
} from 'lucide-react';

export interface CategoryConfigItem {
    icon: LucideIcon;
    color: string;
    textColor: string;
    borderColor: string;
}

const imageConfig: CategoryConfigItem = {
    icon: Image,
    color: 'from-blue-700 to-blue-600',
    textColor: 'text-blue-700',
    borderColor: 'hover:border-blue-700 hover:border-t-4',
};

const writingConfig: CategoryConfigItem = {
    icon: Pencil,
    color: 'from-green-700 to-green-600',
    textColor: 'text-green-700',
    borderColor: 'hover:border-green-700 hover:border-t-4',
};

const codeConfig: CategoryConfigItem = {
    icon: Code,
    color: 'from-red-700 to-red-600',
    textColor: 'text-red-700',
    borderColor: 'hover:border-red-700 hover:border-t-4',
};

const dataConfig: CategoryConfigItem = {
    icon: BarChart3,
    color: 'from-purple-700 to-purple-600',
    textColor: 'text-purple-700',
    borderColor: 'hover:border-purple-700 hover:border-t-4',
};

const socialConfig: CategoryConfigItem = {
    icon: Smartphone,
    color: 'from-indigo-700 to-indigo-600',
    textColor: 'text-indigo-700',
    borderColor: 'hover:border-indigo-700 hover:border-t-4',
};

const videoConfig: CategoryConfigItem = {
    icon: Video,
    color: 'from-teal-700 to-teal-600',
    textColor: 'text-teal-700',
    borderColor: 'hover:border-teal-700 hover:border-t-4',
};

export const CATEGORY_CONFIG: Record<string, CategoryConfigItem> = {
    // Es
    'Creación de Imágenes': imageConfig,
    'Redacción y Contenido': writingConfig,
    'Desarrollo y Código': codeConfig,
    'Análisis de Datos': dataConfig,
    'Redes Sociales': socialConfig,
    'Video y Multimedia': videoConfig,

    // En
    'Image Creation': imageConfig,
    'Writing and Content': writingConfig,
    'Development and Code': codeConfig,
    'Data Analysis': dataConfig,
    'Social Media': socialConfig,
    'Video and Multimedia': videoConfig,
};

export const DEFAULT_CATEGORY_CONFIG: CategoryConfigItem = {
    icon: Image,
    color: 'from-slate-500 to-slate-400',
    textColor: 'text-slate-500',
    borderColor: 'hover:border-slate-500 hover:border-t-4',
};

export const getCategoryConfig = (categoryName: string): CategoryConfigItem => {
    return CATEGORY_CONFIG[categoryName] || DEFAULT_CATEGORY_CONFIG;
};
