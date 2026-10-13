import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useLoginMutation } from '../../app/api';
import { lockSession, logout, setCredentials } from '../../features/auth/authSlice';

function getTokenExpiry(token) {
  try {
    const payload = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
    const decoded = JSON.parse(atob(payload));
    return typeof decoded.exp === 'number' ? decoded.exp * 1000 : null;
  } catch {
    return null;
  }
}

export default function SessionLock() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, isLocked, token, user } = useSelector((state) => state.auth);
  const [login, { isLoading }] = useLoginMutation();
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const passwordInput = useRef(null);

  useEffect(() => {
    if (!isAuthenticated || isLocked) return undefined;

    const expiresAt = getTokenExpiry(token || '');
    const timeoutMinutes = Number(import.meta.env.VITE_SESSION_TIMEOUT_MINUTES);
    const configuredTimeout = Number.isFinite(timeoutMinutes) && timeoutMinutes > 0
      ? timeoutMinutes * 60 * 1000
      : Infinity;
    const tokenTimeout = expiresAt ? expiresAt - Date.now() : Infinity;
    const delay = Math.min(configuredTimeout, tokenTimeout);
    if (!Number.isFinite(delay)) return undefined;

    if (delay <= 0) {
      dispatch(lockSession());
      return undefined;
    }

    const timeoutId = window.setTimeout(() => dispatch(lockSession()), delay);
    return () => window.clearTimeout(timeoutId);
  }, [dispatch, isAuthenticated, isLocked, token]);

  useEffect(() => {
    if (isLocked) {
      passwordInput.current?.focus();
    } else {
      setPassword('');
      setErrorMessage('');
    }
  }, [isLocked]);

  const handleUnlock = async (event) => {
    event.preventDefault();
    setErrorMessage('');

    try {
      const result = await login({ email: user?.email, password }).unwrap();
      const currentEmail = (user?.email || '').trim().toLowerCase();
      const verifiedEmail = (result.user?.email || '').trim().toLowerCase();

      if (!result.token || !verifiedEmail || verifiedEmail !== currentEmail) {
        setErrorMessage('Unable to verify this account. Check your password and try again.');
        return;
      }

      dispatch(setCredentials({
        user: { ...user, ...result.user },
        token: result.token,
        refreshToken: result.refreshToken,
      }));
    } catch (error) {
      setErrorMessage(error?.data?.message || 'Incorrect password. Please try again.');
      setPassword('');
      passwordInput.current?.focus();
    }
  };

  const handleSignOut = () => {
    dispatch(logout());
    navigate('/login', { replace: true });
  };

  if (!isAuthenticated || !isLocked) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="session-lock-title"
      className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center p-3"
      style={{ zIndex: 2000, background: 'rgba(13, 27, 32, 0.94)', backdropFilter: 'blur(8px)' }}
    >
      <div className="bg-white shadow-lg w-100 p-4 p-sm-5" style={{ maxWidth: 420, borderRadius: 8 }}>
        <div className="text-center mb-4">
          <div
            className="d-inline-flex align-items-center justify-content-center rounded-circle mb-3"
            style={{ width: 56, height: 56, color: '#176b5b', background: '#e1f2ed' }}
          >
            <i className="bi bi-lock-fill fs-4" aria-hidden="true" />
          </div>
          <h1 id="session-lock-title" className="h4 fw-bold text-dark mb-1">Session locked</h1>
          <p className="text-secondary mb-0">Your session needs verification to continue.</p>
        </div>

        <div className="text-center mb-4">
          <div className="fw-semibold text-dark">{user?.name || 'Account'}</div>
          <div className="small text-secondary">{user?.email}</div>
        </div>

        <form onSubmit={handleUnlock}>
          <label htmlFor="session-password" className="form-label fw-semibold small">Password</label>
          <input
            ref={passwordInput}
            id="session-password"
            type="password"
            className="form-control mb-3"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            autoComplete="current-password"
            required
            disabled={isLoading}
          />
          {errorMessage && <div className="alert alert-danger py-2 small" role="alert">{errorMessage}</div>}
          <button type="submit" className="btn btn-primary w-100 fw-semibold" disabled={isLoading || !password}>
            {isLoading ? 'Verifying…' : 'Unlock session'}
          </button>
        </form>

        <button type="button" className="btn btn-link w-100 mt-2 text-secondary text-decoration-none" onClick={handleSignOut}>
          Sign out instead
        </button>
      </div>
    </div>
  );
}
