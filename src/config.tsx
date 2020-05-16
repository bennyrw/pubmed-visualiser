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
 * Get the app configuration, parsed from URL hash currently.
 */
const getConfig = (): Config => {
    let config = getDefaults();

    const urlHash = window && window.location ? window.location.hash : null;
    if (urlHash) {
        const parseOptions: ParseOptions = {
            parseBooleans: true,
            arrayFormat: 'separator',
            arrayFormatSeparator: '|',
        };
        const { q, from, to, locale, debug, mockData } = parse(urlHash.toLowerCase(), parseOptions);
        if (q) {
            if (typeof q === 'string') {
                // single term
                config.searchTerms = [q];
            } else if (q instanceof Array) {
                config.searchTerms = q;
            }
        }
        if (from && typeof from === 'string' && !isNaN(parseInt(from, 10))) {
            config.searchEarliestYear = parseInt(from, 10);
        }
        if (to && typeof to === 'string' && !isNaN(parseInt(to, 10))) {
            config.searchLatestYear = parseInt(to, 10);
        }
        if (debug && typeof debug === 'boolean') {
            config.logLevel = 'debug';
        }
        if (mockData) {
            config.mockPublicationData = true;
        }
        if (locale && typeof locale === 'string') {
            config.locale = locale
        }
    }

    return config;
}

export const config = getConfig();

export const getUrlHash = (searchTerms: string[] = [],
    yearFrom: number = config.searchEarliestYear,
    yearTo: number = config.searchLatestYear,
    debug: boolean = config.mockPublicationData): string => {
    return `q=${searchTerms.join('|')}&from=${yearFrom}&to=${yearTo}${debug ? '&debug=true' : ''}`;
}