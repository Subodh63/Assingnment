const { getPostCountsLast30Days, Post } = require('../models/postModel');

exports.getPostStats = async (req, res) => {
  try {
    const stats = await getPostCountsLast30Days();
    res.json(stats);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.createPost = async (req, res) => {
  try {
    const { authorId, ...rest } = req.body;
    if (!authorId) {
      return res.status(400).json({ message: 'authorId is required' });
    }
    const post = new Post({
      authorId,
      ...rest,
      createdAt: new Date(), // ensure createdAt is set
    });
    await post.save();
    res.status(201).json(post);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};