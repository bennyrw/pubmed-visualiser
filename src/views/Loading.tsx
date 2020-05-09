import React from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';

// todo - avoid using and remove?

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