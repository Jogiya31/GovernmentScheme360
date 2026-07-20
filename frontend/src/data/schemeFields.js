// Scheme Fields Specification for Government Scheme 360° Portal
// Organizes the form structure across 23 tabs

export const SDG_OPTIONS = [
  { value: 'SDG 1', label: 'SDG 1: No Poverty' },
  { value: 'SDG 2', label: 'SDG 2: Zero Hunger' },
  { value: 'SDG 3', label: 'SDG 3: Good Health and Well-being' },
  { value: 'SDG 4', label: 'SDG 4: Quality Education' },
  { value: 'SDG 5', label: 'SDG 5: Gender Equality' },
  { value: 'SDG 6', label: 'SDG 6: Clean Water and Sanitation' },
  { value: 'SDG 7', label: 'SDG 7: Affordable and Clean Energy' },
  { value: 'SDG 8', label: 'SDG 8: Decent Work and Economic Growth' },
  { value: 'SDG 9', label: 'SDG 9: Industry, Innovation and Infrastructure' },
  { value: 'SDG 10', label: 'SDG 10: Reduced Inequalities' },
  { value: 'SDG 11', label: 'SDG 11: Sustainable Cities and Communities' },
  { value: 'SDG 12', label: 'SDG 12: Responsible Consumption and Production' },
  { value: 'SDG 13', label: 'SDG 13: Climate Action' },
  { value: 'SDG 14', label: 'SDG 14: Life Below Water' },
  { value: 'SDG 15', label: 'SDG 15: Life on Land' },
  { value: 'SDG 16', label: 'SDG 16: Peace, Justice and Strong Institutions' },
  { value: 'SDG 17', label: 'SDG 17: Partnerships for the Goals' }
];

