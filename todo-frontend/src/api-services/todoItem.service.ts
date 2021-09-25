import axios, { AxiosResponse } from "axios";
import { APIConstant } from "../constants/api.constant";
import TodoItem from "../models/TodoItem.model";

export function createTodoItem(
  todoId: number,
  title: string
): Promise<AxiosResponse<TodoItem>> {
  return axios.post(`${APIConstant.BASE_URL}/todo-items/`, {
    todoId,
    title,
  });
}

export function updateTodoItem(
  todoItem: TodoItem
): Promise<AxiosResponse<TodoItem>> {
  return axios.patch(
    `${APIConstant.BASE_URL}/todo-items/${todoItem.id}`,
    todoItem
  );
}

export function deleteTodoItem(
  todoItemId: number
): Promise<AxiosResponse<any>> {
  return axios.delete(`${APIConstant.BASE_URL}/todo-items/${todoItemId}`);
}
