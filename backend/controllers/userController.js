const User = require('../models/user');

const getUsers = async (req, res) => {
  const users = await User.find();
  res.json(users);
};

const createUser = async (req, res) => {
  const { name, email } = req.body;

  if (!name || !email) {
    return res.status(400).json({ message: 'Name and Email are required' });
  }

  const user = new User({ name, email });
  await user.save();
  res.status(201).json(user);
};

module.exports = { getUsers, createUser };
