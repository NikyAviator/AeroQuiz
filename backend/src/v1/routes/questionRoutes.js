const express = require('express');
const questionController = require('../../controllers/questionController');

const router = express.Router();

// Routes
router.route('/').post(questionController.createQuestions); // Create a new question

router.route('/').get(questionController.getAllQuestions); // Get all questions

router.route('/:topic').get(questionController.getQuestionsByTopic); // Get questions by topic

router.route('/:id').delete(questionController.deleteQuestion); // Delete a question by ID

module.exports = router;
