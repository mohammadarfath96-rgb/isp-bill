import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import apiLink from '../api/apiLink'

export const fetchStaff = createAsyncThunk('staff/fetchAll', async (params, { rejectWithValue }) => {
  try {
    const response = await apiLink.get('/staff', { params })
    return response.data
  } catch (err) { return rejectWithValue(err.response?.data || err.message) }
})
export const createStaff = createAsyncThunk('staff/create', async (data, { rejectWithValue }) => {
  try {
    const response = await apiLink.post('/staff', data)
    return response.data
  } catch (err) { return rejectWithValue(err.response?.data || err.message) }
})
export const updateStaff = createAsyncThunk('staff/update', async ({ id, data }, { rejectWithValue }) => {
  try {
    const response = await apiLink.put(`/staff/${id}`, data)
    return response.data
  } catch (err) { return rejectWithValue(err.response?.data || err.message) }
})
export const deleteStaff = createAsyncThunk('staff/delete', async (id, { rejectWithValue }) => {
  try {
    await apiLink.delete(`/staff/${id}`)
    return id
  } catch (err) { return rejectWithValue(err.response?.data || err.message) }
})
export const payStaffSalary = createAsyncThunk('staff/paySalary', async ({ id, data }, { rejectWithValue }) => {
  try {
    const response = await apiLink.post(`/staff/${id}/salary`, data)
    return response.data
  } catch (err) { return rejectWithValue(err.response?.data || err.message) }
})

const staffSlice = createSlice({
  name: 'staff',
  initialState: { staffList: [], isFetching: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchStaff.pending, (state) => { state.isFetching = true; state.error = null })
      .addCase(fetchStaff.fulfilled, (state, action) => {
        state.isFetching = false
        state.staffList = action.payload.staff || action.payload.data || []
      })
      .addCase(fetchStaff.rejected, (state, action) => { state.isFetching = false; state.error = action.payload })
      .addCase(createStaff.fulfilled, (state, action) => {
        state.staffList.unshift(action.payload.staff || action.payload)
      })
      .addCase(updateStaff.fulfilled, (state, action) => {
        const u = action.payload.staff || action.payload
        state.staffList = state.staffList.map(s => s._id === u._id ? u : s)
      })
      .addCase(deleteStaff.fulfilled, (state, action) => {
        state.staffList = state.staffList.filter(s => s._id !== action.payload)
      })
  }
})

export default staffSlice.reducer
