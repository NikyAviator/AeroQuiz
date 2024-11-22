const express = require('express');

const userRouter = require('./src/v1/routes/userRoutes');

const app = express();

// 1) MIDDLEWARES
app.use(express.json());

// 2) ROUTES
app.use('/api/v1/users', userRouter);

// 3) ERROR HANDLING
// Catch-all for unhandled routes
app.use('*', (req, res) => {
  res.status(404).json({
    status: 'error',
    message: `Can't find ${req.originalUrl} on this server!`,
  });
});

module.exports = app;
