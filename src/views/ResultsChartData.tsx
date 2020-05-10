import { min, max, range } from 'lodash';

import { PublicationData } from '../types';

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

export const getLineChartData = (searchTerm: string, publicationData: PublicationData): ChartData => {
    const yearsWithData = Object.keys(publicationData).map(y => parseInt(y, 10));
    const earliestYear = min(yearsWithData) as number;
    const latestYear = max(yearsWithData) as number;

    const allYearsInRange: number[] = range(earliestYear, latestYear + 1);

    let maxArticleCount = 0;
    const yearDataPoints = allYearsInRange.map(year => {
        const yearData = publicationData[year];
        if (yearData) {
            maxArticleCount = Math.max(maxArticleCount, yearData.articleCount);
        }
        return {
            year,
            [getArticleCountDataKey(searchTerm)]: yearData ? yearData.articleCount : null,
        }
    });

    return {
        yearDataPoints,
        maxArticleCount,
    }
}