import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Map } from 'immutable';

import Container from '@material-ui/core/Container';
import { makeStyles } from '@material-ui/core/styles';

import Search from './views/Search';
import Results from './views/Results';

import { StoreState, DiseaseData } from './types';
import { getUrlHash } from './config';

interface Props {
  diseaseData: Map<string, DiseaseData>;
}

/**
 * Top level UI component.
 */
function App({ diseaseData }: Props) {
  const styles = useStyles();

  useEffect(() => {
    const searches = diseaseData.keySeq();
    window.location.hash = getUrlHash(searches.toArray());
  });

  const hasPublicationData = diseaseData.size > 0;
  return (
    <Container component="main" maxWidth="xl">
      <Search />
      <div className={styles.resultPanel}>
        {hasPublicationData && <Results />}
      </div>
    </Container>
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
}));

function mapStateToProps({ diseaseData }: StoreState) {
  return {
    diseaseData,
  }
}

export default connect(mapStateToProps)(App);