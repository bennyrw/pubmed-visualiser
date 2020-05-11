import * as log from 'loglevel';

import { Dictionary } from './types';

/**
 * Set the log level. Ideally this would be via a URL query parameter.
 */
log.setLevel('info');

/**
 * Toggle various debugging behaviours. Useful when getting layout right while the app is in particular states.
 */
export const DEBUG = {
    MOCK_PUBLICATION_DATA: false,
}

/**
 * The current locale. In future, could be set by user, taken from Accept Language header, etc.
 */
export const LOCALE = 'en-GB';

/**
 * Translation database. Each language could be stored as a separate JSON file.
 * For each locale, keys imply the semantics of the message.
 */
const TEXT: Dictionary<Dictionary<string>> = {
    'en-GB': {
        'number-of-articles': 'Number of articles'
    }
};

/**
 * Get the tranlsation for a given semantic message key.
 * @param key The message key/identifier.
 * @param locale The locale to use.
 */
export const getText = (key: string, locale = LOCALE) => TEXT[locale] && TEXT[locale][key];