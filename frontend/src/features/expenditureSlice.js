import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import apiLink from '../api/apiLink'

export const fetchExpenditures = createAsyncThunk('expenditure/fetchAll', async (params, { rejectWithValue }) => {
  try {
    const response = await apiLink.get('/expenditure', { params })
    return response.data
  } catch (err) { return rejectWithValue(err.response?.data || err.message) }
})
export const createExpenditure = createAsyncThunk('expenditure/create', async (data, { rejectWithValue }) => {
  try {
    const response = await apiLink.post('/expenditure', data)
    return response.data
  } catch (err) { return rejectWithValue(err.response?.data || err.message) }
})
export const updateExpenditure = createAsyncThunk('expenditure/update', async ({ id, data }, { rejectWithValue }) => {
  try {
    const response = await apiLink.put(`/expenditure/${id}`, data)
    return response.data
  } catch (err) { return rejectWithValue(err.response?.data || err.message) }
})
export const deleteExpenditure = createAsyncThunk('expenditure/delete', async (id, { rejectWithValue }) => {
  try {
    await apiLink.delete(`/expenditure/${id}`)
    return id
  } catch (err) { return rejectWithValue(err.response?.data || err.message) }
})

const expenditureSlice = createSlice({
  name: 'expenditure',
  initialState: { expenditures: [], isFetching: false, error: null, total: 0 },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchExpenditures.pending, (state) => { state.isFetching = true; state.error = null })
      .addCase(fetchExpenditures.fulfilled, (state, action) => {
        state.isFetching = false
        state.expenditures = action.payload.expenditures || action.payload.data || []
        state.total = action.payload.total || 0
      })
      .addCase(fetchExpenditures.rejected, (state, action) => { state.isFetching = false; state.error = action.payload })
      .addCase(createExpenditure.fulfilled, (state, action) => {
        state.expenditures.unshift(action.payload.expenditure || action.payload)
      })
      .addCase(updateExpenditure.fulfilled, (state, action) => {
        const u = action.payload.expenditure || action.payload
        state.expenditures = state.expenditures.map(e => e._id === u._id ? u : e)
      })
      .addCase(deleteExpenditure.fulfilled, (state, action) => {
        state.expenditures = state.expenditures.filter(e => e._id !== action.payload)
      })
  }
})

export default expenditureSlice.reducer
