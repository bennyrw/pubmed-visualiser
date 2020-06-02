import { Map, List, Record as ImmutableRecord, RecordOf } from 'immutable';

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
    /**
     * The requests that are pending and haven't been requested yet, if any.
     */
    pendingRequests: List<FetchRequest>;
    /**
     * The requests that we've asked for and are waiting on a response for, if any.
     */
    inflightRequests: List<FetchRequest>;
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

export type FetchRequest = RecordOf<FetchRequestFields>;
interface FetchRequestFields {
    searchTerm: string;
    year: number;
}

export interface Dictionary<T> {
    [key: string]: T;
}

export enum RecordType {
    StoreState,
    DiseaseData,
    YearData,
    FetchRequest,
}

/**
 * Cache of record factories to use, along with their default values.
 * Records generated from different factories won't be comparable with Immutable.is or Record.equals
 * https://github.com/immutable-js/immutable-js/issues/1734)
 */
const RECORD_FACTORIES: Record<RecordType, ImmutableRecord.Factory<any>> = {
    [RecordType.StoreState]: ImmutableRecord<StoreStateFields>({
        diseaseData: Map(),
        selectedMinYear: 0,
        selectedMaxYear: 0,
        pendingRequests: List(),
        inflightRequests: List(),
    }),
    [RecordType.DiseaseData]: ImmutableRecord<DiseaseDataFields>({
        publicationData: Map(),
        activeSearchSlot: 0 }),
    [RecordType.YearData]: ImmutableRecord<YearDataFields>({
        articleCount: 0
    }),
    [RecordType.FetchRequest]: ImmutableRecord<FetchRequestFields>({
        searchTerm: '',
        year: 0
    }),
};

/**
 * Utility to make a new Immutable.js record.
 * @param recordData
 */
export function makeRecord<RecordProps>(recordType: RecordType, recordData: RecordProps) {
    return RECORD_FACTORIES[recordType](recordData);
}