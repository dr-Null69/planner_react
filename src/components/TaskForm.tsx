import React, { useState } from 'react';
import { useTaskContext } from '../hooks/useTaskContext';
import type { Priority, Task } from '../types/task';

interface TaskFormInnerProps {
  editingTask: Task | null;
  onAdd: (data: Omit<Task, 'id' | 'completed'>) => void;
  onUpdate: (id: number, data: Omit<Task, 'id' | 'completed'>) => void;
  onCancelEdit: () => void;
}

const TaskFormInner = ({
  editingTask,
  onAdd,
  onUpdate,
  onCancelEdit,
}: TaskFormInnerProps) => {
  const [title, setTitle] = useState(editingTask?.title ?? '');
  const [description, setDescription] = useState(editingTask?.description ?? '');
  const [category, setCategory] = useState(editingTask?.category ?? 'React');
  const [priority, setPriority] = useState<Priority>(
    editingTask?.priority ?? 'medium'
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const payload = {
      title: title.trim(),
      description: description.trim(),
      category: category.trim() || 'Загальне',
      priority,
    };

    if (editingTask) {
      onUpdate(editingTask.id, payload);
    } else {
      onAdd(payload);
      setTitle('');
      setDescription('');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {editingTask && (
        <div className="form-header">
          <span>Редагування завдання</span>
        </div>
      )}

      <input
        type="text"
        placeholder="Назва завдання *"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <input
        type="text"
        placeholder="Опис"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <div className="form-row">
        <input
          type="text"
          placeholder="Категорія"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value as Priority)}
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </div>

      <div className="form-actions">
        <button type="submit">
          {editingTask ? 'Зберегти зміни' : 'Додати завдання'}
        </button>
        {editingTask && (
          <button
            type="button"
            onClick={onCancelEdit}
            className="cancel-edit-btn"
          >
            Скасувати
          </button>
        )}
      </div>
    </form>
  );
};

export const TaskForm = () => {
  const { addTask, updateTask, editingTask, setEditingTask } = useTaskContext();

  return (
    <TaskFormInner
      key={editingTask?.id ?? 'new'}
      editingTask={editingTask}
      onAdd={addTask}
      onUpdate={updateTask}
      onCancelEdit={() => setEditingTask(null)}
    />
  );
};
