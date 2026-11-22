import { useTaskContext } from '../hooks/useTaskContext';
import { TaskItem } from './TaskItem';

export const TaskList = () => {
  const { tasks, filter, status, error, retry } = useTaskContext();

  if (status === 'loading') {
    return <div className="state-message">Завантаження завдань...</div>;
  }

  if (status === 'error') {
    return (
      <div className="state-error">
        <p>Помилка завантаження: {error}</p>
        <button type="button" onClick={retry} className="retry-btn">
          Спробувати ще
        </button>
      </div>
    );
  }

  const filteredTasks = tasks.filter((task) => {
    if (filter === 'completed') return task.completed;
    if (filter === 'active') return !task.completed;
    return true;
  });

  if (filteredTasks.length === 0) {
    return (
      <div className="empty-message">
        <p>Завдань не знайдено.</p>
      </div>
    );
  }

  return (
    <div className="task-list">
      {filteredTasks.map((task) => (
        <TaskItem key={task.id} task={task} />
      ))}
    </div>
  );
};