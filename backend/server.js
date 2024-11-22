// On top because:
// Must load first to set up the environment variables
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });

const app = require('./app');

// Start server
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`App running on port ${port}... 🚀`);
});
