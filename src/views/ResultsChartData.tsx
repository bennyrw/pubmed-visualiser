import { Map } from 'immutable';
import { range, sortBy } from 'lodash';

import { Dictionary, YearData, DiseaseData } from '../types';

interface YearDataPoints {
    year: number;

    // other fields are article counts, keyed on search term with a prefix. null if not available for this year yet
    [key: string]: number | null;
}

interface ChartData {
    yearDataPoints: Array<YearDataPoints>;
    maxArticleCount: number;
}

const DATA_KEY_PREFIX = 'articleCount_';
export const getArticleCountDataKey = (searchTerm: string) => `${DATA_KEY_PREFIX}${searchTerm}`
export const getArticleCountLabel = (dataKey: string) => dataKey.substring(DATA_KEY_PREFIX.length);

/**
 * Get the data points to use in the chart, covering all disease areas the user has searched for.
 */
export const getLineChartData = (
    diseaseData: Map<string, DiseaseData>,
    minYear: number,
    maxYear: number
): ChartData => {
    let maxArticleCount = 0;
    const yearDataPointsMap: Dictionary<YearDataPoints> = {};

    // first build up a map of yearly data points
    diseaseData.entrySeq().forEach((entry) => {
        const searchTerm: string = entry[0];
        const diseaseData: DiseaseData = entry[1];

        diseaseData.publicationData.entrySeq().forEach((yearDataEntry) => {
            const year: number = yearDataEntry[0];
            const yearData: YearData = yearDataEntry[1];

            if (minYear <= year && year <= maxYear) {
                let yearDataPoints = yearDataPointsMap[year];
                if (!yearDataPoints) {
                    yearDataPoints = {
                        year,
                    };
                    yearDataPointsMap[year] = yearDataPoints;
                }

                if (yearData) {
                    maxArticleCount = Math.max(maxArticleCount, yearData.articleCount);
                    yearDataPoints[getArticleCountDataKey(searchTerm)] = yearData ? yearData.articleCount : null;
                }
            }
        });
    });

    // the above might have some missing years, but to keep the chart's x-axis in a consistent
    // scale, we fill in any gaps
    range(minYear, maxYear + 1).forEach(year => {
        if (!yearDataPointsMap[year]) {
            yearDataPointsMap[year] = { year }
        }
    });

    // now convert the map to an array, sorted by year (map key)
    const yearDataPoints = sortBy(Object.values(yearDataPointsMap), ['year']);

    return {
        yearDataPoints,
        maxArticleCount,
    }
}