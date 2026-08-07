import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const DEFAULT_USERS = [];
const getStoredUsers = () => {
  const saved = localStorage.getItem('gov_scheme_users');
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch {
      return DEFAULT_USERS;
    }
  }
  localStorage.setItem('gov_scheme_users', JSON.stringify(DEFAULT_USERS));
  return DEFAULT_USERS;
};

export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_BASE_URL || 'https://e78b-164-100-206-129.ngrok-free.app/api',
    prepareHeaders: (headers) => {
      headers.set('Content-Type', 'application/json');
      headers.set('ngrok-skip-browser-warning', 'true');
      return headers;
    },
  }),

  tagTypes: [
    'login',
    'getDashboardSummary',
    'Users',
    'Roles',

    //-----------------//
    'getSchemeById',

    //-----------------//
    'getAgeGroup',
    'getBeneficiaryCategory',
    'getBeneficiaryType',
    'getBenefitFrequency',
    'getBenefitType',
    'getDeliveryMechanism',
    'getDepartment',
    'getDistrict',
    'getFinancialAssistanceType',
    'getFundSharingPattern',
    'getGender',
    'getGeographicCoverage',
    'getImplementingAgency',
    'getIncomeCriteria',
    'getInsuranceType',
    'getLocalBody',
    'getMinistry',
    'getMission',
    'getMonitoringAgency',
    'getNationalPriority',
    'getOccupation',
    'getOutcomeIndicator',
    'getReviewFrequency',
    'getScheme',
    'getSchemePhase',
    'getSchemeStatus',
    'getSchemeType',
    'getSDG',
    'getSector',
    'getServiceMode',
    'getSocialCategory',
    'getStakeholderType',
    'getState',
    'getSubSector',
    'getTargetGroup',
    'getTheme',
    'getUrbanRural',

    //-----------------//
    'setSchemeBeneficiaries',
    'setSchemeBenefits',
    'setSchemeClassification',
    'setSchemeComplementary',
    'setSchemeConvergence',
    'setSchemeDistrict',
    'setSchemeDuplicate',
    'setSchemeEligibility',
    'setSchemeFinancials',
    'setSchemeGeography',
    'setSchemeImplementation',
    'setSchemeMaster',
    'setSchemeMission',
    'setSchemeObjectives',
    'setSchemeOutcomes',
    'setSchemeRelationships',
    'setSchemeRisks',
    'setSchemeSDG',
    'setSchemeSimilar',
    'setSchemeStakeholders',
    'setSchemeState',
    'setSchemeTimeline',

    //-----------------//
    'updateSchemeBeneficiaries',
    'updateSchemeBenefits',
    'updateSchemeClassification',
    'updateSchemeComplementary',
    'updateSchemeConvergence',
    'updateSchemeDistrict',
    'updateSchemeDuplicate',
    'updateSchemeEligibility',
    'updateSchemeFinancials',
    'updateSchemeGeography',
    'updateSchemeImplementation',
    'updateSchemeMaster',
    'updateSchemeMission',
    'updateSchemeObjectives',
    'updateSchemeOutcomes',
    'updateSchemeRelationships',
    'updateSchemeRisks',
    'updateSchemeSDG',
    'updateSchemeSimilar',
    'updateSchemeStakeholders',
    'updateSchemeState',
    'updateSchemeTimeline',

  
  ],

  endpoints: (builder) => ({
    // Login API
    login: builder.mutation({
      async queryFn(credentials) {
        try {
          const { email, password } = credentials;
          if (email === 'admin@gmail.com' && password === 'admin123') {
            const user = { id: 99, name: 'Jayswar', email: 'jayswar311@gmail.com', role: 'Admin' };
            const token = 'jwt-token-header.' + btoa(JSON.stringify(user)) + '.signature';
            const refreshToken = 'refresh-token-' + Math.random().toString(36).substring(2);
            const data = { user, token, refreshToken };
            return { data };
          } else {
            return {
              error: {
                status: 400,
                data: { message: 'Invalid email or password. Use: admin@gmail.com / admin123' },
              },
            };
          }
        } catch (error) {
          return { error: { status: 'CUSTOM_ERROR', error: error.message } };
        }
      },
    }),
    // Dashboard Summary API
    getDashboardSummary: builder.query({
      async queryFn() {
        try {
          const users = getStoredUsers();
          const summary = {
            revenue: { total: 35487, change: 12.5, period: 'month-over-month' },
            users: { total: users.length, change: 8.2, period: 'weekly-average' },
            projects: { total: 12, change: -2.4, period: 'active-status' },
            tasks: { completed: 84, total: 110, percentage: 76.3 },
            timeline: [
              {
                id: 1,
                title: 'Meeting with Stakeholders',
                desc: 'Discuss project delivery timelines',
                type: 'info',
                time: '09:30 AM',
              },
              {
                id: 2,
                title: 'Design system update approved',
                desc: 'New icons pack loaded into Figma',
                type: 'success',
                time: '11:00 AM',
              },
              {
                id: 3,
                title: 'High memory usage alert',
                desc: 'Server AWS-3 encountered spike',
                type: 'danger',
                time: '01:45 PM',
              },
              {
                id: 4,
                title: 'Invoice payment received',
                desc: 'Subscription payment from Client X',
                type: 'warning',
                time: '04:15 PM',
              },
            ],
            recentTransactions: [
              {
                id: 'TX-1002',
                item: 'Apex UI Pro license',
                buyer: 'Elite Dev Studio',
                amount: 399,
                status: 'Paid',
                date: '2026-07-19',
              },
              {
                id: 'TX-1003',
                item: 'AWS hosting cost',
                buyer: 'Server Cluster 4',
                amount: 148,
                status: 'Paid',
                date: '2026-07-18',
              },
              {
                id: 'TX-1004',
                item: 'Consulting services',
                buyer: 'Zenith Labs Corp',
                amount: 1500,
                status: 'Pending',
                date: '2026-07-18',
              },
              {
                id: 'TX-1005',
                item: 'UI/UX Redesign kit',
                buyer: 'AdminMart Premium',
                amount: 89,
                status: 'Failed',
                date: '2026-07-17',
              },
              {
                id: 'TX-1006',
                item: 'Bootstrap Pro upgrade',
                buyer: 'InnoTech Solutions',
                amount: 249,
                status: 'Paid',
                date: '2026-07-16',
              },
            ],
          };
          return { data: summary };
        } catch (error) {
          return { error: { status: 'CUSTOM_ERROR', error: error.message } };
        }
      },
      providesTags: ['Users'],
    }),
    // User Management APIs
    getUsers: builder.query({
      async queryFn() {
        try {
          const data = getStoredUsers();
          return { data };
        } catch (error) {
          return { error: { status: 'CUSTOM_ERROR', error: error.message } };
        }
      },
      providesTags: ['Users'],
    }),
    // api for get scheme by id
    getSchemeById: builder.mutation({
      query: (data) => ({
        url: 'getSchemeById',
        method: 'post',
        body: data,
      }),
    }),

    getAgeGroup: builder.mutation({
      query: (data = {}) => ({
        url: '/AgeGroup',
        method: 'POST',
        body: data,
      }),
    }),
    getBeneficiaryCategory: builder.mutation({
      query: (data = {}) => ({
        url: '/BeneficiaryCategory',
        method: 'POST',
        body: data,
      }),
    }),
    getBeneficiaryType: builder.mutation({
      query: (data = {}) => ({
        url: '/BeneficiaryType',
        method: 'POST',
        body: data,
      }),
    }),
    getBenefitFrequency: builder.mutation({
      query: (data = {}) => ({
        url: '/BenefitFrequency',
        method: 'POST',
        body: data,
      }),
    }),
    getBenefitType: builder.mutation({
      query: (data = {}) => ({
        url: '/BenefitType',
        method: 'POST',
        body: data,
      }),
    }),
    getDeliveryMechanism: builder.mutation({
      query: (data = {}) => ({
        url: '/DeliveryMechanism',
        method: 'POST',
        body: data,
      }),
    }),
    getDepartment: builder.mutation({
      query: (data = {}) => ({
        url: '/Department',
        method: 'POST',
        body: data,
      }),
    }),
    getDistrict: builder.mutation({
      query: (data = {}) => ({
        url: '/District',
        method: 'POST',
        body: data,
      }),
    }),
    getFinancialAssistanceType: builder.mutation({
      query: (data = {}) => ({
        url: '/FinancialAssistanceType',
        method: 'POST',
        body: data,
      }),
    }),
    getFundSharingPattern: builder.mutation({
      query: (data = {}) => ({
        url: '/FundSharingPattern',
        method: 'POST',
        body: data,
      }),
    }),
    getGender: builder.mutation({
      query: (data = {}) => ({
        url: '/Gender',
        method: 'POST',
        body: data,
      }),
    }),
    getGeographicCoverage: builder.mutation({
      query: (data = {}) => ({
        url: '/GeographicCoverage',
        method: 'POST',
        body: data,
      }),
    }),
    getImplementingAgency: builder.mutation({
      query: (data = {}) => ({
        url: '/ImplementingAgency',
        method: 'POST',
        body: data,
      }),
    }),
    getIncomeCriteria: builder.mutation({
      query: (data = {}) => ({
        url: '/IncomeCriteria',
        method: 'POST',
        body: data,
      }),
    }),
    getInsuranceType: builder.mutation({
      query: (data = {}) => ({
        url: '/InsuranceType',
        method: 'POST',
        body: data,
      }),
    }),
    getLocalBody: builder.mutation({
      query: (data = {}) => ({
        url: '/LocalBody',
        method: 'POST',
        body: data,
      }),
    }),
    getMinistry: builder.mutation({
      query: (data = {}) => ({
        url: '/Ministry',
        method: 'POST',
        body: data,
      }),
    }),
    getMission: builder.mutation({
      query: (data = {}) => ({
        url: '/Mission',
        method: 'POST',
        body: data,
      }),
    }),
    getMonitoringAgency: builder.mutation({
      query: (data = {}) => ({
        url: '/MonitoringAgency',
        method: 'POST',
        body: data,
      }),
    }),
    getNationalPriority: builder.mutation({
      query: (data = {}) => ({
        url: '/NationalPriority',
        method: 'POST',
        body: data,
      }),
    }),
    getOccupation: builder.mutation({
      query: (data = {}) => ({
        url: '/Occupation',
        method: 'POST',
        body: data,
      }),
    }),
    getOutcomeIndicator: builder.mutation({
      query: (data = {}) => ({
        url: '/OutcomeIndicator',
        method: 'POST',
        body: data,
      }),
    }),
    getReviewFrequency: builder.mutation({
      query: (data = {}) => ({
        url: '/ReviewFrequency',
        method: 'POST',
        body: data,
      }),
    }),
    getScheme: builder.mutation({
      query: (data = {}) => ({
        url: '/Scheme',
        method: 'POST',
        body: data,
      }),
    }),
    getSchemePhase: builder.mutation({
      query: (data = {}) => ({
        url: '/SchemePhase',
        method: 'POST',
        body: data,
      }),
    }),
    getSchemeStatus: builder.mutation({
      query: (data = {}) => ({
        url: '/SchemeStatus',
        method: 'POST',
        body: data,
      }),
    }),
    getSchemeType: builder.mutation({
      query: (data = {}) => ({
        url: '/SchemeType',
        method: 'POST',
        body: data,
      }),
    }),
    getSDG: builder.mutation({
      query: (data = {}) => ({
        url: '/SDG',
        method: 'POST',
        body: data,
      }),
    }),
    getSector: builder.mutation({
      query: (data = {}) => ({
        url: '/Sector',
        method: 'POST',
        body: data,
      }),
    }),
    getServiceMode: builder.mutation({
      query: (data = {}) => ({
        url: '/ServiceMode',
        method: 'POST',
        body: data,
      }),
    }),
    getSocialCategory: builder.mutation({
      query: (data = {}) => ({
        url: '/SocialCategory',
        method: 'POST',
        body: data,
      }),
    }),
    getStakeholderType: builder.mutation({
      query: (data = {}) => ({
        url: '/StakeholderType',
        method: 'POST',
        body: data,
      }),
    }),
    getState: builder.mutation({
      query: (data = {}) => ({
        url: '/State',
        method: 'POST',
        body: data,
      }),
    }),
    getSubSector: builder.mutation({
      query: (data = {}) => ({
        url: '/SubSector',
        method: 'POST',
        body: data,
      }),
    }),
    getTargetGroup: builder.mutation({
      query: (data = {}) => ({
        url: '/TargetGroup',
        method: 'POST',
        body: data,
      }),
    }),
    getTheme: builder.mutation({
      query: (data = {}) => ({
        url: '/Theme',
        method: 'POST',
        body: data,
      }),
    }),
    getUrbanRural: builder.mutation({
      query: (data = {}) => ({
        url: '/UrbanRural',
        method: 'POST',
        body: data,
      }),
    }),

    // api for scheme data
    setSchemeBeneficiaries: builder.mutation({
      query: (data) => ({
        url: 'setSchemeBeneficiaries',
        method: 'post',
        body: data,
      }),
    }),
    setSchemeBenefits: builder.mutation({
      query: (data) => ({
        url: 'setSchemeBenefits',
        method: 'post',
        body: data,
      }),
    }),
    setSchemeClassification: builder.mutation({
      query: (data) => ({
        url: 'setSchemeClassification',
        method: 'post',
        body: data,
      }),
    }),
    setSchemeComplementary: builder.mutation({
      query: (data) => ({
        url: 'setSchemeComplementary',
        method: 'post',
        body: data,
      }),
    }),
    setSchemeConvergence: builder.mutation({
      query: (data) => ({
        url: 'setSchemeConvergence',
        method: 'post',
        body: data,
      }),
    }),
    setSchemeDistrict: builder.mutation({
      query: (data) => ({
        url: 'setSchemeDistrict',
        method: 'post',
        body: data,
      }),
    }),
    setSchemeDuplicate: builder.mutation({
      query: (data) => ({
        url: 'setSchemeDuplicate',
        method: 'post',
        body: data,
      }),
    }),
    setSchemeEligibility: builder.mutation({
      query: (data) => ({
        url: 'setSchemeEligibility',
        method: 'post',
        body: data,
      }),
    }),
    setSchemeFinancials: builder.mutation({
      query: (data) => ({
        url: 'setSchemeFinancials',
        method: 'post',
        body: data,
      }),
    }),
    setSchemeGeography: builder.mutation({
      query: (data) => ({
        url: 'setSchemeGeography',
        method: 'post',
        body: data,
      }),
    }),
    setSchemeImplementation: builder.mutation({
      query: (data) => ({
        url: 'setSchemeImplementation',
        method: 'post',
        body: data,
      }),
    }),
    setSchemeMaster: builder.mutation({
      query: (data) => ({
        url: 'setSchemeMaster',
        method: 'post',
        body: data,
      }),
    }),
    setSchemeMission: builder.mutation({
      query: (data) => ({
        url: 'setSchemeMission',
        method: 'post',
        body: data,
      }),
    }),
    setSchemeObjectives: builder.mutation({
      query: (data) => ({
        url: 'setSchemeObjectives',
        method: 'post',
        body: data,
      }),
    }),
    setSchemeOutcomes: builder.mutation({
      query: (data) => ({
        url: 'setSchemeOutcomes',
        method: 'post',
        body: data,
      }),
    }),
    setSchemeRelationships: builder.mutation({
      query: (data) => ({
        url: 'setSchemeRelationships',
        method: 'post',
        body: data,
      }),
    }),
    setSchemeRisks: builder.mutation({
      query: (data) => ({
        url: 'setSchemeRisks',
        method: 'post',
        body: data,
      }),
    }),
    setSchemeSDG: builder.mutation({
      query: (data) => ({
        url: 'setSchemeSDG',
        method: 'post',
        body: data,
      }),
    }),
    setSchemeSimilar: builder.mutation({
      query: (data) => ({
        url: 'setSchemeSimilar',
        method: 'post',
        body: data,
      }),
    }),
    setSchemeStakeholders: builder.mutation({
      query: (data) => ({
        url: 'setSchemeStakeholders',
        method: 'post',
        body: data,
      }),
    }),
    setSchemeState: builder.mutation({
      query: (data) => ({
        url: 'setSchemeState',
        method: 'post',
        body: data,
      }),
    }),
    setSchemeTimeline: builder.mutation({
      query: (data) => ({
        url: 'setSchemeTimeline',
        method: 'post',
        body: data,
      }),
    }),

    // api for update scheme
    updateSchemeBeneficiaries: builder.mutation({
      query: (data) => ({
        url: 'updateSchemeBeneficiaries',
        method: 'post',
        body: data,
      }),
    }),
    updateSchemeBenefits: builder.mutation({
      query: (data) => ({
        url: 'updateSchemeBenefits',
        method: 'post',
        body: data,
      }),
    }),
    updateSchemeClassification: builder.mutation({
      query: (data) => ({
        url: 'updateSchemeClassification',
        method: 'post',
        body: data,
      }),
    }),
    updateSchemeComplementary: builder.mutation({
      query: (data) => ({
        url: 'updateSchemeComplementary',
        method: 'post',
        body: data,
      }),
    }),
    updateSchemeConvergence: builder.mutation({
      query: (data) => ({
        url: 'updateSchemeConvergence',
        method: 'post',
        body: data,
      }),
    }),
    updateSchemeDistrict: builder.mutation({
      query: (data) => ({
        url: 'updateSchemeDistrict',
        method: 'post',
        body: data,
      }),
    }),
    updateSchemeDuplicate: builder.mutation({
      query: (data) => ({
        url: 'updateSchemeDuplicate',
        method: 'post',
        body: data,
      }),
    }),
    updateSchemeEligibility: builder.mutation({
      query: (data) => ({
        url: 'updateSchemeEligibility',
        method: 'post',
        body: data,
      }),
    }),
    updateSchemeFinancials: builder.mutation({
      query: (data) => ({
        url: 'updateSchemeFinancials',
        method: 'post',
        body: data,
      }),
    }),
    updateSchemeGeography: builder.mutation({
      query: (data) => ({
        url: 'updateSchemeGeography',
        method: 'post',
        body: data,
      }),
    }),
    updateSchemeImplementation: builder.mutation({
      query: (data) => ({
        url: 'updateSchemeImplementation',
        method: 'post',
        body: data,
      }),
    }),
    updateSchemeMaster: builder.mutation({
      query: (data) => ({
        url: 'updateSchemeMaster',
        method: 'post',
        body: data,
      }),
    }),
    updateSchemeMission: builder.mutation({
      query: (data) => ({
        url: 'updateSchemeMission',
        method: 'post',
        body: data,
      }),
    }),
    updateSchemeObjectives: builder.mutation({
      query: (data) => ({
        url: 'updateSchemeObjectives',
        method: 'post',
        body: data,
      }),
    }),
    updateSchemeOutcomes: builder.mutation({
      query: (data) => ({
        url: 'updateSchemeOutcomes',
        method: 'post',
        body: data,
      }),
    }),
    updateSchemeRelationships: builder.mutation({
      query: (data) => ({
        url: 'updateSchemeRelationships',
        method: 'post',
        body: data,
      }),
    }),
    updateSchemeRisks: builder.mutation({
      query: (data) => ({
        url: 'updateSchemeRisks',
        method: 'post',
        body: data,
      }),
    }),
    updateSchemeSDG: builder.mutation({
      query: (data) => ({
        url: 'updateSchemeSDG',
        method: 'post',
        body: data,
      }),
    }),
    updateSchemeSimilar: builder.mutation({
      query: (data) => ({
        url: 'updateSchemeSimilar',
        method: 'post',
        body: data,
      }),
    }),
    updateSchemeStakeholders: builder.mutation({
      query: (data) => ({
        url: 'updateSchemeStakeholders',
        method: 'post',
        body: data,
      }),
    }),
    updateSchemeState: builder.mutation({
      query: (data) => ({
        url: 'updateSchemeState',
        method: 'post',
        body: data,
      }),
    }),
    updateSchemeTimeline: builder.mutation({
      query: (data) => ({
        url: 'updateSchemeTimeline',
        method: 'post',
        body: data,
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useGetDashboardSummaryQuery,
  useGetUsersQuery,
  // get dropdown data
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
  // set form tab data
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
  useSetSchemeMasterMutation,
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
  // get scheme by id
  useGetSchemeByIdMutation,
  // update form tab data
  useUpdateSchemeBeneficiariesMutation,
  useUpdateSchemeBenefitsMutation,
  useUpdateSchemeClassificationMutation,
  useUpdateSchemeComplementaryMutation,
  useUpdateSchemeConvergenceMutation,
  useUpdateSchemeDistrictMutation,
  useUpdateSchemeDuplicateMutation,
  useUpdateSchemeEligibilityMutation,
  useUpdateSchemeFinancialsMutation,
  useUpdateSchemeGeographyMutation,
  useUpdateSchemeImplementationMutation,
  useUpdateSchemeMasterMutation,
  useUpdateSchemeMissionMutation,
  useUpdateSchemeObjectivesMutation,
  useUpdateSchemeOutcomesMutation,
  useUpdateSchemeRelationshipsMutation,
  useUpdateSchemeRisksMutation,
  useUpdateSchemeSDGMutation,
  useUpdateSchemeSimilarMutation,
  useUpdateSchemeStakeholdersMutation,
  useUpdateSchemeStateMutation,
  useUpdateSchemeTimelineMutation,
} = api;
