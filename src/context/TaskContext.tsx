import {
  useEffect,
  useReducer,
  useState,
  type ReactNode,
} from 'react';
import { isAbortError } from '../api/httpClient';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { taskRepository } from '../repositories/taskRepository';
import type {
  AsyncStatus,
  FilterType,
  Task,
  TaskFormData,
  ToastState,
} from '../types/task';
import { TaskContext } from './taskContextDef';

const FILTER_STORAGE_KEY = 'study-planner-filter';
const PAGE_LIMIT = 10;

interface ServerState {
  tasks: Task[];
  total: number;
  status: AsyncStatus;
  error: string | null;
}

type ServerAction =
  | { type: 'fetchStart' }
  | { type: 'fetchSuccess'; payload: { tasks: Task[]; total: number } }
  | { type: 'fetchError'; payload: string }
  | { type: 'prependTask'; payload: Task }
  | { type: 'replaceTask'; payload: Task }
  | { type: 'removeTask'; payload: number };

const initialServerState: ServerState = {
  tasks: [],
  total: 0,
  status: 'loading',
  error: null,
};

function serverReducer(state: ServerState, action: ServerAction): ServerState {
  switch (action.type) {
    case 'fetchStart':
      return { ...state, status: 'loading', error: null };
    case 'fetchSuccess':
      return {
        tasks: action.payload.tasks,
        total: action.payload.total,
        status: 'success',
        error: null,
      };
    case 'fetchError':
      return { ...state, status: 'error', error: action.payload };
    case 'prependTask':
      return {
        ...state,
        tasks: [action.payload, ...state.tasks],
        total: state.total + 1,
      };
    case 'replaceTask':
      return {
        ...state,
        tasks: state.tasks.map((t) =>
          t.id === action.payload.id ? action.payload : t
        ),
      };
    case 'removeTask':
      return {
        ...state,
        tasks: state.tasks.filter((t) => t.id !== action.payload),
        total: Math.max(0, state.total - 1),
      };
    default:
      return state;
  }
}

export const TaskProvider = ({ children }: { children: ReactNode }) => {
  const [serverState, dispatch] = useReducer(serverReducer, initialServerState);

  // Client / UI state
  const [page, setPage] = useState(1);
  const [reloadKey, setReloadKey] = useState(0);
  const [filter, setFilter] = useLocalStorage<FilterType>(
    FILTER_STORAGE_KEY,
    'all'
  );
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [selectedTaskId, setSelectedTaskId] = useState<number | null>(null);
  const [toast, setToast] = useState<ToastState | null>(null);

  const showToast = (next: Omit<ToastState, 'id'>) => {
    setToast({ ...next, id: Date.now() });
  };

  // Завантаження списку з пагінацією та скасуванням попереднього запиту
  useEffect(() => {
    const controller = new AbortController();
    const skip = (page - 1) * PAGE_LIMIT;

    dispatch({ type: 'fetchStart' });

    taskRepository
      .getAll(PAGE_LIMIT, skip, controller.signal)
      .then((result) => {
        dispatch({
          type: 'fetchSuccess',
          payload: { tasks: result.tasks, total: result.total },
        });
      })
      .catch((err: unknown) => {
        if (isAbortError(err)) return;
        const message =
          err instanceof Error ? err.message : 'Не вдалося завантажити завдання';
        dispatch({ type: 'fetchError', payload: message });
      });

    return () => {
      controller.abort();
    };
  }, [page, reloadKey]);

  // Синхронізація заголовка вкладки браузера
  useEffect(() => {
    const activeCount = serverState.tasks.filter((t) => !t.completed).length;
    document.title = `Study Planner — ${activeCount} active tasks`;
  }, [serverState.tasks]);

  // Авто-закриття Toast
  useEffect(() => {
    if (!toast) return;

    const timer = window.setTimeout(() => {
      setToast(null);
    }, toast.durationMs ?? 3000);

    return () => {
      window.clearTimeout(timer);
    };
  }, [toast]);

  const retry = () => {
    setReloadKey((prev) => prev + 1);
  };

  const addTask = async (data: TaskFormData) => {
    try {
      const created = await taskRepository.create(data);
      dispatch({ type: 'prependTask', payload: created });
      showToast({ message: 'Завдання успішно створено', type: 'success' });
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Не вдалося створити завдання';
      showToast({ message, type: 'error' });
    }
  };

  const updateTask = async (id: number, data: TaskFormData) => {
    const existing = serverState.tasks.find((t) => t.id === id);
    try {
      const updated = await taskRepository.update(id, {
        ...data,
        completed: existing?.completed,
      });
      dispatch({ type: 'replaceTask', payload: updated });
      setEditingTask(null);
      showToast({ message: 'Завдання оновлено', type: 'success' });
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Не вдалося оновити завдання';
      showToast({ message, type: 'error' });
    }
  };

  const toggleTask = async (id: number) => {
    const existing = serverState.tasks.find((t) => t.id === id);
    if (!existing) return;

    try {
      const updated = await taskRepository.update(id, {
        completed: !existing.completed,
        description: existing.description,
        priority: existing.priority,
        category: existing.category,
      });
      dispatch({ type: 'replaceTask', payload: updated });
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Не вдалося змінити статус';
      showToast({ message, type: 'error' });
    }
  };

  const deleteTask = async (id: number) => {
    try {
      await taskRepository.delete(id);
      dispatch({ type: 'removeTask', payload: id });
      if (editingTask?.id === id) setEditingTask(null);
      if (selectedTaskId === id) setSelectedTaskId(null);
      showToast({ message: 'Завдання видалено', type: 'info' });
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Не вдалося видалити завдання';
      showToast({ message, type: 'error' });
    }
  };

  const dismissToast = () => {
    setToast(null);
  };

  return (
    <TaskContext.Provider
      value={{
        tasks: serverState.tasks,
        status: serverState.status,
        error: serverState.error,
        page,
        limit: PAGE_LIMIT,
        total: serverState.total,
        filter,
        editingTask,
        selectedTaskId,
        toast,
        setPage,
        retry,
        setFilter,
        setEditingTask,
        setSelectedTaskId,
        addTask,
        updateTask,
        toggleTask,
        deleteTask,
        dismissToast,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};