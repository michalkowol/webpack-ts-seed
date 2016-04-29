import * as React from 'react'
import {Router, Route, browserHistory, Link, IndexRoute} from 'react-router'
import {Commons} from 'js/commons';
import {createStore, combineReducers, applyMiddleware} from 'redux'
import {Provider} from 'react-redux'
import {syncHistoryWithStore, routerReducer, routerMiddleware, push} from 'react-router-redux'
import {connect} from "react-redux";

class Home extends React.Component<{}, {}> {
  render() {
    return <div>Home</div>
  }
}

let App = ({dispatch, children} : {dispatch: (action: any) => any, children?: React.ReactNode}) => {

  const handleSubmit = (event) => {
    event.preventDefault();
    const userName = event.target.elements.item(0).value;
    const repo = event.target.elements.item(1).value;
    const path = `/repos/${userName}/${repo}`;
    dispatch(push(path));
  };

  return (
    <div>
      <h1>React Router Tutorial</h1>
      <ul role="nav">
        <li><NavLink to="/" activeClassName="active" onlyActiveOnIndex={true}>Home</NavLink></li>
        <li><NavLink to="/repos">Repos</NavLink></li>
        <li><NavLink to="/about">About</NavLink></li>
        <li>
          <form onSubmit={handleSubmit}>
            <input type="text" placeholder="userName"/> / {' '}
            <input type="text" placeholder="repo"/>{' '}
            <button type="submit">Go</button>
          </form>
        </li>
      </ul>
      {children}
    </div>
  );
};
App = connect()(App);

const About = () => <div>About</div>;

const Repos = ({children} : {children?: React.ReactNode}) => (
  <div>
    <h2>Repos</h2>
    <ul>
      <li><NavLink to="/repos/reactjs/react-router">React Router</NavLink></li>
      <li><NavLink to="/repos/facebook/react">React</NavLink></li>
    </ul>
    {children}
  </div>
);

const Repo = ({params}: {params: {userName: string, repoName: string}}) => (
  <div>
    <h2>{params.userName}/{params.repoName}</h2>
  </div>
);

const noOpReducer = (state = 0, action: any): number => {
  return state;
};

const middleware = routerMiddleware(browserHistory);
const store = createStore(
  combineReducers({
    noOpReducer,
    routing: routerReducer
  }),
  applyMiddleware(middleware)
);
const history = syncHistoryWithStore(browserHistory, store);
history.listen(location => {
  console.log(location.pathname);
  // console.trace(location);
});

class NavLink extends React.Component<ReactRouter.LinkProps, {}> {
  render() {
    const props = Commons.assign({to: '/', activeClassName: 'active'}, this.props);
    return React.createElement(Link, props);
  }
}

const AppWithRouter = () => {
  return (
    <Provider store={store}>
      <Router history={history}>
        <Route path="/" component={App}>
          <IndexRoute component={Home}/>
          <Route path="/repos" component={Repos}>
            <Route path="/repos/:userName/:repoName" component={Repo}/>
          </Route>
          <Route path="/about" component={About}/>
        </Route>
      </Router>
    </Provider>
  );
};

export default AppWithRouter;