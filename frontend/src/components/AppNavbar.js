
import React from 'react';
import { Navbar, Container } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { FiLogOut } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { getAvatarClass } from '../utils/avatar';

const AppNavbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Navbar className="app-navbar">
      <Container style={{ maxWidth: 660 }}>
        {/* Brand */}
        <Navbar.Brand className="navbar-brand-custom me-auto">
          🌐 SocialFeed
        </Navbar.Brand>

        {/* User info + logout */}
        {user && (
          <div className="d-flex align-items-center gap-2">
            <div className="nav-username">
              <div className={`nav-avatar ${getAvatarClass(user.username)}`}>
                {user.username.charAt(0).toUpperCase()}
              </div>
              <span className="d-none d-sm-inline">{user.username}</span>
            </div>
            <button className="btn-logout" onClick={handleLogout} title="Logout">
              <FiLogOut size={14} />
              <span className="ms-1 d-none d-sm-inline">Logout</span>
            </button>
          </div>
        )}
      </Container>
    </Navbar>
  );
};

export default AppNavbar;