export const SCHEME_TABS_CONFIG = [
  {
    id: 'basicInfo',
    title: '1. Basic Info',
    icon: 'bi-info-circle-fill',
    fields: [
      { key: 'schemeId', label: 'Scheme ID', type: 'text', placeholder: 'Unique Identifier, e.g. SCH-PMAY-2026', col: 4 },
      { key: 'schemeName', label: 'Official Scheme Name', type: 'text', placeholder: 'Full official name of the scheme', col: 8 },
      { key: 'alternateName', label: 'Alternate Name / Acronym', type: 'text', placeholder: 'e.g. PMAY-U / PMAY-G', col: 4 },
      { key: 'ministry', label: 'Nodal Ministry', type: 'select', options: [
        'Ministry of Agriculture & Farmers Welfare',
        'Ministry of Health & Family Welfare',
        'Ministry of Education',
        'Ministry of Rural Development',
        'Ministry of Housing & Urban Affairs',
        'Ministry of Finance',
        'Ministry of Skill Development & Entrepreneurship',
        'Ministry of Electronics & Information Technology',
        'Ministry of Women & Child Development',
        'Ministry of Jal Shakti',
        'Ministry of Power',
        'Ministry of New & Renewable Energy'
      ], col: 4 },
      { key: 'department', label: 'Implementing Department', type: 'text', placeholder: 'e.g. Department of Land Resources', col: 4 },
      { key: 'schemeType', label: 'Scheme Type', type: 'select', options: ['Central Sector Scheme', 'Centrally Sponsored Scheme (CSS)', 'State Sponsored Scheme'], col: 4 },
      { key: 'launchDate', label: 'Launch Date', type: 'date', col: 4 },
      { key: 'fyStarted', label: 'Financial Year Started', type: 'text', placeholder: 'e.g. FY 2024-25', col: 4 },
      { key: 'status', label: 'Current Status', type: 'select', options: ['Active', 'Closed', 'Merged', 'Suspended'], col: 4 },
      { key: 'website', label: 'Official Website / Portal', type: 'text', placeholder: 'https://...', col: 4 },
      { key: 'notification', label: 'Gazette / Notification Reference', type: 'text', placeholder: 'e.g. Notification No. 10/2026', col: 4 },
      { key: 'logoUrl', label: 'Scheme Logo Image URL', type: 'text', placeholder: 'https://images.unsplash.com/... or upload link', col: 12 }
    ]
  },
  {
    id: 'objective',
    title: '2. Scheme Objectives',
    icon: 'bi-bullseye',
    fields: [
      { key: 'vision', label: 'Vision Statement', type: 'textarea', placeholder: 'Broad long-term vision...', col: 12 },
      { key: 'mission', label: 'Mission Statement', type: 'textarea', placeholder: 'Core mission boundaries...', col: 12 },
      { key: 'primaryObj', label: 'Primary Objective', type: 'textarea', placeholder: 'What this scheme seeks to achieve primarily...', col: 12 },
      { key: 'secondaryObj', label: 'Secondary Objectives', type: 'textarea', placeholder: 'Additional secondary objectives...', col: 12 },
      { key: 'problemStatement', label: 'Problem Statement', type: 'textarea', placeholder: 'Details of the specific problem this scheme addresses...', col: 6 },
      { key: 'needAssessment', label: 'Need Assessment', type: 'textarea', placeholder: 'Details of findings justifying the launch...', col: 6 },
      { key: 'expectedOutcomes', label: 'Expected Outcomes', type: 'textarea', placeholder: 'Key measurable impacts targeted...', col: 12 }
    ]
  },
  {
    id: 'classification',
    title: '3. Scheme Classification',
    icon: 'bi-bookmark-star-fill',
    fields: [
      { key: 'sector', label: 'Primary Sector', type: 'select', options: [
        'Agriculture', 'Health', 'Education', 'Rural Development', 'Urban Development',
        'Employment', 'MSME', 'Women & Child', 'Skill Development', 'Digital India',
        'Housing', 'Environment', 'Water & Sanitation', 'Energy', 'Other'
      ], col: 4 },
      { key: 'subSector', label: 'Sub-Sector', type: 'text', placeholder: 'e.g. Rainfed Agriculture', col: 4 },
      { key: 'theme', label: 'Substantive Theme', type: 'text', placeholder: 'e.g. Financial Inclusion', col: 4 },
      { key: 'nationalPriority', label: 'National Priority Mapping', type: 'text', placeholder: 'e.g. Atmanirbhar Bharat', col: 4 },
      { key: 'aspirationalDistrictScheme', label: 'Aspirational District Scheme', type: 'select', options: ['No', 'Yes'], col: 4 },
      { key: 'flagshipScheme', label: 'Is Flagship Scheme?', type: 'select', options: ['No', 'Yes'], col: 4 },
      { key: 'categoryTag', label: 'Welfare / Infrastructure Category', type: 'select', options: ['Welfare', 'Infrastructure', 'Digital Enablement', 'Direct Subsidy', 'Credit Linked'], col: 4 }
    ]
  },
  {
    id: 'beneficiaries',
    title: '4. Beneficiary Details',
    icon: 'bi-people-fill',
    fields: [
      { key: 'category', label: 'Beneficiary Category', type: 'text', placeholder: 'e.g. Small & Marginal Farmers', col: 4 },
      { key: 'targetGroup', label: 'Primary Target Group', type: 'text', placeholder: 'e.g. Below Poverty Line (BPL)', col: 4 },
      { key: 'gender', label: 'Gender focus', type: 'select', options: ['All Genders', 'Female Only', 'Male Only', 'Transgender Focus'], col: 4 },
      { key: 'ageGroup', label: 'Target Age Group', type: 'text', placeholder: 'e.g. 18-50 years', col: 4 },
      { key: 'incomeCriteria', label: 'Income Criteria Limits', type: 'text', placeholder: 'e.g. Household income < 3 Lakh per annum', col: 4 },
      { key: 'socialCategory', label: 'Social Category Emphasis', type: 'text', placeholder: 'e.g. SC, ST, Minorities, General', col: 4 },
      { key: 'occupation', label: 'Target Occupation', type: 'text', placeholder: 'e.g. Construction Workers / Artisans', col: 4 },
      { key: 'geographicCoverage', label: 'Beneficiary Geographic Area', type: 'text', placeholder: 'e.g. Drought-prone blocks', col: 4 },
      { key: 'urbanRural', label: 'Urban / Rural Segment', type: 'select', options: ['Both Urban & Rural', 'Rural Only', 'Urban Only'], col: 4 },
      { key: 'individualInstitution', label: 'Entity Type', type: 'select', options: ['Individual', 'Institution / Self-Help Group (SHG)', 'Both'], col: 4 },
      { key: 'estimatedBeneficiaries', label: 'Estimated Total Beneficiaries', type: 'number', placeholder: 'e.g. 5000000', col: 4 }
    ]
  },
  {
    id: 'eligibility',
    title: '5. Eligibility Rules',
    icon: 'bi-shield-check',
    fields: [
      { key: 'eligibilityCriteria', label: 'Eligibility Criteria Checklist', type: 'textarea', placeholder: 'Provide list of clear eligibility rules...', col: 12 },
      { key: 'documentsRequired', label: 'Documents Required for Registration', type: 'textarea', placeholder: 'e.g. Aadhaar, Income Certificate, Bank Passbook, Land ownership proof...', col: 12 },
      { key: 'incomeLimit', label: 'Explicit Annual Income Limit', type: 'text', placeholder: 'e.g. Max ₹ 1,80,000 per year', col: 4 },
      { key: 'ageLimit', label: 'Explicit Age Limit Limits', type: 'text', placeholder: 'e.g. 18 - 40 Years old', col: 4 },
      { key: 'aadhaarRequired', label: 'Is Aadhaar Compulsory?', type: 'select', options: ['Yes', 'No'], col: 4 },
      { key: 'bankAccountRequired', label: 'Is Bank Account Compulsory?', type: 'select', options: ['Yes', 'No'], col: 4 },
      { key: 'otherConditions', label: 'Other Regulatory Conditions', type: 'textarea', placeholder: 'e.g. Must not own a concrete house or a 4-wheeler...', col: 12 }
    ]
  },
  {
    id: 'financials',
    title: '6. Financial Details',
    icon: 'bi-cash-coin',
    fields: [
      { key: 'totalBudget', label: 'Total Allocated Budget (Cr.)', type: 'number', placeholder: 'Total budget in Crores', col: 4 },
      { key: 'annualBudget', label: 'Current Annual Budget (Cr.)', type: 'number', placeholder: 'Annual budget in Crores', col: 4 },
      { key: 'allocation', label: 'Budget Allocation (Current FY - Cr.)', type: 'number', placeholder: 'Allocation in Crores', col: 4 },
      { key: 'expenditure', label: 'Cumulative Expenditure (Cr.)', type: 'number', placeholder: 'Expenditure in Crores', col: 4 },
      { key: 'sharingPattern', label: 'Fund Sharing Pattern (Central:State)', type: 'text', placeholder: 'e.g. 60:40 or 90:10 or 100:0', col: 4 },
      { key: 'centralShare', label: 'Central Government Share (Cr.)', type: 'number', placeholder: 'Central share', col: 4 },
      { key: 'stateShare', label: 'State Government Share (Cr.)', type: 'number', placeholder: 'State share', col: 4 },
      { key: 'beneficiaryContribution', label: 'Beneficiary Contribution (if any)', type: 'number', placeholder: 'e.g. ₹ 20,000', col: 4 },
      { key: 'assistanceType', label: 'Financial Assistance Type', type: 'select', options: ['Subsidy', 'Direct Grant', 'Collateral-free Loan', 'Insurance Scheme', 'Hybrid'], col: 4 },
      { key: 'dbtEnabled', label: 'Direct Benefit Transfer (DBT) Enabled?', type: 'select', options: ['Yes', 'No'], col: 4 }
    ]
  },
  {
    id: 'implementation',
    title: '7. Implementation Model',
    icon: 'bi-diagram-3-fill',
    fields: [
      { key: 'implementingAgency', label: 'Apex National Implementing Agency', type: 'text', placeholder: 'e.g. National Housing Bank / NABARD', col: 6 },
      { key: 'stateAgencies', label: 'State-level Implementing Agencies', type: 'text', placeholder: 'e.g. State Housing Boards', col: 6 },
      { key: 'districtAgencies', label: 'District-level Nodal Agencies', type: 'text', placeholder: 'e.g. DRDA / District Collectorate', col: 6 },
      { key: 'localBodies', label: 'Involved Local Bodies', type: 'text', placeholder: 'e.g. Gram Panchayats / Municipal Corporations', col: 6 },
      { key: 'deliveryMechanism', label: 'Delivery Mechanism Channel', type: 'select', options: ['Online Portal Only', 'Offline Counters Only', 'Hybrid (Online + CSC + Offline)'], col: 4 },
      { key: 'mobileApp', label: 'Official Mobile App Name', type: 'text', placeholder: 'e.g. AwasApp', col: 4 },
      { key: 'portalName', label: 'Central Portal Domain Name', type: 'text', placeholder: 'e.g. pmaymis.gov.in', col: 4 },
      { key: 'monitoringAgency', label: 'Independent Monitoring Authority', type: 'text', placeholder: 'e.g. Third-party Evaluators', col: 12 }
    ]
  },
  {
    id: 'geography',
    title: '8. Geographic Coverage',
    icon: 'bi-geo-alt-fill',
    fields: [
      { key: 'national', label: 'Is Nationally Applicable?', type: 'select', options: ['Yes', 'No'], col: 4 },
      { key: 'stateWise', label: 'State-wise Exceptions / Details', type: 'textarea', placeholder: 'Details of implementation status across specific States...', col: 12 },
      { key: 'districtWise', label: 'District-wise Coverage Strategy', type: 'textarea', placeholder: 'Particular target districts...', col: 12 },
      { key: 'aspirationalDistrictsOnly', label: 'Focuses on Aspirational Districts?', type: 'select', options: ['No', 'Yes'], col: 4 },
      { key: 'tribalArea', label: 'Special Tribal Area Coverage', type: 'select', options: ['No', 'Yes'], col: 4 },
      { key: 'northEast', label: 'Special North East Allocation / Relaxations', type: 'select', options: ['Yes', 'No'], col: 4 },
      { key: 'utCoverage', label: 'UT Coverage status', type: 'text', placeholder: 'Details for Union Territories', col: 12 }
    ]
  },
  {
    id: 'timeline',
    title: '9. Scheme Timeline',
    icon: 'bi-calendar-range',
    fields: [
      { key: 'announcementDate', label: 'Announcement Date', type: 'date', col: 4 },
      { key: 'launchDateTab', label: 'Launch / Operational Date', type: 'date', col: 4 },
      { key: 'firstDisbursement', label: 'First Disbursement Date', type: 'date', col: 4 },
      { key: 'currentPhase', label: 'Current Operational Phase', type: 'text', placeholder: 'e.g. Phase III Extension', col: 4 },
      { key: 'endDate', label: 'End / Review Date', type: 'date', col: 4 },
      { key: 'reviewFrequency', label: 'Scheduled Review Frequency', type: 'select', options: ['Quarterly', 'Half-Yearly', 'Annually', 'Bi-annually'], col: 4 }
    ]
  },
  {
    id: 'benefits',
    title: '10. Benefit Packages',
    icon: 'bi-gift-fill',
    fields: [
      { key: 'benefitType', label: 'Main Benefit Category', type: 'select', options: ['Monetary / Financial Transfer', 'Non-Monetary (Goods/Services)', 'In-kind Subsidy', 'Hybrid Assistance'], col: 4 },
      { key: 'monetaryBenefit', label: 'Details of Monetary Benefit', type: 'text', placeholder: 'e.g. Direct cash subsidy of ₹ 1.2 Lakhs', col: 4 },
      { key: 'nonMonetaryBenefit', label: 'Details of Non-Monetary Benefit', type: 'text', placeholder: 'e.g. Free electricity connections, toilets', col: 4 },
      { key: 'subsidyAmount', label: 'Explicit Subsidy Amount (₹)', type: 'number', placeholder: 'e.g. 120000', col: 4 },
      { key: 'maxAssistance', label: 'Maximum Assistance per Beneficiary (₹)', type: 'number', placeholder: 'e.g. 150000', col: 4 },
      { key: 'frequency', label: 'Disbursement Frequency', type: 'select', options: ['One-time', 'Installment Based', 'Monthly Recurring', 'Annual Recurring'], col: 4 },
      { key: 'directBenefit', label: 'Direct Beneficiary Transfer (DBT)?', type: 'select', options: ['Yes', 'No'], col: 4 },
      { key: 'indirectBenefit', label: 'Indirect Community Benefit?', type: 'select', options: ['No', 'Yes'], col: 4 }
    ]
  },
  {
    id: 'application',
    title: '11. Application Process',
    icon: 'bi-file-earmark-text-fill',
    fields: [
      { key: 'onlineApp', label: 'Is Online Application Available?', type: 'select', options: ['Yes', 'No'], col: 4 },
      { key: 'offlineApp', label: 'Is Offline Application Available?', type: 'select', options: ['Yes', 'No'], col: 4 },
      { key: 'cscAvailable', label: 'Common Service Centre (CSC) Available?', type: 'select', options: ['Yes', 'No'], col: 4 },
      { key: 'applicationUrl', label: 'Direct Registration Portal URL', type: 'text', placeholder: 'https://...', col: 12 },
      { key: 'processingTime', label: 'Average Processing Time / SLA', type: 'text', placeholder: 'e.g. 45 Business Days', col: 4 },
      { key: 'approvalAuthority', label: 'Final Verification / Approving Authority', type: 'text', placeholder: 'e.g. Block Development Officer (BDO)', col: 4 },
      { key: 'appealMechanism', label: 'Grievance Redressal / Appeal Mechanism', type: 'textarea', placeholder: 'Details of online grievance filing & nodal officers...', col: 12 }
    ]
  },
  {
    id: 'kpis',
    title: '12. Performance KPIs',
    icon: 'bi-bar-chart-line-fill',
    fields: [
      { key: 'appsReceived', label: 'Applications Received (Total)', type: 'number', placeholder: '0', col: 4 },
      { key: 'appsApproved', label: 'Applications Approved (Total)', type: 'number', placeholder: '0', col: 4 },
      { key: 'appsRejected', label: 'Applications Rejected (Total)', type: 'number', placeholder: '0', col: 4 },
      { key: 'beneficiariesCovered', label: 'Actual Beneficiaries Covered', type: 'number', placeholder: '0', col: 4 },
      { key: 'womenBeneficiaries', label: 'Women Beneficiaries Enrolled', type: 'number', placeholder: '0', col: 4 },
      { key: 'scStBeneficiaries', label: 'SC/ST Beneficiaries Enrolled', type: 'number', placeholder: '0', col: 4 },
      { key: 'minorityBeneficiaries', label: 'Minority Beneficiaries Enrolled', type: 'number', placeholder: '0', col: 4 },
      { key: 'fundsReleased', label: 'Total Funds Released (Cr.)', type: 'number', placeholder: '0', col: 4 },
      { key: 'fundsUtilized', label: 'Total Funds Utilized (Cr.)', type: 'number', placeholder: '0', col: 4 },
      { key: 'utilizationPercent', label: 'Fund Utilization Percentage (%)', type: 'number', placeholder: '0', col: 4 },
      { key: 'successRate', label: 'Approval Success Rate (%)', type: 'number', placeholder: '0', col: 4 },
      { key: 'pendingCases', label: 'Pending Applications', type: 'number', placeholder: '0', col: 4 },
      { key: 'avgApprovalTime', label: 'Calculated Avg. Approval Days', type: 'text', placeholder: 'e.g. 30 days', col: 4 }
    ]
  },
  {
    id: 'outcomes',
    title: '13. Outcome Indicators',
    icon: 'bi-clipboard-data-fill',
    fields: [
      { key: 'jobsCreated', label: 'Direct/Indirect Jobs Created', type: 'number', placeholder: '0', col: 4 },
      { key: 'housesBuilt', label: 'Concrete Houses Built', type: 'number', placeholder: '0', col: 4 },
      { key: 'farmersBenefitted', label: 'Total Farmers Benefitted', type: 'number', placeholder: '0', col: 4 },
      { key: 'studentsBenefitted', label: 'Total Students Benefitted', type: 'number', placeholder: '0', col: 4 },
      { key: 'roadsConstructed', label: 'Rural Roads Built (kms)', type: 'number', placeholder: '0', col: 4 },
      { key: 'villagesCovered', label: 'Total Villages Covered', type: 'number', placeholder: '0', col: 4 },
      { key: 'enterprisesSupported', label: 'SMEs/Enterprises Supported', type: 'number', placeholder: '0', col: 4 },
      { key: 'carbonReduction', label: 'Carbon Reduction (Metric Tons)', type: 'number', placeholder: '0', col: 4 },
      { key: 'waterSaved', label: 'Water Saved/Harvested (Litres)', type: 'number', placeholder: '0', col: 4 },
      { key: 'productivityIncrease', label: 'Estimated Crop Productivity Boost (%)', type: 'number', placeholder: '0', col: 4 }
    ]
  },
  {
    id: 'monitoring',
    title: '14. Monitoring Frame',
    icon: 'bi-eye-fill',
    fields: [
      { key: 'kpiDefinitions', label: 'Monitoring KPI Definitions', type: 'textarea', placeholder: 'List the defined indicators of success...', col: 12 },
      { key: 'monitoringFrequency', label: 'Audit / Monitoring Frequency', type: 'select', options: ['Monthly', 'Quarterly', 'Semi-Annually', 'Annually'], col: 4 },
      { key: 'thirdPartyEvaluation', label: 'Third-party Evaluation Agency', type: 'text', placeholder: 'e.g. NITIE / IIT Kanpur', col: 4 },
      { key: 'socialAudit', label: 'Is Social Audit Compulsory?', type: 'select', options: ['Yes', 'No'], col: 4 },
      { key: 'auditReports', label: 'Audit Reports & Guidelines References', type: 'textarea', placeholder: 'Upload link or manual reference...', col: 12 },
      { key: 'impactAssessment', label: 'Latest Impact Assessment Findings', type: 'textarea', placeholder: 'Key conclusions from recent evaluations...', col: 12 },
      { key: 'dashboardAvailable', label: 'Public Analytics Dashboard Available?', type: 'select', options: ['Yes', 'No'], col: 4 }
    ]
  },
  {
    id: 'technology',
    title: '15. Technology Stack',
    icon: 'bi-cpu-fill',
    fields: [
      { key: 'portal', label: 'Portal Hosting Details', type: 'text', placeholder: 'e.g. NIC Cloud Server (Meghraj)', col: 4 },
      { key: 'mobileAppTech', label: 'Mobile App Technologies', type: 'text', placeholder: 'e.g. Android Native (Java/Kotlin)', col: 4 },
      { key: 'apiAvailable', label: 'Are Open APIs Available?', type: 'select', options: ['No', 'Yes'], col: 4 },
      { key: 'aadhaarIntegration', label: 'Aadhaar UIDAI eKYC Integrated?', type: 'select', options: ['Yes', 'No'], col: 4 },
      { key: 'digilocker', label: 'DigiLocker Document Pull Integrated?', type: 'select', options: ['Yes', 'No'], col: 4 },
      { key: 'eKyc', label: 'Biometric / OTP e-KYC Enabled?', type: 'select', options: ['Yes', 'No'], col: 4 },
      { key: 'pfms', label: 'PFMS (Public Financial Management System) Integrated?', type: 'select', options: ['Yes', 'No'], col: 4 },
      { key: 'dbtTech', label: 'Direct Benefit Transfer (DBT) Pipeline?', type: 'select', options: ['Yes', 'No'], col: 4 },
      { key: 'gis', label: 'GIS Mapping & Geo-tagging Enabled?', type: 'select', options: ['Yes', 'No'], col: 4 },
      { key: 'aiMlUsed', label: 'AI/ML Technologies (e.g. Fraud detection)?', type: 'select', options: ['No', 'Yes'], col: 4 }
    ]
  },
  {
    id: 'stakeholders',
    title: '16. Stakeholders',
    icon: 'bi-diagram-3',
    fields: [
      { key: 'ministryRoles', label: 'Nodal Ministries & Roles', type: 'text', placeholder: 'e.g. Ministry of Housing & Urban Affairs (Nodal)', col: 6 },
      { key: 'stateGovt', label: 'State Government Counterparts', type: 'text', placeholder: 'e.g. State Housing Departments', col: 6 },
      { key: 'district', label: 'District Administration Nodal Officers', type: 'text', placeholder: 'e.g. District Magistrate (DM) / Collector', col: 6 },
      { key: 'panchayat', label: 'Panchayat / Urban Local Bodies Roles', type: 'text', placeholder: 'e.g. Ward Committees / Gram Sabhas', col: 6 },
      { key: 'ngo', label: 'Registered NGO / Civil Society Partners', type: 'text', placeholder: 'e.g. Community Welfare NGOs', col: 6 },
      { key: 'banks', label: 'Involved Financial Institutions / Banks', type: 'text', placeholder: 'e.g. Public Sector Banks, Post Offices, RRBs', col: 6 },
      { key: 'csc', label: 'Common Service Centres (CSC) Role', type: 'text', placeholder: 'e.g. Primary Offline Facilitators', col: 6 },
      { key: 'privatePartners', label: 'Private Developers / Sector Partners', type: 'text', placeholder: 'e.g. Private Construction Contractors', col: 12 }
    ]
  },
  {
    id: 'documents',
    title: '17. Scheme Documents',
    icon: 'bi-folder-symlink-fill',
    fields: [
      { key: 'guidelines', label: 'Official Operational Guidelines Link', type: 'text', placeholder: 'https://...', col: 6 },
      { key: 'sop', label: 'SOP for Registration & Verification', type: 'text', placeholder: 'https://...', col: 6 },
      { key: 'operationalManual', label: 'Field Staff Training Manual Link', type: 'text', placeholder: 'https://...', col: 6 },
      { key: 'faq', label: 'FAQ Documents Reference Link', type: 'text', placeholder: 'https://...', col: 6 },
      { key: 'forms', label: 'Blank Form Downloads Link', type: 'text', placeholder: 'https://...', col: 6 },
      { key: 'circulars', label: 'Circulars & Instructions Archive', type: 'text', placeholder: 'https://...', col: 6 },
      { key: 'notifications', label: 'Legal Notifications / Gazette Orders', type: 'text', placeholder: 'https://...', col: 12 }
    ]
  },
  {
    id: 'risks',
    title: '18. Risks & Challenges',
    icon: 'bi-exclamation-octagon-fill',
    fields: [
      { key: 'challenges', label: 'Critical Execution Challenges', type: 'textarea', placeholder: 'e.g. Delay in beneficiary identification, land disputes...', col: 12 },
      { key: 'risks', label: 'Financial / Leakage Risks', type: 'textarea', placeholder: 'e.g. Intermediary bribery, duplicate claims...', col: 12 },
      { key: 'bottlenecks', label: 'Administrative Bottlenecks', type: 'textarea', placeholder: 'e.g. Slower state-share budget disbursals...', col: 6 },
      { key: 'fraudRisks', label: 'Document Forgery / Fraud Risks', type: 'textarea', placeholder: 'e.g. fake income certificates...', col: 6 },
      { key: 'mitigationMeasures', label: 'Regulatory Mitigation Measures', type: 'textarea', placeholder: 'e.g. Mandatory geo-tagging, Public Social Audits, PFMS payments...', col: 12 }
    ]
  },
  {
    id: 'success',
    title: '19. Success Stories',
    icon: 'bi-trophy-fill',
    fields: [
      { key: 'caseStudies', label: 'Key Analytical Case Studies', type: 'textarea', placeholder: 'Documented field success records...', col: 12 },
      { key: 'awards', label: 'National / International Awards Won', type: 'textarea', placeholder: 'e.g. Digital India Gold Award 2025...', col: 12 },
      { key: 'testimonials', label: 'Direct Beneficiary Testimonials', type: 'textarea', placeholder: 'Quotes from satisfied citizens...', col: 6 },
      { key: 'bestPractices', label: 'Administrative Best Practices Logged', type: 'textarea', placeholder: 'e.g. Single-window fast approvals in Indore...', col: 6 }
    ]
  },
  {
    id: 'relationships',
    title: '20. Scheme Relationships',
    icon: 'bi-share-fill',
    fields: [
      { key: 'parentScheme', label: 'Parent / Apex Scheme (if any)', type: 'text', placeholder: 'e.g. Housing for All Mission', col: 6 },
      { key: 'similarSchemes', label: 'Similar Regional Schemes', type: 'text', placeholder: 'e.g. State-level Housing Grants', col: 6 },
      { key: 'complementarySchemes', label: 'Complementary Schemes Linkages', type: 'text', placeholder: 'e.g. Swachh Bharat Mission, Saubhagya, Ujjwala', col: 6 },
      { key: 'duplicateSchemes', label: 'Duplicate / Overlapping Schemes To Avoid', type: 'text', placeholder: 'e.g. Old regional housing subsidy programs', col: 6 },
      { key: 'replacedScheme', label: 'Preceding Replaced Scheme Name', type: 'text', placeholder: 'e.g. Indira Awaas Yojana (IAY)', col: 6 },
      { key: 'convergedWith', label: 'Converged Schemes under same umbrella', type: 'text', placeholder: 'e.g. Swajaldhara converged with Jal Jeevan', col: 6 },
      { key: 'linkedSdgId', label: 'Linked Sustainable Development Goal (SDG)', type: 'select', options: SDG_OPTIONS.map(opt => opt.value), col: 6 },
      { key: 'linkedMissions', label: 'Linked National Missions', type: 'text', placeholder: 'e.g. National Urban Livelihoods Mission', col: 6 }
    ]
  },
  {
    id: 'analytics',
    title: '21. Derived Analytics',
    icon: 'bi-activity',
    fields: [
      { key: 'budgetGrowth', label: 'CAGR Budget Growth Rate (%)', type: 'number', placeholder: '12', col: 4 },
      { key: 'beneficiaryGrowth', label: 'Beneficiary Enrolment Growth (%)', type: 'number', placeholder: '15', col: 4 },
      { key: 'fundUtilization', label: 'Budget Utilization Efficiency (%)', type: 'number', placeholder: '94.5', col: 4 },
      { key: 'coveragePercent', label: 'National Target Coverage Rate (%)', type: 'number', placeholder: '82', col: 4 },
      { key: 'genderRatio', label: 'Gender Ratio representation (F:M)', type: 'text', placeholder: 'e.g. 52:48', col: 4 },
      { key: 'ruralUrbanRatio', label: 'Rural vs Urban Disbursal Ratio', type: 'text', placeholder: 'e.g. 70:30', col: 4 },
      { key: 'stateRanking', label: 'Highest Performing State', type: 'text', placeholder: 'e.g. Madhya Pradesh (Rank 1)', col: 4 },
      { key: 'ministryRanking', label: 'Nodal Ministry Efficiency Rank', type: 'text', placeholder: 'e.g. Tier-1 Rank 3', col: 4 },
      { key: 'popularity', label: 'Citizen Search Popularity Index', type: 'number', placeholder: '88', col: 4 },
      { key: 'satisfaction', label: 'Beneficiary Satisfaction Rating (1-5)', type: 'number', placeholder: '4.6', col: 4 },
      { key: 'impact', label: 'Calculated Social Impact Score', type: 'number', placeholder: '92', col: 4 },
      { key: 'costPerBeneficiary', label: 'Average Delivery Cost per Beneficiary (₹)', type: 'number', placeholder: '124000', col: 4 },
      { key: 'roi', label: 'Estimated Social Return on Investment (SROI)', type: 'number', placeholder: '2.4', col: 4 },
      { key: 'efficiency', label: 'Overall Administrative Efficiency Score (%)', type: 'number', placeholder: '89', col: 4 }
    ]
  },
  {
    id: 'aiTags',
    title: '22. AI-Friendly Attributes',
    icon: 'bi-stars',
    fields: [
      { key: 'keywords', label: 'Semantic Search Keywords (Comma separated)', type: 'text', placeholder: 'housing, concrete home, subsidy, rural welfare, dbt', col: 6 },
      { key: 'tags', label: 'Metadata Categorization Tags', type: 'text', placeholder: 'flagship, infrastructure, central-sector, primary-citizens', col: 6 },
      { key: 'summary100', label: 'Executive Summary (Strictly 100 Words)', type: 'textarea', placeholder: 'Write a concise 100-word overview for chatbot references...', col: 12 },
      { key: 'detailedDescription', label: 'Detailed Scheme Description', type: 'textarea', placeholder: 'Long description containing absolute legal facts...', col: 12 },
      { key: 'faqsText', label: 'Chatbot FAQ Dataset JSON / Raw Text', type: 'textarea', placeholder: 'Format: Q: Is bank account required? A: Yes, for Direct Transfer...', col: 12 },
      { key: 'objectivesText', label: 'Summarized Broad Objectives', type: 'textarea', placeholder: 'Consolidated list of primary aims...', col: 6 },
      { key: 'challengesText', label: 'Administrative Pitfalls / Challenges', type: 'textarea', placeholder: 'Historical challenges encountered...', col: 6 },
      { key: 'innovationsText', label: 'Pioneering Technical Innovations Used', type: 'textarea', placeholder: 'e.g. Real-time geo-referenced photograph uploads through app...', col: 12 },
      { key: 'lessonsLearned', label: 'Key Policy Lessons Learned', type: 'textarea', placeholder: 'Policy modifications based on audits...', col: 6 },
      { key: 'futureRoadmap', label: 'Future Operational Roadmap & Milestones', type: 'textarea', placeholder: 'Next extension targets and digital upgrades...', col: 6 }
    ]
  },
  {
    id: 'metadata',
    title: '23. Meta Audit Trail',
    icon: 'bi-shield-lock-fill',
    fields: [
      { key: 'createdBy', label: 'Created / Registered By', type: 'text', placeholder: 'e.g. Officer on Special Duty (OSD)', col: 4 },
      { key: 'createdDate', label: 'Created Date', type: 'date', col: 4 },
      { key: 'lastUpdated', label: 'Last System Update Date', type: 'date', col: 4 },
      { key: 'verifiedBy', label: 'Nodal Verification Authority', type: 'text', placeholder: 'e.g. Joint Secretary, MoHUA', col: 4 },
      { key: 'source', label: 'Official Information Source / PDF Guide Link', type: 'text', placeholder: 'https://mohua.gov.in/guidelines.pdf', col: 4 },
      { key: 'dataConfidence', label: 'Information Confidence Score', type: 'select', options: ['High (Official Gazette Verified)', 'Medium (Self-Reported Government Site)', 'Low (Press Release Draft)'], col: 4 },
      { key: 'version', label: 'Registry Record Version', type: 'text', placeholder: 'e.g. v3.1', col: 4 },
      { key: 'remarks', label: 'Nodal Remarks / Registry Notes', type: 'textarea', placeholder: 'Special system notes on this revision...', col: 12 }
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

// Extremely detailed Demo template data (PM Awas Yojana)
export const PM_AWAS_YOJANA_DEMO = {
  basicInfo: {
    schemeId: 'SCH-PMAY-U-2015',
    schemeName: 'Pradhan Mantri Awas Yojana (Urban)',
    alternateName: 'PMAY-U',
    ministry: 'Ministry of Housing & Urban Affairs',
    department: 'Housing for All Mission Directorate',
    schemeType: 'Centrally Sponsored Scheme (CSS)',
    launchDate: '2015-06-25',
    fyStarted: 'FY 2015-16',
    status: 'Active',
    website: 'https://pmaymis.gov.in',
    notification: 'Gazette Extra Ordinary Part-II Section 3(ii)',
    logoUrl: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=600&q=80'
  },
  objective: {
    vision: 'Ensuring every citizen in urban India has access to a dignified concrete house with basic amenities like toilet, power, and water.',
    mission: 'To construct over 1.2 Crore concrete houses in notified urban regions by the end of extended timeline 2024-2026, facilitating credit linked interest subsidies.',
    primaryObj: 'Provide all-weather pucca houses to all eligible urban households including slum dwellers, EWS, and LIG categories by leveraging multiple financial models.',
    secondaryObj: 'Empower women by mandating female head of household ownership, standardizing earthquake-resistant construction, and offering cheap housing credit.',
    problemStatement: 'Rapid urban sprawl in India has created severe slums and informal settlements housing millions without sanitation, security of tenure, or safety.',
    needAssessment: 'National surveys revealed an urban housing shortage of approximately 11.2 million units, particularly among the economically weaker segments of urban society.',
    expectedOutcomes: 'Slum eradication, massive boost in formal construction sector employment, increased women homeownership, and dignified living conditions for 5 Crore citizens.'
  },
  classification: {
    sector: 'Housing',
    subSector: 'Urban Affordable Housing',
    theme: 'Social Infrastructure & Welfare',
    nationalPriority: 'Atmanirbhar Bharat / Housing for All',
    aspirationalDistrictScheme: 'Yes',
    flagshipScheme: 'Yes',
    categoryTag: 'Infrastructure'
  },
  beneficiaries: {
    category: 'Economically Weaker Section (EWS) & LIG',
    targetGroup: 'Urban Poor, Slum Dwellers, Women, SC/ST, and Divyangjan',
    gender: 'All Genders',
    ageGroup: '18 to 70 Years',
    incomeCriteria: 'Annual income up to ₹ 3 Lakhs for EWS; up to ₹ 6 Lakhs for LIG',
    socialCategory: 'Emphasis on SC, ST, Minorities, and Women heads',
    occupation: 'Informal workers, daily wagers, domestic helps, street vendors',
    geographicCoverage: 'All statutory towns declared in Census 2011 and updated notifications',
    urbanRural: 'Urban Only',
    individualInstitution: 'Individual',
    estimatedBeneficiaries: '12000000'
  },
  eligibility: {
    eligibilityCriteria: '1. Beneficiary family must not own a concrete (pucca) house in any part of India.\n2. Beneficiary household must fall within EWS/LIG income brackets.\n3. Female head of household must be co-owner or sole owner.',
    documentsRequired: 'Aadhaar Card, Bank Passbook, Self-affidavit of land/housing ownership status, Income Certificate, Address Proof, Voter ID card.',
    incomeLimit: '₹ 3,00,000 (EWS) / ₹ 6,00,000 (LIG) per annum',
    ageLimit: 'Adult (18+)',
    aadhaarRequired: 'Yes',
    bankAccountRequired: 'Yes',
    otherConditions: 'Beneficiary should not have availed any housing subsidy from the Central Government or State Government in the past.'
  },
  financials: {
    totalBudget: '230000',
    annualBudget: '28000',
    allocation: '26400',
    expenditure: '215000',
    sharingPattern: '60:40 standard; 90:10 for North Eastern & Himalayan States; 100:0 for Union Territories',
    centralShare: '145000',
    stateShare: '85000',
    beneficiaryContribution: '150000',
    assistanceType: 'Subsidy',
    dbtEnabled: 'Yes'
  },
  implementation: {
    implementingAgency: 'Ministry of Housing & Urban Affairs (MoHUA)',
    stateAgencies: 'State Urban Development Agencies (SUDA) / State Housing Boards',
    districtAgencies: 'District Urban Development Agency (DUDA) / Municipal Commissioners',
    localBodies: 'Municipal Corporations, Municipal Councils, and Nagar Panchayats',
    deliveryMechanism: 'Hybrid (Online + CSC + Offline)',
    mobileApp: 'PMAY(U) App',
    portalName: 'pmaymis.gov.in',
    monitoringAgency: 'Central Sanctioning and Monitoring Committee (CSMC)'
  },
  geography: {
    national: 'Yes',
    stateWise: 'Active in all 28 States and 8 Union Territories with varying targets matching local urbanization metrics.',
    districtWise: 'Implemented across 4,300+ statutory towns and associated urban development authorities globally.',
    aspirationalDistrictsOnly: 'No',
    tribalArea: 'Yes',
    northEast: 'Yes',
    utCoverage: 'Fully applicable with 100% central funding models.'
  },
  timeline: {
    announcementDate: '2015-06-15',
    launchDateTab: '2015-06-25',
    firstDisbursement: '2015-11-12',
    currentPhase: 'Phase IV (Extended to Dec 2026)',
    endDate: '2026-12-31',
    reviewFrequency: 'Quarterly'
  },
  benefits: {
    benefitType: 'Monetary / Financial Transfer',
    monetaryBenefit: 'Direct subsidy up to ₹ 2.50 Lakhs split between Credit Linked Subsidy Scheme (CLSS) and Beneficiary Led Construction (BLC).',
    nonMonetaryBenefit: 'Piped water connection, sanitation sewage pipeline access, and electricity connection under national convergence.',
    subsidyAmount: '150000',
    maxAssistance: '250000',
    frequency: 'Installment Based',
    directBenefit: 'Yes',
    indirectBenefit: 'Yes'
  },
  application: {
    onlineApp: 'Yes',
    offlineApp: 'Yes',
    cscAvailable: 'Yes',
    applicationUrl: 'https://pmaymis.gov.in/ApplyOnline',
    processingTime: '45 Business Days',
    approvalAuthority: 'Municipal Commissioner / State Nodal Officer',
    appealMechanism: 'Online grievance registry on PMAY-U portal and centralized CPGRAMS system.'
  },
  kpis: {
    appsReceived: '15600000',
    appsApproved: '12200000',
    appsRejected: '2100000',
    beneficiariesCovered: '11800000',
    womenBeneficiaries: '8400000',
    scStBeneficiaries: '3200000',
    minorityBeneficiaries: '1800000',
    fundsReleased: '142000',
    fundsUtilized: '138000',
    utilizationPercent: '97.2',
    successRate: '78.2',
    pendingCases: '1300000',
    avgApprovalTime: '35 days'
  },
  outcomes: {
    jobsCreated: '4200000',
    housesBuilt: '11500000',
    farmersBenefitted: '0',
    studentsBenefitted: '0',
    roadsConstructed: '0',
    villagesCovered: '0',
    enterprisesSupported: '12000',
    carbonReduction: '450000',
    waterSaved: '20000000',
    productivityIncrease: '0'
  },
  monitoring: {
    kpiDefinitions: '1. Houses Sanctioned vs. Grounded\n2. Houses Grounded vs. Completed\n3. Funds Released vs. Spent on PFMS',
    monitoringFrequency: 'Monthly',
    thirdPartyEvaluation: 'National Institute of Urban Affairs (NIUA)',
    socialAudit: 'Yes',
    auditReports: 'Audit Reports are regularly uploaded in PDF on the MoHUA portal.',
    impactAssessment: 'Completed houses showed 40% increase in social status of families and 25% drop in waterborne diseases among children.',
    dashboardAvailable: 'Yes'
  },
  technology: {
    portal: 'NIC Central Cloud (Meghraj)',
    mobileAppTech: 'Android App with Geo-tagging API integrated with ISRO Bhuvan satellite.',
    apiAvailable: 'Yes',
    aadhaarIntegration: 'Yes',
    digilocker: 'Yes',
    eKyc: 'Yes',
    pfms: 'Yes',
    dbtIntegration: 'Yes',
    gis: 'Yes',
    aiMlUsed: 'No'
  },
  stakeholders: {
    ministryRoles: 'MoHUA (Apex policymaking, fund release, monitoring)',
    stateGovt: 'State Housing Ministries (Executing agencies, targets coordination)',
    district: 'District Collectors (Land allocation, local oversight committees)',
    panchayat: 'Urban Local Bodies (Beneficiary verification, local lists publication)',
    ngo: 'Primary Mobilization NGOs (Form filing, local awareness campaigns)',
    banks: 'Commercial Banks / HUDCO (Interest subsidy credit pipeline)',
    csc: 'CSC SPV (Citizen touchpoint for offline form entry)',
    privatePartners: 'National Real Estate Development Council (NAREDCO) developers'
  },
  documents: {
    guidelines: 'https://pmaymis.gov.in/assets/images/pdf/Scheme_guidelines_English.pdf',
    sop: 'https://pmaymis.gov.in/SOP_verification.pdf',
    operationalManual: 'https://pmaymis.gov.in/training_manual.pdf',
    faq: 'https://pmaymis.gov.in/FAQ_English.pdf',
    forms: 'https://pmaymis.gov.in/Download_blank_forms.pdf',
    circulars: 'https://pmaymis.gov.in/circulars_archive',
    notifications: 'https://pmaymis.gov.in/notifications_list'
  },
  risks: {
    challenges: 'Land acquisition delays in highly congested metropolitan areas like Mumbai; rise in building material costs.',
    risks: 'Wrongful claims by families pretending to have no other concrete house; broker commissions.',
    bottlenecks: 'Slow verification of land deeds by municipal ward staff.',
    fraudRisks: 'Submit fake income tax certificates to meet EWS standards.',
    mitigationMeasures: 'Mandatory Aadhaar-based DBT, geo-tagging houses at 5 stages of construction through ISRO Bhuvan platform.'
  },
  success: {
    caseStudies: 'Eradication of informality in slum sectors of Surat through community ownership housing models.',
    awards: 'United Nations Scroll of Honour Nomination; PM Digital India Gold Award for Geo-tagging integration.',
    testimonials: '"Owning an all-weather concrete house has restored my family dignity. Now my daughter can study safely in light." - Kamla Devi, Indore',
    bestPractices: 'Online single-window clearance for state approvals within 15 days implemented in Gujarat and Madhya Pradesh.'
  },
  relationships: {
    parentScheme: 'Urban Infrastructure Development Mission',
    similarSchemes: 'RAY (Rajiv Awas Yojana)',
    complementarySchemes: 'Swachh Bharat Mission (Urban), Atal Mission for Rejuvenation and Urban Transformation (AMRUT), Saubhagya Yojana',
    duplicateSchemes: 'State-specific slums resettlement subsidies',
    replacedScheme: 'Indira Awaas Yojana (IAY)',
    convergedWith: 'Valmiki Ambedkar Awas Yojana (VAMBAY)',
    linkedSdgId: 'SDG 11',
    linkedMissions: 'Smart Cities Mission'
  },
  analytics: {
    budgetGrowth: '14.5',
    beneficiaryGrowth: '18.2',
    fundUtilization: '95.6',
    coveragePercent: '89',
    genderRatio: '58:42',
    ruralUrbanRatio: '0:100',
    stateRanking: 'Madhya Pradesh (Rank 1)',
    ministryRanking: 'MoHUA (Rank 2)',
    popularity: '94',
    satisfaction: '4.7',
    impact: '91',
    costPerBeneficiary: '150000',
    roi: '2.8',
    efficiency: '92.5'
  },
  aiTags: {
    keywords: 'housing, concrete home, urban development, housing for all, mohua, dbt, pucca house, slum dwellers',
    tags: 'housing, flagship, infrastructure, direct-welfare',
    summary100: 'Pradhan Mantri Awas Yojana (Urban) is a flagship mission of the Government of India launched by the Ministry of Housing and Urban Affairs. It aims to address urban housing shortages among EWS, LIG, and MIG categories, including slum dwellers, by ensuring a pucca house for all eligible households. The scheme provides cash subsidies up to 2.5 Lakhs through options like Credit Linked Interest Subsidy and Beneficiary Led Construction. To maintain maximum governance and zero fraud, houses are compulsorily geo-tagged using satellite imaging and payments are disbursed solely via Aadhaar-linked DBT systems.',
    detailedDescription: 'Full-scale operational guideline explaining the entire administrative workflow of PMAY (Urban). Houses constructed under this scheme are built with eco-friendly, sustainable, and disaster-resilient designs. Ownership must register under the female head of the family, promoting women empowerment and social upliftment across urban poor clusters.',
    faqsText: 'Q: Who can apply? A: Any Indian family with annual household income under 6 Lakhs who does not own a concrete house anywhere in India. Q: What is the subsidy amount? A: Up to 2.5 Lakhs based on selected model.',
    objectivesText: 'To construct concrete all-weather houses for all eligible families in statutory towns by Dec 2026.',
    challengesText: 'High cost of urban land and delayed state contribution matching.',
    innovationsText: 'Implementation of the Bhuvan satellite geo-tagging app to verify progress stages digitally before releasing next fund installments.',
    lessonsLearned: 'Mandating women as home co-owners drastically improved family loan repayment rates and household financial stability.',
    futureRoadmap: 'Upgrading the registration portal to include instant facial recognition-based e-KYC and automatic building permit APIs.'
  },
  metadata: {
    createdBy: 'Director (HFA-III), MoHUA',
    createdDate: '2015-06-25',
    lastUpdated: '2026-06-15',
    verifiedBy: 'Secretary, Ministry of Housing & Urban Affairs',
    source: 'https://pmaymis.gov.in/guidelines_and_manuals',
    dataConfidence: 'High (Official Gazette Verified)',
    version: 'v4.2',
    remarks: 'Approved extension by Cabinet up to December 31, 2026 to cover remaining grounded houses.'
  }
};
