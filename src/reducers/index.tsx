import * as log from 'loglevel';
import { Map, is } from 'immutable';
import { range } from 'lodash';

import {
    Action,
    START_FETCH_DATA, StartFetchDataAction,
    FETCH_YEAR_DATA_REQUESTED, FetchYearDataRequestedAction,
    FETCH_YEAR_DATA_SUCCEEDED, FetchYearDataSucceededAction,
    FETCH_YEAR_DATA_FAILED, FetchYearDataFailedAction,
    REMOVE_SEARCH_RESULTS, RemoveSearchResultsAction,
    SET_SELECTED_YEAR_RANGE, SetSelectedYearRangeAction,
} from '../actions/index';
import {
    getInitialState, hasDiseaseDataForYear, getSelectedMinYear, getSelectedMaxYear,
    hasPendingOrLoadedDiseaseData
} from '../store';
import { StoreState, DiseaseData, DiseaseDataFields, YearData, RecordType, makeRecord, FetchRequest } from '../types';

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
            state = resetDiseaseData(state, searchTerm);
            return enqueueRequiredFetchRequests(state);
        }
        case FETCH_YEAR_DATA_REQUESTED: {
            const { payload: { fetchRequest } } = action as FetchYearDataRequestedAction;
            return moveRequestToInflight(state, fetchRequest);
        }
        case FETCH_YEAR_DATA_SUCCEEDED: {
            const { payload: { fetchRequest, data } } = action as FetchYearDataSucceededAction;
            state = storeReceivedYearData(state, fetchRequest, data);
            return removeInflightRequest(state, fetchRequest);
        }
        case FETCH_YEAR_DATA_FAILED: {
            const { payload: { fetchRequest } } = action as FetchYearDataFailedAction;
            // for now, don't do anything - we hopefully will have data in adjacent years so the graph will look ok
            return removeInflightRequest(state, fetchRequest);
        }
        case REMOVE_SEARCH_RESULTS: {
            const { payload: { searchTerm } } = action as RemoveSearchResultsAction;
            state = removeDiseaseData(state, searchTerm);
            return cancelInvalidatedFetchRequests(state);
        }
        case SET_SELECTED_YEAR_RANGE: {
            const { payload: { minYear, maxYear } } = action as SetSelectedYearRangeAction;
            state = updateSelectedYearRange(state, minYear, maxYear);
            return enqueueRequiredFetchRequests(state);
            //return cancelInvalidatedFetchRequests(state);
        }
    }
    return state;
}

const resetDiseaseData = (state: StoreState, searchTerm: string): StoreState => {
    return state.setIn(['diseaseData', searchTerm], makeRecord<DiseaseDataFields>(RecordType.DiseaseData, {
        publicationData: Map(),
        activeSearchSlot: findNextAvailableSearchSlot(state),
    }));
}

/**
 * See what active searches we have and add any required fetch requests for them in the current year range.
 */
const enqueueRequiredFetchRequests = (state: StoreState): StoreState => {
    state.diseaseData.keySeq().forEach(searchTerm => {
        for (let year = getSelectedMinYear(state); year <= getSelectedMaxYear(state); ++year) {
            if (!hasDiseaseDataForYear(state, searchTerm, year)) {
                const request = makeRecord(RecordType.FetchRequest, {
                    searchTerm,
                    year,
                });

                // we haven't loaded the data yet, just check it's not already pending or inflight
                if (!state.pendingRequests.includes(request) && !state.inflightRequests.includes(request)) {
                    log.info(`Enqueuing new request for '${searchTerm}' at ${year}`);
                    state = state.set('pendingRequests', state.pendingRequests.push(request));
                }
            }
        }
    });

    return prioritisePendingRequests(state);
}

/**
 * Prioritise a list of pending requests, which may be across multiple searches, to very quickly get an approximated
 * initial graph of each search.
 * Across pending fetch requests for all searches, prioritise:
 *  - First by earliest year
 *  - Next by every 4th year
 *  - Next by latest year
 *  - Next by every 2nd year (filling in every other year gap)
 *  - Next by every other year (filling in all year gaps)
 *  - Lastly, by search term alphabetically
 */
