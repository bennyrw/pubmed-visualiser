import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Map } from 'immutable';

import Container from '@material-ui/core/Container';
import { makeStyles } from '@material-ui/core/styles';

import Search from './views/Search';
import Results from './views/Results';

import { StoreState, DiseaseData } from './types';
import { getUrlHash } from './config';
import { Typography } from '@material-ui/core';

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
      <Typography align='center' color='primary' variant='h4'>PubMed Research Visualiser</Typography>
      <Typography align='center' variant='subtitle1'>Search for anything</Typography>
      <Search />
      <div className={styles.resultPanel}>
        {hasPublicationData && <Results />}
      </div>
      <div className={styles.footer}>
        <Typography align='center' variant='body2'>Built using data from the <a href='https://www.ncbi.nlm.nih.gov'>U.S. National Library of Medicine</a>'s <a href='https://www.ncbi.nlm.nih.gov/books/NBK3827'>PubMed</a> database</Typography>
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
  footer: {
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
    height: '2rem',
  },
}));

function mapStateToProps({ diseaseData }: StoreState) {
  return {
    diseaseData,
  }
}

export default connect(mapStateToProps)(App);