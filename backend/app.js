const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const userRouter = require('./src/v1/routes/userRoutes');
const questionRouter = require('./src/v1/routes/questionRoutes');

const app = express(); // Ensure the app is defined before using middleware

// 1) MIDDLEWARES

// Enable CORS
app.use(cors()); // This is now inside the `app` setup

// Enable request logging with morgan in development
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
  console.log(`Morgan enabled`);
}

// Parse JSON payloads
app.use(express.json());

// 2) ROUTES
app.use('/api/v1/users', userRouter);
app.use('/api/v1/questions', questionRouter);

// 3) ERROR HANDLING
// Catch-all for unhandled routes
app.use('*', (req, res) => {
  res.status(404).json({
    status: 'error',
    message: `Can't find ${req.originalUrl} on this server!`,
  });
});

module.exports = app;
