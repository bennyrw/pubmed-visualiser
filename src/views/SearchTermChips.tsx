import React from 'react';
import { connect } from 'react-redux';

import Chip from '@material-ui/core/Chip';

import { StoreState } from '../store';
import { removeSearchResults } from '../actions';

interface Props {
  searchTermChips: string[];
  onDelete: (searchTerm: string) => void;
}

/**
 * Component for displaying a list of chips, one for each search conducted.
 */
function SearchTermChips({ searchTermChips, onDelete }: Props) {
  return (
    <div>
      {searchTermChips.map((chip) => (
        <Chip key={chip}
          label={chip}
          color="primary"
          onDelete={onDelete.bind(null, chip)} />
      ))}
    </div>
  );
}

function mapStateToProps(state: StoreState) {
  return {
    searchTermChips: state.publicationData.keySeq().toArray(),
  }
}

function mapDispatchToProps(dispatch: any) {
  return {
    onDelete: (searchTerm: string) => dispatch(removeSearchResults(searchTerm)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SearchTermChips);