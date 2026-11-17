import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import App from "./App";
import * as api from "./api/todo";
import { ERROR_MESSAGES } from "./hooks/useTodos";
import { TodoMother } from "./test/mothers";

vi.mock("./api/todo");
const mockedApi = vi.mocked(api);

const favorite = TodoMother.favorite(1, { title: "Learn React" });
const pending = TodoMother.pending(2, { title: "Learn Vitest" });

async function findSection(name: string) {
  return within(await screen.findByRole("region", { name }));
}

beforeEach(() => {
  mockedApi.getTodos.mockResolvedValue([favorite, pending]);
  mockedApi.createTodo.mockResolvedValue(TodoMother.pending(3));
  mockedApi.updateTodo.mockResolvedValue(pending);
  mockedApi.deleteTodo.mockResolvedValue();
});

describe("App", () => {
  it("loads the todos on mount and shows favorites in their own section", async () => {
    render(<App />);

    expect(screen.getByRole("status")).toHaveTextContent("Loading tasks…");

    expect(await (await findSection("All tasks")).findByText("Learn React")).toBeInTheDocument();
    expect((await findSection("All tasks")).getByText("Learn Vitest")).toBeInTheDocument();
    expect((await findSection("Favorites")).getByText("Learn React")).toBeInTheDocument();
    expect((await findSection("Favorites")).queryByText("Learn Vitest")).not.toBeInTheDocument();
  });

  it("shows a message when there are no favorites", async () => {
    mockedApi.getTodos.mockResolvedValue([pending]);
    render(<App />);

    expect(await (await findSection("Favorites")).findByText("No favorite tasks yet")).toBeInTheDocument();
  });

  it("refetches the list from the backend after a change", async () => {
    render(<App />);
    await screen.findByText("Learn Vitest");
    mockedApi.getTodos.mockResolvedValue([favorite, { ...pending, favorite: true }]);

    await userEvent.click((await findSection("All tasks")).getByRole("button", { name: 'Favorite "Learn Vitest"' }));

    expect(mockedApi.updateTodo).toHaveBeenCalledWith(2, { favorite: true });
    expect(await (await findSection("Favorites")).findByText("Learn Vitest")).toBeInTheDocument();
    expect(mockedApi.getTodos).toHaveBeenCalledTimes(2);
  });

  it("creates a todo and reloads the list", async () => {
    render(<App />);
    await screen.findByText("Learn Vitest");

    await userEvent.type(screen.getByRole("textbox", { name: "Title" }), "New task{Enter}");

    expect(mockedApi.createTodo).toHaveBeenCalledWith({ title: "New task", description: null });
    expect(mockedApi.getTodos).toHaveBeenCalledTimes(2);
  });

  it("shows an error when the backend is unreachable and lets the user dismiss it", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    mockedApi.getTodos.mockRejectedValue(new TypeError("Failed to fetch"));
    render(<App />);

    expect(await screen.findByRole("alert")).toHaveTextContent(ERROR_MESSAGES.load);

    await userEvent.click(screen.getByRole("button", { name: "Dismiss error" }));
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });

  it("shows an error and keeps the list when a delete fails", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    mockedApi.deleteTodo.mockRejectedValue(new Error("Error deleting todo 2"));
    render(<App />);
    await screen.findByText("Learn Vitest");

    await userEvent.click((await findSection("All tasks")).getByRole("button", { name: 'Delete "Learn Vitest"' }));

    expect(await screen.findByRole("alert")).toHaveTextContent(ERROR_MESSAGES.delete);
    expect((await findSection("All tasks")).getByText("Learn Vitest")).toBeInTheDocument();
  });
});
