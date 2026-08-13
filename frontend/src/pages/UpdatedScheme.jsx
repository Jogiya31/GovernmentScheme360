import React, { useState, useEffect, useRef } from 'react';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { SCHEME_TABS_CONFIG, getInitialSchemeState } from '../data/schemeFields';

import Alert from '../components/common/Alert';
import Card from '../components/common/Card';
import Modal from '../components/common/Modal';
import Dropdown from '../components/common/Dropdown';
import Spinner from '../components/common/Spinner';
import {
  useGetAgeGroupMutation,
  useGetBeneficiaryCategoryMutation,
  useGetBeneficiaryTypeMutation,
  useGetBenefitFrequencyMutation,
  useGetBenefitTypeMutation,
  useGetDeliveryMechanismMutation,
  useGetDepartmentMutation,
  useGetDistrictMutation,
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
  useGetSchemeByIdMutation,
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

  useSetSchemeBeneficiariesMutation,
  useSetSchemeBenefitsMutation,
  useSetSchemeClassificationMutation,
  useSetSchemeComplementaryMutation,
  useSetSchemeConvergenceMutation,
  useSetSchemeDistrictMutation,
  useSetSchemeDuplicateMutation,
  useSetSchemeEligibilityMutation,
  useSetSchemeFinancialsMutation,
  useSetSchemeGeographyMutation,
  useSetSchemeImplementationMutation,
  useSetSchemeMissionMutation,
  useSetSchemeObjectivesMutation,
  useSetSchemeOutcomesMutation,
  useSetSchemeRelationshipsMutation,
  useSetSchemeRisksMutation,
  useSetSchemeSDGMutation,
  useSetSchemeSimilarMutation,
  useSetSchemeStakeholdersMutation,
  useSetSchemeStateMutation,
  useSetSchemeTimelineMutation,

  useUpdateSchemeMasterMutation,
  useUpdateSchemeObjectivesMutation,
  useUpdateSchemeClassificationMutation,
  useUpdateSchemeBeneficiariesMutation,
  useUpdateSchemeEligibilityMutation,
  useUpdateSchemeFinancialsMutation,
  useUpdateSchemeImplementationMutation,
  useUpdateSchemeGeographyMutation,
  useUpdateSchemeTimelineMutation,
  useUpdateSchemeBenefitsMutation,
  useUpdateSchemeComplementaryMutation,
  useUpdateSchemeConvergenceMutation,
  useUpdateSchemeOutcomesMutation,
  useUpdateSchemeSimilarMutation,
  useUpdateSchemeSDGMutation,
  useUpdateSchemeStakeholdersMutation,
  useUpdateSchemeRisksMutation,
  useUpdateSchemeMissionMutation,
  useUpdateSchemeRelationshipsMutation,
  useUpdateSchemeDuplicateMutation,
  useUpdateSchemeStateMutation,
  useUpdateSchemeDistrictMutation,
} from '../app/api';
import { useSelector } from 'react-redux';

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

  if (typeof res === 'object' && res !== null) {
    const keys = Object.keys(res);
    for (const key of keys) {
      if (Array.isArray(res[key])) return res[key];
    }
  }
  return [];
};

const getOptionObj = (item) => {
  if (item === null || item === undefined) return null;
  if (typeof item === 'string' || typeof item === 'number') {
    const str = String(item).trim();
    return str ? { value: str, label: str } : null;
  }
  if (typeof item !== 'object') return null;

  // 1. Determine Label / Name
  let label = '';
  const labelKeys = [
    'label',
    'name',
    'title',
    'text',
    'description',
    'categoryName',
    'typeName',
    'groupName',
    'departmentName',
    'ministryName',
    'agencyName',
    'statusName',
    'sectorName',
    'modeName',
    'priorityName',
    'frequencyName',
    'coverageName',
    'bodyName',
    'indicatorName',
    'schemeName',
    'phaseName',
    'patternName',
    'mechanismName',
    'criteriaName',
    'documentName',
    'limitName',
    'insuranceName',
    'Goal',
  ];
  for (const k of labelKeys) {
    if (item[k] !== undefined && item[k] !== null && String(item[k]).trim()) {
      label = String(item[k]).trim();
      break;
    }
  }

  if (!label) {
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
        k.toLowerCase().endsWith('description'),
    );
    if (nameKey && item[nameKey] !== undefined && item[nameKey] !== null) {
      label = String(item[nameKey]).trim();
    }
  }

  if (!label) {
    const keys = Object.keys(item);
    const stringKey = keys.find(
      (k) =>
        typeof item[k] === 'string' &&
        k !== 'id' &&
        k !== '_id' &&
        !k.toLowerCase().includes('id') &&
        item[k].trim(),
    );
    if (stringKey) label = item[stringKey].trim();
  }

  if (!label) {
    const keys = Object.keys(item);
    const anyStringKey = keys.find((k) => typeof item[k] === 'string' && item[k].trim());
    if (anyStringKey) label = item[anyStringKey].trim();
  }

  if (!label) {
    const keys = Object.keys(item);
    if (keys.length > 0 && item[keys[0]] !== undefined) {
      label = String(item[keys[0]]);
    }
  }

  // 2. Determine Value / ID
  let value = '';
  const valueKeys = [
    'value',
    'id',
    '_id',
    'ID',
    'Id',
    'code',
    'key',
    'schemeID',
    'schemeId',
    'departmentID',
    'departmentId',
    'ministryID',
    'ministryId',
    'sectorID',
    'sectorId',
    'districtID',
    'districtId',
    'stateID',
    'stateId',
    'SDGCode',
  ];
  for (const k of valueKeys) {
    if (item[k] !== undefined && item[k] !== null && String(item[k]).trim() !== '') {
      value = String(item[k]).trim();
      break;
    }
  }

  if (!value) {
    const keys = Object.keys(item);
    const idKey = keys.find(
      (k) =>
        k.toLowerCase() === 'id' ||
        k.toLowerCase() === '_id' ||
        k.toLowerCase() === 'code' ||
        k.toLowerCase().endsWith('id') ||
        k.toLowerCase().endsWith('_id') ||
        k.toLowerCase().endsWith('code'),
    );
    if (
      idKey &&
      item[idKey] !== undefined &&
      item[idKey] !== null &&
      String(item[idKey]).trim() !== ''
    ) {
      value = String(item[idKey]).trim();
    }
  }

  if (!value) {
    value = label;
  }

  if (!label && !value) return null;

  return { value, label: label };
};

const getOptionName = (item) => {
  const obj = getOptionObj(item);
  return obj ? obj.label : '';
};

const normalizeRecordKey = (key) =>
  String(key)
    .replace(/[\s_-]/g, '')
    .toLowerCase();

const getRecordValue = (record, aliases = []) => {
  if (!record || typeof record !== 'object') return undefined;

  for (const key of aliases) {
    if (Object.prototype.hasOwnProperty.call(record, key)) {
      return record[key];
    }
  }

  const normalizedAliases = aliases.map(normalizeRecordKey);
  const foundKey = Object.keys(record).find((key) =>
    normalizedAliases.includes(normalizeRecordKey(key)),
  );

  return foundKey ? record[foundKey] : undefined;
};

