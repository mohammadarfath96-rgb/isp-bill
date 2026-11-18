import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import apiLink from '../api/apiLink'

export const fetchPackages = createAsyncThunk('package/fetchAll', async (params, { rejectWithValue }) => {
  try {
    const response = await apiLink.get('/package', { params })
    return response.data
  } catch (err) {
    return rejectWithValue(err.response?.data || err.message)
  }
})

export const createPackage = createAsyncThunk('package/create', async (data, { rejectWithValue }) => {
  try {
    const response = await apiLink.post('/package', data)
    return response.data
  } catch (err) {
    return rejectWithValue(err.response?.data || err.message)
  }
})

export const updatePackage = createAsyncThunk('package/update', async ({ id, data }, { rejectWithValue }) => {
  try {
    const response = await apiLink.put(`/package/${id}`, data)
    return response.data
  } catch (err) {
    return rejectWithValue(err.response?.data || err.message)
  }
})

export const deletePackage = createAsyncThunk('package/delete', async (id, { rejectWithValue }) => {
  try {
    await apiLink.delete(`/package/${id}`)
    return id
  } catch (err) {
    return rejectWithValue(err.response?.data || err.message)
  }
})

const packageSlice = createSlice({
  name: 'package',
  initialState: { packages: [], isFetching: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPackages.pending, (state) => { state.isFetching = true; state.error = null })
      .addCase(fetchPackages.fulfilled, (state, action) => {
        state.isFetching = false
        state.packages = action.payload.packages || action.payload.data || action.payload || []
      })
      .addCase(fetchPackages.rejected, (state, action) => { state.isFetching = false; state.error = action.payload })
      .addCase(createPackage.fulfilled, (state, action) => {
        const p = action.payload.package || action.payload
        state.packages.unshift(p)
      })
      .addCase(updatePackage.fulfilled, (state, action) => {
        const updated = action.payload.package || action.payload
        state.packages = state.packages.map(p => p._id === updated._id ? updated : p)
      })
      .addCase(deletePackage.fulfilled, (state, action) => {
        state.packages = state.packages.filter(p => p._id !== action.payload)
      })
  }
})

export default packageSlice.reducer
