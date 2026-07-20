import React, { useState, useEffect, useRef } from 'react';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import {
  SCHEME_TABS_CONFIG,
  getInitialSchemeState,
  PM_AWAS_YOJANA_DEMO,
} from '../data/schemeFields';

import Alert from '../components/Common/Alert';
import Card from '../components/Common/Card';
import Modal from '../components/Common/Modal';

export default function NewScheme() {
  // Page core states
  const [formData, setFormData] = useState(getInitialSchemeState());
  const [currentTab, setCurrentTab] = useState(0);
  const [tabSearchTerm, setTabSearchTerm] = useState('');

  // Persistence state
  const [drafts, setDrafts] = useState([]);
  const [submittedSchemes, setSubmittedSchemes] = useState([]);
  const [alertInfo, setAlertInfo] = useState(null);

  // Custom draft name / active registry track
  const [draftName, setDraftName] = useState('');
  const [loadedRecordId, setLoadedRecordId] = useState(null);

  // Custom Confirmation Modal state
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    title: '',
    message: '',
    confirmText: 'Confirm',
    confirmClass: 'btn-danger',
    onConfirm: null,
  });

  const triggerConfirmation = ({
    title,
    message,
    onConfirm,
    confirmText = 'Confirm',
    confirmClass = 'btn-danger',
  }) => {
    setConfirmModal({
      isOpen: true,
      title,
      message,
      confirmText,
      confirmClass,
      onConfirm: () => {
        onConfirm();
        setConfirmModal((prev) => ({ ...prev, isOpen: false }));
      },
    });
  };

  const tabsContainerRef = useRef(null);

  // Sync draft list on load
  useEffect(() => {
    loadDraftsAndSchemes();
  }, []);

  const loadDraftsAndSchemes = () => {
    try {
      const storedDrafts = JSON.parse(localStorage.getItem('gov_scheme_drafts')) || [];
      const storedSubmitted = JSON.parse(localStorage.getItem('gov_scheme_submitted')) || [];
      setDrafts(storedDrafts);
      setSubmittedSchemes(storedSubmitted);
    } catch (e) {
      console.error('Error reading localStorage logs:', e);
    }
  };

  const showAlert = (message, type = 'success') => {
    setAlertInfo({ message, type });
  };

  // Reset form
  const handleResetForm = () => {
    triggerConfirmation({
      title: 'Reset Workspace',
      message:
        'Are you sure you want to clear all form fields? All unsaved changes will be lost immediately.',
      confirmText: 'Reset Form',
      confirmClass: 'btn-danger',
      onConfirm: () => {
        setFormData(getInitialSchemeState());
        setLoadedRecordId(null);
        setDraftName('');
        setCurrentTab(0);
        showAlert('Scheme form has been fully reset.', 'info');
      },
    });
  };

  // Check how many fields in each tab are filled out to calculate progress metrics
  const getTabProgress = (tabId) => {
    const fields = SCHEME_TABS_CONFIG.find((t) => t.id === tabId)?.fields || [];
    if (fields.length === 0) return 0;
    let filled = 0;
    fields.forEach((f) => {
      const val = formData[tabId]?.[f.key];
      if (val !== undefined && val !== null && String(val).trim() !== '') {
        filled++;
      }
    });
    return Math.round((filled / fields.length) * 100);
  };

  // Global Progress metric across all 23 tabs
  const getOverallProgress = () => {
    let totalFields = 0;
    let filledFields = 0;
    SCHEME_TABS_CONFIG.forEach((tab) => {
      tab.fields.forEach((f) => {
        totalFields++;
        const val = formData[tab.id]?.[f.key];
        if (val !== undefined && val !== null && String(val).trim() !== '') {
          filledFields++;
        }
      });
    });
    return Math.round((filledFields / totalFields) * 100) || 0;
  };

  // Save as Draft
  const handleSaveDraft = () => {
    const schemeName = formData.basicInfo?.schemeName || 'Unnamed Scheme Draft';
    const draftLabel = draftName || schemeName;

    triggerConfirmation({
      title: 'Save Draft Record',
      message: `Are you sure you want to save the draft as "${draftLabel}"? This stores the current active session in local cache memory.`,
      confirmText: 'Save Draft',
      confirmClass: 'btn-primary',
      onConfirm: () => {
        const cleanId = loadedRecordId || 'DRAFT_' + Date.now();
        const newDraft = {
          id: cleanId,
          name: draftLabel,
          lastUpdated: new Date().toLocaleString(),
          data: formData,
        };

        let updatedDrafts = [...drafts];
        const existingIdx = drafts.findIndex((d) => d.id === cleanId);
        if (existingIdx > -1) {
          updatedDrafts[existingIdx] = newDraft;
        } else {
          updatedDrafts.unshift(newDraft);
        }

        localStorage.setItem('gov_scheme_drafts', JSON.stringify(updatedDrafts));
        setDrafts(updatedDrafts);
        setLoadedRecordId(cleanId);
        showAlert(`Draft "${newDraft.name}" saved successfully in local storage.`, 'success');
      },
    });
  };

  // Submit form (without validation as requested)
  const handleSubmitScheme = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    const schemeName = formData.basicInfo?.schemeName || 'Unnamed Government Scheme';

    triggerConfirmation({
      title: 'Register & Authorize Scheme',
      message: `Are you sure you want to register and authorize the scheme "${schemeName}"? This will save it permanently in the official portal directory.`,
      confirmText: 'Submit & Authorize',
      confirmClass: 'btn-success',
      onConfirm: () => {
        const schemeId = formData.basicInfo?.schemeId || 'SCH_' + Date.now();
        const newSubmission = {
          id: schemeId,
          name: schemeName,
          submittedDate: new Date().toLocaleString(),
          data: formData,
        };

        let updatedSubmitted = [...submittedSchemes];
        const existingIdx = submittedSchemes.findIndex((s) => s.id === schemeId);
        if (existingIdx > -1) {
          updatedSubmitted[existingIdx] = newSubmission;
        } else {
          updatedSubmitted.unshift(newSubmission);
        }

        localStorage.setItem('gov_scheme_submitted', JSON.stringify(updatedSubmitted));
        setSubmittedSchemes(updatedSubmitted);

        // Also remove from drafts if present
        if (loadedRecordId) {
          const updatedDrafts = drafts.filter((d) => d.id !== loadedRecordId);
          localStorage.setItem('gov_scheme_drafts', JSON.stringify(updatedDrafts));
          setDrafts(updatedDrafts);
          setLoadedRecordId(null);
        }

        showAlert(
          `Government Scheme "${schemeName}" has been successfully registered & authorized!`,
          'success',
        );
      },
    });
  };

  // Load a Draft or Submitted record
  const handleLoadRecord = (record, isDraft = true) => {
    setFormData(JSON.parse(JSON.stringify(record.data)));
    setLoadedRecordId(record.id);
    setDraftName(isDraft ? record.name : '');
    setCurrentTab(0);
    showAlert(`Loaded "${record.name}" into the 23-tab workspace!`, 'info');
  };

  // Delete a Saved Record
  const handleDeleteRecord = (id, isDraft = true) => {
    const recordType = isDraft ? 'draft revision' : 'authorized registry';
    triggerConfirmation({
      title: `Delete ${isDraft ? 'Draft' : 'Finalized'} Record`,
      message: `Are you sure you want to permanently delete this ${recordType}? This action is irreversible and cannot be recovered.`,
      confirmText: 'Delete',
      confirmClass: 'btn-danger',
      onConfirm: () => {
        if (isDraft) {
          const filtered = drafts.filter((d) => d.id !== id);
          localStorage.setItem('gov_scheme_drafts', JSON.stringify(filtered));
          setDrafts(filtered);
        } else {
          const filtered = submittedSchemes.filter((s) => s.id !== id);
          localStorage.setItem('gov_scheme_submitted', JSON.stringify(filtered));
          setSubmittedSchemes(filtered);
        }
        if (loadedRecordId === id) {
          setFormData(getInitialSchemeState());
          setLoadedRecordId(null);
          setDraftName('');
        }
        showAlert('Record deleted successfully.', 'info');
      },
    });
  };

  // Clear all drafts
  const handleClearAllDrafts = () => {
    if (drafts.length === 0) {
      showAlert('No drafts to remove.', 'info');
      return;
    }
    triggerConfirmation({
      title: 'Remove All Drafts',
      message:
        'Are you sure you want to permanently remove ALL saved drafts from local storage? This action cannot be undone.',
      confirmText: 'Remove All',
      confirmClass: 'btn-danger',
      onConfirm: () => {
        localStorage.removeItem('gov_scheme_drafts');
        setDrafts([]);
        const wasDraftLoaded = drafts.some((d) => d.id === loadedRecordId);
        if (wasDraftLoaded) {
          setFormData(getInitialSchemeState());
          setLoadedRecordId(null);
          setDraftName('');
        }
        showAlert('All local draft records have been removed successfully.', 'success');
      },
    });
  };

  // Export full form configuration as JSON file
  const handleExportJSON = () => {
    const dataStr =
      'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(formData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    const fileName = `scheme-360-${formData.basicInfo?.schemeId || 'export'}.json`;
    downloadAnchor.setAttribute('download', fileName);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showAlert('Form data exported successfully as structured JSON!', 'success');
  };

  // Export full 23-tab scheme structure into a majestic PDF report
  const handleExportPDFReport = () => {
    try {
      const doc = new jsPDF();
      const schemeTitle = formData.basicInfo?.schemeName || 'Government Scheme Register';
      const ministryName = formData.basicInfo?.ministry || 'Nodal Ministry Unspecified';

      // Title Cover banner
      doc.setFont('helvetica');
      doc.setFillColor(95, 118, 232); // Primary Blue
      doc.rect(0, 0, 210, 42, 'F');

      doc.setFontSize(18);
      doc.setTextColor(255, 255, 255);
      doc.text('GOVERNMENT SCHEME 360° REPORT', 14, 18);

      doc.setFontSize(11);
      doc.setTextColor(220, 224, 250);
      doc.text(`${schemeTitle}`, 14, 26);
      doc.text(`Ministry: ${ministryName} | Generated: ${new Date().toLocaleString()}`, 14, 32);

      let currentY = 50;

      // Compile each of the 23 tabs data
      SCHEME_TABS_CONFIG.forEach((tab, index) => {
        // Prepare rows
        const tableRows = [];
        tab.fields.forEach((field) => {
          const rawVal = formData[tab.id]?.[field.key];
          const displayVal =
            rawVal !== undefined && rawVal !== null && rawVal !== ''
              ? String(rawVal)
              : 'Not Specified';
          tableRows.push([field.label, displayVal]);
        });

        // Add Section Header in PDF
        doc.setFontSize(12);
        doc.setTextColor(28, 45, 65);
        doc.setFont('helvetica', 'bold');
        doc.text(`${index + 1}. ${tab.title}`, 14, currentY);
        doc.setFont('helvetica', 'normal');

        autoTable(doc, {
          body: tableRows,
          startY: currentY + 3,
          theme: 'striped',
          styles: { fontSize: 8.5, cellPadding: 3 },
          columnStyles: {
            0: { fontStyle: 'bold', width: 65, fillColor: [248, 249, 250] },
            1: { width: 115 },
          },
          margin: { left: 14, right: 14 },
          didDrawPage: (data) => {
            currentY = data.cursor.y + 12;
          },
        });

        // Check if we need to add a page break
        if (currentY > 250 && index < SCHEME_TABS_CONFIG.length - 1) {
          doc.addPage();
          currentY = 20;
        }
      });

      doc.save(`scheme-report-${formData.basicInfo?.schemeId || 'registry'}.pdf`);
      showAlert(
        'PDF report compiled and downloaded successfully with all 23 schema tables!',
        'success',
      );
    } catch (err) {
      console.error('Error compiling PDF:', err);
      showAlert('Error compiling PDF report.', 'danger');
    }
  };

  // Horizontal Tab Scroll actions
  const scrollTabs = (direction) => {
    if (tabsContainerRef.current) {
      const scrollAmt = 240;
      tabsContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmt : scrollAmt,
        behavior: 'smooth',
      });
    }
  };

  // Search filter for tabs
  const filteredTabs = SCHEME_TABS_CONFIG.map((tab, idx) => ({ ...tab, originalIdx: idx })).filter(
    (tab) =>
      tab.title.toLowerCase().includes(tabSearchTerm.toLowerCase()) ||
      tab.id.toLowerCase().includes(tabSearchTerm.toLowerCase()),
  );

  const activeTabConfig = SCHEME_TABS_CONFIG[currentTab];

  return (
    <div className="fade-in pb-5">
      {/* Page Header */}
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-3  mt-2">
        <div>
          <h4 className="mb-1 text-dark-emphasis fw-bold">Government Scheme 360° Portal</h4>
          <p className="text-muted mb-0" style={{ fontSize: '0.85rem' }}>
            Authoritative multi-tier relational schema engine. Input, customize, and persist fully
            comprehensive scheme files.
          </p>
        </div>
        <div className="d-flex gap-2 flex-wrap">
          <button
            type="button"
            className="btn btn-light btn-sm border px-3 shadow-sm d-flex align-items-center gap-1.5"
            onClick={handleResetForm}
          >
            <i className="bi bi-trash"></i>
            <span>Reset Workspace</span>
          </button>
        </div>
      </div>

      {/* Alert Banner */}
      {alertInfo && (
        <Alert
          type={alertInfo.type}
          message={alertInfo.message}
          dismissible={true}
          autoCloseTime={6000}
          icon={true}
          onClose={() => setAlertInfo(null)}
          className="mb-4 shadow-sm"
        />
      )}

      {/* Workspace Persistence Summary Row */}
      <div className="row g-4 mb-4">
        {/* Left Column: Drafts & Active Management */}
        {/* <div className="col-12 col-md-4">
          <Card 
            title="Local Draft Registries" 
            subtitle="Pick an existing revision draft to edit instantly" 
            className="h-100 shadow-sm"
            headerAction={
              drafts.length > 0 && (
                <button 
                  type="button" 
                  className="btn btn-outline-danger btn-sm py-1 px-2.5 text-xs d-flex align-items-center gap-1 border-0"
                  onClick={handleClearAllDrafts}
                  style={{ fontSize: '0.75rem', fontWeight: 500 }}
                  title="Remove all drafts"
                >
                  <i className="bi bi-trash-fill"></i>
                  <span>Remove All</span>
                </button>
              )
            }
          >
            <div className="mb-3">
              <label className="form-label fw-semibold text-dark-emphasis mb-1" style={{ fontSize: '0.8rem' }}>
                Draft Label / Version Stamp
              </label>
              <div className="input-group input-group-sm">
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="e.g. Phase III draft" 
                  value={draftName} 
                  onChange={(e) => setDraftName(e.target.value)}
                />
                <button 
                  className="btn btn-primary d-flex align-items-center gap-1" 
                  type="button" 
                  onClick={handleSaveDraft}
                >
                  <i className="bi bi-bookmark-plus-fill"></i>
                  <span>Save Draft</span>
                </button>
              </div>
            </div>

            <div className="border rounded overflow-hidden" style={{ maxHeight: '180px', overflowY: 'auto' }}>
              {drafts.length === 0 ? (
                <div className="text-center p-3 text-muted" style={{ fontSize: '0.8rem' }}>
                  No drafts saved in cache.
                </div>
              ) : (
                <div className="list-group list-group-flush">
                  {drafts.map(d => (
                    <div 
                      key={d.id} 
                      className={`list-group-item d-flex justify-content-between align-items-center p-2.5 hover-bg cursor-pointer ${loadedRecordId === d.id ? 'bg-light border-start border-primary border-3' : ''}`}
                      onClick={() => handleLoadRecord(d, true)}
                    >
                      <div className="text-truncate me-2" style={{ maxWidth: '180px' }}>
                        <div className="fw-semibold text-dark text-truncate" style={{ fontSize: '0.8rem' }}>{d.name}</div>
                        <small className="text-muted d-block" style={{ fontSize: '0.65rem' }}>{d.lastUpdated}</small>
                      </div>
                      <button 
                        type="button" 
                        className="btn btn-link text-danger p-1 border-0" 
                        onClick={(e) => { e.stopPropagation(); handleDeleteRecord(d.id, true); }}
                        title="Delete draft"
                      >
                        <i className="bi bi-x-circle-fill"></i>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Card>
        </div> */}

        {/* Middle Column: Authorized Submissions */}
        {/* <div className="col-12 col-md-4">
          <Card 
            title="Registered Authorized Schemes" 
            subtitle="Authoritative records finalized in portal" 
            className="h-100 shadow-sm"
          >
            <div className="border rounded overflow-hidden" style={{ height: '235px', overflowY: 'auto' }}>
              {submittedSchemes.length === 0 ? (
                <div className="text-center p-4 text-muted d-flex flex-column align-items-center justify-content-center h-100" style={{ fontSize: '0.8rem' }}>
                  <i className="bi bi-file-earmark-lock text-muted fs-3 mb-2"></i>
                  <span>No completed schemes registered yet. Close forms & hit Submit below.</span>
                </div>
              ) : (
                <div className="list-group list-group-flush">
                  {submittedSchemes.map(s => (
                    <div 
                      key={s.id} 
                      className={`list-group-item d-flex justify-content-between align-items-center p-2.5 hover-bg cursor-pointer ${loadedRecordId === s.id ? 'bg-light border-start border-success border-3' : ''}`}
                      onClick={() => handleLoadRecord(s, false)}
                    >
                      <div className="text-truncate me-2" style={{ maxWidth: '185px' }}>
                        <div className="fw-semibold text-success text-truncate" style={{ fontSize: '0.8rem' }}>{s.name}</div>
                        <small className="text-muted d-block" style={{ fontSize: '0.65rem' }}>ID: {s.id} | {s.submittedDate}</small>
                      </div>
                      <button 
                        type="button" 
                        className="btn btn-link text-danger p-1 border-0" 
                        onClick={(e) => { e.stopPropagation(); handleDeleteRecord(s.id, false); }}
                        title="Delete registry"
                      >
                        <i className="bi bi-trash text-muted"></i>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Card>
        </div> */}

        {/* Right Column: Schema Statistics & Data Integrity */}
        {/* <div className="col-12 col-md-4">
          <Card 
            title="Schema Metrics & Integrity" 
            subtitle="Automatic database compliance analysis" 
            className="h-100 shadow-sm"
          >
            <div className="d-flex align-items-center gap-3 mb-3">
              <div className="position-relative d-flex align-items-center justify-content-center" style={{ width: '65px', height: '65px' }}>
                <svg width="65" height="65" viewBox="0 0 36 36" className="circular-chart">
                  <path className="circle-bg"
                    stroke="#e8eaec"
                    strokeWidth="3.5"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path className="circle"
                    stroke="#5f76e8"
                    strokeWidth="3.5"
                    strokeDasharray={`${getOverallProgress()}, 100`}
                    strokeLinecap="round"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <div className="position-absolute text-dark fw-bold" style={{ fontSize: '0.9rem' }}>
                  {getOverallProgress()}%
                </div>
              </div>
              <div>
                <h6 className="mb-1 text-darkfw-semibold" style={{ fontSize: '0.85rem' }}>Global Registration Completion</h6>
                <small className="text-muted d-block" style={{ fontSize: '0.75rem' }}>
                  Based on content mapping across all 23 tables.
                </small>
              </div>
            </div>

            <div className="p-2.5 bg-light rounded d-flex justify-content-between align-items-center mb-2" style={{ fontSize: '0.8rem' }}>
              <span className="text-muted">Total Active Tables:</span>
              <strong className="text-dark">23 Relational Models</strong>
            </div>

            <div className="p-2.5 bg-light rounded d-flex justify-content-between align-items-center" style={{ fontSize: '0.8rem' }}>
              <span className="text-muted">Selected Sector:</span>
              <strong className="text-primary">{formData.classification?.sector || 'Not Specified'}</strong>
            </div>
          </Card>
        </div> */}
      </div>

      {/* Main Tabbed Workspace */}
      <Card noBodyPadding={true} className="shadow">
        {/* Tab Controls Bar */}
        <div className="p-3 border-bottom bg-light-subtle d-flex flex-wrap align-items-center justify-content-between gap-3">
          {/* Quick tab keyword search filter */}
          <div className="input-group input-group-sm" style={{ maxWidth: '240px' }}>
            <span className="input-group-text bg-white border-end-0">
              <i className="bi bi-funnel text-muted"></i>
            </span>
            <input
              type="text"
              className="form-control border-start-0"
              placeholder="Search forms..."
              value={tabSearchTerm}
              onChange={(e) => setTabSearchTerm(e.target.value)}
            />
          </div>

          {/* Quick Dropdown Picker of 23 tabs */}
          <div className="d-flex align-items-center gap-2">
            <span className="text-muted d-none d-sm-inline" style={{ fontSize: '0.8rem' }}>
              Jump to:
            </span>
            <select
              className="form-select form-select-sm"
              style={{ width: '220px' }}
              value={currentTab}
              onChange={(e) => setCurrentTab(Number(e.target.value))}
            >
              {SCHEME_TABS_CONFIG.map((tab, idx) => (
                <option key={tab.id} value={idx}>
                  {tab.title} ({getTabProgress(tab.id)}% full)
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Horizontal Navigation Tabs with Scroll Chevrons */}
        <div className="position-relative border-bottom pl-2 pr-2 py-2 d-flex align-items-center bg-white">
          {/* Scroll Left Button */}
          <button
            className="btn btn-outline-secondary btn-sm p-0 d-flex align-items-center justify-content-center border-0 rounded-circle position-absolute start-0 ms-1 bg-white"
            style={{ width: '26px', height: '26px', zIndex: 5 }}
            onClick={() => scrollTabs('left')}
            title="Scroll Left"
          >
            <i className="bi bi-chevron-left"></i>
          </button>

          <ul
            className="nav nav-tabs flex-nowrap overflow-x-auto w-100 border-0 scrollbar-none py-1 align-items-center"
            style={{
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
              gap: '6px',
            }}
            ref={tabsContainerRef}
          >
            {filteredTabs.map((tab) => {
              const isActive = currentTab === tab.originalIdx;
              const progress = getTabProgress(tab.id);
              return (
                <li key={tab.id} className="nav-item">
                  <button
                    className={`nav-link text-nowrap d-flex align-items-center gap-1.5 px-3 py-2 border rounded-pill transition-all ${
                      isActive
                        ? 'bg-primary text-white border-primary fw-medium shadow-sm'
                        : 'bg-light text-muted hover-bg'
                    }`}
                    style={{ fontSize: '0.8rem' }}
                    onClick={() => setCurrentTab(tab.originalIdx)}
                  >
                    <i className={tab.icon}></i>
                    <span className=" mx-2"> {tab.title} </span>
                    <span
                      className={`badge rounded-pill ${isActive ? 'bg-white text-primary' : 'bg-secondary text-white'}`}
                      style={{ fontSize: '0.65rem' }}
                    >
                      {progress}%
                    </span>
                  </button>
                </li>
              );
            })}
            {filteredTabs.length === 0 && (
              <li className="text-muted p-2" style={{ fontSize: '0.8rem' }}>
                No forms match search terms
              </li>
            )}
          </ul>
          {/* Scroll right Button */}
          <button
            className="btn btn-outline-secondary btn-sm p-0 d-flex align-items-center justify-content-center border-0 rounded-circle position-absolute end-0 me-1 bg-white"
            style={{ width: '26px', height: '26px', zIndex: 5 }}
            onClick={() => scrollTabs('right')}
            title="Scroll Right"
          >
            <i className="bi bi-chevron-right"></i>
          </button>
        </div>

        {/* Active Tab Form Body */}
        <div className="p-4 bg-transparent">
          <div className="d-flex align-items-center gap-2 mb-3">
            <div
              className="rounded-circle bg-primary-subtle text-primary d-flex align-items-center justify-content-center"
              style={{ width: '38px', height: '38px' }}
            >
              <i className={`${activeTabConfig.icon} fs-5`}></i>
            </div>
            <div>
              <h5 className="mb-0 text-dark fw-bold" style={{ fontSize: '1.05rem' }}>
                {' '}
                {activeTabConfig.title}{' '}
              </h5>
              <small className="text-muted d-block" style={{ fontSize: '0.75rem' }}>
                Relational Table Key:{' '}
                <code className="text-danger fw-normal">
                  Scheme{activeTabConfig.id.charAt(0).toUpperCase() + activeTabConfig.id.slice(1)}
                </code>
              </small>
            </div>
          </div>

          <form onSubmit={handleSubmitScheme}>
            <div className="row g-3">
              {activeTabConfig.fields.map((field) => {
                const value = formData[activeTabConfig.id]?.[field.key] || '';
                const handleFieldChange = (val) => {
                  setFormData((prev) => ({
                    ...prev,
                    [activeTabConfig.id]: {
                      ...prev[activeTabConfig.id],
                      [field.key]: val,
                    },
                  }));
                };

                return (
                  <div key={field.key} className={`col-12 col-md-${field.col || 6}`}>
                    <label
                      className="form-label text-dark-emphasis fw-medium mb-1"
                      style={{ fontSize: '0.8rem' }}
                    >
                      {field.label}
                    </label>

                    {/* SELECT DROPDOWNS */}
                    {field.type === 'select' ? (
                      <select
                        className="form-select py-2"
                        style={{ height: '40px', fontSize: '0.85rem' }}
                        value={value}
                        onChange={(e) => handleFieldChange(e.target.value)}
                      >
                        {field.options.map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                    ) : /* TEXTAREAS */
                    field.type === 'textarea' ? (
                      <textarea
                        className="form-control py-2"
                        rows={3}
                        style={{ fontSize: '0.85rem' }}
                        placeholder={field.placeholder}
                        value={value}
                        onChange={(e) => handleFieldChange(e.target.value)}
                      />
                    ) : (
                      /* GENERAL INPUTS */
                      <input
                        type={field.type}
                        className="form-control py-2"
                        style={{ height: '40px', fontSize: '0.85rem' }}
                        placeholder={field.placeholder}
                        value={value}
                        onChange={(e) => handleFieldChange(e.target.value)}
                      />
                    )}
                  </div>
                );
              })}
            </div>

            {/* Pagination & Submitter Actions */}
            <div className="d-flex flex-wrap justify-content-between align-items-center mt-5 pt-3 border-top gap-3">
              <div className="d-flex gap-2">
                <button
                  type="button"
                  className="btn btn-outline-secondary btn-sm px-3 d-flex align-items-center gap-1"
                  onClick={() => setCurrentTab((prev) => Math.max(0, prev - 1))}
                  disabled={currentTab === 0}
                >
                  <i className="bi bi-arrow-left"></i>
                  <span>Previous Tab</span>
                </button>

                <button
                  type="button"
                  className="btn btn-outline-secondary btn-sm px-3 d-flex align-items-center gap-1"
                  onClick={() =>
                    setCurrentTab((prev) => Math.min(SCHEME_TABS_CONFIG.length - 1, prev + 1))
                  }
                  disabled={currentTab === SCHEME_TABS_CONFIG.length - 1}
                >
                  <span>Next Tab</span>
                  <i className="bi bi-arrow-right"></i>
                </button>
              </div>

              {/* PDF & JSON Exporter */}
              <div className="d-flex gap-2 flex-wrap">
                {/* <button
                  type="button"
                  className="btn btn-outline-success btn-sm px-3 d-flex align-items-center gap-1.5"
                  onClick={handleExportJSON}
                >
                  <i className="bi bi-filetype-json"></i>
                  <span>Export JSON</span>
                </button> */}
                <button
                  type="button"
                  className="btn btn-outline-danger btn-sm px-3 d-flex align-items-center gap-1.5"
                  onClick={handleExportPDFReport}
                >
                  <i className="bi bi-filetype-pdf me-1"></i>
                  <span>Export Full PDF</span>
                </button>
                <button
                  type="submit"
                  className="btn btn-success btn-sm px-4 fw-medium shadow-sm d-flex align-items-center gap-1.5"
                >
                  <i className="bi bi-check-circle-fill me-1"></i>
                  <span>Submit Scheme Record</span>
                </button>
              </div>
            </div>
          </form>
        </div>
      </Card>

      {/* Custom Dynamic Modal Component */}
      <Modal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal((prev) => ({ ...prev, isOpen: false }))}
        title={confirmModal.title}
        message={confirmModal.message}
        confirmText={confirmModal.confirmText}
        confirmClass={confirmModal.confirmClass}
        onConfirm={confirmModal.onConfirm}
        type="confirm"
        icon="bi-exclamation-triangle-fill"
        iconColorClass="text-warning bg-warning-subtle"
      />
    </div>
  );
}
