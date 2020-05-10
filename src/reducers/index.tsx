import { Map } from 'immutable';

import {
    Action, FetchOptions,
    START_FETCH_DATA, StartFetchDataAction,
    FETCH_YEAR_DATA_SUCCEEDED, FetchYearDataSucceededAction,
    FETCH_YEAR_DATA_FAILED, FetchYearDataFailedAction,
    REMOVE_SEARCH_RESULTS, RemoveSearchResultsAction,
} from '../actions/index';
import { getInitialState, StoreState } from '../store';
import { YearData } from '../types';

/**
 * Redux reducer that updates the store state with the consequences of an action.
 * @param state The current state.
 * @param action The action that will mutate the state.
 * @return The new state.
 */
export function reducer(state = getInitialState(), action: Action): StoreState {
    switch (action.type) {
        case START_FETCH_DATA: {
            const { payload: { searchTerm } } = action as StartFetchDataAction;
            return addOrReplaceNewSearchTermData(state, searchTerm);
        }
        case FETCH_YEAR_DATA_SUCCEEDED: {
            const { payload: { fetchOptions, data } } = action as FetchYearDataSucceededAction;
            return addReceivedYearData(state, fetchOptions, data);
        }
        case FETCH_YEAR_DATA_FAILED: {
            //const { payload: { searchTerm, year } } = action as FetchYearDataFailedAction;
            // todo - handle failure? Maybe show an icon or something?
            return state;
        }
        case REMOVE_SEARCH_RESULTS: {
            const { payload: { searchTerm } } = action as RemoveSearchResultsAction;
            return removeSearchResults(state, searchTerm);
        }
    }
    return state;
}

const addOrReplaceNewSearchTermData = (state: StoreState, searchTerm: string): StoreState => {
    return state.setIn(['publicationData', searchTerm], Map());
}

const addReceivedYearData = (state: StoreState, fetchOptions: FetchOptions, data: YearData) => {
    return state.setIn(['publicationData', fetchOptions.searchTerm, fetchOptions.year], data);
}

const removeSearchResults = (state: StoreState, searchTerm: string) => {
    return state.deleteIn(['publicationData', searchTerm]);
}