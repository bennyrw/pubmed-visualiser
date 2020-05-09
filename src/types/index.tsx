export interface PublicationData {
    [key: number]: YearData;
}

export interface YearData {
    articleCount: number;
}

export interface Dictionary<T> {
    [key: string]: T;
}