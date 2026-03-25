// ─────────────────────────────────────────────────────────────
//  components/CreatePost.js
//  Post composer card — text, image upload, live preview
// ─────────────────────────────────────────────────────────────
import React, { useState, useRef } from 'react';
import { Spinner, Alert } from 'react-bootstrap';
import { FiImage, FiSend, FiX } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { getAvatarClass, getInitial } from '../utils/avatar';
import API from '../api/axios';

const MAX_CHARS = 2000;

const CreatePost = ({ onPostCreated }) => {
  const { user } = useAuth();

  const [text,         setText]         = useState('');
  const [imageFile,    setImageFile]     = useState(null);
  const [imagePreview, setImagePreview]  = useState('');
  const [loading,      setLoading]       = useState(false);
  const [error,        setError]         = useState('');

  const fileInputRef = useRef(null);

  // ── Handle image selection ────────────────────────────────
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Client-side 5MB guard
    if (file.size > 5 * 1024 * 1024) {
      setError('Image must be smaller than 5MB');
      return;
    }

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
    setError('');
  };

  // ── Remove selected image ─────────────────────────────────
  const removeImage = () => {
    setImageFile(null);
    setImagePreview('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // ── Submit post ───────────────────────────────────────────
  const handleSubmit = async () => {
    if (!text.trim() && !imageFile) {
      setError('Please write something or add an image.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Use FormData so the image file is sent as multipart
      const formData = new FormData();
      formData.append('text', text.trim());
      if (imageFile) formData.append('image', imageFile);

      const res = await API.post('/posts', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      // Reset form
      setText('');
      removeImage();

      // Notify Feed to prepend the new post
      if (onPostCreated) onPostCreated(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create post. Try again.');
    } finally {
      setLoading(false);
    }
  };

  // ── Handle Ctrl/Cmd + Enter to submit ─────────────────────
  const handleKeyDown = (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      handleSubmit();
    }
  };

  const charCount   = text.length;
  const charClass   = charCount > MAX_CHARS ? 'danger' : charCount > MAX_CHARS * 0.85 ? 'warning' : '';
  const canSubmit   = (text.trim() || imageFile) && !loading && charCount <= MAX_CHARS;

  return (
    <div className="create-post-card">
      {/* Error */}
      {error && (
        <Alert
          variant="danger"
          className="py-2 mb-3 rounded-3"
          style={{ fontSize: 13 }}
          onClose={() => setError('')}
          dismissible
        >
          {error}
        </Alert>
      )}

      {/* Top row: avatar + textarea */}
      <div className="create-post-top">
        {/* User avatar */}
        <div className={`create-post-avatar ${getAvatarClass(user?.username)}`}>
          {getInitial(user?.username)}
        </div>

        {/* Text input */}
        <div style={{ flex: 1 }}>
          <textarea
            className="create-post-textarea"
            placeholder={`What's on your mind, ${user?.username}?`}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            maxLength={MAX_CHARS + 50} // allow slight overflow so counter turns red
            rows={1}
          />
          {charCount > MAX_CHARS * 0.7 && (
            <div className={`char-count ${charClass}`}>
              {charCount}/{MAX_CHARS}
            </div>
          )}
        </div>
      </div>

      {/* Image preview */}
      {imagePreview && (
        <div className="image-preview-wrap">
          <img src={imagePreview} alt="Preview" className="image-preview" />
          <button
            className="btn-remove-image"
            onClick={removeImage}
            title="Remove image"
            type="button"
          >
            <FiX size={12} />
          </button>
        </div>
      )}

      {/* Divider */}
      <hr className="create-post-divider" />

      {/* Bottom row: attach image + post button */}
      <div className="create-post-actions">
        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
          style={{ display: 'none' }}
          onChange={handleImageChange}
          id="image-upload"
        />

        <button
          className="btn-attach-image"
          onClick={() => fileInputRef.current?.click()}
          type="button"
          disabled={loading}
        >
          <FiImage size={16} />
          <span>{imageFile ? 'Change Photo' : 'Add Photo'}</span>
        </button>

        <button
          className="btn-post"
          onClick={handleSubmit}
          disabled={!canSubmit}
          type="button"
          aria-label="Submit post"
        >
          {loading ? (
            <>
              <Spinner size="sm" animation="border" />
              <span>Posting…</span>
            </>
          ) : (
            <>
              <FiSend size={14} />
              <span>Post</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default CreatePost;
