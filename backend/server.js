const mongoose = require('mongoose');
// On top because:
// Must load first to set up the environment variables
const dotenv = require('dotenv');
const app = require('./app');

dotenv.config({ path: './config.env' });

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

// Connect to MongoDB
mongoose
  .connect(DB, {
    useNewUrlParser: true,
  })
  .then((connection) => {
    // REMOVE IN PROD!!!!
    console.log(connection.connections);
    console.log('DB connection successful! 🎉');
  })
  .catch((err) => {
    console.error('DB connection failed! 💥', err.message);
  });

// Start server
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`App running on port ${port}... 🚀`);
});
