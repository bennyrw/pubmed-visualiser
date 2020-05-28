import { Dictionary } from './types';
import { config } from './config';

/**
 * Translation database. Each language could be stored as a separate JSON file.
 * For each locale, keys imply the semantics of the message.
 */
const TEXT: Dictionary<Dictionary<string>> = {
    'en-GB': {
        'title': 'PubMed Research Visualiser',
        'subtitle': 'Search for anything',
        'number-of-articles': 'Number of articles',
        'footer-prefix': 'Built using data from'
    }
};

/**
 * Locale for which all translations exist.
 */
export const DEFAULT_LOCALE = 'en-GB';

/**
 * Get the translation for a given semantic message key.
 * @param key The message key/identifier.
 */
export const getText = (key: string): string =>
    getTextForLocale(key, config.locale) || getTextForLocale(key, DEFAULT_LOCALE);

const getTextForLocale = (key: string, locale: string): string =>
    TEXT[locale] && TEXT[locale][key];