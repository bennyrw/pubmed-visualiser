import { PendingDiseaseRequest, TrendData } from '../types';
import { DEBUG } from '../constants';

export interface StoreState {
    /**
     * The current search term, if any has been set.
     */
    searchTerm?: string;
    /**
     * Any pending disease requests that we're waiting on.
     */
    pendingDiseaseRequests: PendingDiseaseRequest[];
    /**
     * Trend data, if we've received any.
     */
    trendData: TrendData;
}

export function getInitialState(): StoreState {
    const state: StoreState = {
        pendingDiseaseRequests: [],
        trendData: {}
    };

    // Support various debugging behaviours. Useful when getting layout right while the app is in particular states.
    if (DEBUG.MOCK_TREND_DATA) {
        state.searchTerm = 'COVID-19';
        state.trendData = {
            2018: { articleCount: 0 },
            2019: { articleCount: 5 },
            2020: { articleCount: 500 },
            2021: { articleCount: 300 },
        };
    }

    return state;
}