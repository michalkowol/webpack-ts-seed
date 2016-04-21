import { AppContainer } from 'react-hot-loader'
import * as React from 'react'
import * as ReactDOM from 'react-dom'
import App from 'js/component/App'

require('file?name=[name].[ext]!index.html');
require('file?name=[name].[ext]!bootstrap/dist/css/bootstrap.min.css');
require('js/myredux');
require('css/main.scss');

const rootEl = document.getElementById('app');
ReactDOM.render(<AppContainer component={App} />, rootEl);

if (module.hot) {
  module.hot.accept('js/component/App', () => {
    ReactDOM.render(<AppContainer component={require('js/component/App').default} />, rootEl);
  });
}