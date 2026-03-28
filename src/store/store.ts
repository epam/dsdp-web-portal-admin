import { Action, applyMiddleware, createStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import { createEpicMiddleware } from 'redux-observable';

import { rootEpic } from './rootEpic';
import { rootReducer, RootState } from './rootReducer';

const epicMiddleware = createEpicMiddleware<Action, Action, RootState>();

const configureStore = () => {
  const newStore = createStore(
    rootReducer(),
    composeWithDevTools(applyMiddleware(epicMiddleware)),
  );

  epicMiddleware.run(rootEpic);

  return newStore;
};

export const store = configureStore();
