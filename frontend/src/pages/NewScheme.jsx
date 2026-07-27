import React, { useState, useEffect, useRef } from 'react';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import {
  SCHEME_TABS_CONFIG,
  getInitialSchemeState,
  PM_AWAS_YOJANA_DEMO,
  DEFAULT_FALLBACK_OPTIONS,
} from '../data/schemeFields';

import Alert from '../components/Common/Alert';
import Card from '../components/Common/Card';
import Modal from '../components/Common/Modal';
import Dropdown from '../components/Common/Dropdown';
import Spinner from '../components/Common/Spinner';
import {
  useGetAgeGroupMutation,
  useGetBeneficiaryCategoryMutation,
  useGetBeneficiaryTypeMutation,
  useGetBenefitFrequencyMutation,
  useGetBenefitTypeMutation,
  useGetDeliveryMechanismMutation,
  useGetDepartmentMutation,
  useGetDistrictMutation,
  useGetDocumentMutation,
  useGetFinancialAssistanceTypeMutation,
  useGetFundSharingPatternMutation,
  useGetGenderMutation,
  useGetGeographicCoverageMutation,
  useGetImplementingAgencyMutation,
  useGetIncomeCriteriaMutation,
  useGetInsuranceTypeMutation,
  useGetLocalBodyMutation,
  useGetMinistryMutation,
  useGetMissionMutation,
  useGetMonitoringAgencyMutation,
  useGetNationalPriorityMutation,
  useGetOccupationMutation,
  useGetOutcomeIndicatorMutation,
  useGetReviewFrequencyMutation,
  useGetSchemeMutation,
  useGetSchemePhaseMutation,
  useGetSchemeStatusMutation,
  useGetSchemeTypeMutation,
  useGetSDGMutation,
  useGetSectorMutation,
  useGetServiceModeMutation,
  useGetSocialCategoryMutation,
  useGetStakeholderTypeMutation,
  useGetStateMutation,
  useGetSubSectorMutation,
  useGetTargetGroupMutation,
  useGetThemeMutation,
  useGetUrbanRuralMutation,
} from '../app/api';

const extractDataArray = (res) => {
  if (!res) return [];
  if (Array.isArray(res)) return res;
  if (Array.isArray(res.data)) return res.data;
  if (Array.isArray(res.data?.data)) return res.data.data;
  if (Array.isArray(res.result)) return res.result;
  if (Array.isArray(res.items)) return res.items;
  if (Array.isArray(res.data?.result)) return res.data.result;
  if (Array.isArray(res.data?.items)) return res.data.items;
  if (Array.isArray(res.content)) return res.content;
  if (typeof res === 'object') {
    const keys = Object.keys(res);
    for (const key of keys) {
      if (Array.isArray(res[key])) return res[key];
    }
  }
  return [];
};

const getOptionName = (item) => {
  if (!item && item !== 0) return '';
  if (typeof item === 'string') return item;
  if (typeof item === 'number') return String(item);
  if (typeof item !== 'object') return String(item);

  const standardKeys = [
    'name', 'title', 'label', 'value', 'description', 'text', 'categoryName',
    'typeName', 'groupName', 'departmentName', 'ministryName', 'agencyName',
    'statusName', 'sectorName', 'modeName', 'priorityName', 'frequencyName',
    'coverageName', 'bodyName', 'indicatorName', 'schemeName', 'phaseName',
    'patternName', 'mechanismName', 'criteriaName'
  ];
  for (const k of standardKeys) {
    if (item[k] !== undefined && item[k] !== null && typeof item[k] === 'string' && item[k].trim()) {
      return item[k].trim();
    }
  }

  const keys = Object.keys(item);
  const nameKey = keys.find(
    (k) =>
      k.toLowerCase().endsWith('name') ||
      k.toLowerCase().endsWith('title') ||
      k.toLowerCase().endsWith('type') ||
      k.toLowerCase().endsWith('category') ||
      k.toLowerCase().endsWith('frequency') ||
      k.toLowerCase().endsWith('coverage') ||
      k.toLowerCase().endsWith('priority') ||
      k.toLowerCase().endsWith('status') ||
      k.toLowerCase().endsWith('sdg') ||
      k.toLowerCase().endsWith('sector') ||
      k.toLowerCase().endsWith('mode') ||
      k.toLowerCase().endsWith('group') ||
      k.toLowerCase().endsWith('criteria') ||
      k.toLowerCase().endsWith('body') ||
      k.toLowerCase().endsWith('agency') ||
      k.toLowerCase().endsWith('phase') ||
      k.toLowerCase().endsWith('pattern') ||
      k.toLowerCase().endsWith('mechanism') ||
      k.toLowerCase().endsWith('department') ||
      k.toLowerCase().endsWith('ministry') ||
      k.toLowerCase().endsWith('description')
  );
  if (nameKey && item[nameKey] !== undefined && item[nameKey] !== null) return String(item[nameKey]).trim();

  const stringKey = keys.find(
    (k) => typeof item[k] === 'string' && k !== 'id' && k !== '_id' && !k.toLowerCase().includes('id') && item[k].trim()
  );
  if (stringKey) return item[stringKey].trim();

  const anyStringKey = keys.find((k) => typeof item[k] === 'string' && item[k].trim());
  if (anyStringKey) return item[anyStringKey].trim();

  return item[keys[0]] !== undefined ? String(item[keys[0]]) : '';
};

