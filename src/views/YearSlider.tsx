import React from 'react';
import { connect } from 'react-redux';

import { makeStyles } from '@material-ui/core/styles';

import { config } from '../config';
import { StoreState } from '../types';
import { setSelectedYearRange } from '../actions';
import { Slider } from '@material-ui/core';

interface Props {
    selectedMinYear: number,
    selectedMaxYear: number,
    fireSetYearRange: (minSelectedYear: number, maxSelectedYear: number) => void;
}

/**
 * Component for the search icon, input and button.
 */
function YearSlider(props: Props) {
    const {selectedMinYear, selectedMaxYear, fireSetYearRange} = props;
    const styles = useStyles();

    const onChange = (e: React.ChangeEvent<any>, values: number | number[]) => {
        const [min, max] = values as number[];
        fireSetYearRange(min, max);
    }

    const marks = [config.minSelectableYear, config.maxSelectableYear].map(year => {
        return {value: year, label: year}
    });

    return <div className={styles.sliderContainer}>
        <Slider
            min={config.minSelectableYear}
            max={config.maxSelectableYear}
            value={[selectedMinYear, selectedMaxYear]}
            onChange={onChange}
            marks={marks}
            valueLabelDisplay="on"
        />
    </div>;
}

const useStyles = makeStyles((theme) => ({
    sliderContainer: {
        marginLeft: '3rem',
        marginRight: '3rem',
        marginTop: '3.3rem',
    },
}));

function mapStateToProps(state: StoreState) {
    return {
        selectedMinYear: state.selectedMinYear,
        selectedMaxYear: state.selectedMaxYear,
    }
}

function mapDispatchToProps(dispatch: any) {
    return {
        fireSetYearRange: (minSelectedYear: number, maxSelectedYear: number) => {
            dispatch(setSelectedYearRange(minSelectedYear, maxSelectedYear));
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(YearSlider);