import { createSlice } from '@reduxjs/toolkit';

const getInitialTheme = () => {
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme) return savedTheme;
  return 'light';
};

const themeSlice = createSlice({
  name: 'theme',
  initialState: {
    theme: getInitialTheme(),
  },
  reducers: {
    toggleTheme: (state) => {
      const nextTheme = state.theme === 'light' ? 'dark' : 'light';
      state.theme = nextTheme;
      localStorage.setItem('theme', nextTheme);
      document.documentElement.setAttribute('data-bs-theme', nextTheme);
      document.documentElement.setAttribute('data-theme', nextTheme);
      document.body.setAttribute('data-bs-theme', nextTheme);
      document.body.setAttribute('data-theme', nextTheme);
    },
    setTheme: (state, action) => {
      state.theme = action.payload;
      localStorage.setItem('theme', action.payload);
      document.documentElement.setAttribute('data-bs-theme', action.payload);
      document.documentElement.setAttribute('data-theme', action.payload);
      document.body.setAttribute('data-bs-theme', action.payload);
      document.body.setAttribute('data-theme', action.payload);
    },
    initTheme: (state) => {
      document.documentElement.setAttribute('data-bs-theme', state.theme);
      document.documentElement.setAttribute('data-theme', state.theme);
      document.body.setAttribute('data-bs-theme', state.theme);
      document.body.setAttribute('data-theme', state.theme);
    },
  },
});

export const { toggleTheme, setTheme, initTheme } = themeSlice.actions;
export default themeSlice.reducer;
