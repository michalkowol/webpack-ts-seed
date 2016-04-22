import {createStore, combineReducers} from 'redux';
import {Commons} from 'js/commons';
import {List} from 'immutable'
import * as React from 'react'
import * as ReactDOM from 'react-dom'

interface Todo {
  id: number,
  text: string,
  completed: boolean
}

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

const FilterLink: React.SFC<{filter: string, currentFilter: string, onClick: (filter: string) => void, children?: React.ReactNode}> = ({filter, currentFilter, onClick, children}) => {
  if (filter === currentFilter) {
    return (<span>{children}</span>);
  }
  return (
    <a href='#' onClick={ e => {
      e.preventDefault();
      onClick(filter);
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

const AddTodo: React.SFC<{onAddButtonClick: (text: string) => void}> = ({onAddButtonClick}) => {
  let input: HTMLInputElement;
  const onAddButtonClickWithClean = (e) => {
    e.preventDefault();
    onAddButtonClick(input.value);
    input.value = ''
  };
  return (
    <form className='form-inline'>
      <div className='input-group'>
        <input type='email' className='form-control' placeholder='Todo...' ref={node => input = node} />
        <span className='input-group-btn'>
          <button type='submit' className='btn btn-default' onClick={onAddButtonClickWithClean}>Add</button>
        </span>
      </div>
    </form>
  );
};

const Todo: React.SFC<{onClick: React.MouseEventHandler, completed: boolean, children?: React.ReactNode}> = ({onClick, completed, children}) => (
    <li style={{textDecoration: completed ? 'line-through' : 'none'}} onClick={onClick}>
      {children}
    </li>
);

const TodoList: React.SFC<{onTodoClick: (id: number) => void, todos: List<Todo>}> = ({onTodoClick, todos}) => (
  <ul>
    {todos.map(todo => (
      <Todo key={todo.id} onClick={() => onTodoClick(todo.id)} completed={todo.completed}>{todo.text}</Todo>
    ))}
  </ul>
);

const Filters: React.SFC<{currentFilter: string, onFilterClick: (filter: string) => void}> = ({currentFilter, onFilterClick}) => (
  <div>
    {'Filters: '}
    <FilterLink filter='SHOW_ALL' currentFilter={currentFilter} onClick={onFilterClick}>All</FilterLink>{' '}
    <FilterLink filter='SHOW_ACTIVE' currentFilter={currentFilter} onClick={onFilterClick}>Active</FilterLink>{' '}
    <FilterLink filter='SHOW_COMPLETED' currentFilter={currentFilter} onClick={onFilterClick}>Completed</FilterLink>
  </div>
);

var nextTodoId = 0;
const TodoApp: React.SFC<{todos: List<Todo>, visibilityFilter: string}> = ({todos, visibilityFilter}) => {
  const addTodo = (text: string) => {
    const action: AddTodoAction = {
      type: 'ADD_TODO',
      id: nextTodoId++,
      text
    };
    store.dispatch(action);
  };

  const toggleTodo = (id: number) => {
    const action: ToggleTodoAction = {
      type: 'TOGGLE_TODO',
      id
    };
    store.dispatch(action);
  };

  const onFilterClick = (filter: string) => {
    const action: FilterAction = {
      type: 'SET_VISIBILITY_FILTER',
      filter
    };
    store.dispatch(action);
  };

  const visibleTodos = getVisibleTodos(todos, visibilityFilter);

  return (
    <div>
      <h1>Todo:</h1>
      <AddTodo onAddButtonClick={addTodo} />
      <TodoList todos={visibleTodos} onTodoClick={toggleTodo} />
      <Filters currentFilter={visibilityFilter} onFilterClick={onFilterClick} />
    </div>
  );
};

const render = () => {
  console.log(store.getState());
  const rootEl = document.getElementById('todo');
  ReactDOM.render(<TodoApp todos={store.getState().todos} visibilityFilter={store.getState().visibilityFilter} />, rootEl);
};

store.subscribe(render);
render();