import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import apiLink from '../api/apiLink'

// Areas
export const fetchAreas = createAsyncThunk('area/fetchAreas', async (params, { rejectWithValue }) => {
  try {
    const response = await apiLink.get('/area', { params })
    return response.data
  } catch (err) { return rejectWithValue(err.response?.data || err.message) }
})
export const createArea = createAsyncThunk('area/createArea', async (data, { rejectWithValue }) => {
  try {
    const response = await apiLink.post('/area', data)
    return response.data
  } catch (err) { return rejectWithValue(err.response?.data || err.message) }
})
export const updateArea = createAsyncThunk('area/updateArea', async ({ id, data }, { rejectWithValue }) => {
  try {
    const response = await apiLink.put(`/area/${id}`, data)
    return response.data
  } catch (err) { return rejectWithValue(err.response?.data || err.message) }
})
export const deleteArea = createAsyncThunk('area/deleteArea', async (id, { rejectWithValue }) => {
  try {
    await apiLink.delete(`/area/${id}`)
    return id
  } catch (err) { return rejectWithValue(err.response?.data || err.message) }
})

// Sub Areas
export const fetchSubAreas = createAsyncThunk('area/fetchSubAreas', async (params, { rejectWithValue }) => {
  try {
    const response = await apiLink.get('/subarea', { params })
    return response.data
  } catch (err) { return rejectWithValue(err.response?.data || err.message) }
})
export const createSubArea = createAsyncThunk('area/createSubArea', async (data, { rejectWithValue }) => {
  try {
    const response = await apiLink.post('/subarea', data)
    return response.data
  } catch (err) { return rejectWithValue(err.response?.data || err.message) }
})
export const updateSubArea = createAsyncThunk('area/updateSubArea', async ({ id, data }, { rejectWithValue }) => {
  try {
    const response = await apiLink.put(`/subarea/${id}`, data)
    return response.data
  } catch (err) { return rejectWithValue(err.response?.data || err.message) }
})
export const deleteSubArea = createAsyncThunk('area/deleteSubArea', async (id, { rejectWithValue }) => {
  try {
    await apiLink.delete(`/subarea/${id}`)
    return id
  } catch (err) { return rejectWithValue(err.response?.data || err.message) }
})

// Pole Boxes
export const fetchPoleBoxes = createAsyncThunk('area/fetchPoleBoxes', async (params, { rejectWithValue }) => {
  try {
    const response = await apiLink.get('/polebox', { params })
    return response.data
  } catch (err) { return rejectWithValue(err.response?.data || err.message) }
})
export const createPoleBox = createAsyncThunk('area/createPoleBox', async (data, { rejectWithValue }) => {
  try {
    const response = await apiLink.post('/polebox', data)
    return response.data
  } catch (err) { return rejectWithValue(err.response?.data || err.message) }
})
export const updatePoleBox = createAsyncThunk('area/updatePoleBox', async ({ id, data }, { rejectWithValue }) => {
  try {
    const response = await apiLink.put(`/polebox/${id}`, data)
    return response.data
  } catch (err) { return rejectWithValue(err.response?.data || err.message) }
})
export const deletePoleBox = createAsyncThunk('area/deletePoleBox', async (id, { rejectWithValue }) => {
  try {
    await apiLink.delete(`/polebox/${id}`)
    return id
  } catch (err) { return rejectWithValue(err.response?.data || err.message) }
})

const areaSlice = createSlice({
  name: 'area',
  initialState: { areas: [], subAreas: [], poleBoxes: [], isFetching: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Areas
      .addCase(fetchAreas.pending, (state) => { state.isFetching = true; state.error = null })
      .addCase(fetchAreas.fulfilled, (state, action) => {
        state.isFetching = false
        state.areas = action.payload.areas || action.payload.data || action.payload || []
      })
      .addCase(fetchAreas.rejected, (state, action) => { state.isFetching = false; state.error = action.payload })
      .addCase(createArea.fulfilled, (state, action) => {
        state.areas.unshift(action.payload.area || action.payload)
      })
      .addCase(updateArea.fulfilled, (state, action) => {
        const u = action.payload.area || action.payload
        state.areas = state.areas.map(a => a._id === u._id ? u : a)
      })
      .addCase(deleteArea.fulfilled, (state, action) => {
        state.areas = state.areas.filter(a => a._id !== action.payload)
      })
      // SubAreas
      .addCase(fetchSubAreas.fulfilled, (state, action) => {
        state.subAreas = action.payload.subAreas || action.payload.data || action.payload || []
      })
      .addCase(createSubArea.fulfilled, (state, action) => {
        state.subAreas.unshift(action.payload.subArea || action.payload)
      })
      .addCase(updateSubArea.fulfilled, (state, action) => {
        const u = action.payload.subArea || action.payload
        state.subAreas = state.subAreas.map(a => a._id === u._id ? u : a)
      })
      .addCase(deleteSubArea.fulfilled, (state, action) => {
        state.subAreas = state.subAreas.filter(a => a._id !== action.payload)
      })
      // PoleBoxes
      .addCase(fetchPoleBoxes.fulfilled, (state, action) => {
        state.poleBoxes = action.payload.poleBoxes || action.payload.data || action.payload || []
      })
      .addCase(createPoleBox.fulfilled, (state, action) => {
        state.poleBoxes.unshift(action.payload.poleBox || action.payload)
      })
      .addCase(updatePoleBox.fulfilled, (state, action) => {
        const u = action.payload.poleBox || action.payload
        state.poleBoxes = state.poleBoxes.map(a => a._id === u._id ? u : a)
      })
      .addCase(deletePoleBox.fulfilled, (state, action) => {
        state.poleBoxes = state.poleBoxes.filter(a => a._id !== action.payload)
      })
  }
})

export default areaSlice.reducer
