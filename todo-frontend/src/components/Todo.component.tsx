import { useEffect, useState } from "react";
import { deleteTodo, updateTodoTitle } from "../api-services/todo.service";
import { createTodoItem } from "../api-services/todoItem.service";
import { useModal } from "../hooks/dialog-modal";
import Todo from "../models/Todo.model";
import TodoItem from "../models/TodoItem.model";
import { TodoItemComponent } from "./TodoItem.component";

function getBadgeClassName(percent: number) {
  if (percent === 100) {
    return <span className="ms-2 badge bg-success">Completed</span>;
  } else if (percent === 0) {
    return <span className="ms-2 badge bg-danger">Pending</span>;
  } else {
    return <span className="ms-2 badge bg-warning">In Progress</span>;
  }
}

export function TodoComponent(props: { todo: Todo; refresh: Function }) {
  const [todo, setTodo] = useState(props.todo);
  const [items, setItems] = useState(props.todo.todoItems);
  const [editingMode, setEditingMode] = useState(false);
  const [todoTitle, setTodoTitle] = useState(todo.title);
  const [addingItemMode, setAddingItemMode] = useState(false);
  const [newItemTitle, setNewItemTitle] = useState("");
  const [percent, setPercent] = useState(0);
  const modal = useModal();

  useEffect(() => {
    setPercent(
      items.length === 0
        ? 0
        : Number(
            (
              (items.filter((item) => item.done).length / items.length) *
              100
            ).toFixed(2)
          )
    );
  }, [todo, items]);

  let handleNewItem = (e: any) => {
    setNewItemTitle(e.target.value);
  };

  let addItem = () => {
    setAddingItemMode(true);
  };

  let saveNewItem = (e: any) => {
    createTodoItem(todo.id, newItemTitle).then((resp) => {
      setAddingItemMode((mode) => !mode);

      setItems((items) => [...items, resp.data]);
      setNewItemTitle("");
    });
  };

  let toggleEditingMode = () => {
    setEditingMode((editingMode) => !editingMode);
  };

  let handleTitleChange = (e: any) => {
    setTodoTitle(e.target.value);
  };

  let saveTodoTitle = () => {
    updateTodoTitle(todoTitle, todo.id);
    toggleEditingMode();
  };

  let removeTodo = () => {
    deleteTodo(todo.id).then((resp) => {
      props.refresh();
    });
  };

  let removeItemCallback = (removedItem: TodoItem) => {
    setItems((items) => {
      return items.filter((item) => item.id !== removedItem.id);
    });
  };

  let updateItemCallback = (updatedItem: TodoItem) => {
    setItems((items) => {
      const newItems = items;
      newItems.forEach((item, index) => {
        if (item.id === updatedItem.id) {
          newItems[index] = updatedItem;
        }
      });

      return [...newItems];
    });
  };

  let removeTodoConfirmation = () => {
    modal.showModal(
      "Confirmation",
      `Are you sure to delete the whole Todo list - ${todo.title}?`,
      () => removeTodo
    );
  };

  return (
    <div className="card shadow-sm todo-card my-2 col-12">
      <div className="card-body">
        <div className="justify-content-between d-flex">
          <strong>
            {!editingMode ? (
              <span className="fs-5" onDoubleClick={toggleEditingMode}>
                {todoTitle}
              </span>
            ) : (
              <input
                className="form-control"
                onBlur={saveTodoTitle}
                onChange={handleTitleChange}
                value={todoTitle}
                autoFocus
              />
            )}
            {getBadgeClassName(percent)}
          </strong>
          <span>{percent}%</span>
        </div>
        {items.length === 0 && !addingItemMode ? (
          <div className="mb-2">
            <span className="fst-italic">No items</span>
          </div>
        ) : (
          <ul className="mt-2">
            {items.map((todoItem) => (
              <TodoItemComponent
                key={todoItem.id}
                todoItem={todoItem}
                removeItemCallback={() => removeItemCallback(todoItem)}
                updateItemCallback={updateItemCallback}
              ></TodoItemComponent>
            ))}
            {addingItemMode && (
              <li>
                <div className="justify-content-between d-flex">
                  <input
                    className="form-control my-1"
                    placeholder="Enter your task here!"
                    value={newItemTitle}
                    onChange={handleNewItem}
                  />
                  <button
                    className="btn p-0 ms-2 shadow-none"
                    onClick={saveNewItem}
                  >
                    <i className="fa fa-check"></i>
                  </button>
                </div>
              </li>
            )}
          </ul>
        )}
        <div className="text-end action-button">
          <button
            className="btn btn-outline-primary outline-none shadow-none text-link"
            onClick={addItem}
          >
            <i className="fa fa-plus me-2"></i>
            <span>Add Item</span>
          </button>
          <button
            className="btn btn-outline-danger outline-none shadow-none text-link ms-1"
            onClick={removeTodoConfirmation}
          >
            <i className="fa fa-trash me-2"></i>
            <span>Delete Todo</span>
          </button>
        </div>
      </div>
    </div>
  );
}
