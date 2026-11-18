import React from 'react'
import { Outlet } from 'react-router-dom'
import { useSelector } from 'react-redux'
import Sidebar from './Sidebar'
import Header from './Header'

const Layout = () => {
  const { sidebarOpen } = useSelector((s) => s.ui)

  return (
    <div className="app-layout">
      <Sidebar />
      <div className={`main-content ${!sidebarOpen ? 'sidebar-collapsed' : ''}`}>
        <Header />
        <main className="page-content">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default Layout
