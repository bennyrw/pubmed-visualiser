Web app that takes a disease or disease area as input and displays a chart showing the number of research articles mentioning that disease/area over time (year-by-year in a user-defined period).

TODO - mention mapping stuff?

## Technology

Bootstrapped with [Create React App](https://github.com/facebook/create-react-app), this project also uses:
* React & Material UI - for rendering and UI components.
* Redux & Redux-saga - for simple, cross-app state management and async processing.
* TypeScript - for type-safety.

## APIs used

TODO

## Usage

In the project directory, use:
* `npm run start` to run from source. App is accessible on http://localhost:3000. To easily debug different application states (specifically layouts), see [constants.tsx](./src/constants.tsx).
* `npm run test` to execute automated tests. The app is not exhaustively unit tested, but has examples of how this can be done for React components and Redux reducers.
* `npm run build` to bundle and minify the app for deployment to the `build` folder.

## Assumptions/Design choices

* Applied the principles of clean coding - avoiding duplication (DRY); comments aiming to explain _why_ not _what_; clear variable/type/function names; etc.
* Minimised UI text, favouring icons to convey meaning. This would make it easier to support additional languages.
* Support only newer browsers that provide the `fetch` API. Could extend to add `XHR` support for older browsers easily and only the API accessors in `src/external` would need updating.

## Extensions

* TODO

## TODO

* Remove dependencies no longer needed
* Check no weather/forecast/location remnants
* All TODOs