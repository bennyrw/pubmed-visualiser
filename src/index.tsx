import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware, Middleware } from 'redux';
import createSagaMiddleware from 'redux-saga';
import * as log from 'loglevel';

import { config } from './config';
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
const loggingPassThroughMiddleware: Middleware = store => next => action => {
  log.debug('dispatching', action);
  let result = next(action);
  log.debug('next state', store.getState());
  return result;
}

const store = createStore<StoreState, Action, any, any>(reducer,
  initialState,
  applyMiddleware(loggingPassThroughMiddleware, sagaMiddleware));

sagaMiddleware.run(fetchDataSaga);

// schedule initial searches
config.initialSearchTerms.forEach(searchTerm => {
  store.dispatch(startFetchData(searchTerm));
});

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);