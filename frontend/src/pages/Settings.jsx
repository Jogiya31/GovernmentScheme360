import React, { useState } from 'react';
import {
  useGetRolesQuery,
  useAddRoleMutation,
  useUpdateRoleMutation,
  useDeleteRoleMutation,
  useGetDepartmentsQuery,
  useAddDepartmentMutation,
  useUpdateDepartmentMutation,
  useDeleteDepartmentMutation,
  useGetMinistriesQuery,
  useAddMinistryMutation,
  useUpdateMinistryMutation,
  useDeleteMinistryMutation,
} from '../app/api';

// Shared modular component for settings lists
export const RenderList = ({
  title,
  list,
  isLoading,
  fieldName,
  onAdd,
  onUpdate,
  onDelete,
}) => {
  const [newItem, setNewItem] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editingText, setEditingText] = useState('');

  const filteredList = list.filter(item =>
    item.title && item.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAdd = async () => {
    if (!newItem.trim()) return;
    try {
      await onAdd(newItem.trim());
      setNewItem('');
    } catch (err) {
      console.error('Error adding item:', err);
    }
  };

  const handleSave = async (id) => {
    if (!editingText.trim()) return;
    try {
      await onUpdate({ id, title: editingText.trim() });
      setEditingId(null);
    } catch (err) {
      console.error('Error updating item:', err);
    }
  };

  const handleToggleStatus = async (id, currentStatus) => {
    try {
      await onUpdate({ id, status: !currentStatus });
    } catch (err) {
      console.error('Error toggling status:', err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm(`Are you sure you want to permanently delete this ${fieldName.toLowerCase()}?`)) {
      try {
        await onDelete(id);
      } catch (err) {
        console.error('Error deleting item:', err);
      }
    }
  };

  return (
    <div className="card shadow-sm border-0 h-100">
      <div className="card-header bg-white py-3 border-bottom d-flex justify-content-between align-items-center">
        <h6 className="mb-0 fw-bold text-dark-emphasis">{title}</h6>
        <span className="badge bg-primary-subtle text-primary py-1 px-2.5 rounded" style={{ fontSize: '0.75rem', fontWeight: '500' }}>
          {filteredList.length} items
        </span>
      </div>
      <div className="card-body p-3 d-flex flex-column" style={{ minHeight: '420px' }}>
        {/* Search box */}
        <div className="mb-3 position-relative">
          <input
            type="text"
            className="form-control form-control-sm ps-4 py-2"
            placeholder={`Search ${fieldName.toLowerCase()}...`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <i className="bi bi-search text-muted position-absolute start-0 top-50 translate-middle-y ms-1" style={{ fontSize: '0.8rem' }}></i>
          {searchTerm && (
            <button
              className="btn btn-link btn-sm position-absolute end-0 top-50 translate-middle-y me-1 p-0 text-decoration-none text-muted"
              onClick={() => setSearchTerm('')}
            >
              <i className="bi bi-x-lg" style={{ fontSize: '0.75rem' }}></i>
            </button>
          )}
        </div>

        {/* List group */}
        <div className="flex-grow-1 overflow-auto pe-1 mb-3" style={{ maxHeight: '280px', minHeight: '200px' }}>
          {isLoading ? (
            <div className="text-center py-5">
              <div className="spinner-border spinner-border-sm text-primary" role="status"></div>
            </div>
          ) : filteredList.length === 0 ? (
            <div className="text-center py-5 text-muted" style={{ fontSize: '0.85rem' }}>
              No {fieldName.toLowerCase()}s found
            </div>
          ) : (
            <div className="list-group list-group-flush">
              {filteredList.map((item, idx) => (
                <div
                  key={item.id}
                  className={`list-group-item px-1 py-2.5 border-bottom d-flex justify-content-between align-items-center ${!item.status ? 'opacity-50' : ''}`}
                  style={{ fontSize: '0.85rem' }}
                >
                  <div className="d-flex align-items-center flex-grow-1 me-2 overflow-hidden">
                    <span className="text-muted me-2" style={{ width: '20px', fontSize: '0.75rem' }}>
                      {idx + 1}.
                    </span>
                    {editingId === item.id ? (
                      <input
                        type="text"
                        className="form-control form-control-sm w-100 py-1"
                        value={editingText}
                        onChange={(e) => setEditingText(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleSave(item.id);
                          else if (e.key === 'Escape') setEditingId(null);
                        }}
                        autoFocus
                      />
                    ) : (
                      <span className="text-truncate fw-medium text-dark-emphasis">{item.title}</span>
                    )}
                  </div>

                  <div className="d-flex align-items-center gap-1.5">
                    {editingId === item.id ? (
                      <>
                        <button
                          title="Save"
                          className="btn btn-outline-success btn-sm p-0 d-flex align-items-center justify-content-center border-0 rounded-circle"
                          style={{ width: '28px', height: '28px' }}
                          onClick={() => handleSave(item.id)}
                        >
                          <i className="bi bi-check-lg text-success fs-6"></i>
                        </button>
                        <button
                          title="Cancel"
                          className="btn btn-outline-secondary btn-sm p-0 d-flex align-items-center justify-content-center border-0 rounded-circle"
                          style={{ width: '28px', height: '28px' }}
                          onClick={() => setEditingId(null)}
                        >
                          <i className="bi bi-x"></i>
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          title="Edit Name"
                          className="btn btn-outline-secondary btn-sm p-0 d-flex align-items-center justify-content-center border-0 rounded-circle"
                          style={{ width: '28px', height: '28px' }}
                          onClick={() => {
                            setEditingId(item.id);
                            setEditingText(item.title);
                          }}
                        >
                          <i className="bi bi-pencil-square text-muted" style={{ fontSize: '0.8rem' }}></i>
                        </button>
                        <button
                          title={item.status ? 'Deactivate' : 'Activate'}
                          className="btn btn-sm p-0 d-flex align-items-center justify-content-center border-0 rounded-circle"
                          style={{ width: '28px', height: '28px' }}
                          onClick={() => handleToggleStatus(item.id, item.status)}
                        >
                          <i className={`bi ${item.status ? 'bi-check-circle-fill text-success' : 'bi-x-circle text-muted'} fs-6`}></i>
                        </button>
                        <button
                          title="Delete permanently"
                          className="btn btn-outline-danger btn-sm p-0 d-flex align-items-center justify-content-center border-0 rounded-circle"
                          style={{ width: '28px', height: '28px' }}
                          onClick={() => handleDelete(item.id)}
                        >
                          <i className="bi bi-trash3 text-danger" style={{ fontSize: '0.8rem' }}></i>
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Add box */}
        <div className="pt-3 border-top mt-auto">
          <div className="input-group input-group-sm">
            <input
              type="text"
              className="form-control"
              style={{ height: '38px' }}
              placeholder={`New ${fieldName.toLowerCase()}...`}
              value={newItem}
              onChange={(e) => setNewItem(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleAdd();
              }}
            />
            <button
              className="btn btn-primary d-flex align-items-center justify-content-center px-3"
              style={{ height: '38px' }}
              type="button"
              onClick={handleAdd}
            >
              <i className="bi bi-plus-lg me-1"></i> Add
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function Settings() {
  // Card-level search state
  const [cardSearchTerm, setCardSearchTerm] = useState('');

  // Roles API
  const { data: roles = [], isLoading: isLoadingRoles } = useGetRolesQuery();
  const [addRole] = useAddRoleMutation();
  const [updateRole] = useUpdateRoleMutation();
  const [deleteRole] = useDeleteRoleMutation();

  // Departments API
  const { data: depts = [], isLoading: isLoadingDepts } = useGetDepartmentsQuery();
  const [addDept] = useAddDepartmentMutation();
  const [updateDept] = useUpdateDepartmentMutation();
  const [deleteDept] = useDeleteDepartmentMutation();

  // Ministries API
  const { data: ministries = [], isLoading: isLoadingMinistries } = useGetMinistriesQuery();
  const [addMinistry] = useAddMinistryMutation();
  const [updateMinistry] = useUpdateMinistryMutation();
  const [deleteMinistry] = useDeleteMinistryMutation();

  // Cards definitions for filtering
  const cardConfigs = [
    {
      id: 'roles',
      title: 'User Security Roles',
      fieldName: 'Role',
      list: roles,
      isLoading: isLoadingRoles,
      onAdd: addRole,
      onUpdate: updateRole,
      onDelete: deleteRole,
    },
    {
      id: 'depts',
      title: 'Departments Directory',
      fieldName: 'Department',
      list: depts,
      isLoading: isLoadingDepts,
      onAdd: addDept,
      onUpdate: updateDept,
      onDelete: deleteDept,
    },
    {
      id: 'ministries',
      title: 'Nodal Ministries',
      fieldName: 'Ministry',
      list: ministries,
      isLoading: isLoadingMinistries,
      onAdd: addMinistry,
      onUpdate: updateMinistry,
      onDelete: deleteMinistry,
    },
  ];

  const filteredCards = cardConfigs.filter(
    (card) =>
      card.title.toLowerCase().includes(cardSearchTerm.toLowerCase()) ||
      card.fieldName.toLowerCase().includes(cardSearchTerm.toLowerCase())
  );

  return (
    <div className="fade-in pb-5">
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mt-2 mb-4 gap-3">
        <div>
          <h4 className="mb-1 text-dark-emphasis fw-bold">Master Settings</h4>
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb mb-0" style={{ fontSize: '0.85rem' }}>
              <li className="breadcrumb-item">
                <span className="text-primary text-decoration-none">Home</span>
              </li>
              <li className="breadcrumb-item active" aria-current="page">
                Master Settings
              </li>
            </ol>
          </nav>
        </div>

        {/* Global search to filter respective cards */}
        <div className="position-relative" style={{ width: '100%', maxWidth: '340px' }}>
          <input
            type="text"
            className="form-control py-2 ps-4"
            placeholder="Search configuration card (e.g. Roles, Depts)..."
            value={cardSearchTerm}
            onChange={(e) => setCardSearchTerm(e.target.value)}
          />
          <i className="bi bi-funnel text-muted position-absolute start-0 top-50 translate-middle-y ms-2.5"></i>
          {cardSearchTerm && (
            <button
              className="btn btn-link btn-sm position-absolute end-0 top-50 translate-middle-y me-1 p-0 text-decoration-none text-muted"
              onClick={() => setCardSearchTerm('')}
            >
              <i className="bi bi-x-lg" style={{ fontSize: '0.8rem' }}></i>
            </button>
          )}
        </div>
      </div>

      <div className="row g-4">
        {filteredCards.length === 0 ? (
          <div className="col-12 text-center py-5">
            <div className="card shadow-sm border-0 py-5">
              <div className="card-body">
                <i className="bi bi-slash-circle text-muted display-6"></i>
                <h5 className="fw-semibold mt-3 mb-1 text-dark-emphasis">No Categories Found</h5>
                <p className="text-muted mb-0">No settings card matches your search term "{cardSearchTerm}".</p>
              </div>
            </div>
          </div>
        ) : (
          filteredCards.map((card) => (
            <div key={card.id} className="col-12 col-md-6 col-lg-4">
              <RenderList
                title={card.title}
                list={card.list}
                isLoading={card.isLoading}
                fieldName={card.fieldName}
                onAdd={card.onAdd}
                onUpdate={card.onUpdate}
                onDelete={card.onDelete}
              />
            </div>
          ))
        )}
      </div>
    </div>
  );
}
