const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
dotenv.config({ path: './config.env' });

// Available Routes
const userRouter = require('./src/v1/routes/userRoutes');

const app = express();

// 1) MIDDLEWARES
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
  console.log(`Morgan enabled`);
}

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
