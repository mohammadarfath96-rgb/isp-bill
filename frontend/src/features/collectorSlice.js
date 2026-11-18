import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import apiLink from '../api/apiLink'

export const fetchCollectors = createAsyncThunk('collector/fetchAll', async (params, { rejectWithValue }) => {
  try {
    const response = await apiLink.get('/collector', { params })
    return response.data
  } catch (err) { return rejectWithValue(err.response?.data || err.message) }
})
export const createCollector = createAsyncThunk('collector/create', async (data, { rejectWithValue }) => {
  try {
    const response = await apiLink.post('/collector', data)
    return response.data
  } catch (err) { return rejectWithValue(err.response?.data || err.message) }
})
export const updateCollector = createAsyncThunk('collector/update', async ({ id, data }, { rejectWithValue }) => {
  try {
    const response = await apiLink.put(`/collector/${id}`, data)
    return response.data
  } catch (err) { return rejectWithValue(err.response?.data || err.message) }
})
export const deleteCollector = createAsyncThunk('collector/delete', async (id, { rejectWithValue }) => {
  try {
    await apiLink.delete(`/collector/${id}`)
    return id
  } catch (err) { return rejectWithValue(err.response?.data || err.message) }
})

const collectorSlice = createSlice({
  name: 'collector',
  initialState: { collectors: [], isFetching: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCollectors.pending, (state) => { state.isFetching = true; state.error = null })
      .addCase(fetchCollectors.fulfilled, (state, action) => {
        state.isFetching = false
        state.collectors = action.payload.collectors || action.payload.data || []
      })
      .addCase(fetchCollectors.rejected, (state, action) => { state.isFetching = false; state.error = action.payload })
      .addCase(createCollector.fulfilled, (state, action) => {
        state.collectors.unshift(action.payload.collector || action.payload)
      })
      .addCase(updateCollector.fulfilled, (state, action) => {
        const u = action.payload.collector || action.payload
        state.collectors = state.collectors.map(c => c._id === u._id ? u : c)
      })
      .addCase(deleteCollector.fulfilled, (state, action) => {
        state.collectors = state.collectors.filter(c => c._id !== action.payload)
      })
  }
})

export default collectorSlice.reducer
