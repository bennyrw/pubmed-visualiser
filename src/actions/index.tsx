import { YearData, FetchRequest } from '../types';

//
// Action constants
//

export const START_FETCH_DATA = 'START_FETCH_DATA';
type START_FETCH_DATA = typeof START_FETCH_DATA;

export const FETCH_YEAR_DATA_REQUESTED = 'FETCH_YEAR_DATA_REQUESTED';
type FETCH_YEAR_DATA_REQUESTED = typeof FETCH_YEAR_DATA_REQUESTED;

export const FETCH_YEAR_DATA_SUCCEEDED = 'FETCH_YEAR_DATA_SUCCEEDED';
type FETCH_YEAR_DATA_SUCCEEDED = typeof FETCH_YEAR_DATA_SUCCEEDED;

export const FETCH_YEAR_DATA_FAILED = 'FETCH_YEAR_DATA_FAILED';
type FETCH_YEAR_DATA_FAILED = typeof FETCH_YEAR_DATA_FAILED;

export const REMOVE_SEARCH_RESULTS = 'REMOVE_SEARCH_RESULTS';
type REMOVE_SEARCH_RESULTS = typeof REMOVE_SEARCH_RESULTS;

export const SET_SELECTED_YEAR_RANGE = 'SET_SELECTED_YEAR_RANGE';
type SET_SELECTED_YEAR_RANGE = typeof SET_SELECTED_YEAR_RANGE;

//
// Action types
//

export interface Action {
    type: any;
    payload?: any;
}

export interface StartFetchDataAction extends Action {
    type: START_FETCH_DATA;
    payload: {
        searchTerm: string;
    }
}

export interface FetchYearDataRequestedAction extends Action {
    type: FETCH_YEAR_DATA_REQUESTED;
    payload: {
        fetchRequest: FetchRequest;
    }
}

export interface FetchYearDataSucceededAction extends Action {
    type: FETCH_YEAR_DATA_SUCCEEDED;
    payload: {
        fetchRequest: FetchRequest;
        data: YearData;
    }
}

export interface FetchYearDataFailedAction extends Action {
    type: FETCH_YEAR_DATA_FAILED;
    payload: {
        fetchRequest: FetchRequest;
    }
}

export interface RemoveSearchResultsAction extends Action {
    type: REMOVE_SEARCH_RESULTS;
    payload: {
        searchTerm: string;
    }
}

export interface SetSelectedYearRangeAction extends Action {
    type: SET_SELECTED_YEAR_RANGE;
    payload: {
        minYear: number;
        maxYear: number;
    }
}

//
// Action creators
//

export function startFetchData(searchTerm: string): StartFetchDataAction {
    return {
        type: START_FETCH_DATA,
        payload: {
            searchTerm,
        }
    };
}

export function fetchYearDataRequested(fetchRequest: FetchRequest): FetchYearDataRequestedAction {
    return {
        type: FETCH_YEAR_DATA_REQUESTED,
        payload: {
            fetchRequest,
        },
    };
}

export function fetchYearDataSucceeded(fetchRequest: FetchRequest, data: YearData): FetchYearDataSucceededAction {
    return {
        type: FETCH_YEAR_DATA_SUCCEEDED,
        payload: {
            fetchRequest,
            data,
        },
    };
}

export function fetchYearDataFailed(fetchRequest: FetchRequest): FetchYearDataFailedAction {
    return {
        type: FETCH_YEAR_DATA_FAILED,
        payload: {
            fetchRequest,
        }
    }
}

export function removeSearchResults(searchTerm: string): RemoveSearchResultsAction {
    return {
        type: REMOVE_SEARCH_RESULTS,
        payload: {
            searchTerm,
        }
    }
}

export function setSelectedYearRange(minYear: number, maxYear: number): SetSelectedYearRangeAction {
    return {
        type: SET_SELECTED_YEAR_RANGE,
        payload: {
            minYear,
            maxYear,
        }
    }
}