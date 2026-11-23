import { useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { taskSchema, type TaskSchemaValues } from '../schemas/taskSchema';
import type { Task, TaskFormData } from '../types/task';

interface TaskFormDialogProps {
  open: boolean;
  mode: 'create' | 'edit';
  task?: Task;
  onClose: () => void;
  onSubmit: (data: TaskFormData) => Promise<void>;
}

export const TaskFormDialog = ({
  open,
  mode,
  task,
  onClose,
  onSubmit,
}: TaskFormDialogProps) => {
  const dialogRef = useRef<HTMLDialogElement>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<TaskSchemaValues>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: task?.title ?? '',
      description: task?.description ?? '',
      category: task?.category ?? 'React',
      priority: task?.priority ?? 'medium',
    },
  });

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (open) {
      reset({
        title: mode === 'edit' && task ? task.title : '',
        description: mode === 'edit' && task ? task.description : '',
        category: mode === 'edit' && task ? task.category : 'React',
        priority: mode === 'edit' && task ? task.priority : 'medium',
      });
      if (!dialog.open) {
        dialog.showModal();
      }
    } else if (dialog.open) {
      dialog.close();
    }
  }, [open, mode, task, reset]);

  const handleFormSubmit = async (values: TaskSchemaValues) => {
    await onSubmit(values);
    onClose();
  };

  return (
    <dialog
      ref={dialogRef}
      onCancel={(e) => {
        e.preventDefault();
        if (!isSubmitting) onClose();
      }}
      className="task-dialog"
      aria-labelledby="task-dialog-title"
    >
      <div className="task-dialog-header">
        <h2 id="task-dialog-title">
          {mode === 'create' ? 'Нове завдання' : 'Редагувати завдання'}
        </h2>
        <button
          type="button"
          onClick={onClose}
          disabled={isSubmitting}
          className="dialog-close-btn"
          aria-label="Закрити діалог"
        >
          ×
        </button>
      </div>

      <form onSubmit={handleSubmit(handleFormSubmit)} className="dialog-form">
        <div className="form-field">
          <label htmlFor="task-title">Назва *</label>
          <input
            id="task-title"
            type="text"
            placeholder="Назва завдання"
            {...register('title')}
          />
          {errors.title && (
            <span className="field-error">{errors.title.message}</span>
          )}
        </div>

        <div className="form-field">
          <label htmlFor="task-description">Опис</label>
          <input
            id="task-description"
            type="text"
            placeholder="Опис завдання"
            {...register('description')}
          />
          {errors.description && (
            <span className="field-error">{errors.description.message}</span>
          )}
        </div>

        <div className="form-row">
          <div className="form-field">
            <label htmlFor="task-category">Категорія *</label>
            <input
              id="task-category"
              type="text"
              placeholder="Категорія"
              {...register('category')}
            />
            {errors.category && (
              <span className="field-error">{errors.category.message}</span>
            )}
          </div>

          <div className="form-field">
            <label htmlFor="task-priority">Пріоритет</label>
            <select id="task-priority" {...register('priority')}>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
        </div>

        <div className="dialog-actions">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="cancel-edit-btn"
          >
            Скасувати
          </button>
          <button type="submit" disabled={isSubmitting}>
            {isSubmitting
              ? 'Збереження...'
              : mode === 'create'
                ? 'Створити'
                : 'Зберегти'}
          </button>
        </div>
      </form>
    </dialog>
  );
};