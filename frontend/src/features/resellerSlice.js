import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import apiLink from '../api/apiLink'

export const fetchResellers = createAsyncThunk('reseller/fetchAll', async (params, { rejectWithValue }) => {
  try {
    const response = await apiLink.get('/reseller', { params })
    return response.data
  } catch (err) { return rejectWithValue(err.response?.data || err.message) }
})
export const createReseller = createAsyncThunk('reseller/create', async (data, { rejectWithValue }) => {
  try {
    const response = await apiLink.post('/reseller', data)
    return response.data
  } catch (err) { return rejectWithValue(err.response?.data || err.message) }
})
export const updateReseller = createAsyncThunk('reseller/update', async ({ id, data }, { rejectWithValue }) => {
  try {
    const response = await apiLink.put(`/reseller/${id}`, data)
    return response.data
  } catch (err) { return rejectWithValue(err.response?.data || err.message) }
})
export const deleteReseller = createAsyncThunk('reseller/delete', async (id, { rejectWithValue }) => {
  try {
    await apiLink.delete(`/reseller/${id}`)
    return id
  } catch (err) { return rejectWithValue(err.response?.data || err.message) }
})
export const rechargeReseller = createAsyncThunk('reseller/recharge', async ({ id, data }, { rejectWithValue }) => {
  try {
    const response = await apiLink.post(`/reseller/${id}/recharge`, data)
    return response.data
  } catch (err) { return rejectWithValue(err.response?.data || err.message) }
})

const resellerSlice = createSlice({
  name: 'reseller',
  initialState: { resellers: [], isFetching: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchResellers.pending, (state) => { state.isFetching = true; state.error = null })
      .addCase(fetchResellers.fulfilled, (state, action) => {
        state.isFetching = false
        state.resellers = action.payload.resellers || action.payload.data || []
      })
      .addCase(fetchResellers.rejected, (state, action) => { state.isFetching = false; state.error = action.payload })
      .addCase(createReseller.fulfilled, (state, action) => {
        state.resellers.unshift(action.payload.reseller || action.payload)
      })
      .addCase(updateReseller.fulfilled, (state, action) => {
        const u = action.payload.reseller || action.payload
        state.resellers = state.resellers.map(r => r._id === u._id ? u : r)
      })
      .addCase(deleteReseller.fulfilled, (state, action) => {
        state.resellers = state.resellers.filter(r => r._id !== action.payload)
      })
      .addCase(rechargeReseller.fulfilled, (state, action) => {
        const u = action.payload.reseller || action.payload
        state.resellers = state.resellers.map(r => r._id === u._id ? u : r)
      })
  }
})

export default resellerSlice.reducer
