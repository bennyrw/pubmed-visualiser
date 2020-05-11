import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga';
import * as log from 'loglevel';

import {config} from './config';
import App from './App';
import { reducer } from './reducers';
import { getInitialState } from './store';
import { StoreState } from './types';
import { Action, startFetchData } from './actions';
import { fetchDataSaga } from './sagas';

// workaround typescript check as LogLevelDesc isn't exported from 'loglevel'
log.setLevel(config.logLevel as any);

const sagaMiddleware = createSagaMiddleware();
const initialState = getInitialState();
const store = createStore<StoreState, Action, any, any>(reducer,
  initialState,
  applyMiddleware(sagaMiddleware));

sagaMiddleware.run(fetchDataSaga);

// schedule initial searches
config.searchTerms.forEach(searchTerm => {
  store.dispatch(startFetchData(searchTerm, config.searchEarliestYear, config.searchLatestYear));
});

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);