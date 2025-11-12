import React from 'react';

export default function TaskCard({ task, onEdit, onMove, onDelete }) {
  return (
    <div className="card">
      <h4>{task.title}</h4>
      {task.description && <p>{task.description}</p>}
      <div className="card-actions">
        <button onClick={() => onEdit(task)}>Editar</button>
        <button onClick={() => onMove(task, 'todo')}>A Fazer</button>
        <button onClick={() => onMove(task, 'doing')}>Em Progresso</button>
        <button onClick={() => onMove(task, 'done')}>Concluídas</button>
        <button onClick={() => onDelete(task.id)}>Excluir</button>
      </div>
    </div>
  );
}
