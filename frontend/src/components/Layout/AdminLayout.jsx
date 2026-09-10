import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { initTheme } from '../../features/theme/themeSlice';
import Sidebar from '../Sidebar/Sidebar';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';

export default function AdminLayout() {
  const dispatch = useDispatch();
  const location = useLocation();
  const { theme } = useSelector((state) => state.theme);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Initialize theme attribute on initial load
  useEffect(() => {
    dispatch(initTheme());
  }, [dispatch]);

  // Close mobile sidebar on route changes
  useEffect(() => {
    setMobileSidebarOpen(false);
  }, [location.pathname]);

  // Auto handle resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 992) {
        setMobileSidebarOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => {
    if (window.innerWidth < 992) {
      setMobileSidebarOpen((prev) => !prev);
    } else {
      setSidebarCollapsed((prev) => !prev);
    }
  };

  const closeMobileSidebar = () => {
    setMobileSidebarOpen(false);
  };

  return (
    <div
      id="main-wrapper"
      className={mobileSidebarOpen ? 'show-sidebar' : ''}
      data-theme={theme}
      data-bs-theme={theme}
      data-layout="vertical"
      data-navbarbg="skin6"
      data-sidebartype={sidebarCollapsed ? 'mini-sidebar' : 'full'}
      data-sidebar-position="fixed"
      data-header-position="fixed"
      data-boxed-layout="full"
    >
      {/* Top Header / Navbar */}
      <Header
        sidebarCollapsed={sidebarCollapsed}
        toggleSidebar={toggleSidebar}
        mobileSidebarOpen={mobileSidebarOpen}
      />

      {/* Mobile Backdrop Overlay */}
      {mobileSidebarOpen && (
        <div
          className="sidebar-backdrop d-lg-none"
          onClick={closeMobileSidebar}
          aria-label="Close Mobile Sidebar"
        ></div>
      )}

      {/* Sidebar Navigation */}
      <Sidebar
        sidebarCollapsed={sidebarCollapsed}
        mobileSidebarOpen={mobileSidebarOpen}
        closeMobileSidebar={closeMobileSidebar}
      />

      {/* Main page content wrapper */}
      <div className="page-wrapper" style={{ display: 'block' }}>
        {/* Dynamic page content container */}
        <div className="container-fluid">
          <Outlet />
        </div>

        {/* Global Footer */}
        <Footer />
      </div>
    </div>
  );
}
