import * as React from 'react'
import {connect} from 'react-redux'
import NavLink from 'js/component/NavLink'
import {List} from 'immutable'
import {State, Repository} from 'js/store/state'

const ReposView = ({repos, children} : {repos: List<Repository>, children?: React.ReactNode[]}) => {
  return (
    <div>
      <h2>Repos</h2>
      <ul>
        <li><NavLink to='/repos/reactjs/react-router'>React Router</NavLink></li>
        <li><NavLink to='/repos/facebook/react'>React</NavLink></li>
        {repos.map(repo => <li key={repo.username + repo.repo}><NavLink to={`/repos/${repo.username}/${repo.repo}`}>{repo.repo}</NavLink></li>)}
      </ul>
      {children}
    </div>
  );
}

const mapStateToProps = (state: State): any => {
  return {
    repos: state.repos
  }
}

const Repos = connect(mapStateToProps)(ReposView);

export default Repos;