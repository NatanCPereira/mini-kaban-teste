import React, { useState, useEffect } from 'react';

export default function TaskForm({ onSubmit, editing, onCancel }) {
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [status, setStatus] = useState('todo');

  useEffect(() => {
    if (editing) {
      setTitle(editing.title || '');
      setDesc(editing.description || '');
      setStatus(editing.status || 'todo');
    } else {
      setTitle(''); setDesc(''); setStatus('todo');
    }
  }, [editing]);

  function submit(e) {
    e.preventDefault();
    if (!title.trim()) return alert('Título obrigatório');
    onSubmit({ title: title.trim(), description: desc.trim(), status });
  }

  return (
    <form onSubmit={submit} className="task-form">
      <input placeholder="Título" value={title} onChange={e=>setTitle(e.target.value)} />
      <input placeholder="Descrição (opcional)" value={desc} onChange={e=>setDesc(e.target.value)} />
      <select value={status} onChange={e=>setStatus(e.target.value)}>
        <option value="todo">A Fazer</option>
        <option value="doing">Em Progresso</option>
        <option value="done">Concluídas</option>
      </select>
      <div>
        <button type="submit">{editing ? 'Salvar' : 'Adicionar'}</button>
        {editing && <button type="button" onClick={onCancel}>Cancelar</button>}
      </div>
    </form>
  );
}
