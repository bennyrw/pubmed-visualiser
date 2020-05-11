import React from 'react';
import { connect } from 'react-redux';
import { Map } from 'immutable';

import {
    LineChart, Line, LineProps, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import * as Color from 'color';

import { StoreState, DiseaseData } from '../types';
import { getText, LOCALE } from '../constants';
import { getLineChartData, getArticleCountDataKey, getArticleCountLabel } from './ResultsChartData';

interface Props {
    diseaseData: Map<string, DiseaseData>;
}

function ResultsChart(props: Props) {
    const { diseaseData } = props;

    // create a line for each search term we have
    const allChartData = getLineChartData(diseaseData);
    const allLineProps: Array<LineProps> = diseaseData.entrySeq().toArray().map((entry) => {
        const [searchTerm,] = entry;
        // todo - colours
        const baseColour = Color.rgb(66, 135, 245);
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

    return (
        <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
                <LineChart data={allChartData.yearDataPoints}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="year" />
                    <YAxis width={90}
                        label={{
                            value: getText('number-of-articles', LOCALE),
                            angle: -90,
                            position: 'insideLeft',
                        }}
                        domain={
                            // Recharts doesn't seem to work properly if we leave the domain as [0, 'auto'] so manually set the y-axis domain
                            // Increase known max by 10% and then round to 2.s.f. seems to work pretty well
                            [0, Number((allChartData.maxArticleCount * 1.1).toPrecision(2))]
                        } />
                    <Tooltip formatter={(value, name/*, props*/) => {
                        return [value, getArticleCountLabel(name)];
                    }} />
                    <Legend formatter={(value/*, entry, index*/) => {
                        return `${getArticleCountLabel(value)}`
                    }} />
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