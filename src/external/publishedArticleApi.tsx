import { YearData, YearDataFields, makeRecord } from '../types';

/**
 * Get data for a specific search term and year.
 * Returns null if nothing is found.
 */
export async function getPublishedArticleData(searchTerm: string, year: number): Promise<YearData | null> {
    try {
        const response = await fetch(getRequestUrl(searchTerm, year));
        const json = await response.json();
        const result = json.esearchresult;
        //const historyKey = result.webenv; // todo - use this for more info
        const articleCount = result.count;

        return makeRecord<YearDataFields>({
            articleCount,
        });
    } catch (e) {
        throw new Error(`Failed to find articles for ${searchTerm} in year ${year}, error: ${e.message}`);
    }
}

// todo - apply some security practice?
const API_KEY = 'fa69d0a73ca3defd15d8d04c9df896019108'

// todo - temp
// https://www.ncbi.nlm.nih.gov/books/NBK25499/#chapter4.ESearch
const getRequestUrl = (searchTerm: string, year: number) => {
    const safeSearchTerm = encodeURIComponent(searchTerm);
    return `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=pubmed&term=${safeSearchTerm}&datetype=pdat&mindate=${year}&maxdate=${year}&retmax=1&retmode=json&useHistory=y&api_key=${API_KEY}`;
}