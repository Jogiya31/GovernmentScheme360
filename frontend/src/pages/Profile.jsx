import { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import { updateProfile } from '../features/auth/authSlice';
import {
  toggleTheme,
  setColorPreset,
  setSidebarSkin,
  resetThemeSettings,
} from '../features/theme/themeSlice';
import { THEME_TEMPLATES, SIDEBAR_SKINS } from '../features/theme/themePresets';
import Alert from '../components/common/Alert';
import { api } from '../app/api';

export default function Profile() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const { theme, colorPreset, sidebarSkin } = useSelector((state) => state.theme);
  const [activeTab, setActiveTab] = useState('basic');
  const [isDragging, setIsDragging] = useState(false);
  const [alertConfig, setAlertConfig] = useState({ show: false, type: 'success', message: '' });
  const [emailNotifications, setEmailNotifications] = useState(user?.emailNotifications ?? true);
  const [weeklyDigest, setWeeklyDigest] = useState(user?.weeklyDigest ?? true);
  const [preferredLanguage, setPreferredLanguage] = useState(user?.preferredLanguage || 'en');
  const [avatar, setAvatar] = useState(user?.avatar || '');
  const fileInputRef = useRef(null);

  const [updateProfileRequest, { isLoading: isSavingProfile }] = api.useUpdateProfileMutation();
  const [changePasswordRequest] = api.useChangePasswordMutation();
  const [updatePreferencesRequest] = api.useUpdatePreferencesMutation();

  const {
    register: registerBasic,
    handleSubmit: handleSubmitBasic,
    reset: resetBasic,
    formState: { errors: basicErrors, isDirty: isBasicDirty },
  } = useForm({
    defaultValues: { name: user?.name || '', email: user?.email || '', phone: user?.phone || '' },
  });

  const {
    register: registerSec,
    handleSubmit: handleSubmitSec,
    reset: resetSec,
    formState: { errors: secErrors },
  } = useForm();

  useEffect(() => {
    resetBasic({ name: user?.name || '', email: user?.email || '', phone: user?.phone || '' });
    setAvatar(user?.avatar || '');
    setEmailNotifications(user?.emailNotifications ?? true);
    setWeeklyDigest(user?.weeklyDigest ?? true);
    setPreferredLanguage(user?.preferredLanguage || 'en');
  }, [user, resetBasic]);

  const showAlert = (type, message) => setAlertConfig({ show: true, type, message });
  const getErrorMessage = (error, fallback) => error?.data?.message || error?.data?.StatusMessage || fallback;
  const readAvatar = (file) => {
    if (!file || !file.type.startsWith('image/')) return showAlert('danger', 'Please select a valid image file.');
    if (file.size > 2 * 1024 * 1024) return showAlert('danger', 'Profile images must be smaller than 2 MB.');
    const reader = new FileReader();
    reader.onload = () => setAvatar(reader.result);
    reader.readAsDataURL(file);
  };
  const handleFileInputChange = (event) => readAvatar(event.target.files?.[0]);
  const handleDragOver = (event) => { event.preventDefault(); setIsDragging(true); };
  const handleDragLeave = () => setIsDragging(false);
  const handleDrop = (event) => { event.preventDefault(); setIsDragging(false); readAvatar(event.dataTransfer.files?.[0]); };
  const triggerFileInput = () => fileInputRef.current?.click();

  const onBasicSubmit = async (values) => {
    const userId = user?.id ?? user?.userId;
    try {
      const result = await updateProfileRequest({ ...values, avatar, userId }).unwrap();
      dispatch(updateProfile({ ...values, avatar }));
      showAlert('success', result.message || 'Profile updated successfully.');
      resetBasic(values);
    } catch (error) {
      showAlert('danger', getErrorMessage(error, 'Unable to update your profile.'));
    }
  };

  const onSecSubmit = async (values) => {
    console.log('Submitting password change:', values);
    const userId = user?.id ?? user?.userId;
    if (values.newPassword !== values.confirmPassword) return showAlert('danger', 'New password and confirmation do not match.');
    try {
      const result = await changePasswordRequest({ ...values, userId}).unwrap();
      showAlert('success', result.message || 'Password updated successfully.');
      resetSec();
    } catch (error) {
      showAlert('danger', getErrorMessage(error, 'Unable to update your password.'));
    }
  };

  const savePreferences = async (changes) => {
    const preferences = { theme, colorPreset, sidebarSkin, emailNotifications, weeklyDigest, preferredLanguage, ...changes };
    try {
      await updatePreferencesRequest(preferences).unwrap();
      dispatch(updateProfile(preferences));
      showAlert('success', 'Preferences saved successfully.');
    } catch (error) {
      showAlert('danger', getErrorMessage(error, 'Unable to save preferences.'));
    }
  };
  
  const handleToggleTheme = () => { const nextTheme = theme === 'light' ? 'dark' : 'light'; dispatch(toggleTheme()); savePreferences({ theme: nextTheme }); };
  const handleSelectPresetTheme = (preset) => { dispatch(setColorPreset(preset)); savePreferences({ colorPreset: preset }); };
  const handleSelectSidebarSkin = (skin) => { dispatch(setSidebarSkin(skin)); savePreferences({ sidebarSkin: skin }); };
  const handleResetAllTheme = () => { dispatch(resetThemeSettings()); savePreferences({ theme: 'light', colorPreset: 'indigo', sidebarSkin: 'light' }); };

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
              <li className="breadcrumb-item active" aria-current="page">
                Profile
              </li>
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
            onClose={() => setAlertConfig((prev) => ({ ...prev, show: false }))}
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
                  src={
                    avatar || user?.avatar ||
                    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200'
                  }
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
                  <span className="text-white-50" style={{ fontSize: '0.6rem' }}>
                    or Drop Here
                  </span>
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
              <div
                className="badge bg-primary-subtle text-primary mb-2 px-3 py-1.5 rounded-pill"
                style={{ fontSize: '0.75rem', fontWeight: '600' }}
              >
                {user?.role || 'Admin'}
              </div>
              <p className="text-muted mb-3" style={{ fontSize: '0.8rem' }}>
                <i className="bi bi-building me-1"></i>
                {user?.department || 'Technology Department'}
              </p>

              {/* Bio block */}
              <div
                className="bg-light w-100 rounded p-3 mb-4 text-start border"
                style={{ minHeight: '80px' }}
              >
                <small
                  className="text-uppercase text-muted fw-bold d-block mb-1"
                  style={{ fontSize: '0.65rem', letterSpacing: '0.05em' }}
                >
                  Professional Bio
                </small>
                <p
                  className="mb-0 text-dark-emphasis text-sm"
                  style={{ fontSize: '0.8rem', lineHeight: '1.4' }}
                >
                  {user?.bio ||
                    'No professional biography specified yet. Click on edit details to add standard bio notes.'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Settings Tabs Content column */}
        <div className="col-12 col-lg-8">
          <div className="card shadow-sm border-0 h-100">
            {/* Modular Card Tabs Header */}
            <div className="card-header bg-white border-bottom p-0">
              <ul className="nav nav-tabs border-0 flex-nowrap overflow-x-auto" id="profileTab" role="tablist" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
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
                  <h5 className="fw-bold mb-1 text-dark-emphasis text-lg">
                    Update Profile Information
                  </h5>
                  <p className="text-muted mb-4 text-sm">
                    Modify your core account credentials. Changes are propagated in real-time.
                  </p>

                  <div className="row g-3">
                    {/* Full Name */}
                    <div className="col-12 col-md-6">
                      <label
                        className="form-label text-dark-emphasis fw-medium"
                        style={{ fontSize: '0.8rem' }}
                      >
                        Full Name <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        className={`form-control py-2 ${basicErrors.name ? 'is-invalid' : ''}`}
                        placeholder="John Doe"
                        {...registerBasic('name', {
                          required: 'Name is strictly required',
                          minLength: { value: 2, message: 'Name must have at least 2 characters' },
                        })}
                      />
                      {basicErrors.name && (
                        <div className="invalid-feedback">{basicErrors.name.message}</div>
                      )}
                    </div>

                    {/* Email ID */}
                    <div className="col-12 col-md-6">
                      <label
                        className="form-label text-dark-emphasis fw-medium"
                        style={{ fontSize: '0.8rem' }}
                      >
                        Email Address <span className="text-danger">*</span>
                      </label>
                      <input
                        type="email"
                        className={`form-control py-2 ${basicErrors.email ? 'is-invalid' : ''}`}
                        placeholder="example@nic.in"
                        {...registerBasic('email', {
                          required: 'Email address is required',
                          pattern: {
                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                            message: 'Invalid email format',
                          },
                        })}
                      />
                      {basicErrors.email && (
                        <div className="invalid-feedback">{basicErrors.email.message}</div>
                      )}
                    </div>

                    {/* Phone Number */}
                    <div className="col-12 col-md-6">
                      <label
                        className="form-label text-dark-emphasis fw-medium"
                        style={{ fontSize: '0.8rem' }}
                      >
                        Contact Number
                      </label>
                      <input
                        type="tel"
                        className="form-control py-2"
                        placeholder="+91 98765 43210"
                        {...registerBasic('phone')}
                      />
                    </div>

                    {/* Avatar URL */}
                    <div className="col-12 col-md-6">
                      <label
                        className="form-label text-dark-emphasis fw-medium"
                        style={{ fontSize: '0.8rem' }}
                      >
                        Avatar URL
                      </label>
                      <input
                        type="file"
                        className="form-control py-2"
                        onChange={handleFileInputChange}
                        accept="image/*"
                      />
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
                      disabled={isSavingProfile}
                      style={{ fontSize: '0.85rem' }}
                    >
                      <i className="bi bi-save me-1"></i>
                      <span>Save Changes</span>
                    </button>
                  </div>
                </form>
              )}

              {/* TAB 2: SECURITY & CREDENTIALS UPDATE */}
              {activeTab === 'security' && (
                <form onSubmit={handleSubmitSec(onSecSubmit)}>
                  <h5 className="fw-bold mb-1 text-dark-emphasis text-lg">
                    Change Portal Password
                  </h5>
                  <p className="text-muted mb-4 text-sm">
                    Update password credentials to maintain strict system compliance access.
                  </p>

                  <div className="row g-3">
                
                    {/* New Password */}
                    <div className="col-12 col-md-6">
                      <label
                        className="form-label text-dark-emphasis fw-medium"
                        style={{ fontSize: '0.8rem' }}
                      >
                        New Password <span className="text-danger">*</span>
                      </label>
                      <input
                        type="password"
                        className={`form-control py-2 ${secErrors.newPassword ? 'is-invalid' : ''}`}
                        placeholder="••••••••"
                        {...registerSec('newPassword', {
                          required: 'New password is required',
                          minLength: {
                            value: 6,
                            message: 'Password must be at least 6 characters',
                          },
                        })}
                      />
                      {secErrors.newPassword && (
                        <div className="invalid-feedback">{secErrors.newPassword.message}</div>
                      )}
                    </div>

                    {/* Confirm New Password */}
                    <div className="col-12 col-md-6">
                      <label
                        className="form-label text-dark-emphasis fw-medium"
                        style={{ fontSize: '0.8rem' }}
                      >
                        Confirm New Password <span className="text-danger">*</span>
                      </label>
                      <input
                        type="password"
                        className={`form-control py-2 ${secErrors.confirmPassword ? 'is-invalid' : ''}`}
                        placeholder="••••••••"
                        {...registerSec('confirmPassword', {
                          required: 'Password confirmation is required',
                        })}
                      />
                      {secErrors.confirmPassword && (
                        <div className="invalid-feedback">{secErrors.confirmPassword.message}</div>
                      )}
                    </div>
                  </div>

                  {/* Password Safety warning banner */}
                  <div
                    className="alert alert-warning border-0 rounded p-3 mt-4"
                    style={{ fontSize: '0.8rem' }}
                  >
                    <div className="d-flex align-items-start gap-2.5">
                      <i className="bi bi-shield-fill-exclamation fs-5 text-warning"></i>
                      <div>
                        <strong className="text-dark-emphasis d-block mb-1">
                          Access Precaution Policy
                        </strong>
                        <p
                          className="mb-0 text-muted"
                          style={{ fontSize: '0.75rem', lineHeight: '1.4' }}
                        >
                          Changing password values affects API token authorization immediately. Be
                          sure to note down your new password string to prevent locking out of
                          current portal environments.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Password Actions */}
                  <div className="mt-4 pt-3 border-top d-flex justify-content-end gap-2">
                    <button
                      type="button"
                      className="btn btn-light border px-4"
                      onClick={() =>
                        resetSec({ currentPassword: '', newPassword: '', confirmPassword: '' })
                      }
                      style={{ fontSize: '0.85rem' }}
                    >
                      Clear Fields
                    </button>
                    <button
                      type="submit"
                      className="btn btn-danger px-4 fw-medium d-flex align-items-center gap-1.5"
                      style={{ fontSize: '0.85rem' }}
                    >
                      <i className="bi bi-key-fill me-1"></i>
                      <span>Update Password</span>
                    </button>
                  </div>
                </form>
              )}

              {/* TAB 3: SYSTEM PREFERENCES */}
              {activeTab === 'preferences' && (
                <div>
                  <div className="d-flex align-items-center justify-content-between mb-3 flex-wrap gap-2">
                    <div>
                      <h5 className="fw-bold mb-1 text-dark-emphasis text-lg">System Preferences & Themes</h5>
                      <p className="text-muted mb-0 text-sm">
                        Configure system color templates, navigation style, and visual parameters.
                      </p>
                    </div>
                    <button
                      type="button"
                      className="btn btn-outline-secondary btn-sm d-flex align-items-center gap-1.5"
                      onClick={handleResetAllTheme}
                    >
                      <i className="bi bi-arrow-counterclockwise"></i>
                      <span>Reset Themes</span>
                    </button>
                  </div>

                  {/* SECTION 1: THEME TEMPLATES GALLERY */}
                  <div className="card border rounded-3 p-3 mb-4 shadow-sm">
                    <div className="d-flex align-items-center justify-content-between mb-3">
                      <div>
                        <h6 className="fw-bold mb-0 text-dark-emphasis d-flex align-items-center gap-2">
                          <i className="bi bi-palette2 text-primary"></i>
                          <span>Portal Theme Templates</span>
                        </h6>
                        <p className="text-muted mb-0 small" style={{ fontSize: '0.78rem' }}>
                          Select a curated color palette for Scheme360. Changes take effect across the entire portal immediately.
                        </p>
                      </div>
                      <span className="badge bg-primary-subtle text-primary border border-primary-subtle px-2.5 py-1 rounded-pill small fw-medium">
                        Active: {THEME_TEMPLATES.find((t) => t.id === colorPreset)?.name || 'Modern Indigo'}
                      </span>
                    </div>

                    <div className="row g-3">
                      {THEME_TEMPLATES.map((tmpl) => {
                        const isActive = colorPreset === tmpl.id;
                        return (
                          <div className="col-12 col-md-6 col-lg-4" key={tmpl.id}>
                            <div
                              className={`card h-100 border rounded-3 transition-all cursor-pointer shadow-xs ${
                                isActive
                                  ? 'border-primary shadow-sm bg-primary-subtle'
                                  : 'border-light-subtle bg-body hover-shadow'
                              }`}
                              style={{ cursor: 'pointer' }}
                              onClick={() => handleSelectPresetTheme(tmpl.id)}
                            >
                              {/* Header stripe / preview */}
                              <div
                                className="p-2.5 rounded-top-3 d-flex align-items-center justify-content-between"
                                style={{
                                  background: tmpl.previewGradient,
                                  minHeight: '44px'
                                }}
                              >
                                <span className="d-flex badge bg-white text-dark shadow-xs fw-semibold" style={{ fontSize: '0.68rem', marginLeft: '1rem' }}>
                                  {tmpl.category} 
                                </span>
                                {isActive && (
                                  <span className="badge bg-dark text-white shadow-xs rounded-pill " style={{ fontSize: '0.68rem', marginRight: '1rem' }}>
                                    <i className="bi bi-check2-circle me-1"></i> Active
                                  </span>
                                )}
                              </div>

                              <div className="card-body p-3 d-flex flex-column">
                                <div className="d-flex align-items-center justify-content-between mb-1">
                                  <h6 className="fw-bold mb-0 text-dark-emphasis" style={{ fontSize: '0.9rem' }}>
                                    {tmpl.name}
                                  </h6>
                                  <span className={`badge bg-${tmpl.badgeVariant}-subtle text-${tmpl.badgeVariant} border border-${tmpl.badgeVariant}-subtle rounded-pill`} style={{ fontSize: '0.66rem' }}>
                                    {tmpl.badge}
                                  </span>
                                </div>
                                <p className="text-muted small mb-3 flex-grow-1" style={{ fontSize: '0.75rem', lineHeight: '1.4' }}>
                                  {tmpl.description}
                                </p>

                                <div className="d-flex align-items-center justify-content-between pt-2 border-top mt-auto">
                                  <div className="d-flex align-items-center gap-1.5">
                                    <span
                                      className="rounded-circle d-inline-block border shadow-xs"
                                      style={{ width: '16px', height: '16px', backgroundColor: tmpl.primaryColor }}
                                      title={`Primary: ${tmpl.primaryColor}`}
                                    ></span>
                                    <span
                                      className="rounded-circle d-inline-block border shadow-xs"
                                      style={{ width: '16px', height: '16px', backgroundColor: tmpl.accentColor }}
                                      title={`Accent: ${tmpl.accentColor}`}
                                    ></span>
                                    <span
                                      className="rounded-circle d-inline-block border shadow-xs"
                                      style={{ width: '16px', height: '16px', backgroundColor: theme === 'dark' ? tmpl.darkSubtleBg : tmpl.subtleBg }}
                                      title="Subtle background"
                                    ></span>
                                  </div>
                                  <button
                                    type="button"
                                    className={`btn btn-sm py-1 px-2.5 rounded-2 fw-medium ${
                                      isActive ? 'btn-primary' : 'btn-outline-secondary'
                                    }`}
                                    style={{ fontSize: '0.74rem' }}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleSelectPresetTheme(tmpl.id);
                                    }}
                                  >
                                    {isActive ? 'Active' : 'Apply'}
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* SECTION 2: SIDEBAR & DISPLAY PREFERENCES */}
                  <div className="list-group list-group-flush border rounded overflow-hidden mb-4">
                    {/* Theme toggler row */}
                    <div className="list-group-item p-3 d-flex justify-content-between align-items-center">
                      <div>
                        <h6
                          className="mb-1 fw-bold text-dark-emphasis"
                          style={{ fontSize: '0.85rem' }}
                        >
                          System Display Theme
                        </h6>
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
                        <label
                          className="form-check-label ms-2 fw-medium text-dark-emphasis"
                          htmlFor="themeToggleSwitch"
                          style={{ fontSize: '0.85rem' }}
                        >
                          {theme === 'dark' ? 'Dark Mode' : 'Light Mode'}
                        </label>
                      </div>
                    </div>

                    {/* Sidebar Navigation Style row */}
                    <div className="list-group-item p-3 d-flex justify-content-between align-items-center flex-wrap gap-2">
                      <div>
                        <h6
                          className="mb-1 fw-bold text-dark-emphasis"
                          style={{ fontSize: '0.85rem' }}
                        >
                          Sidebar Navigation Style
                        </h6>
                        <p className="text-muted mb-0" style={{ fontSize: '0.75rem' }}>
                          Choose between a light matching sidebar or high-contrast dark executive navigation.
                        </p>
                      </div>
                      <div className="btn-group" role="group">
                        {SIDEBAR_SKINS.map((skin) => (
                          <button
                            key={skin.id}
                            type="button"
                            className={`btn btn-sm py-1.5 px-3 fw-medium ${
                              sidebarSkin === skin.id
                                ? 'btn-primary shadow-xs'
                                : 'btn-outline-secondary'
                            }`}
                            style={{ fontSize: '0.8rem' }}
                            onClick={() => handleSelectSidebarSkin(skin.id)}
                          >
                            <i
                              className={`bi ${
                                skin.id === 'dark' ? 'bi-moon-fill' : 'bi-sun-fill'
                              } me-1.5`}
                            ></i>
                            {skin.name}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Localization settings list item */}
                    <div className="list-group-item p-3">
                      <div className="row g-3 align-items-center">
                        <div className="col-12 col-md-8">
                          <h6
                            className="mb-1 fw-bold text-dark-emphasis"
                            style={{ fontSize: '0.85rem' }}
                          >
                            Preferred Portal Language
                          </h6>
                          <p className="text-muted mb-0" style={{ fontSize: '0.75rem' }}>
                            Configure default language formatting parameters for scheme form
                            registries.
                          </p>
                        </div>
                        <div className="col-12 col-md-4">
                          <select
                            className="form-select form-select-sm"
                            value={preferredLanguage}
                            onChange={(event) => {
                              setPreferredLanguage(event.target.value);
                              savePreferences({ preferredLanguage: event.target.value });
                            }}
                          >
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
                  <div
                    className="mt-4 p-3 bg-light border rounded text-muted"
                    style={{ fontSize: '0.75rem', lineHeight: '1.4' }}
                  >
                    <i className="bi bi-info-circle-fill text-primary me-2"></i>
                    Preference settings are linked directly to client-side localStorage and synced
                    on launch automatically.
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
