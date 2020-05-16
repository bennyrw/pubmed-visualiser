import { fork, take, put, delay, retry, cancel, race, join, select, actionChannel } from 'redux-saga/effects';
import { Task } from 'redux-saga';
import * as log from 'loglevel';

import {
    Action,
    START_FETCH_DATA, StartFetchDataAction,
    REMOVE_SEARCH_RESULTS,
    fetchYearDataSucceeded,
    fetchYearDataFailed,
} from '../actions';
import { getPublishedArticleData } from '../external/publishedArticleApi';
import { hasPendingOrLoadedDiseaseData } from '../reducers';

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
 * Handles rate limiting by use a channel and a join() to ensure actions (mainly fetches) are done serially.
 * Also handles retrying.
 */
export function* fetchDataSaga(): Generator {
    const channel = yield actionChannel([
        START_FETCH_DATA,
        REMOVE_SEARCH_RESULTS,
    ]);

    while (true) {
        const action = (yield take(channel as any)) as Action;

        if (action.type === START_FETCH_DATA) {
            const { payload } = action as StartFetchDataAction;
            const { searchTerm, minYear, maxYear } = payload;

            // check if this search was cancelled while it was queued
            const cancelledWhileQueued = !(yield select(hasPendingOrLoadedDiseaseData, searchTerm));
            if (cancelledWhileQueued) {
                // skip this action
                log.info(`Skipping action handling for '${searchTerm}' as it was cancelled while in the queue`);
                continue;
            }

            const delayBetweenRequests = 1000 / MAX_REQUESTS_PER_SECOND;
            let waitUntil: number = Date.now();

            const tasks = [];
            for (let year = minYear; year <= maxYear; ++year) {
                log.debug(`forking fetchYearData for '${searchTerm}' in  ${year}`);
                const task = (yield fork(fetchYearData, searchTerm, year, waitUntil)) as Task;
                tasks.push(task);
                waitUntil += delayBetweenRequests;
            }

            let completedSearch = false;
            while (!completedSearch) {
                const [joinResult, removeAction] = (yield race([
                    join(tasks),
                    take(REMOVE_SEARCH_RESULTS)
                ])) as Array<any>;
                if (joinResult) {
                    completedSearch = true;
                } else if (removeAction) {
                    const { payload: removePayload } = removeAction;
                    const removeSearchTerm = removePayload.searchTerm;
                    if (searchTerm === removeSearchTerm) {
                        // relates to the one we're fetching
                        completedSearch = true;
                        for (let i = 0; i < tasks.length; ++i) {
                            log.debug(`cancelling fetchYearData task for '${payload.searchTerm}' in position ${i}`);
                            yield cancel(tasks[i]);
                        }
                    }
                }
            }
        }
        // no forked tasks to cancel for REMOVE_SEARCH_RESULT as the related fetch will have completed
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