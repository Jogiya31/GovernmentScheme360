import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useRegisterUserMutation } from '../app/api';
import { setCredentials } from '../features/auth/authSlice';
import scheme360 from '../assets/scheme360.png';

export const DEFAULT_USER_PASSWORD = 'Nic@12345';

export default function Register() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [registerUser, { isLoading }] = useRegisterUserMutation();
  const [apiError, setApiError] = useState(null);
  const [apiSuccess, setApiSuccess] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      agreeTerms: false,
    },
  });

  const onSubmit = async (data) => {
    try {
      setApiError(null);
      setApiSuccess(null);

      const payload = {
        name: data.name.trim(),
        email: data.email.trim().toLowerCase(),
        password: DEFAULT_USER_PASSWORD,
        phone: data.phone?.trim() || '',
      };

      const result = await registerUser(payload).unwrap();
      
      setApiSuccess(result.message || 'Official account registered successfully!');
      
      // Auto login user after short feedback
      if (result.user && result.token) {
        dispatch(setCredentials({
          user: result.user,
          token: result.token,
          refreshToken: result.refreshToken,
        }));
        setTimeout(() => {
          navigate('/dashboard', { replace: true });
        }, 1500);
      } else {
        setTimeout(() => {
          navigate('/login', { replace: true });
        }, 1800);
      }
    } catch (err) {
      setApiError(err.data?.message || err.error || 'Registration failed. Please check your information.');
    }
  };

  return (
    <div className="auth-wrapper d-flex align-items-center justify-content-center min-vh-100 bg-light-subtle py-5">
      <div
        className="card shadow-lg border-0 m-3"
        style={{ maxWidth: '540px', width: '100%', borderRadius: '12px' }}
      >
        <div className="card-body p-4 p-sm-5">
          {/* Header */}
          <div className="text-center mb-4">
            <img
              src={scheme360}
              alt="Scheme360 Logo"
              style={{ height: '44px', width: 'auto', objectFit: 'contain' }}
            />
            <h3 className="fw-bold mt-2 mb-1">
              Create <span className="text-primary">Scheme</span> 360 Account
            </h3>
            <p className="text-muted small mb-0">
              Department Officer & Administrator Self-Registration
            </p>
          </div>

          {/* Alert Messages */}
          {apiError && (
            <div className="alert alert-danger py-2 px-3 mb-4 rounded-3 d-flex align-items-center gap-2" style={{ fontSize: '0.85rem' }}>
              <i className="bi bi-exclamation-triangle-fill flex-shrink-0 fs-6"></i>
              <div>{apiError}</div>
            </div>
          )}

          {apiSuccess && (
            <div className="alert alert-success py-2 px-3 mb-4 rounded-3 d-flex align-items-center gap-2" style={{ fontSize: '0.85rem' }}>
              <i className="bi bi-check-circle-fill flex-shrink-0 fs-6"></i>
              <div>{apiSuccess} Redirecting to your dashboard...</div>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <div className="row g-3">
              {/* Full Name */}
              <div className="col-12">
                <label className="form-label text-muted fw-semibold small mb-1">
                  Full Name <span className="text-danger">*</span>
                </label>
                <div className="input-group">
                  <span className="input-group-text bg-transparent text-muted border-end-0">
                    <i className="bi bi-person"></i>
                  </span>
                  <input
                    type="text"
                    className={`form-control border-start-0 ps-0 ${errors.name ? 'is-invalid' : ''}`}
                    placeholder="e.g. Ramesh Kumar"
                    {...register('name', {
                      required: 'Full name is required',
                      minLength: { value: 3, message: 'Name must be at least 3 characters' },
                    })}
                  />
                </div>
                {errors.name && (
                  <div className="text-danger mt-1" style={{ fontSize: '0.75rem' }}>
                    {errors.name.message}
                  </div>
                )}
              </div>

              {/* Email Address */}
              <div className="col-12">
                <label className="form-label text-muted fw-semibold small mb-1">
                  Official Email Address (@nic.in) <span className="text-danger">*</span>
                </label>
                <div className="input-group">
                  <span className="input-group-text bg-transparent text-muted border-end-0">
                    <i className="bi bi-envelope-at"></i>
                  </span>
                  <input
                    type="email"
                    className={`form-control border-start-0 ps-0 ${errors.email ? 'is-invalid' : ''}`}
                    placeholder="officer@nic.in or user@meity.nic.in"
                    {...register('email', {
                      required: 'Official @nic.in email address is required',
                      pattern: {
                        value: /^[a-zA-Z0-9._%+-]+@([a-zA-Z0-9.-]+\.)?nic\.in$/i,
                        message: 'Only official @nic.in email addresses are accepted (e.g. officer@nic.in)',
                      },
                      validate: (val) => {
                        const clean = (val || '').trim().toLowerCase();
                        if (!clean.endsWith('@nic.in') && !clean.includes('.nic.in')) {
                          return 'Email must belong to the @nic.in government domain';
                        }
                        return true;
                      },
                    })}
                  />
                </div>
                <div className="form-text text-muted" style={{ fontSize: '0.72rem' }}>
                  Restricted to verified Government of India National Informatics Centre (@nic.in) emails.
                </div>
                {errors.email && (
                  <div className="text-danger mt-1" style={{ fontSize: '0.75rem' }}>
                    {errors.email.message}
                  </div>
                )}
              </div>

              {/* Contact Phone */}
              <div className="col-12">
                <label className="form-label text-muted fw-semibold small mb-1">
                  Contact Phone (Optional)
                </label>
                <div className="input-group">
                  <span className="input-group-text bg-transparent text-muted border-end-0">
                    <i className="bi bi-telephone"></i>
                  </span>
                  <input
                    type="tel"
                    className="form-control border-start-0 ps-0"
                    placeholder="+91 98765 43210"
                    {...register('phone')}
                  />
                </div>
              </div>

              {/* Default Password Policy Information Banner */}
              <div className="col-12">
                <div className="p-3 bg-primary-subtle border border-primary-subtle rounded-3">
                  <div className="d-flex align-items-start gap-2">
                    <i className="bi bi-shield-lock-fill text-primary fs-5 mt-0.5 flex-shrink-0"></i>
                    <div>
                      <div className="fw-semibold text-primary-emphasis small">Standard Default Password Policy</div>
                      <div className="text-muted small mt-0.5" style={{ fontSize: '0.8rem', lineHeight: '1.4' }}>
                        In accordance with official government onboarding guidelines, a standard default password is automatically assigned to your new account:
                      </div>
                      <div className="mt-2 d-inline-flex align-items-center gap-2 px-2.5 py-1 bg-white rounded border border-primary-subtle shadow-2xs">
                        <span className="text-muted small">Default Password:</span>
                        <code className="fw-bold text-primary fs-7">Nic@12345</code>
                      </div>
                      <div className="text-muted small mt-1.5" style={{ fontSize: '0.74rem' }}>
                        You can sign in immediately using this password and change it anytime from Account Settings or via Forgot Password.
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Terms Checkbox */}
              <div className="col-12">
                <div className="form-check">
                  <input
                    type="checkbox"
                    className={`form-check-input ${errors.agreeTerms ? 'is-invalid' : ''}`}
                    id="agreeTerms"
                    {...register('agreeTerms', {
                      required: 'You must agree to the Terms of Service & Privacy Policy',
                    })}
                  />
                  <label className="form-check-label text-muted small" htmlFor="agreeTerms">
                    I agree to the <span className="text-primary cursor-pointer">Terms of Service</span> and acknowledge official usage under the Scheme360 Governance Framework.
                  </label>
                </div>
                {errors.agreeTerms && (
                  <div className="text-danger mt-1" style={{ fontSize: '0.75rem' }}>
                    {errors.agreeTerms.message}
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <div className="col-12 mt-4">
                <button
                  type="submit"
                  disabled={isLoading || !!apiSuccess}
                  className="btn btn-primary w-100 py-2.5 fw-semibold d-flex align-items-center justify-content-center gap-2 rounded-2 shadow-xs"
                >
                  {isLoading ? (
                    <>
                      <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                      Registering Account...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-person-plus-fill"></i>
                      Complete Registration
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>

          {/* Footer Navigation */}
          <div className="text-center mt-4 pt-3 border-top">
            <p className="text-muted small mb-0">
              Already have an account?{' '}
              <Link to="/login" className="text-primary fw-semibold text-decoration-none">
                Sign In here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