const getSchemeRecordId = (scheme, fallback = '') => {
  if (typeof scheme === 'string' || typeof scheme === 'number') return String(scheme);

  const id = getRecordValue(scheme, ['SchemeID', 'schemeID', 'schemeId', 'SchemeId', 'id', 'ID']);
  if (id !== undefined && id !== null && String(id).trim() !== '') {
    return String(id);
  }

  const nested = getRecordValue(scheme, ['SchemeMaster', 'schemeMaster', 'master']);
  if (nested && typeof nested === 'object') {
    const nestedId = getRecordValue(nested, [
      'SchemeID',
      'schemeID',
      'schemeId',
      'SchemeId',
      'id',
      'ID',
    ]);
    if (nestedId !== undefined && nestedId !== null && String(nestedId).trim() !== '') {
      return String(nestedId);
    }
  }

  return String(fallback);
};

const getSchemeRecordName = (scheme, fallback = '') => {
  if (typeof scheme === 'string' || typeof scheme === 'number') return String(scheme);

  let name = getRecordValue(scheme, [
    'SchemeName',
    'schemeName',
    'scheme_name',
    'name',
    'title',
    'label',
  ]);
  if (name === undefined || name === null || String(name).trim() === '') {
    const nested = getRecordValue(scheme, ['SchemeMaster', 'schemeMaster', 'master']);
    if (nested && typeof nested === 'object') {
      name = getRecordValue(nested, [
        'SchemeName',
        'schemeName',
        'scheme_name',
        'name',
        'title',
        'label',
      ]);
    }
  }

  if (name === undefined || name === null || String(name).trim() === '') {
    name = getOptionName(scheme);
  }

  return name !== undefined && name !== null && String(name).trim() !== ''
    ? String(name)
    : String(fallback);
};

const normalizeFormFieldValue = (value, field) => {
  if (value === undefined || value === null) return '';
  if (typeof value === 'boolean') {
    if (field?.type === 'select') return value ? 'Yes' : 'No';
    return String(value);
  }
  if (field?.type !== 'date') return String(value);

  const raw = String(value).trim();
  if (!raw) return '';

  const isoMatch = raw.match(/^(\d{4}-\d{2}-\d{2})/);
  if (isoMatch) return isoMatch[1];

  const slashOrDashMatch = raw.match(/^(\d{1,2})[/-](\d{1,2})[/-](\d{4})$/);
  if (slashOrDashMatch) {
    const [, dd, mm, yyyy] = slashOrDashMatch;
    return `${yyyy}-${mm.padStart(2, '0')}-${dd.padStart(2, '0')}`;
  }

  const parsedDate = new Date(raw);
  if (!Number.isNaN(parsedDate.getTime())) {
    return parsedDate.toISOString().slice(0, 10);
  }

  return '';
};

const unwrapApiResponse = (apiResult) => {
  if (!apiResult) return null;
  if (apiResult.data !== undefined) {
    if (apiResult.data?.data !== undefined) return apiResult.data.data;
    return apiResult.data;
  }
  if (apiResult.result !== undefined) return apiResult.result;
  return apiResult;
};

const hasTabData = (value) => {
  if (value === undefined || value === null) return false;
  if (Array.isArray(value)) return value.length > 0;
  if (typeof value === 'object') {
    return Object.values(value).some(
      (item) =>
        item !== undefined &&
        item !== null &&
        String(item).trim() !== '' &&
        !(Array.isArray(item) && item.length === 0),
    );
  }
  return String(value).trim() !== '';
};

const getLoadedTabState = (scheme) => {
  const loaded = {};
  SCHEME_TABS_CONFIG.forEach((tab) => {
    loaded[tab.id] = hasTabData(getRecordValue(scheme, [tab.id]));
  });
  return loaded;
};

const getPopulatedTabIds = (schemePayload, nextForm) => {
  const populated = new Set(['SchemeMaster']);
  const loadedState = getLoadedTabState(schemePayload);

  SCHEME_TABS_CONFIG.forEach((tab) => {
    if (loadedState[tab.id]) {
      populated.add(tab.id);
    } else if (nextForm && nextForm[tab.id]) {
      const tabValues = nextForm[tab.id];
      const hasContent = Object.entries(tabValues).some(([key, val]) => {
        if (['SchemeID', 'CreatedBy', 'UpdatedBy'].includes(key)) return false;
        return val !== undefined && val !== null && String(val).trim() !== '';
      });
      if (hasContent) {
        populated.add(tab.id);
      }
    }
  });

  return Array.from(populated);
};

const buildFormFromSchemeRecord = (scheme, selectedValue = '') => {
  const nextForm = getInitialSchemeState();
  const schemeId = getSchemeRecordId(scheme, selectedValue);
  const schemeName = getSchemeRecordName(scheme, selectedValue);

  if (scheme && typeof scheme === 'object') {
    SCHEME_TABS_CONFIG.forEach((tab) => {
      const nestedTabData = getRecordValue(scheme, [tab.id]);
      const tabSource = Array.isArray(nestedTabData) ? nestedTabData[0] : nestedTabData;

      if (tabSource && typeof tabSource === 'object') {
        nextForm[tab.id] = { ...nextForm[tab.id], ...tabSource };
      }

      tab.fields.forEach((field) => {
        let value;
        if (tabSource && typeof tabSource === 'object') {
          value = getRecordValue(tabSource, [field.key]);
        }
        if (value === undefined || value === null) {
          value = getRecordValue(scheme, [field.key]);
        }

        if (value !== undefined && value !== null) {
          nextForm[tab.id][field.key] = normalizeFormFieldValue(value, field);
        } else if (
          nextForm[tab.id][field.key] !== undefined &&
          nextForm[tab.id][field.key] !== null
        ) {
          nextForm[tab.id][field.key] = normalizeFormFieldValue(nextForm[tab.id][field.key], field);
        }
      });
    });
  }

  if (nextForm.SchemeMaster) {
    if (schemeId) nextForm.SchemeMaster.SchemeID = schemeId;
    if (schemeName) nextForm.SchemeMaster.SchemeName = schemeName;
  }

  return { nextForm, schemeId, schemeName };
};

