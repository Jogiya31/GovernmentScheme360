import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react';

const DEFAULT_USERS = [
  { id: 1, name: 'Hanna Alisha', email: 'hanna@gmail.com', role: 'Admin', status: 'Active', department: 'Technology' },
  { id: 2, name: 'Michael Ryan', email: 'michael@gmail.com', role: 'Manager', status: 'Active', department: 'Marketing' },
  { id: 3, name: 'Sophia Grace', email: 'sophia@gmail.com', role: 'Developer', status: 'Inactive', department: 'Technology' },
  { id: 4, name: 'David Miller', email: 'david@gmail.com', role: 'Support', status: 'Active', department: 'Customer Success' },
  { id: 5, name: 'Emma Wilson', email: 'emma@gmail.com', role: 'Designer', status: 'Active', department: 'Design' }
];

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

const saveStoredUsers = (users) => {
  localStorage.setItem('gov_scheme_users', JSON.stringify(users));
};

export const api = createApi({
  reducerPath: 'api',
  baseQuery: fakeBaseQuery(),
  tagTypes: ['Users'],
  endpoints: (builder) => ({
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
    addUser: builder.mutation({
      async queryFn(newUser) {
        try {
          const users = getStoredUsers();
          const added = { id: Date.now(), ...newUser };
          const updated = [...users, added];
          saveStoredUsers(updated);
          return { data: added };
        } catch (error) {
          return { error: { status: 'CUSTOM_ERROR', error: error.message } };
        }
      },
      invalidatesTags: ['Users'],
    }),
    updateUser: builder.mutation({
      async queryFn({ id, ...updatedData }) {
        try {
          const users = getStoredUsers();
          const updated = users.map(u => u.id === id ? { ...u, ...updatedData } : u);
          saveStoredUsers(updated);
          const updatedUser = updated.find(u => u.id === id);
          return { data: updatedUser };
        } catch (error) {
          return { error: { status: 'CUSTOM_ERROR', error: error.message } };
        }
      },
      invalidatesTags: ['Users'],
    }),
    deleteUser: builder.mutation({
      async queryFn(id) {
        try {
          const users = getStoredUsers();
          const updated = users.filter(u => u.id !== id);
          saveStoredUsers(updated);
          return { data: { success: true, id } };
        } catch (error) {
          return { error: { status: 'CUSTOM_ERROR', error: error.message } };
        }
      },
      invalidatesTags: ['Users'],
    }),
    login: builder.mutation({
      async queryFn(credentials) {
        try {
          const { email, password } = credentials;
          if (email === 'admin@gmail.com' && password === 'admin123') {
            const user = { id: 99, name: 'Jay Swar', email: 'jayswar311@gmail.com', role: 'Admin' };
            const token = 'jwt-token-header.' + btoa(JSON.stringify(user)) + '.signature';
            const refreshToken = 'refresh-token-' + Math.random().toString(36).substring(2);
            const data = { user, token, refreshToken };
            return { data };
          } else {
            return {
              error: {
                status: 400,
                data: { message: 'Invalid email or password. Use: admin@gmail.com / admin123' }
              }
            };
          }
        } catch (error) {
          return { error: { status: 'CUSTOM_ERROR', error: error.message } };
        }
      },
    }),
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
              { id: 1, title: 'Meeting with Stakeholders', desc: 'Discuss project delivery timelines', type: 'info', time: '09:30 AM' },
              { id: 2, title: 'Design system update approved', desc: 'New icons pack loaded into Figma', type: 'success', time: '11:00 AM' },
              { id: 3, title: 'High memory usage alert', desc: 'Server AWS-3 encountered spike', type: 'danger', time: '01:45 PM' },
              { id: 4, title: 'Invoice payment received', desc: 'Subscription payment from Client X', type: 'warning', time: '04:15 PM' }
            ],
            recentTransactions: [
              { id: 'TX-1002', item: 'Apex UI Pro license', buyer: 'Elite Dev Studio', amount: 399, status: 'Paid', date: '2026-07-19' },
              { id: 'TX-1003', item: 'AWS hosting cost', buyer: 'Server Cluster 4', amount: 148, status: 'Paid', date: '2026-07-18' },
              { id: 'TX-1004', item: 'Consulting services', buyer: 'Zenith Labs Corp', amount: 1500, status: 'Pending', date: '2026-07-18' },
              { id: 'TX-1005', item: 'UI/UX Redesign kit', buyer: 'AdminMart Premium', amount: 89, status: 'Failed', date: '2026-07-17' },
              { id: 'TX-1006', item: 'Bootstrap Pro upgrade', buyer: 'InnoTech Solutions', amount: 249, status: 'Paid', date: '2026-07-16' }
            ]
          };
          return { data: summary };
        } catch (error) {
          return { error: { status: 'CUSTOM_ERROR', error: error.message } };
        }
      },
      providesTags: ['Users'],
    }),
  }),
});

export const {
  useGetUsersQuery,
  useAddUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
  useLoginMutation,
  useGetDashboardSummaryQuery,
} = api;
