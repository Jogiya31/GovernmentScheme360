import React, { useEffect } from 'react';

/**
 * Reusable Dynamic Modal Component
 * Supports Alerts, Confirmations, and Custom HTML panels.
 */
export default function Modal({
  isOpen,
  onClose,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  confirmClass = 'btn-primary',
  cancelClass = 'btn-light border',
  onConfirm,
  type = 'confirm', // 'confirm' | 'alert' | 'custom'
  icon = 'bi-exclamation-triangle-fill',
  iconColorClass = 'text-warning bg-warning-subtle',
  children,
  size = 'md' // 'sm' | 'md' | 'lg'
}) {
  
  // Close modal on Escape key down
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div 
      className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center px-3"
      style={{ 
        backgroundColor: 'rgba(15, 23, 42, 0.6)', 
        backdropFilter: 'blur(4px)', 
        zIndex: 1070 
      }}
      onClick={onClose}
    >
      <div 
        className="card shadow-lg border-0 w-100 fade-in-scale"
        style={{ 
          maxWidth: size === 'sm' ? '360px' : size === 'lg' ? '640px' : '460px', 
          borderRadius: '14px', 
          overflow: 'hidden',
          animation: 'modalSlideIn 0.25s cubic-bezier(0.16, 1, 0.3, 1)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Block */}
        <div className="card-header bg-light border-bottom-0 py-3.5 px-4 d-flex align-items-center justify-content-between">
          <div className="d-flex align-items-center gap-2.5">
            {type !== 'custom' && (
              <div 
                className={`rounded-circle d-flex align-items-center justify-content-center ${iconColorClass}`} 
                style={{ width: '34px', height: '34px' }}
              >
                <i className={`bi ${icon} fs-5`}></i>
              </div>
            )}
            <h6 className="card-title mb-0 fw-bold text-dark" style={{ letterSpacing: '-0.01em', fontSize: '1rem' }}>
              {title || (type === 'alert' ? 'Notification' : 'Confirmation Needed')}
            </h6>
          </div>
          <button 
            type="button" 
            className="btn-close text-muted" 
            style={{ fontSize: '0.75rem' }} 
            onClick={onClose}
            aria-label="Close"
          ></button>
        </div>

        {/* Content Body Block */}
        <div className="card-body py-4 px-4">
          {type !== 'custom' ? (
            <p className="card-text text-secondary mb-0" style={{ fontSize: '0.9rem', lineHeight: '1.55' }}>
              {message}
            </p>
          ) : (
            children
          )}
        </div>

        {/* Footer Actions Block */}
        <div className="card-footer bg-light border-top-0 d-flex justify-content-end gap-2.5 py-3 px-4">
          {type === 'confirm' ? (
            <>
              <button 
                type="button" 
                className={`btn btn-sm px-3.5 py-2 fw-medium  mx-1 ${cancelClass}`}
                style={{ fontSize: '0.825rem', borderRadius: '8px' }}
                onClick={onClose}
              >
                {cancelText}
              </button>
              <button 
                type="button" 
                className={`btn btn-sm px-4 py-2 fw-semibold mx-1 text-white ${confirmClass}`}
                style={{ fontSize: '0.825rem', borderRadius: '8px' }}
                onClick={() => {
                  if (onConfirm) onConfirm();
                }}
              >
                {confirmText}
              </button>
            </>
          ) : type === 'alert' ? (
            <button 
              type="button" 
              className={`btn btn-sm px-4 py-2 fw-semibold mx-1 text-white ${confirmClass}`}
              style={{ fontSize: '0.825rem', borderRadius: '8px' }}
              onClick={onClose}
            >
              OK
            </button>
          ) : null}
        </div>
      </div>

      <style>{`
        @keyframes modalSlideIn {
          from {
            opacity: 0;
            transform: translateY(-24px) scale(0.96);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
      `}</style>
    </div>
  );
}
