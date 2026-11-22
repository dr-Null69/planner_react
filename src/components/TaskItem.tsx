import { useState } from 'react';
import { useTaskContext } from '../hooks/useTaskContext';
import type { Task } from '../types/task';

interface TaskItemProps {
  task: Task;
}

export const TaskItem = ({ task }: TaskItemProps) => {
  const { toggleTask, deleteTask, setEditingTask, setSelectedTaskId } =
    useTaskContext();
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  return (
    <div className={`task-item ${task.completed ? 'completed' : ''}`}>
      <div className="task-content">
        <input
          type="checkbox"
          checked={task.completed}
          onChange={() => toggleTask(task.id)}
        />
        <div className="task-info">
          <h3 className={task.completed ? 'line-through' : ''}>{task.title}</h3>
          {task.description && <p>{task.description}</p>}
          <div className="task-meta">
            <span className="badge category">{task.category}</span>
            <span className={`badge ${task.priority}`}>{task.priority}</span>
          </div>
        </div>
      </div>

      <div className="task-actions">
        {confirmingDelete ? (
          <>
            <button
              type="button"
              onClick={() => deleteTask(task.id)}
              className="confirm-delete-btn"
            >
              Підтвердити
            </button>
            <button
              type="button"
              onClick={() => setConfirmingDelete(false)}
              className="undo-inline-btn"
            >
              Скасувати
            </button>
          </>
        ) : (
          <>
            <button
              type="button"
              onClick={() => setSelectedTaskId(task.id)}
              className="details-btn"
            >
              Деталі
            </button>
            <button
              type="button"
              onClick={() => setEditingTask(task)}
              className="edit-btn"
            >
              Редагувати
            </button>
            <button
              type="button"
              onClick={() => setConfirmingDelete(true)}
              className="delete-btn"
            >
              Видалити
            </button>
          </>
        )}
      </div>
    </div>
  );
};