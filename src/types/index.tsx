/**
 * Data about the publications that have been retrieved.
 */
export interface PublicationData {
    /**
     * Year-by-year data, keyed by the year number.
     * Data is only present where data was successfully loaded from the third-party API.
     */
    [key: number]: YearData;
}

export interface YearData {
    articleCount: number;
}

export interface Dictionary<T> {
    [key: string]: T;
}