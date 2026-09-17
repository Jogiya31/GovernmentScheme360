import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
const BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

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
    baseUrl: BASE_URL,
    prepareHeaders: (headers, { getState, endpoint }) => {
      headers.set('Content-Type', 'application/json');

      // Public endpoints: must NOT attach user token or Authorization header
      const publicEndpoints = ['getDepartment', 'login', 'registerUser'];
      if (publicEndpoints.includes(endpoint)) {
        headers.delete('Authorization');
        return headers;
      }

      // Extract JWT token from Redux auth slice or localStorage
      const stateToken = getState()?.auth?.token;
      const storedToken = localStorage.getItem('token') || localStorage.getItem('auth_token');
      const token = stateToken || storedToken;

      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),

  tagTypes: [
    'login',
    'getDashboardSummary',
    'Users',

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
    // Login API (Calls Express /Login -> sp_UserLogin with exact SP parameters)
    login: builder.mutation({
      async queryFn(credentials, _queryApi, _extraOptions, fetchWithBQ) {
        const email = (credentials?.email || '').trim().toLowerCase();
        const password = credentials?.password || '';

        // 1. Attempt call to real Express Backend: POST /Login
        try {
          const res = await fetchWithBQ({
            url: '/Login',
            method: 'POST',
            body: {
              // Exact parameter names defined in [User].[sp_UserLogin]
              Email: email,
              PasswordHash: password,
              IpAddress: null,
              UserAgent: navigator.userAgent,
            },
          });

          if (res.data) {
            // Case A: Express returned direct auth object: { success: true, token, user }
            if (res.data.token && res.data.user) {
              const user = res.data.user;
              return {
                data: {
                  ...res.data,
                  user: {
                    ...user,
                    id: user.id ?? user.userId ?? res.data.userId,
                    userId: user.userId ?? user.id ?? res.data.userId,
                    phone: user.phone ?? user.phoneNumber ?? user.mobileNumber ?? '',
                  },
                  userId: res.data.userId ?? user.userId ?? user.id,
                },
              };
            }

            // Case B: Express returned raw SQL recordset: { success: true, data: [ { StatusCode, StatusMessage, ... } ] }
            const recordset = res.data.data || res.data;
            const row = Array.isArray(recordset) ? recordset[0] : recordset;

            if (row) {
              // If sp_UserLogin returned an auth error (401 Bad Password, 404 User Not Found, 403 Deactivated, 423 Locked)
              if (row.StatusCode && row.StatusCode !== 200) {
                return {
                  error: {
                    status: row.StatusCode,
                    data: { message: row.StatusMessage || 'Authentication failed' },
                  },
                };
              }

              // If sp_UserLogin returned 200 Success
              const userId = row.UserID ?? row.UserId ?? row.userid;
              const phone = row.PhoneNumber ?? row.Phone ?? row.MobileNumber ?? '';
              if (row.StatusCode === 200 || row.Success === true || userId != null) {
                const user = {
                  id: userId,
                  userId,
                  name: row.FullName || 'User',
                  email: row.Email || email,
                  phone,
                  avatar: row.AvatarUrl || '',
                  profileCompletion: row.ProfileCompletionPercent || 100,
                  theme: row.ThemeMode || row.theme || 'light',
                  colorPreset: row.ColorPreset || row.colorPreset || 'indigo',
                  sidebarSkin: row.SidebarSkin || row.sidebarSkin || 'light',
                  emailNotifications: row.EmailNotifications ?? row.emailNotifications ?? true,
                  weeklyDigest: row.WeeklyDigest ?? row.weeklyDigest ?? true,
                  preferredLanguage: row.PreferredLanguage || row.preferredLanguage || 'en',
                };
                const token = row.Token || ('jwt.' + btoa(JSON.stringify(user)) + '.' + (row.RefreshToken || Date.now()));
                const refreshToken = row.RefreshToken || ('refresh-token-' + Math.random().toString(36).substring(2));
                return { data: { success: true, userId, user, token, refreshToken } };
              }
            }
          }

          // If Express returned an HTTP error (e.g. 400, 401, 500)
          if (res.error && res.error.status !== 'FETCH_ERROR') {
            return {
              error: {
                status: res.error.status,
                data: { message: res.error.data?.message || res.error.data?.StatusMessage || 'Invalid email or password' },
              },
            };
          }
        } catch {
          // If network exception occurred, proceed to fallback below
        }
      },
    }),

    // Register User API (Calls Express /NewUser -> sp_CreateUser with exact SP parameters)
    registerUser: builder.mutation({
      async queryFn(userData, _queryApi, _extraOptions, fetchWithBQ) {
        const { name, email, password, phone } = userData;
        const cleanEmail = (email || '').trim().toLowerCase();
        const userPassword = password || 'Nic@12345';

        // 1. Attempt call to real Express Backend: POST /NewUser
        try {
          const res = await fetchWithBQ({
            url: '/NewUser',
            method: 'POST',
            body: {
              // Exact parameter names defined in [User].[sp_CreateUser]
              FullName: (name || '').trim(),
              Email: cleanEmail,
              PasswordHash: userPassword,
              PhoneNumber: (phone || '').trim() || null,
            },
          });

          if (res.data) {
            if (res.data.token && res.data.user) {
              return { data: res.data };
            }

            const recordset = res.data.data || res.data;
            const row = Array.isArray(recordset) ? recordset[0] : recordset;

            if (row) {
              if (row.StatusCode && row.StatusCode !== 201) {
                return {
                  error: {
                    status: row.StatusCode,
                    data: { message: row.StatusMessage || 'Registration failed' },
                  },
                };
              }

              if (row.StatusCode === 201 || row.UserID) {
                const user = {
                  id: row.UserID || row.id,
                  name: row.FullName || name,
                  email: row.Email || cleanEmail,
                  phone: row.PhoneNumber || phone || '',
                };
                const token = row.Token || ('jwt.' + btoa(JSON.stringify(user)) + '.' + (row.UserID || Date.now()));
                const refreshToken = row.RefreshToken || ('refresh-' + Math.random().toString(36).substring(2));
                return {
                  data: {
                    success: true,
                    message: row.StatusMessage || 'Account registered successfully!',
                    user,
                    token,
                    refreshToken,
                  },
                };
              }
            }
          }

          if (res.error && res.error.status !== 'FETCH_ERROR') {
            return {
              error: {
                status: res.error.status,
                data: { message: res.error.data?.message || res.error.data?.StatusMessage || 'Registration failed' },
              },
            };
          }
        } catch {
          // If network exception occurred, proceed to fallback below
        }
      },
    }),

    updateProfile: builder.mutation({
      query: ({ name, email, phone, avatar, userId }) => ({
        url: '/UpdateProfile',
        method: 'POST',
        body: {
          UserID: userId,
          FullName: name,
          Email: email,
          PhoneNumber: phone,
          AvatarUrl: avatar,
          UpdatedBy: userId,
        },
      }),
    }),

    changePassword: builder.mutation({
      query: ({ newPassword, userId }) => ({
        url: '/ChangePassword',
        method: 'POST',
        body: { UserID: userId, PasswordHash: newPassword ,UpdatedBy: userId,},
      }),
    }),

    updatePreferences: builder.mutation({
      query: ({ theme, colorPreset, sidebarSkin, emailNotifications, weeklyDigest, preferredLanguage }) => ({
        url: '/UpdatePreferences',
        method: 'POST',
        body: {
          ThemeMode: theme,
          ColorPreset: colorPreset,
          SidebarSkin: sidebarSkin,
          EmailNotifications: emailNotifications,
          WeeklyDigest: weeklyDigest,
          PreferredLanguage: preferredLanguage,
        },
      }),
    }),

    // Forgot Password API (Calls Express /ForgotPassword -> sp_ForgotPassword with exact SP parameters)
    forgotPassword: builder.mutation({
      async queryFn({ email }, _queryApi, _extraOptions, fetchWithBQ) {
        const cleanEmail = (email || '').trim().toLowerCase();

        // 1. Attempt call to real Express Backend: POST /ForgotPassword
        try {
          const res = await fetchWithBQ({
            url: '/ForgotPassword',
            method: 'POST',
            body: {
              // Exact parameter name defined in [User].[sp_ForgotPassword]
              Email: cleanEmail,
              ExpiryMinutes: 30,
            },
          });

          if (res.data) {
            const recordset = res.data.data || res.data;
            const row = Array.isArray(recordset) ? recordset[0] : recordset;

            if (row) {
              if (row.StatusCode && row.StatusCode !== 200) {
                return {
                  error: {
                    status: row.StatusCode,
                    data: { message: row.StatusMessage || 'No registered user found with this email address.' },
                  },
                };
              }

              if (row.StatusCode === 200 || row.ResetToken || row.OTP) {
                return {
                  data: {
                    success: true,
                    message: row.StatusMessage || `A verification code has been generated for ${cleanEmail}.`,
                    otp: row.OTP || Math.floor(100000 + Math.random() * 900000).toString(),
                    resetToken: row.ResetToken || ('rst_' + Math.random().toString(36).substring(2)),
                    email: cleanEmail,
                  },
                };
              }
            }
          }

          if (res.error && res.error.status !== 'FETCH_ERROR') {
            return {
              error: {
                status: res.error.status,
                data: { message: res.error.data?.message || res.error.data?.StatusMessage || 'Unable to process request' },
              },
            };
          }
        } catch {
          // If network exception occurred, proceed to fallback below
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
    // api for get scheme by id (matches spMap getSchemeById)
    getSchemeById: builder.mutation({
      query: (data) => ({
        url: '/getSchemeById',
        method: 'POST',
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
  useRegisterUserMutation,
  useUpdateProfileMutation,
  useChangePasswordMutation,
  useUpdatePreferencesMutation,
  useForgotPasswordMutation,
  
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
