// ─────────────────────────────────────────────────────────────
//  routes/postRoutes.js — Post CRUD, like/unlike, comment
// ─────────────────────────────────────────────────────────────
const express  = require('express');
const router   = express.Router();
const mongoose = require('mongoose');
const Post     = require('../models/Post');
const protect  = require('../middleware/authMiddleware');
const { upload } = require('../config/cloudinary');

// ── POST /api/posts — Create a new post ──────────────────────
router.post('/', protect, upload.single('image'), async (req, res) => {
  const { text } = req.body;
  const imageUrl = req.file ? req.file.path : '';

  // Must have at least text OR image
  if (!text?.trim() && !imageUrl) {
    return res.status(400).json({ message: 'Post must have text or an image' });
  }

  try {
    const post = await Post.create({
      userId:   new mongoose.Types.ObjectId(req.user.id), // explicit cast from JWT string
      username: req.user.username,
      text:     text?.trim() || '',
      imageUrl,
    });
    res.status(201).json(post);
  } catch (err) {
    console.error('Create post error:', err.message);
    res.status(500).json({ message: 'Server error while creating post' });
  }
});

// ── GET /api/posts — Paginated public feed ───────────────────
// Query params: ?page=1&limit=10
router.get('/', protect, async (req, res) => {
  const page  = Math.max(1, parseInt(req.query.page)  || 1);
  const limit = Math.min(20, parseInt(req.query.limit) || 10); // cap at 20
  const skip  = (page - 1) * limit;

  try {
    const [posts, total] = await Promise.all([
      Post.find()
        .sort({ createdAt: -1 }) // Newest first
        .skip(skip)
        .limit(limit)
        .lean(),                 // .lean() returns plain JS objects (faster)
      Post.countDocuments(),
    ]);

    res.json({
      posts,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        hasMore:    page < Math.ceil(total / limit),
      },
    });
  } catch (err) {
    console.error('Get posts error:', err.message);
    res.status(500).json({ message: 'Server error while fetching posts' });
  }
});

// ── PUT /api/posts/:id/like — Toggle like/unlike ─────────────
router.put('/:id/like', protect, async (req, res) => {
  try {
    const post     = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    const username    = req.user.username;
    const alreadyLiked = post.likes.includes(username);

    if (alreadyLiked) {
      // Unlike — remove username from array
      post.likes = post.likes.filter((u) => u !== username);
    } else {
      // Like — add username to array
      post.likes.push(username);
    }

    await post.save();
    // Return only the updated likes array and count (lightweight response)
    res.json({ likes: post.likes, liked: !alreadyLiked });
  } catch (err) {
    console.error('Like toggle error:', err.message);
    res.status(500).json({ message: 'Server error while toggling like' });
  }
});

// ── POST /api/posts/:id/comment — Add a comment ──────────────
router.post('/:id/comment', protect, async (req, res) => {
  const { text } = req.body;

  if (!text?.trim()) {
    return res.status(400).json({ message: 'Comment text cannot be empty' });
  }

  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    const newComment = {
      userId:   new mongoose.Types.ObjectId(req.user.id), // explicit cast from JWT string
      username: req.user.username,
      text:     text.trim(),
    };

    post.comments.push(newComment);
    await post.save();

    // Return the newly added comment (last element)
    const addedComment = post.comments[post.comments.length - 1];
    res.status(201).json({ comment: addedComment, totalComments: post.comments.length });
  } catch (err) {
    console.error('Add comment error:', err.message);
    res.status(500).json({ message: 'Server error while adding comment' });
  }
});

// ── DELETE /api/posts/:id — Delete a post (own posts only) ───
router.delete('/:id', protect, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    // Only the post owner can delete
    if (post.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to delete this post' });
    }

    await Post.findByIdAndDelete(req.params.id);
    res.json({ message: 'Post deleted successfully' });
  } catch (err) {
    console.error('Delete post error:', err.message);
    res.status(500).json({ message: 'Server error while deleting post' });
  }
});

module.exports = router;
