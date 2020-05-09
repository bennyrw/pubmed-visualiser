import React from 'react';
import { connect } from 'react-redux';
import { List } from 'immutable';

import useMediaQuery from '@material-ui/core/useMediaQuery';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Slider, { Mark } from '@material-ui/core/Slider';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

import { StoreState } from '../store';
import { PublicationData } from '../types';
import { getText, LOCALE } from '../constants';

interface Props {
  publicationData?: PublicationData;
}

function ResultsPanel(props: Props) {
  const { publicationData } = props;
  const isSmallScreen = !useMediaQuery('(min-width:800px)');
  const styles = useStyles();

  if (!publicationData) {
    return null;
  }

  // todo
  return <div>Not implemented yet!</div>
}

const useStyles = makeStyles((theme) => ({
  // todo
}));

function mapStateToProps({ publicationData }: StoreState) {
  return {
    publicationData,
  }
}

function mapDispatchToProps(dispatch: any) {
  return {
    // todo
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ResultsPanel);