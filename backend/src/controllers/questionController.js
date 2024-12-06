const Question = require('../models/questionModel');

// Create a new question
const createQuestion = async (req, res) => {
  try {
    const newQuestion = await Question.create(req.body); // Expecting topic, questionText, answers
    res.status(201).json({
      status: 'success',
      data: {
        question: newQuestion,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'error',
      message: err.message,
    });
  }
};

// Get all questions for a topic
const getQuestionsByTopic = async (req, res) => {
  try {
    const { topic } = req.params;
    const questions = await Question.find({ topic });
    res.status(200).json({
      status: 'success',
      results: questions.length,
      data: {
        questions,
      },
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: err.message,
    });
  }
};

// Delete a question by ID
const deleteQuestion = async (req, res) => {
  try {
    const { id } = req.params;
    await Question.findByIdAndDelete(id);
    res.status(204).json({
      status: 'success',
      message: 'Question deleted successfully',
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: err.message,
    });
  }
};

module.exports = {
  createQuestion,
  getQuestionsByTopic,
  deleteQuestion,
};
