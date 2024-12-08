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
    enum: ['Meteorology', 'Navigation', 'Principles of Flight', 'Others'], // Add topics as needed
  },
  questionText: {
    type: String,
    required: [true, 'A question text is required'],
    trim: true,
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
    type: String,
    enum: ['easy', 'medium', 'hard'], // Optional difficulty levels
    default: 'medium',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Question = mongoose.model('Question', questionSchema);
module.exports = Question;
