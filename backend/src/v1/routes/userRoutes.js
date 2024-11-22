const express = require('express');
const router = express.Router();
const userController = require('../../controllers/userController');

// Only specified for this router!
// This is a param middleware that will run for only:
// User routes with a parameter called 'id'
router.param('id', (req, res, next, value) => {
  console.log(`User id is: ${value}`);
  next();
});

router
  .route('/')
  .get(userController.getAllUsers)
  .post(userController.createUser);

router
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;
