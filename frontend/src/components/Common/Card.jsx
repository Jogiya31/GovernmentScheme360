import React from 'react';

/**
 * Card component - A structured content panel matching Freedash-lite aesthetics.
 */
export default function Card({
  children,
  title,
  subtitle,
  headerAction,
  footer,
  className = '',
  id,
  noBodyPadding = false,
  bg, // bg color
  text, // text color
  shadow = 'custom', // custom, sm, lg, none
  border = false,
  onClick,
  style = {},
  ...props
}) {
  const cardClasses = ['card'];

  // Styling customizers
  if (bg) cardClasses.push(`bg-${bg}`);
  if (text) cardClasses.push(`text-${text}`);
  
  if (shadow === 'custom') {
    cardClasses.push('custom-shadow');
  } else if (shadow && shadow !== 'none') {
    cardClasses.push(`shadow-${shadow}`);
  } else if (shadow === 'none') {
    cardClasses.push('shadow-none');
  }

  if (border === true) {
    cardClasses.push('border');
  } else if (typeof border === 'string') {
    cardClasses.push(`border-${border}`);
  } else {
    cardClasses.push('border-0');
  }

  if (onClick) {
    cardClasses.push('cursor-pointer');
  }

  const resolvedCardClass = [cardClasses.join(' '), className].filter(Boolean).join(' ');

  return (
    <div id={id} className={resolvedCardClass} style={style} onClick={onClick} {...props}>
      {/* Header section (if title, subtitle, or headerAction are provided) */}
      {(title || subtitle || headerAction) && (
        <div className="card-header bg-transparent border-bottom-0 pt-4 px-4 pb-2 d-flex justify-content-between align-items-start">
          <div>
            {title && (
              <h4 className="card-title mb-1 fw-medium text-dark-emphasis">
                {title}
              </h4>
            )}
            {subtitle && (
              <p className="card-subtitle mb-0 text-muted" style={{ fontSize: '0.85rem' }}>
                {subtitle}
              </p>
            )}
          </div>
          {headerAction && <div className="card-header-action">{headerAction}</div>}
        </div>
      )}

      {/* Card Body content */}
      {noBodyPadding ? (
        <div className="w-100">{children}</div>
      ) : (
        <div className="card-body p-4">{children}</div>
      )}

      {/* Footer section (if footer is provided) */}
      {footer && (
        <div className="card-footer bg-transparent border-top pt-3 px-4 pb-3">
          {footer}
        </div>
      )}
    </div>
  );
}
