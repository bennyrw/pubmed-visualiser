import { YearData } from '../types';

//
// Action constants
//

export const START_FETCH_DATA = 'START_FETCH_DATA';
type START_FETCH_DATA = typeof START_FETCH_DATA;

export const FETCH_YEAR_DATA_SUCCEEDED = 'FETCH_YEAR_DATA_SUCCEEDED';
type FETCH_YEAR_DATA_SUCCEEDED = typeof FETCH_YEAR_DATA_SUCCEEDED;

export const FETCH_YEAR_DATA_FAILED = 'FETCH_YEAR_DATA_FAILED';
type FETCH_YEAR_DATA_FAILED = typeof FETCH_YEAR_DATA_FAILED;

//
// Action types
//

export interface FetchOptions {
    searchTerm: string;
    year: number;
}

export interface Action {
    type: any;
    payload?: any;
}

export interface StartFetchDataAction extends Action {
    type: START_FETCH_DATA;
    payload: {
        searchTerm: string;
        minYear: number;
        maxYear: number;
    }
}

export interface FetchYearDataSucceededAction extends Action {
    type: FETCH_YEAR_DATA_SUCCEEDED;
    payload: {
        fetchOptions: FetchOptions;
        data: YearData;
    }
}

export interface FetchYearDataFailedAction extends Action {
    type: FETCH_YEAR_DATA_FAILED;
    payload: FetchOptions;
}

//
// Action creators
//

export function startFetchData(searchTerm: string, minYear: number, maxYear: number): StartFetchDataAction {
    return {
        type: START_FETCH_DATA,
        payload: {
            searchTerm,
            minYear,
            maxYear,
        }
    };
}

export function fetchYearDataSucceeded(searchTerm: string, year: number, data: YearData): FetchYearDataSucceededAction {
    return {
        type: FETCH_YEAR_DATA_SUCCEEDED,
        payload: {
            fetchOptions: {
                searchTerm,
                year,
            },
            data,
        },
    };
}

export function fetchYearDataFailed(searchTerm: string, year: number): FetchYearDataFailedAction {
    return {
        type: FETCH_YEAR_DATA_FAILED,
        payload: {
            searchTerm,
            year,
        }
    }
}