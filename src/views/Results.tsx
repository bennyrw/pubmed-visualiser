import React from 'react';
import { connect } from 'react-redux';
import { Map } from 'immutable';

import { makeStyles } from '@material-ui/core/styles';

import { StoreState, DiseaseData } from '../types';

import ResultsChart from './ResultsChart';
import SearchTermChips from './SearchTermChips';

interface Props {
  diseaseData: Map<string, DiseaseData>;
}

function ResultsPanel(props: Props) {
  const { diseaseData } = props;
  const styles = useStyles();

  if (diseaseData.size === 0) {
    return null;
  }

  return (
    <div className={styles.resultPanel}>
      <SearchTermChips />
      <ResultsChart />
    </div>
  );
}

const useStyles = makeStyles(() => ({
  resultPanel: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
}));

function mapStateToProps({ diseaseData }: StoreState) {
  return {
    diseaseData,
  }
}

function mapDispatchToProps(dispatch: any) {
  return {}
}

export default connect(mapStateToProps, mapDispatchToProps)(ResultsPanel);