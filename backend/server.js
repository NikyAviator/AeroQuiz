const app = require('./app');
const morgan = require('morgan');

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Få fram environment variabeln
// Sparas i process.env - massa stuff där!
console.log(app.get('env'));

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`App running on port ${PORT}... 🚀`);
});
