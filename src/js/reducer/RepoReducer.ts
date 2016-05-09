import {List} from 'immutable'
import {Actions} from 'js/action/actions'
import {Repository} from 'js/store/state'

const RepoReducer = (repos: List<Repository> = List.of<Repository>(), action: any): List<Repository> => {
  switch (action.type) {
    case Actions.ADD_REPO:
      const {username, repo} = action;
      return repos.push({username, repo});
    default:
      return repos;
  }
};

const mapStateToProps = (state: any) => {

};

export default RepoReducer;