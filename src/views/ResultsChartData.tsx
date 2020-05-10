import { min, max, range, sortBy } from 'lodash';

import { PublicationData, Dictionary, YearData } from '../types';

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

export const getLineChartData = (publicationData: Dictionary<PublicationData>): ChartData => {
    let maxArticleCount = 0;
    const yearDataPointsMap: Dictionary<YearDataPoints> = {};

    // first build up a map of yearly data points
    Object.entries(publicationData).forEach((entry) => {
        const searchTerm: string = entry[0];
        const searchPublicationData: PublicationData = entry[1];

        Object.entries(searchPublicationData).forEach((yearDataEntry) => {
            const year: string = yearDataEntry[0];
            const yearData: YearData = yearDataEntry[1];

            let yearDataPoints = yearDataPointsMap[year];
            if (!yearDataPoints) {
                yearDataPoints = {
                    year: parseInt(year, 10),
                };
                yearDataPointsMap[year] = yearDataPoints;
            }

            if (yearData) {
                maxArticleCount = Math.max(maxArticleCount, yearData.articleCount);
                yearDataPoints[getArticleCountDataKey(searchTerm)] = yearData ? yearData.articleCount : null;
            }
        });
    });

    // the above might have some missing years, but to keep the chart's x-axis in a consistent
    // scale, we fill in any gaps
    const yearsWithData = Object.keys(yearDataPointsMap).map(y => parseInt(y, 10));
    const earliestYear = min(yearsWithData) as number;
    const latestYear = max(yearsWithData) as number;
    range(earliestYear, latestYear + 1).forEach(year => {
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