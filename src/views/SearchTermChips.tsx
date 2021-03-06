import React from 'react';
import { connect } from 'react-redux';

import * as Color from 'color';
import { makeStyles } from '@material-ui/core/styles';
import Chip from '@material-ui/core/Chip';
import Avatar from '@material-ui/core/Avatar';
import CircularProgress from '@material-ui/core/CircularProgress';

import { getSearchBaseColour } from './SearchSlotColour';
import { StoreState, DiseaseData } from '../types';
import { removeSearchResults } from '../actions';
import { isSearchTermLoading } from '../store';

interface ChipInfo {
  label: string;
  baseColour: Color;
  isLoading: boolean;
}

interface Props {
  chipInfo: ChipInfo[];
  onDelete: (searchTerm: string) => void;
}

/**
 * Component for displaying a list of chips, one for each search conducted.
 */
function SearchTermChips({ chipInfo, onDelete }: Props) {
  const styles = useStyles();

  return (
    <div className={styles.chipPanel}>
      {chipInfo.map((chip) => {
        const loadingElement = chip.isLoading ?
          (<Avatar style={{ backgroundColor: chip.baseColour.hex() }}>
            <CircularProgress style={{ color: chip.baseColour.lighten(0.9).hex() }} size='1rem' />
          </Avatar>) : undefined;

        return (<Chip key={chip.label}
          avatar={loadingElement}
          style={{ backgroundColor: chip.baseColour.hex() }}
          label={chip.label}
          color="primary"
          onDelete={onDelete.bind(null, chip.label)} />
        );
      })}
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
  const chipInfo: ChipInfo[] = [];
  state.diseaseData.forEach((diseaseData: DiseaseData, searchTerm: string) => {
    chipInfo.push({
      label: searchTerm,
      baseColour: getSearchBaseColour(diseaseData.activeSearchSlot),
      isLoading: isSearchTermLoading(state, searchTerm),
    });
  });

  return {
    chipInfo,
  }
}

function mapDispatchToProps(dispatch: any) {
  return {
    onDelete: (searchTerm: string) => dispatch(removeSearchResults(searchTerm)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SearchTermChips);