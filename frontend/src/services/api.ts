import axios from 'axios';
import type { Task } from '../types/task';

const client = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3001',
});

export const fetchTasks = (): Promise<Task[]> =>
  client.get('/api/tasks').then((r) => r.data);

export const createTask = (body: { title: string; description: string }): Promise<Task> =>
  client.post('/api/tasks', body).then((r) => r.data);

export const toggleTask = (id: string, completed: boolean): Promise<void> =>
  client.patch(`/api/tasks/${id}`, { completed }).then(() => undefined);

export const deleteTask = (id: string): Promise<void> =>
  client.delete(`/api/tasks/${id}`).then(() => undefined);
