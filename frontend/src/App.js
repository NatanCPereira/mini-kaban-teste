import React, { useEffect, useState } from 'react';
import { fetchTasks, createTask, updateTask, deleteTask } from './api';
import TaskColumn from './components/TaskColumn';
import TaskForm from './components/TaskForm';

function groupByStatus(tasks, status) {
  return tasks.filter(t => t.status === status);
}

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [editing, setEditing] = useState(null);

  async function load() {
    setLoading(true); setError('');
    try {
      const data = await fetchTasks();
      setTasks(data);
    } catch (e) {
      setError(e.message || 'Erro');
    } finally { setLoading(false); }
  }

  useEffect(() => { load(); }, []);

  async function handleAdd(task) {
    try {
      const created = await createTask(task);
      setTasks(prev => [...prev, created]);
    } catch (e) { alert(e.message || 'Erro'); }
  }

  async function handleEditSubmit(task) {
    try {
      const updated = await updateTask(editing.id, { ...task, id: editing.id });
      setTasks(prev => prev.map(t => t.id === updated.id ? updated : t));
      setEditing(null);
    } catch (e) { alert(e.message || 'Erro'); }
  }

  async function handleMove(task, status) {
    try {
      const updated = await updateTask(task.id, { ...task, status });
      setTasks(prev => prev.map(t => t.id === updated.id ? updated : t));
    } catch (e) { alert(e.message || 'Erro'); }
  }

  async function handleDelete(id) {
    if (!window.confirm('Confirmar exclusão?')) return;
    try {
      await deleteTask(id);
      setTasks(prev => prev.filter(t => t.id !== id));
    } catch (e) { alert(e.message || 'Erro'); }
  }

  return (
    <div className="app">
      <h1>Mini Kanban</h1>
      {loading && <div>Carregando...</div>}
      {error && <div className="error">{error}</div>}

      <div className="top">
        <TaskForm onSubmit={editing ? handleEditSubmit : handleAdd} editing={editing} onCancel={() => setEditing(null)} />
      </div>

      <div className="board">
        <TaskColumn title="A Fazer" tasks={groupByStatus(tasks, 'todo')} onEdit={(t)=>setEditing(t)} onMove={handleMove} onDelete={handleDelete} />
        <TaskColumn title="Em Progresso" tasks={groupByStatus(tasks, 'doing')} onEdit={(t)=>setEditing(t)} onMove={handleMove} onDelete={handleDelete} />
        <TaskColumn title="Concluídas" tasks={groupByStatus(tasks, 'done')} onEdit={(t)=>setEditing(t)} onMove={handleMove} onDelete={handleDelete} />
      </div>
    </div>
  );
}
