import { createSlice } from '@reduxjs/toolkit'

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    currentUser: null,
    role: null,
    ispOwnerId: null,
    resellerId: null,
    userData: null,
    isFetching: false,
    error: false,
    accessToken: null,
  },
  reducers: {
    logInStart: (state) => {
      state.isFetching = true
      state.error = false
    },
    logInSuccess: (state, action) => {
      const { user, token, ispOwner, manager, collector, reseller } = action.payload
      state.isFetching = false
      state.error = false
      state.currentUser = user
      state.role = user.role
      state.accessToken = token

      // Store token in localStorage
      localStorage.setItem('ispToken', token)

      // Set ispOwnerId based on role
      if (user.role === 'ispOwner') {
        state.ispOwnerId = ispOwner?._id || user._id
        state.userData = ispOwner
      } else if (user.role === 'manager') {
        state.ispOwnerId = manager?.ispOwner
        state.userData = manager
      } else if (user.role === 'collector') {
        state.ispOwnerId = collector?.ispOwner
        state.resellerId = collector?.reseller || null
        state.userData = collector
      } else if (user.role === 'reseller') {
        state.ispOwnerId = reseller?.ispOwner
        state.resellerId = reseller?._id
        state.userData = reseller
      } else if (user.role === 'admin' || user.role === 'superadmin') {
        state.ispOwnerId = null
        state.userData = user
      }
    },
    loginFailure: (state) => {
      state.isFetching = false
      state.error = true
    },
    logOut: (state) => {
      state.currentUser = null
      state.role = null
      state.ispOwnerId = null
      state.resellerId = null
      state.userData = null
      state.accessToken = null
      state.error = false
      state.isFetching = false
      localStorage.removeItem('ispToken')
    },
    updateProfile: (state, action) => {
      state.currentUser = { ...state.currentUser, ...action.payload }
    },
    updateUserData: (state, action) => {
      state.userData = { ...state.userData, ...action.payload }
    },
  },
})

export const { logInStart, logInSuccess, loginFailure, logOut, updateProfile, updateUserData } = authSlice.actions
export default authSlice.reducer
