import { fork, take, select, call, put, delay } from 'redux-saga/effects';
import { throttle } from 'lodash';

import { FETCH_DATA, fetchDataSucceeded, fetchDataFailed } from '../actions';
import { StoreState } from '../store';
import { PendingDiseaseRequest } from '../types';
import { getPublishedArticleData } from '../external/publishedArticleApi';

/**
 * Triggered when pending API requests need to be handled, this saga fetches data from those APIs.
 */
export function* fetchDataSaga() {
    while (true) {
        const {payload} = yield take(FETCH_DATA);
        yield fork(handleFetch, payload)
    }
}

function* handlePendingRequests(pendingRequests: PendingDiseaseRequest[]) {
    if (pendingRequests) {
        for (let i = 0; i < pendingRequests.length; ++i) {
            const request = pendingRequests[i];
            try {
                const yearData = yield call(getPublishedArticleData, request.searchTerm, request.year);
                yield put(fetchDataSucceeded(request.searchTerm, request.year, yearData));
            } catch (e) {
                yield put(fetchDataFailed(request.searchTerm, request.year))
            }
        }
    }
}

const getPendingRequests = (state: StoreState): PendingDiseaseRequest[] => state.pendingDiseaseRequests;

// todo - need to apply throttling

/**
 * NCBI advertises a maximum of 10 requests per second when using an API key (3 without).
 * Stay within this limit.
 * See https://www.ncbi.nlm.nih.gov/books/NBK25497/
 */
const MAX_REQUESTS_PER_SECOND = 5;

// todo - move to utils
function retryify(fn: Function, maxAttempts: number) {
    return (...args: any[]) => {
        for (let i = 0; i < maxAttempts; ++i) {
            try {
                return fn(...args);
            } catch (e) {
                if (i === maxAttempts) {
                    // no more attempts
                    throw e;
                }
            }
        }
    }
}