import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import apiLink from '../api/apiLink'

export const fetchDashboard = createAsyncThunk('dashboard/fetch', async (params, { rejectWithValue }) => {
  try {
    const response = await apiLink.get('/dashboard', { params })
    return response.data
  } catch (err) {
    return rejectWithValue(err.response?.data || err.message)
  }
})

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState: { stats: null, chartData: null, recentInvoices: [], isFetching: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboard.pending, (state) => { state.isFetching = true; state.error = null })
      .addCase(fetchDashboard.fulfilled, (state, action) => {
        state.isFetching = false
        state.stats = action.payload.stats || action.payload
        state.chartData = action.payload.chartData || null
        state.recentInvoices = action.payload.recentInvoices || []
      })
      .addCase(fetchDashboard.rejected, (state, action) => { state.isFetching = false; state.error = action.payload })
  }
})

export default dashboardSlice.reducer
