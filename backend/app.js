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

// 3) ROUTES
app.use('/api/v1/users', userRouter);

app.listen(PORT, () => {
  console.log(`App running on port ${PORT}...`);
});

module.exports = app;
