import React from 'react';
import { connect } from 'react-redux';

import Container from '@material-ui/core/Container';
import { makeStyles } from '@material-ui/core/styles';
import Alert from '@material-ui/lab/Alert';

import Search from './views/Search';
import Loading from './views/Loading';
import Results from './views/Results';

import { StoreState } from './store';
import { PublicationData } from './types';
import { getText } from './constants';

interface Props {
  publicationData?: PublicationData;
}

/**
 * Top level UI component.
 */
function App({ publicationData }: Props) {
  const styles = useStyles();
  return (
    <Container component="main" maxWidth="xl">
      <Search />
      <div className={styles.resultPanel}>
        {publicationData && <Results />}
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