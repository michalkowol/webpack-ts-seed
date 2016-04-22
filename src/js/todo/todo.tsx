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
const store = createStore(rootReducer);

const Link = ({active, onClick, children} : {active: boolean, onClick: () => void, children?: React.ReactNode}) => {
  if (active) {
    return (<span>{children}</span>);
  }
  return (
    <a href='#' onClick={ e => {
      e.preventDefault();
      onClick();
    }}>
      {children}
    </a>
  )
};

class FilterLink extends React.Component<{filter: string, children?: React.ReactNode}, {}> {

  unsubscribe: Function;

  componentDidMount() {
    this.unsubscribe = store.subscribe(() =>
      this.forceUpdate()
    );
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  onFilterClick = () => {
    const action: FilterAction = {
      type: 'SET_VISIBILITY_FILTER',
      filter: this.props.filter
    };
    store.dispatch(action);
  };

  render() {
    const currentFilter = store.getState().visibilityFilter;
    const filter = this.props.filter;
    const children = this.props.children;
    return (
      <Link active={filter === currentFilter} onClick={this.onFilterClick}>{children}</Link>
    );
  }
}

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

const InputWithButton = ({inputPlaceholder, buttonText, onButtonClick} : {inputPlaceholder: string, buttonText: string, onButtonClick: (event: React.MouseEvent, input: HTMLInputElement) => void}) => {
  let input: HTMLInputElement;
  return (
    <form className='form-inline'>
      <div className='input-group'>
        <input type='email' className='form-control' placeholder={inputPlaceholder} ref={node => input = node} />
        <span className='input-group-btn'>
          <button type='submit' className='btn btn-default' onClick={(event) => onButtonClick(event, input)}>{buttonText}</button>
        </span>
      </div>
    </form>
  );
};

class AddTodo extends React.Component<{}, {}> {
  onAddButtonClick = (event: React.MouseEvent, input: HTMLInputElement) => {
    event.preventDefault();
    const action: AddTodoAction = {
      type: 'ADD_TODO',
      id: nextTodoId++,
      text: input.value
    };
    store.dispatch(action);
    input.value = ''
  };

  render() {
    return (
      <InputWithButton inputPlaceholder='Todo...' buttonText='Add' onButtonClick={this.onAddButtonClick} />
    );
  }
}

const Todo = ({onClick, completed, children} : {onClick: () => void, completed: boolean, children?: React.ReactNode}) => (
    <li style={{textDecoration: completed ? 'line-through' : 'none'}} onClick={onClick}>
      {children}
    </li>
);

const TodoList = ({onTodoClick, todos} : {onTodoClick: (id: number) => void, todos: List<Todo>}) => (
  <ul>
    {todos.map(todo => (
      <Todo key={todo.id} onClick={() => onTodoClick(todo.id)} completed={todo.completed}>{todo.text}</Todo>
    ))}
  </ul>
);

const Filters = () => (
  <div>
    {'Filters: '}
    <FilterLink filter='SHOW_ALL'>All</FilterLink>{' '}
    <FilterLink filter='SHOW_ACTIVE'>Active</FilterLink>{' '}
    <FilterLink filter='SHOW_COMPLETED'>Completed</FilterLink>
  </div>
);

var nextTodoId = 0;
const TodoApp = ({todos, visibilityFilter} : {todos: List<Todo>, visibilityFilter: string}) => {


  const toggleTodo = (id: number) => {
    const action: ToggleTodoAction = {
      type: 'TOGGLE_TODO',
      id
    };
    store.dispatch(action);
  };

  const visibleTodos = getVisibleTodos(todos, visibilityFilter);

  return (
    <div>
      <h1>Todo:</h1>
      <AddTodo />
      <TodoList todos={visibleTodos} onTodoClick={toggleTodo} />
      <Filters />
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