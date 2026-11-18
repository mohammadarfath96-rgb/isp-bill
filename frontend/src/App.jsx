import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { ToastContainer } from 'react-toastify'

import Layout from './components/layout/Layout'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import Dashboard from './pages/dashboard/Dashboard'
import Customer from './pages/customers/Customer'
import CustomerProfile from './pages/customers/CustomerProfile'
import Package from './pages/packages/Package'
import Invoice from './pages/billing/Invoice'
import Area from './pages/area/Area'
import Reseller from './pages/reseller/Reseller'
import Collector from './pages/collector/Collector'
import Staff from './pages/staff/Staff'
import Expenditure from './pages/expenditure/Expenditure'
import Report from './pages/report/Report'
import Settings from './pages/settings/Settings'
import Mikrotik from './pages/mikrotik/Mikrotik'
import SupportTicket from './pages/support/SupportTicket'
import Profile from './pages/profile/Profile'
import NotFound from './pages/NotFound'

// Private route guard
const PrivateRoute = ({ children }) => {
  const { currentUser, accessToken } = useSelector((s) => s.auth)
  const token = accessToken || localStorage.getItem('ispToken')
  const isAuthenticated = !!(currentUser && token)

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return children
}

const App = () => {
  return (
    <BrowserRouter>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/"
          element={
            <PrivateRoute>
              <Layout />
            </PrivateRoute>
          }
        >
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="customers" element={<Customer />} />
          <Route path="customers/:id" element={<CustomerProfile />} />
          <Route path="packages" element={<Package />} />
          <Route path="billing" element={<Invoice />} />
          <Route path="area" element={<Area />} />
          <Route path="reseller" element={<Reseller />} />
          <Route path="collector" element={<Collector />} />
          <Route path="staff" element={<Staff />} />
          <Route path="expenditure" element={<Expenditure />} />
          <Route path="report" element={<Report />} />
          <Route path="settings" element={<Settings />} />
          <Route path="mikrotik" element={<Mikrotik />} />
          <Route path="support" element={<SupportTicket />} />
          <Route path="profile" element={<Profile />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
