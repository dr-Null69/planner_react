import { useEffect, useReducer, useState } from 'react';
import { isAbortError } from '../api/httpClient';
import { useTaskContext } from '../hooks/useTaskContext';
import { taskRepository } from '../repositories/taskRepository';
import type { AsyncStatus, Task } from '../types/task';

interface DetailsState {
  task: Task | null;
  status: AsyncStatus;
  error: string | null;
}

type DetailsAction =
  | { type: 'start' }
  | { type: 'success'; payload: Task }
  | { type: 'error'; payload: string };

function detailsReducer(
  state: DetailsState,
  action: DetailsAction
): DetailsState {
  switch (action.type) {
    case 'start':
      return { ...state, status: 'loading', error: null };
    case 'success':
      return { task: action.payload, status: 'success', error: null };
    case 'error':
      return { ...state, status: 'error', error: action.payload };
    default:
      return state;
  }
}

export const TaskDetails = () => {
  const { selectedTaskId, setSelectedTaskId } = useTaskContext();
  const [reloadCount, setReloadCount] = useState(0);
  const [state, dispatch] = useReducer(detailsReducer, {
    task: null,
    status: 'loading',
    error: null,
  });

  useEffect(() => {
    if (selectedTaskId === null) return;

    const controller = new AbortController();
    dispatch({ type: 'start' });

    taskRepository
      .getById(selectedTaskId, controller.signal)
      .then((data) => {
        dispatch({ type: 'success', payload: data });
      })
      .catch((err: unknown) => {
        if (isAbortError(err)) return;
        const message =
          err instanceof Error ? err.message : 'Не вдалося завантажити деталі';
        dispatch({ type: 'error', payload: message });
      });

    return () => {
      controller.abort();
    };
  }, [selectedTaskId, reloadCount]);

  if (selectedTaskId === null) return null;

  return (
    <div className="task-details">
      <div className="task-details-header">
        <h3>Деталі завдання #{selectedTaskId}</h3>
        <button
          type="button"
          onClick={() => setSelectedTaskId(null)}
          className="details-close-btn"
        >
          Закрити
        </button>
      </div>

      {state.status === 'loading' && (
        <p className="state-message">Завантаження деталей...</p>
      )}

      {state.status === 'error' && (
        <div className="state-error">
          <p>Помилка: {state.error}</p>
          <button
            type="button"
            onClick={() => setReloadCount((c) => c + 1)}
            className="retry-btn"
          >
            Спробувати ще
          </button>
        </div>
      )}

      {state.status === 'success' && state.task && (
        <div className="task-details-body">
          <p>
            <strong>Назва:</strong> {state.task.title}
          </p>
          <p>
            <strong>Опис:</strong>{' '}
            {state.task.description || 'Опис відсутній'}
          </p>
          <p>
            <strong>Категорія:</strong> {state.task.category}
          </p>
          <p>
            <strong>Пріоритет:</strong> {state.task.priority}
          </p>
          <p>
            <strong>Статус:</strong>{' '}
            {state.task.completed ? 'Виконано' : 'Не виконано'}
          </p>
        </div>
      )}
    </div>
  );
};