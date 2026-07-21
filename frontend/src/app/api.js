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
    baseUrl: import.meta.env.VITE_API_BASE_URL,
    prepareHeaders: (headers) => {
      headers.set('Content-Type', 'application/json');
      return headers;
    },
  }),

  tagTypes: [
    'login',
    'getDashboardSummary',
    'getAgeGroup',
    'getBeneficiaryCategory',
    'getBeneficiaryType',
    'getBenefitFrequency',
    'getBenefitType',
    'getDeliveryMechanism',
    'getDepartment',
    'getDistrict',
    'getDocument',
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
  ],
  
  endpoints: (builder) => ({
    // 1. Login API
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
    // 2. Dashboard Summary API
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
    // 3. Get Age Group API
    getAgeGroup: builder.mutation({
      query: (data) => ({
        url: '',
        method: 'post',
        body: data,
      }),
    }),
    // 4. Get Beneficiary Category API
    getAgeGroup: builder.mutation({
      query: (data) => ({
        url: '',
        method: 'POST',
        body: data,
      }),
    }),
    // 
    getBeneficiaryCategory: builder.mutation({
      query: (data) => ({
        url: '',
        method: 'POST',
        body: data,
      }),
    }),

    getBeneficiaryType: builder.mutation({
      query: (data) => ({
        url: '',
        method: 'POST',
        body: data,
      }),
    }),

    getBenefitFrequency: builder.mutation({
      query: (data) => ({
        url: '',
        method: 'POST',
        body: data,
      }),
    }),

    getBenefitType: builder.mutation({
      query: (data) => ({
        url: '',
        method: 'POST',
        body: data,
      }),
    }),

    getDeliveryMechanism: builder.mutation({
      query: (data) => ({
        url: '',
        method: 'POST',
        body: data,
      }),
    }),

    getDepartment: builder.mutation({
      query: (data) => ({
        url: '',
        method: 'POST',
        body: data,
      }),
    }),

    getDistrict: builder.mutation({
      query: (data) => ({
        url: '',
        method: 'POST',
        body: data,
      }),
    }),

    getDocument: builder.mutation({
      query: (data) => ({
        url: '',
        method: 'POST',
        body: data,
      }),
    }),

    getFinancialAssistanceType: builder.mutation({
      query: (data) => ({
        url: '',
        method: 'POST',
        body: data,
      }),
    }),

    getFundSharingPattern: builder.mutation({
      query: (data) => ({
        url: '',
        method: 'POST',
        body: data,
      }),
    }),

    getGender: builder.mutation({
      query: (data) => ({
        url: '',
        method: 'POST',
        body: data,
      }),
    }),

    getGeographicCoverage: builder.mutation({
      query: (data) => ({
        url: '',
        method: 'POST',
        body: data,
      }),
    }),

    getImplementingAgency: builder.mutation({
      query: (data) => ({
        url: '',
        method: 'POST',
        body: data,
      }),
    }),

    getIncomeCriteria: builder.mutation({
      query: (data) => ({
        url: '',
        method: 'POST',
        body: data,
      }),
    }),

    getInsuranceType: builder.mutation({
      query: (data) => ({
        url: '',
        method: 'POST',
        body: data,
      }),
    }),

    getLocalBody: builder.mutation({
      query: (data) => ({
        url: '',
        method: 'POST',
        body: data,
      }),
    }),

    getMinistry: builder.mutation({
      query: (data) => ({
        url: '',
        method: 'POST',
        body: data,
      }),
    }),

    getMission: builder.mutation({
      query: (data) => ({
        url: '',
        method: 'POST',
        body: data,
      }),
    }),

    getMonitoringAgency: builder.mutation({
      query: (data) => ({
        url: '',
        method: 'POST',
        body: data,
      }),
    }),

    getNationalPriority: builder.mutation({
      query: (data) => ({
        url: '',
        method: 'POST',
        body: data,
      }),
    }),

    getOccupation: builder.mutation({
      query: (data) => ({
        url: '',
        method: 'POST',
        body: data,
      }),
    }),

    getOutcomeIndicator: builder.mutation({
      query: (data) => ({
        url: '',
        method: 'POST',
        body: data,
      }),
    }),

    getReviewFrequency: builder.mutation({
      query: (data) => ({
        url: '',
        method: 'POST',
        body: data,
      }),
    }),

    getScheme: builder.mutation({
      query: (data) => ({
        url: '',
        method: 'POST',
        body: data,
      }),
    }),

    getSchemePhase: builder.mutation({
      query: (data) => ({
        url: '',
        method: 'POST',
        body: data,
      }),
    }),

    getSchemeStatus: builder.mutation({
      query: (data) => ({
        url: '',
        method: 'POST',
        body: data,
      }),
    }),

    getSchemeType: builder.mutation({
      query: (data) => ({
        url: '',
        method: 'POST',
        body: data,
      }),
    }),

    getSDG: builder.mutation({
      query: (data) => ({
        url: '',
        method: 'POST',
        body: data,
      }),
    }),

    getSector: builder.mutation({
      query: (data) => ({
        url: '',
        method: 'POST',
        body: data,
      }),
    }),

    getServiceMode: builder.mutation({
      query: (data) => ({
        url: '',
        method: 'POST',
        body: data,
      }),
    }),

    getSocialCategory: builder.mutation({
      query: (data) => ({
        url: '',
        method: 'POST',
        body: data,
      }),
    }),

    getStakeholderType: builder.mutation({
      query: (data) => ({
        url: '',
        method: 'POST',
        body: data,
      }),
    }),

    getState: builder.mutation({
      query: (data) => ({
        url: '',
        method: 'POST',
        body: data,
      }),
    }),

    getSubSector: builder.mutation({
      query: (data) => ({
        url: '',
        method: 'POST',
        body: data,
      }),
    }),

    getTargetGroup: builder.mutation({
      query: (data) => ({
        url: '',
        method: 'POST',
        body: data,
      }),
    }),

    getTheme: builder.mutation({
      query: (data) => ({
        url: '',
        method: 'POST',
        body: data,
      }),
    }),

    getUrbanRural: builder.mutation({
      query: (data) => ({
        url: '',
        method: 'POST',
        body: data,
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useGetDashboardSummaryQuery,
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
} = api;
