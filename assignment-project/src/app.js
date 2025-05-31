const express = require('express');
const userRoutes = require('./routes/userRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const postRoutes = require('./routes/postRoutes');
const rateLimiter = require('./middlewares/rateLimiter');
const cors = require('cors');
const auth = require('./middlewares/authMiddleware');

const app = express();

app.use(express.json());
app.use(rateLimiter);
app.use(cors());
app.use('/api/users', userRoutes);
app.use('/upload', uploadRoutes);
app.use('/api/posts', postRoutes);

app.get('/protected', auth, (req, res) => {
  res.json({ message: 'You are authenticated', user: req.user });
});

module.exports = app;