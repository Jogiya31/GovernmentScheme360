import React, { useState, useRef, useEffect, useMemo } from 'react';

/**
 * Dropdown component - Supports both single-select (normal) and multi-select modes,
 * searchable lists, custom badge triggers, and click-outside dismissal.
 */
export default function Dropdown({
  options = [], // Array of strings or { value, label, icon }
  value, // For single select: string/number. For multi-select: array of string/number.
  onChange, // Callback on value change (value) => void
  placeholder = 'Select option...',
  label, // Optional title label above the dropdown
  isMulti = false, // Set to true for multiselect dropdown
  searchable = false, // Set to true to filter options with a search box
  disabled = false,
  maxSelectedDisplay = 3, // In multi mode, how many chip tags to show before collapsing to "+X more"
  className = '',
  id,
  style = {},
  ...props
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchFilter] = useState('');
  const dropdownRef = useRef(null);

  // Normalize options to a standard format [{ value, label, icon }]
  const normalizedOptions = useMemo(() => {
    return options.map((opt) => {
      if (typeof opt === 'string' || typeof opt === 'number') {
        return { value: opt, label: String(opt) };
      }
      return {
        value: opt.value,
        label: opt.label || String(opt.value),
        icon: opt.icon
      };
    });
  }, [options]);

  // Click outside listener
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Filter options based on search term
  const filteredOptions = useMemo(() => {
    if (!searchable || !searchTerm) return normalizedOptions;
    const lower = searchTerm.toLowerCase();
    return normalizedOptions.filter((opt) =>
      opt.label.toLowerCase().includes(lower)
    );
  }, [normalizedOptions, searchable, searchTerm]);

  // Find label of currently selected option in single mode
  const selectedSingleOption = useMemo(() => {
    if (isMulti) return null;
    return normalizedOptions.find((opt) => opt.value === value);
  }, [normalizedOptions, value, isMulti]);

  // Find labels of selected options in multi mode
  const selectedMultiOptions = useMemo(() => {
    if (!isMulti || !Array.isArray(value)) return [];
    return normalizedOptions.filter((opt) => value.includes(opt.value));
  }, [normalizedOptions, value, isMulti]);

  const handleToggle = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
      setSearchFilter(''); // Reset search when opening/closing
    }
  };

  // Option selection logic
  const handleSelectOption = (optionValue) => {
    if (isMulti) {
      const currentValues = Array.isArray(value) ? value : [];
      let newValues;
      if (currentValues.includes(optionValue)) {
        newValues = currentValues.filter((v) => v !== optionValue);
      } else {
        newValues = [...currentValues, optionValue];
      }
      if (onChange) onChange(newValues);
    } else {
      if (onChange) onChange(optionValue);
      setIsOpen(false);
    }
  };

  const removeMultiOption = (e, optionValue) => {
    e.stopPropagation();
    const currentValues = Array.isArray(value) ? value : [];
    const newValues = currentValues.filter((v) => v !== optionValue);
    if (onChange) onChange(newValues);
  };

  const handleSelectAll = (e) => {
    e.stopPropagation();
    const allValues = normalizedOptions.map((opt) => opt.value);
    if (onChange) onChange(allValues);
  };

  const handleClearAll = (e) => {
    e.stopPropagation();
    if (onChange) onChange(isMulti ? [] : '');
  };

  return (
    <div
      ref={dropdownRef}
      className={`dropdown-container position-relative ${className}`}
      style={{ minWidth: '200px', ...style }}
      id={id}
      {...props}
    >
      {/* Label above dropdown trigger */}
      {label && (
        <label className="form-label fw-medium text-dark-emphasis mb-1" style={{ fontSize: '0.85rem' }}>
          {label}
        </label>
      )}

      {/* Select Box Trigger */}
      <div
        className={`form-select d-flex align-items-center justify-content-between cursor-pointer py-2 px-3 border rounded ${
          disabled ? 'bg-secondary-bg opacity-75' : 'bg-body'
        }`}
        style={{
          minHeight: '42px',
          background: 'none', // Remove bootstrap default arrow since we render custom chevron
          paddingRight: '12px'
        }}
        onClick={handleToggle}
      >
        <div className="d-flex flex-wrap align-items-center gap-1" style={{ maxWidth: '90%' }}>
          {isMulti ? (
            /* Multi select content area */
            selectedMultiOptions.length === 0 ? (
              <span className="text-muted">{placeholder}</span>
            ) : selectedMultiOptions.length <= maxSelectedDisplay ? (
              selectedMultiOptions.map((opt) => (
                <span
                  key={opt.value}
                  className="badge bg-primary text-white d-inline-flex align-items-center gap-1 py-1 px-2 rounded"
                  style={{ fontSize: '0.75rem', fontWeight: '400' }}
                >
                  {opt.label}
                  <i
                    className="bi bi-x fs-6 cursor-pointer hover-opacity-100"
                    onClick={(e) => removeMultiOption(e, opt.value)}
                    style={{ lineHeight: 0 }}
                  ></i>
                </span>
              ))
            ) : (
              <span className="badge bg-primary text-white py-1 px-2 rounded" style={{ fontSize: '0.75rem', fontWeight: '400' }}>
                {selectedMultiOptions.length} selected
              </span>
            )
          ) : (
            /* Single select content area */
            selectedSingleOption ? (
              <span className="d-flex align-items-center text-dark-emphasis">
                {selectedSingleOption.icon && <i className={`${selectedSingleOption.icon} me-2 text-primary`}></i>}
                {selectedSingleOption.label}
              </span>
            ) : (
              <span className="text-muted">{placeholder}</span>
            )
          )}
        </div>

        {/* Clear and Chevron indicators */}
        <div className="d-flex align-items-center gap-2">
          {((isMulti && selectedMultiOptions.length > 0) || (!isMulti && selectedSingleOption)) && !disabled && (
            <i
              className="bi bi-x-lg text-muted cursor-pointer hover-text-danger"
              style={{ fontSize: '0.85rem' }}
              onClick={handleClearAll}
              title="Clear all"
            ></i>
          )}
          <i className={`bi bi-chevron-${isOpen ? 'up' : 'down'} text-muted`} style={{ fontSize: '0.85rem' }}></i>
        </div>
      </div>

      {/* Dropdown Menu Popup List */}
      {isOpen && (
        <div
          className="position-absolute start-0 w-100 mt-1 bg-body border rounded shadow-lg overflow-hidden"
          style={{ zIndex: 1100, maxHeight: '320px', display: 'flex', flexDirection: 'column' }}
        >
          {/* Optional search input filter */}
          {searchable && (
            <div className="p-2 border-bottom bg-light">
              <div className="input-group input-group-sm">
                <span className="input-group-text bg-transparent border-end-0">
                  <i className="bi bi-search text-muted"></i>
                </span>
                <input
                  type="text"
                  className="form-control border-start-0"
                  placeholder="Filter options..."
                  value={searchTerm}
                  onChange={(e) => setSearchFilter(e.target.value)}
                  style={{ fontSize: '0.85rem' }}
                  onClick={(e) => e.stopPropagation()} // Prevent closing dropdown on input focus/clicks
                />
              </div>
            </div>
          )}

          {/* Quick toggle headers in multi mode */}
          {isMulti && (
            <div className="p-2 border-bottom bg-light d-flex justify-content-between align-items-center" style={{ fontSize: '0.75rem' }}>
              <button
                type="button"
                className="btn btn-link btn-sm p-0 text-decoration-none text-primary"
                onClick={handleSelectAll}
              >
                Select All
              </button>
              <span className="text-muted">|</span>
              <button
                type="button"
                className="btn btn-link btn-sm p-0 text-decoration-none text-danger"
                onClick={handleClearAll}
              >
                Clear All
              </button>
            </div>
          )}

          {/* Scrollable list options */}
          <div className="overflow-auto flex-grow-1" style={{ maxHeight: '220px' }}>
            {filteredOptions.length === 0 ? (
              <div className="text-center py-3 text-muted" style={{ fontSize: '0.85rem' }}>
                No matches found
              </div>
            ) : (
              filteredOptions.map((opt) => {
                const isSelected = isMulti
                  ? (Array.isArray(value) && value.includes(opt.value))
                  : value === opt.value;

                return (
                  <div
                    key={opt.value}
                    className={`dropdown-item py-2 px-3 d-flex align-items-center justify-content-between cursor-pointer ${
                      isSelected ? 'bg-primary-subtle font-weight-medium' : ''
                    }`}
                    onClick={() => handleSelectOption(opt.value)}
                    style={{ fontSize: '0.9rem' }}
                  >
                    <div className="d-flex align-items-center text-dark-emphasis">
                      {isMulti && (
                        <div className="form-check mb-0 me-2" style={{ pointerEvents: 'none' }}>
                          <input
                            type="checkbox"
                            className="form-check-input"
                            checked={isSelected}
                            readOnly
                          />
                        </div>
                      )}
                      {opt.icon && <i className={`${opt.icon} me-2 text-primary`}></i>}
                      <span>{opt.label}</span>
                    </div>

                    {isSelected && !isMulti && (
                      <i className="bi bi-check text-primary fs-5"></i>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
