import { fork, take, put, delay, retry } from 'redux-saga/effects';
import * as log from 'loglevel';

import {
    START_FETCH_DATA, StartFetchDataAction,
    fetchYearDataSucceeded,
    fetchYearDataFailed,
} from '../actions';
import { getPublishedArticleData } from '../external/publishedArticleApi';

/**
 * NCBI advertises a maximum of 10 requests per second when using an API key (3 without).
 * Stay within this limit.
 * See https://www.ncbi.nlm.nih.gov/books/NBK25497/
 */
const MAX_REQUESTS_PER_SECOND = 9;

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
    while (true) {
        const {payload} = (yield take(START_FETCH_DATA)) as StartFetchDataAction;
        const {searchTerm, minYear, maxYear} = payload;

        const delayBetweenRequests = 1000 / MAX_REQUESTS_PER_SECOND;
        let waitUntil: number = Date.now();
        for (let year = minYear; year <= maxYear; ++year) {
            log.debug(`forking fetchYearData for ${year}`);
            yield fork(fetchYearData, searchTerm, year, waitUntil);
            waitUntil += delayBetweenRequests;
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
        log.info(`Successfully got data for ${year}`);
        yield put(fetchYearDataSucceeded(searchTerm, year, yearData));
    } catch (e) {
        log.warn(`Failed to get data for ${year}`);
        yield put(fetchYearDataFailed(searchTerm, year));
    }
}