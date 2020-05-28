import { Map, Record, RecordOf } from 'immutable';

export type StoreState = RecordOf<StoreStateFields>;
export interface StoreStateFields {
    /**
     * Disease data that we've retrieved. Keyed on the search term.
     */
    diseaseData: Map<string, DiseaseData>;
    /**
     * Current earliest year to retrieve article data for
     */
    selectedMinYear: number;
    /**
     * Current latest year to retrieve article data for.
     */
    selectedMaxYear: number;
}

/**
 * Data stored for a single disease.
 */
export type DiseaseData = RecordOf<DiseaseDataFields>;
export interface DiseaseDataFields {
    /**
     * Details about publications for this disease.
     */
    publicationData: PublicationData;
    /**
     * A finite number of searches are permitted concurrently (before results must be deleted).
     * This is the ID of the search 'slot' associated with this disease. It's used for determining
     * consistent colour throughout the app for this disease.
     */
    activeSearchSlot: number;
}

/**
 * Data about the publications for a disease.
 * Contains year-by-year data, keyed by the year number.
 * Data is only present where data was successfully loaded from the third-party API.
 */
export type PublicationData = Map<number, YearData>;

export type YearData = RecordOf<YearDataFields>;
export interface YearDataFields {
    articleCount: number;
}

export interface Dictionary<T> {
    [key: string]: T;
}

/**
 * Utility to make a new Immutable.js record.
 * @param recordData
 */
export function makeRecord<RecordProps>(recordData: RecordProps) {
    const factory = Record<RecordProps>(recordData);
    return factory();
}