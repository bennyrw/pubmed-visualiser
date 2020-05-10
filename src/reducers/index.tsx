import { cloneDeep } from 'lodash';

import {
    Action, FetchOptions,
    START_FETCH_DATA, StartFetchDataAction,
    FETCH_YEAR_DATA_SUCCEEDED, FetchYearDataSucceededAction,
    FETCH_YEAR_DATA_FAILED, FetchYearDataFailedAction,
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
            addOrReplaceNewSearchTermData(state, searchTerm);
            // return new object as we've changed it
            return {...state};
        }
        case FETCH_YEAR_DATA_SUCCEEDED: {
            const { payload: { fetchOptions, data } } = action as FetchYearDataSucceededAction;
            addReceivedYearData(state, fetchOptions, data);
            // return new object as we've changed it
            return {...state};
        }
        case FETCH_YEAR_DATA_FAILED: {
            //const { payload: { searchTerm, year } } = action as FetchYearDataFailedAction;
            // todo - handle failure? Maybe show an icon or something?
            return state;
        }
    }
    return state;
}

const addOrReplaceNewSearchTermData = (state: StoreState, searchTerm: string) => {
    state.publicationData[searchTerm] = {};
}

const addReceivedYearData = (state: StoreState, fetchOptions: FetchOptions, data: YearData) => {
    // todo - is clonedeep needed here?
    const newData = cloneDeep(state.publicationData[fetchOptions.searchTerm]);
    newData[fetchOptions.year] = data;
    state.publicationData[fetchOptions.searchTerm] = newData;
}