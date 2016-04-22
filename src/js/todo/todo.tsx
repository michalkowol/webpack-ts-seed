import {createStore, combineReducers} from 'redux';
import {Commons} from 'js/commons';
import {List} from 'immutable'
import * as React from 'react'
import * as ReactDOM from 'react-dom'

interface Action {
  type: string
}

interface AddTodoAction extends Action {
  id: number,
  text: string
}

interface ToggleTodoAction extends Action {
  id: number,
}

interface Todo {
  id: number,
  text: string,
  completed: boolean
}

interface FilterAction extends Action {
  filter: string
}

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

const todos = (state: List<Todo> = (List.of() as List<Todo>), action: AddTodoAction | ToggleTodoAction): List<Todo> => {
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

const visibilityFilter = (state: string = 'SHOW_ALL', action: FilterAction): string => {
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
const store = createStore(rootReducer);

const FilterLink: React.StatelessComponent<{filter: string, currentFilter: string, children?: React.ReactNode}> = ({filter, currentFilter, children}) => {
  if (filter === currentFilter) {
    return (<span>{children}</span>);
  }
  return (
    <a href="#" onClick={ e => {
      e.preventDefault();
      const action: FilterAction = {
        type: 'SET_VISIBILITY_FILTER',
        filter: filter
      };
      store.dispatch(action);
    }}>
      {children}
    </a>
  )
};

const getVisibleTodos = (todos: List<Todo>, filter: string): List<Todo> => {
  switch (filter) {
    case 'SHOW_ALL':
      return todos;
    case 'SHOW_ACTIVE':
      return todos.filter(t => !t.completed).toList();
    case 'SHOW_COMPLETED':
      return todos.filter(t => t.completed).toList();
  }
};

var nextTodoId = 0;
class TodoApp extends React.Component<{todos: List<Todo>, visibilityFilter: string}, {}> {

  input: HTMLInputElement;

  addTodo = () => {
    const action: AddTodoAction = {
      type: 'ADD_TODO',
      id: nextTodoId++,
      text: this.input.value
    };
    store.dispatch(action);
    this.input.value = ""
  };

  toggleTodo = (id: number) => {
    const action: ToggleTodoAction = {
      type: 'TOGGLE_TODO',
      id: id
    };
    store.dispatch(action);
  };

  render() {
    const visibilityFilter = this.props.visibilityFilter;
    const visibleTodos = getVisibleTodos(this.props.todos, this.props.visibilityFilter);
    return (
      <div>
        <h1>Todo:</h1>
        <div className='input-group'>
          <input type='email' className='form-control' placeholder='Todo...' ref={node => this.input = node} />
          <span className='input-group-btn'>
            <button type='button' className='btn btn-default' onClick={this.addTodo}>Add</button>
          </span>
        </div>
        <ul>
          {visibleTodos.map(todo => {
            const todoStyle = todo.completed ? 'line-through' : 'none';
            return <li key={todo.id} style={{textDecoration: todoStyle}} onClick={() => this.toggleTodo(todo.id)}>{todo.text}</li>
          })}
        </ul>
        {'Filters: '}
        <FilterLink filter='SHOW_ALL' currentFilter={visibilityFilter}>All</FilterLink>{' '}
        <FilterLink filter='SHOW_ACTIVE' currentFilter={visibilityFilter}>Active</FilterLink>{' '}
        <FilterLink filter='SHOW_COMPLETED' currentFilter={visibilityFilter}>Completed</FilterLink>
      </div>
    );
  }
}

const render = () => {
  console.log(store.getState());
  const rootEl = document.getElementById('todo');
  ReactDOM.render(<TodoApp todos={store.getState().todos} visibilityFilter={store.getState().visibilityFilter} />, rootEl);
};

store.subscribe(render);
render();