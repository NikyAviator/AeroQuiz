const express = require('express');
const app = express(); // Create the main Express app

// Middleware for JSON parsing
app.use(express.json());

// Define a route
app.get('/', (req, res) => {
  res.send(`<h2>Welcome to the API from ${req.baseUrl}</h2>`);
});

// Set up the server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
