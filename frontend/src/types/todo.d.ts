export interface Todo {
  id: number
  title: string
  description: string | null
  completed: boolean
  favorite: boolean
}

export type NewTodo = Pick<Todo, "title" | "description">

export type TodoUpdate = Partial<Omit<Todo, "id">>
