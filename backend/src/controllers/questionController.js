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

// Get All Topics
const getTopics = async (req, res) => {
  try {
    const topics = await Question.find().distinct('topic');
    res.status(200).json({
      status: 'success',
      results: topics.length,
      data: {
        topics,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message,
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
    // BUILD THE QUERY
    // 1A) Filtering
    // Create a copy of the query object
    const queryObj = { ...req.query };
    // Exclude fields from the query object
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach((el) => delete queryObj[el]);

    // 1B) Advanced filtering
    // Han lägger [] i POSTMAN
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
    console.log(JSON.parse(queryStr));

    // The find method returns a query object witch upon we can chain other methods.
    let query = Question.find(JSON.parse(queryStr));

    // 2) Sorting
    if (req.query.sort) {
      // Detta är att byta ut kommatecken mot mellanslag för att kunna sortera på flera fält.
      const sortBy = req.query.sort.split(',').join(' ');
      // de går att sortera på flera fält genom att separera dem med kommatecken.
      // - för att sortera i omvänd ordning
      // for example sort=difficulty,createdAt
      query = query.sort(sortBy);
    }
    // default sorting
    else {
      query = query.sort('-createdAt');
    }

    // 3) Field limiting

    // EXECUTE THE QUERY
    const questions = await query;

    // SEND RESPONSE
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
  getTopics,
  getQuestionsByTopic,
  deleteQuestion,
  getAllQuestions,
  deleteAllQuestions,
};
