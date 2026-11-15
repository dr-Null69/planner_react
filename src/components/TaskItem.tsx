import { useTaskContext } from '../hooks/useTaskContext';
import type { Task } from '../types/task';

interface TaskItemProps {
  task: Task;
}

export const TaskItem = ({ task }: TaskItemProps) => {
  const {
    toggleTask,
    requestDelete,
    undoDelete,
    setEditingTask,
    pendingDeleteId,
  } = useTaskContext();

  const isPendingDelete = pendingDeleteId === task.id;

  return (
    <div
      className={`task-item ${task.completed ? 'completed' : ''} ${
        isPendingDelete ? 'pending-delete' : ''
      }`}
    >
      <div className="task-content">
        <input
          type="checkbox"
          checked={task.completed}
          disabled={isPendingDelete}
          onChange={() => toggleTask(task.id)}
        />
        <div className="task-info">
          <h3 className={task.completed ? 'line-through' : ''}>{task.title}</h3>
          <p>{task.description}</p>
          <div className="task-meta">
            <span className="badge category">{task.category}</span>
            <span className={`badge ${task.priority}`}>{task.priority}</span>
            {isPendingDelete && (
              <span className="pending-badge">Буде видалено</span>
            )}
          </div>
        </div>
      </div>

      <div className="task-actions">
        {isPendingDelete ? (
          <button
            type="button"
            onClick={undoDelete}
            className="undo-inline-btn"
          >
            Скасувати
          </button>
        ) : (
          <>
            <button
              type="button"
              onClick={() => setEditingTask(task)}
              className="edit-btn"
            >
              Редагувати
            </button>
            <button
              type="button"
              onClick={() => requestDelete(task.id)}
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