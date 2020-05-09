import { YearData } from '../types';

//
// Action constants
//

export const FETCH_DATA = 'FETCH_DATA';
type FETCH_DATA = typeof FETCH_DATA;

export const FETCH_DATA_SUCCEEDED = 'FETCH_DATA_SUCCEEDED';
type FETCH_DATA_SUCCEEDED = typeof FETCH_DATA_SUCCEEDED;

export const FETCH_DATA_FAILED = 'FETCH_DATA_FAILED';
type FETCH_DATA_FAILED = typeof FETCH_DATA_FAILED;

//
// Action types
//

export interface Action {
    type: any;
    payload?: any;
}

export interface FetchDataAction extends Action {
    type: FETCH_DATA;
    payload: {
        searchTerm: string;
    }
};

export interface FetchDataSucceededAction extends Action {
    type: FETCH_DATA_SUCCEEDED;
    payload: {
        searchTerm: string,
        year: number;
        data: YearData;
    }
}

export interface FetchDataFailedAction extends Action {
    type: FETCH_DATA_FAILED;
    payload: {
        searchTerm: string;
        year: number;
    }
}

//
// Action creators
//

export function fetchData(searchTerm: string): FetchDataAction {
    return {
        type: FETCH_DATA,
        payload: {
            searchTerm,
        }
    };
}

export function fetchDataSucceeded(searchTerm: string, year: number, data: YearData): FetchDataSucceededAction {
    return {
        type: FETCH_DATA_SUCCEEDED,
        payload: {
            searchTerm,
            year,
            data,
        },
    };
}

export function fetchDataFailed(searchTerm: string, year: number): FetchDataFailedAction {
    return {
        type: FETCH_DATA_FAILED,
        payload: {
            searchTerm,
            year,
        }
    }
}