import * as React from 'react'
import {browserHistory} from 'react-router'
import {createStore, combineReducers, applyMiddleware} from 'redux'
import {syncHistoryWithStore, routerReducer, routerMiddleware} from 'react-router-redux'

const noOpReducer = (state = 0, action: any): number => {
  return state;
};

const middleware = routerMiddleware(browserHistory);
export const appWithRouterStore = createStore(
  combineReducers({
    noOpReducer,
    routing: routerReducer
  }),
  applyMiddleware(middleware)
);

export const history = syncHistoryWithStore(browserHistory, appWithRouterStore);

history.listen(location => {
  console.log(location.pathname);
  // console.trace(location);
});