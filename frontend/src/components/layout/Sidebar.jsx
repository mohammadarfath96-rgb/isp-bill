import React from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { logOut } from '../../features/authSlice'
import { toggleSidebar } from '../../features/uiSlice'
import { getInitials } from '../../utils/helpers'

const Sidebar = () => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { currentUser, role, userData } = useSelector((s) => s.auth)
  const { sidebarOpen } = useSelector((s) => s.ui)

  const handleLogout = () => {
    dispatch(logOut())
    navigate('/login')
  }

  // Navigation Items
  const navItems = [
    { to: '/dashboard', label: t('dashboard'), icon: '📊', roles: ['superadmin', 'admin', 'ispOwner', 'manager', 'collector', 'reseller'] },
    { to: '/customers', label: t('customers'), icon: '👥', roles: ['superadmin', 'admin', 'ispOwner', 'manager', 'collector', 'reseller'] },
    { to: '/packages', label: t('packages'), icon: '📦', roles: ['superadmin', 'admin', 'ispOwner', 'manager'] },
    { to: '/billing', label: t('billing'), icon: '💰', roles: ['superadmin', 'admin', 'ispOwner', 'manager', 'collector', 'reseller'] },
    { to: '/area', label: t('area'), icon: '🗺️', roles: ['superadmin', 'admin', 'ispOwner', 'manager'] },
    { to: '/reseller', label: t('reseller'), icon: '🔁', roles: ['superadmin', 'admin', 'ispOwner'] },
    { to: '/collector', label: t('collector'), icon: '👤', roles: ['superadmin', 'admin', 'ispOwner', 'reseller'] },
    { to: '/staff', label: t('staff'), icon: '👨‍💼', roles: ['superadmin', 'admin', 'ispOwner', 'manager'] },
    { to: '/expenditure', label: t('expenditure'), icon: '💸', roles: ['superadmin', 'admin', 'ispOwner', 'manager'] },
    { to: '/mikrotik', label: t('mikrotik'), icon: '📶', roles: ['superadmin', 'admin', 'ispOwner'] },
    { to: '/report', label: t('reports'), icon: '📋', roles: ['superadmin', 'admin', 'ispOwner', 'manager'] },
    { to: '/support', label: t('support'), icon: '🎫', roles: ['superadmin', 'admin', 'ispOwner', 'manager', 'collector', 'reseller'] },
    { to: '/settings', label: t('settings'), icon: '⚙️', roles: ['superadmin', 'admin', 'ispOwner'] },
  ]

  const userRole = role || currentUser?.role || 'ispOwner'
  const allowedNav = navItems.filter((item) => item.roles.includes(userRole))
  const displayName = userData?.name || currentUser?.username || 'User'

  return (
    <>
      <div
        className={`sidebar-overlay ${sidebarOpen ? 'active' : ''}`}
        onClick={() => dispatch(toggleSidebar())}
      />
      <aside className={`sidebar ${!sidebarOpen ? 'collapsed' : ''}`}>
        <div className="sidebar-logo">
          <div
            style={{
              width: 32,
              height: 32,
              background: '#0d6efd',
              borderRadius: 8,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.2rem',
            }}
          >
            ⚡
          </div>
          <h5>ISP Billing</h5>
        </div>

        <nav className="sidebar-nav">
          <div className="nav-section-label">Main Menu</div>
          {allowedNav.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `nav-item-link ${isActive ? 'active' : ''}`
              }
            >
              <span className="nav-icon">{item.icon}</span>
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="sidebar-user">
            <div className="sidebar-avatar">{getInitials(displayName)}</div>
            <div className="sidebar-user-info">
              <div className="sidebar-user-name" title={displayName}>
                {displayName}
              </div>
              <div className="sidebar-user-role">{userRole}</div>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="btn btn-outline-danger btn-sm w-100 d-flex align-items-center justify-content-center gap-2"
          >
            <span>🚪</span>
            <span>{t('logout')}</span>
          </button>
        </div>
      </aside>
    </>
  )
}

export default Sidebar
