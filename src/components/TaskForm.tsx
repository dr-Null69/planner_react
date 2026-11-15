import React, { useEffect, useState } from 'react';
import { useTaskContext } from '../hooks/useTaskContext';
import type { Priority } from '../types/task';

export const TaskForm = () => {
  const { addTask, updateTask, editingTask, setEditingTask } = useTaskContext();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('React');
  const [priority, setPriority] = useState<Priority>('medium');

  useEffect(() => {
    if (editingTask) {
      setTitle(editingTask.title);
      setDescription(editingTask.description);
      setCategory(editingTask.category);
      setPriority(editingTask.priority);
    } else {
      setTitle('');
      setDescription('');
      setCategory('React');
      setPriority('medium');
    }
  }, [editingTask]);

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
      updateTask(editingTask.id, payload);
    } else {
      addTask(payload);
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
            onClick={() => setEditingTask(null)}
            className="cancel-edit-btn"
          >
            Скасувати
          </button>
        )}
      </div>
    </form>
  );
};