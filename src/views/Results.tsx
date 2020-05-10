import React from 'react';
import { connect } from 'react-redux';
import { Map } from 'immutable';

import { makeStyles } from '@material-ui/core/styles';

import { StoreState } from '../store';
import { PublicationData } from '../types';

import ResultsChart from './ResultsChart';
import SearchTermChips from './SearchTermChips';

interface Props {
  publicationData: Map<string, PublicationData>;
}

function ResultsPanel(props: Props) {
  const { publicationData } = props;
  const styles = useStyles();

  const hasPublicationData = publicationData.size > 0;
  if (!hasPublicationData) {
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

function mapStateToProps({ publicationData }: StoreState) {
  return {
    publicationData,
  }
}

function mapDispatchToProps(dispatch: any) {
  return {}
}

export default connect(mapStateToProps, mapDispatchToProps)(ResultsPanel);