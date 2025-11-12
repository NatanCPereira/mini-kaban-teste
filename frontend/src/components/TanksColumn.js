import React from 'react';
import TaskCard from './TaskCard';

export default function TaskColumn({ title, tasks, onEdit, onMove, onDelete }) {
  return (
    <div className="column">
      <h3>{title}</h3>
      {tasks.map(t => (
        <TaskCard key={t.id} task={t} onEdit={onEdit} onMove={onMove} onDelete={onDelete} />
      ))}
    </div>
  );
}
