import { useTaskContext } from '../hooks/useTaskContext';

export const Pagination = () => {
  const { page, limit, total, status, setPage } = useTaskContext();

  const totalPages = Math.max(1, Math.ceil(total / limit));
  const isLoading = status === 'loading';

  if (total === 0 && status === 'success') return null;

  return (
    <div className="pagination">
      <button
        type="button"
        onClick={() => setPage(page - 1)}
        disabled={page <= 1 || isLoading}
        className="page-btn"
      >
        Попередня
      </button>

      <span className="page-info">
        Сторінка {page} з {totalPages} (всього: {total})
      </span>

      <button
        type="button"
        onClick={() => setPage(page + 1)}
        disabled={page >= totalPages || isLoading}
        className="page-btn"
      >
        Наступна
      </button>
    </div>
  );
};