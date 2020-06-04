import React from 'react';
import { connect } from 'react-redux';

import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Avatar from '@material-ui/core/Avatar';
import SearchIcon from '@material-ui/icons/Search';
import AssignmentIcon from '@material-ui/icons/Assignment';
import { makeStyles } from '@material-ui/core/styles';

import { StoreState } from '../types';
import { startFetchData, removeSearchResults } from '../actions';

interface Props {
  onSearch: (searchTerm: string) => void;
}

/**
 * Component for the search icon, input and button.
 */
function Search(props: Props) {
  const [searchTerm, setSearchTerm] = React.useState('');

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  }

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    // prevent page reload
    e.preventDefault();

    props.onSearch(searchTerm);
  }

  const buttonEnabled = Boolean(searchTerm);
  const styles = useStyles();

  return (
    <div className={styles.search}>
      <form className={styles.form} onSubmit={onSubmit}>
        <Avatar className={styles.avatar}>
          <AssignmentIcon fontSize="large" titleAccess="enter search term" />
        </Avatar>
        <TextField
          data-testid="search-term"
          name="search-term"
          variant="outlined"
          required
          fullWidth
          autoFocus
          onChange={onChange}
          value={searchTerm} />
        <Button
          className={styles.submit}
          data-testid="search-button"
          variant="contained"
          color="primary"
          type="submit"
          disabled={!buttonEnabled}>
          <SearchIcon titleAccess="search" />
        </Button>
      </form>
    </div>
  );
}

const useStyles = makeStyles((theme) => ({
  search: {
    marginTop: theme.spacing(2),
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.primary.main,
  },
  form: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(0, 1),
  },
}));

function mapStateToProps(state: StoreState) {
  return {}
}

function mapDispatchToProps(dispatch: any) {
  return {
    onSearch: (searchTerm: string) => {
      // remove the search results for this term, if there are any (this will cancel any pending data requests for it)
      dispatch(removeSearchResults(searchTerm));
      dispatch(startFetchData(searchTerm));
    },
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Search);