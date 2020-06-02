import { take, put, delay, fork, retry, select, actionChannel } from 'redux-saga/effects';
import * as log from 'loglevel';

import {
    START_FETCH_DATA, SET_SELECTED_YEAR_RANGE, REMOVE_SEARCH_RESULTS,
    fetchYearDataRequested,
    fetchYearDataSucceeded,
    fetchYearDataFailed,
} from '../actions';
import { getPublishedArticleData } from '../external/publishedArticleApi';
import { getNextPendingFetchRequest } from '../store';
import { FetchRequest } from '../types';

/**
 * NCBI advertises a maximum of 10 requests per second when using an API key (3 without).
 * Stay within this limit.
 * See https://www.ncbi.nlm.nih.gov/books/NBK25497/
 */
const DELAY_BETWEEN_ATTEMPTS = 1000 / 8;

const MAX_ATTEMPTS_PER_REQUEST = 3;
/**
 * Failures are probably rate-limiting related, so wait another second.
 */
const DELAY_BETWEEN_FAILURES = 1000;

/**
 * Saga handling data pending fetches. Handles rate limiting and retrying.
 */
export function* fetchDataSaga(): Generator {
    // actions that add/remove the pending requests that we're interested in
    const channel = yield actionChannel([
        START_FETCH_DATA,
        SET_SELECTED_YEAR_RANGE,
        REMOVE_SEARCH_RESULTS,
    ]);

    while (true) {
        yield take(channel as any);

        while (true) {
            const fetchRequest = (yield select(getNextPendingFetchRequest)) as FetchRequest;
            if (!fetchRequest) {
                break;
            }

            // prevent re-entry by marking the request as inflight
            yield put(fetchYearDataRequested(fetchRequest));

            yield fork(fetchYearData, fetchRequest);
            yield delay(DELAY_BETWEEN_ATTEMPTS);
        }
    }
}

function* fetchYearData(fetchRequest: FetchRequest) {
    const { searchTerm, year } = fetchRequest;
    try {
        const yearData = yield retry(MAX_ATTEMPTS_PER_REQUEST, DELAY_BETWEEN_FAILURES, getPublishedArticleData, searchTerm, year);
        log.info(`Successfully got data for '${searchTerm}' in ${year}`);
        yield put(fetchYearDataSucceeded(fetchRequest, yearData));
    } catch (e) {
        log.warn(`Failed to get data for '${searchTerm}' in ${year}`);
        yield put(fetchYearDataFailed(fetchRequest));
    }
}