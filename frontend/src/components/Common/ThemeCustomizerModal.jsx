import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateProfile } from '../../features/auth/authSlice';
import {
  setTheme,
  setColorPreset,
  setSidebarSkin,
  resetThemeSettings,
} from '../../features/theme/themeSlice';
import { THEME_TEMPLATES, SIDEBAR_SKINS } from '../../features/theme/themePresets';
import { api } from '../../app/api';

export default function ThemeCustomizerModal({ show, onClose }) {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const { theme, colorPreset, sidebarSkin } = useSelector((state) => state.theme);
  const [updatePreferencesRequest, { isLoading: isSavingPreferences }] = api.useUpdatePreferencesMutation();

  if (!show) return null;

  const currentTemplate =
    THEME_TEMPLATES.find((t) => t.id === colorPreset) || THEME_TEMPLATES[0];

  const handleApplyPreset = (presetId) => {
    dispatch(setColorPreset(presetId));
    savePreferences({ colorPreset: presetId });
  };

  const handleModeChange = (mode) => {
    dispatch(setTheme(mode));
    savePreferences({ theme: mode });
  };

  const handleSidebarSkinChange = (skin) => {
    dispatch(setSidebarSkin(skin));
    savePreferences({ sidebarSkin: skin });
  };

  const handleReset = () => {
    dispatch(resetThemeSettings());
    savePreferences({ theme: 'light', colorPreset: 'indigo', sidebarSkin: 'light' });
  };

  const savePreferences = async (changes) => {
    const preferences = {
      theme,
      colorPreset,
      sidebarSkin,
      emailNotifications: user?.emailNotifications ?? true,
      weeklyDigest: user?.weeklyDigest ?? true,
      preferredLanguage: user?.preferredLanguage || 'en',
      ...changes,
    };

    try {
      await updatePreferencesRequest(preferences).unwrap();
      dispatch(updateProfile(preferences));
    } catch (error) {
      console.error('Unable to save theme preferences:', error);
    }
  };

  return (
    <div
      className="modal fade show d-block"
      tabIndex="-1"
      role="dialog"
      style={{
        backgroundColor: 'rgba(15, 23, 42, 0.65)',
        backdropFilter: 'blur(4px)',
        zIndex: 1060,
      }}
      onClick={onClose}
    >
      <div
        className="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable"
        role="document"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-content border-0 shadow-lg rounded-4 overflow-hidden">
          {/* Modal Header */}
          <div className="modal-header border-bottom py-3 px-4 d-flex align-items-center justify-content-between">
            <div className="d-flex align-items-center gap-3">
              <div
                className="d-flex align-items-center justify-content-center rounded-3 text-white shadow-sm"
                style={{
                  width: '42px',
                  height: '42px',
                  background: currentTemplate.previewGradient,
                }}
              >
                <i className="bi bi-palette2 fs-5"></i>
              </div>
              <div>
                <h5 className="modal-title fw-bold mb-0 text-dark-emphasis">
                  Portal Theme
                </h5>
                <p className="text-muted mb-0 small" style={{ fontSize: '0.8rem' }}>
                  Explore curated color schemes and layout styles for Scheme360
                </p>
              </div>
            </div>
            <button
              type="button"
              className="btn-close"
              aria-label="Close"
              onClick={onClose}
            ></button>
          </div>

          {/* Modal Body */}
          <div className="modal-body p-4">
            {/* Quick Controls: Mode & Sidebar Skin */}
            <div className="card border p-3 mb-4 shadow-sm rounded-3">
              <div className="row g-3 align-items-center">
                {/* Mode Selector */}
                <div className="col-12 col-md-6">
                  <label className="form-label text-dark-emphasis fw-semibold small mb-2 d-flex align-items-center gap-2  ">
                    <i className="bi bi-brightness-high"></i> <span className=""> Display Mode</span>
                  </label>
                  <div className="btn-group w-100" role="group">
                    <button
                      type="button"
                      className={`btn btn-sm py-2 fw-medium ${
                        theme === 'light' ? 'btn-primary shadow-sm' : 'btn-outline-secondary'
                      }`}
                      onClick={() => handleModeChange('light')}
                    >
                      <i className="bi bi-sun me-2"></i> Light Mode
                    </button>
                    <button
                      type="button"
                      className={`btn btn-sm py-2 fw-medium ${
                        theme === 'dark' ? 'btn-primary shadow-sm' : 'btn-outline-secondary'
                      }`}
                      onClick={() => handleModeChange('dark')}
                    >
                      <i className="bi bi-moon-stars me-2"></i> Dark Mode
                    </button>
                  </div>
                </div>

                {/* Sidebar Skin Selector */}
                <div className="col-12 col-md-6">
                  <label className="form-label text-dark-emphasis fw-semibold small mb-2 d-flex align-items-center gap-2  ">
                    <i className="bi bi-layout-sidebar-inset"></i>
                    <span>Sidebar Navigation Style</span>
                  </label>
                  <div className="btn-group w-100" role="group">
                    {SIDEBAR_SKINS.map((skin) => (
                      <button
                        key={skin.id}
                        type="button"
                        className={`btn btn-sm py-2 fw-medium ${
                          sidebarSkin === skin.id
                            ? 'btn-primary shadow-sm'
                            : 'btn-outline-secondary'
                        }`}
                        onClick={() => handleSidebarSkinChange(skin.id)}
                      >
                        <i
                          className={`bi ${
                            skin.id === 'dark' ? 'bi-moon-fill' : 'bi-sun-fill'
                          } me-2`}
                        ></i>
                        {skin.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Section Header */}
            <div className="d-flex align-items-center justify-content-between mb-3">
              <div>
                <h6 className="fw-bold text-dark-emphasis mb-0">
                  Select a Theme Template
                </h6>
                <p className="text-muted small mb-0">
                  Click any template card to instantly apply it across the portal
                </p>
              </div>
              <span className="badge bg-primary-subtle text-primary border border-primary-subtle px-2.5 py-1.5 rounded-pill small fw-medium">
                Active: {currentTemplate.name}
              </span>
            </div>

            {/* Theme Templates Gallery Grid */}
            <div className="row g-3">
              {THEME_TEMPLATES.map((tmpl) => {
                const isActive = colorPreset === tmpl.id;
                return (
                  <div className="col-12 col-md-6 col-lg-4" key={tmpl.id}>
                    <div
                      className={`card h-100 border rounded-3 transition-all cursor-pointer shadow-sm ${
                        isActive
                          ? 'border-primary shadow'
                          : 'border-light-subtle hover-shadow'
                      }`}
                      style={{
                        cursor: 'pointer',
                        transition: 'transform 0.15s ease, box-shadow 0.15s ease',
                      }}
                      onClick={() => handleApplyPreset(tmpl.id)}
                    >
                      {/* Live Mini Preview Mockup */}
                      <div
                        className="p-3 border-bottom rounded-top-3 position-relative overflow-hidden"
                        style={{
                          backgroundColor:
                            theme === 'dark' ? '#0f172a' : '#f8fafc',
                          height: '110px',
                        }}
                      >
                        {/* Mini Layout Mockup */}
                        <div
                          className="w-100 h-100 d-flex rounded-2 border overflow-hidden shadow-xs"
                          style={{
                            borderColor: theme === 'dark' ? '#1e293b' : '#e2e8f0',
                            backgroundColor: theme === 'dark' ? '#141f2e' : '#ffffff',
                          }}
                        >
                          {/* Mini Sidebar */}
                          <div
                            style={{
                              width: '32%',
                              backgroundColor:
                                sidebarSkin === 'dark' || theme === 'dark'
                                  ? '#0f172a'
                                  : '#ffffff',
                              borderRight: '1px solid',
                              borderColor:
                                sidebarSkin === 'dark' || theme === 'dark'
                                  ? '#1e293b'
                                  : '#e2e8f0',
                              padding: '6px 4px',
                            }}
                            className="d-flex flex-column gap-1"
                          >
                            <div
                              className="rounded-1"
                              style={{
                                height: '6px',
                                width: '60%',
                                backgroundColor:
                                  sidebarSkin === 'dark' || theme === 'dark'
                                    ? '#334155'
                                    : '#cbd5e1',
                                marginBottom: '2px',
                              }}
                            ></div>
                            {/* Selected item mockup */}
                            <div
                              className="rounded-1"
                              style={{
                                height: '8px',
                                width: '100%',
                                background: tmpl.previewGradient,
                              }}
                            ></div>
                            <div
                              className="rounded-1"
                              style={{
                                height: '6px',
                                width: '75%',
                                backgroundColor:
                                  sidebarSkin === 'dark' || theme === 'dark'
                                    ? '#1e293b'
                                    : '#f1f5f9',
                              }}
                            ></div>
                            <div
                              className="rounded-1"
                              style={{
                                height: '6px',
                                width: '70%',
                                backgroundColor:
                                  sidebarSkin === 'dark' || theme === 'dark'
                                    ? '#1e293b'
                                    : '#f1f5f9',
                              }}
                            ></div>
                          </div>

                          {/* Mini Content Area */}
                          <div
                            className="flex-grow-1 p-2 d-flex flex-column gap-1.5"
                            style={{
                              backgroundColor:
                                theme === 'dark' ? '#141f2e' : '#f8fafc',
                            }}
                          >
                            {/* Mini Header */}
                            <div className="d-flex justify-content-between align-items-center pb-1 border-bottom">
                              <div
                                className="rounded-1"
                                style={{
                                  height: '5px',
                                  width: '35%',
                                  backgroundColor: tmpl.primaryColor,
                                }}
                              ></div>
                              <div
                                className="rounded-circle"
                                style={{
                                  width: '8px',
                                  height: '8px',
                                  backgroundColor: tmpl.accentColor,
                                }}
                              ></div>
                            </div>
                            {/* Mini Card */}
                            <div
                              className="rounded-1 p-1.5 d-flex flex-column gap-1 border"
                              style={{
                                backgroundColor:
                                  theme === 'dark' ? '#1c2d41' : '#ffffff',
                                borderColor:
                                  theme === 'dark' ? '#273e5a' : '#e2e8f0',
                              }}
                            >
                              <div
                                className="rounded-1"
                                style={{
                                  height: '4px',
                                  width: '50%',
                                  backgroundColor: '#94a3b8',
                                }}
                              ></div>
                              <div
                                className="rounded-pill align-self-start"
                                style={{
                                  height: '6px',
                                  width: '30px',
                                  backgroundColor: tmpl.primaryColor,
                                }}
                              ></div>
                            </div>
                          </div>
                        </div>

                        {/* Active check pill */}
                        {isActive && (
                          <span
                            className="position-absolute top-0 end-0 m-2 badge bg-primary text-white rounded-pill px-2 py-1 shadow-sm small fw-semibold"
                            style={{ fontSize: '0.7rem' }}
                          >
                            <i className="bi bi-check2 me-1"></i> Active
                          </span>
                        )}
                      </div>

                      {/* Card Meta & Description */}
                      <div className="card-body p-3 d-flex flex-column">
                        <div className="d-flex align-items-center justify-content-between mb-1.5">
                          <h6 className="fw-bold mb-0 text-dark-emphasis">
                            {tmpl.name}
                          </h6>
                          <span
                            className={`badge bg-${tmpl.badgeVariant}-subtle text-${tmpl.badgeVariant} border border-${tmpl.badgeVariant}-subtle rounded-pill`}
                            style={{ fontSize: '0.68rem' }}
                          >
                            {tmpl.badge}
                          </span>
                        </div>

                        <div
                          className="text-muted small mb-2 fw-medium"
                          style={{ fontSize: '0.74rem' }}
                        >
                          {tmpl.category}
                        </div>

                        <p
                          className="text-muted small mb-3 flex-grow-1"
                          style={{ fontSize: '0.78rem', lineHeight: '1.4' }}
                        >
                          {tmpl.description}
                        </p>

                        {/* Swatches & Best For Tag */}
                        <div className="pt-2 border-top d-flex align-items-center justify-content-between mt-auto">
                          <div className="d-flex align-items-center gap-1.5">
                            <span
                              className="rounded-circle d-inline-block border shadow-xs"
                              style={{
                                width: '18px',
                                height: '18px',
                                backgroundColor: tmpl.primaryColor,
                              }}
                              title={`Primary: ${tmpl.primaryColor}`}
                            ></span>
                            <span
                              className="rounded-circle d-inline-block border shadow-xs"
                              style={{
                                width: '18px',
                                height: '18px',
                                backgroundColor: tmpl.accentColor,
                              }}
                              title={`Accent: ${tmpl.accentColor}`}
                            ></span>
                            <span
                              className="rounded-circle d-inline-block border shadow-xs"
                              style={{
                                width: '18px',
                                height: '18px',
                                backgroundColor:
                                  theme === 'dark'
                                    ? tmpl.darkSubtleBg
                                    : tmpl.subtleBg,
                              }}
                              title="Subtle background"
                            ></span>
                          </div>

                          <button
                            type="button"
                            className={`btn btn-sm py-1 px-2.5 rounded-2 fw-medium ${
                              isActive
                                ? 'btn-primary'
                                : 'btn-outline-secondary hover-primary'
                            }`}
                            style={{ fontSize: '0.75rem' }}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleApplyPreset(tmpl.id);
                            }}
                          >
                            {isActive ? (
                              <>
                                <i className="bi bi-check-lg me-1"></i> Active
                              </>
                            ) : (
                              'Apply Theme'
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Modal Footer */}
          <div className="modal-footer border-top py-2.5 px-4 d-flex align-items-center justify-content-between">
            <button
              type="button"
              className="btn btn-outline-secondary btn-sm d-flex align-items-center gap-2"
              onClick={handleReset}
            >
              <i className="bi bi-arrow-counterclockwise"></i>
              <span> Reset to Default</span>
            </button>
            <div className="d-flex gap-2">
              <button
                type="button"
                className="btn btn-primary btn-sm px-3"
                onClick={onClose}
              >
                Done
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
