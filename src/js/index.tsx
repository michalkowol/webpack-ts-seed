import { AppContainer } from 'react-hot-loader'
import * as React from 'react'
import * as ReactDOM from 'react-dom'
import App from 'js/component/App'
// import todoStore from 'js/todo/todoStore'
// import TodoApp from 'js/todo/todo'

require('file?name=[name].[ext]!index.html');
require('file?name=[name].[ext]!bootstrap/dist/css/bootstrap.min.css');
require('js/counter/CounterApp');
require('js/todo/todo');
require('css/main.scss');

const rootEl = document.getElementById('app');
ReactDOM.render(<AppContainer component={App} />, rootEl);

// const todoAppRoot = document.getElementById('todo');
// ReactDOM.render(<AppContainer component={TodoApp} props={{store: todoStore}} />, todoAppRoot);

if (module.hot) {
  module.hot.accept('js/component/App', () => {
    ReactDOM.render(<AppContainer component={require('js/component/App').default} />, rootEl);
  });
  // module.hot.accept('js/todo/todo', () => {
  //   ReactDOM.render(<AppContainer component={require('js/todo/todo').default} props={{store: todoStore}} />, todoAppRoot);
  // });
}