import { useTaskContext } from '../hooks/useTaskContext';

export const Toast = () => {
  const { toast, dismissToast } = useTaskContext();

  if (!toast) return null;

  return (
    <div
      key={toast.id}
      className={`toast toast-${toast.type}`}
      role="status"
      aria-live="polite"
    >
      <div className="toast-body">
        <span className="toast-message">{toast.message}</span>
        <div className="toast-actions">
          <button
            type="button"
            onClick={dismissToast}
            className="toast-close-btn"
            aria-label="Закрити сповіщення"
          >
            ×
          </button>
        </div>
      </div>
    </div>
  );
};