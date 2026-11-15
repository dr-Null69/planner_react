import { useTaskContext } from '../hooks/useTaskContext';
import type { FilterType } from '../types/task';

export const TaskFilters = () => {
  const { filter, setFilter, resetTasks } = useTaskContext();

  const getBtnClass = (btnFilter: FilterType) =>
    filter === btnFilter ? 'active' : '';

  return (
    <div className="filters-bar">
      <div className="filters">
        <button
          type="button"
          className={getBtnClass('all')}
          onClick={() => setFilter('all')}
        >
          Всі
        </button>
        <button
          type="button"
          className={getBtnClass('active')}
          onClick={() => setFilter('active')}
        >
          Не виконані
        </button>
        <button
          type="button"
          className={getBtnClass('completed')}
          onClick={() => setFilter('completed')}
        >
          Виконані
        </button>
      </div>

      <button type="button" onClick={resetTasks} className="reset-btn">
        Скинути дані
      </button>
    </div>
  );
};