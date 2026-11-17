import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { TodoMother } from "../test/mothers";
import { TodoItem } from "./TodoItem";

function renderItem(todo = TodoMother.pending(1, { title: "Buy milk" })) {
  const handlers = {
    onToggleCompleted: vi.fn(),
    onToggleFavorite: vi.fn(),
    onDelete: vi.fn(),
  };
  render(
    <ul>
      <TodoItem todo={todo} {...handlers} />
    </ul>
  );
  return { todo, ...handlers };
}

describe("TodoItem", () => {
  it("shows the title and the description when there is one", () => {
    renderItem(TodoMother.pending(1, { title: "Buy milk", description: "Semi-skimmed" }));

    expect(screen.getByText("Buy milk")).toBeInTheDocument();
    expect(screen.getByText("Semi-skimmed")).toBeInTheDocument();
  });

  it("renders no description when it is null", () => {
    renderItem(TodoMother.pending(1, { title: "Buy milk", description: null }));

    expect(screen.queryByRole("paragraph")).not.toBeInTheDocument();
  });

  it("calls onToggleCompleted with the todo when the checkbox is clicked", async () => {
    const { todo, onToggleCompleted } = renderItem();

    await userEvent.click(screen.getByRole("checkbox"));

    expect(onToggleCompleted).toHaveBeenCalledWith(todo);
  });

  it("reflects the favorite state with aria-pressed and calls onToggleFavorite", async () => {
    const { todo, onToggleFavorite } = renderItem(TodoMother.favorite(1, { title: "Buy milk" }));
    const star = screen.getByRole("button", { name: 'Favorite "Buy milk"' });

    expect(star).toHaveAttribute("aria-pressed", "true");
    await userEvent.click(star);
    expect(onToggleFavorite).toHaveBeenCalledWith(todo);
  });

  it("calls onDelete with the id when the trash button is clicked", async () => {
    const { onDelete } = renderItem();

    await userEvent.click(screen.getByRole("button", { name: 'Delete "Buy milk"' }));

    expect(onDelete).toHaveBeenCalledWith(1);
  });
});
