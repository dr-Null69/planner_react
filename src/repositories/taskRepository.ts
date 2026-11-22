import { httpClient } from '../api/httpClient';
import type {
  ApiTodo,
  PaginatedTasks,
  Task,
  TaskFormData,
  TodosResponse,
} from '../types/task';

function toTask(
  todo: ApiTodo,
  clientMeta?: Partial<TaskFormData>
): Task {
  return {
    id: todo.id,
    title: todo.todo,
    description: clientMeta?.description ?? '',
    completed: todo.completed,
    priority: clientMeta?.priority ?? 'medium',
    category: clientMeta?.category ?? 'General',
  };
}

export const taskRepository = {
  async getAll(
    limit = 10,
    skip = 0,
    signal?: AbortSignal
  ): Promise<PaginatedTasks> {
    const data = await httpClient.get<TodosResponse>(
      `/todos?limit=${limit}&skip=${skip}`,
      signal
    );

    return {
      tasks: data.todos.map((todo) => toTask(todo)),
      total: data.total,
      skip: data.skip,
      limit: data.limit,
    };
  },

  async getById(id: number, signal?: AbortSignal): Promise<Task> {
    const todo = await httpClient.get<ApiTodo>(`/todos/${id}`, signal);
    return toTask(todo);
  },

  async create(data: TaskFormData): Promise<Task> {
    const created = await httpClient.post<ApiTodo>('/todos/add', {
      todo: data.title,
      completed: false,
      userId: 1,
    });

    return toTask(created, data);
  },

  async update(
    id: number,
    payload: { title?: string; completed?: boolean } & Partial<TaskFormData>
  ): Promise<Task> {
    const body: Record<string, unknown> = {};
    if (payload.title !== undefined) body.todo = payload.title;
    if (payload.completed !== undefined) body.completed = payload.completed;

    const updated = await httpClient.patch<ApiTodo>(`/todos/${id}`, body);
    return toTask(updated, payload);
  },

  async delete(id: number): Promise<void> {
    await httpClient.delete<ApiTodo>(`/todos/${id}`);
  },
};