const prioritisePendingRequests = (state: StoreState): StoreState => {
    const minYear = getSelectedMinYear(state);
    const maxYear = getSelectedMaxYear(state);
    const sortedRequests = state.pendingRequests.sort((requestA, requestB) => {
        const { searchTerm: searchTermA, year: yearA } = requestA;
        const { searchTerm: searchTermB, year: yearB } = requestB;

        if (yearA === minYear && yearB !== minYear) {
            return -1;
        }
        if (yearA !== minYear && yearB === minYear) {
            return 1;
        }

        if (yearA % 4 === 0 && yearB % 4 !== 0) {
            return -1;
        }
        if (yearA % 4 !== 0 && yearB % 4 === 0) {
            return 1;
        }

        if (yearA === maxYear && yearB !== maxYear) {
            return 1;
        }
        if (yearA !== maxYear && yearB === maxYear) {
            return 1;
        }

        if (yearA % 2 === 0 && yearB % 2 !== 0) {
            return -1;
        }
        if (yearA % 2 !== 0 && yearB % 2 === 0) {
            return 1;
        }

        if (yearA < yearB) {
            return -1;
        }
        if (yearA > yearB) {
            return 1;
        }

        return searchTermA.localeCompare(searchTermB, 'en-US');
    });
    return state.set('pendingRequests', sortedRequests);
}

/**
 * Remove any pending fetch requests that are no longer required, e.g. after a search term removal or reducing of the
 * selected year range.
 */
const cancelInvalidatedFetchRequests = (state: StoreState): StoreState => {
    return state.set('pendingRequests', state.pendingRequests.filter(request => {
        const { searchTerm, year } = request;
        return hasPendingOrLoadedDiseaseData(state, searchTerm)
            && year >= getSelectedMinYear(state)
            && year <= getSelectedMaxYear(state);
    }));
}

const findNextAvailableSearchSlot = (state: StoreState): number => {
    const usedSlots = state.diseaseData.valueSeq().toList().map((diseaseData: DiseaseData) => diseaseData.activeSearchSlot);
    let newSlot = 0;
    if (usedSlots.size > 0) {
        const highestSlot = usedSlots.max() as number;
        const allSlots = range(0, highestSlot + 2);
        newSlot = allSlots.find(n => !usedSlots.contains(n)) as number;
    }
    log.debug(`findNextAvailableSearchSlot allocated slot ${newSlot}`);
    return newSlot;
}

const moveRequestToInflight = (state: StoreState, fetchRequest: FetchRequest): StoreState => {
    state = state.set('pendingRequests', state.pendingRequests.filter(pendingRequest => !is(pendingRequest, fetchRequest)));
    state = state.set('inflightRequests', state.inflightRequests.push(fetchRequest));
    return state;
}

const storeReceivedYearData = (state: StoreState, fetchRequest: FetchRequest, data: YearData): StoreState => {
    const { searchTerm, year } = fetchRequest;
    if (!hasPendingOrLoadedDiseaseData(state, searchTerm)) {
        log.info(`Discarding year data for '${searchTerm}' in ${year} as it was cancelled while pending`);
        return state;
    }

    return state.setIn(['diseaseData', searchTerm, 'publicationData', year], data);
}

const removeInflightRequest = (state: StoreState, fetchRequest: FetchRequest): StoreState => {
    return state.set('inflightRequests', state.inflightRequests.filter(request => !is(request, fetchRequest)));
}

const removeDiseaseData = (state: StoreState, searchTerm: string): StoreState => {
    return state.deleteIn(['diseaseData', searchTerm]);
}

const updateSelectedYearRange = (state: StoreState, minYear: number, maxYear: number): StoreState => {
    return state.set('selectedMinYear', minYear)
        .set('selectedMaxYear', maxYear)
}