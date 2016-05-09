import {AppContainer} from 'react-hot-loader'
import * as React from 'react'
import * as ReactDOM from 'react-dom'
import Root from 'js/router/Root'
import {store, history} from 'js/store/store'


require('file?name=[name].[ext]!index.html');
require('file?name=[name].[ext]!bootstrap/dist/css/bootstrap.min.css');
require('css/main.scss');

const rootEl = document.getElementById('app');
ReactDOM.render(<AppContainer><Root store={store} history={history} /></AppContainer>, rootEl);

if (module.hot) {
  module.hot.accept('js/router/Root', () => {
    const NewRoot = require('js/router/Root').default;
    ReactDOM.render(<AppContainer><NewRoot store={store} history={history} /></AppContainer>, rootEl);
  });
}