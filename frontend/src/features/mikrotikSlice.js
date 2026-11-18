import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import apiLink from '../api/apiLink'

export const fetchMikrotiks = createAsyncThunk('mikrotik/fetchAll', async (params, { rejectWithValue }) => {
  try {
    const response = await apiLink.get('/mikrotik', { params })
    return response.data
  } catch (err) { return rejectWithValue(err.response?.data || err.message) }
})
export const createMikrotik = createAsyncThunk('mikrotik/create', async (data, { rejectWithValue }) => {
  try {
    const response = await apiLink.post('/mikrotik', data)
    return response.data
  } catch (err) { return rejectWithValue(err.response?.data || err.message) }
})
export const updateMikrotik = createAsyncThunk('mikrotik/update', async ({ id, data }, { rejectWithValue }) => {
  try {
    const response = await apiLink.put(`/mikrotik/${id}`, data)
    return response.data
  } catch (err) { return rejectWithValue(err.response?.data || err.message) }
})
export const deleteMikrotik = createAsyncThunk('mikrotik/delete', async (id, { rejectWithValue }) => {
  try {
    await apiLink.delete(`/mikrotik/${id}`)
    return id
  } catch (err) { return rejectWithValue(err.response?.data || err.message) }
})
export const testMikrotikConnection = createAsyncThunk('mikrotik/testConnection', async (id, { rejectWithValue }) => {
  try {
    const response = await apiLink.post(`/mikrotik/${id}/test`)
    return response.data
  } catch (err) { return rejectWithValue(err.response?.data || err.message) }
})

const mikrotikSlice = createSlice({
  name: 'mikrotik',
  initialState: { mikrotiks: [], isFetching: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMikrotiks.pending, (state) => { state.isFetching = true; state.error = null })
      .addCase(fetchMikrotiks.fulfilled, (state, action) => {
        state.isFetching = false
        state.mikrotiks = action.payload.mikrotiks || action.payload.data || []
      })
      .addCase(fetchMikrotiks.rejected, (state, action) => { state.isFetching = false; state.error = action.payload })
      .addCase(createMikrotik.fulfilled, (state, action) => {
        state.mikrotiks.unshift(action.payload.mikrotik || action.payload)
      })
      .addCase(updateMikrotik.fulfilled, (state, action) => {
        const u = action.payload.mikrotik || action.payload
        state.mikrotiks = state.mikrotiks.map(m => m._id === u._id ? u : m)
      })
      .addCase(deleteMikrotik.fulfilled, (state, action) => {
        state.mikrotiks = state.mikrotiks.filter(m => m._id !== action.payload)
      })
  }
})

export default mikrotikSlice.reducer
