import {List} from 'immutable'

export interface Repository {
  username: string,
  repo: string
}

export interface State {
  repos: List<Repository>
}