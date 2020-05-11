import { Map, Record, RecordOf } from 'immutable';

export type StoreState = RecordOf<StoreStateFields>;
export interface StoreStateFields {
    /**
     * Disease data that we've retrieved. Keyed on the search term.
     */
    diseaseData: Map<string, DiseaseData>;
}

/**
 * Data stored for a single disease.
 */
export type DiseaseData = RecordOf<DiseaseDataFields>;
export interface DiseaseDataFields {
    publicationData: PublicationData;
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