import { createSlice } from '@reduxjs/toolkit';

const getInitialTheme = () => {
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme) return savedTheme;
  return 'light';
};

const getInitialColorPreset = () => {
  const savedPreset = localStorage.getItem('theme_preset');
  if (savedPreset) return savedPreset;
  return 'indigo';
};

const getInitialSidebarSkin = () => {
  const savedSkin = localStorage.getItem('theme_sidebar_skin');
  if (savedSkin) return savedSkin;
  return 'light';
};

const applyAllThemeAttributes = (theme, colorPreset, sidebarSkin) => {
  if (typeof document === 'undefined') return;

  // Set mode
  document.documentElement.setAttribute('data-bs-theme', theme);
  document.documentElement.setAttribute('data-theme', theme);
  document.body.setAttribute('data-bs-theme', theme);
  document.body.setAttribute('data-theme', theme);

  // Set color preset
  document.documentElement.setAttribute('data-theme-preset', colorPreset);
  document.body.setAttribute('data-theme-preset', colorPreset);

  // Set sidebar skin
  document.documentElement.setAttribute('data-sidebar-skin', sidebarSkin);
  document.body.setAttribute('data-sidebar-skin', sidebarSkin);

  // Sync with main-wrapper if mounted
  const mainWrapper = document.getElementById('main-wrapper');
  if (mainWrapper) {
    mainWrapper.setAttribute('data-bs-theme', theme);
    mainWrapper.setAttribute('data-theme', theme);
    mainWrapper.setAttribute('data-theme-preset', colorPreset);
    mainWrapper.setAttribute('data-sidebar-skin', sidebarSkin);
  }
};

const themeSlice = createSlice({
  name: 'theme',
  initialState: {
    theme: getInitialTheme(),
    colorPreset: getInitialColorPreset(),
    sidebarSkin: getInitialSidebarSkin(),
  },
  reducers: {
    toggleTheme: (state) => {
      const nextTheme = state.theme === 'light' ? 'dark' : 'light';
      state.theme = nextTheme;
      localStorage.setItem('theme', nextTheme);
      applyAllThemeAttributes(nextTheme, state.colorPreset, state.sidebarSkin);
    },
    setTheme: (state, action) => {
      state.theme = action.payload;
      localStorage.setItem('theme', action.payload);
      applyAllThemeAttributes(action.payload, state.colorPreset, state.sidebarSkin);
    },
    setColorPreset: (state, action) => {
      state.colorPreset = action.payload;
      localStorage.setItem('theme_preset', action.payload);
      applyAllThemeAttributes(state.theme, action.payload, state.sidebarSkin);
    },
    setSidebarSkin: (state, action) => {
      state.sidebarSkin = action.payload;
      localStorage.setItem('theme_sidebar_skin', action.payload);
      applyAllThemeAttributes(state.theme, state.colorPreset, action.payload);
    },
    resetThemeSettings: (state) => {
      state.theme = 'light';
      state.colorPreset = 'indigo';
      state.sidebarSkin = 'light';
      localStorage.setItem('theme', 'light');
      localStorage.setItem('theme_preset', 'indigo');
      localStorage.setItem('theme_sidebar_skin', 'light');
      applyAllThemeAttributes('light', 'indigo', 'light');
    },
    initTheme: (state) => {
      applyAllThemeAttributes(state.theme, state.colorPreset, state.sidebarSkin);
    },
  },
});

export const {
  toggleTheme,
  setTheme,
  setColorPreset,
  setSidebarSkin,
  resetThemeSettings,
  initTheme,
} = themeSlice.actions;

export default themeSlice.reducer;

