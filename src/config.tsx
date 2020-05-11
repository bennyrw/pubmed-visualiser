import { parse, ParseOptions } from 'query-string';

import { DEFAULT_LOCALE } from './i18n';

interface Config {
    /**
     * Initial seaches to make.
     */
    searchTerms: string[];
    searchEarliestYear: number;
    searchLatestYear: number;
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
        searchTerms: [],
        searchEarliestYear: new Date().getFullYear() - 20,
        searchLatestYear: new Date().getFullYear(),
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
        const parseOptions: ParseOptions = {
            parseBooleans: true,
            arrayFormat: 'separator',
            arrayFormatSeparator: '|',
        };
        const { q, from, to, locale, debug } = parse(queryString.toLowerCase(), parseOptions);
        if (q) {
            if (typeof q === 'string') {
                // single term
                config.searchTerms = [q];
            } else if (q instanceof Array) {
                config.searchTerms = q;
            }
        }
        if (from && typeof from === 'number') {
            config.searchEarliestYear = from;
        }
        if (to && typeof to === 'number') {
            config.searchLatestYear = to;
        }
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