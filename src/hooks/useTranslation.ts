import { useAuth } from '../contexts/AuthContext';
import { translations, TranslationKey } from '../lib/i18n';

export const useTranslation = () => {
    const { user } = useAuth();
    const currentLanguage = (user?.language?.toLowerCase() || 'es') as 'es' | 'en';

    const t = (key: TranslationKey): string => {
        return translations[currentLanguage][key] || translations.es[key] || key;
    };

    return { t, language: currentLanguage };
};
