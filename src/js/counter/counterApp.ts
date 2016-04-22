import { createStore } from 'redux'
import counter from 'js/counter/counter'

function configureStore(reducer, initialState) {
  const store = createStore(reducer, initialState,
    (window as any).devToolsExtension ? (window as any).devToolsExtension() : undefined
  );
  if (module.hot) {
    module.hot.accept('js/counter/counter', () =>
      store.replaceReducer(require('js/counter/counter').default)
    );
  }
  return store;
}

// Create a Redux store holding the state of your app.
// Its API is { subscribe, dispatch, getState }.
let store = configureStore(counter, undefined);

function render() {
  document.getElementById('redux').innerHTML = `<h2>Click counter: ${store.getState()}</h2>`;
}

// You can subscribe to the updates manually, or use bindings to your view layer.
store.subscribe(() => {
  render();
});
render();

// The only way to mutate the internal state is to dispatch an action.
// The actions can be serialized, logged or stored and later replayed.
store.dispatch({ type: 'INCREMENT' });
// 1
store.dispatch({ type: 'INCREMENT' });
// 2
store.dispatch({ type: 'DECREMENT' });
// 1

document.addEventListener('click', () => {
  store.dispatch({ type: 'INCREMENT' });
});