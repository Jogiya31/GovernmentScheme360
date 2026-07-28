// Scheme Fields Specification for Government Scheme 360° Portal
// Organizes the form structure across 23 tabs

export const DEFAULT_FALLBACK_OPTIONS = {};

export const SCHEME_TABS_CONFIG = [
  {
    id: 'SchemeMaster',
    title: '1. Basic Info',
    icon: 'bi-info-circle-fill',
    fields: [
      { key: 'schemeId', label: 'Scheme ID', type: 'text', placeholder: 'Unique Identifier, e.g. SCH-PMAY-2026', col: 4 },
      { key: 'schemeName', label: 'Official Scheme Name', type: 'text', placeholder: 'Full official name of the scheme', col: 8 },
      { key: 'alternateName', label: 'Alternate Name / Acronym', type: 'text', placeholder: 'e.g. PMAY-U / PMAY-G', col: 4 },
      { key: 'ministry', label: 'Nodal Ministry', type: 'select', options: [], col: 4 },
      { key: 'department', label: 'Implementing Department', type: 'select', options: [], col: 4 },
      { key: 'schemeType', label: 'Scheme Type', type: 'select', options: [], col: 4 },
      { key: 'launchDate', label: 'Launch Date', type: 'date', col: 4 },
      { key: 'fyStarted', label: 'Financial Year Started', type: 'date', col: 4 },
      { key: 'status', label: 'Current Status', type: 'select', options: [], col: 4 },
      { key: 'website', label: 'Official Website / Portal', type: 'text', placeholder: 'https://...', col: 4 },
      { key: 'notification', label: 'Gazette / Notification Reference', type: 'text', placeholder: 'e.g. Notification No. 10/2026', col: 4 },
      { key: 'logoUrl', label: 'Scheme Logo Image URL', type: 'text', placeholder: 'https://...', col: 12 }
    ]
  },
  {
    id: 'SchemeObjectives',
    title: '2. Scheme Objectives',
    icon: 'bi-bullseye',
    fields: [
      { key: 'vision', label: 'Vision Statement', type: 'textarea', placeholder: 'Broad long-term vision...', col: 6 },
      { key: 'mission', label: 'Mission Statement', type: 'textarea', placeholder: 'Core mission boundaries...', col: 6 },
      { key: 'primaryObj', label: 'Primary Objective', type: 'textarea', placeholder: 'What this scheme seeks to achieve primarily...', col: 6 },
      { key: 'secondaryObj', label: 'Secondary Objectives', type: 'textarea', placeholder: 'Additional secondary objectives...', col: 6 },
      { key: 'problemStatement', label: 'Problem Statement', type: 'textarea', placeholder: 'Details of the specific problem this scheme addresses...', col: 6 },
      { key: 'needAssessment', label: 'Need Assessment', type: 'textarea', placeholder: 'Details of findings justifying the launch...', col: 6 },
      { key: 'expectedOutcomes', label: 'Expected Outcomes', type: 'textarea', placeholder: 'Key measurable impacts targeted...', col: 6 }
    ]
  },
  {
    id: 'SchemeClassification',
    title: '3. Scheme Classification',
    icon: 'bi-bookmark-star-fill',
    fields: [
      { key: 'sector', label: 'Primary Sector', type: 'select', options: [], col: 4 },
      { key: 'subSector', label: 'Sub-Sector', type: 'select', options: [], col: 4 },
      { key: 'theme', label: 'Substantive Theme', type: 'select', options: [], col: 4  },
      { key: 'nationalPriority', label: 'National Priority Mapping', type: 'select', options: [], col: 4 },
      { key: 'aspirationalDistrictScheme', label: 'Aspirational District Scheme', type: 'select', options: ['','Yes','No'], col: 4 },
      { key: 'flagshipScheme', label: 'Is Flagship Scheme',  type: 'text', placeholder: 'Enter here...', col: 4 },
      // { key: 'categoryTag', label: 'Welfare / Infrastructure Category', type: 'select', options: [], col: 4 }
    ]
  },
  {
    id: 'SchemeBeneficiaries',
    title: '4. Beneficiary Details',
    icon: 'bi-people-fill',
    fields: [
      { key: 'category', label: 'Beneficiary Category',  type: 'select', options: [], col: 4 },
      { key: 'targetGroup', label: 'Primary Target Group',  type: 'select', options: [], col: 4 },
      { key: 'gender', label: 'Gender focus', type: 'select', options: [], col: 4 },
      { key: 'ageGroup', label: 'Target Age Group', type: 'select', options: [], col: 4 },
      { key: 'incomeCriteria', label: 'Income Criteria Limits',type: 'select', options: [], col: 4 },
      { key: 'socialCategory', label: 'Social Category Emphasis', type: 'select', options: [], col: 4 },
      { key: 'occupation', label: 'Target Occupation', type: 'select', options: [], col: 4 },
      { key: 'geographicCoverage', label: 'Beneficiary Geographic Area', type: 'select', options: [], col: 4 },
      { key: 'urbanRural', label: 'Urban / Rural Segment', type: 'select', options: [], col: 4 },
      { key: 'individualInstitution', label: 'Entity Type', type: 'text', placeholder:'Enter here...', col: 4 },
      { key: 'estimatedBeneficiaries', label: 'Estimated Beneficiaries', type: 'number', placeholder: 'e.g. 5000000', col: 4 }
    ]
  },
  {
    id: 'SchemeEligibility',
    title: '5. Eligibility Rules',
    icon: 'bi-shield-check',
    fields: [
      { key: 'eligibilityCriteria', label: 'Eligibility Criteria Checklist', type: 'textarea', placeholder: 'Provide list of clear eligibility rules...', col: 6 },
      { key: 'documentsRequired', label: 'Documents Required for Registration', type: 'select', options: [], col: 6 },
      { key: 'incomeLimit', label: 'Explicit Annual Income Limit',  type: 'select', options: [], col: 4 },
      { key: 'ageGroup', label: 'Explicit Age Limit Limits', type: 'select', options: [],  col: 4 },
      { key: 'aadhaarRequired', label: 'Aadhaar Required', type: 'select', options: ['','Yes','No'], col: 4 },
      { key: 'bankAccountRequired', label: 'Is Bank Account Compulsory?', type: 'select', options: ['','Yes','No'], col: 4 },
      { key: 'otherConditions', label: 'Other Regulatory Conditions', type: 'textarea', placeholder: 'e.g. Must not own a concrete house or a 4-wheeler...', col: 8 }
    ]
  },
  {
    id: 'SchemeFinancials',
    title: '6. Financial Details',
    icon: 'bi-cash-coin',
    fields: [
      { key: 'totalBudget', label: 'Total Allocated Budget (Cr.)', type: 'number', placeholder: 'Total budget in Crores', col: 4 },
      { key: 'annualBudget', label: 'Current Annual Budget (Cr.)', type: 'number', placeholder: 'Annual budget in Crores', col: 4 },
      { key: 'allocation', label: 'Budget Allocation (Current FY - Cr.)', type: 'number', placeholder: 'Allocation in Crores', col: 4 },
      { key: 'expenditure', label: 'Cumulative Expenditure (Cr.)', type: 'number', placeholder: 'Expenditure in Crores', col: 4 },
      { key: 'sharingPattern', label: 'Fund Sharing Pattern (Central:State)', type: 'select', options: [],  col: 4 },
      { key: 'centralShare', label: 'Central Government Share (Cr.)', type: 'number', placeholder: 'Central share', col: 4 },
      { key: 'stateShare', label: 'State Government Share (Cr.)', type: 'number', placeholder: 'State share', col: 4 },
      { key: 'beneficiaryContribution', label: 'Beneficiary Contribution (if any)', type: 'number', placeholder: 'e.g. ₹ 20,000', col: 4 },
      { key: 'subsidy', label: 'Subsidy', type: 'text', placeholder: 'Enter here...', col: 4 },
      { key: 'grant', label: 'Grant', type: 'text', placeholder: 'Enter here...', col: 4 },
      { key: 'loan', label: 'Loan', type: 'text', placeholder: 'Enter here...', col: 4 },
      { key: 'insurance', label: 'Insurance', type: 'select', options: [], col: 4 },
      { key: 'dbtEnabled', label: 'Direct Benefit Transfer (DBT) Enabled?',  type: 'text', placeholder: 'Enter here...', col: 4 }
    ]
  },
  {
    id: 'SchemeImplementation',
    title: '7. Implementation Model',
    icon: 'bi-diagram-3-fill',
    fields: [
      { key: 'implementingAgency', label: 'Apex National Implementing Agency', type: 'select', options: [], col: 6 },
      { key: 'stateAgencies', label: 'State-level Implementing Agencies', type: 'text', placeholder: 'e.g. State Housing Boards', col: 6 },
      { key: 'districtAgencies', label: 'District-level Nodal Agencies', type: 'text', placeholder: 'e.g. DRDA / District Collectorate', col: 6 },
      { key: 'localBodies', label: 'Involved Local Bodies', type: 'select', options: [],col: 6 },
      { key: 'deliveryMechanism', label: 'Delivery Mechanism Channel', type: 'select', options: [], col: 4 },
      { key: 'mobileApp', label: 'Official Mobile App Name', type: 'text', placeholder: 'e.g. AwasApp', col: 4 },
      { key: 'portalName', label: 'Central Portal Domain Name', type: 'text', placeholder: 'e.g. pmaymis.gov.in', col: 4 },
      { key: 'monitoringAgency', label: 'Independent Monitoring Authority', type: 'text', placeholder: 'e.g. Third-party Evaluators', col: 12 }
    ]
  },
  {
    id: 'SchemeGeography',
    title: '8. Geographic Coverage',
    icon: 'bi-geo-alt-fill',
    fields: [
      { key: 'national', label: 'Is Nationally Applicable?', type: 'select', options: ['','Yes','No'], col: 4 },
      { key: 'stateWise', label: 'State-wise', type: 'text', placeholder: 'Enter here...', col: 4 },
      { key: 'districtWise', label: 'District-wise ', type: 'text', placeholder: 'Enter here', col:4 },
      { key: 'aspirationalDistricts', label: 'Aspirational Districts',type: 'text', placeholder: 'Enter here', col: 4 },
      { key: 'tribalArea', label: 'Tribal Area ',type: 'text', placeholder: 'Enter here', col: 4 },
      { key: 'northEast', label: 'North East',type: 'text', placeholder: 'Enter here', col: 4 },
      { key: 'utCoverage', label: 'UT Coverage',type: 'text', placeholder: 'Enter here',col: 4 }
    ]
  },
  {
    id: 'SchemeTimeline',
    title: '9. Scheme Timeline',
    icon: 'bi-calendar-range',
    fields: [
      { key: 'announcementDate', label: 'Announcement Date', type: 'date', col: 4 },
      { key: 'launchDateTab', label: 'Launch Date', type: 'date', col: 4 },
      { key: 'firstDisbursement', label: 'First Disbursement', type: 'text', placeholder:'Enter here...', col: 4 },
      { key: 'currentPhase', label: 'Current Phase', type: 'text', placeholder: 'e.g. Phase III Extension', col: 4 },
      { key: 'endDate', label: 'End Date', type: 'date', col: 4 },
      { key: 'reviewFrequency', label: 'Review Frequency', type: 'select', options: [], col: 4 }
    ]
  },
  {
    id: 'SchemeBenefits',
    title: '10. Benefit Packages',
    icon: 'bi-gift-fill',
    fields: [
      { key: 'benefitType', label: 'Main Benefit Category', type: 'select', options: [], col: 4 },
      { key: 'monetaryBenefit', label: 'Details of Monetary Benefit', type: 'text', placeholder: 'e.g. Direct cash subsidy of ₹ 1.2 Lakhs', col: 4 },
      { key: 'nonMonetaryBenefit', label: 'Details of Non-Monetary Benefit', type: 'text', placeholder: 'e.g. Free electricity connections, toilets', col: 4 },
      { key: 'subsidyAmount', label: 'Explicit Subsidy Amount (₹)', type: 'number', placeholder: 'e.g. 120000', col: 4 },
      { key: 'maxAssistance', label: 'Maximum Assistance per Beneficiary (₹)', type: 'number', placeholder: 'e.g. 150000', col: 4 },
      { key: 'frequency', label: 'Disbursement Frequency', type: 'select', options: [], col: 4 },
      { key: 'directBenefit', label: 'Direct Beneficiary Transfer (DBT)?', type: 'text', placeholder:'Enter here...', col: 4 },
      { key: 'indirectBenefit', label: 'Indirect Community Benefit?', type: 'text', placeholder:'Enter here...', col: 4 }
    ]
  },
  {
    id: 'application',
    title: '11. Application Process',
    icon: 'bi-file-earmark-text-fill',
    fields: [
      { key: 'onlineApp', label: 'Is Online Application Available?', type: 'select', options: ['','Yes','No'], col: 4 },
      { key: 'offlineApp', label: 'Is Offline Application Available?', type: 'select', options: ['','Yes','No'], col: 4 },
      { key: 'cscAvailable', label: 'Common Service Centre (CSC) Available?', type: 'select', options: ['','Yes','No'], col: 4 },
      { key: 'applicationUrl', label: 'Application URL', type: 'text', placeholder: 'https://...', col: 12 },
      { key: 'processingTime', label: 'Processing Time / SLA', type: 'text', placeholder: 'e.g. 45 Business Days', col: 4 },
      { key: 'approvalAuthority', label: 'Approving Authority', type: 'text', placeholder: 'e.g. Block Development Officer (BDO)', col: 4 },
      { key: 'appealMechanism', label: 'Appeal Mechanism', type: 'textarea', placeholder: 'Details of online grievance filing & nodal officers...', col: 12 }
    ]
  },
  {
    id: 'kpis',
    title: '12. Performance KPIs',
    icon: 'bi-bar-chart-line-fill',
    fields: [
      { key: 'appsReceived', label: 'Applications Received', type: 'text', placeholder: 'Enter here...', col: 4 },
      { key: 'appsApproved', label: 'Applications Approved', type: 'text', placeholder: 'Enter here...', col: 4 },
      { key: 'appsRejected', label: 'Applications Rejected', type: 'text', placeholder: 'Enter here...', col: 4 },
      { key: 'beneficiariesCovered', label: 'Beneficiaries Covered', type: 'text', placeholder: 'Enter here...', col: 4 },
      { key: 'womenBeneficiaries', label: 'Women Beneficiaries', type: 'text', placeholder: 'Enter here...', col: 4 },
      { key: 'scStBeneficiaries', label: 'SC/ST Beneficiaries', type: 'text', placeholder: 'Enter here...', col: 4 },
      { key: 'minorityBeneficiaries', label: 'Minority Beneficiaries', type: 'text', placeholder: 'Enter here...', col: 4 },
      { key: 'fundsReleased', label: 'Funds Released (Cr.)', type: 'text', placeholder: 'Enter here...', col: 4 },
      { key: 'fundsUtilized', label: 'Funds Utilized (Cr.)', type: 'text', placeholder: 'Enter here...', col: 4 },
      { key: 'utilizationPercent', label: ' Utilization Percentage (%)', type: 'text', placeholder: 'Enter here...', col: 4 },
      { key: 'successRate', label: 'Success Rate (%)', type: 'text', placeholder: 'Enter here...', col: 4 },
      { key: 'pendingCases', label: 'Pending Cases ', type: 'text', placeholder: 'Enter here...', col: 4 },
      { key: 'avgApprovalTime', label: 'Average Approval Time', type: 'text', placeholder: 'e.g. 30 days', col: 4 }
    ]
  },
  {
    id: 'SchemeOutcomes',
    title: '13. Outcome Indicators',
    icon: 'bi-clipboard-data-fill',
    fields: [
      { key: 'jobsCreated', label: 'Jobs Created', type: 'text', placeholder: 'Enter here...', col: 4 },
      { key: 'housesBuilt', label: 'Houses Built',  type: 'text', placeholder: 'Enter here...', col: 4 },
      { key: 'farmersBenefitted', label: 'Farmers Benefitted',  type: 'text', placeholder: 'Enter here...', col: 4 },
      { key: 'studentsBenefitted', label: 'Students Benefitted',  type: 'text', placeholder: 'Enter here...', col: 4 },
      { key: 'roadsConstructed', label: 'Roads Constructed',  type: 'text', placeholder: 'Enter here...', col: 4 },
      { key: 'villagesCovered', label: 'Villages Covered',  type: 'text', placeholder: 'Enter here...', col: 4 },
      { key: 'enterprisesSupported', label: 'Enterprises Supported',  type: 'text', placeholder: 'Enter here...', col: 4 },
      { key: 'carbonReduction', label: 'Carbon Reduction',  type: 'text', placeholder: 'Enter here...', col: 4 },
      { key: 'waterSaved', label: 'Water Saved',  type: 'text', placeholder: 'Enter here...', col: 4 },
      { key: 'productivityIncrease', label: 'Productivity Increase',  type: 'text', placeholder: 'Enter here...', col: 4 }
    ]
  },
  {
    id: 'monitoring',
    title: '14. Monitoring Frame',
    icon: 'bi-eye-fill',
    fields: [
      { key: 'kpis', label: 'Kpis', type: 'text', placeholder: 'Enter here...', col: 4 },
      { key: 'monitoringFrequency', label: 'Monitoring Frequency', type: 'select', options: [], col: 4 },
      { key: 'thirdPartyEvaluation', label: 'Third-party Evaluation Agency', type: 'text', placeholder: 'e.g. NITIE / IIT Kanpur', col: 4 },
      { key: 'socialAudit', label: 'Is Social Audit Compulsory?',  type: 'text', placeholder: 'Enter here...', col: 4 },
      { key: 'auditReports', label: 'Audit Reports & Guidelines References', type: 'text', placeholder: 'Upload link or manual reference...', col: 8 },
      { key: 'impactAssessment', label: 'Latest Impact Assessment Findings',  type: 'text', placeholder: 'Enter here...', col: 4 },
      { key: 'dashboardAvailable', label: 'Public Analytics Dashboard Available?',  type: 'text', placeholder: 'Enter here...', col: 4 }
    ]
  },
  {
    id: 'technology',
    title: '15. Technology Stack',
    icon: 'bi-cpu-fill',
    fields: [
      { key: 'portal', label: 'Portal Hosting Details',  type: 'text', placeholder: 'Enter here...', col: 4 },
      { key: 'mobileAppTech', label: 'Mobile App Technologies',  type: 'text', placeholder: 'Enter here...', col: 4 },
      { key: 'apiAvailable', label: 'Are Open APIs Available?', type: 'select', options: ['', 'Yes', 'No'], col: 4 },
      { key: 'aadhaarIntegration', label: 'Aadhaar UIDAI eKYC Integrated?', type: 'select', options: ['','Yes','No'], col: 4 },
      { key: 'digilocker', label: 'DigiLocker', type: 'select', options: ['','Yes','No'], col: 4 },
      { key: 'eKyc', label: 'e-KYC', type: 'select', options: ['', 'Yes', 'No'], col: 4 },
      { key: 'pfms', label: 'PFMS', type: 'text', placeholder: 'Enter here...', col: 4 },
      { key: 'dbtTech', label: 'DBT', type: 'text', placeholder: 'Enter here...', col: 4 },
      { key: 'gis', label: 'GIS', type: 'text', placeholder: 'Enter here...', col: 4 },
      { key: 'aiMlUsed', label: 'AI/ML Used', type: 'select', options: ['','No', 'Yes'], col: 4 }
    ]
  },
  {
    id: 'SchemeStakeholders',
    title: '16. Stakeholders',
    icon: 'bi-diagram-3',
    fields: [
      { key: 'ministryRoles', label: 'Ministries',type: 'text', placeholder: 'Enter here...', col: 4 },
      { key: 'stateGovt', label: 'State Government', type: 'text', placeholder: 'Enter here...', col: 4 },
      { key: 'district', label: 'District', type: 'text', placeholder: 'Enter here...', col: 4 },
      { key: 'panchayat', label: 'Panchayat', type: 'text', placeholder: 'Enter here...', col: 4 },
      { key: 'ngo', label: 'NGO', type: 'text', placeholder: 'Enter here...', col: 4 },
      { key: 'banks', label: 'Banks', type: 'text', placeholder: 'Enter here...', col: 4 },
      { key: 'csc', label: 'CSC', type: 'text', placeholder: 'Enter here...', col: 4 },
      { key: 'privatePartners', label: 'Private Partners', type: 'text', placeholder: 'Enter here...', col: 4 }
    ]
  },
  {
    id: 'documents',
    title: '17. Scheme Documents',
    icon: 'bi-folder-symlink-fill',
    fields: [
      { key: 'guidelines', label: 'Guidelines', type: 'text', placeholder: 'Enter here...', col: 6 },
      { key: 'sop', label: 'SOP', type: 'text', placeholder: 'Enter here...', col: 6 },
      { key: 'operationalManual', label: 'Operational Manual', type: 'text', placeholder: 'Enter here...', col: 6 },
      { key: 'faq', label: 'FAQ', type: 'text', placeholder: 'Enter here...', col: 6 },
      { key: 'forms', label: 'Form', type: 'text', placeholder: 'Enter here...', col: 6 },
      { key: 'circulars', label: 'Circulars', type: 'text', placeholder: 'Enter here...', col: 6 },
      { key: 'notifications', label: 'Notifications', type: 'text', placeholder: 'Enter here...', col: 12 }
    ]
  },
  {
    id: 'SchemeRisks',
    title: '18. Risks & Challenges',
    icon: 'bi-exclamation-octagon-fill',
    fields: [
      { key: 'challenges', label: 'Challenges', type: 'text', placeholder: 'Enter here...', col: 6 },
      { key: 'risks', label: 'Risks', type: 'text', placeholder: 'Enter here...', col: 6 },
      { key: 'bottlenecks', label: 'Bottlenecks', type: 'text', placeholder: 'Enter here...', col: 6 },
      { key: 'fraudRisks', label: 'Fraud Risks', type: 'text', placeholder: 'Enter here...', col: 6 },
      { key: 'mitigationMeasures', label: 'Mitigation Measures',type: 'text', placeholder: 'Enter here...', col: 12 }
    ]
  },
  {
    id: 'success',
    title: '19. Success Stories',
    icon: 'bi-trophy-fill',
    fields: [
      { key: 'caseStudies', label: 'Case Studies', type: 'text', placeholder: 'Enter here...', col: 6 },
      { key: 'awards', label: 'Awards', type: 'text', placeholder: 'Enter here...', col: 6 },
      { key: 'testimonials', label: 'Testimonials', type: 'text', placeholder: 'Enter here...', col: 6 },
      { key: 'bestPractices', label: 'Best Practices',type: 'text', placeholder: 'Enter here...', col: 6 }
    ]
  },
  {
    id: 'SchemeRelationships',
    title: '20. Scheme Relationships',
    icon: 'bi-share-fill',
    fields: [
      { key: 'parentScheme', label: 'Parent Scheme', type: 'text', placeholder: 'Enter here...', col: 6 },
      { key: 'similarSchemes', label: 'Similar Schemes', type: 'text', placeholder: 'Enter here...', col: 6 },
      { key: 'complementarySchemes', label: 'Complementary Schemes', type: 'text', placeholder: 'Enter here...', col: 6 },
      { key: 'duplicateSchemes', label: 'Duplicate Schemes', type: 'text', placeholder: 'Enter here...', col: 6 },
      { key: 'replacedScheme', label: 'Replaced Scheme', type: 'text', placeholder: 'Enter here...', col: 6 },
      { key: 'convergedWith', label: 'Converged with', type: 'text', placeholder: 'Enter here...', col: 6 },
      { key: 'linkedSdgId', label: 'Linked Sustainable Development Goal (SDG)', type: 'text', placeholder: 'Enter here...', col: 6 },
      { key: 'linkedMissions', label: 'Linked Missions', type: 'text', placeholder: 'Enter here...', col: 6 }
    ]
  },
  {
    id: 'analytics',
    title: '21. Derived Analytics',
    icon: 'bi-activity',
    fields: [
      { key: 'budgetGrowth', label: 'Budget Growth', type: 'text', placeholder: 'Enter here...', col: 4 },
      { key: 'beneficiaryGrowth', label: 'Beneficiary Growth', type: 'text', placeholder: 'Enter here...', col: 4 },
      { key: 'fundUtilization', label: 'Fund Utilization Efficiency (%)', type: 'number', placeholder: '94.5', col: 4 },
      { key: 'coveragePercent', label: 'Coverage (%)', type: 'number', placeholder: '82', col: 4 },
      { key: 'genderRatio', label: 'Gender Ratio', type: 'text', placeholder: 'Enter here...', col: 4 },
      { key: 'ruralUrbanRatio', label: 'Rural vs Urban', type: 'text', placeholder: 'Enter here...', col: 4 },
      { key: 'stateRanking', label: 'State Ranking', type: 'text', placeholder: 'Enter here...', col: 4 },
      { key: 'ministryRanking', label: 'Ministry Ranking',type: 'text', placeholder: 'Enter here...', col: 4 },
      { key: 'popularity', label: 'Scheme Popularity', type: 'text', placeholder: 'Enter here...', col: 4 },
      { key: 'satisfaction', label: 'Satisfaction Score', type: 'text', placeholder: 'Enter here...', col: 4 },
      { key: 'impact', label: 'Impact Score', type: 'text', placeholder: 'Enter here...', col: 4 },
      { key: 'costPerBeneficiary', label: 'Cost per Beneficiary', type: 'text', placeholder: 'Enter here...', col: 4 },
      { key: 'roi', label: 'ROI', type: 'text', placeholder: 'Enter here...', col: 4 },
      { key: 'efficiency', label: 'Efficiency Score', type: 'text', placeholder: 'Enter here...', col: 4 }
    ]
  },
  {
    id: 'aiTags',
    title: '22. AI-Friendly Attributes',
    icon: 'bi-stars',
    fields: [
      { key: 'keywords', label: 'Keywords', type: 'text', placeholder: 'Enter here...', col: 6 },
      { key: 'tags', label: 'Tags',  type: 'text', placeholder: 'Enter here...', col: 6 },
      { key: 'summary100', label: 'Summary (100 Words)', type: 'textarea', placeholder: 'Write a concise 100-word overview for chatbot references...', col: 12 },
      { key: 'detailedDescription', label: 'Detailed Description', type: 'textarea', placeholder: 'Long description containing absolute legal facts...', col: 12 },
      { key: 'faqsText', label: 'FAQs', type: 'textarea', placeholder: 'Format: Q: Is bank account required? A: Yes, for Direct Transfer...', col: 12 },
      { key: 'objectivesText', label: 'Objectives', type: 'text', placeholder: 'Enter here...', col: 6 },
      { key: 'challengesText', label: 'Challenges',  type: 'text', placeholder: 'Enter here...', col: 6 },
      { key: 'innovationsText', label: 'Innovations',  type: 'text', placeholder: 'Enter here...', col: 12 },
      { key: 'lessonsLearned', label: 'Lessons Learned',  type: 'text', placeholder: 'Enter here...', col: 6 },
      { key: 'futureRoadmap', label: 'Future Roadmap',  type: 'text', placeholder: 'Enter here...', col: 6 }
    ]
  },
  {
    id: 'metadata',
    title: '23. Meta Audit Trail',
    icon: 'bi-shield-lock-fill',
    fields: [
      { key: 'createdBy', label: 'Created By', type: 'text', placeholder: 'Enter here... ', col: 4 },
      { key: 'createdDate', label: 'Created Date', type: 'date', col: 4 },
      { key: 'lastUpdated', label: 'Last Updated', type: 'date', col: 4 },
      { key: 'verifiedBy', label: 'Verified By', type: 'text', placeholder: 'Enter here...', col: 4 },
      { key: 'source', label: 'Source', type: 'text', placeholder: 'Enter here...', col: 4 },
      { key: 'dataConfidence', label: 'Data Confidence', type: 'text', placeholder: 'Enter here...', col: 4 },
      { key: 'version', label: 'Version', type: 'text', placeholder: 'Enter here...', col: 4 },
      { key: 'remarks', label: 'Remarks', type: 'textarea', placeholder: 'Special system notes on this revision...', col: 12 }
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
  SchemeMaster: {
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
  SchemeObjectives: {
    vision: 'Ensuring every citizen in urban India has access to a dignified concrete house with basic amenities like toilet, power, and water.',
    mission: 'To construct over 1.2 Crore concrete houses in notified urban regions by the end of extended timeline 2024-2026, facilitating credit linked interest subsidies.',
    primaryObj: 'Provide all-weather pucca houses to all eligible urban households including slum dwellers, EWS, and LIG categories by leveraging multiple financial models.',
    secondaryObj: 'Empower women by mandating female head of household ownership, standardizing earthquake-resistant construction, and offering cheap housing credit.',
    problemStatement: 'Rapid urban sprawl in India has created severe slums and informal settlements housing millions without sanitation, security of tenure, or safety.',
    needAssessment: 'National surveys revealed an urban housing shortage of approximately 11.2 million units, particularly among the economically weaker segments of urban society.',
    expectedOutcomes: 'Slum eradication, massive boost in formal construction sector employment, increased women homeownership, and dignified living conditions for 5 Crore citizens.'
  },
  SchemeClassification: {
    sector: 'Housing',
    subSector: 'Urban Affordable Housing',
    theme: 'Social Infrastructure & Welfare',
    nationalPriority: 'Atmanirbhar Bharat / Housing for All',
    aspirationalDistrictScheme: 'Yes',
    flagshipScheme: 'Yes',
    categoryTag: 'Infrastructure'
  },
  SchemeBeneficiaries: {
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
  SchemeEligibility: {
    eligibilityCriteria: '1. Beneficiary family must not own a concrete (pucca) house in any part of India.\n2. Beneficiary household must fall within EWS/LIG income brackets.\n3. Female head of household must be co-owner or sole owner.',
    documentsRequired: 'Aadhaar Card, Bank Passbook, Self-affidavit of land/housing ownership status, Income Certificate, Address Proof, Voter ID card.',
    incomeLimit: '₹ 3,00,000 (EWS) / ₹ 6,00,000 (LIG) per annum',
    ageLimit: 'Adult (18+)',
    aadhaarRequired: 'Yes',
    bankAccountRequired: 'Yes',
    otherConditions: 'Beneficiary should not have availed any housing subsidy from the Central Government or State Government in the past.'
  },
  SchemeFinancials: {
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
  SchemeImplementation: {
    implementingAgency: 'Ministry of Housing & Urban Affairs (MoHUA)',
    stateAgencies: 'State Urban Development Agencies (SUDA) / State Housing Boards',
    districtAgencies: 'District Urban Development Agency (DUDA) / Municipal Commissioners',
    localBodies: 'Municipal Corporations, Municipal Councils, and Nagar Panchayats',
    deliveryMechanism: 'Hybrid (Online + CSC + Offline)',
    mobileApp: 'PMAY(U) App',
    portalName: 'pmaymis.gov.in',
    monitoringAgency: 'Central Sanctioning and Monitoring Committee (CSMC)'
  },
  SchemeGeography: {
    national: 'Yes',
    stateWise: 'Active in all 28 States and 8 Union Territories with varying targets matching local urbanization metrics.',
    districtWise: 'Implemented across 4,300+ statutory towns and associated urban development authorities globally.',
    aspirationalDistrictsOnly: 'No',
    tribalArea: 'Yes',
    northEast: 'Yes',
    utCoverage: 'Fully applicable with 100% central funding models.'
  },
  SchemeTimeline: {
    announcementDate: '2015-06-15',
    launchDateTab: '2015-06-25',
    firstDisbursement: '2015-11-12',
    currentPhase: 'Phase IV (Extended to Dec 2026)',
    endDate: '2026-12-31',
    reviewFrequency: 'Quarterly'
  },
  SchemeBenefits: {
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
  SchemeOutcomes: {
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
  SchemeStakeholders: {
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
  SchemeRisks: {
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
  SchemeRelationships: {
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
