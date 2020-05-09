import { fork, take, call, put } from 'redux-saga/effects';
import * as log from 'loglevel';

import {
    START_FETCH_DATA, StartFetchDataAction,
    fetchYearDataSucceeded,
    fetchYearDataFailed,
} from '../actions';
import { StoreState } from '../store';
import { getPublishedArticleData } from '../external/publishedArticleApi';

// todo - move to constants
const REQUEST_MAX_ATTEMPTS = 3;

// todo - retry
// todo - throttle/delay

/**
 * Saga handling data fetches, triggered when a start fetch action occurs.
 */
export function* fetchDataSaga(): Generator {
    while (true) {
        const {payload} = (yield take(START_FETCH_DATA)) as StartFetchDataAction;
        const {searchTerm, minYear, maxYear} = payload;

        for (let year = minYear; year <= maxYear; ++year) {
            log.debug(`forking fetchYearData for ${year}`);
            yield fork(fetchYearData, searchTerm, year);
        }
    }
}

function* fetchYearData(searchTerm: string, year: number) {
    try {
        const yearData = yield call(getPublishedArticleData, searchTerm, year);
        log.info(`Successfully got data for ${year}`);
        yield put(fetchYearDataSucceeded(searchTerm, year, yearData));
    } catch (e) {
        log.warn(`Failed to get data for ${year}`);
        yield put(fetchYearDataFailed(searchTerm, year));
    }
}

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

// todo
/*
// const makePendingDiseaseRequests = (searchTerm: string): PendingDiseaseRequest[] => {
//     const requests = [];
//     for (let year = EARLIEST_YEAR; year <= LATEST_YEAR; ++year) {
//         requests.push({
//             searchTerm,
//             year,
//             attempts: 0,
//         });
//     }
//     return requests;
// };

// const removePendingRequest = (state: StoreState, searchTerm: string, year: number) => {
//     state.pendingDiseaseRequests = remove(state.pendingDiseaseRequests, (request) =>
//         request.searchTerm === searchTerm && request.year === year
//     );
// }

// const incrementRequestAttempt = (state: StoreState, searchTerm: string, year: number): boolean => {
//     const index = findIndex(state.pendingDiseaseRequests, (request) =>
//         request.searchTerm === searchTerm && request.year === year
//     );
//     state.pendingDiseaseRequests[index].attempts++;
//     return state.pendingDiseaseRequests[index].attempts < REQUEST_MAX_ATTEMPTS;
// }
*/