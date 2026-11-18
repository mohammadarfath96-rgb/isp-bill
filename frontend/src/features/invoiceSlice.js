import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import apiLink from '../api/apiLink'

export const fetchInvoices = createAsyncThunk('invoice/fetchAll', async (params, { rejectWithValue }) => {
  try {
    const response = await apiLink.get('/invoice', { params })
    return response.data
  } catch (err) {
    return rejectWithValue(err.response?.data || err.message)
  }
})

export const fetchInvoice = createAsyncThunk('invoice/fetchOne', async (id, { rejectWithValue }) => {
  try {
    const response = await apiLink.get(`/invoice/${id}`)
    return response.data
  } catch (err) {
    return rejectWithValue(err.response?.data || err.message)
  }
})

export const createInvoice = createAsyncThunk('invoice/create', async (data, { rejectWithValue }) => {
  try {
    const response = await apiLink.post('/invoice', data)
    return response.data
  } catch (err) {
    return rejectWithValue(err.response?.data || err.message)
  }
})

export const updateInvoice = createAsyncThunk('invoice/update', async ({ id, data }, { rejectWithValue }) => {
  try {
    const response = await apiLink.put(`/invoice/${id}`, data)
    return response.data
  } catch (err) {
    return rejectWithValue(err.response?.data || err.message)
  }
})

export const deleteInvoice = createAsyncThunk('invoice/delete', async (id, { rejectWithValue }) => {
  try {
    await apiLink.delete(`/invoice/${id}`)
    return id
  } catch (err) {
    return rejectWithValue(err.response?.data || err.message)
  }
})

const invoiceSlice = createSlice({
  name: 'invoice',
  initialState: { invoices: [], invoice: null, isFetching: false, error: null, total: 0 },
  reducers: { clearInvoice: (state) => { state.invoice = null } },
  extraReducers: (builder) => {
    builder
      .addCase(fetchInvoices.pending, (state) => { state.isFetching = true; state.error = null })
      .addCase(fetchInvoices.fulfilled, (state, action) => {
        state.isFetching = false
        state.invoices = action.payload.invoices || action.payload.data || []
        state.total = action.payload.total || 0
      })
      .addCase(fetchInvoices.rejected, (state, action) => { state.isFetching = false; state.error = action.payload })
      .addCase(fetchInvoice.fulfilled, (state, action) => {
        state.invoice = action.payload.invoice || action.payload
      })
      .addCase(createInvoice.fulfilled, (state, action) => {
        const inv = action.payload.invoice || action.payload
        state.invoices.unshift(inv)
        state.total += 1
      })
      .addCase(updateInvoice.fulfilled, (state, action) => {
        const updated = action.payload.invoice || action.payload
        state.invoices = state.invoices.map(i => i._id === updated._id ? updated : i)
      })
      .addCase(deleteInvoice.fulfilled, (state, action) => {
        state.invoices = state.invoices.filter(i => i._id !== action.payload)
        state.total -= 1
      })
  }
})

export const { clearInvoice } = invoiceSlice.actions
export default invoiceSlice.reducer
