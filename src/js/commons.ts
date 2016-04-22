import {List} from 'immutable'

export module Commons {
  export function assign<T extends U, U>(target: T, source: U): T {
    for (let id in source) {
      if (source.hasOwnProperty(id)) {
        target[id] = source[id];
      }
    }
    return target;
  }

  export function emptyList<T>(): List<T> {
    return List.of() as List<T>;
  }
}