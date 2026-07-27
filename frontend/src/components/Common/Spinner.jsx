import React from 'react';

/**
 * Reusable Spinner component for displaying loading states across the app.
 *
 * Props:
 * - size: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
 * - variant: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'light' | 'dark'
 * - text: Optional loading message string
 * - inline: Renders inline with text/controls
 * - center: Flex container centering vertically and horizontally
 * - fullScreen: Renders full page modal overlay backdrop with spinner
 * - className: Additional CSS classes
 */
export default function Spinner({
  size = 'md',
  variant = 'primary',
  text,
  inline = false,
  center = false,
  fullScreen = false,
  className = '',
  id,
  style = {}
}) {
  const sizeMap = {
    xs: { width: '1rem', height: '1rem', borderWidth: '0.15em' },
    sm: { width: '1.25rem', height: '1.25rem', borderWidth: '0.175em' },
    md: { width: '2rem', height: '2rem', borderWidth: '0.2em' },
    lg: { width: '3rem', height: '3rem', borderWidth: '0.25em' },
    xl: { width: '4rem', height: '4rem', borderWidth: '0.3em' }
  };

  const spinnerStyle = {
    ...sizeMap[size] || sizeMap.md,
    ...style
  };

  const spinnerElement = (
    <div
      className={`spinner-border text-${variant} ${className}`}
      role="status"
      style={spinnerStyle}
      id={id}
    >
      <span className="visually-hidden">Loading...</span>
    </div>
  );

  if (fullScreen) {
    return (
      <div
        className="position-fixed top-0 start-0 w-100 h-100 d-flex flex-column align-items-center justify-content-center bg-dark bg-opacity-50"
        style={{ zIndex: 9999, backdropFilter: 'blur(3px)' }}
      >
        <div className="bg-body p-4 rounded-3 shadow-lg text-center d-flex flex-column align-items-center gap-3" style={{ minWidth: '220px' }}>
          <div className={`spinner-border text-${variant}`} role="status" style={sizeMap.lg}>
            <span className="visually-hidden">Loading...</span>
          </div>
          {text && <div className="fw-medium text-secondary fs-6">{text}</div>}
        </div>
      </div>
    );
  }

  if (center) {
    return (
      <div className="d-flex flex-column align-items-center justify-content-center py-4 w-100 gap-2">
        {spinnerElement}
        {text && <span className="text-secondary fw-medium" style={{ fontSize: '0.875rem' }}>{text}</span>}
      </div>
    );
  }

  if (inline) {
    return (
      <span className="d-inline-flex align-items-center gap-2">
        {spinnerElement}
        {text && <span className="text-secondary" style={{ fontSize: '0.85rem' }}>{text}</span>}
      </span>
    );
  }

  return (
    <div className="d-flex align-items-center gap-2">
      {spinnerElement}
      {text && <span className="text-secondary" style={{ fontSize: '0.9rem' }}>{text}</span>}
    </div>
  );
}
