import { Map, Record, RecordOf } from 'immutable';

/**
 * Data about the publications that have been retrieved.
 * Contains year-by-year data, keyed by the year number.
 * Data is only present where data was successfully loaded from the third-party API.
 */
export type PublicationData = Map<number, YearData>;

export interface YearDataProps {
    articleCount: number;
}
export type YearData = RecordOf<YearDataProps>;

/**
 * Utility to make a new Immutable.js record.
 * @param recordData
 */
export function makeRecord<RecordProps>(recordData: RecordProps) {
    const factory = Record<RecordProps>(recordData);
    return factory();
}

export interface Dictionary<T> {
    [key: string]: T;
}