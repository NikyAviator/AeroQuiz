const mongoose = require('mongoose');

// Embedded schema for answers
const answerSchema = new mongoose.Schema({
  text: {
    type: String,
    required: [true, 'Answer text is required'],
    trim: true,
  },
  isCorrect: {
    type: Boolean,
    required: true,
    default: false, // Indicates whether this is the correct answer
  },
});

// Schema for questions
const questionSchema = new mongoose.Schema({
  topic: {
    type: String,
    required: [true, 'A topic is required'],
    enum: [
      'Meteorology',
      'Navigation',
      'Principles of Flight',
      'Performance',
      'Human Performance',
    ], // Add topics as needed
  },
  questionText: {
    type: String,
    required: [true, 'A question text is required'],
    trim: true,
    unique: true, // Prevent duplicate questions in the database
  },
  answers: {
    type: [answerSchema], // Embedded answers
    validate: {
      validator: function (val) {
        return val.length === 4; // Exactly 4 answers
      },
      message: 'A question must have exactly 4 answers',
    },
  },
  questionType: {
    type: String,
    enum: ['multiple-choice'], // Can add more types later if needed
    default: 'multiple-choice',
  },
  difficulty: {
    type: Number,
    enum: [1, 2, 3], // 1: easy, 2: medium, 3: difficult
    default: 2, // Default to medium difficulty
  },
  level: {
    type: String,
    enum: ['PPL', 'ATPL'], // Defines the license level for the question
    required: [true, 'A level is required (PPL or ATPL)'],
    default: 'ATPL',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Question = mongoose.model('Question', questionSchema);
module.exports = Question;
