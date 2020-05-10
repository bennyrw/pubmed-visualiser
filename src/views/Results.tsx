import React from 'react';
import { connect } from 'react-redux';

import {
  LineChart, Line, LineProps, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

import { StoreState } from '../store';
import { PublicationData } from '../types';
import { getText, LOCALE } from '../constants';
import { getLineChartData, getArticleCountDataKey, getArticleCountLabel } from './ResultsChartData';

interface Props {
  searchTerm: string | undefined;
  publicationData?: PublicationData;
}

function ResultsPanel(props: Props) {
  const { searchTerm, publicationData } = props;

  if (!searchTerm || !publicationData) {
    return null;
  }

  const data = getLineChartData(searchTerm, publicationData);
  // todo - line + dot colours
  const allLineProps: Array<LineProps> = [
    {
      dataKey: getArticleCountDataKey(searchTerm),
      stroke: "#8884d8",
      fill: "#8884d8",
      activeDot: { stroke: 'red', fill: "yellow" }
    },
  ];

  return (
    <div style={{ width: '100%', height: 300 }}>
      <ResponsiveContainer>
        <LineChart data={data.yearDataPoints}>
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
              [0, Number((data.maxArticleCount * 1.1).toPrecision(2))]
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

function mapStateToProps({ searchTerm, publicationData }: StoreState) {
  return {
    searchTerm,
    publicationData,
  }
}

function mapDispatchToProps(dispatch: any) {
  return {
    // todo
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ResultsPanel);