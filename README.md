[![Netlify Status](https://api.netlify.com/api/v1/badges/4a7fadb4-3456-46e4-b1bc-eeb919985dbe/deploy-status)](https://app.netlify.com/sites/pubmed-visualiser/deploys)

Visualise research using [PubMed data](https://www.ncbi.nlm.nih.gov/books/NBK3827).

Available on https://pubmed-visualiser.netlify.app

## Usage

In the project directory, tested on Node 10, use:
* `npm i`
* `npm run start` to run from source. App is accessible on http://localhost:3000.
* `npm run build` to bundle and minify the app for deployment to the `build` folder.

Supported URL query options that you may be interested in to create/share bookmarkable links are:
* `q=searchTerm` - term(s) to search for. Separate multiple terms with a `|`
* `from=2000` - start year
* `to=2020` - end year

## Limitations

* Supports only newer browsers that provide the `fetch` API. To add `XHR` support for older browsers, the API accessors in `src/external` would need updating.

## Technology

Bootstrapped with [Create React App](https://github.com/facebook/create-react-app), this project also uses:
* React & Material UI - for rendering and UI components.
* [Recharts](https://recharts.org/) for charts.
* Redux & Redux-saga - for simple, cross-app state management and async processing.