export interface Todo {
  id: number,
  text: string,
  completed: boolean
}

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
