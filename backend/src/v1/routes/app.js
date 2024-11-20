const express = require('express');
const router = express.Router();

const app = express();
const PORT = process.env.PORT || 5000;

router.route('/').get((req, res) => {
  res.send(`<h2>Welcome to the API from ${req.baseUrl}</h2>`);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = router;
