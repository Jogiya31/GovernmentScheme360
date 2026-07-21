import React, { useState, useEffect } from 'react';

/**
 * Alert component - For system messages and notifications.
 * Supports different styles, auto-resolving icons, and dismissible behaviour.
 */
export default function Alert({
  children,
  message,
  type = 'primary', // primary, success, danger, warning, info, light, dark
  icon, // can be a custom icon class (e.g. 'bi bi-info-circle') or boolean (true to auto-resolve)
  dismissible = false,
  onClose,
  autoCloseTime = 0, // auto-dismiss in milliseconds, 0 to disable
  className = '',
  id,
  style = {},
  ...props
}) {
  const [visible, setVisible] = useState(true);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    if (autoCloseTime > 0) {
      const timer = setTimeout(() => {
        handleDismiss();
      }, autoCloseTime);
      return () => clearTimeout(timer);
    }
  }, [autoCloseTime]);

  const handleDismiss = () => {
    setFading(true);
    setTimeout(() => {
      setVisible(false);
      if (onClose) onClose();
    }, 150); // timeout matches fade animation
  };

  if (!visible) return null;

  // Resolve standard alert icons based on alert type
  const getAutoIcon = (alertType) => {
    switch (alertType) {
      case 'success':
        return 'bi bi-check-circle-fill';
      case 'danger':
        return 'bi bi-exclamation-octagon-fill';
      case 'warning':
        return 'bi bi-exclamation-triangle-fill';
      case 'info':
        return 'bi bi-info-circle-fill';
      case 'primary':
      default:
        return 'bi bi-bell-fill';
    }
  };

  const resolvedIcon = icon === true ? getAutoIcon(type) : icon;

  const alertClasses = [
    'alert',
    `alert-${type}`,
    dismissible ? 'alert-dismissible' : '',
    fading ? 'fade' : 'show fade-in',
    className
  ].filter(Boolean).join(' ');

  return (
    <>
      <style>{`
        @keyframes alertSlideIn {
          from { transform: translateX(120%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        @keyframes alertSlideOut {
          from { transform: translateX(0); opacity: 1; }
          to { transform: translateX(120%); opacity: 0; }
        }
      `}</style>
      <div
        id={id}
        className={alertClasses}
        role="alert"
        style={{
          position: 'fixed',
          top: '24px',
          right: '24px',
          zIndex: 9999,
          maxWidth: '380px',
          width: 'calc(100% - 48px)',
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.15), 0 4px 6px -4px rgba(0, 0, 0, 0.15)',
          animation: fading ? 'alertSlideOut 0.15s ease-in forwards' : 'alertSlideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards',
          display: 'flex',
          alignItems: 'center',
          paddingRight: dismissible ? '50px' : '20px',
          ...style,
        }}
        {...props}
      >
        {/* Icon portion */}
        {resolvedIcon && (
          <span className="me-3 d-flex align-items-center" style={{ fontSize: '1.25rem' }}>
            <i className={resolvedIcon}></i>
          </span>
        )}

        {/* Message content */}
        <div className="flex-grow-1" style={{ fontSize: '0.9rem' }}>
          {message || children}
        </div>

        {/* Dismiss Button */}
        {dismissible && (
          <button
            type="button"
            className="btn-close"
            style={{ padding: '16px 20px', fontSize: '0.8rem' }}
            onClick={handleDismiss}
            aria-label="Close"
          />
        )}
      </div>
    </>
  );
}
