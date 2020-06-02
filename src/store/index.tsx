import { OrderedMap, fromJS, isKeyed, List } from 'immutable';

import { StoreState, StoreStateFields, DiseaseData, DiseaseDataFields, YearDataFields, FetchRequest,
    RecordType, makeRecord } from '../types';
import { config } from '../config';

export function getInitialState(): StoreState {
    let state: StoreState = makeRecord<StoreStateFields>(RecordType.StoreState, {
        diseaseData: OrderedMap<string, DiseaseData>(),
        selectedMinYear: config.initialSelectedMinYear,
        selectedMaxYear: config.initialSelectedMaxYear,
        pendingRequests: List<FetchRequest>(),
        inflightRequests: List<FetchRequest>(),
    });

    // Support various debugging behaviours. Useful when getting layout right while the app is in particular states.
    if (config.mockPublicationData) {
        const debugData = {
            'cancer': {
                publicationData: {
                    2000: { articleCount: 70000 },
                    2001: { articleCount: 73000 },
                    2002: { articleCount: 76000 },
                    2003: { articleCount: 82000 },
                    2004: { articleCount: 87000 },
                    2005: { articleCount: 96000 },
                    2006: { articleCount: 102000 },
                    2007: { articleCount: 109000 },
                    2008: { articleCount: 117000 },
                    2009: { articleCount: 123000 },
                    //2010: { articleCount: 135000 }, // Simulate a missing value
                    2011: { articleCount: 148000 },
                    2012: { articleCount: 160000 },
                    2013: { articleCount: 170000 },
                    2014: { articleCount: 186000 },
                    2015: { articleCount: 197000 },
                    2016: { articleCount: 200000 },
                    2017: { articleCount: 207000 },
                    2018: { articleCount: 214000 },
                    2019: { articleCount: 213000 },
                },
                activeSearchSlot: 0,
            },
            'spanish flu': {
                publicationData: {
                    // occurs before the others
                    1920: { articleCount: 10 },
                    1925: { articleCount: 15 },
                    1930: { articleCount: 0 },
                },
                activeSearchSlot: 1,
            },
            'covid-19': {
                publicationData: {
                    // only over part of the range of 'Cancer'
                    2018: { articleCount: 0 },
                    2019: { articleCount: 30 },
                    2020: { articleCount: 5000 },
                },
                activeSearchSlot: 2,
            },
            'some really long disease name': {
                publicationData: {
                    // only over part of the range of 'Cancer'
                    2008: { articleCount: 6000 },
                    2012: { articleCount: 10000 },
                    2016: { articleCount: 12000 },
                },
                activeSearchSlot: 3,
            },
        }
        const reviver = (key: string | number,
            value: any,
            path: (string | number)[] | undefined) => {
            if (isKeyed(value)) {
                if (path && path.length === 1) {
                    // DiseaseData's are records
                    return makeRecord<DiseaseDataFields>(RecordType.DiseaseData, value.toObject() as DiseaseDataFields);
                } else if (path && path.length === 3) {
                    // YearData's are records
                    return makeRecord<YearDataFields>(RecordType.DiseaseData, value.toObject() as YearDataFields);
                } else {
                    return value.toOrderedMap();
                }
            } else {
                return value.toList();
            }
        }
        state = state.set('diseaseData', OrderedMap(fromJS(debugData, reviver)));
    }

    return state;
}

export const hasPendingOrLoadedDiseaseData = (state: StoreState, searchTerm: string) => {
    return state.hasIn(['diseaseData', searchTerm]);
}

export const getNextPendingFetchRequest = (state: StoreState): FetchRequest => {
    return state.pendingRequests.first();
}

export const hasDiseaseDataForYear = (state: StoreState, searchTerm: string, year: number) => {
    const diseaseData = state.getIn(['diseaseData', searchTerm]);
    if (!diseaseData) {
        return false;
    }

    return diseaseData.publicationData.has(year);
}

export const isSearchTermLoading = (state: StoreState, searchTerm: string): boolean => {
    const diseaseData = state.getIn(['diseaseData', searchTerm]);
    if (!diseaseData) {
        return false;
    }

    for (let year = state.selectedMinYear; year <= state.selectedMaxYear; ++year) {
        if (!diseaseData.publicationData.has(year)) {
            // this year hasn't loaded
            return true;
        }
    }

    return false;
}

export const getSelectedMinYear = (store: StoreState) => store.selectedMinYear;
export const getSelectedMaxYear = (store: StoreState) => store.selectedMaxYear;

export const getCurrentSearches = (store: StoreState) => store.diseaseData.keySeq();