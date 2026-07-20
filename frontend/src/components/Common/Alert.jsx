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
    <div
      id={id}
      className={alertClasses}
      role="alert"
      style={{
        ...style,
        display: 'flex',
        alignItems: 'center',
        paddingRight: dismissible ? '50px' : '20px',
        transition: 'opacity 0.15s linear, transform 0.15s ease-out'
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
  );
}
