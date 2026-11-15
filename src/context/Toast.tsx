import { useTaskContext } from '../hooks/useTaskContext';

export const Toast = () => {
  const { toast, undoDelete, dismissToast } = useTaskContext();

  if (!toast) return null;

  const duration = toast.durationMs ?? 5000;

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
          {toast.undoable && (
            <button
              type="button"
              onClick={undoDelete}
              className="toast-undo-btn"
            >
              Скасувати
            </button>
          )}
          {!toast.undoable && (
            <button
              type="button"
              onClick={dismissToast}
              className="toast-close-btn"
              aria-label="Закрити сповіщення"
            >
              ×
            </button>
          )}
        </div>
      </div>

      {toast.undoable && (
        <div className="toast-progress-track">
          <div
            className="toast-progress-bar"
            style={{ animationDuration: `${duration}ms` }}
          />
        </div>
      )}
    </div>
  );
};