import React from 'react';
import { connect } from 'react-redux';

import Container from '@material-ui/core/Container';
import { makeStyles } from '@material-ui/core/styles';
import Alert from '@material-ui/lab/Alert';

import Search from './views/Search';
import Loading from './views/Loading';
import Results from './views/Results';

import { StoreState } from './store';
import { TrendData, PendingDiseaseRequest } from './types';
import { getText } from './constants';

interface Props {
  pendingDiseaseRequests: PendingDiseaseRequest[];
  trendData?: TrendData;
}

/**
 * Top level UI component.
 */
function App({ pendingDiseaseRequests, trendData }: Props) {
  const styles = useStyles();
  const isFetchingData = pendingDiseaseRequests.length > 0;
  return (
    <Container component="main" maxWidth="xl">
      <Search />
      <div className={styles.resultPanel}>
        {isFetchingData && <Loading />}
        {!isFetchingData && trendData && <Results />}
      </div>
    </Container>
  );
}

type Styles = any;

function renderError(errorKey: string, styles: Styles) {
  return (
    <div className={styles.error}>
      <Alert severity="error">{getText(errorKey)}</Alert>
    </div>
  );
}

const useStyles = makeStyles((theme) => ({
  resultPanel: {
    marginTop: theme.spacing(4),
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
    overflow: 'hidden',
  },
  error: {
    marginTop: theme.spacing(4),
  }
}));

function mapStateToProps({ pendingDiseaseRequests, trendData }: StoreState) {
  return {
    pendingDiseaseRequests,
    trendData,
  }
}

export default connect(mapStateToProps)(App);