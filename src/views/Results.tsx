import React from 'react';
import { connect } from 'react-redux';

import { makeStyles } from '@material-ui/core/styles';

import { StoreState } from '../store';
import { PublicationData, Dictionary } from '../types';

import ResultsChart from './ResultsChart';

interface Props {
  publicationData?: Dictionary<PublicationData>;
}

function ResultsPanel(props: Props) {
  const { publicationData } = props;
  const styles = useStyles();

  if (!publicationData) {
    return null;
  }

  return (
    <div className={styles.resultPanel}>
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