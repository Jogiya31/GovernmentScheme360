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

const DEFAULT_ROLES = [
  { id: 1, title: 'Super Admin', status: true },
  { id: 2, title: 'Ministry Nodal Officer', status: true },
  { id: 3, title: 'Department Administrator', status: true },
  { id: 4, title: 'Scheme Evaluator', status: true },
  { id: 5, title: 'District Nodal Officer', status: true },
  { id: 6, title: 'Auditor & Field Inspector', status: true },
];

const DEFAULT_DEPARTMENTS = [
  { id: 101, title: 'Department of Agriculture and Farmers Welfare', status: true },
  { id: 102, title: 'Department of Land Resources', status: true },
  { id: 103, title: 'Department of Rural Development', status: true },
  { id: 104, title: 'Department of School Education and Literacy', status: true },
  { id: 105, title: 'Department of Higher Education', status: true },
  { id: 106, title: 'Department of Health and Family Welfare', status: true },
  { id: 107, title: 'Department of Financial Services', status: true },
  { id: 108, title: 'Department of Social Justice and Empowerment', status: true },
  { id: 109, title: 'Department of Drinking Water and Sanitation', status: true },
  { id: 110, title: 'Department of Micro, Small and Medium Enterprises', status: true },
];

const DEFAULT_MINISTRIES = [
  { id: 201, title: 'Ministry of Agriculture and Farmers Welfare', status: true },
  { id: 202, title: 'Ministry of Housing and Urban Affairs', status: true },
  { id: 203, title: 'Ministry of Rural Development', status: true },
  { id: 204, title: 'Ministry of Health and Family Welfare', status: true },
  { id: 205, title: 'Ministry of Education', status: true },
  { id: 206, title: 'Ministry of Finance', status: true },
  { id: 207, title: 'Ministry of Social Justice and Empowerment', status: true },
  { id: 208, title: 'Ministry of Women and Child Development', status: true },
  { id: 209, title: 'Ministry of Micro, Small and Medium Enterprises', status: true },
  { id: 210, title: 'Ministry of Electronics and Information Technology', status: true },
  { id: 211, title: 'Ministry of Jal Shakti', status: true },
  { id: 212, title: 'Ministry of Power', status: true },
  { id: 213, title: 'Ministry of New and Renewable Energy', status: true },
  { id: 214, title: 'Ministry of Labour and Employment', status: true },
  { id: 215, title: 'Ministry of Commerce and Industry', status: true },
  { id: 216, title: 'Ministry of Road Transport and Highways', status: true },
  { id: 217, title: 'Ministry of Tribal Affairs', status: true },
  { id: 218, title: 'Ministry of Skill Development and Entrepreneurship', status: true },
];

const getStoredRoles = () => {
  const saved = localStorage.getItem('gov_scheme_roles');
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch {
      return DEFAULT_ROLES;
    }
  }
  localStorage.setItem('gov_scheme_roles', JSON.stringify(DEFAULT_ROLES));
  return DEFAULT_ROLES;
};

const saveStoredRoles = (roles) => {
  localStorage.setItem('gov_scheme_roles', JSON.stringify(roles));
};

const getStoredDepartments = () => {
  const saved = localStorage.getItem('gov_scheme_departments');
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch {
      return DEFAULT_DEPARTMENTS;
    }
  }
  localStorage.setItem('gov_scheme_departments', JSON.stringify(DEFAULT_DEPARTMENTS));
  return DEFAULT_DEPARTMENTS;
};

const saveStoredDepartments = (depts) => {
  localStorage.setItem('gov_scheme_departments', JSON.stringify(depts));
};

const getStoredMinistries = () => {
  const saved = localStorage.getItem('gov_scheme_ministries');
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch {
      return DEFAULT_MINISTRIES;
    }
  }
  localStorage.setItem('gov_scheme_ministries', JSON.stringify(DEFAULT_MINISTRIES));
  return DEFAULT_MINISTRIES;
};

const saveStoredMinistries = (ministries) => {
  localStorage.setItem('gov_scheme_ministries', JSON.stringify(ministries));
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
    'Departments',
    'Ministries',
    'getAgeGroup',
    'getBeneficiaryCategory',
    'getBeneficiaryType',
    'getBenefitFrequency',
    'getBenefitType',
    'getDeliveryMechanism',
    'getDepartment',
    'getDistrict',
    'getDocumentRequired',
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
    'setSchemeBenefits'

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

    getMinistries: builder.query({
      async queryFn() {
        try {
          const data = getStoredMinistries();
          return { data };
        } catch (error) {
          return { error: { status: 'CUSTOM_ERROR', error: error.message } };
        }
      },
      providesTags: ['Ministries'],
    }),
    addMinistry: builder.mutation({
      async queryFn(newItem) {
        try {
          const ministries = getStoredMinistries();
          const added = { id: Date.now(), title: newItem, status: true };
          const updated = [...ministries, added];
          saveStoredMinistries(updated);
          return { data: added };
        } catch (error) {
          return { error: { status: 'CUSTOM_ERROR', error: error.message } };
        }
      },
      invalidatesTags: ['Ministries'],
    }),
    updateMinistry: builder.mutation({
      async queryFn({ id, ...updatedData }) {
        try {
          const ministries = getStoredMinistries();
          const updated = ministries.map((m) => (m.id === id ? { ...m, ...updatedData } : m));
          saveStoredMinistries(updated);
          const updatedMin = updated.find((m) => m.id === id);
          return { data: updatedMin };
        } catch (error) {
          return { error: { status: 'CUSTOM_ERROR', error: error.message } };
        }
      },
      invalidatesTags: ['Ministries'],
    }),
    deleteMinistry: builder.mutation({
      async queryFn(id) {
        try {
          const ministries = getStoredMinistries();
          const updated = ministries.filter((m) => m.id !== id);
          saveStoredMinistries(updated);
          return { data: { success: true, id } };
        } catch (error) {
          return { error: { status: 'CUSTOM_ERROR', error: error.message } };
        }
      },
      invalidatesTags: ['Ministries'],
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

    getDocumentRequired: builder.mutation({
      query: (data = {}) => ({
        url: '/DocumentRequired',
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
  }),
});

export const {
  useLoginMutation,
  useGetDashboardSummaryQuery,
  useGetUsersQuery,
  useGetMinistriesQuery,
  useAddMinistryMutation,
  useUpdateMinistryMutation,
  useDeleteMinistryMutation,
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
  //
  useSetSchemeBeneficiariesMutation,
  useSetSchemeBenefitsMutation
} = api;
