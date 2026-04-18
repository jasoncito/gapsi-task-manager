require('dotenv').config();
const express = require('express');
const cors = require('cors');
const taskRoutes = require('./routes/tasks');
const errorHandler = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 3001;
const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN || 'http://localhost:5173';

app.use(cors({ origin: ALLOWED_ORIGIN }));
app.use(express.json());

app.get('/health', (req, res) => res.status(200).json({ status: 'ok' }));
app.use('/api/tasks', taskRoutes);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`node-gateway listening on port ${PORT}`);
});

module.exports = app;
