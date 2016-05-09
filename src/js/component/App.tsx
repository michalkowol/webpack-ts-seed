import * as React from 'react'
import {Dispatch} from 'redux'
import {push} from 'react-router-redux'
import {connect} from 'react-redux'
import NavLink from 'js/component/NavLink'
import {Actions} from 'js/action/actions'

const AppDisplay = ({onSubmit, children} : ({onSubmit: (userName: string, repo: string) => void, children?: React.ReactNode[]})) => {

  let username: HTMLInputElement;
  let repo: HTMLInputElement;

  return (
    <div>
      <h1>React Router Tutorial</h1>
      <ul role='nav'>
        <li><NavLink to='/' activeClassName='active' onlyActiveOnIndex={true}>Home</NavLink></li>
        <li><NavLink to='/repos'>Repos</NavLink></li>
        <li><NavLink to='/about'>About</NavLink></li>
        <li>
          <form onSubmit={ e => {
            e.preventDefault();
            onSubmit(username.value, repo.value);
            username.value = '';
            repo.value = '';
            }
          }>
            <input type='text' placeholder='userName' ref={ input => username = input }/> / {' '}
            <input type='text' placeholder='repo' ref={ input => repo = input }/>{' '}
            <button type='submit' className='btn btn-default'>Go</button>
          </form>
        </li>
      </ul>
      {children}
    </div>
  );
};
const mapStateToProps = (state): any => {
  return {};
};
const mapDispatchToProps = (dispatch: Dispatch) => {
  return {
    onSubmit: (username: string, repo: string): void => {
      const path = `/repos/${username}/${repo}`;
      dispatch(push(path));
      dispatch(Actions.addRepo(username, repo));
    }
  }
};
const App = connect(undefined, mapDispatchToProps)(AppDisplay);

export default App;