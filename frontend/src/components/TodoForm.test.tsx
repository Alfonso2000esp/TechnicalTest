import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { TodoForm } from "./TodoForm";

function renderForm(onAddResult = true) {
  const onAdd = vi.fn().mockResolvedValue(onAddResult);
  render(<TodoForm onAdd={onAdd} />);
  return {
    onAdd,
    title: screen.getByRole("textbox", { name: "Title" }),
    description: screen.getByRole("textbox", { name: "Description" }),
    addButton: screen.getByRole("button", { name: "Add" }),
  };
}

describe("TodoForm", () => {
  it("disables Add while the title is blank", async () => {
    const { title, addButton } = renderForm();

    expect(addButton).toBeDisabled();
    await userEvent.type(title, "   ");
    expect(addButton).toBeDisabled();
    await userEvent.type(title, "Buy milk");
    expect(addButton).toBeEnabled();
  });

  it("limits the fields to the lengths the backend accepts", () => {
    const { title, description } = renderForm();

    expect(title).toHaveAttribute("maxlength", "200");
    expect(description).toHaveAttribute("maxlength", "1000");
  });

  it("sends a trimmed title and null when the description is empty", async () => {
    const { onAdd, title } = renderForm();

    await userEvent.type(title, "  Buy milk  {Enter}");

    expect(onAdd).toHaveBeenCalledWith({ title: "Buy milk", description: null });
  });

  it("sends the description and clears both fields when the todo is created", async () => {
    const { onAdd, title, description, addButton } = renderForm(true);

    await userEvent.type(title, "Buy milk");
    await userEvent.type(description, "Semi-skimmed");
    await userEvent.click(addButton);

    expect(onAdd).toHaveBeenCalledWith({ title: "Buy milk", description: "Semi-skimmed" });
    expect(title).toHaveValue("");
    expect(description).toHaveValue("");
  });

  it("keeps the text when the creation fails, so it can be retried", async () => {
    const { title, description, addButton } = renderForm(false);

    await userEvent.type(title, "Buy milk");
    await userEvent.type(description, "Semi-skimmed");
    await userEvent.click(addButton);

    expect(title).toHaveValue("Buy milk");
    expect(description).toHaveValue("Semi-skimmed");
  });
});
