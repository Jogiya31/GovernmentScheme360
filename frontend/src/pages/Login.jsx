import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useLoginMutation } from '../app/api';
import { setCredentials } from '../features/auth/authSlice';

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [login, { isLoading }] = useLoginMutation();
  const [apiError, setApiError] = useState(null);

  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      email: 'admin@gmail.com',
      password: 'admin123'
    }
  });

  const from = location.state?.from?.pathname || '/dashboard';

  const onSubmit = async (data) => {
    try {
      setApiError(null);
      const result = await login(data).unwrap();
      dispatch(setCredentials(result));
      navigate(from, { replace: true });
    } catch (err) {
      setApiError(err.data?.message || 'Login failed. Please try again.');
    }
  };

  return (
    <div className="auth-wrapper d-flex align-items-center justify-content-center min-vh-100 bg-light-subtle">
      <div className="card shadow-lg border-0 m-3" style={{ maxWidth: '450px', width: '100%', borderRadius: '8px' }}>
        <div className="card-body p-5">
          <div className="text-center mb-4">
            <i className="bi bi-cpu-fill text-primary display-4"></i>
            <h3 className="fw-bold mt-2 mb-1">Free<span className="text-primary">Dash</span> Admin</h3>
            <p className="text-muted text-sm">Sign in to manage your executive dashboard</p>
          </div>

          {apiError && (
            <div className="alert alert-danger py-2 px-3 mb-4 rounded" style={{ fontSize: '0.85rem' }}>
              <i className="bi bi-exclamation-triangle-fill me-2"></i>
              {apiError}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)}>
            {/* Email Field */}
            <div className="mb-3">
              <label className="form-label text-muted fw-semibold" style={{ fontSize: '0.8rem' }}>Email Address</label>
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
                      message: 'Invalid email address'
                    }
                  })}
                />
              </div>
              {errors.email && (
                <div className="text-danger mt-1" style={{ fontSize: '0.75rem' }}>{errors.email.message}</div>
              )}
            </div>

            {/* Password Field */}
            <div className="mb-4">
              <label className="form-label text-muted fw-semibold" style={{ fontSize: '0.8rem' }}>Password</label>
              <div className="input-group">
                <span className="input-group-text bg-transparent text-muted border-end-0">
                  <i className="bi bi-lock"></i>
                </span>
                <input
                  type="password"
                  className={`form-control border-start-0 ps-0 ${errors.password ? 'is-invalid' : ''}`}
                  placeholder="••••••••"
                  {...register('password', { required: 'Password is required' })}
                />
              </div>
              {errors.password && (
                <div className="text-danger mt-1" style={{ fontSize: '0.75rem' }}>{errors.password.message}</div>
              )}
            </div>

            {/* Remember & Help */}
            <div className="d-flex justify-content-between align-items-center mb-4" style={{ fontSize: '0.85rem' }}>
              <div className="form-check">
                <input type="checkbox" className="form-check-input" id="rememberMe" />
                <label className="form-check-label text-muted" htmlFor="rememberMe">Remember me</label>
              </div>
              <span className="text-primary text-decoration-none cursor-pointer">Forgot Password?</span>
            </div>

            {/* Sign In Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="btn btn-primary w-100 py-2.5 fw-semibold d-flex align-items-center justify-content-center gap-2"
              style={{ borderRadius: '4px' }}
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

          {/* Quick Sandbox Help Creds */}
          <div className="mt-4 p-3 bg-light rounded text-center" style={{ fontSize: '0.8rem', border: '1px dashed #dee2e6' }}>
            <span className="fw-semibold text-secondary d-block mb-1">Demo Credentials:</span>
            <code className="text-primary">admin@gmail.com</code> / <code className="text-primary">admin123</code>
          </div>
        </div>
      </div>
    </div>
  );
}
