import type { Task, FilterType } from '../types/task';
import { TaskItem } from './TaskItem';

interface TaskListProps {
  tasks: Task[];
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
  filter: FilterType;
}

export const TaskList = ({ tasks, onToggle, onDelete, filter }: TaskListProps) => {
  if (tasks.length === 0) {
    return (
      <div className="empty-message">
        {filter === 'all' ? (
          <>
            <p>Завдань поки немає.</p>
            <p style={{ fontSize: '13px', marginTop: '4px', color: '#94a3b8' }}>Додайте перше навчальне завдання вище.</p>
          </>
        ) : (
          <p>За цим фільтром завдань немає.</p>
        )}
      </div>
    );
  }

  return (
    <div className="task-list">
      {tasks.map((task) => (
        <TaskItem key={task.id} task={task} onToggle={onToggle} onDelete={onDelete} />
      ))}
    </div>
  );
};