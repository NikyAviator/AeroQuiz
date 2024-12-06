const express = require('express');
const questionController = require('../../controllers/questionController');

const router = express.Router();

// Routes
router.route('/').post(questionController.createQuestion); // Create a new question

router.route('/:topic').get(questionController.getQuestionsByTopic); // Get questions by topic

router.route('/:id').delete(questionController.deleteQuestion); // Delete a question by ID

module.exports = router;
