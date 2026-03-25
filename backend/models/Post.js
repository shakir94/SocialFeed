
const mongoose = require('mongoose');

// ── Embedded Comment Schema ───────────────────────────────────
const commentSchema = new mongoose.Schema(
  {
    userId:   { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    username: { type: String, required: true },
    text:     { type: String, required: true, trim: true, maxlength: 500 },
  },
  {
    timestamps: true,
  }
);

// ── Post Schema ───────────────────────────────────────────────
const postSchema = new mongoose.Schema(
  {
    // Author info (denormalized to avoid extra lookups on feed)
    userId:   { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    username: { type: String, required: true },

    // Content — at least one of text or imageUrl is required (validated in route)
    text:     { type: String, default: '', trim: true, maxlength: 2000 },
    imageUrl: { type: String, default: '' },

    // Likes: array of usernames (for easy "did I like this?" checks and display)
    likes: [{ type: String }],

    // Embedded comments array
    comments: [commentSchema],
  },
  {
    timestamps: true,
  }
);

// Index for fast feed queries (newest first)
postSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Post', postSchema);
