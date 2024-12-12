const Question = require('../models/questionModel');

// Create a new question
// Create single or multiple questions
const createQuestions = async (req, res) => {
  try {
    let newQuestions;
    if (Array.isArray(req.body)) {
      // If the request body is an array, use insertMany
      newQuestions = await Question.insertMany(req.body);
    } else {
      // If the request body is a single object, use create
      newQuestions = await Question.create(req.body);
    }

    res.status(201).json({
      status: 'success',
      results: Array.isArray(newQuestions) ? newQuestions.length : 1,
      data: {
        questions: newQuestions,
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

// Get all questions
const getAllQuestions = async (req, res) => {
  try {
    const questions = await Question.find();
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
// Byt från 200 till 204 för att indikera att det inte finns något innehåll (tryhardar seneare)
// Delete a question by ID
const deleteQuestion = async (req, res) => {
  try {
    const { id } = req.params;
    await Question.findByIdAndDelete(id);
    res.status(200).json({
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

const deleteAllQuestions = async (req, res) => {
  try {
    await Question.deleteMany({});
    res.status(200).json({
      status: 'success',
      message: 'All questions deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message,
    });
  }
};

module.exports = {
  createQuestions,
  getQuestionsByTopic,
  deleteQuestion,
  getAllQuestions,
  deleteAllQuestions,
};
