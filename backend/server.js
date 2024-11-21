const app = require('./app');

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`App running on port ${PORT}... 🚀`);
});
