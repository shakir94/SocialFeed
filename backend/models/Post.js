
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
    
    userId:   { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    username: { type: String, required: true },

   
    text:     { type: String, default: '', trim: true, maxlength: 2000 },
    imageUrl: { type: String, default: '' },

   
    likes: [{ type: String }],

    
    comments: [commentSchema],
  },
  {
    timestamps: true,
  }
);


postSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Post', postSchema);
