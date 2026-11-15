import { createContext } from 'react';
import type {
  FilterType,
  Task,
  TaskFormData,
  ToastState,
} from '../types/task';

export interface TaskContextValue {
  tasks: Task[];
  filter: FilterType;
  pendingDeleteId: number | null;
  editingTask: Task | null;
  toast: ToastState | null;
  setFilter: (filter: FilterType) => void;
  setEditingTask: (task: Task | null) => void;
  addTask: (data: TaskFormData) => void;
  updateTask: (id: number, data: TaskFormData) => void;
  toggleTask: (id: number) => void;
  requestDelete: (id: number) => void;
  undoDelete: () => void;
  resetTasks: () => void;
  dismissToast: () => void;
}

export const TaskContext = createContext<TaskContextValue | null>(null);
