import type { Todo } from "../types/todo";

export const TodoMother = {
  pending: (id = 1, overrides: Partial<Todo> = {}): Todo => ({
    id,
    title: `Todo ${id}`,
    description: null,
    completed: false,
    favorite: false,
    ...overrides,
  }),
  completed: (id = 1, overrides: Partial<Todo> = {}): Todo =>
    TodoMother.pending(id, { completed: true, ...overrides }),
  favorite: (id = 1, overrides: Partial<Todo> = {}): Todo =>
    TodoMother.pending(id, { favorite: true, ...overrides }),
};
