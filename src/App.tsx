import React from 'react';
import { connect } from 'react-redux';
import { Map } from 'immutable';

import Container from '@material-ui/core/Container';
import { makeStyles } from '@material-ui/core/styles';

import Search from './views/Search';
import Results from './views/Results';

import { StoreState } from './store';
import { PublicationData } from './types';

interface Props {
  publicationData: Map<string, PublicationData>;
}

/**
 * Top level UI component.
 */
function App({ publicationData }: Props) {
  const styles = useStyles();
  const hasPublicationData = publicationData.size > 0;
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

function mapStateToProps({ publicationData }: StoreState) {
  return {
    publicationData,
  }
}

export default connect(mapStateToProps)(App);