import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Map } from 'immutable';

import Container from '@material-ui/core/Container';
import { makeStyles } from '@material-ui/core/styles';

import Search from './views/Search';
import YearSlider from './views/YearSlider';
import Results from './views/Results';

import { StoreState, DiseaseData } from './types';
import { getUrlHash } from './config';
import { getText } from './i18n';
import { Typography } from '@material-ui/core';

interface Props {
  diseaseData: Map<string, DiseaseData>;
  selectedMinYear: number;
  selectedMaxYear: number;
}

/**
 * Top level UI component.
 */
function App({ diseaseData, selectedMinYear, selectedMaxYear }: Props) {
  const styles = useStyles();

  useEffect(() => {
    const searches = diseaseData.keySeq();
    window.location.hash = getUrlHash(searches.toArray(), selectedMinYear, selectedMaxYear);
  });

  const hasPublicationData = diseaseData.size > 0;
  return (
    <Container component="main" maxWidth="xl">
      <Typography align='center' color='primary' variant='h4'>{getText('title')}</Typography>
      <Typography align='center' variant='subtitle1'>{getText('subtitle')}</Typography>
      <Search />
      <YearSlider />
      <div className={styles.resultPanel}>
        {hasPublicationData && <Results />}
      </div>
      <div className={styles.footer}>
        <Typography align='center' variant='body2'>{getText('footer-prefix')} <a href="https://www.ncbi.nlm.nih.gov/books/NBK3827">PubMed</a></Typography>
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

function mapStateToProps({ diseaseData, selectedMinYear, selectedMaxYear }: StoreState) {
  return {
    diseaseData,
    selectedMinYear,
    selectedMaxYear,
  }
}

export default connect(mapStateToProps)(App);