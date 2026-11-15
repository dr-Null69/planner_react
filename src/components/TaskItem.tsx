import type { Task } from '../types/task';

interface TaskItemProps {
  task: Task;
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
}

export const TaskItem = ({ task, onToggle, onDelete }: TaskItemProps) => {
  return (
    <div className={`task-item ${task.completed ? 'completed' : ''}`}>
      <div className="task-content">
        <input
          type="checkbox"
          checked={task.completed}
          onChange={() => onToggle(task.id)}
        />
        <div className="task-info">
          <h3 className={task.completed ? 'line-through' : ''}>
            {task.title}
          </h3>
          <p>{task.description}</p>
          <div className="task-meta">
            <span className="badge category">{task.category}</span>
            <span className={`badge ${task.priority}`}>{task.priority}</span>
          </div>
        </div>
      </div>
      <button
        onClick={() => onDelete(task.id)}
        className="delete-btn"
      >
        Видалити
      </button>
    </div>
  );
};