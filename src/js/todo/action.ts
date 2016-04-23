interface Action {
  type: string
}

export interface AddTodoAction extends Action {
  id: number,
  text: string
}

export interface ToggleTodoAction extends Action {
  id: number,
}

export interface FilterAction extends Action {
  filter: string
}

export module Actions {
  export const addTodo = (() => {
    let nextTodoId = 0;
    const addTodo = (text: string): AddTodoAction => {
      return {
        type: 'ADD_TODO',
        id: nextTodoId++,
        text
      };
    };
    return addTodo;
  })();

  export const setVisibilityFilter = (filter: string): FilterAction => {
    return {
      type: 'SET_VISIBILITY_FILTER',
      filter
    };
  };

  export const toggleTodo = (id: number): ToggleTodoAction => {
    return {
      type: 'TOGGLE_TODO',
      id
    };
  };
}