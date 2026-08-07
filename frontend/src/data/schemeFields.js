// Scheme Fields Specification for Government Scheme 360° Portal
// Organizes the form structure across 23 tabs
const financialYearOptions = [''];

const currentYear = new Date().getFullYear();

for (let year = 2004; year <= currentYear; year++) {
  financialYearOptions.push(`${year}-${year + 1}`);
}

export const DEFAULT_FALLBACK_OPTIONS = {};

export const SCHEME_TABS_CONFIG = [
  {
    id: 'SchemeMaster',
    title: '1. Basic Info',
    icon: 'bi-info-circle-fill',
    fields: [
      { key: 'SchemeName', label: 'Official Scheme Name', type: 'text', placeholder: 'Full official name of the scheme', col: 4 },
      { key: 'AlternateName', label: 'Alternate Name / Acronym', type: 'text', placeholder: 'e.g. PMAY-U / PMAY-G', col: 4 },
      { key: 'MinistryID', label: 'Nodal Ministry', type: 'select', options: [], col: 4 },
      { key: 'DepartmentID', label: 'Implementing Department', type: 'select', options: [], col: 4 },
      { key: 'SchemeTypeID', label: 'Scheme Type', type: 'select', options: [], col: 4 },
      { key: 'LaunchDate', label: 'Launch Date', type: 'date', col: 4 },
      { key: 'FinancialYearStarted', label: 'Financial Year Started',  type: 'select', options: financialYearOptions, col: 4 },
      { key: 'SchemeStatusID', label: 'Current Status', type: 'select', options: [], col: 4 },
      { key: 'Website', label: 'Official Website / Portal', type: 'text', placeholder: 'https://...', col: 4 },
      { key: 'GazetteNotificationReference', label: 'Gazette / Notification Reference', type: 'text', placeholder: 'e.g. Notification No. 10/2026', col: 4 },
    ]
  },
  {
    id: 'SchemeObjectives',
    title: '2. Scheme Objectives',
    icon: 'bi-bullseye',
    fields: [
      { key: 'Vision', label: 'Vision Statement', type: 'textarea', placeholder: 'Broad long-term vision...', col: 6 },
      { key: 'Mission', label: 'Mission Statement', type: 'textarea', placeholder: 'Core mission boundaries...', col: 6 },
      { key: 'PrimaryObjective', label: 'Primary Objective', type: 'textarea', placeholder: 'What this scheme seeks to achieve primarily...', col: 6 },
      { key: 'SecondaryObjectives', label: 'Secondary Objectives', type: 'textarea', placeholder: 'Additional secondary objectives...', col: 6 },
      { key: 'ProblemStatement', label: 'Problem Statement', type: 'textarea', placeholder: 'Details of the specific problem this scheme addresses...', col: 6 },
      { key: 'NeedAssessment', label: 'Need Assessment', type: 'textarea', placeholder: 'Details of findings justifying the launch...', col: 6 },
      { key: 'ExpectedOutcomes', label: 'Expected Outcomes', type: 'textarea', placeholder: 'Key measurable impacts targeted...', col: 6 }
    ]
  },
  {
    id: 'SchemeClassification',
    title: '3. Scheme Classification',
    icon: 'bi-bookmark-star-fill',
    fields: [
      { key: 'SectorID', label: 'Primary Sector', type: 'select', options: [], col: 4 },
      { key: 'SubSectorID', label: 'Sub-Sector', type: 'select', options: [], col: 4 },
      { key: 'ThemeID', label: 'Theme', type: 'select', options: [], col: 4  },
      { key: 'NationalPriorityID', label: 'National Priority', type: 'select', options: [], col: 4 },
      { key: 'AspirationalDistrictScheme', label: 'Aspirational District Scheme', type: 'select', options: ['','Yes','No'], col: 4 },
      { key: 'FlagshipScheme', label: 'Flagship Scheme',  type: 'select', options: ['','Yes','No'], col: 4 },
      { key: 'SchemeCategoryID', label: 'Scheme Category', type: 'select', options: [], col: 4 }
    ]
  },
  {
    id: 'SchemeBeneficiaries',
    title: '4. Beneficiary Details',
    icon: 'bi-people-fill',
    fields: [
      { key: 'BeneficiaryCategoryID', label: 'Beneficiary Category',  type: 'select', options: [], col: 4 },
      { key: 'TargetGroupID', label: 'Primary Target Group',  type: 'select', options: [], col: 4 },
      { key: 'GenderID', label: 'Gender focus', type: 'select', options: [], col: 4 },
      { key: 'AgeGroupID', label: 'Target Age Group', type: 'select', options: [], col: 4 },
      { key: 'IncomeCriteriaTypeID', label: 'Income Criteria', type: 'select', options: [], col: 4 },
      { key: 'IncomeLimit', label: 'Income Limits', type: 'number', placeholder:'Enter here...', col: 4 },
      { key: 'SocialCategoryID', label: 'Social Category Emphasis', type: 'select', options: [], col: 4 },
      { key: 'OccupationID', label: 'Target Occupation', type: 'select', options: [], col: 4 },
      { key: 'GeographicCoverageID', label: 'Beneficiary Geographic Area', type: 'select', options: [], col: 4 },
      { key: 'UrbanRuralID', label: 'Urban / Rural Segment', type: 'select', options: [], col: 4 },
      { key: 'BeneficiaryTypeID', label: 'Benificary Type', type: 'select', options: [], col: 4 },
      { key: 'EstimatedBeneficiaries', label: 'Estimated Beneficiaries', type: 'number', placeholder: 'e.g. 5000000', col: 4 }
    ]
  },
  {
    id: 'SchemeEligibility',
    title: '5. Eligibility Rules',
    icon: 'bi-shield-check',
    fields: [
      { key: 'EligibilityCriteria', label: 'Eligibility Criteria Checklist', type: 'textarea', placeholder: 'Provide list of clear eligibility rules...', col: 6 },
      { key: 'IncomeCriteriaTypeID', label: 'Documents Required for Registration', type: 'select', options: [], col: 6 },
      { key: 'IncomeLimit', label: 'Explicit Annual Income Limit',  type: 'number',placeholder: 'e.g. 5000000', col: 4 },
      { key: 'AgeGroupID', label: 'Explicit Age Limit Limits', type: 'select', options: [],  col: 4 },
      { key: 'AadhaarRequired', label: 'Aadhaar Required', type: 'select', options: ['','Yes','No'], col: 4 },
      { key: 'BankAccountRequired', label: 'Is Bank Account Compulsory?', type: 'select', options: ['','Yes','No'], col: 4 },
      { key: 'OtherConditions', label: 'Other Regulatory Conditions', type: 'textarea', placeholder: 'e.g. Must not own a concrete house or a 4-wheeler...', col: 8 }
    ]
  },
  {
    id: 'SchemeFinancials',
    title: '6. Financial Details',
    icon: 'bi-cash-coin',
    fields: [
      { key: 'TotalBudget', label: 'Total Allocated Budget (Cr.)', type: 'number', placeholder: 'Total budget in Crores', col: 4 },
      { key: 'AnnualBudget', label: 'Current Annual Budget (Cr.)', type: 'number', placeholder: 'Annual budget in Crores', col: 4 },
      { key: 'Allocation', label: 'Budget Allocation (Current FY - Cr.)', type: 'number', placeholder: 'Allocation in Crores', col: 4 },
      { key: 'Expenditure', label: 'Cumulative Expenditure (Cr.)', type: 'number', placeholder: 'Expenditure in Crores', col: 4 },
      { key: 'FundSharingPatternID', label: 'Fund Sharing Pattern (Central:State)', type: 'select', options: [],  col: 4 },
      { key: 'CentralShare', label: 'Central Government Share (Cr.)', type: 'number', placeholder: 'Central share', col: 4 },
      { key: 'StateShare', label: 'State Government Share (Cr.)', type: 'number', placeholder: 'State share', col: 4 },
      { key: 'BeneficiaryContribution', label: 'Beneficiary Contribution (if any)', type: 'number', placeholder: 'e.g. ₹ 20,000', col: 4 },
      { key: 'FinancialAssistanceTypeID', label: 'Type of Financial Assistance', type: 'select', options: [], col: 4 },
      { key: 'Subsidy', label: 'Subsidy', type: 'number', placeholder: 'Enter here...', col: 4 },
      { key: 'GrantAmount', label: 'Grant Amount', type: 'number', placeholder: 'Enter here...', col: 4 },
      { key: 'LoanAmount', label: 'Loan Amount', type: 'number', placeholder: 'Enter here...', col: 4 },
      { key: 'InsuranceTypeID', label: 'Insurance', type: 'select', options: [], col: 4 },
      { key: 'DBTEnabled', label: 'Direct Benefit Transfer (DBT) Enabled?',  type: 'select', options: ['','Yes', 'No'], col: 4 }
    ]
  },
  {
    id: 'SchemeImplementation',
    title: '7. Implementation Model',
    icon: 'bi-diagram-3-fill',
    fields: [
      { key: 'ImplementingAgencyID', label: 'Implementing Agency', type: 'select', options: [], col: 6 },
      { key: 'StateAgencies', label: 'State-level Implementing Agencies', type: 'text', placeholder: 'e.g. State Housing Boards', col: 6 },
      { key: 'DistrictAgencies', label: 'District-level Nodal Agencies', type: 'text', placeholder: 'e.g. DRDA / District Collectorate', col: 6 },
      { key: 'LocalBodyID', label: 'Involved Local Bodies', type: 'select', options: [],col: 6 },
      { key: 'DeliveryMechanismID', label: 'Delivery Mechanism Channel', type: 'select', options: [], col: 4 },
      { key: 'ServiceModeID', label: 'Service Mode', type: 'select', options: [], col: 4 },
      { key: 'MobileApp', label: 'Official Mobile App Name', type: 'text', placeholder: 'e.g. AwasApp', col: 4 },
      { key: 'PortalName', label: 'Central Portal Domain Name', type: 'text', placeholder: 'e.g. pmaymis.gov.in', col: 4 },
      { key: 'MonitoringAgencyID', label: 'Independent Monitoring Authority', type: 'select', options: [], col: 4 }
    ]
  },
  {
    id: 'SchemeGeography',
    title: '8. Geographic Coverage',
    icon: 'bi-geo-alt-fill',
    fields: [
      { key: 'NationalWise', label: 'Is Nationally Applicable?', type: 'select', options: ['','Yes','No'], col: 4 },
      { key: 'NorthEast', label: 'North East',type: 'select', options: ['','Yes','No'], col: 4 }
    ]
  },
  {
    id: 'SchemeTimeline',
    title: '9. Scheme Timeline',
    icon: 'bi-calendar-range',
    fields: [
      { key: 'AnnouncementDate', label: 'Announcement Date', type: 'date', col: 4 },
      { key: 'LaunchDate', label: 'Launch Date', type: 'date', col: 4 },
      { key: 'FirstDisbursement', label: 'First Disbursement',type: 'date', col: 4 },
      { key: 'SchemePhaseID', label: 'Scheme Phase', type: 'select', options: [], col: 4 },
      { key: 'EndDate', label: 'End Date', type: 'date', col: 4 },
      { key: 'ReviewFrequencyID', label: 'Review Frequency', type: 'select', options: [], col: 4 }
    ]
  },
  {
    id: 'SchemeBenefits',
    title: '10. Benefit Packages',
    icon: 'bi-gift-fill',
    fields: [
      { key: 'BenefitTypeID', label: 'Main Benefit Category', type: 'select', options: [], col: 4 },
      { key: 'MonetaryBenefit', label: 'Details of Monetary Benefit', type: 'number', placeholder: 'e.g. Direct cash subsidy of ₹ 1.2 Lakhs', col: 4 },
      { key: 'NonMonetaryBenefit', label: 'Details of Non-Monetary Benefit', type: 'text', placeholder: 'e.g. Free electricity connections, toilets', col: 4 },
      { key: 'SubsidyAmount', label: 'Explicit Subsidy Amount (₹)', type: 'number', placeholder: 'e.g. 120000', col: 4 },
      { key: 'MaximumAssistance', label: 'Maximum Assistance per Beneficiary (₹)', type: 'number', placeholder: 'e.g. 150000', col: 4 },
      { key: 'BenefitFrequencyID', label: 'Benefit Frequency', type: 'select', options: [], col: 4 },
      { key: 'DirectBenefit', label: 'Direct Benefit', type: 'text', placeholder:'Enter here...', col: 4 },
      { key: 'IndirectBenefit', label: 'Indirect Benefit', type: 'text', placeholder:'Enter here...', col: 4 }
    ]
  },
  {
    id: 'SchemeComplementary',
    title: '11. Scheme Complementary',
    icon: 'bi-file-earmark-text-fill',
    fields: [
      { key: 'ComplementarySchemeID', label: 'Complementary Scheme', type: 'select', options: [], col: 4 },
      ]
  },
  {
    id: 'SchemeConvergence',
    title: '12. Scheme Convergence',
    icon: 'bi-bar-chart-line-fill',
    fields: [
      { key: 'ConvergedSchemeID', label: 'Converged Scheme', type: 'select', options: [], col: 4 },
     ]
  },
  {
    id: 'SchemeOutcomes',
    title: '13. Outcome Indicators',
    icon: 'bi-clipboard-data-fill',
    fields: [
      { key: 'OutcomeIndicatorID', label: 'Outcome Indicator',  type: 'select', options: [], col: 4 },
      { key: 'OutcomeValue', label: 'Outcome Value',  type: 'number', placeholder: 'Enter here...', col: 4 },
      { key: 'Remarks', label: 'Remarks',  type: 'text', placeholder: 'Enter here...', col: 4 },
    ]
  },
  {
    id: 'SchemeSimilar',
    title: '14. Similar Schemes',
    icon: 'bi-eye-fill',
    fields: [
      { key: 'SimilarSchemeID', label: 'Similar Schemes', type: 'select', options: [], col: 4 },
    ]
  },
  {
    id: 'SchemeSDG',
    title: '15. Scheme SDG',
    icon: 'bi-cpu-fill',
    fields: [
       { key: 'SDGID', label: 'SDG', type: 'select', options: [], col: 4 },
    ]
  },
  {
    id: 'SchemeStakeholders',
    title: '16. Stakeholders',
    icon: 'bi-diagram-3',
    fields: [
      { key: 'StakeholderTypeID', label: 'Stakeholder Type', type: 'select', options: [], col: 4 },
      { key: 'StakeholderName', label: 'Stakeholder Name', type: 'text', placeholder: 'Enter here...', col: 4 },
      { key: 'Remarks', label: 'Remarks', type: 'text', placeholder: 'Enter here...', col: 4 },
     ]
  },
  {
    id: 'SchemeRisks',
    title: '17. Risks & Challenges',
    icon: 'bi-exclamation-octagon-fill',
    fields: [
      { key: 'Challenges', label: 'Challenges', type: 'text', placeholder: 'Enter here...', col: 6 },
      { key: 'Risks', label: 'Risks', type: 'text', placeholder: 'Enter here...', col: 6 },
      { key: 'Bottlenecks', label: 'Bottlenecks', type: 'text', placeholder: 'Enter here...', col: 6 },
      { key: 'FraudRisks', label: 'Fraud Risks', type: 'text', placeholder: 'Enter here...', col: 6 },
      { key: 'MitigationMeasures', label: 'Mitigation Measures',type: 'text', placeholder: 'Enter here...', col: 12 }
    ]
  },
  {
    id: 'SchemeMission',
    title: '18. Scheme Mission',
    icon: 'bi-trophy-fill',
    fields: [
      { key: 'MissionID', label: 'Mission', type: 'select', options: [], col: 6 },
     ]
  },
  {
    id: 'SchemeRelationships',
    title: '19. Scheme Relationships',
    icon: 'bi-share-fill',
    fields: [
      { key: 'ParentSchemeID', label: 'Parent Scheme', type: 'select', options: [], col: 6 },
      { key: 'ReplacedSchemeID', label: 'Replaced Scheme', type: 'select', options: [], col: 6 },
     ]
  },
  {
    id: 'SchemeDuplicate',
    title: '20. Scheme Duplicate',
    icon: 'bi-activity',
    fields: [
      { key: 'DuplicateSchemeID', label: 'Duplicate Scheme',  type: 'select', options: [], col: 4 },
       ]
  },
  {
    id: 'SchemeState',
    title: '21. Scheme State',
    icon: 'bi-stars',
    fields: [
      { key: 'StateID', label: 'State', type: 'select', options: [], col: 6 },
     ]
  },
  {
    id: 'SchemeDistrict',
    title: '22. Scheme District',
    icon: 'bi-shield-lock-fill',
    fields: [
       { key: 'DistrictID', label: 'District', type: 'select', options: [], col: 6 },
      ]
  }
];

// Helper to construct a completely empty initial state for all fields
export const getInitialSchemeState = () => {
  const state = {};
  SCHEME_TABS_CONFIG.forEach((tab) => {
    state[tab.id] = {};
    tab.fields.forEach((field) => {
      // Default initial value
      if (field.type === 'select') {
        state[tab.id][field.key] = field.options[0];
      } else if (field.type === 'number') {
        state[tab.id][field.key] = '';
      } else {
        state[tab.id][field.key] = '';
      }
    });
  });
  return state;
};