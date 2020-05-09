import React from 'react';

// todo 


// import { createStore } from 'redux';
// import { Provider } from 'react-redux';
// import { render } from '@testing-library/react';

// import Search from '../Search';
// import { StoreState, getInitialState } from '../../store';
// import { Action, fetchForecast, setLocation } from '../../actions';
// import { reducer } from '../../reducers';

// describe('search controls', () => {
//     const renderWithStoreState = ((state: StoreState) => {
//         const store = createStore<StoreState, Action, any, any>(reducer, state);
//         store.dispatch = jest.fn();
//         const renderResult = render(<Provider store={store}><Search /></Provider>);
//         return {
//             store,
//             renderResult,
//         }
//     });

//     it('without a location, the button is disabled', () => {
//         const state = getInitialState();
//         state.location = '';

//         const { renderResult: { getByTestId } } = renderWithStoreState(state);

//         const locationElement = getByTestId('search-location');
//         expect(locationElement).toBeVisible();

//         let searchButton = getByTestId('search-button');
//         expect(searchButton).toBeVisible();
//         expect(searchButton).toBeDisabled();
//     });

//     it('with a location, the button is enabled and clicking it generates fetch action', () => {
//         const state = getInitialState();
//         state.location = 'London';

//         const { store, renderResult: { getByTestId } } = renderWithStoreState(state);

//         const locationElement = getByTestId('search-location');
//         expect(locationElement).toBeVisible();

//         let searchButton = getByTestId('search-button');
//         expect(searchButton).toBeVisible();
//         expect(searchButton).toBeEnabled();

//         searchButton.click();

//         // expect dispatch to be called for setting location + firing search
//         expect(store.dispatch).toHaveBeenCalledTimes(2);
//         expect(store.dispatch).toHaveBeenCalledWith(setLocation('London'));
//         expect(store.dispatch).toHaveBeenCalledWith(fetchForecast());
//     });
// });
