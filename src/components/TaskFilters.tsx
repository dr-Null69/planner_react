import type { FilterType } from '../types/task';

interface TaskFiltersProps {
  currentFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
}

export const TaskFilters = ({ currentFilter, onFilterChange }: TaskFiltersProps) => {
  const getBtnClass = (filter: FilterType) => 
    `px-4 py-2 rounded-md font-medium text-sm transition-colors ${
      currentFilter === filter 
        ? 'bg-blue-600 text-white' 
        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
    }`;

  return (
    <div className="flex gap-2 my-4">
      <button className={getBtnClass('all')} onClick={() => onFilterChange('all')}>Всі</button>
      <button className={getBtnClass('active')} onClick={() => onFilterChange('active')}>Не виконані</button>
      <button className={getBtnClass('completed')} onClick={() => onFilterChange('completed')}>Виконані</button>
    </div>
  );
};