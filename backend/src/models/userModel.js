const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'A first name is required!'],
    trim: true, // Removes extra spaces
  },
  lastName: {
    type: String,
    required: [true, 'A last name is required!'],
    trim: true,
  },
  userName: {
    type: String,
    required: [true, 'A user name is required!'],
    unique: true,
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'An email address is required!'],
    unique: true, // Ensures no duplicate emails
    lowercase: true, // Ensures email is stored in lowercase
    match: [
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      'Please provide a valid email address!',
    ],
  },
  password: {
    type: String,
    required: [true, 'A password is required!'],
    minlength: [1, 'Password must be at least 1 characters long!'],
    select: false, // Prevents password from being returned in queries
  },
  passwordChangedAt: {
    type: Date, // Track when the password was last changed
  },
  isAdmin: {
    type: Boolean,
    default: false, // Determine if the user has admin privileges
  },
  active: {
    type: Boolean,
    default: true, // Soft-delete users by marking as inactive
  },
  // Future fields for payment
  paymentInfo: {
    type: Map, // Can store payment-related metadata
    of: String,
  },
});

const User = mongoose.model('User', userSchema);
module.exports = User;
