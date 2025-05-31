const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  authorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now },
  // ...other fields...
});

const Post = mongoose.model('Post', postSchema);

async function getPostCountsLast30Days() {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const result = await Post.aggregate([
    { $match: { createdAt: { $gte: thirtyDaysAgo } } },
    { $group: { _id: "$authorId", postCount: { $sum: 1 } } },
    { $project: { _id: 0, authorId: "$_id", postCount: 1 } }
  ]);
  return result;
}

module.exports = { Post, getPostCountsLast30Days };