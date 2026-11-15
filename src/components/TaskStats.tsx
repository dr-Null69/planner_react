import { useTaskContext } from '../hooks/useTaskContext';

export const TaskStats = () => {
  const { tasks } = useTaskContext();

  const total = tasks.length;
  const completed = tasks.filter((t) => t.completed).length;
  const active = total - completed;

  return (
    <div className="stats-grid">
      <div className="stat-card total">
        <p>Всього</p>
        <p>{total}</p>
      </div>
      <div className="stat-card completed">
        <p>Виконано</p>
        <p>{completed}</p>
      </div>
      <div className="stat-card active">
        <p>Невиконано</p>
        <p>{active}</p>
      </div>
    </div>
  );
};