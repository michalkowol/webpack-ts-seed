interface Action {
  type: string
}

export interface AddRepo extends Action {
  username: string,
  repo: string
}

export module Actions {
  export const ADD_REPO = 'ADD_REPO';
  export const addRepo = (username: string, repo: string): AddRepo => {
    return {
      type: ADD_REPO,
      username,
      repo
    };
  };
}