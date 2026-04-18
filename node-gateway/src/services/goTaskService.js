const axios = require('axios');

const client = axios.create({
  baseURL: process.env.GO_SERVICE_URL,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

const getTasks = () => client.get('/tasks').then((r) => r.data);

const createTask = (body) => client.post('/tasks', body).then((r) => r.data);

const updateTask = (id, body) =>
  client.patch(`/tasks/${id}`, body).then((r) => r.data);

const deleteTask = (id) => client.delete(`/tasks/${id}`).then((r) => r.data);

module.exports = { getTasks, createTask, updateTask, deleteTask };
