import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import { updateProfile } from '../features/auth/authSlice';
import { toggleTheme } from '../features/theme/themeSlice';
import { useGetRolesQuery, useGetDepartmentsQuery } from '../app/api';
import Alert from '../components/Common/Alert';

const AVATAR_PRESETS = [
  { id: 'p1', name: 'Alisha (Preset)', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200' },
  { id: 'p2', name: 'Ryan (Preset)', url: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=200' },
  { id: 'p3', name: 'Grace (Preset)', url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200' },
  { id: 'p4', name: 'Miller (Preset)', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200' },
  { id: 'p5', name: 'Emma (Preset)', url: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=200' },
  { id: 'p6', name: 'David (Preset)', url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200' }
];

export default function Profile() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { theme } = useSelector((state) => state.theme);

  // Queries for roles and depts
  const { data: dbRoles = [] } = useGetRolesQuery();
  const { data: dbDepts = [] } = useGetDepartmentsQuery();

  // Active tab state
  const [activeTab, setActiveTab] = useState('basic');

  // Alert message system
  const [alertConfig, setAlertConfig] = useState({ show: false, message: '', type: 'success' });

  // Drag and drop uploading state
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  // Fallback lists if API data is loading or empty
  const availableRoles = dbRoles.length > 0 
    ? dbRoles.filter(r => r.status).map(r => r.title)
    : ['Admin', 'Manager', 'Developer', 'Designer', 'Support'];

  const availableDepts = dbDepts.length > 0
    ? dbDepts.filter(d => d.status).map(d => d.title)
    : ['Technology', 'Marketing', 'Customer Success', 'Design', 'Human Resources', 'Finance'];

  // React Hook Form for Basic Info
  const {
    register: registerBasic,
    handleSubmit: handleSubmitBasic,
    reset: resetBasic,
    formState: { errors: basicErrors, isDirty: isBasicDirty }
  } = useForm({
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      role: user?.role || 'Admin',
      department: user?.department || 'Technology',
      bio: user?.bio || ''
    }
  });

  // React Hook Form for Security / Password
  const {
    register: registerSec,
    handleSubmit: handleSubmitSec,
    reset: resetSec,
    formState: { errors: secErrors }
  } = useForm({
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    }
  });

  // Keep form in sync if Redux user updates
  useEffect(() => {
    if (user) {
      resetBasic({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        role: user.role || 'Admin',
        department: user.department || 'Technology',
        bio: user.bio || ''
      });
    }
  }, [user, resetBasic]);

  // Helper helper to display alerts
  const triggerAlert = (message, type = 'success') => {
    setAlertConfig({ show: true, message, type });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Profile completion meter calculation
  const calculateCompletion = () => {
    let score = 0;
    if (user?.name) score += 15;
    if (user?.email) score += 15;
    if (user?.phone) score += 15;
    if (user?.bio) score += 15;
    if (user?.department) score += 15;
    if (user?.role) score += 15;
    if (user?.avatar) score += 10;
    return score;
  };

  const completionPercent = calculateCompletion();

  // Basic info form submit handler
  const onBasicSubmit = (data) => {
    dispatch(updateProfile(data));
    triggerAlert('Basic profile information updated successfully!', 'success');
  };

  // Password / Security submit handler
  const onSecSubmit = (data) => {
    // Simulated validation
    if (data.currentPassword !== 'admin123') {
      triggerAlert('Incorrect current password! Standard user current password is "admin123".', 'danger');
      return;
    }
    if (data.newPassword !== data.confirmPassword) {
      triggerAlert('New password and password confirmation do not match!', 'danger');
      return;
    }
    
    triggerAlert('Security credentials and password updated successfully!', 'success');
    resetSec({ currentPassword: '', newPassword: '', confirmPassword: '' });
  };

  // Theme preferences toggle
  const handleToggleTheme = () => {
    dispatch(toggleTheme());
    triggerAlert(`System visual preference changed to ${theme === 'light' ? 'Dark' : 'Light'} Mode.`, 'info');
  };

  // Presets avatar picker
  const handleSelectPreset = (url) => {
    dispatch(updateProfile({ avatar: url }));
    triggerAlert('Profile avatar changed to selected preset.', 'success');
  };

  // File loading function (base64 conversions)
  const processImageFile = (file) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      triggerAlert('Please drop or select a valid image file (PNG/JPEG/GIF).', 'danger');
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      triggerAlert('Image size exceeds 2MB limit. Please choose a smaller file.', 'warning');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const base64Url = e.target.result;
      dispatch(updateProfile({ avatar: base64Url }));
      triggerAlert('Custom profile photo uploaded and configured successfully!', 'success');
    };
    reader.readAsDataURL(file);
  };

  // Drag and drop event handling
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processImageFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInputChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      processImageFile(e.target.files[0]);
    }
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="fade-in pb-5">
      {/* Header and title */}
      <div className="d-flex justify-content-between align-items-center mb-4 mt-2">
        <div>
          <h4 className="mb-1 text-dark-emphasis fw-bold">My Profile Workspace</h4>
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb mb-0" style={{ fontSize: '0.85rem' }}>
              <li className="breadcrumb-item">
                <span className="text-primary text-decoration-none">Home</span>
              </li>
              <li className="breadcrumb-item active" aria-current="page">Profile</li>
            </ol>
          </nav>
        </div>
      </div>

      {/* Dynamic alerts */}
      {alertConfig.show && (
        <div className="mb-4">
          <Alert 
            type={alertConfig.type} 
            message={alertConfig.message} 
            dismissible 
            icon={true}
            onClose={() => setAlertConfig(prev => ({ ...prev, show: false }))} 
          />
        </div>
      )}

      {/* Main Layout Grid */}
      <div className="row g-4">
        {/* Left Card Column: Profile Overview Card */}
        <div className="col-12 col-lg-4">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-body p-4 d-flex flex-column align-items-center text-center">
              {/* Profile Avatar Frame with interactive hover/upload layer */}
              <div 
                className={`position-relative mb-3 rounded-circle border border-3 border-primary p-1 cursor-pointer transition-all ${isDragging ? 'bg-primary-subtle scale-105 border-dashed' : ''}`}
                style={{ width: '130px', height: '130px', transition: 'all 0.2s' }}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={triggerFileInput}
                title="Click or drag an image to change profile photo"
              >
                <img
                  src={user?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200"}
                  alt="Profile"
                  className="w-100 h-100 rounded-circle object-fit-cover"
                  referrerPolicy="no-referrer"
                />
                
                {/* Upload action overlay */}
                <div 
                  className="position-absolute top-0 start-0 w-100 h-100 rounded-circle bg-dark bg-opacity-50 d-flex flex-column align-items-center justify-content-center text-white opacity-0 hover-opacity-100 transition-opacity"
                  style={{ fontSize: '0.75rem' }}
                >
                  <i className="bi bi-camera-fill fs-4 mb-1"></i>
                  <span>Upload Photo</span>
                  <span className="text-white-50" style={{ fontSize: '0.6rem' }}>or Drop Here</span>
                </div>

                {/* Hidden File Input */}
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileInputChange} 
                  accept="image/*" 
                  className="d-none" 
                />
              </div>

              {/* Username & Title Details */}
              <h5 className="fw-bold mb-1 text-dark-emphasis">{user?.name || 'Jay Swar'}</h5>
              <div className="badge bg-primary-subtle text-primary mb-2 px-3 py-1.5 rounded-pill" style={{ fontSize: '0.75rem', fontWeight: '600' }}>
                {user?.role || 'Admin'}
              </div>
              <p className="text-muted mb-3" style={{ fontSize: '0.8rem' }}>
                <i className="bi bi-building me-1"></i>
                {user?.department || 'Technology Department'}
              </p>

              {/* Bio block */}
              <div className="bg-light w-100 rounded p-3 mb-4 text-start border" style={{ minHeight: '80px' }}>
                <small className="text-uppercase text-muted fw-bold d-block mb-1" style={{ fontSize: '0.65rem', letterSpacing: '0.05em' }}>
                  Professional Bio
                </small>
                <p className="mb-0 text-dark-emphasis text-sm" style={{ fontSize: '0.8rem', lineHeight: '1.4' }}>
                  {user?.bio || 'No professional biography specified yet. Click on edit details to add standard bio notes.'}
                </p>
              </div>

              {/* Progress Completion Bar */}
              <div className="w-100 text-start mt-auto pt-3 border-top">
                <div className="d-flex justify-content-between align-items-center mb-1">
                  <span className="text-muted fw-medium" style={{ fontSize: '0.75rem' }}>Profile Completeness</span>
                  <span className="fw-bold text-primary" style={{ fontSize: '0.75rem' }}>{completionPercent}%</span>
                </div>
                <div className="progress" style={{ height: '8px' }}>
                  <div 
                    className="progress-bar progress-bar-striped progress-bar-animated bg-success" 
                    role="progressbar" 
                    style={{ width: `${completionPercent}%` }} 
                    aria-valuenow={completionPercent} 
                    aria-valuemin="0" 
                    aria-valuemax="100"
                  ></div>
                </div>
                <small className="text-muted d-block mt-1.5" style={{ fontSize: '0.7rem' }}>
                  Fill out all details, custom bios, and avatars to reach 100% database standard completion.
                </small>
              </div>
            </div>
          </div>
        </div>

        {/* Right Settings Tabs Content column */}
        <div className="col-12 col-lg-8">
          <div className="card shadow-sm border-0 h-100">
            {/* Modular Card Tabs Header */}
            <div className="card-header bg-white border-bottom p-0">
              <ul className="nav nav-tabs border-0 flex-nowrap" id="profileTab" role="tablist">
                <li className="nav-item flex-fill text-center" role="presentation">
                  <button
                    className={`nav-link border-0 border-bottom border-3 py-3 w-100 fw-bold d-flex align-items-center justify-content-center gap-2 ${activeTab === 'basic' ? 'border-primary text-primary bg-light-subtle' : 'border-transparent text-muted bg-white'}`}
                    onClick={() => setActiveTab('basic')}
                    style={{ fontSize: '0.9rem' }}
                    type="button"
                  >
                    <i className="bi bi-person-lines-fill"></i>
                    <span>Basic Details</span>
                  </button>
                </li>
                <li className="nav-item flex-fill text-center" role="presentation">
                  <button
                    className={`nav-link border-0 border-bottom border-3 py-3 w-100 fw-bold d-flex align-items-center justify-content-center gap-2 ${activeTab === 'security' ? 'border-primary text-primary bg-light-subtle' : 'border-transparent text-muted bg-white'}`}
                    onClick={() => setActiveTab('security')}
                    style={{ fontSize: '0.9rem' }}
                    type="button"
                  >
                    <i className="bi bi-shield-lock"></i>
                    <span>Security & Password</span>
                  </button>
                </li>
                <li className="nav-item flex-fill text-center" role="presentation">
                  <button
                    className={`nav-link border-0 border-bottom border-3 py-3 w-100 fw-bold d-flex align-items-center justify-content-center gap-2 ${activeTab === 'preferences' ? 'border-primary text-primary bg-light-subtle' : 'border-transparent text-muted bg-white'}`}
                    onClick={() => setActiveTab('preferences')}
                    style={{ fontSize: '0.9rem' }}
                    type="button"
                  >
                    <i className="bi bi-palette"></i>
                    <span>System Preferences</span>
                  </button>
                </li>
              </ul>
            </div>

            {/* Active Tab Body */}
            <div className="card-body p-4">
              {/* TAB 1: BASIC INFORMATION DETAILS */}
              {activeTab === 'basic' && (
                <form onSubmit={handleSubmitBasic(onBasicSubmit)}>
                  <h5 className="fw-bold mb-1 text-dark-emphasis text-lg">Update Profile Information</h5>
                  <p className="text-muted mb-4 text-sm">Modify your core account credentials. Changes are propagated in real-time.</p>
                  
                  <div className="row g-3">
                    {/* Full Name */}
                    <div className="col-12 col-md-6">
                      <label className="form-label text-dark-emphasis fw-medium" style={{ fontSize: '0.8rem' }}>
                        Full Name <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        className={`form-control py-2 ${basicErrors.name ? 'is-invalid' : ''}`}
                        placeholder="John Doe"
                        {...registerBasic('name', { 
                          required: 'Name is strictly required',
                          minLength: { value: 2, message: 'Name must have at least 2 characters' }
                        })}
                      />
                      {basicErrors.name && (
                        <div className="invalid-feedback">{basicErrors.name.message}</div>
                      )}
                    </div>

                    {/* Email ID */}
                    <div className="col-12 col-md-6">
                      <label className="form-label text-dark-emphasis fw-medium" style={{ fontSize: '0.8rem' }}>
                        Email Address <span className="text-danger">*</span>
                      </label>
                      <input
                        type="email"
                        className={`form-control py-2 ${basicErrors.email ? 'is-invalid' : ''}`}
                        placeholder="john.doe@government.in"
                        {...registerBasic('email', { 
                          required: 'Email address is required',
                          pattern: { 
                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, 
                            message: 'Invalid email format' 
                          }
                        })}
                      />
                      {basicErrors.email && (
                        <div className="invalid-feedback">{basicErrors.email.message}</div>
                      )}
                    </div>

                    {/* Phone Number */}
                    <div className="col-12 col-md-6">
                      <label className="form-label text-dark-emphasis fw-medium" style={{ fontSize: '0.8rem' }}>
                        Contact Number
                      </label>
                      <input
                        type="tel"
                        className="form-control py-2"
                        placeholder="+91 98765 43210"
                        {...registerBasic('phone')}
                      />
                    </div>

                    {/* System Security Role */}
                    <div className="col-12 col-md-6">
                      <label className="form-label text-dark-emphasis fw-medium" style={{ fontSize: '0.8rem' }}>
                        System Role
                      </label>
                      <select 
                        className="form-select py-2"
                        {...registerBasic('role')}
                      >
                        {availableRoles.map(roleOpt => (
                          <option key={roleOpt} value={roleOpt}>{roleOpt} Role</option>
                        ))}
                      </select>
                      <small className="text-muted d-block mt-1" style={{ fontSize: '0.7rem' }}>
                        Role changes update access controls globally.
                      </small>
                    </div>

                    {/* Department */}
                    <div className="col-12">
                      <label className="form-label text-dark-emphasis fw-medium" style={{ fontSize: '0.8rem' }}>
                        Assigned Department Directory
                      </label>
                      <select 
                        className="form-select py-2"
                        {...registerBasic('department')}
                      >
                        {availableDepts.map(deptOpt => (
                          <option key={deptOpt} value={deptOpt}>{deptOpt}</option>
                        ))}
                      </select>
                    </div>

                    {/* Professional Description */}
                    <div className="col-12">
                      <label className="form-label text-dark-emphasis fw-medium" style={{ fontSize: '0.8rem' }}>
                        Biography & Notes
                      </label>
                      <textarea
                        rows="3"
                        className={`form-control ${basicErrors.bio ? 'is-invalid' : ''}`}
                        placeholder="Tell us about yourself and your professional roles..."
                        {...registerBasic('bio', {
                          maxLength: { value: 250, message: 'Bio cannot exceed 250 characters' }
                        })}
                      ></textarea>
                      <div className="d-flex justify-content-between mt-1">
                        <small className="text-muted" style={{ fontSize: '0.7rem' }}>
                          Describe your organizational background.
                        </small>
                        {basicErrors.bio && (
                          <div className="text-danger" style={{ fontSize: '0.75rem' }}>{basicErrors.bio.message}</div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Preset Avatar Gallery Selection */}
                  <div className="mt-4 pt-3 border-top">
                    <h6 className="fw-semibold text-dark-emphasis mb-2" style={{ fontSize: '0.85rem' }}>
                      Or choose a premium preset avatar:
                    </h6>
                    <div className="d-flex flex-wrap gap-2.5">
                      {AVATAR_PRESETS.map((p) => {
                        const isSelected = user?.avatar === p.url;
                        return (
                          <button
                            key={p.id}
                            type="button"
                            className={`btn p-0.5 rounded-circle border-2 transition-all d-flex align-items-center justify-content-center ${isSelected ? 'border-primary bg-primary-subtle scale-105' : 'border-transparent hover:scale-105'}`}
                            onClick={() => handleSelectPreset(p.url)}
                            title={p.name}
                          >
                            <img
                              src={p.url}
                              alt={p.name}
                              className="rounded-circle object-fit-cover"
                              style={{ width: '42px', height: '42px' }}
                              referrerPolicy="no-referrer"
                            />
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Submit Actions */}
                  <div className="mt-4 pt-3 border-top d-flex gap-2 justify-content-end">
                    <button
                      type="button"
                      className="btn btn-light border px-4"
                      onClick={() => resetBasic()}
                      disabled={!isBasicDirty}
                      style={{ fontSize: '0.85rem' }}
                    >
                      Reset Form
                    </button>
                    <button
                      type="submit"
                      className="btn btn-primary px-4 fw-medium d-flex align-items-center gap-1.5"
                      style={{ fontSize: '0.85rem' }}
                    >
                      <i className="bi bi-save"></i>
                      <span>Save Changes</span>
                    </button>
                  </div>
                </form>
              )}

              {/* TAB 2: SECURITY & CREDENTIALS UPDATE */}
              {activeTab === 'security' && (
                <form onSubmit={handleSubmitSec(onSecSubmit)}>
                  <h5 className="fw-bold mb-1 text-dark-emphasis text-lg">Change Portal Password</h5>
                  <p className="text-muted mb-4 text-sm">Update password credentials to maintain strict system compliance access.</p>

                  <div className="row g-3">
                    {/* Current Password */}
                    <div className="col-12">
                      <label className="form-label text-dark-emphasis fw-medium" style={{ fontSize: '0.8rem' }}>
                        Current Password <span className="text-danger">*</span>
                      </label>
                      <input
                        type="password"
                        className={`form-control py-2 ${secErrors.currentPassword ? 'is-invalid' : ''}`}
                        placeholder="••••••••"
                        {...registerSec('currentPassword', { 
                          required: 'Current security password is required' 
                        })}
                      />
                      {secErrors.currentPassword ? (
                        <div className="invalid-feedback">{secErrors.currentPassword.message}</div>
                      ) : (
                        <small className="text-muted d-block mt-1" style={{ fontSize: '0.7rem' }}>
                          Standard user current default login password is <code className="text-danger bg-light py-0.5 px-1.5 rounded border">admin123</code>.
                        </small>
                      )}
                    </div>

                    {/* New Password */}
                    <div className="col-12 col-md-6">
                      <label className="form-label text-dark-emphasis fw-medium" style={{ fontSize: '0.8rem' }}>
                        New Password <span className="text-danger">*</span>
                      </label>
                      <input
                        type="password"
                        className={`form-control py-2 ${secErrors.newPassword ? 'is-invalid' : ''}`}
                        placeholder="••••••••"
                        {...registerSec('newPassword', { 
                          required: 'New password is required',
                          minLength: { value: 6, message: 'Password must be at least 6 characters' }
                        })}
                      />
                      {secErrors.newPassword && (
                        <div className="invalid-feedback">{secErrors.newPassword.message}</div>
                      )}
                    </div>

                    {/* Confirm New Password */}
                    <div className="col-12 col-md-6">
                      <label className="form-label text-dark-emphasis fw-medium" style={{ fontSize: '0.8rem' }}>
                        Confirm New Password <span className="text-danger">*</span>
                      </label>
                      <input
                        type="password"
                        className={`form-control py-2 ${secErrors.confirmPassword ? 'is-invalid' : ''}`}
                        placeholder="••••••••"
                        {...registerSec('confirmPassword', { 
                          required: 'Password confirmation is required'
                        })}
                      />
                      {secErrors.confirmPassword && (
                        <div className="invalid-feedback">{secErrors.confirmPassword.message}</div>
                      )}
                    </div>
                  </div>

                  {/* Password Safety warning banner */}
                  <div className="alert alert-warning border-0 rounded p-3 mt-4" style={{ fontSize: '0.8rem' }}>
                    <div className="d-flex align-items-start gap-2.5">
                      <i className="bi bi-shield-fill-exclamation fs-5 text-warning"></i>
                      <div>
                        <strong className="text-dark-emphasis d-block mb-1">Access Precaution Policy</strong>
                        <p className="mb-0 text-muted" style={{ fontSize: '0.75rem', lineHeight: '1.4' }}>
                          Changing password values affects API token authorization immediately. Be sure to note down your new password string to prevent locking out of current portal environments.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Password Actions */}
                  <div className="mt-4 pt-3 border-top d-flex justify-content-end gap-2">
                    <button
                      type="button"
                      className="btn btn-light border px-4"
                      onClick={() => resetSec({ currentPassword: '', newPassword: '', confirmPassword: '' })}
                      style={{ fontSize: '0.85rem' }}
                    >
                      Clear Fields
                    </button>
                    <button
                      type="submit"
                      className="btn btn-danger px-4 fw-medium d-flex align-items-center gap-1.5"
                      style={{ fontSize: '0.85rem' }}
                    >
                      <i className="bi bi-key-fill"></i>
                      <span>Update Password</span>
                    </button>
                  </div>
                </form>
              )}

              {/* TAB 3: SYSTEM PREFERENCES */}
              {activeTab === 'preferences' && (
                <div>
                  <h5 className="fw-bold mb-1 text-dark-emphasis text-lg">System Preferences</h5>
                  <p className="text-muted mb-4 text-sm">Configure system preferences, color profiles, and visual parameters.</p>

                  <div className="list-group list-group-flush border rounded overflow-hidden">
                    {/* Theme toggler row */}
                    <div className="list-group-item p-3 d-flex justify-content-between align-items-center">
                      <div>
                        <h6 className="mb-1 fw-bold text-dark-emphasis" style={{ fontSize: '0.85rem' }}>System Display Theme</h6>
                        <p className="text-muted mb-0" style={{ fontSize: '0.75rem' }}>
                          Toggle between dark cosmic slate and light editorial white profiles.
                        </p>
                      </div>
                      <div className="form-check form-switch">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          role="switch"
                          id="themeToggleSwitch"
                          checked={theme === 'dark'}
                          onChange={handleToggleTheme}
                          style={{ width: '46px', height: '24px', cursor: 'pointer' }}
                        />
                        <label className="form-check-label ms-2 fw-medium text-dark-emphasis" htmlFor="themeToggleSwitch" style={{ fontSize: '0.85rem' }}>
                          {theme === 'dark' ? 'Dark Mode' : 'Light Mode'}
                        </label>
                      </div>
                    </div>

                    {/* Email alert alerts row */}
                    <div className="list-group-item p-3 d-flex justify-content-between align-items-center">
                      <div>
                        <h6 className="mb-1 fw-bold text-dark-emphasis" style={{ fontSize: '0.85rem' }}>Email Notifications</h6>
                        <p className="text-muted mb-0" style={{ fontSize: '0.75rem' }}>
                          Receive automated alerts upon scheme submission or roles modifications.
                        </p>
                      </div>
                      <div className="form-check form-switch">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          role="switch"
                          id="notifSwitch"
                          defaultChecked
                          style={{ width: '46px', height: '24px', cursor: 'pointer' }}
                        />
                      </div>
                    </div>

                    {/* Daily reports digest toggler row */}
                    <div className="list-group-item p-3 d-flex justify-content-between align-items-center">
                      <div>
                        <h6 className="mb-1 fw-bold text-dark-emphasis" style={{ fontSize: '0.85rem' }}>Weekly Digest Summaries</h6>
                        <p className="text-muted mb-0" style={{ fontSize: '0.75rem' }}>
                          Receive aggregated analytics on registered nodal ministries data activities.
                        </p>
                      </div>
                      <div className="form-check form-switch">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          role="switch"
                          id="digestSwitch"
                          style={{ width: '46px', height: '24px', cursor: 'pointer' }}
                        />
                      </div>
                    </div>

                    {/* Localization settings list item */}
                    <div className="list-group-item p-3">
                      <div className="row g-3 align-items-center">
                        <div className="col-12 col-md-8">
                          <h6 className="mb-1 fw-bold text-dark-emphasis" style={{ fontSize: '0.85rem' }}>Preferred Portal Language</h6>
                          <p className="text-muted mb-0" style={{ fontSize: '0.75rem' }}>
                            Configure default language formatting parameters for scheme form registries.
                          </p>
                        </div>
                        <div className="col-12 col-md-4">
                          <select className="form-select form-select-sm" defaultValue="en">
                            <option value="en">English (India)</option>
                            <option value="hi">Hindi (हिन्दी)</option>
                            <option value="mr">Marathi (मराठी)</option>
                            <option value="ta">Tamil (தமிழ்)</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Preference status footer info banner */}
                  <div className="mt-4 p-3 bg-light border rounded text-muted" style={{ fontSize: '0.75rem', lineHeight: '1.4' }}>
                    <i className="bi bi-info-circle-fill text-primary me-2"></i>
                    Preference settings are linked directly to client-side localStorage and synced on launch automatically.
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
