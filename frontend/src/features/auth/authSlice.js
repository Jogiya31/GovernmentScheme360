import { createSlice } from '@reduxjs/toolkit';

const getInitialAuth = () => {
  const savedUser = localStorage.getItem('user');
  const token = localStorage.getItem('token');
  const refreshToken = localStorage.getItem('refreshToken');
  
  return {
    user: savedUser ? JSON.parse(savedUser) : null,
    token: token || null,
    refreshToken: refreshToken || null,
    isAuthenticated: !!token,
  };
};

const authSlice = createSlice({
  name: 'auth',
  initialState: getInitialAuth(),
  reducers: {
    setCredentials: (state, action) => {
      const { user, token, refreshToken } = action.payload;
      state.user = user;
      state.token = token;
      state.refreshToken = refreshToken;
      state.isAuthenticated = !!token;
      
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('token', token);
      if (refreshToken) {
        localStorage.setItem('refreshToken', refreshToken);
      }
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
      
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
    },
    updateProfile: (state, action) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
        localStorage.setItem('user', JSON.stringify(state.user));
      }
    },
  },
});

export const { setCredentials, logout, updateProfile } = authSlice.actions;
export default authSlice.reducer;
