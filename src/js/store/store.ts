import * as React from 'react'
import {browserHistory} from 'react-router'
import {createStore, combineReducers, compose, applyMiddleware, Middleware, Store} from 'redux'
import {syncHistoryWithStore, routerReducer, routerMiddleware, ReactRouterReduxHistory} from 'react-router-redux'
import RepoReducer from 'js/reducer/RepoReducer'

const middleware: Middleware = routerMiddleware(browserHistory);
const devToolsExtension = (() => {
  const devTools: Function = (window as any).devToolsExtension;
  return devTools ? devTools() : f => f;
})();

const reducers = combineReducers({
  repos: RepoReducer,
  routing: routerReducer
});

const initialState = undefined;

export const store: Store = createStore(
  reducers,
  initialState,
  compose(applyMiddleware(middleware), devToolsExtension)
);

export const history: ReactRouterReduxHistory = syncHistoryWithStore(browserHistory, store);

history.listen(location => {
  console.log(location.pathname);
  // console.trace(location);
});

store.subscribe(() => {
  // console.trace(store.getState());
});