export const validateField = (field, value, tabId = '', tabValues = {}) => {
  const strVal = String(value || '').trim();

  const isExplicitlyRequired =
    field.validate === true ||
    field.validate === 'true' ||
    field.required === true ||
    field.required === 'true';

  // Explicit required check
  if (isExplicitlyRequired && !strVal) {
    return `${field.label} is required.`;
  }

  // If empty and not required, pass validation
  if (!strVal) return null;

  // Length check for text fields if text entered
  if (field.type === 'text' && field.key === 'SchemeName' && strVal.length < 3) {
    return 'Scheme Name must be at least 3 characters long.';
  }

  // Number fields validation
  if (field.type === 'number') {
    const num = Number(strVal);
    if (isNaN(num)) {
      return `${field.label} must be a valid number.`;
    }
    if (num < 0) {
      return `${field.label} cannot be negative.`;
    }
    if (num > 100000000000) {
      return `${field.label} exceeds maximum allowed limit.`;
    }
    if (field.key === 'EstimatedBeneficiaries' && !Number.isInteger(num)) {
      return 'Estimated beneficiaries must be a whole integer.';
    }

    // Financial calculations validation
    if (tabId === 'SchemeFinancials') {
      const totalBudget = Number(tabValues.TotalBudget || 0);
      if (totalBudget > 0) {
        if (field.key === 'Expenditure' && num > totalBudget) {
          return `Expenditure (₹${num} Cr) cannot exceed Total Budget (₹${totalBudget} Cr).`;
        }
        if (field.key === 'AnnualBudget' && num > totalBudget) {
          return `Annual Budget (₹${num} Cr) cannot exceed Total Budget (₹${totalBudget} Cr).`;
        }
      }
    }
  }

  // Date fields validation
  if (field.type === 'date') {
    const timestamp = Date.parse(strVal);
    if (isNaN(timestamp)) {
      return 'Please enter a valid date.';
    }

    const dateObj = new Date(strVal);
    const year = dateObj.getFullYear();
    if (year < 1947 || year > 2100) {
      return 'Year must be between 1947 and 2100.';
    }

    // Timeline chronology checks
    if (field.key === 'LaunchDate' && tabValues.AnnouncementDate) {
      const announceTs = Date.parse(String(tabValues.AnnouncementDate).trim());
      if (!isNaN(announceTs) && timestamp < announceTs) {
        return 'Launch Date cannot be before Announcement Date.';
      }
    }
    if (field.key === 'FirstDisbursement' && tabValues.LaunchDate) {
      const launchTs = Date.parse(String(tabValues.LaunchDate).trim());
      if (!isNaN(launchTs) && timestamp < launchTs) {
        return 'First Disbursement cannot be before Launch Date.';
      }
    }
    if (field.key === 'EndDate' && tabValues.LaunchDate) {
      const launchTs = Date.parse(String(tabValues.LaunchDate).trim());
      if (!isNaN(launchTs) && timestamp < launchTs) {
        return 'End Date cannot be before Launch Date.';
      }
    }
  }

  // Textarea minimum length check
  if (field.type === 'textarea') {
    if (strVal.length < 5) {
      return `${field.label} should be at least 5 characters long.`;
    }
  }

  // Text inputs specific validation
  if (field.type === 'text') {
    if (field.key === 'Website' || field.key === 'PortalName') {
      const urlPattern = /^(https?:\/\/)?([\w-]+\.)+[\w-]+(\/[\w-./?%&=]*)?$/i;
      if (!urlPattern.test(strVal)) {
        return 'Please enter a valid URL or domain (e.g. pmay.gov.in).';
      }
    } else if (strVal.length < 2 && field.key !== 'AlternateName') {
      return `${field.label} must be at least 2 characters.`;
    }
  }

  return null;
};

export const validateSchemeForm = (formData, selectedTabIds = null) => {
  const errors = {};
  const tabsToValidate = selectedTabIds
    ? SCHEME_TABS_CONFIG.filter((t) => selectedTabIds.includes(t.id))
    : SCHEME_TABS_CONFIG;

  tabsToValidate.forEach((tab) => {
    const tabErrors = {};
    const tabValues = formData[tab.id] || {};

    tab.fields.forEach((field) => {
      const val = tabValues[field.key];
      const errorMsg = validateField(field, val, tab.id, tabValues);
      if (errorMsg) {
        tabErrors[field.key] = errorMsg;
      }
    });

    if (Object.keys(tabErrors).length > 0) {
      errors[tab.id] = tabErrors;
    }
  });

  return errors;
};

