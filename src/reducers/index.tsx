import { remove, findIndex } from 'lodash';

import {
    Action, FETCH_DATA, FETCH_DATA_SUCCEEDED, FETCH_DATA_FAILED,
    FetchDataAction, FetchDataSucceededAction, FetchDataFailedAction,
} from '../actions/index';
import { getInitialState, StoreState } from '../store';
import { PendingDiseaseRequest, YearData } from '../types';

// todo - user configurable... double-ended slider? also need to consider data + view variants of min/max for this
const EARLIEST_YEAR = 2012;
const LATEST_YEAR = new Date().getFullYear();

// todo - move to constants
const REQUEST_MAX_ATTEMPTS = 3;

/**
 * Redux reducer that updates the store state with the consequences of an action.
 * @param state The current state.
 * @param action The action that will mutate the state.
 * @return The new state.
 */
export function reducer(state = getInitialState(), action: Action): StoreState {
    switch (action.type) {
        case FETCH_DATA: {
            const { payload: { searchTerm } } = action as FetchDataAction;
            return {
                ...state,
                searchTerm,
                pendingDiseaseRequests: makePendingDiseaseRequests(searchTerm),
            };
        }
        case FETCH_DATA_SUCCEEDED: {
            const { payload: { searchTerm, year, data } } = action as FetchDataSucceededAction;
            removePendingRequest(state, searchTerm, year);
            addReceivedYearData(state, year, data);
            return state;
        }
        case FETCH_DATA_FAILED: {
            const { payload: { searchTerm, year } } = action as FetchDataFailedAction;
            const exceededRetries = incrementRequestAttempt(state, searchTerm, year);
            if (exceededRetries) {
                removePendingRequest(state, searchTerm, year);
            }
            return state;
        }
    }
    return state;
}

const makePendingDiseaseRequests = (searchTerm: string): PendingDiseaseRequest[] => {
    const requests = [];
    for (let year = EARLIEST_YEAR; year <= LATEST_YEAR; ++year) {
        requests.push({
            searchTerm,
            year,
            attempts: 0,
        });
    }
    return requests;
};

const removePendingRequest = (state: StoreState, searchTerm: string, year: number) => {
    state.pendingDiseaseRequests = remove(state.pendingDiseaseRequests, (request) =>
        request.searchTerm === searchTerm && request.year === year
    );
}

const addReceivedYearData = (state: StoreState, year: number, data: YearData) => {
    state.trendData[year] = data;
}

const incrementRequestAttempt = (state: StoreState, searchTerm: string, year: number): boolean => {
    const index = findIndex(state.pendingDiseaseRequests, (request) =>
        request.searchTerm === searchTerm && request.year === year
    );
    state.pendingDiseaseRequests[index].attempts++;
    return state.pendingDiseaseRequests[index].attempts < REQUEST_MAX_ATTEMPTS;
}