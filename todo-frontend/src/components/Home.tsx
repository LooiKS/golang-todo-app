import "../App.css";
import { useEffect, useState } from "react";
import Todo from "../models/Todo.model";
import { createTodo, getAllTodos } from "../api-services/todo.service";
import { TodoComponent } from "./Todo.component";

function Home() {
  let [todos, setTodos] = useState([] as Todo[]);
  let [columns, setColumns] = useState([] as Todo[][]);
  let [todoTitle, setTodoTitle] = useState("");

  useEffect(() => {
    refresh();
  }, []);

  useEffect(() => {
    arrangeTodos(todos);
  }, [todos]);

  let refresh = () => {
    getAllTodos().then((resp) => {
      setTodos([...resp.data]);
    });
  };

  let arrangeTodos = (todos: Todo[]) => {
    const cols: Todo[][] = [[], [], [], []];
    todos.forEach((todo, index) => {
      cols[index % 4].push(todo);
    });
    setColumns([...cols]);
  };

  let getTodoComponentList = () => {
    return todos.length === 0 ? (
      <div className="mx-auto text-center">
        <p className="fs-5">No Todo yet. Add one now!</p>
      </div>
    ) : (
      columns.map((todos, index) => (
        <div className="col-md-3" key={index}>
          {todos.map((todo, index) => (
            <TodoComponent todo={todo} refresh={refresh} key={todo.id} />
          ))}
        </div>
      ))
    );
  };

  let handleTitle = (e: any) => {
    setTodoTitle(e.target.value);
  };

  let addTodo = () => {
    if (todoTitle !== "") {
      createTodo(todoTitle).then((res) => {
        let t: Todo = res.data;
        setTodos([t, ...todos]);
        setTodoTitle("");
      });
    }
  };

  return (
    <div className="vw-100">
      <div
        style={{ backgroundImage: "url('bg-img.png')", paddingTop: "20vh" }}
        className="w-100"
      >
        <div className="row justify-content-center mx-0">
          <div className="col-md-6">
            <div className="mx-auto position-relative" style={{ top: "18px" }}>
              <h5>TODO</h5>
              <div className="input-group mt-3">
                <input
                  className="form-control form-control-lg"
                  placeholder="Create new Todo list!"
                  onChange={handleTitle}
                  value={todoTitle}
                />
                <button
                  className="btn btn-primary px-3"
                  title="Add new todo"
                  onClick={addTodo}
                >
                  <i className="fa fa-plus-circle"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="p-5">
        <div className="row">{getTodoComponentList()}</div>
      </div>
    </div>
  );
}

export default Home;
