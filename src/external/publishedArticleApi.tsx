import { YearData, YearDataFields, RecordType, makeRecord } from '../types';

/**
 * Get data for a specific search term and year.
 * Returns null if nothing is found.
 */
export async function getPublishedArticleData(searchTerm: string, year: number): Promise<YearData | null> {
    try {
        const response = await fetch(getRequestUrl(searchTerm, year));
        const json = await response.json();
        const result = json.esearchresult;
        //const historyKey = result.webenv;
        const articleCount = result.count;

        return makeRecord<YearDataFields>(RecordType.YearData, {
            articleCount,
        });
    } catch (e) {
        throw new Error(`Failed to find articles for ${searchTerm} in year ${year}, error: ${e.message}`);
    }
}

const API_KEY = 'fa69d0a73ca3defd15d8d04c9df896019108'

// https://www.ncbi.nlm.nih.gov/books/NBK25499/#chapter4.ESearch
const getRequestUrl = (searchTerm: string, year: number) => {
    const safeSearchTerm = encodeURIComponent(searchTerm);
    return `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=pubmed&term=${safeSearchTerm}&datetype=pdat&mindate=${year}&maxdate=${year}&retmax=1&retmode=json&useHistory=y&api_key=${API_KEY}`;
}