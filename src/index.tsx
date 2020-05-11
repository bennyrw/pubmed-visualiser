import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga';

import App from './App';
import { reducer } from './reducers';
import { getInitialState } from './store';
import { StoreState } from './types';
import { Action } from './actions';
import { fetchDataSaga } from './sagas';

const sagaMiddleware = createSagaMiddleware();
const initialState = getInitialState();
const store = createStore<StoreState, Action, any, any>(reducer,
  initialState,
  applyMiddleware(sagaMiddleware));

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

sagaMiddleware.run(fetchDataSaga);