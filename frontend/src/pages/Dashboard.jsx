import React from 'react';
import { useGetDashboardSummaryQuery } from '../app/api';

export default function Dashboard() {
  const { data: summary, isLoading, error } = useGetDashboardSummaryQuery();

  return (
    <div className="fade-in">
      {/* Breadcrumbs and page header */}
      <div className="d-flex justify-content-between align-items-center mb-4 mt-2">
        <div>
          <h4 className="mb-1 text-dark-emphasis fw-bold">Dashboard Overview</h4>
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb mb-0" style={{ fontSize: '0.85rem' }}>
              <li className="breadcrumb-item"><span className="text-primary text-decoration-none">Home</span></li>
              <li className="breadcrumb-item active" aria-current="page">Dashboard</li>
            </ol>
          </nav>
        </div>
        <div className="d-flex gap-2">
          <button className="btn btn-outline-primary btn-sm px-3">
            <i className="bi bi-download me-1"></i> Export Report
          </button>
        </div>
      </div>

      {/* Loading & Error triggers for testing */}
      {isLoading && (
        <div className="d-flex justify-content-center align-items-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading dashboard assets...</span>
          </div>
        </div>
      )}

      {error && (
        <div className="alert alert-danger" role="alert">
          <i className="bi bi-exclamation-triangle-fill me-2"></i>
          Error loading dashboard summary. Please retry later.
        </div>
      )}

      {!isLoading && !error && summary && (
        <div className="row g-4">
          {/* Revenue Card */}
          <div className="col-12 col-sm-6 col-xl-3">
            <div className="card border-0 h-100 shadow-sm">
              <div className="card-body p-4">
                <div className="d-flex justify-content-between align-items-start mb-3">
                  <div>
                    <span className="text-muted text-uppercase fw-semibold" style={{ fontSize: '0.75rem', letterSpacing: '0.05em' }}>Revenue</span>
                    <h3 className="fw-bold text-dark-emphasis mt-1 mb-0">${summary.revenue.total.toLocaleString()}</h3>
                  </div>
                  <span className="badge bg-primary-subtle text-primary p-2.5 rounded-pill d-flex align-items-center justify-content-center" style={{ width: '42px', height: '42px' }}>
                    <i className="bi bi-wallet2 fs-5"></i>
                  </span>
                </div>
                <div className="d-flex align-items-center gap-1 text-success" style={{ fontSize: '0.85rem' }}>
                  <i className="bi bi-arrow-up-right fw-bold"></i>
                  <span className="fw-semibold">+{summary.revenue.change}%</span>
                  <span className="text-muted ms-1">{summary.revenue.period}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Users Card */}
          <div className="col-12 col-sm-6 col-xl-3">
            <div className="card border-0 h-100 shadow-sm">
              <div className="card-body p-4">
                <div className="d-flex justify-content-between align-items-start mb-3">
                  <div>
                    <span className="text-muted text-uppercase fw-semibold" style={{ fontSize: '0.75rem', letterSpacing: '0.05em' }}>Total Users</span>
                    <h3 className="fw-bold text-dark-emphasis mt-1 mb-0">{summary.users.total}</h3>
                  </div>
                  <span className="badge bg-success-subtle text-success p-2.5 rounded-pill d-flex align-items-center justify-content-center" style={{ width: '42px', height: '42px' }}>
                    <i className="bi bi-people fs-5"></i>
                  </span>
                </div>
                <div className="d-flex align-items-center gap-1 text-success" style={{ fontSize: '0.85rem' }}>
                  <i className="bi bi-arrow-up-right fw-bold"></i>
                  <span className="fw-semibold">+{summary.users.change}%</span>
                  <span className="text-muted ms-1">{summary.users.period}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Projects Card */}
          <div className="col-12 col-sm-6 col-xl-3">
            <div className="card border-0 h-100 shadow-sm">
              <div className="card-body p-4">
                <div className="d-flex justify-content-between align-items-start mb-3">
                  <div>
                    <span className="text-muted text-uppercase fw-semibold" style={{ fontSize: '0.75rem', letterSpacing: '0.05em' }}>Active Projects</span>
                    <h3 className="fw-bold text-dark-emphasis mt-1 mb-0">{summary.projects.total}</h3>
                  </div>
                  <span className="badge bg-warning-subtle text-warning p-2.5 rounded-pill d-flex align-items-center justify-content-center" style={{ width: '42px', height: '42px' }}>
                    <i className="bi bi-folder2 fs-5"></i>
                  </span>
                </div>
                <div className="d-flex align-items-center gap-1 text-danger" style={{ fontSize: '0.85rem' }}>
                  <i className="bi bi-arrow-down-left fw-bold"></i>
                  <span className="fw-semibold">{summary.projects.change}%</span>
                  <span className="text-muted ms-1">{summary.projects.period}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Tasks Progress Card */}
          <div className="col-12 col-sm-6 col-xl-3">
            <div className="card border-0 h-100 shadow-sm">
              <div className="card-body p-4">
                <div className="d-flex justify-content-between align-items-start mb-3">
                  <div>
                    <span className="text-muted text-uppercase fw-semibold" style={{ fontSize: '0.75rem', letterSpacing: '0.05em' }}>Tasks Ratio</span>
                    <h3 className="fw-bold text-dark-emphasis mt-1 mb-0">{summary.tasks.percentage}%</h3>
                  </div>
                  <span className="badge bg-danger-subtle text-danger p-2.5 rounded-pill d-flex align-items-center justify-content-center" style={{ width: '42px', height: '42px' }}>
                    <i className="bi bi-check2-circle fs-5"></i>
                  </span>
                </div>
                <div className="progress mb-1" style={{ height: '6px' }}>
                  <div
                    className="progress-bar bg-danger"
                    role="progressbar"
                    style={{ width: `${summary.tasks.percentage}%` }}
                    aria-valuenow={summary.tasks.percentage}
                    aria-valuemin="0"
                    aria-valuemax="100"
                  ></div>
                </div>
                <div className="text-muted" style={{ fontSize: '0.8rem' }}>
                  Completed {summary.tasks.completed} out of {summary.tasks.total}
                </div>
              </div>
            </div>
          </div>

        
        </div>
      )}
    </div>
  );
}
