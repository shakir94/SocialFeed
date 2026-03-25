
import React, { useState, useEffect, useCallback } from 'react';
import { Spinner } from 'react-bootstrap';
import { FiRefreshCw } from 'react-icons/fi';
import AppNavbar from '../components/AppNavbar';
import CreatePost from '../components/CreatePost';
import PostCard from '../components/PostCard';
import API from '../api/axios';

const LIMIT = 10; // Posts per page

const Feed = () => {
  const [posts,      setPosts]      = useState([]);
  const [page,       setPage]       = useState(1);
  const [hasMore,    setHasMore]    = useState(true);
  const [loading,    setLoading]    = useState(false);   // Loading MORE posts
  const [initLoad,   setInitLoad]   = useState(true);    // Very first load

  // ── Fetch a page of posts ─────────────────────────────────
  const fetchPosts = useCallback(async (pageNum = 1, replace = false) => {
    setLoading(true);
    try {
      const res = await API.get('/posts', {
        params: { page: pageNum, limit: LIMIT },
      });

      const { posts: newPosts, pagination } = res.data;

      setPosts((prev) =>
        replace ? newPosts : [...prev, ...newPosts]
      );
      setHasMore(pagination.hasMore);
      setPage(pageNum);
    } catch (err) {
      console.error('Fetch posts error:', err.message);
    } finally {
      setLoading(false);
      setInitLoad(false);
    }
  }, []);

  // ── Initial load ──────────────────────────────────────────
  useEffect(() => {
    fetchPosts(1, true);
  }, [fetchPosts]);

  // ── Load next page ────────────────────────────────────────
  const handleLoadMore = () => {
    if (!loading && hasMore) {
      fetchPosts(page + 1, false);
    }
  };

  // ── Prepend new post created by current user ──────────────
  const handlePostCreated = (newPost) => {
    setPosts((prev) => [newPost, ...prev]);
  };

  // ── Remove deleted post from state ───────────────────────
  const handlePostDeleted = (deletedId) => {
    setPosts((prev) => prev.filter((p) => p._id !== deletedId));
  };

  // ── Refresh feed from top ─────────────────────────────────
  const handleRefresh = () => {
    setInitLoad(true);
    fetchPosts(1, true);
  };

  return (
    <>
      <AppNavbar />

      <div className="feed-container">
        {/* Create post box */}
        <CreatePost onPostCreated={handlePostCreated} />

        {/* Feed header with refresh */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 12,
          }}
        >
          <h6
            style={{
              fontWeight: 700,
              color: '#1C1E21',
              fontSize: 15,
              margin: 0,
            }}
          >
            Recent Posts
          </h6>
          <button
            style={{
              background: 'transparent',
              border: 'none',
              color: '#65676B',
              cursor: 'pointer',
              padding: '4px 8px',
              borderRadius: 8,
              display: 'flex',
              alignItems: 'center',
              gap: 5,
              fontSize: 13,
              fontWeight: 500,
            }}
            onClick={handleRefresh}
            disabled={loading && initLoad}
            title="Refresh feed"
          >
            <FiRefreshCw size={14} />
            Refresh
          </button>
        </div>

        {/* Initial loading spinner */}
        {initLoad && (
          <div className="loading-container">
            <Spinner animation="border" style={{ color: '#7C4DFF', width: 42, height: 42 }} />
            <p style={{ marginTop: 16, color: '#65676B', fontSize: 14 }}>
              Loading your feed…
            </p>
          </div>
        )}

        {/* Empty feed state */}
        {!initLoad && posts.length === 0 && (
          <div className="empty-feed">
            <span className="empty-feed-icon">📭</span>
            <h5>No posts yet!</h5>
            <p style={{ fontSize: 14, maxWidth: 300, margin: '0 auto' }}>
              Be the first to share something. Create a post above!
            </p>
          </div>
        )}

        {/* Post cards */}
        {!initLoad && posts.map((post) => (
          <PostCard
            key={post._id}
            post={post}
            onDelete={handlePostDeleted}
          />
        ))}

        {/* Load More button */}
        {!initLoad && hasMore && (
          <button
            className="btn-load-more"
            onClick={handleLoadMore}
            disabled={loading}
          >
            {loading ? (
              <>
                <Spinner size="sm" animation="border" />
                Loading…
              </>
            ) : (
              <>
                <FiRefreshCw size={15} />
                Load More Posts
              </>
            )}
          </button>
        )}

        {/* End of feed message */}
        {!initLoad && !hasMore && posts.length > 0 && (
          <div className="feed-end-message">
            ✨ You're all caught up! Check back later for new posts.
          </div>
        )}
      </div>
    </>
  );
};

export default Feed;
