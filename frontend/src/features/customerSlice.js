import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import apiLink from '../api/apiLink'

export const fetchCustomers = createAsyncThunk('customer/fetchAll', async (params, { rejectWithValue }) => {
  try {
    const response = await apiLink.get('/customer', { params })
    return response.data
  } catch (err) {
    return rejectWithValue(err.response?.data || err.message)
  }
})

export const fetchCustomer = createAsyncThunk('customer/fetchOne', async (id, { rejectWithValue }) => {
  try {
    const response = await apiLink.get(`/customer/${id}`)
    return response.data
  } catch (err) {
    return rejectWithValue(err.response?.data || err.message)
  }
})

export const createCustomer = createAsyncThunk('customer/create', async (data, { rejectWithValue }) => {
  try {
    const response = await apiLink.post('/customer', data)
    return response.data
  } catch (err) {
    return rejectWithValue(err.response?.data || err.message)
  }
})

export const updateCustomer = createAsyncThunk('customer/update', async ({ id, data }, { rejectWithValue }) => {
  try {
    const response = await apiLink.put(`/customer/${id}`, data)
    return response.data
  } catch (err) {
    return rejectWithValue(err.response?.data || err.message)
  }
})

export const deleteCustomer = createAsyncThunk('customer/delete', async (id, { rejectWithValue }) => {
  try {
    await apiLink.delete(`/customer/${id}`)
    return id
  } catch (err) {
    return rejectWithValue(err.response?.data || err.message)
  }
})

export const collectBill = createAsyncThunk('customer/collectBill', async ({ id, data }, { rejectWithValue }) => {
  try {
    const response = await apiLink.post(`/customer/${id}/collect`, data)
    return response.data
  } catch (err) {
    return rejectWithValue(err.response?.data || err.message)
  }
})

const customerSlice = createSlice({
  name: 'customer',
  initialState: {
    customers: [],
    customer: null,
    isFetching: false,
    error: null,
    total: 0,
    page: 1,
    totalPages: 1,
  },
  reducers: {
    clearCustomer: (state) => { state.customer = null },
    clearError: (state) => { state.error = null },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCustomers.pending, (state) => { state.isFetching = true; state.error = null })
      .addCase(fetchCustomers.fulfilled, (state, action) => {
        state.isFetching = false
        state.customers = action.payload.customers || action.payload.data || []
        state.total = action.payload.total || 0
        state.page = action.payload.page || 1
        state.totalPages = action.payload.totalPages || 1
      })
      .addCase(fetchCustomers.rejected, (state, action) => { state.isFetching = false; state.error = action.payload })

      .addCase(fetchCustomer.pending, (state) => { state.isFetching = true })
      .addCase(fetchCustomer.fulfilled, (state, action) => {
        state.isFetching = false
        state.customer = action.payload.customer || action.payload
      })
      .addCase(fetchCustomer.rejected, (state, action) => { state.isFetching = false; state.error = action.payload })

      .addCase(createCustomer.pending, (state) => { state.isFetching = true })
      .addCase(createCustomer.fulfilled, (state, action) => {
        state.isFetching = false
        const c = action.payload.customer || action.payload
        state.customers.unshift(c)
        state.total += 1
      })
      .addCase(createCustomer.rejected, (state, action) => { state.isFetching = false; state.error = action.payload })

      .addCase(updateCustomer.pending, (state) => { state.isFetching = true })
      .addCase(updateCustomer.fulfilled, (state, action) => {
        state.isFetching = false
        const updated = action.payload.customer || action.payload
        state.customers = state.customers.map(c => c._id === updated._id ? updated : c)
        if (state.customer?._id === updated._id) state.customer = updated
      })
      .addCase(updateCustomer.rejected, (state, action) => { state.isFetching = false; state.error = action.payload })

      .addCase(deleteCustomer.pending, (state) => { state.isFetching = true })
      .addCase(deleteCustomer.fulfilled, (state, action) => {
        state.isFetching = false
        state.customers = state.customers.filter(c => c._id !== action.payload)
        state.total -= 1
      })
      .addCase(deleteCustomer.rejected, (state, action) => { state.isFetching = false; state.error = action.payload })

      .addCase(collectBill.pending, (state) => { state.isFetching = true })
      .addCase(collectBill.fulfilled, (state, action) => {
        state.isFetching = false
        const updated = action.payload.customer || action.payload
        state.customers = state.customers.map(c => c._id === updated._id ? updated : c)
        if (state.customer?._id === updated._id) state.customer = updated
      })
      .addCase(collectBill.rejected, (state, action) => { state.isFetching = false; state.error = action.payload })
  }
})

export const { clearCustomer, clearError } = customerSlice.actions
export default customerSlice.reducer
