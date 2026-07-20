import React, { useState } from 'react';
import {
  useGetUsersQuery,
  useAddUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation
} from '../app/api';

// Import our custom reusable components
import Box from '../components/Common/Box';
import Card from '../components/Common/Card';
import DataTable from '../components/Common/DataTable';
import Alert from '../components/Common/Alert';
import Dropdown from '../components/Common/Dropdown';
import Modal from '../components/Common/Modal';

export default function Users() {
  // Query and Mutation hooks from Redux RTK Query
  const { data: users = [], isLoading, error } = useGetUsersQuery();
  const [addUser] = useAddUserMutation();
  const [updateUser] = useUpdateUserMutation();
  const [deleteUser] = useDeleteUserMutation();

  // Component UI State managers
  const [selectedRoles, setSelectedRoles] = useState([]); // Multiple roles filtered
  const [selectedStatus, setSelectedStatus] = useState('All'); // Single status filtered
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null); // null if adding new user
  const [alertInfo, setAlertInfo] = useState(null); // { message, type } for feedback

  // Custom Confirmation Modal state
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    title: '',
    message: '',
    confirmText: 'Confirm',
    confirmClass: 'btn-danger',
    onConfirm: null
  });

  const triggerConfirmation = ({ title, message, onConfirm, confirmText = 'Confirm', confirmClass = 'btn-danger' }) => {
    setConfirmModal({
      isOpen: true,
      title,
      message,
      confirmText,
      confirmClass,
      onConfirm: () => {
        onConfirm();
        setConfirmModal(prev => ({ ...prev, isOpen: false }));
      }
    });
  };

  // Form Field States
  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formDepartment, setFormDepartment] = useState('');
  const [formRole, setFormRole] = useState('Developer'); // Single select value inside form
  const [formStatus, setFormStatus] = useState('Active');

  // Trigger feedback alerts
  const showAlert = (message, type = 'success') => {
    setAlertInfo({ message, type });
  };

  // Open modal for editing or creating
  const handleOpenForm = (user = null) => {
    if (user) {
      setEditingUser(user);
      setFormName(user.name);
      setFormEmail(user.email);
      setFormDepartment(user.department);
      setFormRole(user.role);
      setFormStatus(user.status);
    } else {
      setEditingUser(null);
      setFormName('');
      setFormEmail('');
      setFormDepartment('Technology');
      setFormRole('Developer');
      setFormStatus('Active');
    }
    setShowForm(true);
  };

  // Submit User addition/updation
  const handleSubmitForm = async (e) => {
    e.preventDefault();
    if (!formName || !formEmail) {
      showAlert('Please enter Name and Email fields.', 'danger');
      return;
    }

    const payload = {
      name: formName,
      email: formEmail,
      department: formDepartment || 'General',
      role: formRole,
      status: formStatus
    };

    try {
      if (editingUser) {
        await updateUser({ id: editingUser.id, ...payload }).unwrap();
        showAlert(`User account for "${formName}" updated successfully.`, 'success');
      } else {
        await addUser(payload).unwrap();
        showAlert(`New user account "${formName}" created successfully!`, 'success');
      }
      setShowForm(false);
    } catch (err) {
      console.error('Error saving user:', err);
      showAlert('An error occurred while saving the user account.', 'danger');
    }
  };

  // Delete User Action
  const handleDeleteUser = async (id, name) => {
    triggerConfirmation({
      title: 'Delete User Account',
      message: `Are you sure you want to permanently delete user account "${name}"? This action cannot be undone and will revoke access immediately.`,
      confirmText: 'Delete User',
      confirmClass: 'btn-danger',
      onConfirm: async () => {
        try {
          await deleteUser(id).unwrap();
          showAlert(`User account "${name}" deleted successfully.`, 'info');
        } catch (err) {
          console.error('Error deleting user:', err);
          showAlert('Error deleting user account.', 'danger');
        }
      }
    });
  };

  // Options configuration lists
  const roleFilterOptions = [
    { value: 'Admin', label: 'Admin Role', icon: 'bi bi-shield-lock-fill' },
    { value: 'Manager', label: 'Manager Role', icon: 'bi bi-briefcase-fill' },
    { value: 'Developer', label: 'Developer Role', icon: 'bi bi-code-slash' },
    { value: 'Designer', label: 'Designer Role', icon: 'bi bi-palette-fill' },
    { value: 'Support', label: 'Support Role', icon: 'bi bi-headset' }
  ];

  const statusOptions = [
    { value: 'All', label: 'All Statuses' },
    { value: 'Active', label: 'Active Only' },
    { value: 'Inactive', label: 'Inactive Only' }
  ];

  const departmentOptions = [
    'Technology',
    'Marketing',
    'Customer Success',
    'Design',
    'Human Resources',
    'Finance'
  ];

  // Apply filters on users data
  const filteredUsers = React.useMemo(() => {
    return users.filter((user) => {
      // 1. Filter by multi-selected roles (if any are selected)
      if (selectedRoles.length > 0 && !selectedRoles.includes(user.role)) {
        return false;
      }
      // 2. Filter by selected status (if not 'All')
      if (selectedStatus !== 'All' && user.status !== selectedStatus) {
        return false;
      }
      return true;
    });
  }, [users, selectedRoles, selectedStatus]);

  // Columns definition for DataTable component
  const columns = [
    {
      key: 'name',
      label: 'Team Member',
      sortable: true,
      render: (row) => {
        // Resolve profile initials for avatar visual
        const initials = row.name
          ? row.name.split(' ').map((n) => n[0]).join('').substring(0, 2).toUpperCase()
          : 'U';
        
        return (
          <Box display="flex" alignItems="center" gap={3}>
            <div
              className="rounded-circle d-flex align-items-center justify-content-center bg-primary text-white font-weight-medium fw-bold"
              style={{ width: '38px', height: '38px', fontSize: '0.85rem' }}
            >
              {initials}
            </div>
            <div>
              <h6 className="mb-0 fw-medium text-dark-emphasis">{row.name}</h6>
              <small className="text-muted text-truncate" style={{ fontSize: '0.75rem' }}>{row.email}</small>
            </div>
          </Box>
        );
      }
    },
    {
      key: 'department',
      label: 'Department',
      sortable: true,
      render: (row) => (
        <span className="text-muted fw-light" style={{ fontSize: '0.85rem' }}>
          {row.department}
        </span>
      )
    },
    {
      key: 'role',
      label: 'Security Role',
      sortable: true,
      render: (row) => {
        let badgeColor = 'bg-secondary-subtle text-secondary';
        if (row.role === 'Admin') badgeColor = 'bg-danger-subtle text-danger';
        else if (row.role === 'Manager') badgeColor = 'bg-warning-subtle text-warning';
        else if (row.role === 'Developer') badgeColor = 'bg-primary-subtle text-primary';
        else if (row.role === 'Designer') badgeColor = 'bg-info-subtle text-info';
        else if (row.role === 'Support') badgeColor = 'bg-success-subtle text-success';

        return (
          <span className={`badge ${badgeColor} py-1 px-2.5 rounded`} style={{ fontSize: '0.75rem', fontWeight: '500' }}>
            {row.role}
          </span>
        );
      }
    },
    {
      key: 'status',
      label: 'Account Status',
      sortable: true,
      render: (row) => {
        const isActive = row.status === 'Active';
        return (
          <span className={`d-inline-flex align-items-center gap-1.5 badge ${isActive ? 'bg-success-subtle text-success' : 'bg-light text-muted'} py-1 px-2 rounded`}>
            <span
              className="rounded-circle"
              style={{
                width: '6px',
                height: '6px',
                backgroundColor: isActive ? '#22ca80' : '#b8c3d5',
                display: 'inline-block'
              }}
            ></span>
            <span style={{ fontSize: '0.75rem', fontWeight: '500' }}>{row.status}</span>
          </span>
        );
      }
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (row) => (
        <div className="d-flex gap-2">
          <button
            onClick={() => handleOpenForm(row)}
            className="btn btn-outline-secondary btn-sm p-0 d-flex align-items-center justify-content-center border-0 rounded-circle"
            style={{ width: '32px', height: '32px' }}
            title="Edit User"
          >
            <i className="bi bi-pencil-square text-muted fs-6"></i>
          </button>
          <button
            onClick={() => handleDeleteUser(row.id, row.name)}
            className="btn btn-outline-danger btn-sm p-0 d-flex align-items-center justify-content-center border-0 rounded-circle"
            style={{ width: '32px', height: '32px' }}
            title="Delete User"
          >
            <i className="bi bi-trash3 text-danger fs-6"></i>
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="fade-in pb-5">
      {/* Title & Page Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="mb-1 text-dark-emphasis fw-bold">Users Workspace</h4>
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb mb-0" style={{ fontSize: '0.85rem' }}>
              <li className="breadcrumb-item">
                <span className="text-primary text-decoration-none">Workspace</span>
              </li>
              <li className="breadcrumb-item active" aria-current="page">
                Users Database
              </li>
            </ol>
          </nav>
        </div>
        <button className="btn btn-primary btn-sm px-4 shadow-sm" onClick={() => handleOpenForm(null)}>
          <i className="bi bi-person-plus-fill me-2"></i> Add User Record
        </button>
      </div>

      {/* Dynamic Feedback Notification alerts */}
      {alertInfo && (
        <Alert
          type={alertInfo.type}
          message={alertInfo.message}
          dismissible={true}
          autoCloseTime={5000}
          icon={true}
          onClose={() => setAlertInfo(null)}
          className="mb-4 shadow-sm"
        />
      )}

      {/* Loading & Error Indicators */}
      {isLoading && (
        <Box display="flex" justifyContent="center" alignItems="center" py={5}>
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading users directory...</span>
          </div>
        </Box>
      )}

      {error && (
        <Alert type="danger" message="Error loading workspace directory. Please refresh." icon="bi bi-exclamation-triangle" />
      )}

      {/* Filter Toolbar Card (Uses Box layout wrappers) */}
      {!isLoading && !error && (
        <>
          <Card className="mb-4" noBodyPadding={false}>
            <Box display="flex" flexDirection="column" gap={3}>
              <h6 className="text-dark-emphasis fw-semibold mb-0">Filters & Segments</h6>
              <div className="row g-3 align-items-end">
                {/* 1. Multiselect Dropdown Filter for Roles */}
                <div className="col-12 col-md-6">
                  <Dropdown
                    options={roleFilterOptions}
                    value={selectedRoles}
                    onChange={(roles) => setSelectedRoles(roles)}
                    isMulti={true}
                    searchable={true}
                    placeholder="All security roles"
                    label="Filter Security Roles (Multi-Select)"
                    maxSelectedDisplay={2}
                  />
                </div>

                {/* 2. Single-select Dropdown Filter for Statuses */}
                <div className="col-12 col-md-4">
                  <Dropdown
                    options={statusOptions}
                    value={selectedStatus}
                    onChange={(status) => setSelectedStatus(status)}
                    isMulti={false}
                    searchable={false}
                    placeholder="Filter status"
                    label="Account Status"
                  />
                </div>

                {/* 3. Reset Button */}
                <div className="col-12 col-md-2">
                  <button
                    className="btn btn-outline-secondary btn-sm w-100 py-2"
                    style={{ height: '42px', fontSize: '0.85rem' }}
                    onClick={() => {
                      setSelectedRoles([]);
                      setSelectedStatus('All');
                    }}
                    disabled={selectedRoles.length === 0 && selectedStatus === 'All'}
                  >
                    Clear Filters
                  </button>
                </div>
              </div>
            </Box>
          </Card>

          {/* Main Users Database DataTable Card */}
          <Card
            title="Security Accounts & Directory"
            subtitle={`Showing ${filteredUsers.length} total team entries matched against your current filter configurations.`}
            noBodyPadding={false}
          >
            <DataTable
              columns={columns}
              data={filteredUsers}
              initialRowsPerPage={5}
              rowsPerPageOptions={[5, 10, 15, 25]}
              searchable={true}
              searchPlaceholder="Search name, email, department..."
              striped={false}
              hover={true}
            />
          </Card>
        </>
      )}

      {/* Add / Edit User Record modal Form drawer */}
      {showForm && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center"
          style={{
            backgroundColor: 'rgba(28, 45, 65, 0.45)',
            backdropFilter: 'blur(3px)',
            zIndex: 1055,
            transition: 'opacity 0.2s ease-in'
          }}
          onClick={() => setShowForm(false)}
        >
          {/* Form Content container Box */}
          <div
            className="w-100 mx-3"
            style={{ maxWidth: '540px' }}
            onClick={(e) => e.stopPropagation()} // stop clicks closing modal
          >
            <Card
              title={editingUser ? 'Update Account Privileges' : 'Register New Security Account'}
              subtitle={editingUser ? `Updating account metadata for ID: ${editingUser.id}` : 'Create an authoritative login profile.'}
              className="fade-in shadow-lg border-light"
              noBodyPadding={false}
              footer={
                <div className="d-flex justify-content-end gap-2">
                  <button type="button" className="btn btn-light btn-sm px-3 border" onClick={() => setShowForm(false)}>
                    Close
                  </button>
                  <button type="button" className="btn btn-primary btn-sm px-4 shadow-sm" onClick={handleSubmitForm}>
                    {editingUser ? 'Save Privileges' : 'Create Account'}
                  </button>
                </div>
              }
            >
              <form onSubmit={handleSubmitForm}>
                <div className="row g-3">
                  {/* Full Name */}
                  <div className="col-12">
                    <label className="form-label fw-semibold text-dark-emphasis" style={{ fontSize: '0.85rem' }}>
                      Full Name
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. Sarah Connor"
                      value={formName}
                      onChange={(e) => setFormName(e.target.value)}
                      required
                    />
                  </div>

                  {/* Email address */}
                  <div className="col-12">
                    <label className="form-label fw-semibold text-dark-emphasis" style={{ fontSize: '0.85rem' }}>
                      Email Address
                    </label>
                    <input
                      type="email"
                      className="form-control"
                      placeholder="e.g. sarah@cyberdyne.com"
                      value={formEmail}
                      onChange={(e) => setFormEmail(e.target.value)}
                      required
                    />
                  </div>

                  {/* Role picker (Normal Single-select Dropdown inside form) */}
                  <div className="col-12 col-sm-6">
                    <Dropdown
                      options={roleFilterOptions.map((r) => ({ value: r.value, label: r.value, icon: r.icon }))}
                      value={formRole}
                      onChange={(role) => setFormRole(role)}
                      isMulti={false}
                      searchable={false}
                      placeholder="Select security role"
                      label="Security Role Assignee"
                    />
                  </div>

                  {/* Department select input */}
                  <div className="col-12 col-sm-6">
                    <label className="form-label fw-semibold text-dark-emphasis" style={{ fontSize: '0.85rem' }}>
                      Department
                    </label>
                    <select
                      className="form-select py-2"
                      style={{ height: '42px', fontSize: '0.9rem' }}
                      value={formDepartment}
                      onChange={(e) => setFormDepartment(e.target.value)}
                    >
                      {departmentOptions.map((dept) => (
                        <option key={dept} value={dept}>
                          {dept}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Status selection radio pills */}
                  <div className="col-12">
                    <label className="form-label fw-semibold text-dark-emphasis d-block mb-2" style={{ fontSize: '0.85rem' }}>
                      Login Authorization Status
                    </label>
                    <div className="d-flex gap-3">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="statusRadio"
                          id="statusActive"
                          checked={formStatus === 'Active'}
                          onChange={() => setFormStatus('Active')}
                        />
                        <label className="form-check-label text-dark-emphasis" htmlFor="statusActive" style={{ fontSize: '0.85rem' }}>
                          Active (Allow access)
                        </label>
                      </div>
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="statusRadio"
                          id="statusInactive"
                          checked={formStatus === 'Inactive'}
                          onChange={() => setFormStatus('Inactive')}
                        />
                        <label className="form-check-label text-dark-emphasis" htmlFor="statusInactive" style={{ fontSize: '0.85rem' }}>
                          Inactive (Revoke access)
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </form>
            </Card>
          </div>
        </div>
      )}

      {/* Custom Dynamic Modal Component */}
      <Modal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
        title={confirmModal.title}
        message={confirmModal.message}
        confirmText={confirmModal.confirmText}
        confirmClass={confirmModal.confirmClass}
        onConfirm={confirmModal.onConfirm}
        type="confirm"
        icon="bi-exclamation-triangle-fill"
        iconColorClass="text-danger bg-danger-subtle"
      />
    </div>
  );
}
