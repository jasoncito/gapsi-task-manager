import { useEffect, useState } from 'react';
import { Alert, CircularProgress } from '@mui/material';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';
import { createTask, deleteTask, fetchTasks, toggleTask } from './services/api';
import type { Task } from './types/task';

export default function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadTasks = async () => {
    try {
      const tasks = await fetchTasks();
      setTasks(tasks);
    } catch {
      setError('Could not connect to the API. Is the server running?');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadTasks(); }, []);

  const handleCreate = async (title: string, description: string) => {
    const task = await createTask({ title, description });
    setTasks((prev) => [task, ...prev]);
  };

  const handleToggle = async (id: string, completed: boolean) => {
    await toggleTask(id, completed);
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, completed } : t)));
  };

  const handleDelete = async (id: string) => {
    await deleteTask(id);
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f7f7f5', padding: '64px 24px 80px' }}>
      <div style={{ maxWidth: 680, margin: '0 auto' }}>

        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 32 }}>
          <h1 style={{ margin: 0, fontSize: 28, fontWeight: 600, color: '#37352f', letterSpacing: '-0.4px', lineHeight: 1 }}>
            My Tasks
          </h1>
          <TaskForm onSubmit={handleCreate} />
        </div>

        {error && (
          <Alert
            severity="error"
            sx={{ mb: 3, borderRadius: 1.5, fontSize: 13, fontFamily: 'inherit', border: '1px solid #f5c6cb', backgroundColor: '#fff8f8' }}
          >
            {error}
          </Alert>
        )}

        <div style={{ backgroundColor: '#ffffff', border: '1px solid #e9e9e7', borderRadius: 8, overflow: 'hidden' }}>
          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 160 }}>
              <CircularProgress size={20} sx={{ color: '#c7c6c3' }} />
            </div>
          ) : (
            <TaskList tasks={tasks} onToggle={handleToggle} onDelete={handleDelete} />
          )}
        </div>

      </div>
    </div>
  );
}
