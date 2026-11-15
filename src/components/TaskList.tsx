import { useTaskContext } from '../hooks/useTaskContext';
import { TaskItem } from './TaskItem';

export const TaskList = () => {
  const { tasks, filter } = useTaskContext();

  const filteredTasks = tasks.filter((task) => {
    if (filter === 'completed') return task.completed;
    if (filter === 'active') return !task.completed;
    return true;
  });

  if (filteredTasks.length === 0) {
    return (
      <div className="empty-message">
        {filter === 'all' ? (
          <>
            <p>Завдань поки немає.</p>
            <p style={{ fontSize: '13px', marginTop: '4px', color: '#94a3b8' }}>
              Додайте перше навчальне завдання вище.
            </p>
          </>
        ) : (
          <p>За цим фільтром завдань немає.</p>
        )}
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