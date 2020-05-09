import React from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';

/**
 * Basic component to show loading is occurring. Currently just abstracts out a Material UI
 * component.
 */
function Loading() {
  return (
    <CircularProgress />
  );
}

export default Loading;