/**
 * A pending request from the disease database (e.g. pubmed)
 */
export interface PendingDiseaseRequest {
    searchTerm: string;
    year: number;
    /**
     * Number of attempts made for this request.
     */
    attempts: number;
}

export interface TrendData {
    [key: number]: YearData;
}

export interface YearData {
    articleCount: number;
}

export interface Dictionary<T> {
    [key: string]: T;
}