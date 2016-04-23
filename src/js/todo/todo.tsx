import {Store} from 'redux';
import {List} from 'immutable'
import * as React from 'react'
import {Todo, AddTodoAction, ToggleTodoAction, FilterAction} from 'js/todo/model'

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

class FilterLink extends React.Component<{store: Store, filter: string, children?: React.ReactNode}, {}> {

  unsubscribe: Function;

  componentDidMount() {
    this.unsubscribe = this.props.store.subscribe(() =>
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
    this.props.store.dispatch(action);
  };

  render() {
    const currentFilter = this.props.store.getState().visibilityFilter;
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

var nextTodoId = 0;
class AddTodo extends React.Component<{store}, {}> {
  onAddButtonClick = (event: React.MouseEvent, input: HTMLInputElement) => {
    event.preventDefault();
    const action: AddTodoAction = {
      type: 'ADD_TODO',
      id: nextTodoId++,
      text: input.value
    };
    this.props.store.dispatch(action);
    input.value = ''
  };

  render() {
    return (
      <InputWithButton inputPlaceholder='Todo...' buttonText='Add' onButtonClick={this.onAddButtonClick} />
    );
  }
}

const TodoElement = ({onClick, completed, children} : {onClick: () => void, completed: boolean, children?: React.ReactNode}) => (
  <li style={{textDecoration: completed ? 'line-through' : 'none'}} onClick={onClick}>
    {children}
  </li>
);

const TodoList = ({onTodoClick, todos} : {onTodoClick: (id: number) => void, todos: List<Todo>}) => (
  <ul>
    {todos.map(todo => (
      <TodoElement key={todo.id} onClick={() => onTodoClick(todo.id)} completed={todo.completed}>{todo.text}</TodoElement>
    ))}
  </ul>
);

class VisibleTodoList extends React.Component<{store: Store}, {}> {

  unsubscribe: Function;

  componentDidMount() {
    this.unsubscribe = this.props.store.subscribe(() =>
      this.forceUpdate()
    );
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  toggleTodo = (id: number) => {
    const action: ToggleTodoAction = {
      type: 'TOGGLE_TODO',
      id
    };
    this.props.store.dispatch(action);
  };

  render() {
    const state = this.props.store.getState();
    const visibleTodos = getVisibleTodos(state.todos, state.visibilityFilter);
    return (
      <TodoList onTodoClick={this.toggleTodo} todos={visibleTodos} />
    );
  }
}

const Filters = ({store} : {store: Store}) => (
  <div>
    {'Show: '}
    <FilterLink filter='SHOW_ALL' store={store}>All</FilterLink>{' '}
    <FilterLink filter='SHOW_ACTIVE' store={store}>Active</FilterLink>{' '}
    <FilterLink filter='SHOW_COMPLETED' store={store}>Completed</FilterLink>
  </div>
);

const TodoApp = ({store} : {store: Store}) => (
  <div>
    <h1>Todo:</h1>
    <AddTodo store={store} />
    <VisibleTodoList store={store} />
    <Filters store={store} />
  </div>
);

export default TodoApp;
