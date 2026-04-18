const { Router } = require('express');
const taskService = require('../services/goTaskService');

const router = Router();

router.get('/', async (req, res, next) => {
  try {
    const tasks = await taskService.getTasks();
    res.json(tasks);
  } catch (err) {
    next(err);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const task = await taskService.createTask(req.body);
    res.status(201).json(task);
  } catch (err) {
    next(err);
  }
});

router.patch('/:id', async (req, res, next) => {
  try {
    await taskService.updateTask(req.params.id, req.body);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    await taskService.deleteTask(req.params.id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

module.exports = router;
