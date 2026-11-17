import { describe, expect, it, vi } from "vitest";
import { createTodo, deleteTodo, getTodos, updateTodo } from "./todo";
import { TodoMother } from "../test/mothers";

const BASE_URL = "http://localhost:8000/todos";

function mockFetch(body: unknown, init: ResponseInit = { status: 200 }) {
  return vi
    .spyOn(globalThis, "fetch")
    .mockResolvedValue(new Response(body === undefined ? null : JSON.stringify(body), init));
}

describe("todo API client", () => {
  it("gets the todos", async () => {
    const todos = [TodoMother.pending(1)];
    const fetchSpy = mockFetch(todos);

    await expect(getTodos()).resolves.toEqual(todos);
    expect(fetchSpy).toHaveBeenCalledWith(BASE_URL);
  });

  it("creates a todo with the body the backend expects", async () => {
    const fetchSpy = mockFetch(TodoMother.pending(3), { status: 201 });

    await createTodo({ title: "Buy milk", description: null });

    const [url, init] = fetchSpy.mock.calls[0];
    expect(url).toBe(BASE_URL);
    expect(init?.method).toBe("POST");
    expect(JSON.parse(init?.body as string)).toEqual({
      title: "Buy milk",
      description: null,
      completed: false,
    });
  });

  it("sends only the changed fields on update", async () => {
    const fetchSpy = mockFetch(TodoMother.favorite(2));

    await updateTodo(2, { favorite: true });

    const [url, init] = fetchSpy.mock.calls[0];
    expect(url).toBe(`${BASE_URL}/2`);
    expect(init?.method).toBe("PATCH");
    expect(JSON.parse(init?.body as string)).toEqual({ favorite: true });
  });

  it.each([
    ["getTodos", () => getTodos()],
    ["createTodo", () => createTodo({ title: "x", description: null })],
    ["updateTodo", () => updateTodo(1, { completed: true })],
    ["deleteTodo", () => deleteTodo(1)],
  ])("%s throws when the backend answers with an error", async (_name, call) => {
    mockFetch({ detail: "boom" }, { status: 500 });

    await expect(call()).rejects.toThrow();
  });
});
