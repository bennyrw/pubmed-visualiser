import { parse } from 'query-string';

import { DEFAULT_LOCALE } from './i18n';

interface Config {
    /**
     * Log level.
     */
    logLevel: string;
    /**
     * Locale to display UI in.
     */
    locale: string;
    /**
     * Toggle various debugging behaviours. Useful when getting layout right while the app is in particular states.
     */
    mockPublicationData: boolean;
}

const getDefaults = (): Config => {
    return {
        logLevel: 'info',
        locale: DEFAULT_LOCALE,
        mockPublicationData: false,
    }
}

/**
 * Get the app configuration, parsed from query string currently.
 */
const getConfig = (): Config => {
    let config = getDefaults();

    const queryString = window && window.location ? window.location.search : null;
    if (queryString) {
        const parseOptions = { parseBooleans: true };
        const { locale, debug } = parse(queryString.toLowerCase(), parseOptions);
        if (debug && typeof debug === 'boolean') {
            config.logLevel = 'debug';
            config.mockPublicationData = true;
        }
        if (locale && typeof locale === 'string') {
            config.locale = locale
        }
    }

    return config;
}

export const config = getConfig();