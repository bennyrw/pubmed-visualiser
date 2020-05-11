import { Map } from 'immutable';

import {
    Action, FetchOptions,
    START_FETCH_DATA, StartFetchDataAction,
    FETCH_YEAR_DATA_SUCCEEDED, FetchYearDataSucceededAction,
    FETCH_YEAR_DATA_FAILED, FetchYearDataFailedAction,
    REMOVE_SEARCH_RESULTS, RemoveSearchResultsAction,
} from '../actions/index';
import { getInitialState } from '../store';
import { StoreState, DiseaseDataFields, YearData, makeRecord } from '../types';

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
            return resetDiseaseData(state, searchTerm);
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
            return removeDiseaseData(state, searchTerm);
        }
    }
    return state;
}

const resetDiseaseData = (state: StoreState, searchTerm: string): StoreState => {
    return state.setIn(['diseaseData', searchTerm], makeRecord<DiseaseDataFields>({
        publicationData: Map()
    }));
}

const addReceivedYearData = (state: StoreState, fetchOptions: FetchOptions, data: YearData) => {
    return state.setIn(['diseaseData', fetchOptions.searchTerm, 'publicationData', fetchOptions.year], data);
}

const removeDiseaseData = (state: StoreState, searchTerm: string) => {
    return state.deleteIn(['diseaseData', searchTerm]);
}