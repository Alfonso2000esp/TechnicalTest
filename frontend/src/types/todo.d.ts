export interface Todo {
  id: number
  title: string
  description: string | null
  completed: boolean
  favorite: boolean
}

/** Fields the user provides when creating a todo. */
export type NewTodo = Pick<Todo, "title" | "description">

/** Fields accepted by PATCH /todos/{id}: only the ones sent are changed. */
export type TodoUpdate = Partial<Omit<Todo, "id">>
