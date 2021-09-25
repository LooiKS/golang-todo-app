import { useEffect, useState } from "react";
import {
  deleteTodoItem,
  updateTodoItem,
} from "../api-services/todoItem.service";
import { useModal } from "../hooks/dialog-modal";
import TodoItem from "../models/TodoItem.model";

export function TodoItemComponent({
  todoItem,
  removeItemCallback,
  updateItemCallback,
}: {
  todoItem: TodoItem;
  removeItemCallback: Function;
  updateItemCallback: Function;
}) {
  const [item, setItem] = useState(todoItem);
  const [editingMode, setEditingMode] = useState(!true);
  const modal = useModal();

  useEffect(() => {
    setItem(todoItem);
  }, [todoItem]);

  let changeDone = () => {
    updateTodoItem({ ...item, done: !item.done }).then((resp) => {
      setItem((item) => {
        return resp.data;
      });
      updateItemCallback(resp.data);
    });
  };

  let handleTitleChange = (e: any) => {
    setItem((item) => {
      return { ...item, title: e.target.value };
    });
  };

  let saveTitle = () => {
    updateTodoItem(item).then((resp) => {
      setItem(resp.data);
      toggleEditingMode();
    });
  };

  let toggleEditingMode = () => {
    setEditingMode((editingMode) => !editingMode);
  };

  let removeTodoItem = () => {
    modal.showModal(
      "Confirmation",
      `Are you sure to delete the item - ${item.title}?`,
      () => remove
    );
  };

  let remove = () => {
    deleteTodoItem(item.id).then(() => {
      removeItemCallback();
    });
  };

  return (
    <li key={todoItem.id}>
      <div className="justify-content-between d-flex">
        {!editingMode ? (
          <span
            className={`${item.done ? "text-decoration-line-through" : ""}`}
            onDoubleClick={toggleEditingMode}
          >
            {item.title}
          </span>
        ) : (
          <div className="input-group w-auto">
            <input
              className={`bg-transparent form-control w-auto`}
              value={item.title}
              onChange={handleTitleChange}
              onBlur={saveTitle}
              autoFocus
            />
          </div>
        )}
        <div>
          <input
            className="form-check-input"
            type="checkbox"
            checked={item.done}
            onChange={() => changeDone()}
          />
          <button
            className="btn p-0 ms-2 shadow-none action-button"
            onClick={removeTodoItem}
          >
            <i className="fa fa-trash text-danger"></i>
          </button>
        </div>
      </div>
    </li>
  );
}
