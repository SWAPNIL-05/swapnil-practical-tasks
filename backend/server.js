const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();
const cors = require('cors');
const app = express();
const connectDB = require('./config/db');
const port = process.env.PORT || 5000;
const authRoutes = require('./routes/auth');
const boardRoutes = require('./routes/board');
const taskRoutes = require('./routes/tasks');
const columnRoutes = require('./routes/column');
app.use(cors());
app.use(bodyParser.json());

connectDB();

app.get('/', (req, res) => {
  res.send('Welcome to the Todo App API');
});

app.use('/auth', authRoutes);
app.use('/board', boardRoutes);
app.use('/tasks', taskRoutes);
app.use('/column', columnRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
