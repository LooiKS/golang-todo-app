import TodoItem from "./TodoItem.model";

export default interface Todo {
  id: number;
  title: string;
  createdAt: Date;
  todoItems: TodoItem[];
}
