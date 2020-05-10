import { RecordOf, Map, fromJS, isKeyed } from 'immutable';

import { PublicationData, YearDataProps, makeRecord } from '../types';
import { DEBUG } from '../constants';

interface StoreStateProps {
    /**
     * Publication data that we've received so far. Keyed on the search term.
     */
    publicationData: Map<string, PublicationData>;
}

export type StoreState = RecordOf<StoreStateProps>;

export function getInitialState(): StoreState {
    let state: StoreState = makeRecord<StoreStateProps>({
        publicationData: Map<string, PublicationData>(),
    });

    // Support various debugging behaviours. Useful when getting layout right while the app is in particular states.
    if (DEBUG.MOCK_PUBLICATION_DATA) {
        const debugData = {
            'Cancer': {
                2000: { articleCount: 70000 },
                2001: { articleCount: 73000 },
                2002: { articleCount: 76000 },
                2003: { articleCount: 82000 },
                2004: { articleCount: 87000 },
                2005: { articleCount: 96000 },
                2006: { articleCount: 102000 },
                2007: { articleCount: 109000 },
                2008: { articleCount: 117000 },
                2009: { articleCount: 123000 },
                //2010: { articleCount: 135000 }, // Simulate a missing value
                2011: { articleCount: 148000 },
                2012: { articleCount: 160000 },
                2013: { articleCount: 170000 },
                2014: { articleCount: 186000 },
                2015: { articleCount: 197000 },
                2016: { articleCount: 200000 },
                2017: { articleCount: 207000 },
                2018: { articleCount: 214000 },
                2019: { articleCount: 213000 },
            },
            'Spanish flu': {
                // occurs before the others
                1920: { articleCount: 10 },
                1925: { articleCount: 15 },
                1930: { articleCount: 0 },
            },
            'COVID-19': {
                // only over part of the range of 'Cancer'
                2018: { articleCount: 0 },
                2019: { articleCount: 30 },
                2020: { articleCount: 5000 },
            }
        }
        const reviver = (key: string | number,
            value: any,
            path: (string | number)[] | undefined) => {
            if (isKeyed(value)) {
                if (path && path.length === 2) {
                    return makeRecord<YearDataProps>(value.toObject() as YearDataProps);
                } else {
                    return value.toOrderedMap();
                }
            } else {
                return value.toList();
            }
        }
        state = state.set('publicationData', fromJS(debugData, reviver));
    }

    return state;
}