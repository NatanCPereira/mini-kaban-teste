const BASE = 'http://localhost:8080';

export async function fetchTasks() {
  const res = await fetch(`${BASE}/tasks`);
  if (!res.ok) throw new Error('Erro ao buscar tarefas');
  return res.json();
}

export async function createTask(task) {
  const res = await fetch(`${BASE}/tasks`, {
    method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify(task)
  });
  if (!res.ok) throw new Error('Erro ao criar');
  return res.json();
}

export async function updateTask(id, task) {
  const res = await fetch(`${BASE}/tasks/${id}`, {
    method: 'PUT', headers: {'Content-Type':'application/json'}, body: JSON.stringify(task)
  });
  if (!res.ok) throw new Error('Erro ao atualizar');
  return res.json();
}

export async function deleteTask(id) {
  const res = await fetch(`${BASE}/tasks/${id}`, { method: 'DELETE' });
  if (!res.ok && res.status !== 204) throw new Error('Erro ao deletar');
  return;
}
