import { parse, ParseOptions } from 'query-string';
import { mapKeys } from 'lodash';

import { DEFAULT_LOCALE } from './i18n';

interface Config {
    /**
     * Initial seaches to make.
     */
    initialSearchTerms: string[];
    initialSelectedMinYear: number;
    initialSelectedMaxYear: number;
    /**
     * Absolute min & max year that can be selected
     */
    minSelectableYear: number;
    maxSelectableYear: number;
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
        initialSearchTerms: [],
        initialSelectedMinYear: new Date().getFullYear() - 20,
        initialSelectedMaxYear: new Date().getFullYear(),
        minSelectableYear: 1950,
        maxSelectableYear: new Date().getFullYear(),
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
        // parse result is in the case provided in the URL
        const parseResult = parse(urlHash, parseOptions);
        const { q, from, to, locale, debug, mockData } = mapKeys(parseResult, (value, key) => key.toLowerCase());
        if (q) {
            if (typeof q === 'string') {
                // single term
                config.initialSearchTerms = [q];
            } else if (q instanceof Array) {
                config.initialSearchTerms = q;
            }
        }
        if (from && typeof from === 'string' && !isNaN(parseInt(from, 10))) {
            config.initialSelectedMinYear = parseInt(from, 10);
        }
        if (to && typeof to === 'string' && !isNaN(parseInt(to, 10))) {
            config.initialSelectedMaxYear = parseInt(to, 10);
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
    yearFrom: number = config.initialSelectedMinYear,
    yearTo: number = config.initialSelectedMaxYear,
    debug: boolean = config.logLevel === 'debug' || config.logLevel === 'trace') => {
    return `q=${searchTerms.join('|')}&from=${yearFrom}&to=${yearTo}${debug ? '&debug=true' : ''}`;
}