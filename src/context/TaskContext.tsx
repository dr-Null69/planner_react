import {
  createContext,
  useEffect,
  useReducer,
  useState,
  type ReactNode,
} from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import {
  initTaskState,
  taskReducer,
  TASKS_STORAGE_KEY,
} from '../reducers/taskReducer';
import type {
  FilterType,
  Task,
  TaskFormData,
  ToastState,
} from '../types/task';

const FILTER_STORAGE_KEY = 'study-planner-filter';
const UNDO_DELETE_DELAY_MS = 5000;

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

export const TaskProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(taskReducer, undefined, initTaskState);
  const [filter, setFilter] = useLocalStorage<FilterType>(
    FILTER_STORAGE_KEY,
    'all'
  );
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [toast, setToast] = useState<ToastState | null>(null);

  const showToast = (next: Omit<ToastState, 'id'>) => {
    setToast({ ...next, id: Date.now() });
  };

  // 1. Синхронізація tasks у localStorage
  useEffect(() => {
    try {
      localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(state.tasks));
    } catch {
      showToast({
        message: 'Не вдалося зберегти завдання у localStorage',
        type: 'error',
      });
    }
  }, [state.tasks]);

  // 2. Синхронізація заголовка вкладки браузера
  useEffect(() => {
    const activeCount = state.tasks.filter((task) => !task.completed).length;
    document.title = `Study Planner — ${activeCount} active tasks`;
  }, [state.tasks]);

  // 3. Таймер Undoable Delete (5 секунд)
  useEffect(() => {
    if (state.pendingDeleteId === null) return;

    const idToDelete = state.pendingDeleteId;
    const timer = window.setTimeout(() => {
      dispatch({ type: 'confirmDelete', payload: { id: idToDelete } });
      showToast({
        message: 'Завдання остаточно видалено',
        type: 'info',
      });
    }, UNDO_DELETE_DELAY_MS);

    return () => {
      window.clearTimeout(timer);
    };
  }, [state.pendingDeleteId]);

  // 4. Авто-закриття звичайних Toast (не undoable)
  useEffect(() => {
    if (!toast || toast.undoable) return;

    const timer = window.setTimeout(() => {
      setToast(null);
    }, toast.durationMs ?? 3000);

    return () => {
      window.clearTimeout(timer);
    };
  }, [toast]);

  const addTask = (data: TaskFormData) => {
    dispatch({ type: 'add', payload: data });
    showToast({
      message: 'Завдання успішно створено',
      type: 'success',
    });
  };

  const updateTask = (id: number, data: TaskFormData) => {
    dispatch({ type: 'update', payload: { id, data } });
    setEditingTask(null);
    showToast({
      message: 'Завдання оновлено',
      type: 'success',
    });
  };

  const toggleTask = (id: number) => {
    dispatch({ type: 'toggle', payload: { id } });
  };

  const requestDelete = (id: number) => {
    if (state.pendingDeleteId !== null && state.pendingDeleteId !== id) {
      showToast({
        message: 'Спочатку завершіть або скасуйте поточне видалення',
        type: 'warning',
      });
      return;
    }

    if (editingTask?.id === id) {
      setEditingTask(null);
    }

    dispatch({ type: 'requestDelete', payload: { id } });
    showToast({
      message: 'Завдання буде видалено через 5 сек.',
      type: 'warning',
      undoable: true,
      durationMs: UNDO_DELETE_DELAY_MS,
    });
  };

  const undoDelete = () => {
    dispatch({ type: 'undoDelete' });
    showToast({
      message: 'Видалення скасовано',
      type: 'info',
    });
  };

  const resetTasks = () => {
    dispatch({ type: 'reset' });
    setEditingTask(null);
    showToast({
      message: 'Дані скинуто до початкових',
      type: 'info',
    });
  };

  const dismissToast = () => {
    setToast(null);
  };

  return (
    <TaskContext.Provider
      value={{
        tasks: state.tasks,
        filter,
        pendingDeleteId: state.pendingDeleteId,
        editingTask,
        toast,
        setFilter,
        setEditingTask,
        addTask,
        updateTask,
        toggleTask,
        requestDelete,
        undoDelete,
        resetTasks,
        dismissToast,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};