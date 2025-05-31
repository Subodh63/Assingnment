const User = require('../models/userModel');
const redisClient = require('../utils/redisClient');
const jwt = require('jsonwebtoken');

exports.createUser = async (req, res) => {
  const { name, email, password } = req.body;

  if (!email || !password || !name) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: 'Invalid email format' });
  }

  if (password.length < 6) {
    return res.status(400).json({ message: 'Password must be at least 6 characters' });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: 'Email already exists' });
    }

    const user = new User({ name, email, password });
    await user.save();

    // Generate JWT token
    const token = jwt.sign(
      { _id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // Return user info and token
    res.status(201).json({ _id: user._id, email: user.email, token });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getUser = async (req, res) => {
  const userId = req.params.id;
  console.log("Fetching userId:", userId);

  try {
    const cachedData = await redisClient.get(userId);
    if (cachedData) {
      console.log("Cache hit for userId:", userId);
      return res.status(200).json(JSON.parse(cachedData));
    }

    // Cache miss: fetch from MongoDB
    console.log("Cache miss, querying MongoDB for userId:", userId);
    const user = await User.findById(userId);
    if (!user) {
      console.log("User not found in MongoDB for userId:", userId);
      return res.status(404).json({ message: 'User not found' });
    }
    await redisClient.setEx(userId, 60, JSON.stringify(user));
    console.log("User found and cached for userId:", userId);
    res.status(200).json(user);
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ message: 'Server error' });
  }
};