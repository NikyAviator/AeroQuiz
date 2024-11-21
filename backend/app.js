const express = require('express');
const morgan = require('morgan');

const PORT = process.env.PORT || 5000;

const userRouter = require('./src/v1/routes/userRoutes');

const app = express();

// 1) MIDDLEWARES
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(express.json());

// 2) ROUTES
app.use('/api/v1/', userRouter);

// 3) ERROR HANDLING
// Catch-all for unhandled routes
app.use('*', (req, res) => {
  res.status(404).json({
    status: 'error',
    message: `Can't find ${req.originalUrl} on this server!`,
  });
});

app.listen(PORT, () => {
  console.log(`App running on port ${PORT}...`);
});

module.exports = app;
