import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './app/store';

// Layout & Route Guards
import AdminLayout from './components/Layout/AdminLayout';
import ProtectedRoute from './components/Common/ProtectedRoute';
import PublicRoute from './components/Common/PublicRoute';

// Pages
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Users from './pages/Users';
import NewScheme from './pages/NewScheme';
import Profile from './pages/Profile';
import Settings from './pages/Settings';

export default function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          {/* Public Authentication Routing */}
          <Route
            path="/login"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />

          {/* Protected Panel Layout & Inner Content routing */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            {/* Index redirection */}
            <Route index element={<Navigate to="/dashboard" replace />} />
            
            {/* Application modules */}
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="users" element={<Users />} />
            <Route path="scheme" element={<NewScheme />} />
            <Route path="profile" element={<Profile />} />
            <Route path="settings" element={<Settings />} />
          </Route>

          {/* Fallback Catch */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </Provider>
  );
}
