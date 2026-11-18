import { createSlice } from '@reduxjs/toolkit'

const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    sidebarOpen: true,
    theme: 'light',
    language: 'en',
  },
  reducers: {
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen
    },
    setSidebarOpen: (state, action) => {
      state.sidebarOpen = action.payload
    },
    setTheme: (state, action) => {
      state.theme = action.payload
      document.documentElement.setAttribute('data-theme', action.payload)
    },
    setLanguage: (state, action) => {
      state.language = action.payload
    },
  },
})

export const { toggleSidebar, setSidebarOpen, setTheme, setLanguage } = uiSlice.actions
export default uiSlice.reducer
