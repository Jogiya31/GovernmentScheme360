import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { toggleTheme } from '../../features/theme/themeSlice';
import { logout } from '../../features/auth/authSlice';
import { markAllAsRead } from '../../features/notifications/notificationsSlice';

export default function Header({ sidebarCollapsed, toggleSidebar }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { theme } = useSelector((state) => state.theme);
  const { user } = useSelector((state) => state.auth);
  const { notifications, unreadCount } = useSelector((state) => state.notifications);

  const [showNotif, setShowNotif] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  const profileRef = useRef(null);
  const notifRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfile(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setShowNotif(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const handleToggleTheme = () => {
    dispatch(toggleTheme());
  };

  return (
    <header className="topbar" data-navbarbg="skin6">
      <nav className="navbar top-navbar navbar-expand-lg navbar-light">
        <div className="navbar-header" data-logobg="skin6">
          {/* Mobile sidebar toggle */}
          <button
            className="btn btn-link nav-toggler waves-effect waves-light d-block d-lg-none border-0 text-dark-emphasis p-0"
            onClick={toggleSidebar}
            aria-label="Toggle Sidebar"
          >
            <i className="bi bi-list fs-3"></i>
          </button>

          {/* Logo brand */}
          <div className="navbar-brand py-0">
            <Link to="/dashboard" className="d-flex align-items-center text-decoration-none">
              <i className="bi bi-cpu-fill text-primary fs-3 me-2"></i>
              {!sidebarCollapsed && (
                <span className="h4 mb-0 fw-bold text-dark-emphasis tracking-tight" style={{ letterSpacing: '-0.02em' }}>
                  Free<span className="text-primary">Dash</span>
                </span>
              )}
            </Link>
          </div>

          {/* Mobile toggle button for right-side navbar items */}
          <button
            className="btn btn-link topbartoggler d-block d-lg-none border-0 text-dark-emphasis p-0"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle Navigation"
          >
            <i className="bi bi-three-dots fs-3"></i>
          </button>
        </div>

        {/* Collapsible Navbar content */}
        <div className="navbar-collapse collapse px-3" id="navbarSupportedContent">
          {/* Left section of topbar header */}
          <ul className="navbar-nav float-left me-auto align-items-center">
            {/* Desktop Sidebar Toggle */}
            <li className="nav-item d-none d-lg-block">
              <button
                className="btn btn-link nav-link border-0 text-dark-emphasis p-0"
                onClick={toggleSidebar}
                aria-label="Toggle Sidebar"
              >
                <i className="bi bi-list fs-4"></i>
              </button>
            </li>

            {/* Global Search Bar */}
            <li className="nav-item d-none d-md-block ms-3">
              <form className="d-flex align-items-center" onSubmit={(e) => e.preventDefault()}>
                <div className="input-group input-group-sm border-0 bg-light rounded" style={{ maxWidth: '280px' }}>
                  <span className="input-group-text bg-transparent border-0 text-muted">
                    <i className="bi bi-search"></i>
                  </span>
                  <input
                    type="search"
                    className="form-control bg-transparent border-0 ps-0 text-muted"
                    placeholder="Search assets..."
                    style={{ fontSize: '0.85rem' }}
                  />
                </div>
              </form>
            </li>
          </ul>

          {/* Right section of topbar header */}
          <ul className="navbar-nav float-end align-items-center gap-2">
            {/* Theme Toggle Button */}
            <li className="nav-item">
              <button
                onClick={handleToggleTheme}
                className="btn  btn-sm border-0  d-flex align-items-center justify-content-center"
                style={{ width: '38px', height: '38px' }}
                title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
                id="theme-toggle-btn"
              >
                <i className={`bi ${theme === 'light' ? 'bi-moon-stars-fill' : 'bi-sun-fill'} fs-5 text-muted`}></i>
              </button>
            </li>

            {/* Notifications Dropdown */}
            <li className="nav-item position-relative" ref={notifRef}>
              <button
                onClick={() => {
                  setShowNotif(!showNotif);
                  setShowProfile(false);
                }}
                className="btn btn-outline-secondary btn-sm border-0 rounded-circle d-flex align-items-center justify-content-center position-relative"
                style={{ width: '38px', height: '38px' }}
                id="notifications-dropdown-btn"
              >
                <i className="bi bi-bell fs-5 text-muted"></i>
                {unreadCount > 0 && (
                  <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" style={{ fontSize: '0.65rem' }}>
                    {unreadCount}
                  </span>
                )}
              </button>

              {showNotif && (
                <div
                  className="position-absolute end-0 mt-2 bg-body border rounded shadow-lg p-0"
                  style={{ width: '320px', zIndex: 1050 }}
                  id="notifications-dropdown-menu"
                >
                  <div className="d-flex justify-content-between align-items-center p-3 border-bottom">
                    <span className="fw-semibold">Notifications</span>
                    {unreadCount > 0 && (
                      <button
                        onClick={() => dispatch(markAllAsRead())}
                        className="btn btn-link btn-sm p-0 text-decoration-none"
                        style={{ fontSize: '0.8rem' }}
                      >
                        Mark all as read
                      </button>
                    )}
                  </div>
                  <div className="overflow-auto" style={{ maxHeight: '250px' }}>
                    {notifications.length === 0 ? (
                      <div className="text-center py-4 text-muted" style={{ fontSize: '0.9rem' }}>
                        No notifications
                      </div>
                    ) : (
                      notifications.map((n) => (
                        <div key={n.id} className={`p-3 border-bottom hover-bg ${n.read ? 'opacity-75' : 'bg-primary-subtle'}`}>
                          <div className="d-flex justify-content-between mb-1" style={{ fontSize: '0.8rem' }}>
                            <span className={`fw-semibold text-${n.type === 'danger' ? 'danger' : n.type === 'success' ? 'success' : 'primary'}`}>
                              {n.type.toUpperCase()}
                            </span>
                            <span className="text-muted">{n.time}</span>
                          </div>
                          <p className="mb-0 text-dark-emphasis" style={{ fontSize: '0.85rem' }}>
                            {n.message}
                          </p>
                        </div>
                      ))
                    )}
                  </div>
                  <div className="p-2 border-top text-center bg-light">
                    <button
                      onClick={() => setShowNotif(false)}
                      className="btn btn-sm btn-link text-decoration-none w-100"
                    >
                      Close Panel
                    </button>
                  </div>
                </div>
              )}
            </li>

            {/* User Profile Dropdown */}
            <li className="nav-item position-relative ms-2" ref={profileRef}>
              <button
                onClick={() => {
                  setShowProfile(!showProfile);
                  setShowNotif(false);
                }}
                className="btn btn-link p-0 border-0 d-flex align-items-center text-decoration-none gap-2"
                id="user-profile-dropdown-btn"
              >
                <img
                  src={user?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200"}
                  alt="Avatar"
                  className="avatar-img border border-primary border-2"
                  referrerPolicy="no-referrer"
                />
                <span className="d-none d-lg-inline text-dark-emphasis fw-medium" style={{ fontSize: '0.9rem' }}>
                  {user?.name || 'Administrator'}
                </span>
                <i className="bi bi-chevron-down d-none d-lg-inline text-muted fs-7"></i>
              </button>

              {showProfile && (
                <div
                  className="position-absolute end-0 mt-2 bg-body border rounded shadow-lg p-3"
                  style={{ width: '220px', zIndex: 1050 }}
                  id="user-profile-dropdown-menu"
                >
                  <div className="border-bottom pb-2 mb-2">
                    <h6 className="mb-0 fw-bold">{user?.name || 'Jay Swar'}</h6>
                    <small className="text-muted text-truncate d-block">{user?.email || 'admin@gmail.com'}</small>
                  </div>
                  <Link
                    to="/profile"
                    className="dropdown-item py-2 d-flex align-items-center gap-2"
                    onClick={() => setShowProfile(false)}
                  >
                    <i className="bi bi-person text-muted"></i> My Profile
                  </Link>
                  <Link
                    to="/settings"
                    className="dropdown-item py-2 d-flex align-items-center gap-2"
                    onClick={() => setShowProfile(false)}
                  >
                    <i className="bi bi-gear text-muted"></i> Account Settings
                  </Link>
                  <hr className="my-2" />
                  <button
                    onClick={handleLogout}
                    className="dropdown-item py-2 text-danger d-flex align-items-center gap-2 border-0 bg-transparent w-100 text-start"
                  >
                    <i className="bi bi-box-arrow-right"></i> Log Out
                  </button>
                </div>
              )}
            </li>
          </ul>
        </div>
      </nav>
    </header>
  );
}
