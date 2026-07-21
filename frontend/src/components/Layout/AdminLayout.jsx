import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { initTheme } from '../../features/theme/themeSlice';
import Sidebar from '../Sidebar/Sidebar';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';

export default function AdminLayout() {
  const dispatch = useDispatch();
  const { theme } = useSelector((state) => state.theme);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Initialize theme attribute on initial load
  useEffect(() => {
    dispatch(initTheme());
  }, [dispatch]);

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  return (
    <div
      id="main-wrapper"
      data-theme={theme}
      data-layout="vertical"
      data-navbarbg="skin6"
      data-sidebartype={sidebarCollapsed ? 'mini-sidebar' : 'full'}
      data-sidebar-position="fixed"
      data-header-position="fixed"
      data-boxed-layout="full"
    >
      {/* Top Header / Navbar */}
      <Header sidebarCollapsed={sidebarCollapsed} toggleSidebar={toggleSidebar} />

      {/* Sidebar Navigation */}
      <Sidebar />

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
