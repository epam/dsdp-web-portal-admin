# Admin portal

Form management

## Available Scripts

In the project directory, you can run:

### `npm run start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm run test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run lint`

Runs the code linting for the app based on `.eslintrc.json` and `.eslintignore`. Also checks for typescript errors.

### `npm run build:prod`, `npm run build:clean`, `npm run test:coverage`

Used in CI. Do not remove.
- `build:prod` and `build:clean` should be no different from `build`.
- `test:coverage` also calculates coverage.

## Local development

- You can also change the API url to be used inside `public/environment.js`. Change `ENVIRONMENT_VARIABLES.apiUrl` there

- To use the local version of mdtu-web-components see it's own README

## CI configuration

### Sonar

You can manage sonar configuration by editing `sonar-project.properties`.

### CI pipes

Steps of all of the pipes are located in this repo. See `stages/`.

### Environment-dependent variables

All of environment-dependent variables should be located inside `public/environment.js.`. This file is mounted separately on each env using a config map. The value in this repo is just for local purposes.
