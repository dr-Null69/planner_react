export type Priority = 'low' | 'medium' | 'high';
export type FilterType = 'all' | 'completed' | 'active';

export interface Task {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  priority: Priority;
  category: string;
}

export type TaskFormData = Omit<Task, 'id' | 'completed'>;

export interface TaskState {
  tasks: Task[];
  pendingDeleteId: number | null;
}

export type TaskAction =
  | { type: 'add'; payload: TaskFormData }
  | { type: 'toggle'; payload: { id: number } }
  | { type: 'update'; payload: { id: number; data: TaskFormData } }
  | { type: 'requestDelete'; payload: { id: number } }
  | { type: 'confirmDelete'; payload: { id: number } }
  | { type: 'undoDelete' }
  | { type: 'reset' };

export type ToastType = 'success' | 'info' | 'warning' | 'error';

export interface ToastState {
  id: number;
  message: string;
  type: ToastType;
  undoable?: boolean;
  durationMs?: number;
}