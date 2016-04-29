import {Store} from 'redux';
import * as React from 'react'

export module Commons {
  export function assign<T extends U, U>(target: T, source: U): T {
    for (let id in source) {
      if (source.hasOwnProperty(id)) {
        target[id] = source[id];
      }
    }
    return target;
  }
}

export class ReduxContainer<P, S> extends React.Component<P, S> {
  static contextTypes = {
    store: React.PropTypes.object.isRequired
  };

  store = (this.context as any).appWithRouterStore as Store;

  private unsubscribe: Function;

  componentDidMount() {
    this.unsubscribe = this.store.subscribe(() =>
      this.forceUpdate()
    );
  }

  componentWillUnmount() {
    this.unsubscribe();
  }
}

export class ReduxStatelessContainer<P> extends ReduxContainer<P, {}> {

}