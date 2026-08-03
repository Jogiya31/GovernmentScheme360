import React, { useState, useEffect, useRef } from 'react';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { SCHEME_TABS_CONFIG, getInitialSchemeState } from '../data/schemeFields';

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
  useGetDocumentRequiredMutation,
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
  useSetSchemeBeneficiariesMutation,
  useSetSchemeBenefitsMutation,
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
  const [getDocumentsRequired, { data: documentsRequiredRes }] = useGetDocumentRequiredMutation();
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
  const [SetSchemeBeneficiaries] = useSetSchemeBeneficiariesMutation();
  const [SetSchemeBenefits] = useSetSchemeBenefitsMutation();

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
      { key: 'documentsRequired', fn: getDocumentsRequired },
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
    documentsRequired: apiOptionsMap.documentsRequired || extractDataArray(documentsRequiredRes),
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
    monitoringFrequency:
      apiOptionsMap.monitoringAgencies || extractDataArray(monitoringAgenciesRes),
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
  const [currentTab, setCurrentTab] = useState(0);

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
          if (formData) {
            await Promise.all([
              SetSchemeBeneficiaries({ 
                SchemeID: formData.SchemeMaster.schemeId,
                BeneficiaryCategoryID: formData.SchemeBeneficiaries.category,
                TargetGroupID: formData.SchemeBeneficiaries.targetGroup,
                GenderID: formData.SchemeBeneficiaries.gender,
                AgeGroupID: formData.SchemeBeneficiaries.ageGroup,
                IncomeCriteriaTypeID: formData.SchemeBeneficiaries.incomeCriteria,
                IncomeLimit: formData.SchemeBeneficiaries.incomeLimit,
                SocialCategoryID: formData.SchemeBeneficiaries.socialCategory,
                OccupationID: formData.SchemeBeneficiaries.occupation,
                GeographicCoverageID: formData.SchemeBeneficiaries.geographicCoverage,
                UrbanRuralID: formData.SchemeBeneficiaries.urbanRural,
                EstimatedBeneficiaries: formData.SchemeBeneficiaries.estimatedBeneficiaries,
                BeneficiaryTypeID: formData.SchemeBeneficiaries.beneficiaryTypes,
              }).unwrap(),

              SetSchemeBenefits({
                SchemeID: formData.SchemeMaster.schemeId,
                BenefitTypeID: formData.SchemeBenefits.benefitType,
                MonetaryBenefit: formData.SchemeBenefits.monetaryBenefit,
                NonMonetaryBenefit: formData.SchemeBenefits.nonMonetaryBenefit,
                SubsidyAmount: formData.SchemeBenefits.subsidyAmount,
                MaximumAssistance: formData.SchemeBenefits.maxAssistance,
                BenefitFrequencyID: formData.SchemeBenefits.frequency,
                DirectBenefit: formData.SchemeBenefits.directBenefit,
                IndirectBenefit: formData.SchemeBenefits.indirectBenefit,
              }).unwrap(),
            ]);

            // Both APIs completed successfully
            showAlert('Scheme saved successfully.', 'success');
            setFormData(getInitialSchemeState());
          }

          onConfirm();
        } catch (error) {
          console.error(error);
          showAlert('Failed to save scheme.', 'danger');
        } finally {
          setConfirmModal((prev) => ({ ...prev, isOpen: false }));
        }
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
        showAlert(
          `Government Scheme "${schemeName}" has been successfully registered & authorized!`,
          'success',
        );
      },
    });
  };

  const rawSchemesList = Array.isArray(backendOptionsMap.schemes) ? backendOptionsMap.schemes : [];

  const schemeOptions = rawSchemesList
    .map((s) => {
      if (!s) return null;
      if (typeof s === 'string' || typeof s === 'number') {
        return { value: String(s), label: String(s) };
      }
      const val = s.SchemeID ?? s.schemeID ?? s.schemeId ?? s.id ?? s.ID ?? getOptionName(s);
      const lbl = s.SchemeName ?? s.schemeName ?? s.name ?? s.title ?? s.label ?? getOptionName(s);
      if (!val && !lbl) return null;
      return {
        value: String(val || lbl),
        label: String(lbl || val),
      };
    })
    .filter(Boolean);

  const dropdownOptions = schemeOptions;

  const selectedDropdownValue = loadedRecordId ? String(loadedRecordId) : '';

  const handleDropdownChange = (val) => {
    if (!val) {
      setFormData(getInitialSchemeState());
      setLoadedRecordId(null);
      setCurrentTab(0);
      return;
    }

    const foundScheme = rawSchemesList.find((s) => {
      if (!s) return false;
      if (typeof s === 'string' || typeof s === 'number') return String(s) === String(val);
      const sVal = s.SchemeID ?? s.schemeID ?? s.schemeId ?? s.id ?? s.ID ?? getOptionName(s);
      return String(sVal) === String(val);
    });

    if (foundScheme) {
      const newForm = getInitialSchemeState();
      if (typeof foundScheme === 'object') {
        Object.keys(foundScheme).forEach((key) => {
          if (newForm[key] && typeof foundScheme[key] === 'object') {
            newForm[key] = { ...newForm[key], ...foundScheme[key] };
          }
        });

        const schemeName =
          foundScheme.SchemeName ||
          foundScheme.schemeName ||
          foundScheme.name ||
          foundScheme.title ||
          getOptionName(foundScheme);
        const schemeId =
          foundScheme.SchemeID ||
          foundScheme.schemeID ||
          foundScheme.schemeId ||
          foundScheme.id ||
          val;

        if (newForm.SchemeMaster) {
          if (schemeName) newForm.SchemeMaster.schemeName = schemeName;
          if (schemeId) newForm.SchemeMaster.schemeId = String(schemeId);
        }
        if (newForm.basicInfo) {
          if (schemeName) newForm.basicInfo.schemeName = schemeName;
          if (schemeId) newForm.basicInfo.schemeId = String(schemeId);
        }

        setFormData(newForm);
        setLoadedRecordId(String(schemeId));
        setCurrentTab(0);
        showAlert(`Loaded scheme "${schemeName || 'Record'}" from API!`, 'info');
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
              style={{ minWidth: '240px' }}
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
