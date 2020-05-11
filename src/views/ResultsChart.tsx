import React from 'react';
import { connect } from 'react-redux';
import { Map } from 'immutable';

import {
    LineChart, Line, LineProps, XAxis, YAxis, Label, CartesianGrid, Tooltip, Legend,
    ResponsiveContainer
} from 'recharts';
import Typography from '@material-ui/core/Typography';

import { StoreState, DiseaseData } from '../types';
import { getText, LOCALE } from '../constants';
import { getLineChartData, getArticleCountDataKey, getArticleCountLabel } from './ResultsChartData';
import { getSearchBaseColour } from './SearchSlotColour';

interface Props {
    diseaseData: Map<string, DiseaseData>;
}

function ResultsChart(props: Props) {
    const { diseaseData } = props;

    // create a line for each search term we have
    const allChartData = getLineChartData(diseaseData);
    const allLineProps: Array<LineProps> = diseaseData.entrySeq().toArray().map((entry) => {
        const [searchTerm, searchDiseaseData] = entry;
        const baseColour = getSearchBaseColour(searchDiseaseData.activeSearchSlot);
        return {
            key: searchTerm, // React's unique rendering key
            dataKey: getArticleCountDataKey(searchTerm),
            stroke: baseColour.hex(),
            fill: baseColour.darken(0.1).hex(),
            activeDot: {
                stroke: baseColour.darken(0.3).hex(),
                fill: baseColour.darken(0.4).hex(),
            }
        };
    });

    const axisAndLegendFontProps = {
        fontFamily: 'roboto',
        fontSize: '0.8em'
    }

    return (
        <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
                <LineChart data={allChartData.yearDataPoints}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="year" tick={{ ...axisAndLegendFontProps }} />
                    <YAxis width={90}
                        tick={{ ...axisAndLegendFontProps }}
                        label={{
                            value: getText('number-of-articles', LOCALE),
                            angle: -90,
                            position: 'insideLeft',
                            ...axisAndLegendFontProps,
                        }}
                        domain={
                            // Recharts doesn't seem to work properly if we leave the domain as [0, 'auto'] so manually set the y-axis domain
                            // Increase known max by 10% and then round to 2.s.f. seems to work pretty well
                            [0, Number((allChartData.maxArticleCount * 1.1).toPrecision(2))]
                        } />
                    <Tooltip formatter={(value, name/*, props*/) => {
                        return [value, getArticleCountLabel(name)];
                    }} />
                    <Legend formatter={(value/*, entry, index*/) =>
                        <Typography variant='caption'>
                            {getArticleCountLabel(value)}
                        </Typography>
                    } />
                    {allLineProps.map((lineProps: LineProps) =>
                        <Line connectNulls
                            type="monotone"
                            {...lineProps} />
                    )}
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}

function mapStateToProps({ diseaseData }: StoreState) {
    return {
        diseaseData,
    }
}

function mapDispatchToProps(dispatch: any) {
    return {}
}

export default connect(mapStateToProps, mapDispatchToProps)(ResultsChart);