// ─────────────────────────────────────────────────────────────
//  components/PostCard.js
//  Renders a single post with likes, comments, delete
// ─────────────────────────────────────────────────────────────
import React, { useState } from 'react';
import { Spinner } from 'react-bootstrap';
import {
  FiHeart, FiMessageCircle, FiTrash2, FiSend,
} from 'react-icons/fi';
import { FaHeart } from 'react-icons/fa';
import moment from 'moment';
import { useAuth } from '../context/AuthContext';
import { getAvatarClass, getInitial } from '../utils/avatar';
import API from '../api/axios';

const PostCard = ({ post, onDelete }) => {
  const { user } = useAuth();

  // ── Local state (optimistic UI updates) ──────────────────
  const [likes,         setLikes]         = useState(post.likes || []);
  const [comments,      setComments]      = useState(post.comments || []);
  const [showComments,  setShowComments]  = useState(false);
  const [commentText,   setCommentText]   = useState('');
  const [likeLoading,   setLikeLoading]   = useState(false);
  const [commentLoading,setCommentLoading]= useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const isLiked  = user ? likes.includes(user.username) : false;
  // post.userId may be ObjectId or string depending on serialization — toString() normalizes both
  const isMyPost = user
    ? post.userId?.toString() === user.id || post.username === user.username
    : false;

  // ── Toggle like (optimistic update) ─────────────────────
  const handleLike = async () => {
    if (!user || likeLoading) return;

    // Optimistically update UI immediately
    const wasLiked   = likes.includes(user.username);
    const newLikes   = wasLiked
      ? likes.filter((u) => u !== user.username)
      : [...likes, user.username];
    setLikes(newLikes);

    setLikeLoading(true);
    try {
      const res = await API.put(`/posts/${post._id}/like`);
      setLikes(res.data.likes); // Sync with server truth
    } catch (err) {
      setLikes(likes); // Rollback on error
      console.error('Like error:', err.message);
    } finally {
      setLikeLoading(false);
    }
  };

  // ── Submit comment ────────────────────────────────────────
  const handleComment = async (e) => {
    if (e?.preventDefault) e.preventDefault();
    if (!commentText.trim() || commentLoading) return;

    setCommentLoading(true);
    try {
      const res = await API.post(`/posts/${post._id}/comment`, {
        text: commentText.trim(),
      });
      setComments((prev) => [...prev, res.data.comment]);
      setCommentText('');
    } catch (err) {
      console.error('Comment error:', err.message);
    } finally {
      setCommentLoading(false);
    }
  };

  // ── Handle Enter key in comment box ──────────────────────
  const handleCommentKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleComment(e);
    }
  };

  // ── Delete post ───────────────────────────────────────────
  const handleDelete = async () => {
    if (!window.confirm('Delete this post? This cannot be undone.')) return;
    setDeleteLoading(true);
    try {
      await API.delete(`/posts/${post._id}`);
      if (onDelete) onDelete(post._id);
    } catch (err) {
      console.error('Delete error:', err.message);
      setDeleteLoading(false);
    }
  };

  return (
    <div className="post-card">
      {/* ── Header ───────────────────────────────────────── */}
      <div className="post-header">
        <div className="post-header-left">
          <div className={`post-avatar ${getAvatarClass(post.username)}`}>
            {getInitial(post.username)}
          </div>
          <div>
            <p className="post-username">{post.username}</p>
            <p className="post-time">{moment(post.createdAt).fromNow()}</p>
          </div>
        </div>

        {/* Delete button — only visible to post owner */}
        {isMyPost && (
          <button
            className="btn-delete-post"
            onClick={handleDelete}
            disabled={deleteLoading}
            title="Delete post"
          >
            {deleteLoading
              ? <Spinner size="sm" animation="border" />
              : <FiTrash2 size={16} />
            }
          </button>
        )}
      </div>

      {/* ── Post Text ────────────────────────────────────── */}
      {post.text && <p className="post-text">{post.text}</p>}

      {/* ── Post Image ───────────────────────────────────── */}
      {post.imageUrl && (
        <img
          src={post.imageUrl}
          alt="Post"
          className="post-image"
          loading="lazy"
        />
      )}

      {/* ── Stats row (likes count + comments count) ─────── */}
      {(likes.length > 0 || comments.length > 0) && (
        <div className="post-stats">
          {likes.length > 0 && (
            <span className="stat-item" onClick={() => {}}>
              <FaHeart size={13} color="#E0245E" />
              <span>
                {likes.length} {likes.length === 1 ? 'like' : 'likes'}
              </span>
            </span>
          )}
          {comments.length > 0 && (
            <span
              className="stat-item ms-auto"
              onClick={() => setShowComments((s) => !s)}
            >
              {comments.length} {comments.length === 1 ? 'comment' : 'comments'}
            </span>
          )}
        </div>
      )}

      {/* ── Action Buttons ───────────────────────────────── */}
      <div className="post-actions">
        {/* Like button */}
        <button
          className={`action-btn ${isLiked ? 'liked' : ''}`}
          onClick={handleLike}
          disabled={likeLoading}
        >
          {isLiked
            ? <FaHeart size={17} />
            : <FiHeart size={17} />
          }
          <span>{isLiked ? 'Liked' : 'Like'}</span>
        </button>

        {/* Comment toggle button */}
        <button
          className={`action-btn ${showComments ? 'commented' : ''}`}
          onClick={() => setShowComments((s) => !s)}
        >
          <FiMessageCircle size={17} />
          <span>Comment</span>
        </button>
      </div>

      {/* ── Comments Section ─────────────────────────────── */}
      {showComments && (
        <div className="comments-section">
          {/* Comments list */}
          {comments.length > 0 && (
            <div className="comment-list">
              {comments.map((c) => (
                <div key={c._id} className="comment-item">
                  <div className={`comment-avatar ${getAvatarClass(c.username)}`}>
                    {getInitial(c.username)}
                  </div>
                  <div className="comment-bubble">
                    <span className="comment-author">{c.username}</span>
                    <p className="comment-text">{c.text}</p>
                    <p className="comment-time">{moment(c.createdAt).fromNow()}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Empty state */}
          {comments.length === 0 && (
            <p style={{ fontSize: 13, color: '#B0B3B8', textAlign: 'center', marginBottom: 12 }}>
              No comments yet. Be the first!
            </p>
          )}

          {/* Comment input row */}
          <div className="comment-input-row">
            <div className={`comment-avatar ${getAvatarClass(user?.username)}`} style={{ width: 32, height: 32, fontSize: 12, flexShrink: 0 }}>
              {getInitial(user?.username)}
            </div>
            <input
              className="comment-input"
              type="text"
              placeholder="Write a comment… (Enter to send)"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              onKeyDown={handleCommentKey}
              maxLength={500}
              disabled={commentLoading}
            />
            <button
              className="btn-send-comment"
              onClick={handleComment}
              disabled={!commentText.trim() || commentLoading}
              type="button"
              title="Send comment"
            >
              {commentLoading
                ? <Spinner size="sm" animation="border" />
                : <FiSend size={14} />
              }
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PostCard;
