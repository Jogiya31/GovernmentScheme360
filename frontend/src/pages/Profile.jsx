import React from 'react';

export default function Profile() {
  return (
    <div className="fade-in">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="mb-1 text-dark-emphasis fw-bold">My Profile</h4>
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb mb-0" style={{ fontSize: '0.85rem' }}>
              <li className="breadcrumb-item"><span className="text-primary text-decoration-none">Home</span></li>
              <li className="breadcrumb-item active" aria-current="page">Profile</li>
            </ol>
          </nav>
        </div>
      </div>

      <div className="card shadow-sm border-0">
        <div className="card-body p-5 text-center">
          <i className="bi bi-person-circle text-muted display-4"></i>
          <h5 className="fw-semibold mt-3 mb-1">User Account Profile Workspace</h5>
          <p className="text-muted text-sm mx-auto" style={{ maxWidth: '400px' }}>
            This panel will integrate full user information updates, interactive forms validation via React Hook Form, and active avatar management in Milestone 2.
          </p>
        </div>
      </div>
    </div>
  );
}
