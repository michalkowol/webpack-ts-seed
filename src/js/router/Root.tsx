import * as React from 'react'
import {Router, Route, IndexRoute} from 'react-router'
import {Store} from 'redux'
import {Provider} from 'react-redux'
import {ReactRouterReduxHistory} from 'react-router-redux'

import App from 'js/component/App'
import Home from 'js/component/Home'
import Repo from 'js/component/Repo'
import Repos from 'js/component/Repos'
import About from 'js/component/About'

const Root = ({store, history} : {store: Store, history: ReactRouterReduxHistory}) => {
  return (
    <Provider store={store}>
      <Router history={history}>
        <Route path='/' component={App}>
          <IndexRoute component={Home}/>
          <Route path='/repos' component={Repos}>
            <Route path='/repos/:userName/:repoName' component={Repo}/>
          </Route>
          <Route path='/about' component={About}/>
        </Route>
      </Router>
    </Provider>
  );
};

export default Root;