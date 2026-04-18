const axios = require('axios');

const client = axios.create({
  baseURL: process.env.GO_SERVICE_URL,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

const getTasks = () => client.get('/tasks').then((response) => response.data);

const createTask = (body) => client.post('/tasks', body).then((response) => response.data);

const updateTask = (id, body) =>
  client.patch(`/tasks/${id}`, body).then((response) => response.data);

const deleteTask = (id) => client.delete(`/tasks/${id}`).then((response) => response.data);

module.exports = { getTasks, createTask, updateTask, deleteTask };
