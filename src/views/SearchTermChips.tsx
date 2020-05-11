import React from 'react';
import { connect } from 'react-redux';

import { makeStyles } from '@material-ui/core/styles';
import Chip from '@material-ui/core/Chip';

import { StoreState } from '../types';
import { removeSearchResults } from '../actions';

interface Props {
  searchTermChips: string[];
  onDelete: (searchTerm: string) => void;
}

/**
 * Component for displaying a list of chips, one for each search conducted.
 */
function SearchTermChips({ searchTermChips, onDelete }: Props) {
  const styles = useStyles();

  return (
    // todo - colours
    <div className={styles.chipPanel}>
      {searchTermChips.map((chip) => (
        <Chip key={chip}
          style={{ backgroundColor: '#ff00ff' }}
          label={chip}
          color="primary"
          onDelete={onDelete.bind(null, chip)} />
      ))}
    </div>
  );
}

const useStyles = makeStyles((theme) => ({
  chipPanel: {
    marginBottom: theme.spacing(3),
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    '& > *': {
      margin: theme.spacing(0.5),
    },
  },
}));

function mapStateToProps(state: StoreState) {
  return {
    searchTermChips: state.diseaseData.keySeq().toArray(),
  }
}

function mapDispatchToProps(dispatch: any) {
  return {
    onDelete: (searchTerm: string) => dispatch(removeSearchResults(searchTerm)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SearchTermChips);