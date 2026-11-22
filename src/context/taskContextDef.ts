import { createContext } from 'react';
import type {
  AsyncStatus,
  FilterType,
  Task,
  TaskFormData,
  ToastState,
} from '../types/task';

export interface TaskContextValue {
  tasks: Task[];
  status: AsyncStatus;
  error: string | null;
  page: number;
  limit: number;
  total: number;
  filter: FilterType;
  editingTask: Task | null;
  selectedTaskId: number | null;
  toast: ToastState | null;
  setPage: (page: number) => void;
  retry: () => void;
  setFilter: (filter: FilterType) => void;
  setEditingTask: (task: Task | null) => void;
  setSelectedTaskId: (id: number | null) => void;
  addTask: (data: TaskFormData) => Promise<void>;
  updateTask: (id: number, data: TaskFormData) => Promise<void>;
  toggleTask: (id: number) => Promise<void>;
  deleteTask: (id: number) => Promise<void>;
  dismissToast: () => void;
}

export const TaskContext = createContext<TaskContextValue | null>(null);