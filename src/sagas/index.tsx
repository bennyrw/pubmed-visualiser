import { fork, take, put, delay, retry, cancel } from 'redux-saga/effects';
import { Task } from 'redux-saga';
import * as log from 'loglevel';

import {
    Action,
    START_FETCH_DATA, StartFetchDataAction,
    REMOVE_SEARCH_RESULTS, RemoveSearchResultsAction,
    fetchYearDataSucceeded,
    fetchYearDataFailed,
} from '../actions';
import { getPublishedArticleData } from '../external/publishedArticleApi';
import { Dictionary } from '../types'

/**
 * NCBI advertises a maximum of 10 requests per second when using an API key (3 without).
 * Stay within this limit.
 * See https://www.ncbi.nlm.nih.gov/books/NBK25497/
 */
const MAX_REQUESTS_PER_SECOND = 5;

const MAX_ATTEMPTS_PER_REQUEST = 3;
/**
 * Delays are probably rate-limiting related, so wait another second.
 */
const DELAY_BETWEEN_FAILURES = 1000;

/**
 * Saga handling data fetches, triggered when a start fetch action occurs.
 * Handles rate limiting and retrying.
 */
export function* fetchDataSaga(): Generator {
    const tasks: Dictionary<Task[]> = {};

    while (true) {
        const action = (yield take([
            START_FETCH_DATA,
            REMOVE_SEARCH_RESULTS,
        ])) as Action;

        if (action.type === START_FETCH_DATA) {
            const {payload} = action as StartFetchDataAction;
            const { searchTerm, minYear, maxYear } = payload;
            const delayBetweenRequests = 1000 / MAX_REQUESTS_PER_SECOND;
            let waitUntil: number = Date.now();
            for (let year = minYear; year <= maxYear; ++year) {
                log.debug(`forking fetchYearData for '${searchTerm}' in  ${year}`);
                const task = (yield fork(fetchYearData, searchTerm, year, waitUntil)) as Task;

                let searchTermTasks = tasks[searchTerm];
                if (!searchTermTasks) {
                    searchTermTasks = [];
                    tasks[searchTerm] = searchTermTasks;
                }
                searchTermTasks.push(task);

                waitUntil += delayBetweenRequests;
            }
        } else if (action.type === REMOVE_SEARCH_RESULTS) {
            const {payload} = action as RemoveSearchResultsAction;
            const searchTermTasks = tasks[payload.searchTerm];
            for (let i = 0; i < searchTermTasks.length; ++i) {
                log.debug(`cancelling fetchYearData task for '${payload.searchTerm}' in position ${i}`);
                yield cancel(searchTermTasks[i]);
            }
        }
    }
}

function* fetchYearData(searchTerm: string, year: number, waitUntil: number) {
    // rate limiting
    const remainingDelay = waitUntil - Date.now();
    if (remainingDelay > 0) {
        yield delay(remainingDelay);
    }

    try {
        const yearData = yield retry(MAX_ATTEMPTS_PER_REQUEST, DELAY_BETWEEN_FAILURES, getPublishedArticleData, searchTerm, year);
        log.info(`Successfully got data for '${searchTerm}' in ${year}`);
        yield put(fetchYearDataSucceeded(searchTerm, year, yearData));
    } catch (e) {
        log.warn(`Failed to get data for '${searchTerm}' in ${year}`);
        yield put(fetchYearDataFailed(searchTerm, year));
    }
}