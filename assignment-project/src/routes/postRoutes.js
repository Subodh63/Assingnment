const express = require('express');
const { createPost, getPostStats } = require('../controllers/postController');
const router = express.Router();

router.post('/', createPost); // POST /api/posts
router.get('/stats', getPostStats);

module.exports = router;