import axios, { AxiosResponse } from "axios";
import { APIConstant } from "../constants/api.constant";
import Todo from "../models/Todo.model";

export function createTodo(title: string): Promise<AxiosResponse<any>> {
  return axios.post(`${APIConstant.BASE_URL}/todos/`, {
    title: title,
  });
}

export function getAllTodos(): Promise<AxiosResponse<Todo[]>> {
  return axios.get(`${APIConstant.BASE_URL}/todos/`);
}

export function updateTodoTitle(title: string, id: number) {
  return axios.patch(`${APIConstant.BASE_URL}/todos/${id}`, { title });
}

export function deleteTodo(id: number) {
  return axios.delete(`${APIConstant.BASE_URL}/todos/${id}`);
}
