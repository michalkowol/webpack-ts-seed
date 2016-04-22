import {createStore, combineReducers} from 'redux';
import {Commons} from 'js/commons';
import {List} from 'immutable'
import {Todo, AddTodoAction, ToggleTodoAction, FilterAction} from 'js/todo/model'

const todo = (state: Todo, action: AddTodoAction | ToggleTodoAction): Todo => {
  switch (action.type) {
    case 'ADD_TODO':
      return {
        id: action.id,
        text: (action as AddTodoAction).text,
        completed: false
      };
    case 'TOGGLE_TODO':
      if (state.id !== action.id) {
        return state;
      }
      return Commons.assign(state, {completed: !state.completed});
    default:
      return state;
  }
};

const todos = (state = Commons.emptyList<Todo>(), action: AddTodoAction | ToggleTodoAction): List<Todo> => {
  switch (action.type) {
    case 'ADD_TODO':
      const newTodo = todo(undefined, action);
      return state.push(newTodo);
    case 'TOGGLE_TODO':
      return state.map(t => todo(t, action)).toList();
    default:
      return state;
  }
};

const visibilityFilter = (state = 'SHOW_ALL', action: FilterAction): string => {
  switch (action.type) {
    case 'SET_VISIBILITY_FILTER':
      return action.filter;
    default:
      return state;
  }
};

const rootReducer = combineReducers({
  todos,
  visibilityFilter
});

function configureStore(reducer, initialState) {
  const store = createStore(reducer, initialState,
    (window as any).devToolsExtension ? (window as any).devToolsExtension() : undefined
  );
  return store;
}

const store = configureStore(rootReducer, undefined);

export default store;