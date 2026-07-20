import React, { useEffect, useState } from 'react';
import { Row, Col, Button } from 'react-bootstrap';
import Card from '../components/Common/Card';
import Box from '../components/Common/Box';

export default function Settings() {
  const [userRoles, setUserRoles] = useState([]);
  const [departments, setDepartments] = useState([]);

  const RenderList = ({
    list,
    setList,
    // apiAction,
    // fetchAction,
    // updateAction,
    fieldName,
    enableAddNew,
  }) => {
    const [newItem, setNewItem] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredList, setFilteredList] = useState([]);

    // Effect to filter the list whenever the list or searchTerm changes
    useEffect(() => {
      if (list) {
        const lowercasedSearchTerm = searchTerm.toLowerCase();
        const results = list.filter(
          (item) => item.title && item.title.toLowerCase().includes(lowercasedSearchTerm),
        );
        setFilteredList(results);
      }
    }, [list, searchTerm]);

    return (
      <>
        <div className="px-4 py-2">
          <Row>
            {/* Search Input Field */}
            <Col md={9} sm={9}>
              <input
                type="text"
                className="form-control"
                placeholder={`Search ${fieldName}...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </Col>
            <Col md={2} sm={2} className="d-flex align-items-center justify-content-end ">
              <h6>Action</h6>
            </Col>
          </Row>
        </div>
        <div className="px-4 py-2 c-card-body">
          {filteredList?.map((item, idx) => (
            <Row key={item.id}>
              <Col md={9} sm={9}>
                <div
                  className={`d-flex justify-content-start custom-cards ${item.status ? '' : 'op-5'}`}
                >
                  <span className="mr-1">{idx + 1}. </span>
                  {item.isEditing ? (
                    <input
                      type="text"
                      className="w-100 form-control bg-0 p-2"
                      value={item.title}
                      onChange={(e) => handleChange(list, setList, item.id, e.target.value)}
                      autoFocus
                    />
                  ) : (
                    <span>{item.title}</span>
                  )}
                </div>
              </Col>
              <Col md={2} sm={2} className="d-flex align-items-center">
                <div className="d-flex justify-content-between">
                  {item.isEditing ? (
                    <span
                      title="Save"
                      className={`feather icon-check theme-bg2 text-white f-14 p-2 pointer`}
                      onClick={() => handleSaveChange(list, setList, item.id, fieldName)}
                    />
                  ) : (
                    <span
                      title="Edit"
                      className={`feather icon-edit theme-bg2 text-white f-14 p-2 pointer`}
                      onClick={() => handleEdit(list, setList, item.id)}
                    />
                  )}
                  {item.status ? (
                    <span
                      title="Active"
                      className="d-flex theme-bg text-white f-16 fw-bolder p-2 ml-1 pointer"
                      onClick={() => handleDelete(list, setList, item.id, fieldName)}
                    >
                      <FaCheckCircle />
                    </span>
                  ) : (
                    <span
                      title="Not Active"
                      className="d-flex hold-bg text-white f-16 fw-bolder p-2 ml-1 pointer"
                      onClick={() => handleDelete(list, setList, item.id, fieldName)}
                    >
                      <FaTimesCircle />
                    </span>
                  )}
                </div>
              </Col>
            </Row>
          ))}
          {filteredList.length === 0 && searchTerm !== '' && (
            <div className="text-center py-3">No results found for "{searchTerm}"</div>
          )}
        </div>
        <hr />
        {enableAddNew && (
          <div className="footer d-flex justify-content-between align-items-center px-4">
            <input
              type="text"
              className="form-control mr-3"
              placeholder="Enter text here.."
              value={newItem}
              onChange={(e) => setNewItem(e.target.value)}
            />
            <Button
              className="m-0 d-flex align-items-center justify-content-center"
              onClick={() => handleAddItem(newItem, setNewItem, fieldName)}
            >
              <i className="fas fa-plus" />
              <span>Add</span>
            </Button>
          </div>
        )}
      </>
    );
  };

  return (
    <div className="fade-in">
      <div className="d-flex justify-content-between align-items-center mt-2 mb-4">
        <div>
          <h4 className="mb-1 text-dark-emphasis fw-bold">System Settings</h4>
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb mb-0" style={{ fontSize: '0.85rem' }}>
              <li className="breadcrumb-item">
                <span className="text-primary text-decoration-none">Home</span>
              </li>
              <li className="breadcrumb-item active" aria-current="page">
                Settings
              </li>
            </ol>
          </nav>
        </div>
      </div>

      <div className="row g-4">
        <div className="col-sm-12 col-md-6 col-lg-4 col-xl-4">
          <Card title="User Roles" className="h-100">
            <RenderList
              list={userRoles || []}
              setList={setUserRoles}
              fieldName="User Roles"
              enableAddNew={true}
            />
          </Card>
        </div>
        <div className="col-sm-12 col-md-6 col-lg-4 col-xl-4">
          <Card title="Departments" className="h-100">
            <RenderList
              list={departments || []}
              setList={setDepartments}
              fieldName="Departments"
              enableAddNew={true}
            />
          </Card>
        </div>
        <div className="col-sm-12 col-md-6 col-lg-4 col-xl-4">
          <Card title="Departments" className="h-100">
            <RenderList
              list={departments || []}
              setList={setDepartments}
              fieldName="Departments"
              enableAddNew={true}
            />
          </Card>
        </div>
      </div>
      {/* <div className="card shadow-sm border-0">
        <div className="card-body p-5 text-center">
          <i className="bi bi-gear text-muted display-4"></i>
          <h5 className="fw-semibold mt-3 mb-1">Global Configuration Parameters</h5>
          <p className="text-muted text-sm mx-auto" style={{ maxWidth: '400px' }}>
            This board will provide standard toggles for server maintenance schedules, email notifications preference matrices, and allowed role updates in Milestone 2.
          </p>
        </div>
      </div> */}
    </div>
  );
}
