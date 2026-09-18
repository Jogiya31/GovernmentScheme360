import React, { useState, useRef, useEffect, useMemo } from 'react';

/**
 * Modern DatePicker Component
 * Replaces standard HTML browser <input type="date"> with a state-of-the-art UI:
 * - Clean modern input trigger with formatted date display
 * - Month & Year fast-navigation picker (Month grid & Year grid)
 * - Quick shortcuts (Today, Yesterday, +7 Days, Clear)
 * - Auto-aligning popover with click-outside detection and Escape dismiss
 * - Full Dark Mode & Dynamic Theme Preset support
 */
export default function DatePicker({
  value = '',
  onChange,
  placeholder = 'Select date...',
  disabled = false,
  isInvalid = false,
  id,
  name,
  min,
  max,
  className = '',
  style = {},
  required = false,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [viewMode, setViewMode] = useState('days'); // 'days' | 'months' | 'years'
  const containerRef = useRef(null);
  const popoverRef = useRef(null);
  const [openUpward, setOpenUpward] = useState(false);

  // Parse initial or selected date
  const parsedDate = useMemo(() => {
    if (!value || typeof value !== 'string') return null;
    const parts = value.split('-');
    if (parts.length === 3) {
      const year = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1;
      const day = parseInt(parts[2], 10);
      if (!isNaN(year) && !isNaN(month) && !isNaN(day)) {
        return new Date(year, month, day);
      }
    }
    const d = new Date(value);
    return isNaN(d.getTime()) ? null : d;
  }, [value]);

  // Current view date (month/year currently viewed in calendar)
  const [viewDate, setViewDate] = useState(() => {
    return parsedDate || new Date();
  });

  // Sync viewDate when value changes externally
  useEffect(() => {
    if (parsedDate) {
      setViewDate(parsedDate);
    }
  }, [parsedDate]);

  // Handle click outside to close popover
  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
        setViewMode('days');
      }
    }

    function handleKeyDown(event) {
      if (event.key === 'Escape' && isOpen) {
        setIsOpen(false);
        setViewMode('days');
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);

      // Check if popover should open upwards
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const spaceBelow = window.innerHeight - rect.bottom;
        if (spaceBelow < 340 && rect.top > 340) {
          setOpenUpward(true);
        } else {
          setOpenUpward(false);
        }
      }
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const viewYear = viewDate.getFullYear();
  const viewMonth = viewDate.getMonth();

  // Navigation handlers
  const handlePrevMonth = (e) => {
    e.stopPropagation();
    setViewDate(new Date(viewYear, viewMonth - 1, 1));
  };

  const handleNextMonth = (e) => {
    e.stopPropagation();
    setViewDate(new Date(viewYear, viewMonth + 1, 1));
  };

  const handlePrevYear = (e) => {
    e.stopPropagation();
    setViewDate(new Date(viewYear - 1, viewMonth, 1));
  };

  const handleNextYear = (e) => {
    e.stopPropagation();
    setViewDate(new Date(viewYear + 1, viewMonth, 1));
  };

  // Convert Date object to YYYY-MM-DD
  const formatDateToISO = (date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  };

  // Check if date falls outside allowed min/max range
  const isDateDisabled = (date) => {
    if (!date) return false;
    const iso = formatDateToISO(date);
    if (min && iso < min) return true;
    if (max && iso > max) return true;
    return false;
  };

  const handleSelectDay = (day) => {
    const newDate = new Date(viewYear, viewMonth, day);
    if (isDateDisabled(newDate)) return;
    const isoString = formatDateToISO(newDate);
    if (onChange) {
      onChange(isoString);
    }
    setIsOpen(false);
  };

  const handleClear = (e) => {
    e.stopPropagation();
    if (disabled) return;
    if (onChange) {
      onChange('');
    }
  };

  const handleSelectToday = () => {
    const today = new Date();
    const isoString = formatDateToISO(today);
    if (onChange) {
      onChange(isoString);
    }
    setViewDate(today);
    setIsOpen(false);
  };

  const handleSelectYesterday = () => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const isoString = formatDateToISO(yesterday);
    if (onChange) {
      onChange(isoString);
    }
    setViewDate(yesterday);
    setIsOpen(false);
  };

  const handleSelectIn7Days = () => {
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);
    const isoString = formatDateToISO(nextWeek);
    if (onChange) {
      onChange(isoString);
    }
    setViewDate(nextWeek);
    setIsOpen(false);
  };

  // Formatted human readable label
  const formattedDisplay = useMemo(() => {
    if (!parsedDate) return '';
    try {
      const dayName = new Intl.DateTimeFormat('en-US', { weekday: 'short' }).format(parsedDate);
      const day = parsedDate.getDate();
      const month = new Intl.DateTimeFormat('en-US', { month: 'short' }).format(parsedDate);
      const year = parsedDate.getFullYear();
      return {
        full: `${day} ${month} ${year}`,
        weekday: dayName,
        raw: value,
      };
    } catch {
      return { full: value, weekday: '', raw: value };
    }
  }, [parsedDate, value]);

  // Months names
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // Days in month calculation
  const calendarDays = useMemo(() => {
    const firstDayIndex = new Date(viewYear, viewMonth, 1).getDay(); // 0 is Sunday
    const daysInCurrentMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
    const daysInPrevMonth = new Date(viewYear, viewMonth, 0).getDate();

    const days = [];

    // Prev month padding days
    for (let i = firstDayIndex - 1; i >= 0; i--) {
      days.push({
        day: daysInPrevMonth - i,
        month: 'prev',
        date: new Date(viewYear, viewMonth - 1, daysInPrevMonth - i),
      });
    }

    // Current month days
    for (let i = 1; i <= daysInCurrentMonth; i++) {
      days.push({
        day: i,
        month: 'current',
        date: new Date(viewYear, viewMonth, i),
      });
    }

    // Next month padding days to complete 42 cells (6 rows)
    const remaining = 42 - days.length;
    for (let i = 1; i <= remaining; i++) {
      days.push({
        day: i,
        month: 'next',
        date: new Date(viewYear, viewMonth + 1, i),
      });
    }

    return days;
  }, [viewYear, viewMonth]);

  const todayStr = useMemo(() => formatDateToISO(new Date()), []);

  // Quick years array for year view
  const yearsRange = useMemo(() => {
    const currentY = new Date().getFullYear();
    const startY = currentY - 50;
    const endY = currentY + 20;
    const list = [];
    for (let y = endY; y >= startY; y--) {
      list.push(y);
    }
    return list;
  }, []);

  return (
    <div
      ref={containerRef}
      className={`modern-datepicker-container position-relative ${className}`}
      style={style}
    >
      {/* TRIGGER INPUT BUTTON */}
      <div
        id={id}
        tabIndex={disabled ? -1 : 0}
        onClick={() => {
          if (!disabled) {
            setIsOpen(!isOpen);
            setViewMode('days');
          }
        }}
        onKeyDown={(e) => {
          if ((e.key === 'Enter' || e.key === ' ') && !disabled) {
            e.preventDefault();
            setIsOpen(!isOpen);
          }
        }}
        className={`modern-datepicker-trigger form-control d-flex align-items-center justify-content-between px-3 py-2 ${
          isInvalid ? 'is-invalid border-danger' : ''
        } ${disabled ? 'disabled bg-light opacity-75' : ''} ${
          isOpen ? 'focused ring-2' : ''
        }`}
        style={{
          cursor: disabled ? 'not-allowed' : 'pointer',
          minHeight: '40px',
          fontSize: '0.85rem',
          userSelect: 'none',
        }}
      >
        <div className="d-flex align-items-center gap-2 overflow-hidden text-truncate">
          {/* Calendar Accent Icon */}
          <div
            className="d-flex align-items-center justify-content-center rounded-2 flex-shrink-0"
            style={{
              width: '24px',
              height: '24px',
              backgroundColor: parsedDate
                ? 'var(--bs-primary-bg-subtle, rgba(76, 99, 210, 0.12))'
                : 'transparent',
              color: parsedDate ? 'var(--bs-primary, #4c63d2)' : 'var(--bs-secondary, #6c757d)',
            }}
          >
            <i className="bi bi-calendar3 fs-7"></i>
          </div>

          {/* Formatted Date or Placeholder */}
          {parsedDate ? (
            <div className="d-flex align-items-center gap-1.5 overflow-hidden">
              <span className="text-dark-emphasis text-truncate">
                {formattedDisplay.full}
              </span>
              <span
                className="badge bg-secondary-subtle text-secondary border border-secondary-subtle rounded-pill py-0.5 px-1.5"
                style={{ marginLeft: '0.6rem', fontSize: '0.68rem', fontWeight: 500 }}
              >
                {formattedDisplay.weekday}
              </span>
            </div>
          ) : (
            <span className="text-muted" style={{ fontSize: '0.85rem' }}>
              {placeholder}
            </span>
          )}
        </div>

        {/* Right action icons */}
        <div className="d-flex align-items-center gap-1 ms-2 flex-shrink-0">
          {parsedDate && !disabled && (
            <button
              type="button"
              className="btn btn-sm btn-link p-0 text-muted hover-text-danger border-0 d-flex align-items-center justify-content-center"
              onClick={handleClear}
              title="Clear date"
              style={{ width: '20px', height: '20px', textDecoration: 'none' }}
            >
              <i className="bi bi-x-circle-fill fs-7"></i>
            </button>
          )}
          <i
            className={`bi bi-chevron-${isOpen ? 'up' : 'down'} text-secondary fs-8 transition-transform`}
            style={{ transition: 'transform 0.2s ease' }}
          ></i>
        </div>
      </div>

      {/* HIDDEN INPUT FOR FORM ACCESSIBILITY & SUBMISSIONS */}
      <input
        type="hidden"
        name={name || id}
        value={value || ''}
        required={required}
      />

      {/* CALENDAR POPOVER */}
      {isOpen && (
        <div
          ref={popoverRef}
          className={`modern-datepicker-popover card border shadow-lg position-absolute ${
            openUpward ? 'bottom-100 mb-2' : 'top-100 mt-2'
          }`}
          style={{
            zIndex: 1070,
            width: '320px',
            borderRadius: '12px',
            backgroundColor: 'var(--bs-body-bg, #ffffff)',
            borderColor: 'var(--bs-border-color, #cbd5e1)',
            boxShadow: '0 12px 36px -6px rgba(0, 0, 0, 0.22), 0 4px 12px -2px rgba(0, 0, 0, 0.1)',
            left: 0,
            overflow: 'hidden',
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* HEADER: MONTH & YEAR WITH NAVIGATION */}
          <div
            className="p-3 border-bottom d-flex align-items-center justify-content-between"
            style={{
              backgroundColor: 'var(--bs-tertiary-bg, rgba(0,0,0,0.02))',
              borderTopLeftRadius: '12px',
              borderTopRightRadius: '12px',
            }}
          >
            {/* View Switcher: click to toggle between Days, Month picker, and Year picker */}
            <div className="d-flex align-items-center gap-1">
              <button
                type="button"
                className="btn btn-sm btn-light border-0 fw-bold px-2 py-1 rounded text-dark-emphasis d-flex align-items-center gap-1"
                onClick={() => setViewMode(viewMode === 'months' ? 'days' : 'months')}
                title="Change month"
                style={{ fontSize: '0.85rem' }}
              >
                <span>{monthNames[viewMonth]}</span>
                <i className="bi bi-caret-down-fill fs-9 opacity-50"></i>
              </button>

              <button
                type="button"
                className="btn btn-sm btn-light border-0 fw-bold px-2 py-1 rounded text-dark-emphasis d-flex align-items-center gap-1"
                onClick={() => setViewMode(viewMode === 'years' ? 'days' : 'years')}
                title="Change year"
                style={{ fontSize: '0.85rem' }}
              >
                <span>{viewYear}</span>
                <i className="bi bi-caret-down-fill fs-9 opacity-50"></i>
              </button>
            </div>

            {/* Previous / Next Month and Year Arrows */}
            {viewMode === 'days' && (
              <div className="d-flex align-items-center gap-1">
                <button
                  type="button"
                  className="btn btn-sm btn-outline-secondary border-0 d-flex align-items-center justify-content-center rounded-circle"
                  onClick={handlePrevYear}
                  title="Previous year"
                  style={{ width: '26px', height: '26px' }}
                >
                  <i className="bi bi-chevron-double-left fs-8"></i>
                </button>
                <button
                  type="button"
                  className="btn btn-sm btn-outline-secondary border-0 d-flex align-items-center justify-content-center rounded-circle"
                  onClick={handlePrevMonth}
                  title="Previous month"
                  style={{ width: '26px', height: '26px' }}
                >
                  <i className="bi bi-chevron-left fs-7"></i>
                </button>
                <button
                  type="button"
                  className="btn btn-sm btn-outline-secondary border-0 d-flex align-items-center justify-content-center rounded-circle"
                  onClick={handleNextMonth}
                  title="Next month"
                  style={{ width: '26px', height: '26px' }}
                >
                  <i className="bi bi-chevron-right fs-7"></i>
                </button>
                <button
                  type="button"
                  className="btn btn-sm btn-outline-secondary border-0 d-flex align-items-center justify-content-center rounded-circle"
                  onClick={handleNextYear}
                  title="Next year"
                  style={{ width: '26px', height: '26px' }}
                >
                  <i className="bi bi-chevron-double-right fs-8"></i>
                </button>
              </div>
            )}
          </div>

          {/* VIEW MODE 1: MONTH SELECTION GRID */}
          {viewMode === 'months' && (
            <div className="p-3">
              <div className="d-flex justify-content-between align-items-center mb-2 px-1">
                <span className="small text-muted fw-medium">Select Month ({viewYear})</span>
                <button
                  type="button"
                  className="btn btn-sm btn-link text-decoration-none p-0 text-primary small"
                  onClick={() => setViewMode('days')}
                >
                  Back to Days
                </button>
              </div>
              <div className="row g-2">
                {monthNames.map((mName, idx) => {
                  const isCurrentMonth = idx === viewMonth;
                  return (
                    <div className="col-4" key={mName}>
                      <button
                        type="button"
                        className={`btn btn-sm w-100 py-2 rounded-3 text-center fw-medium ${
                          isCurrentMonth
                            ? 'btn-primary shadow-xs'
                            : 'btn-outline-secondary border-0'
                        }`}
                        style={{ fontSize: '0.8rem' }}
                        onClick={() => {
                          setViewDate(new Date(viewYear, idx, 1));
                          setViewMode('days');
                        }}
                      >
                        {mName.slice(0, 3)}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* VIEW MODE 2: YEAR SELECTION GRID */}
          {viewMode === 'years' && (
            <div className="p-3">
              <div className="d-flex justify-content-between align-items-center mb-2 px-1">
                <span className="small text-muted fw-medium">Select Year</span>
                <button
                  type="button"
                  className="btn btn-sm btn-link text-decoration-none p-0 text-primary small"
                  onClick={() => setViewMode('days')}
                >
                  Back to Days
                </button>
              </div>
              <div
                className="overflow-y-auto pe-1"
                style={{ maxHeight: '220px', scrollbarWidth: 'thin' }}
              >
                <div className="row g-2">
                  {yearsRange.map((y) => {
                    const isCurrentYear = y === viewYear;
                    return (
                      <div className="col-3" key={y}>
                        <button
                          type="button"
                          className={`btn btn-sm w-100 py-1.5 rounded-2 text-center fw-medium ${
                            isCurrentYear
                              ? 'btn-primary shadow-xs'
                              : 'btn-outline-secondary border-0'
                          }`}
                          style={{ fontSize: '0.8rem' }}
                          onClick={() => {
                            setViewDate(new Date(y, viewMonth, 1));
                            setViewMode('days');
                          }}
                        >
                          {y}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* VIEW MODE 3: STANDARD DAYS GRID */}
          {viewMode === 'days' && (
            <div className="p-3">
              {/* Weekday Headers */}
              <div className="d-grid mb-1" style={{ gridTemplateColumns: 'repeat(7, 1fr)' }}>
                {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((d, i) => (
                  <div
                    key={d}
                    className={`text-center py-1 fw-bold ${
                      i === 0 || i === 6 ? 'text-muted opacity-75' : 'text-secondary'
                    }`}
                    style={{ fontSize: '0.72rem', letterSpacing: '0.02em' }}
                  >
                    {d}
                  </div>
                ))}
              </div>

              {/* Day Cells (42 grid) */}
              <div className="d-grid gap-1" style={{ gridTemplateColumns: 'repeat(7, 1fr)' }}>
                {calendarDays.map((item, idx) => {
                  const itemISO = formatDateToISO(item.date);
                  const isSelected = parsedDate && formatDateToISO(parsedDate) === itemISO;
                  const isToday = itemISO === todayStr;
                  const isCurrentMonth = item.month === 'current';
                  const isDayDisabled = isDateDisabled(item.date);

                  return (
                    <button
                      key={idx}
                      type="button"
                      disabled={isDayDisabled}
                      onClick={() => {
                        if (item.month !== 'current') {
                          // Switch month automatically
                          setViewDate(item.date);
                        }
                        handleSelectDay(item.day);
                      }}
                      className={`modern-datepicker-day btn btn-sm p-0 rounded-circle d-flex align-items-center justify-content-center transition-all ${
                        isDayDisabled
                          ? 'opacity-25'
                          : isSelected
                          ? 'btn-primary shadow-xs fw-bold'
                          : isToday
                          ? 'border border-primary fw-bold text-primary'
                          : isCurrentMonth
                          ? 'text-dark-emphasis'
                          : 'text-muted opacity-40'
                      }`}
                      style={{
                        height: '34px',
                        width: '34px',
                        margin: 'auto',
                        fontSize: '0.78rem',
                        cursor: isDayDisabled ? 'not-allowed' : 'pointer',
                        backgroundColor: isSelected
                          ? 'var(--bs-primary, #4c63d2)'
                          : isToday && !isSelected
                          ? 'var(--bs-primary-bg-subtle, rgba(76, 99, 210, 0.1))'
                          : 'transparent',
                        borderColor: isSelected
                          ? 'var(--bs-primary, #4c63d2)'
                          : isToday
                          ? 'var(--bs-primary, #4c63d2)'
                          : 'transparent',
                        color: isSelected ? '#ffffff' : undefined,
                      }}
                      title={`${item.date.toDateString()}${isToday ? ' (Today)' : ''}${
                        isDayDisabled ? ' (Disabled)' : ''
                      }`}
                    >
                      {item.day}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* FOOTER SHORTCUTS & ACTION BAR */}
          <div
            className="p-2 border-top d-flex align-items-center justify-content-between flex-wrap gap-1"
            style={{
              backgroundColor: 'var(--bs-tertiary-bg, rgba(0,0,0,0.02))',
              borderBottomLeftRadius: '12px',
              borderBottomRightRadius: '12px',
            }}
          >
            <div className="d-flex align-items-center gap-1">
              <button
                type="button"
                className="btn btn-sm btn-outline-primary py-0.5 px-2 rounded-pill"
                style={{ fontSize: '0.72rem' }}
                onClick={handleSelectToday}
              >
                Today
              </button>
              <button
                type="button"
                className="btn btn-sm btn-outline-secondary py-0.5 px-2 rounded-pill"
                style={{ fontSize: '0.72rem' }}
                onClick={handleSelectYesterday}
              >
                Yesterday
              </button>
              <button
                type="button"
                className="btn btn-sm btn-outline-secondary py-0.5 px-2 rounded-pill"
                style={{ fontSize: '0.72rem' }}
                onClick={handleSelectIn7Days}
              >
                +7 Days
              </button>
            </div>

            {parsedDate && (
              <button
                type="button"
                className="btn btn-sm btn-link text-danger text-decoration-none py-0.5 px-1 small"
                style={{ fontSize: '0.72rem' }}
                onClick={handleClear}
              >
                Clear
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
