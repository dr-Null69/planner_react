import { initialTasks } from '../data/initialTasks';
import type { Task, TaskAction, TaskState } from '../types/task';

export const TASKS_STORAGE_KEY = 'study-planner-tasks';

export function initTaskState(): TaskState {
  try {
    const raw = localStorage.getItem(TASKS_STORAGE_KEY);
    if (!raw) {
      return { tasks: initialTasks, pendingDeleteId: null };
    }
    const parsed: unknown = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return { tasks: parsed as Task[], pendingDeleteId: null };
    }
  } catch {
  }

  return { tasks: initialTasks, pendingDeleteId: null };
}

export function taskReducer(state: TaskState, action: TaskAction): TaskState {
  switch (action.type) {
    case 'add': {
      const newTask: Task = {
        ...action.payload,
        id: Date.now(),
        completed: false,
      };
      return {
        ...state,
        tasks: [...state.tasks, newTask],
      };
    }

    case 'toggle': {
      return {
        ...state,
        tasks: state.tasks.map((task) =>
          task.id === action.payload.id
            ? { ...task, completed: !task.completed }
            : task
        ),
      };
    }

    case 'update': {
      return {
        ...state,
        tasks: state.tasks.map((task) =>
          task.id === action.payload.id
            ? { ...task, ...action.payload.data }
            : task
        ),
      };
    }

    case 'requestDelete': {
      return {
        ...state,
        pendingDeleteId: action.payload.id,
      };
    }

    case 'confirmDelete': {
      return {
        ...state,
        tasks: state.tasks.filter((task) => task.id !== action.payload.id),
        pendingDeleteId:
          state.pendingDeleteId === action.payload.id
            ? null
            : state.pendingDeleteId,
      };
    }

    case 'undoDelete': {
      return {
        ...state,
        pendingDeleteId: null,
      };
    }

    case 'reset': {
      return {
        tasks: initialTasks,
        pendingDeleteId: null,
      };
    }

    default:
      return state;
  }
}