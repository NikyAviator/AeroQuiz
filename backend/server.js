const dotenv = require('dotenv');
const app = require('./app');

dotenv.config({ path: './config.env' });

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`App running on port ${PORT}... 🚀`);
});