export default function NewScheme() {
  const [getAgeGroup, { data: ageGroupRes }] = useGetAgeGroupMutation();
  const [getBeneficiaryCategory, { data: beneficiaryCategoriesRes }] =
    useGetBeneficiaryCategoryMutation();
  const [getBeneficiaryType, { data: beneficiaryTypesRes }] = useGetBeneficiaryTypeMutation();
  const [getBenefitFrequency, { data: benefitFrequenciesRes }] = useGetBenefitFrequencyMutation();
  const [getBenefitType, { data: benefitTypesRes }] = useGetBenefitTypeMutation();
  const [getDeliveryMechanism, { data: deliveryMechanismsRes }] = useGetDeliveryMechanismMutation();
  const [getDepartment, { data: departmentsRes }] = useGetDepartmentMutation();
  const [getDistrict, { data: districtsRes }] = useGetDistrictMutation();
  const [getDocument, { data: documentsRes }] = useGetDocumentMutation();
  const [getFinancialAssistanceType, { data: financialAssistanceTypesRes }] =
    useGetFinancialAssistanceTypeMutation();
  const [getFundSharingPattern, { data: fundSharingPatternsRes }] =
    useGetFundSharingPatternMutation();
  const [getGender, { data: gendersRes }] = useGetGenderMutation();
  const [getGeographicCoverage, { data: geographicCoveragesRes }] =
    useGetGeographicCoverageMutation();
  const [getImplementingAgency, { data: implementingAgenciesRes }] =
    useGetImplementingAgencyMutation();
  const [getIncomeCriteria, { data: incomeCriteriaRes }] = useGetIncomeCriteriaMutation();
  const [getInsuranceType, { data: insuranceTypesRes }] = useGetInsuranceTypeMutation();
  const [getLocalBody, { data: localBodiesRes }] = useGetLocalBodyMutation();
  const [getMinistry, { data: ministriesRes }] = useGetMinistryMutation();
  const [getMission, { data: missionsRes }] = useGetMissionMutation();
  const [getMonitoringAgency, { data: monitoringAgenciesRes }] = useGetMonitoringAgencyMutation();
  const [getNationalPriority, { data: nationalPrioritiesRes }] = useGetNationalPriorityMutation();
  const [getOccupation, { data: occupationsRes }] = useGetOccupationMutation();
  const [getOutcomeIndicator, { data: outcomeIndicatorsRes }] = useGetOutcomeIndicatorMutation();
  const [getReviewFrequency, { data: reviewFrequenciesRes }] = useGetReviewFrequencyMutation();
  const [getScheme, { data: schemesRes }] = useGetSchemeMutation();
  const [getSchemePhase, { data: schemePhasesRes }] = useGetSchemePhaseMutation();
  const [getSchemeStatus, { data: schemeStatusesRes }] = useGetSchemeStatusMutation();
  const [getSchemeType, { data: schemeTypesRes }] = useGetSchemeTypeMutation();
  const [getSDG, { data: sdgsRes }] = useGetSDGMutation();
  const [getSector, { data: sectorsRes }] = useGetSectorMutation();
  const [getServiceMode, { data: serviceModesRes }] = useGetServiceModeMutation();
  const [getSocialCategory, { data: socialCategoriesRes }] = useGetSocialCategoryMutation();
  const [getStakeholderType, { data: stakeholderTypesRes }] = useGetStakeholderTypeMutation();
  const [getState, { data: statesRes }] = useGetStateMutation();
  const [getSubSector, { data: subSectorsRes }] = useGetSubSectorMutation();
  const [getTargetGroup, { data: targetGroupsRes }] = useGetTargetGroupMutation();
  const [getTheme, { data: themesRes }] = useGetThemeMutation();
  const [getUrbanRural, { data: urbanRuralRes }] = useGetUrbanRuralMutation();

  const [isFetchingOptions, setIsFetchingOptions] = useState(false);

  const loadDraftsAndSchemes = () => {
    try {
      const storedDrafts = JSON.parse(localStorage.getItem('gov_scheme_drafts')) || [];
      setDrafts(storedDrafts);
    } catch (e) {
      console.error('Error reading localStorage logs:', e);
    }
  };

  useEffect(() => {
    loadDraftsAndSchemes();

    setIsFetchingOptions(true);
    Promise.allSettled([
      getAgeGroup({}),
      getBeneficiaryCategory({}),
      getBeneficiaryType({}),
      getBenefitFrequency({}),
      getBenefitType({}),
      getDeliveryMechanism({}),
      getDepartment({}),
      getDistrict({}),
      getDocument({}),
      getFinancialAssistanceType({}),
      getFundSharingPattern({}),
      getGender({}),
      getGeographicCoverage({}),
      getImplementingAgency({}),
      getIncomeCriteria({}),
      getInsuranceType({}),
      getLocalBody({}),
      getMinistry({}),
      getMission({}),
      getMonitoringAgency({}),
      getNationalPriority({}),
      getOccupation({}),
      getOutcomeIndicator({}),
      getReviewFrequency({}),
      getScheme({}),
      getSchemePhase({}),
      getSchemeStatus({}),
      getSchemeType({}),
      getSDG({}),
      getSector({}),
      getServiceMode({}),
      getSocialCategory({}),
      getStakeholderType({}),
      getState({}),
      getSubSector({}),
      getTargetGroup({}),
      getTheme({}),
      getUrbanRural({}),
    ]).finally(() => {
      setIsFetchingOptions(false);
    });
  }, []);

  const backendOptionsMap = {
    ageGroup: extractDataArray(ageGroupRes),
    beneficiaryCategories: extractDataArray(beneficiaryCategoriesRes),
    beneficiaryTypes: extractDataArray(beneficiaryTypesRes),
    benefitFrequencies: extractDataArray(benefitFrequenciesRes),
    benefitTypes: extractDataArray(benefitTypesRes),
    deliveryMechanisms: extractDataArray(deliveryMechanismsRes),
    departments: extractDataArray(departmentsRes),
    districts: extractDataArray(districtsRes),
    documents: extractDataArray(documentsRes),
    financialAssistanceTypes: extractDataArray(financialAssistanceTypesRes),
    fundSharingPatterns: extractDataArray(fundSharingPatternsRes),
    genders: extractDataArray(gendersRes),
    geographicCoverages: extractDataArray(geographicCoveragesRes),
    implementingAgencies: extractDataArray(implementingAgenciesRes),
    incomeCriteria: extractDataArray(incomeCriteriaRes),
    insuranceTypes: extractDataArray(insuranceTypesRes),
    localBodies: extractDataArray(localBodiesRes),
    ministries: extractDataArray(ministriesRes),
    missions: extractDataArray(missionsRes),
    monitoringAgencies: extractDataArray(monitoringAgenciesRes),
    nationalPriorities: extractDataArray(nationalPrioritiesRes),
    occupations: extractDataArray(occupationsRes),
    outcomeIndicators: extractDataArray(outcomeIndicatorsRes),
    reviewFrequencies: extractDataArray(reviewFrequenciesRes),
    schemes: extractDataArray(schemesRes),
    schemePhases: extractDataArray(schemePhasesRes),
    schemeStatuses: extractDataArray(schemeStatusesRes),
    schemeTypes: extractDataArray(schemeTypesRes),
    sdgs: extractDataArray(sdgsRes),
    sectors: extractDataArray(sectorsRes),
    serviceModes: extractDataArray(serviceModesRes),
    socialCategories: extractDataArray(socialCategoriesRes),
    stakeholderTypes: extractDataArray(stakeholderTypesRes),
    states: extractDataArray(statesRes),
    subSectors: extractDataArray(subSectorsRes),
    targetGroups: extractDataArray(targetGroupsRes),
    themes: extractDataArray(themesRes),
    urbanRural: extractDataArray(urbanRuralRes),
  };

  // Page core states
  const [formData, setFormData] = useState(getInitialSchemeState());
  const [currentTab, setCurrentTab] = useState(0);

  // Persistence state
  const [drafts, setDrafts] = useState([]);
  const [alertInfo, setAlertInfo] = useState(null);

  // Active registry track
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

  // Scroll active tab into view when currentTab changes
  useEffect(() => {
    if (tabsContainerRef.current) {
      const activeEl = tabsContainerRef.current.querySelector('.bg-primary');
      if (activeEl) {
        activeEl.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
          inline: 'center',
        });
      }
    }
  }, [currentTab]);

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
        setCurrentTab(0);
        showAlert('Scheme form has been fully reset.', 'info');
      },
    });
  };

  // Extract scheme name from formData
  const getSchemeName = () => {
    return (
      formData.SchemeMaster?.schemeName ||
      formData.basicInfo?.schemeName ||
      'Unnamed Government Scheme'
    );
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
  const handleSaveDraft = (customName = null) => {
    const schemeName = getSchemeName();
    const draftLabel = customName || schemeName;

    const cleanId =
      loadedRecordId && String(loadedRecordId).startsWith('DRAFT_')
        ? loadedRecordId
        : 'DRAFT_' + Date.now();

    const currentProgress = getOverallProgress();

    const newDraft = {
      id: cleanId,
      name: draftLabel,
      lastUpdated: new Date().toLocaleString(),
      progress: currentProgress,
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
    showAlert(
      `Draft "${newDraft.name}" saved successfully (${currentProgress}% complete)! You can reload it anytime.`,
      'success',
    );
  };

  // Delete a Saved Record
  const handleDeleteRecord = (id, isDraft = true) => {
    const recordType = isDraft ? 'draft' : 'submitted record';
    triggerConfirmation({
      title: `Delete ${isDraft ? 'Draft' : 'Submitted'} Record`,
      message: `Are you sure you want to permanently delete this ${recordType}? This action is irreversible.`,
      confirmText: 'Delete',
      confirmClass: 'btn-danger',
      onConfirm: () => {
        if (isDraft) {
          const filtered = drafts.filter((d) => d.id !== id);
          localStorage.setItem('gov_scheme_drafts', JSON.stringify(filtered));
          setDrafts(filtered);
        }
        if (loadedRecordId === id) {
          setFormData(getInitialSchemeState());
          setLoadedRecordId(null);
        }
        showAlert('Record deleted successfully.', 'info');
      },
    });
  };

  // Submit form (without validation as requested)
  const handleSubmitScheme = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    const schemeName = getSchemeName();

    triggerConfirmation({
      title: 'Register & Authorize Scheme',
      message: `Are you sure you want to register and authorize the scheme "${schemeName}"? This will save it permanently in the official portal directory.`,
      confirmText: 'Submit & Authorize',
      confirmClass: 'btn-success',
      onConfirm: () => {
        const schemeId =
          formData.SchemeMaster?.schemeId ||
          formData.basicInfo?.schemeId ||
          'SCH_' + Date.now();
        const newSubmission = {
          id: schemeId,
          name: schemeName,
          submittedDate: new Date().toLocaleString(),
          data: formData,
        };

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
  const handleLoadRecord = (record) => {
    setFormData(JSON.parse(JSON.stringify(record.data)));
    setLoadedRecordId(record.id);
    setCurrentTab(0);
    showAlert(`Loaded "${record.name}" into the 23-tab workspace!`, 'info');
  };

  // Dropdown options representing all schemes available to select
  const dropdownOptions = [
    { value: 'demo', label: 'Demo: PM Awas Yojana (Urban)' },
    ...drafts.map((d) => ({ value: `draft_${d.id}`, label: `Draft: ${d.name}` })),
  ];

  const selectedDropdownValue =
    loadedRecordId === 'demo_pmay' || loadedRecordId === 'demo'
      ? 'demo'
      : loadedRecordId
        ? drafts.some((d) => d.id === loadedRecordId)
          ? `draft_${loadedRecordId}`
          : `sub_${loadedRecordId}`
        : '';

  const handleDropdownChange = (val) => {
    if (!val) {
      setFormData(getInitialSchemeState());
      setLoadedRecordId(null);
      setCurrentTab(0);
      return;
    }
    if (val === 'demo') {
      setFormData(JSON.parse(JSON.stringify(PM_AWAS_YOJANA_DEMO)));
      setLoadedRecordId('demo_pmay');
      setCurrentTab(0);
      showAlert('Loaded "PM Awas Yojana (Urban)" Demo Scheme!', 'info');
    } else if (val.startsWith('draft_')) {
      const id = val.replace('draft_', '');
      const draft = drafts.find((d) => d.id === id);
      if (draft) {
        handleLoadRecord(draft);
      }
    }
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

  const filteredTabs = SCHEME_TABS_CONFIG.map((tab, idx) => ({ ...tab, originalIdx: idx }));

  const activeTabConfig = SCHEME_TABS_CONFIG[currentTab];

  return (
    <div className="fade-in pb-5">
      {/* Page Header */}
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-3  mt-2">
        <div>
          <h4 className="mb-1 text-dark-emphasis fw-bold">Government Scheme 360° Portal</h4>
        </div>
        <div className="d-flex gap-2 flex-wrap">
          {loadedRecordId && String(loadedRecordId).startsWith('DRAFT_') && (
            <button
              type="button"
              className="btn btn-outline-danger btn-sm px-3 shadow-sm d-flex align-items-center gap-1.5"
              onClick={() => handleDeleteRecord(loadedRecordId, true)}
            >
              <i className="bi bi-trash me-1"></i>
              <span>Delete Draft</span>
            </button>
          )}
          <button
            type="button"
            className="btn btn-light btn-sm border px-3 shadow-sm d-flex align-items-center gap-1.5"
            onClick={handleResetForm}
          >
            <i className="bi bi-arrow-counterclockwise me-1"></i>
            <span>Reset Workspace</span>
          </button>
        </div>
      </div>

      {/* Alert Banner & API Data Loading Spinner Banner */}
      {isFetchingOptions && (
        <div className="alert alert-info py-2 px-3 mb-3 d-flex align-items-center gap-2 rounded border-info-subtle bg-info-subtle text-info-emphasis shadow-sm" style={{ fontSize: '0.85rem' }}>
          <Spinner size="xs" variant="info" />
          <span>Fetching master dropdown options from API endpoints...</span>
        </div>
      )}

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

      {/* Main Tabbed Workspace */}
      <Card noBodyPadding={true} className="shadow">
        {/* Tab Controls Bar */}
        <div className="p-3 border-bottom d-flex flex-wrap align-items-center justify-content-between gap-3">
          {/* Quick tab keyword search filter */}
          <div style={{ minWidth: '240px' }}>
            <Dropdown
              options={dropdownOptions}
              value={selectedDropdownValue}
              onChange={handleDropdownChange}
              placeholder="Select scheme..."
              searchable={true}
              isLoading={isFetchingOptions}
            />
          </div>

          {/* Quick Dropdown Picker of 23 tabs */}
          <div className="d-flex align-items-center gap-2">
            <span className="text-muted d-none d-sm-inline" style={{ fontSize: '0.8rem' }}>
              Jump to:
            </span>
            <Dropdown
              options={SCHEME_TABS_CONFIG.map((tab, idx) => ({
                value: idx,
                label: `${tab.title} (${getTabProgress(tab.id)}% full)`,
              }))}
              value={currentTab}
              onChange={(val) => setCurrentTab(Number(val))}
              searchable={true}
              placeholder="Jump to tab..."
              style={{minWidth: '240px' }}
            />
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

                // Resolve options array from backend map or static configs
                const keyMap = {
                  ministry: 'ministries',
                  schemeType: 'schemeTypes',
                  status: 'schemeStatuses',
                  schemeStatus: 'schemeStatuses',
                  sector: 'sectors',
                  subSector: 'subSectors',
                  gender: 'genders',
                  urbanRural: 'urbanRural',
                  assistanceType: 'financialAssistanceTypes',
                  financialAssistanceType: 'financialAssistanceTypes',
                  deliveryMechanism: 'deliveryMechanisms',
                  reviewFrequency: 'reviewFrequencies',
                  benefitType: 'benefitTypes',
                  frequency: 'benefitFrequencies',
                  benefitFrequency: 'benefitFrequencies',
                  sharingPattern: 'fundSharingPatterns',
                  fundSharingPattern: 'fundSharingPatterns',
                  ageGroup: 'ageGroup',
                  category: 'beneficiaryCategories',
                  beneficiaryCategory: 'beneficiaryCategories',
                  beneficiaryType: 'beneficiaryTypes',
                  targetGroup: 'targetGroups',
                  socialCategory: 'socialCategories',
                  occupation: 'occupations',
                  implementingAgency: 'implementingAgencies',
                  monitoringAgency: 'monitoringAgencies',
                  state: 'states',
                  district: 'districts',
                  department: 'departments',
                  theme: 'themes',
                  nationalPriority: 'nationalPriorities',
                  geographicCoverage: 'geographicCoverages',
                  localBody: 'localBodies',
                  mission: 'missions',
                  schemePhase: 'schemePhases',
                  sdg: 'sdgs',
                  serviceMode: 'serviceModes',
                  stakeholderType: 'stakeholderTypes',
                  document: 'documents',
                  insuranceType: 'insuranceTypes',
                  outcomeIndicator: 'outcomeIndicators',
                  incomeCriteria: 'incomeCriteria',
                };

                const backendKey = keyMap[field.key] || field.key;
                const backendOpts =
                  backendOptionsMap[backendKey] ||
                  backendOptionsMap[field.key] ||
                  backendOptionsMap[field.key + 's'];

                const apiOpts = (Array.isArray(backendOpts) ? backendOpts : [])
                  .map((item) => getOptionName(item))
                  .filter(Boolean);

                const staticOpts = Array.isArray(field.options) ? field.options : [];
                const fallbackOpts =
                  DEFAULT_FALLBACK_OPTIONS[field.key] ||
                  DEFAULT_FALLBACK_OPTIONS[backendKey] ||
                  [];

                // Priority resolution: Live API data > Static field config > Initial Fallback defaults
                let rawOptions = [];
                if (apiOpts.length > 0) {
                  rawOptions = apiOpts;
                } else if (staticOpts.length > 0) {
                  rawOptions = staticOpts;
                } else {
                  rawOptions = fallbackOpts;
                }

                // Remove duplicate trimmed values
                let optionsList = Array.from(
                  new Set(rawOptions.map((opt) => String(opt).trim()).filter(Boolean))
                );

                // Ensure the current selected value is always present in the options list so it doesn't show as blank/select...
                if (value && !optionsList.includes(value)) {
                  optionsList = [value, ...optionsList];
                }

                const isSelect = field.type === 'select' || optionsList.length > 0;

                return (
                  <div key={field.key} className={`col-12 col-md-${field.col || 6}`}>
                    <label
                      className="form-label text-dark-emphasis fw-medium mb-1"
                      style={{ fontSize: '0.8rem' }}
                    >
                      {field.label}
                    </label>

                    {/* SELECT DROPDOWNS */}
                    {isSelect ? (
                      <Dropdown
                        options={optionsList}
                        value={value || ''}
                        onChange={(val) => handleFieldChange(val)}
                        placeholder={`Select ${field.label.toLowerCase()}...`}
                        searchable={true}
                        isLoading={isFetchingOptions}
                        style={{ minWidth: '100%' }}
                      />
                    ) : /* TEXTAREAS */
                    field.type === 'textarea' ? (
                      <textarea
                        name={field.key}
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
                        name={field.key}
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

              {/* Actions & Exporters */}
              <div className="d-flex gap-2 flex-wrap">
                <button
                  type="button"
                  className="btn btn-outline-primary btn-sm px-3 shadow-sm d-flex align-items-center gap-1.5"
                  onClick={() => handleSaveDraft()}
                >
                  <i className="bi bi-floppy-fill me-1"></i>
                  <span>Save Draft</span>
                </button>
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
