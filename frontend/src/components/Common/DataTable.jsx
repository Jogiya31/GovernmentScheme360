import React, { useState, useMemo, useRef, useEffect } from 'react';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

/**
 * DataTable component - A fully-featured dynamic data table.
 * Supports sorting, custom item rendering, pagination, global searches, responsive styling,
 * columns hide/show visibility toggling, and export functionality (CSV, Excel, PDF, Print).
 */
export default function DataTable({
  columns = [], // Array of column configs: { key, label, sortable, render(row) }
  data = [], // Array of row objects
  initialRowsPerPage = 5,
  rowsPerPageOptions = [5, 10, 20, 50],
  searchable = true,
  searchPlaceholder = 'Search records...',
  striped = false,
  bordered = false,
  hover = true,
  className = '',
  id,
  style = {},
  ...props
}) {
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(initialRowsPerPage);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Sort state: { key: string, direction: 'asc' | 'desc' | null }
  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });

  // Column Visibility state: list of visible column keys
  const [visibleKeys, setVisibleKeys] = useState([]);

  // Dropdown visibility states
  const [showColumnsMenu, setShowColumnsMenu] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);

  const columnsRef = useRef(null);
  const exportRef = useRef(null);

  // Initialize and synchronize visible columns when columns prop loads
  useEffect(() => {
    if (columns && columns.length > 0) {
      setVisibleKeys(columns.map((col) => col.key));
    }
  }, [columns]);

  // Click outside to dismiss menus
  useEffect(() => {
    function handleClickOutside(event) {
      if (columnsRef.current && !columnsRef.current.contains(event.target)) {
        setShowColumnsMenu(false);
      }
      if (exportRef.current && !exportRef.current.contains(event.target)) {
        setShowExportMenu(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Filter columns that are marked as visible
  const visibleColumns = useMemo(() => {
    return columns.filter((col) => visibleKeys.includes(col.key));
  }, [columns, visibleKeys]);

  // Reset page when search or row limit changes
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleRowsPerPageChange = (e) => {
    setRowsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  // Sorting handler
  const handleSort = (key, isSortable) => {
    if (!isSortable) return;
    
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    } else if (sortConfig.key === key && sortConfig.direction === 'desc') {
      direction = null; // reset
    }

    setSortConfig({ key: direction ? key : null, direction });
  };

  // 1. Filter rows by search term globally
  const filteredData = useMemo(() => {
    if (!searchTerm) return data;
    const lower = searchTerm.toLowerCase();

    return data.filter((row) => {
      return Object.keys(row).some((key) => {
        const val = row[key];
        if (val === null || val === undefined) return false;
        return String(val).toLowerCase().includes(lower);
      });
    });
  }, [data, searchTerm]);

  // 2. Sort filtered rows
  const sortedData = useMemo(() => {
    if (!sortConfig.key || !sortConfig.direction) return filteredData;

    const { key, direction } = sortConfig;
    const sorted = [...filteredData];

    sorted.sort((a, b) => {
      let valA = a[key];
      let valB = b[key];

      // Handle undefined/nulls
      if (valA === undefined || valA === null) valA = '';
      if (valB === undefined || valB === null) valB = '';

      // Numeric comparison
      if (typeof valA === 'number' && typeof valB === 'number') {
        return direction === 'asc' ? valA - valB : valB - valA;
      }

      // Standard string comparison
      const strA = String(valA).toLowerCase();
      const strB = String(valB).toLowerCase();

      if (strA < strB) return direction === 'asc' ? -1 : 1;
      if (strA > strB) return direction === 'asc' ? 1 : -1;
      return 0;
    });

    return sorted;
  }, [filteredData, sortConfig]);

  // 3. Paginate sorted rows
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * rowsPerPage;
    return sortedData.slice(startIndex, startIndex + rowsPerPage);
  }, [sortedData, currentPage, rowsPerPage]);

  // Pagination stats calculation
  const totalRecords = sortedData.length;
  const totalPages = Math.ceil(totalRecords / rowsPerPage) || 1;
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = Math.min(startIndex + rowsPerPage, totalRecords);

  const handlePageChange = (pageNum) => {
    if (pageNum >= 1 && pageNum <= totalPages) {
      setCurrentPage(pageNum);
    }
  };

  // Helper to extract a clean string value from a cell for exports
  const getRawCellValue = (row, col) => {
    const val = row[col.key];
    if (val === undefined || val === null) {
      // Fallbacks for custom properties if not directly on row
      if (col.key === 'name' && row.name) return row.name;
      if (col.key === 'status' && row.status) return row.status;
      if (col.key === 'role' && row.role) return row.role;
      if (col.key === 'department' && row.department) return row.department;
      return '';
    }
    if (typeof val === 'object') {
      return val.label || val.name || JSON.stringify(val);
    }
    return String(val);
  };

  // Toggle dynamic column visibility
  const toggleColumnVisibility = (key) => {
    setVisibleKeys((prevKeys) => {
      if (prevKeys.includes(key)) {
        // Prevent hiding ALL columns
        if (prevKeys.length <= 1) return prevKeys;
        return prevKeys.filter((k) => k !== key);
      } else {
        return [...prevKeys, key];
      }
    });
  };

  // ==========================================
  // EXPORT UTILITIES
  // ==========================================

  // 1. Export as CSV File
  const handleExportCSV = () => {
    const headers = visibleColumns.map((col) => col.label);
    const rows = sortedData.map((row) =>
      visibleColumns.map((col) => {
        const value = getRawCellValue(row, col);
        // Escape double quotes and enclose fields containing quotes/commas/newlines
        const escaped = String(value).replace(/"/g, '""');
        if (escaped.includes(',') || escaped.includes('\n') || escaped.includes('"')) {
          return `"${escaped}"`;
        }
        return escaped;
      })
    );

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `table-export-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setShowExportMenu(false);
  };

  // 2. Export as Microsoft Excel File (.xls XML Spreadsheet)
  const handleExportExcel = () => {
    const sheetName = 'Database Export';
    let xmlString = `<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">`;
    xmlString += `<head><meta charset="utf-8"><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>${sheetName}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body>`;
    xmlString += `<table border="1" style="border-collapse:collapse; font-family:sans-serif;">`;
    
    // Headers
    xmlString += `<tr style="background-color:#5f76e8; color:#ffffff; font-weight:bold;">`;
    visibleColumns.forEach((col) => {
      xmlString += `<th style="padding:8px; text-align:left;">${col.label}</th>`;
    });
    xmlString += `</tr>`;

    // Rows
    sortedData.forEach((row) => {
      xmlString += `<tr>`;
      visibleColumns.forEach((col) => {
        const val = getRawCellValue(row, col);
        xmlString += `<td style="padding:6px; text-align:left;">${val}</td>`;
      });
      xmlString += `</tr>`;
    });

    xmlString += `</table></body></html>`;

    const blob = new Blob([xmlString], { type: 'application/vnd.ms-excel;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `excel-export-${new Date().toISOString().slice(0, 10)}.xls`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setShowExportMenu(false);
  };

  // 3. Export as Pristine PDF Document (using jsPDF + autoTable)
  const handleExportPDF = () => {
    try {
      const doc = new jsPDF();
      doc.setFont('helvetica');
      
      // Document Title Header
      doc.setFontSize(16);
      doc.setTextColor(33, 37, 41);
      doc.text('Workspace Database Registry', 14, 15);
      
      doc.setFontSize(9);
      doc.setTextColor(108, 117, 125);
      doc.text(`Generated: ${new Date().toLocaleString()} | Total matched entries: ${sortedData.length}`, 14, 21);

      // Define table structures
      const headers = visibleColumns.map((col) => col.label);
      const rows = sortedData.map((row) =>
        visibleColumns.map((col) => getRawCellValue(row, col))
      );

      autoTable(doc, {
        head: [headers],
        body: rows,
        startY: 26,
        theme: 'striped',
        headStyles: { fillColor: [95, 118, 232], fontSize: 9, fontStyle: 'bold' },
        bodyStyles: { fontSize: 8.5 },
        margin: { left: 14, right: 14 }
      });

      doc.save(`pdf-export-${new Date().toISOString().slice(0, 10)}.pdf`);
    } catch (err) {
      console.error('Error compiling PDF file:', err);
    }
    setShowExportMenu(false);
  };

  // 4. Print Data Table directly
  const handlePrintTable = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    printWindow.document.write(`
      <html>
        <head>
          <title>Workspace Print Registry</title>
          <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css">
          <style>
            body { padding: 40px; font-family: 'Rubik', sans-serif; background-color: #fff; color: #1c2d41; }
            h2 { font-weight: 600; margin-bottom: 5px; color: #5f76e8; }
            .meta { font-size: 0.85rem; color: #6c757d; margin-bottom: 30px; }
            table { width: 100%; border-collapse: collapse; margin-top: 10px; }
            th { background-color: #f8f9fa !important; font-weight: 600; font-size: 0.85rem; text-transform: uppercase; letter-spacing: 0.05em; color: #4F5467; }
            td { font-size: 0.85rem; color: #212529; }
            th, td { padding: 12px 15px; border: 1px solid #dee2e6; text-align: left; }
            @media print {
              body { padding: 0; }
              .no-print { display: none; }
            }
          </style>
        </head>
        <body>
          <div class="d-flex justify-content-between align-items-center mb-3">
            <div>
              <h2>Workspace Database Registry</h2>
              <div class="meta">Printed: ${new Date().toLocaleString()} | Filtered records: ${sortedData.length}</div>
            </div>
            <button onclick="window.print();" class="btn btn-primary btn-sm no-print px-4 py-2">
              <i class="bi bi-printer me-2"></i>Trigger Print
            </button>
          </div>
          <table class="table table-striped table-bordered">
            <thead>
              <tr>
                ${visibleColumns.map((col) => `<th>${col.label}</th>`).join('')}
              </tr>
            </thead>
            <tbody>
              ${sortedData
                .map(
                  (row) => `
                <tr>
                  ${visibleColumns.map((col) => `<td>${getRawCellValue(row, col)}</td>`).join('')}
                </tr>
              `
                )
                .join('')}
            </tbody>
          </table>
          <script>
            // Auto trigger printer interface once stylesheet is fully mapped
            window.onload = function() {
              window.focus();
            }
          </script>
        </body>
      </html>
    `);

    printWindow.document.close();
    setShowExportMenu(false);
  };

  return (
    <div id={id} className={`data-table-container ${className}`} style={style} {...props}>
      {/* Search & Control Header Area */}
      <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-4">
        
        {/* Global Filter Search (Left aligned) */}
        {searchable ? (
          <div className="input-group input-group-sm" style={{ maxWidth: '280px' }}>
            <span className="input-group-text bg-white border-end-0">
              <i className="bi bi-search text-muted"></i>
            </span>
            <input
              type="text"
              className="form-control border-start-0"
              placeholder={searchPlaceholder}
              value={searchTerm}
              onChange={handleSearchChange}
              id="datatable-search-input"
            />
          </div>
        ) : (
          <div />
        )}

        {/* Custom Actions (Columns Show/Hide Selector, Exporters & Rows limit) */}
        <div className="d-flex flex-wrap align-items-center gap-2">
          
          {/* Columns Dynamic Hide/Show Checklist Dropdown */}
          <div className="position-relative" ref={columnsRef}>
            <button
              type="button"
              className="btn btn-outline-secondary btn-sm d-flex align-items-center gap-1.5"
              style={{ height: '36px' }}
              onClick={() => {
                setShowColumnsMenu(!showColumnsMenu);
                setShowExportMenu(false);
              }}
              id="column-visibility-toggle-btn"
            >
              <i className="bi bi-layout-three-columns"></i>
              <span>Columns</span>
              <span className="badge bg-secondary text-white rounded-pill ms-1" style={{ fontSize: '0.7rem' }}>
                {visibleKeys.length}/{columns.length}
              </span>
            </button>

            {showColumnsMenu && (
              <div
                className="position-absolute end-0 mt-1 bg-body border rounded shadow-lg p-2"
                style={{ zIndex: 1150, minWidth: '190px' }}
                id="columns-visibility-menu"
              >
                <div className="p-1.5 border-bottom mb-1.5">
                  <span className="fw-semibold text-muted" style={{ fontSize: '0.75rem', textTransform: 'uppercase' }}>
                    Toggle Columns
                  </span>
                </div>
                <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
                  {columns.map((col) => {
                    const isVisible = visibleKeys.includes(col.key);
                    return (
                      <div
                        key={col.key}
                        className="form-check py-1 px-3 d-flex align-items-center gap-2 cursor-pointer hover-bg rounded"
                        onClick={() => toggleColumnVisibility(col.key)}
                        style={{ fontSize: '0.85rem' }}
                      >
                        <input
                          type="checkbox"
                          className="form-check-input mt-0"
                          id={`col-chk-${col.key}`}
                          checked={isVisible}
                          onChange={() => {}} // Handle on parent div click for a wider touch target
                          style={{ pointerEvents: 'none' }}
                        />
                        <label
                          className="form-check-label text-dark-emphasis mb-0 cursor-pointer select-none"
                          style={{ pointerEvents: 'none' }}
                        >
                          {col.label}
                        </label>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Export Options Dropdown Menu */}
          <div className="position-relative" ref={exportRef}>
            <button
              type="button"
              className="btn btn-outline-secondary btn-sm d-flex align-items-center gap-1.5"
              style={{ height: '36px' }}
              onClick={() => {
                setShowExportMenu(!showExportMenu);
                setShowColumnsMenu(false);
              }}
              id="export-options-toggle-btn"
            >
              <i className="bi bi-download"></i>
              <span>Export</span>
              <i className="bi bi-chevron-down text-muted fs-7 ms-0.5"></i>
            </button>

            {showExportMenu && (
              <div
                className="position-absolute end-0 mt-1 bg-body border rounded shadow-lg p-1.5"
                style={{ zIndex: 1150, minWidth: '170px' }}
                id="export-options-menu"
              >
                <button
                  onClick={handleExportCSV}
                  className="dropdown-item py-2 d-flex align-items-center gap-2 rounded text-dark-emphasis"
                  style={{ fontSize: '0.85rem' }}
                >
                  <i className="bi bi-file-earmark-spreadsheet text-success"></i> Export as CSV
                </button>
                <button
                  onClick={handleExportExcel}
                  className="dropdown-item py-2 d-flex align-items-center gap-2 rounded text-dark-emphasis"
                  style={{ fontSize: '0.85rem' }}
                >
                  <i className="bi bi-file-earmark-excel text-success"></i> Export to Excel
                </button>
                <button
                  onClick={handleExportPDF}
                  className="dropdown-item py-2 d-flex align-items-center gap-2 rounded text-dark-emphasis"
                  style={{ fontSize: '0.85rem' }}
                >
                  <i className="bi bi-filetype-pdf text-danger"></i> Save as PDF File
                </button>
                <hr className="my-1" />
                <button
                  onClick={handlePrintTable}
                  className="dropdown-item py-2 d-flex align-items-center gap-2 rounded text-dark-emphasis"
                  style={{ fontSize: '0.85rem' }}
                >
                  <i className="bi bi-printer text-primary"></i> Print Table
                </button>
              </div>
            )}
          </div>

          {/* Rows Limit Multi-selector Select */}
          {rowsPerPageOptions.length > 0 && (
            <div className="d-flex align-items-center gap-1.5">
              <span className="text-muted" style={{ fontSize: '0.8rem' }}>Show:</span>
              <select
                className="form-select form-select-sm"
                style={{ width: '75px', height: '36px' }}
                value={rowsPerPage}
                onChange={handleRowsPerPageChange}
                id="datatable-rows-limit-select"
              >
                {rowsPerPageOptions.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>
          )}

        </div>
      </div>

      {/* Main Table Responsive Grid Container */}
      <div className="table-responsive bg-transparent rounded border border-light">
        <table
          className={`table v-middle mb-0 ${striped ? 'table-striped' : ''} ${
            bordered ? 'table-bordered' : ''
          } ${hover ? 'table-hover' : ''}`}
        >
          {/* Table Headers */}
          <thead className="bg-light">
            <tr>
              {visibleColumns.map((col) => {
                const isSortable = col.sortable;
                const isSortedCol = sortConfig.key === col.key;
                
                return (
                  <th
                    key={col.key}
                    onClick={() => handleSort(col.key, isSortable)}
                    className={`${isSortable ? 'cursor-pointer select-none' : ''} text-muted py-3 px-3`}
                    style={{ fontSize: '0.85rem', fontWeight: '600' }}
                  >
                    <div className="d-flex align-items-center gap-1">
                      <span>{col.label}</span>
                      {isSortable && (
                        <span className="text-muted" style={{ fontSize: '0.75rem' }}>
                          {isSortedCol ? (
                            sortConfig.direction === 'asc' ? (
                              <i className="bi bi-arrow-up text-primary"></i>
                            ) : (
                              <i className="bi bi-arrow-down text-primary"></i>
                            )
                          ) : (
                            <i className="bi bi-arrow-down-up opacity-50"></i>
                          )}
                        </span>
                      )}
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>

          {/* Table Body Content Rows */}
          <tbody>
            {paginatedData.length === 0 ? (
              <tr>
                <td colSpan={visibleColumns.length} className="text-center py-5 text-muted">
                  No records match your request
                </td>
              </tr>
            ) : (
              paginatedData.map((row, rowIndex) => (
                <tr key={row.id || rowIndex}>
                  {visibleColumns.map((col) => (
                    <td key={col.key} className="py-3 px-3 text-dark-emphasis align-middle" style={{ fontSize: '0.9rem' }}>
                      {col.render ? col.render(row) : getRawCellValue(row, col)}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Footer Pagination Navigation bar */}
      {totalPages > 0 && (
        <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mt-4 pt-2">
          {/* Info stats */}
          <div className="text-muted" style={{ fontSize: '0.85rem' }}>
            {totalRecords > 0 ? (
              <>
                Showing <strong className="text-dark">{startIndex + 1}</strong> to{' '}
                <strong className="text-dark">{endIndex}</strong> of{' '}
                <strong className="text-dark">{totalRecords}</strong> results
              </>
            ) : (
              'No records to display'
            )}
          </div>

          {/* Page numbers navigation buttons */}
          {totalPages > 1 && (
            <nav aria-label="Table pagination">
              <ul className="pagination pagination-sm mb-0 rounded gap-1">
                {/* Previous button */}
                <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                  <button
                    className="page-link d-flex align-items-center justify-content-center"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    style={{ width: '32px', height: '32px', borderRadius: '4px' }}
                  >
                    <i className="bi bi-chevron-left"></i>
                  </button>
                </li>

                {/* Page numbers */}
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                  <li key={pageNum} className={`page-item ${currentPage === pageNum ? 'active' : ''}`}>
                    <button
                      className="page-link d-flex align-items-center justify-content-center"
                      onClick={() => handlePageChange(pageNum)}
                      style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '4px',
                        backgroundColor: currentPage === pageNum ? '#5f76e8' : 'transparent',
                        borderColor: currentPage === pageNum ? '#5f76e8' : '#e9ecef',
                        color: currentPage === pageNum ? '#ffffff' : '#7c8798'
                      }}
                    >
                      {pageNum}
                    </button>
                  </li>
                ))}

                {/* Next button */}
                <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                  <button
                    className="page-link d-flex align-items-center justify-content-center"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    style={{ width: '32px', height: '32px', borderRadius: '4px' }}
                  >
                    <i className="bi bi-chevron-right"></i>
                  </button>
                </li>
              </ul>
            </nav>
          )}
        </div>
      )}
    </div>
  );
}
