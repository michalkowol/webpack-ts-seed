import {Provider, connect} from 'react-redux';
import {Store} from 'redux';
import {List} from 'immutable'
import * as React from 'react'
import {Todo} from 'js/todo/model'
import {Actions} from 'js/todo/action'

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

/*
import {ReduxStatelessContainer} from 'js/commons'

class FilterLink extends ReduxStatelessContainer<{filter: string}> {

  onFilterClick = () => {
    this.store.dispatch(Actions.setVisibilityFilter(this.props.filter));
  };

  render() {
    const currentFilter = this.store.getState().visibilityFilter;
    const filter = this.props.filter;
    const children = this.props.children;
    return (
      <Link active={filter === currentFilter} onClick={this.onFilterClick}>{children}</Link>
    );
  }
}
*/

const mapStateToLinkProps = (state, ownProps: {filter: string}) => {
  return {
    active: ownProps.filter === state.visibilityFilter
  }
};
const mapDispatchToLinkProps = (dispatch: (action: any) => any, ownProps: {filter: string}) => {
  return {
    onClick: () => {
      dispatch(Actions.setVisibilityFilter(ownProps.filter));
    }
  };
};
const FilterLink = connect(mapStateToLinkProps, mapDispatchToLinkProps)(Link);

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

/*
class AddTodo extends ReduxStatelessContainer<{}> {

  onAddButtonClick = (event: React.MouseEvent, input: HTMLInputElement) => {
    event.preventDefault();
    this.store.dispatch(Actions.addTodo(input.value));
    input.value = ''
  };

  render() {
    return (
      <InputWithButton inputPlaceholder='Todo...' buttonText='Add' onButtonClick={this.onAddButtonClick} />
    );
  }
}
*/

let AddTodo = ({dispatch} : {dispatch?: (action: any) => any}) => {
  const onAddButtonClick = (event: React.MouseEvent, input: HTMLInputElement) => {
    event.preventDefault();
    dispatch(Actions.addTodo(input.value));
    input.value = ''
  };

  return (
    <InputWithButton inputPlaceholder='Todo...' buttonText='Add' onButtonClick={onAddButtonClick} />
  );
};
AddTodo = connect()(AddTodo);

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

/*
class VisibleTodoList extends ReduxStatelessContainer<{}> {

  toggleTodo = (id: number) => {
    this.store.dispatch(Actions.toggleTodo(id));
  };

  render() {
    const state = this.store.getState();
    const visibleTodos = getVisibleTodos(state.todos, state.visibilityFilter);
    return (
      <TodoList onTodoClick={this.toggleTodo} todos={visibleTodos}/>
    );
  }
}
*/

const mapStateToTodoListProps = (state) => {
  return {
    todos: getVisibleTodos(state.todos, state.visibilityFilter)
  };
};
const mapDispatchToTodoListProps = (dispatch: (action: any) => any) => {
  return {
    onTodoClick: (id: number) => {
      dispatch(Actions.toggleTodo(id));
    }
  };
};
const VisibleTodoList = connect(mapStateToTodoListProps, mapDispatchToTodoListProps)(TodoList);

const Filters = () => (
  <div>
    {'Show: '}
    <FilterLink filter='SHOW_ALL'>All</FilterLink>{' '}
    <FilterLink filter='SHOW_ACTIVE'>Active</FilterLink>{' '}
    <FilterLink filter='SHOW_COMPLETED'>Completed</FilterLink>
  </div>
);

const TodoApp = ({store} : {store: Store}) => (
  <Provider store={store}>
    <div>
      <h1>Todo:</h1>
      <AddTodo />
      <VisibleTodoList />
      <Filters />
    </div>
  </Provider>
);

export default TodoApp;
