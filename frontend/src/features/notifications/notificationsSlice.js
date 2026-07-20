import { createSlice } from '@reduxjs/toolkit';

const DEFAULT_NOTIFICATIONS = [
  // { id: 1, type: 'info', message: 'Welcome to FreeDash Admin Dashboard template.', read: false, time: 'Just now' },
  // { id: 2, type: 'success', message: 'System updated to the latest version.', read: false, time: '2 mins ago' },
  // { id: 3, type: 'warning', message: 'New login attempt from location: Tokyo.', read: true, time: '1 hour ago' }
];

const getInitialNotifications = () => {
  const saved = localStorage.getItem('gov_scheme_notifications');
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch {
      return DEFAULT_NOTIFICATIONS;
    }
  }
  return DEFAULT_NOTIFICATIONS;
};

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState: {
    notifications: getInitialNotifications(),
    unreadCount: getInitialNotifications().filter(n => !n.read).length,
  },
  reducers: {
    markAllAsRead: (state) => {
      state.notifications = state.notifications.map((n) => ({ ...n, read: true }));
      state.unreadCount = 0;
      localStorage.setItem('gov_scheme_notifications', JSON.stringify(state.notifications));
    },
    markAsRead: (state, action) => {
      state.notifications = state.notifications.map((n) =>
        n.id === action.payload ? { ...n, read: true } : n
      );
      state.unreadCount = state.notifications.filter((n) => !n.read).length;
      localStorage.setItem('gov_scheme_notifications', JSON.stringify(state.notifications));
    },
    addNotification: (state, action) => {
      const newNotif = {
        id: Date.now(),
        read: false,
        time: 'Just now',
        ...action.payload,
      };
      state.notifications = [newNotif, ...state.notifications];
      state.unreadCount = state.notifications.filter((n) => !n.read).length;
      localStorage.setItem('gov_scheme_notifications', JSON.stringify(state.notifications));
    },
    clearNotifications: (state) => {
      state.notifications = [];
      state.unreadCount = 0;
      localStorage.setItem('gov_scheme_notifications', JSON.stringify([]));
    },
  },
});

export const { markAllAsRead, markAsRead, addNotification, clearNotifications } = notificationsSlice.actions;
export default notificationsSlice.reducer;
