import { configureStore } from '@reduxjs/toolkit'
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import { combineReducers } from 'redux'
import authReducer from '../features/authSlice'
import customerReducer from '../features/customerSlice'
import packageReducer from '../features/packageSlice'
import invoiceReducer from '../features/invoiceSlice'
import areaReducer from '../features/areaSlice'
import resellerReducer from '../features/resellerSlice'
import collectorReducer from '../features/collectorSlice'
import managerReducer from '../features/managerSlice'
import staffReducer from '../features/staffSlice'
import expenditureReducer from '../features/expenditureSlice'
import mikrotikReducer from '../features/mikrotikSlice'
import dashboardReducer from '../features/dashboardSlice'
import uiReducer from '../features/uiSlice'

const authPersistConfig = {
  key: 'auth',
  storage,
  whitelist: ['currentUser', 'role', 'ispOwnerId', 'resellerId', 'userData', 'accessToken']
}

const rootReducer = combineReducers({
  auth: persistReducer(authPersistConfig, authReducer),
  customer: customerReducer,
  package: packageReducer,
  invoice: invoiceReducer,
  area: areaReducer,
  reseller: resellerReducer,
  collector: collectorReducer,
  manager: managerReducer,
  staff: staffReducer,
  expenditure: expenditureReducer,
  mikrotik: mikrotikReducer,
  dashboard: dashboardReducer,
  ui: uiReducer,
})

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
})

export const persistor = persistStore(store)
