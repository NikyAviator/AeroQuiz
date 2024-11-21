const express = require('express');
const router = express.Router();
const userController = require('../../controllers/userController');
const checkId = require('../../controllers/checkId');

// Only specified for this router!
// This is a param middleware that will run for only:
// User routes with a parameter called 'id'
router.param('id', (req, res, next, value) => {
  console.log(`User id is: ${value}`);
  next();
});

// DOES NOT WORK ATM because of random ID's in users.json file
//router.param('id', checkId);

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