export default function UpdatedScheme() {
  const { user } = useSelector((state) => state.auth);

  const [getSchemeById] = useGetSchemeByIdMutation();

  const [loadedTabHasData, setLoadedTabHasData] = useState({});
  const [formErrors, setFormErrors] = useState({});

  const [getAgeGroup, { data: ageGroupRes }] = useGetAgeGroupMutation();
  const [getBeneficiaryCategory, { data: beneficiaryCategoriesRes }] =
    useGetBeneficiaryCategoryMutation();
  const [getBeneficiaryType, { data: beneficiaryTypesRes }] = useGetBeneficiaryTypeMutation();
  const [getBenefitFrequency, { data: benefitFrequenciesRes }] = useGetBenefitFrequencyMutation();
  const [getBenefitType, { data: benefitTypesRes }] = useGetBenefitTypeMutation();
  const [getDeliveryMechanism, { data: deliveryMechanismsRes }] = useGetDeliveryMechanismMutation();
  const [getDepartment, { data: departmentsRes }] = useGetDepartmentMutation();
  const [getDistrict, { data: districtsRes }] = useGetDistrictMutation();
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

  const [setSchemeObjectives] = useSetSchemeObjectivesMutation();
  const [setSchemeClassification] = useSetSchemeClassificationMutation();
  const [setSchemeBeneficiaries] = useSetSchemeBeneficiariesMutation();
  const [setSchemeEligibility] = useSetSchemeEligibilityMutation();
  const [setSchemeFinancials] = useSetSchemeFinancialsMutation();
  const [setSchemeImplementation] = useSetSchemeImplementationMutation();
  const [setSchemeGeography] = useSetSchemeGeographyMutation();
  const [setSchemeTimeline] = useSetSchemeTimelineMutation();
  const [setSchemeBenefits] = useSetSchemeBenefitsMutation();
  const [setSchemeComplementary] = useSetSchemeComplementaryMutation();
  const [setSchemeConvergence] = useSetSchemeConvergenceMutation();
  const [setSchemeOutcomes] = useSetSchemeOutcomesMutation();
  const [setSchemeSimilar] = useSetSchemeSimilarMutation();
  const [setSchemeSDG] = useSetSchemeSDGMutation();
  const [setSchemeStakeholders] = useSetSchemeStakeholdersMutation();
  const [setSchemeRisks] = useSetSchemeRisksMutation();
  const [setSchemeMission] = useSetSchemeMissionMutation();
  const [setSchemeRelationships] = useSetSchemeRelationshipsMutation();
  const [setSchemeDuplicate] = useSetSchemeDuplicateMutation();
  const [setSchemeState] = useSetSchemeStateMutation();
  const [setSchemeDistrict] = useSetSchemeDistrictMutation();

  const [updateSchemeMaster] = useUpdateSchemeMasterMutation();
  const [updateSchemeObjectives] = useUpdateSchemeObjectivesMutation();
  const [updateSchemeClassification] = useUpdateSchemeClassificationMutation();
  const [updateSchemeBeneficiaries] = useUpdateSchemeBeneficiariesMutation();
  const [updateSchemeEligibility] = useUpdateSchemeEligibilityMutation();
  const [updateSchemeFinancials] = useUpdateSchemeFinancialsMutation();
  const [updateSchemeImplementation] = useUpdateSchemeImplementationMutation();
  const [updateSchemeGeography] = useUpdateSchemeGeographyMutation();
  const [updateSchemeTimeline] = useUpdateSchemeTimelineMutation();
  const [updateSchemeBenefits] = useUpdateSchemeBenefitsMutation();
  const [updateSchemeComplementary] = useUpdateSchemeComplementaryMutation();
  const [updateSchemeConvergence] = useUpdateSchemeConvergenceMutation();
  const [updateSchemeOutcomes] = useUpdateSchemeOutcomesMutation();
  const [updateSchemeSimilar] = useUpdateSchemeSimilarMutation();
  const [updateSchemeSDG] = useUpdateSchemeSDGMutation();
  const [updateSchemeStakeholders] = useUpdateSchemeStakeholdersMutation();
  const [updateSchemeRisks] = useUpdateSchemeRisksMutation();
  const [updateSchemeMission] = useUpdateSchemeMissionMutation();
  const [updateSchemeRelationships] = useUpdateSchemeRelationshipsMutation();
  const [updateSchemeDuplicate] = useUpdateSchemeDuplicateMutation();
  const [updateSchemeState] = useUpdateSchemeStateMutation();
  const [updateSchemeDistrict] = useUpdateSchemeDistrictMutation();

  const [isFetchingOptions, setIsFetchingOptions] = useState(false);
  const [apiSchemes, setApiSchemes] = useState([]);
  const [apiOptionsMap, setApiOptionsMap] = useState({});

  useEffect(() => {
    setIsFetchingOptions(true);

    const calls = [
      { key: 'ageGroup', fn: getAgeGroup },
      { key: 'beneficiaryCategories', fn: getBeneficiaryCategory },
      { key: 'beneficiaryTypes', fn: getBeneficiaryType },
      { key: 'benefitFrequencies', fn: getBenefitFrequency },
      { key: 'benefitTypes', fn: getBenefitType },
      { key: 'deliveryMechanisms', fn: getDeliveryMechanism },
      { key: 'departments', fn: getDepartment },
      { key: 'districts', fn: getDistrict },
      { key: 'financialAssistanceTypes', fn: getFinancialAssistanceType },
      { key: 'fundSharingPatterns', fn: getFundSharingPattern },
      { key: 'genders', fn: getGender },
      { key: 'geographicCoverages', fn: getGeographicCoverage },
      { key: 'implementingAgencies', fn: getImplementingAgency },
      { key: 'incomeLimit', fn: getIncomeCriteria },
      { key: 'insuranceTypes', fn: getInsuranceType },
      { key: 'localBodies', fn: getLocalBody },
      { key: 'ministries', fn: getMinistry },
      { key: 'missions', fn: getMission },
      { key: 'monitoringAgencies', fn: getMonitoringAgency },
      { key: 'nationalPriorities', fn: getNationalPriority },
      { key: 'occupations', fn: getOccupation },
      { key: 'outcomeIndicators', fn: getOutcomeIndicator },
      { key: 'reviewFrequencies', fn: getReviewFrequency },
      { key: 'schemePhases', fn: getSchemePhase },
      { key: 'schemeStatuses', fn: getSchemeStatus },
      { key: 'schemeTypes', fn: getSchemeType },
      { key: 'sdgs', fn: getSDG },
      { key: 'sectors', fn: getSector },
      { key: 'serviceModes', fn: getServiceMode },
      { key: 'socialCategories', fn: getSocialCategory },
      { key: 'stakeholderTypes', fn: getStakeholderType },
      { key: 'states', fn: getState },
      { key: 'subSectors', fn: getSubSector },
      { key: 'targetGroups', fn: getTargetGroup },
      { key: 'themes', fn: getTheme },
      { key: 'urbanRural', fn: getUrbanRural },
      { key: 'schemes', fn: getScheme },
    ];

    Promise.allSettled(
      calls.map(({ key, fn }) =>
        fn({})
          .then((res) => {
            const list = extractDataArray(res?.data || res);
            return { key, list };
          })
          .catch((err) => {
            console.warn(`Error fetching ${key}:`, err);
            return { key, list: [] };
          }),
      ),
    ).then((results) => {
      const fetchedMap = {};
      results.forEach((r) => {
        if (r.status === 'fulfilled' && r.value) {
          const { key, list } = r.value;
          if (Array.isArray(list) && list.length > 0) {
            fetchedMap[key] = list;
          }
        }
      });
      setApiOptionsMap((prev) => ({ ...prev, ...fetchedMap }));
      if (fetchedMap.schemes && fetchedMap.schemes.length > 0) {
        setApiSchemes(fetchedMap.schemes);
      }
      setIsFetchingOptions(false);
    });
  }, []);

  const backendOptionsMap = {
    ageGroup: apiOptionsMap.ageGroup || extractDataArray(ageGroupRes),
    beneficiaryCategories:
      apiOptionsMap.beneficiaryCategories || extractDataArray(beneficiaryCategoriesRes),
    beneficiaryTypes: apiOptionsMap.beneficiaryTypes || extractDataArray(beneficiaryTypesRes),
    benefitFrequencies: apiOptionsMap.benefitFrequencies || extractDataArray(benefitFrequenciesRes),
    benefitTypes: apiOptionsMap.benefitTypes || extractDataArray(benefitTypesRes),
    deliveryMechanisms: apiOptionsMap.deliveryMechanisms || extractDataArray(deliveryMechanismsRes),
    departments: apiOptionsMap.departments || extractDataArray(departmentsRes),
    districts: apiOptionsMap.districts || extractDataArray(districtsRes),
    financialAssistanceTypes:
      apiOptionsMap.financialAssistanceTypes || extractDataArray(financialAssistanceTypesRes),
    fundSharingPatterns:
      apiOptionsMap.fundSharingPatterns || extractDataArray(fundSharingPatternsRes),
    genders: apiOptionsMap.genders || extractDataArray(gendersRes),
    geographicCoverages:
      apiOptionsMap.geographicCoverages || extractDataArray(geographicCoveragesRes),
    implementingAgencies:
      apiOptionsMap.implementingAgencies || extractDataArray(implementingAgenciesRes),
    incomeLimit: apiOptionsMap.incomeCriteria || extractDataArray(incomeCriteriaRes),
    insurance: apiOptionsMap.insuranceTypes || extractDataArray(insuranceTypesRes),
    localBodies: apiOptionsMap.localBodies || extractDataArray(localBodiesRes),
    ministries: apiOptionsMap.ministries || extractDataArray(ministriesRes),
    missions: apiOptionsMap.missions || extractDataArray(missionsRes),
    monitoringAgencies: apiOptionsMap.monitoringAgencies || extractDataArray(monitoringAgenciesRes),
    nationalPriorities: apiOptionsMap.nationalPriorities || extractDataArray(nationalPrioritiesRes),
    occupations: apiOptionsMap.occupations || extractDataArray(occupationsRes),
    outcomeIndicators: apiOptionsMap.outcomeIndicators || extractDataArray(outcomeIndicatorsRes),
    reviewFrequencies: apiOptionsMap.reviewFrequencies || extractDataArray(reviewFrequenciesRes),
    schemes:
      apiSchemes.length > 0 ? apiSchemes : apiOptionsMap.schemes || extractDataArray(schemesRes),
    schemePhases: apiOptionsMap.schemePhases || extractDataArray(schemePhasesRes),
    schemeStatuses: apiOptionsMap.schemeStatuses || extractDataArray(schemeStatusesRes),
    schemeTypes: apiOptionsMap.schemeTypes || extractDataArray(schemeTypesRes),
    sdgs: apiOptionsMap.sdgs || extractDataArray(sdgsRes),
    sectors: apiOptionsMap.sectors || extractDataArray(sectorsRes),
    serviceModes: apiOptionsMap.serviceModes || extractDataArray(serviceModesRes),
    socialCategories: apiOptionsMap.socialCategories || extractDataArray(socialCategoriesRes),
    stakeholderTypes: apiOptionsMap.stakeholderTypes || extractDataArray(stakeholderTypesRes),
    states: apiOptionsMap.states || extractDataArray(statesRes),
    subSectors: apiOptionsMap.subSectors || extractDataArray(subSectorsRes),
    targetGroups: apiOptionsMap.targetGroups || extractDataArray(targetGroupsRes),
    themes: apiOptionsMap.themes || extractDataArray(themesRes),
    urbanRural: apiOptionsMap.urbanRural || extractDataArray(urbanRuralRes),
  };

  // Page core states
  const [formData, setFormData] = useState(getInitialSchemeState());
  const [selectedTabIds, setSelectedTabIds] = useState(['SchemeMaster']);
  const [activeTabId, setActiveTabId] = useState('SchemeMaster');
  const [showCheckboxPanel, setShowCheckboxPanel] = useState(false);

  // Persistence state
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

  const tabsContainerRef = useRef(null);

  const toggleTabSelection = (tabId) => {
    setSelectedTabIds((prev) => {
      if (prev.includes(tabId)) {
        if (prev.length === 1) return prev;
        return prev.filter((id) => id !== tabId);
      } else {
        return [...prev, tabId];
      }
    });
  };

  const handleSelectAllTabs = () => {
    setSelectedTabIds(SCHEME_TABS_CONFIG.map((t) => t.id));
  };

  const handleSelectBasicInfoOnly = () => {
    setSelectedTabIds(['SchemeMaster']);
    setActiveTabId('SchemeMaster');
  };

  const visibleTabs = SCHEME_TABS_CONFIG.filter((tab) =>
    selectedTabIds.includes(tab.id),
  );

  useEffect(() => {
    if (!selectedTabIds.includes(activeTabId)) {
      if (visibleTabs.length > 0) {
        setActiveTabId(visibleTabs[0].id);
      } else {
        setActiveTabId('SchemeMaster');
      }
    }
  }, [selectedTabIds, activeTabId]);

  // Scroll active tab into view when activeTabId changes
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
  }, [activeTabId]);

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
        setFormErrors({});
        setSelectedTabIds(['SchemeMaster']);
        setActiveTabId('SchemeMaster');
        showAlert('Scheme form has been fully reset.', 'info');
      },
    });
  };

  // Extract scheme name from formData
  const getSchemeName = () => {
    return (
      formData.SchemeMaster?.SchemeName ||
      formData.SchemeMaster?.schemeName ||
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

  const rawSchemesList = Array.isArray(backendOptionsMap.schemes) ? backendOptionsMap.schemes : [];

  const schemeOptions = rawSchemesList
    .map((s) => {
      if (!s) return null;
      if (typeof s === 'string' || typeof s === 'number') {
        return { value: String(s), label: String(s) };
      }
      const val = getSchemeRecordId(s, getOptionName(s));
      const lbl = getSchemeRecordName(s, val);
      if (!val && !lbl) return null;
      return {
        value: String(val || lbl),
        label: String(lbl || val),
      };
    })
    .filter(Boolean);

  const dropdownOptions = schemeOptions;

  const selectedDropdownValue = loadedRecordId ? String(loadedRecordId) : '';

  const handleDropdownChange = async (val) => {
    if (!val) {
      setFormData(getInitialSchemeState());
      setLoadedRecordId(null);
      setLoadedTabHasData({});
      setFormErrors({});
      setSelectedTabIds(['SchemeMaster']);
      setActiveTabId('SchemeMaster');
      return;
    }

    try {
      const response = await getSchemeById({ SchemeID: val }).unwrap();
      const payload = unwrapApiResponse(response);

      if (!payload || typeof payload !== 'object') {
        showAlert('Selected scheme response did not contain valid data.', 'warning');
        setFormData(getInitialSchemeState());
        setLoadedRecordId(String(val));
        setLoadedTabHasData({});
        setFormErrors({});
        setSelectedTabIds(['SchemeMaster']);
        setActiveTabId('SchemeMaster');
        return;
      }

      const { nextForm, schemeId, schemeName } = buildFormFromSchemeRecord(payload, val);
      const loadedTabState = getLoadedTabState(payload);
      const activeTabs = getPopulatedTabIds(payload, nextForm);

      setFormData(nextForm);
      setLoadedRecordId(String(schemeId || val));
      setLoadedTabHasData(loadedTabState);
      setFormErrors({});
      setSelectedTabIds(activeTabs);
      setActiveTabId('SchemeMaster');

      showAlert(`Loaded scheme "${schemeName || 'Record'}" and auto-filled the form.`, 'success');
    } catch (error) {
      console.error('Error fetching selected scheme:', error);
      showAlert('Failed to load selected scheme. Please try again.', 'danger');
    }
  };

  // Export full 23-tab scheme structure into a majestic PDF report
  const handleExportPDFReport = () => {
    try {
      const doc = new jsPDF();
      const schemeTitle = formData.SchemeMaster?.SchemeName || 'Government Scheme Register';
      const ministryName = formData.SchemeMaster?.MinistryID || 'Nodal Ministry Unspecified';

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

      doc.save(`scheme-report-${formData.SchemeMaster?.SchemeID || 'registry'}.pdf`);
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

  const filteredTabs = visibleTabs.map((tab, idx) => ({ ...tab, originalIdx: idx }));

  const activeTabConfig =
    SCHEME_TABS_CONFIG.find((t) => t.id === activeTabId) || SCHEME_TABS_CONFIG[0];

  const currentVisibleIndex = visibleTabs.findIndex((t) => t.id === activeTabId);

  const handlePrevTab = () => {
    if (currentVisibleIndex > 0) {
      setActiveTabId(visibleTabs[currentVisibleIndex - 1].id);
    }
  };

  const handleNextTab = () => {
    if (currentVisibleIndex < visibleTabs.length - 1) {
      setActiveTabId(visibleTabs[currentVisibleIndex + 1].id);
    }
  };

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
      onConfirm: async () => {
        try {
          if (onConfirm) await onConfirm();
        } catch (error) {
          console.error(error);
          showAlert('Action failed. Please try again.', 'danger');
        } finally {
          setConfirmModal((prev) => ({ ...prev, isOpen: false }));
        }
      },
    });
  };

  const getTabPayload = (tabId) => {
    const tabConfig = SCHEME_TABS_CONFIG.find((tab) => tab.id === tabId);
    if (!tabConfig || !formData[tabId]) return { ...formData[tabId] };

    const normalizeSubmitValue = (value, field) => {
      if (value === undefined || value === null) return null;
      if (typeof value !== 'string') return value;

      const trimmed = value.trim();
      if (!trimmed && ['number', 'select', 'date'].includes(field.type)) return null;
      if (field.type === 'number') return Number(trimmed);

      return value;
    };

    return tabConfig.fields.reduce((payload, field) => {
      if (Object.prototype.hasOwnProperty.call(formData[tabId], field.key)) {
        payload[field.key] = normalizeSubmitValue(formData[tabId][field.key], field);
      }
      return payload;
    }, {});
  };

  const saveCurrentScheme = async () => {
    const schemeId = String(loadedRecordId || formData.SchemeMaster?.SchemeID || '').trim();
    if (!schemeId) {
      showAlert('Please select a scheme before submitting.', 'warning');
      return false;
    }

    const schemeTabApiMap = {
      SchemeMaster: { update: updateSchemeMaster },
      SchemeObjectives: { insert: setSchemeObjectives, update: updateSchemeObjectives },
      SchemeClassification: { insert: setSchemeClassification, update: updateSchemeClassification },
      SchemeBeneficiaries: { insert: setSchemeBeneficiaries, update: updateSchemeBeneficiaries },
      SchemeEligibility: { insert: setSchemeEligibility, update: updateSchemeEligibility },
      SchemeFinancials: { insert: setSchemeFinancials, update: updateSchemeFinancials },
      SchemeImplementation: { insert: setSchemeImplementation, update: updateSchemeImplementation },
      SchemeGeography: { insert: setSchemeGeography, update: updateSchemeGeography },
      SchemeTimeline: { insert: setSchemeTimeline, update: updateSchemeTimeline },
      SchemeBenefits: { insert: setSchemeBenefits, update: updateSchemeBenefits },
      SchemeComplementary: { insert: setSchemeComplementary, update: updateSchemeComplementary },
      SchemeConvergence: { insert: setSchemeConvergence, update: updateSchemeConvergence },
      SchemeOutcomes: { insert: setSchemeOutcomes, update: updateSchemeOutcomes },
      SchemeSimilar: { insert: setSchemeSimilar, update: updateSchemeSimilar },
      SchemeSDG: { insert: setSchemeSDG, update: updateSchemeSDG },
      SchemeStakeholders: { insert: setSchemeStakeholders, update: updateSchemeStakeholders },
      SchemeRisks: { insert: setSchemeRisks, update: updateSchemeRisks },
      SchemeMission: { insert: setSchemeMission, update: updateSchemeMission },
      SchemeRelationships: { insert: setSchemeRelationships, update: updateSchemeRelationships },
      SchemeDuplicate: { insert: setSchemeDuplicate, update: updateSchemeDuplicate },
      SchemeState: { insert: setSchemeState, update: updateSchemeState },
      SchemeDistrict: { insert: setSchemeDistrict, update: updateSchemeDistrict },
    };

    try {
      for (const [tabId, api] of Object.entries(schemeTabApiMap)) {
        if (!selectedTabIds.includes(tabId)) continue;
        const isUpdate = tabId === 'SchemeMaster' || loadedTabHasData[tabId];
        const payload = {
          ...getTabPayload(tabId),
          SchemeID: schemeId,
          ...(tabId === 'SchemeMaster'
            ? { UpdatedBy: user?.id ?? null }
            : isUpdate
            ? { UpdatedBy: user?.id ?? null }
            : { CreatedBy: user?.id ?? null }),
        };

        const action = isUpdate ? api.update : api.insert;
        if (!action) continue;
        
        await action(payload).unwrap();
      }

      setLoadedTabHasData(
        Object.fromEntries(Object.keys(schemeTabApiMap).map((tabId) => [tabId, true])),
      );

      return true;
    } catch (error) {
      console.error('Error saving scheme data:', error);
      showAlert('Failed to save scheme data. Please try again.', 'danger');
      return false;
    }
  };

  // Submit form with input validation
  const handleSubmitScheme = async (e) => {
    if (e && e.preventDefault) e.preventDefault();

    const errors = validateSchemeForm(formData, selectedTabIds);
    setFormErrors(errors);

    const hasErrors = Object.keys(errors).length > 0;
    if (hasErrors) {
      const firstTabWithError = visibleTabs.find(
        (tab) => errors[tab.id] && Object.keys(errors[tab.id]).length > 0,
      );
      if (firstTabWithError) {
        setActiveTabId(firstTabWithError.id);
      }
      showAlert(
        'Form validation failed. Please correct the highlighted errors before submitting.',
        'danger',
      );
      return;
    }

    const schemeName = getSchemeName();

    triggerConfirmation({
      title: 'Register & Authorize Scheme',
      message: `Are you sure you want to register and authorize the scheme "${schemeName}"? This will save it permanently in the official portal directory.`,
      confirmText: 'Submit & Authorize',
      confirmClass: 'btn-success',
      onConfirm: async () => {
        const saved = await saveCurrentScheme();
        if (saved) {
          showAlert(
            `Government Scheme "${schemeName}" has been successfully registered & authorized!`,
            'success',
          );
        }
      },
    });
  };

  return (
    <div className="fade-in pb-5">
      {/* Page Header */}
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-3  mt-2">
        <div>
          <h4 className="mb-1 text-dark-emphasis fw-bold">Government Scheme 360° Portal</h4>
          <span
            className="badge bg-primary-subtle text-primary border border-primary-subtle px-2.5 py-1 mt-1"
            style={{ fontSize: '0.75rem' }}
          >
            Form Progress: {getOverallProgress()}%
          </span>
        </div>
        <div className="d-flex gap-2 flex-wrap">
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
        <div
          className="alert alert-info py-2 px-3 mb-3 d-flex align-items-center gap-2 rounded border-info-subtle bg-info-subtle text-info-emphasis shadow-sm"
          style={{ fontSize: '0.85rem' }}
        >
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
          <div style={{ minWidth: '340px' }}>
            <Dropdown
              options={dropdownOptions}
              value={selectedDropdownValue}
              className='shadow'
              onChange={handleDropdownChange}
              placeholder="Select scheme..."
              searchable={true}
              isLoading={isFetchingOptions}
            />
          </div>

          {/* Quick Dropdown Picker of selected tabs */}
          <div className="d-flex align-items-center gap-2">
            <span className="text-muted d-none d-sm-inline" style={{ fontSize: '0.8rem' }}>
              Jump to:
            </span>
            <Dropdown
              options={visibleTabs.map((tab) => {
                const tabErrCount = formErrors[tab.id] ? Object.keys(formErrors[tab.id]).length : 0;
                return {
                  value: tab.id,
                  label: `${tab.title} (${getTabProgress(tab.id)}% full)${tabErrCount > 0 ? ` ⚠️ (${tabErrCount} err)` : ''}`,
                };
              })}
              className='shadow'
              value={activeTabId}
              onChange={(val) => {
                const targetTab = visibleTabs.find(t => t.id === val || String(SCHEME_TABS_CONFIG.indexOf(t)) === String(val));
                if (targetTab) {
                  setActiveTabId(targetTab.id);
                }
              }}
              searchable={true}
              placeholder="Jump to active tab..."
              style={{ minWidth: '340px' }}
            />
          </div>
        </div>

        <div className="p-3 border-bottom d-flex flex-wrap align-items-center justify-content-between gap-3">
          <div className="w-100 d-flex flex-wrap align-items-center justify-content-between p-3 border-bottom bg-light-subtle gap-2">
            <div className="d-flex align-items-center gap-2">
              <i className="bi bi-ui-checks text-primary fs-5"></i>
              <div>
                <h6 className="mb-0 fw-bold text-dark">Form Tab Selection</h6>
                <small className="text-muted" style={{ fontSize: '0.78rem' }}>
                  Select checkboxes to enable/show tab forms.
                </small>
              </div>
            </div>
            <div className="d-flex align-items-center gap-2">
              <button
                type="button"
                className="btn btn-sm btn-outline-primary py-1 px-2.5"
                style={{ fontSize: '0.78rem' }}
                onClick={handleSelectAllTabs}
              >
                <i className="bi bi-check-all me-1"></i> Select All
              </button>
              <button
                type="button"
                className="btn btn-sm btn-outline-secondary py-1 px-2.5"
                style={{ fontSize: '0.78rem' }}
                onClick={handleSelectBasicInfoOnly}
              >
                <i className="bi bi-eraser me-1"></i> Basic Info Only
              </button>
              <button
                type="button"
                className="btn btn-sm btn-light border py-1 px-2.5"
                style={{ fontSize: '0.78rem' }}
                onClick={() => setShowCheckboxPanel(!showCheckboxPanel)}
              >
                <i className={`bi bi-chevron-${showCheckboxPanel ? 'up' : 'down'}`}></i>
              </button>
            </div>
          </div>

          {showCheckboxPanel && (
            <div className="bg-white">
              <div className="row g-2">
                {SCHEME_TABS_CONFIG.map((tab) => {
                  const isChecked = selectedTabIds.includes(tab.id);
                  const tabErrCount = formErrors[tab.id] ? Object.keys(formErrors[tab.id]).length : 0;
                  return (
                    <div key={tab.id} className="col-12 col-sm-6 col-md-4 col-lg-3">
                      <div
                        className={`form-check p-2 rounded border d-flex align-items-center transition-all ${
                          isChecked
                            ? activeTabId === tab.id
                              ? 'bg-primary-subtle border-primary text-primary fw-medium'
                              : 'bg-light border-primary-subtle text-dark'
                            : 'bg-white border-light-subtle text-muted opacity-75'
                        }`}
                        style={{ cursor: 'pointer', fontSize: '0.82rem' }}
                        onClick={() => toggleTabSelection(tab.id)}
                      >
                        <input
                          className="form-check-input ms-0 me-2 mt-0 cursor-pointer"
                          type="checkbox"
                          id={`chk-${tab.id}`}
                          checked={isChecked}
                          onChange={() => {}}
                        />
                        <label
                          className="form-check-label flex-grow-1 text-truncate mb-0 cursor-pointer"
                          htmlFor={`chk-${tab.id}`}
                          title={tab.title}
                        >
                          <i className={`${tab.icon} me-2`}></i>
                          {tab.title}
                        </label>
                        {tabErrCount > 0 && (
                          <span className="badge bg-danger rounded-pill ms-1" style={{ fontSize: '0.65rem' }}>
                            {tabErrCount}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
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
              const isActive = activeTabId === tab.id;
              const progress = getTabProgress(tab.id);
              const tabErrors = formErrors[tab.id] ? Object.keys(formErrors[tab.id]).length : 0;
              return (
                <li key={tab.id} className="nav-item">
                  <button
                    className={`nav-link text-nowrap d-flex align-items-center gap-1.5 px-3 py-2 border rounded-pill transition-all ${
                      isActive
                        ? tabErrors > 0
                          ? 'bg-danger text-white border-danger fw-medium shadow-sm'
                          : 'bg-primary text-white border-primary fw-medium shadow-sm'
                        : tabErrors > 0
                          ? 'bg-danger-subtle text-danger border-danger-subtle fw-medium'
                          : 'bg-light text-muted hover-bg'
                    }`}
                    style={{ fontSize: '0.8rem' }}
                    onClick={() => setActiveTabId(tab.id)}
                  >
                    <i className={tab.icon}></i>
                    <span className=" mx-2"> {tab.title} </span>
                    {tabErrors > 0 ? (
                      <span
                        className="badge bg-danger text-white rounded-pill d-inline-flex align-items-center gap-1"
                        style={{ fontSize: '0.65rem' }}
                      >
                        <i className="bi bi-exclamation-circle-fill"></i>
                        {tabErrors}
                      </span>
                    ) : (
                      <span
                        className={`badge rounded-pill ${isActive ? 'bg-white text-primary' : 'bg-secondary text-white'}`}
                        style={{ fontSize: '0.65rem' }}
                      >
                        {progress}%
                      </span>
                    )}
                  </button>
                </li>
              );
            })}
            {filteredTabs.length === 0 && (
              <li className="text-muted p-2" style={{ fontSize: '0.8rem' }}>
                No active tabs selected. Please select tabs above.
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
                const errorText = formErrors[activeTabConfig.id]?.[field.key];
                const disabled = field.disabled === true || field.disabled === 'true';
                const isRequired =
                  field.validate === true ||
                  field.validate === 'true' ||
                  field.required === true ||
                  field.required === 'true';

                const handleFieldChange = (val) => {
                  setFormData((prev) => {
                    const updatedTab = {
                      ...prev[activeTabConfig.id],
                      [field.key]: val,
                    };

                    // Live validate on field change
                    const err = validateField(field, val, activeTabConfig.id, updatedTab);
                    setFormErrors((prevErr) => {
                      const currentTabErrs = { ...(prevErr[activeTabConfig.id] || {}) };
                      if (err) {
                        currentTabErrs[field.key] = err;
                      } else {
                        delete currentTabErrs[field.key];
                      }

                      const newErr = { ...prevErr };
                      if (Object.keys(currentTabErrs).length > 0) {
                        newErr[activeTabConfig.id] = currentTabErrs;
                      } else {
                        delete newErr[activeTabConfig.id];
                      }
                      return newErr;
                    });

                    return {
                      ...prev,
                      [activeTabConfig.id]: updatedTab,
                    };
                  });
                };

                // Resolve options array from backend map or static configs
                const keyMap = {
                  MinistryID: 'ministries',
                  SchemeTypeID: 'schemeTypes',
                  SchemeCategoryID: 'schemeTypes',
                  SchemeStatusID: 'schemeStatuses',
                  SectorID: 'sectors',
                  SubSectorID: 'subSectors',
                  GenderID: 'genders',
                  UrbanRuralID: 'urbanRural',
                  FinancialAssistanceTypeID: 'financialAssistanceTypes',
                  DeliveryMechanismID: 'deliveryMechanisms',
                  ReviewFrequencyID: 'reviewFrequencies',
                  BenefitTypeID: 'benefitTypes',
                  BenefitFrequencyID: 'benefitFrequencies',
                  FundSharingPatternID: 'fundSharingPatterns',
                  AgeGroupID: 'ageGroup',
                  BeneficiaryCategoryID: 'beneficiaryCategories',
                  BeneficiaryTypeID: 'beneficiaryTypes',
                  TargetGroupID: 'targetGroups',
                  SocialCategoryID: 'socialCategories',
                  OccupationID: 'occupations',
                  ImplementingAgencyID: 'implementingAgencies',
                  MonitoringAgencyID: 'monitoringAgencies',
                  StateID: 'states',
                  DistrictID: 'districts',
                  DepartmentID: 'departments',
                  ThemeID: 'themes',
                  NationalPriorityID: 'nationalPriorities',
                  GeographicCoverageID: 'geographicCoverages',
                  LocalBodyID: 'localBodies',
                  MissionID: 'missions',
                  SchemePhaseID: 'schemePhases',
                  SDGID: 'sdgs',
                  ServiceModeID: 'serviceModes',
                  StakeholderTypeID: 'stakeholderTypes',
                  InsuranceTypeID: 'insurance',
                  OutcomeIndicatorID: 'outcomeIndicators',
                  IncomeCriteriaTypeID: 'incomeLimit',

                  ParentSchemeID: 'schemes',
                  ComplementarySchemeID: 'schemes',
                  ConvergedSchemeID: 'schemes',
                  SimilarSchemeID: 'schemes',
                  ReplacedSchemeID: 'schemes',
                  DuplicateSchemeID: 'schemes',
                };

                const backendKey = keyMap[field.key] || field.key;
                const backendOpts =
                  backendOptionsMap[backendKey] ||
                  backendOptionsMap[field.key] ||
                  backendOptionsMap[field.key + 's'];

                const apiOpts = (Array.isArray(backendOpts) ? backendOpts : [])
                  .map((item) => getOptionObj(item))
                  .filter(Boolean);

                const staticOpts = (Array.isArray(field.options) ? field.options : [])
                  .map((item) => getOptionObj(item))
                  .filter(Boolean);

                // Purely use live API options (or static field options if defined in field schema)
                let rawOptions = apiOpts.length > 0 ? apiOpts : staticOpts;

                // Deduplicate by option value
                const seenValues = new Set();
                let optionsList = [];
                for (const opt of rawOptions) {
                  const valStr = String(opt.value).trim();
                  if (valStr && !seenValues.has(valStr)) {
                    seenValues.add(valStr);
                    optionsList.push(opt);
                  }
                }

                // Ensure the current selected value is always present in optionsList so it displays properly
                if (value !== undefined && value !== null && String(value).trim() !== '') {
                  const valStr = String(value).trim();
                  const exists = optionsList.some(
                    (opt) =>
                      String(opt.value).trim() === valStr || String(opt.label).trim() === valStr,
                  );
                  if (!exists) {
                    optionsList = [{ value: valStr, label: valStr }, ...optionsList];
                  }
                }

                const isSelect = field.type === 'select';

                return (
                  <div key={field.key} className={`col-12 col-md-${field.col || 6}`}>
                    <label
                      className="form-label text-dark-emphasis fw-medium mb-1 d-flex align-items-center justify-content-between"
                      style={{ fontSize: '0.8rem' }}
                    >
                      <span>
                        {field.label}
                        {isRequired && <span className="text-danger ms-1 fw-bold">*</span>}
                      </span>
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
                        isInvalid={!!errorText}
                        disabled={disabled}
                        style={{ minWidth: '100%' }}
                      />
                    ) : /* TEXTAREAS */
                    field.type === 'textarea' ? (
                      <textarea
                        name={field.key}
                        className={`form-control py-2 ${errorText ? 'is-invalid border-danger' : ''}`}
                        rows={3}
                        style={{ fontSize: '0.85rem' }}
                        placeholder={field.placeholder}
                        value={value}
                        disabled={disabled}
                        onChange={(e) => handleFieldChange(e.target.value)}
                      />
                    ) : (
                      /* GENERAL INPUTS */
                      <input
                        name={field.key}
                        type={field.type}
                        className={`form-control py-2 ${errorText ? 'is-invalid border-danger' : ''}`}
                        style={{ height: '40px', fontSize: '0.85rem' }}
                        placeholder={field.placeholder}
                        value={value}
                        disabled={disabled}
                        onChange={(e) => handleFieldChange(e.target.value)}
                      />
                    )}

                    {errorText && (
                      <div
                        className="invalid-feedback d-block text-danger mt-1"
                        style={{ fontSize: '0.78rem' }}
                      >
                        <i className="bi bi-exclamation-circle me-1"></i>
                        {errorText}
                      </div>
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
                  className="btn btn-outline-secondary shadow btn-sm px-3 d-flex align-items-center gap-1"
                  onClick={handlePrevTab}
                  disabled={currentVisibleIndex <= 0}
                >
                  <i className="bi bi-arrow-left"></i>
                  <span>Previous Tab</span>
                </button>

                <button
                  type="button"
                  className="btn btn-outline-secondary shadow btn-sm px-3 d-flex align-items-center gap-1"
                  onClick={handleNextTab}
                  disabled={currentVisibleIndex >= visibleTabs.length - 1}
                >
                  <span>Next Tab</span>
                  <i className="bi bi-arrow-right"></i>
                </button>
              </div>

              {/* Actions & Exporters */}
              <div className="d-flex gap-2 flex-wrap">
                <button
                  type="button"
                  className="btn btn-outline-danger btn-sm px-3 d-flex align-items-center gap-1.5 shadow rounded "
                  onClick={handleExportPDFReport}
                >
                  <i className="bi bi-filetype-pdf me-1"></i>
                  <span>Export Full PDF</span>
                </button>
                <button
                  type="submit"
                  className="btn btn-success btn-sm px-4 fw-medium shadow d-flex align-items-center gap-1.5 border rounded"
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
