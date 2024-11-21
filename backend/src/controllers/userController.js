const fs = require('fs');
const path = require('path');

const users = JSON.parse(
  fs.readFileSync(path.join(__dirname, `../../data/users.json`))
);

// WILL NOT WORK because of random ID's in users.json file
// He uses this on tours instead
const checkId = (req, res, next, value) => {
  if (req.params.id * 1 > users.length) {
    return res.status(404).json({
      status: 'error',
      message: 'Invalid ID',
    });
  }
  next();
};

const getAllUsers = async (req, res) => {
  try {
    res.status(200).json({
      status: 'success',
      results: users.length,
      data: {
        users,
      },
    });
  } catch (error) {
    res.status(404).json({
      status: 'error',
      message: error.message,
    });
  }
};

const getUser = async (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined!',
  });
};

const createUser = async (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined!',
  });
};

const updateUser = async (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined!',
  });
};

const deleteUser = async (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined!',
  });
};

module.exports = {
  checkId,
  getAllUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
};
