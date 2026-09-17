import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useLoginMutation, useForgotPasswordMutation } from '../app/api';
import { setCredentials } from '../features/auth/authSlice';
import { setThemePreferences } from '../features/theme/themeSlice';
import scheme360 from '../assets/scheme360.png';

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [login, { isLoading }] = useLoginMutation();
  const [forgotPassword, { isLoading: isForgotLoading }] = useForgotPasswordMutation();

  const [apiError, setApiError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  // Forgot password modal states
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotResult, setForgotResult] = useState(null);
  const [forgotError, setForgotError] = useState(null);

  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      email: 'officer@nic.in',
      password: 'Nic@12345',
    },
  });

  const from = location.state?.from?.pathname || '/dashboard';

  const onSubmit = async (data) => {
    try {
      setApiError(null);
      const result = await login(data).unwrap();
      dispatch(setCredentials(result));
      dispatch(setThemePreferences(result.user));
      navigate(from, { replace: true });
    } catch (err) {
      const msg = err?.data?.message || err?.data?.StatusMessage || err?.error || err?.message || 'Login failed. Please check your credentials.';
      setApiError(msg);
    }
  };

  const handleForgotPasswordSubmit = async (e) => {
    e.preventDefault();
    if (!forgotEmail.trim()) {
      setForgotError('Please enter your registered email address.');
      return;
    }
    try {
      setForgotError(null);
      setForgotResult(null);
      const res = await forgotPassword({ email: forgotEmail.trim() }).unwrap();
      setForgotResult(res);
    } catch (err) {
      const msg = err?.data?.message || err?.data?.StatusMessage || err?.error || err?.message || 'Unable to generate password reset request.';
      setForgotError(msg);
    }
  };

  return (
    <div className="auth-wrapper d-flex align-items-center justify-content-center min-vh-100 bg-light-subtle py-4">
      <div className="card shadow-lg border-0 m-3" style={{ maxWidth: '460px', width: '100%', borderRadius: '10px' }}>
        <div className="card-body p-4 p-sm-5">
          <div className="text-center mb-4">
            <img src={scheme360} alt="Scheme360 Logo" style={{ height: '45px', width: 'auto', objectFit: 'contain' }} />
            <h3 className="fw-bold mt-2 mb-1">Welcome to <span className="text-primary">Scheme</span> 360</h3>
            <p className="text-muted small">Sign in to manage your executive dashboard</p>
          </div>

          {apiError && (
            <div className="alert alert-danger py-2 px-3 mb-4 rounded-3 d-flex align-items-center gap-2" style={{ fontSize: '0.85rem' }}>
              <i className="bi bi-exclamation-triangle-fill flex-shrink-0"></i>
              <div>{apiError}</div>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)}>
            {/* Email Field */}
            <div className="mb-3">
              <label className="form-label text-muted fw-semibold small mb-1">Email Address</label>
              <div className="input-group">
                <span className="input-group-text bg-transparent text-muted border-end-0">
                  <i className="bi bi-envelope"></i>
                </span>
                <input
                  type="email"
                  className={`form-control border-start-0 ps-0 ${errors.email ? 'is-invalid' : ''}`}
                  placeholder="admin@gmail.com"
                  {...register('email', { 
                    required: 'Email address is required',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Invalid email address',
                    },
                  })}
                />
              </div>
              {errors.email && (
                <div className="text-danger mt-1" style={{ fontSize: '0.75rem' }}>{errors.email.message}</div>
              )}
            </div>

            {/* Password Field */}
            <div className="mb-3">
              <label className="form-label text-muted fw-semibold small mb-1">Password</label>
              <div className="input-group">
                <span className="input-group-text bg-transparent text-muted border-end-0">
                  <i className="bi bi-lock"></i>
                </span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  className={`form-control border-start-0 border-end-0 ps-0 ${errors.password ? 'is-invalid' : ''}`}
                  placeholder="••••••••"
                  {...register('password', { required: 'Password is required' })}
                />
                <button
                  type="button"
                  className="input-group-text bg-transparent text-muted border-start-0"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex="-1"
                >
                  <i className={`bi bi-eye${showPassword ? '-slash' : ''}`}></i>
                </button>
              </div>
              {errors.password && (
                <div className="text-danger mt-1" style={{ fontSize: '0.75rem' }}>{errors.password.message}</div>
              )}
            </div>

            {/* Remember & Forgot Password Link */}
            <div className="d-flex justify-content-between align-items-center mb-4" style={{ fontSize: '0.85rem' }}>
              <div className="form-check">
                <input type="checkbox" className="form-check-input" id="rememberMe" />
                <label className="form-check-label text-muted" htmlFor="rememberMe">Remember me</label>
              </div>
              <button
                type="button"
                className="btn btn-link p-0 text-primary text-decoration-none small border-0"
                onClick={() => {
                  setShowForgotModal(true);
                  setForgotResult(null);
                  setForgotError(null);
                }}
              >
                Forgot Password?
              </button>
            </div>

            {/* Sign In Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="btn btn-primary w-100 py-2.5 fw-semibold d-flex align-items-center justify-content-center gap-2 rounded-2 shadow-xs"
            >
              {isLoading ? (
                <>
                  <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                  Authenticating...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {/* New User Registration Prompt */}
          <div className="mt-4 pt-3 border-top text-center">
            <p className="text-muted small mb-0">
              Don't have an account?{' '}
              <Link to="/register" className="text-primary fw-semibold text-decoration-none">
                Register New User
              </Link>
            </p>
          </div>

          {/* Quick Sandbox Help Creds */}
          <div className="mt-4 p-3 bg-light rounded-3 text-center" style={{ fontSize: '0.8rem', border: '1px dashed #cbd5e1' }}>
            <span className="fw-semibold text-secondary d-block mb-1">Access Credentials:</span>
            <div>
              <code className="text-primary fw-medium">admin@gmail.com</code> / <code className="text-primary fw-medium">admin123</code>
            </div>
            <div className="text-muted small mt-1" style={{ fontSize: '0.74rem' }}>
              Official <code>@nic.in</code> accounts default password: <code className="text-primary fw-medium">Nic@12345</code>
            </div>
          </div>
        </div>
      </div>

      {/* FORGOT PASSWORD MODAL */}
      {showForgotModal && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1060 }}
        >
          <div className="modal-dialog modal-dialog-centered" style={{ maxWidth: '440px' }}>
            <div className="modal-content border-0 shadow-lg rounded-3 overflow-hidden">
              <div className="modal-header border-bottom px-4 py-3 bg-light">
                <div className="d-flex align-items-center gap-2">
                  <div className="bg-primary-subtle text-primary p-2 rounded-circle d-flex align-items-center justify-content-center" style={{ width: '32px', height: '32px' }}>
                    <i className="bi bi-key-fill fs-7"></i>
                  </div>
                  <h6 className="modal-title fw-bold mb-0">Password Recovery</h6>
                </div>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowForgotModal(false)}
                ></button>
              </div>

              <div className="modal-body p-4">
                {forgotResult ? (
                  <div className="text-center py-2">
                    <div className="text-success mb-2">
                      <i className="bi bi-check-circle-fill display-6"></i>
                    </div>
                    <h6 className="fw-bold text-dark">Verification Code Generated</h6>
                    <p className="text-muted small mb-3">
                      In SQL Server, <code>[User].[sp_ForgotPassword]</code> stores a reset token and expires in 30 minutes.
                    </p>

                    <div className="p-3 bg-light rounded-3 mb-3 border text-start">
                      <div className="small text-muted mb-1">One-Time Reset Code (OTP):</div>
                      <div className="h4 fw-bold text-primary letter-spacing-2 mb-2">{forgotResult.otp}</div>
                      <div className="small text-muted mb-1">Generated Reset Token:</div>
                      <code className="text-break small text-secondary">{forgotResult.resetToken}</code>
                    </div>

                    <button
                      type="button"
                      className="btn btn-primary w-100 py-2"
                      onClick={() => setShowForgotModal(false)}
                    >
                      Back to Sign In
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleForgotPasswordSubmit}>
                    <p className="text-muted small mb-3">
                      Enter your registered official email address. We will execute the password recovery routine and generate your reset verification credentials.
                    </p>

                    {forgotError && (
                      <div className="alert alert-danger py-2 px-3 mb-3 small rounded">
                        {forgotError}
                      </div>
                    )}

                    <div className="mb-3">
                      <label className="form-label text-muted fw-semibold small mb-1">Registered Email</label>
                      <div className="input-group">
                        <span className="input-group-text bg-transparent text-muted border-end-0">
                          <i className="bi bi-envelope"></i>
                        </span>
                        <input
                          type="email"
                          required
                          value={forgotEmail}
                          onChange={(e) => setForgotEmail(e.target.value)}
                          placeholder="e.g. admin@gmail.com"
                          className="form-control border-start-0 ps-0"
                        />
                      </div>
                    </div>

                    <div className="d-flex gap-2">
                      <button
                        type="button"
                        className="btn btn-light w-50 py-2 text-muted fw-medium"
                        onClick={() => setShowForgotModal(false)}
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={isForgotLoading}
                        className="btn btn-primary w-50 py-2 fw-medium d-flex align-items-center justify-content-center gap-1"
                      >
                        {isForgotLoading ? (
                          <>
                            <span className="spinner-border spinner-border-sm" role="status"></span>
                            Checking...
                          </>
                        ) : (
                          'Send Reset Code'
                        )}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
