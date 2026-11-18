import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import apiLink from '../api/apiLink'

export const fetchManagers = createAsyncThunk('manager/fetchAll', async (params, { rejectWithValue }) => {
  try {
    const response = await apiLink.get('/manager', { params })
    return response.data
  } catch (err) { return rejectWithValue(err.response?.data || err.message) }
})
export const createManager = createAsyncThunk('manager/create', async (data, { rejectWithValue }) => {
  try {
    const response = await apiLink.post('/manager', data)
    return response.data
  } catch (err) { return rejectWithValue(err.response?.data || err.message) }
})
export const updateManager = createAsyncThunk('manager/update', async ({ id, data }, { rejectWithValue }) => {
  try {
    const response = await apiLink.put(`/manager/${id}`, data)
    return response.data
  } catch (err) { return rejectWithValue(err.response?.data || err.message) }
})
export const deleteManager = createAsyncThunk('manager/delete', async (id, { rejectWithValue }) => {
  try {
    await apiLink.delete(`/manager/${id}`)
    return id
  } catch (err) { return rejectWithValue(err.response?.data || err.message) }
})

const managerSlice = createSlice({
  name: 'manager',
  initialState: { managers: [], isFetching: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchManagers.pending, (state) => { state.isFetching = true; state.error = null })
      .addCase(fetchManagers.fulfilled, (state, action) => {
        state.isFetching = false
        state.managers = action.payload.managers || action.payload.data || []
      })
      .addCase(fetchManagers.rejected, (state, action) => { state.isFetching = false; state.error = action.payload })
      .addCase(createManager.fulfilled, (state, action) => {
        state.managers.unshift(action.payload.manager || action.payload)
      })
      .addCase(updateManager.fulfilled, (state, action) => {
        const u = action.payload.manager || action.payload
        state.managers = state.managers.map(m => m._id === u._id ? u : m)
      })
      .addCase(deleteManager.fulfilled, (state, action) => {
        state.managers = state.managers.filter(m => m._id !== action.payload)
      })
  }
})

export default managerSlice.reducer
