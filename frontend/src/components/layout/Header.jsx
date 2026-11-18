import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Dropdown } from 'react-bootstrap'
import { toggleSidebar, setTheme, setLanguage } from '../../features/uiSlice'
import { logOut } from '../../features/authSlice'
import { getInitials } from '../../utils/helpers'

const Header = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const { t, i18n } = useTranslation()

  const { currentUser, role, userData } = useSelector((s) => s.auth)
  const { theme, language } = useSelector((s) => s.ui)

  const handleToggleTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light'
    dispatch(setTheme(nextTheme))
  }

  const handleLanguageChange = (lang) => {
    dispatch(setLanguage(lang))
    i18n.changeLanguage(lang)
  }

  const handleLogout = () => {
    dispatch(logOut())
    navigate('/login')
  }

  // Determine active title based on path
  const getPageTitle = (path) => {
    if (path.includes('/customers/')) return t('customerProfile')
    if (path.includes('/customers')) return t('customers')
    if (path.includes('/packages')) return t('packages')
    if (path.includes('/billing')) return t('billing')
    if (path.includes('/area')) return t('area')
    if (path.includes('/reseller')) return t('reseller')
    if (path.includes('/collector')) return t('collector')
    if (path.includes('/staff')) return t('staff')
    if (path.includes('/expenditure')) return t('expenditure')
    if (path.includes('/mikrotik')) return t('mikrotik')
    if (path.includes('/report')) return t('reports')
    if (path.includes('/support')) return t('support')
    if (path.includes('/settings')) return t('settings')
    if (path.includes('/profile')) return t('profile')
    return t('dashboard')
  }

  const displayName = userData?.name || currentUser?.username || 'User'

  return (
    <header className="app-header">
      <div className="header-left">
        <button
          className="btn btn-light btn-sm d-flex align-items-center justify-content-center"
          style={{ width: 36, height: 36 }}
          onClick={() => dispatch(toggleSidebar())}
          title="Toggle Navigation"
        >
          ☰
        </button>
        <h1 className="page-title">{getPageTitle(location.pathname)}</h1>
      </div>

      <div className="header-right">
        {/* Language selector */}
        <div className="btn-group btn-group-sm" role="group">
          <button
            type="button"
            className={`btn ${language === 'en' ? 'btn-primary' : 'btn-outline-secondary'}`}
            onClick={() => handleLanguageChange('en')}
          >
            EN
          </button>
          <button
            type="button"
            className={`btn ${language === 'bn' ? 'btn-primary' : 'btn-outline-secondary'}`}
            onClick={() => handleLanguageChange('bn')}
          >
            বাংলা
          </button>
        </div>

        {/* Theme toggle */}
        <button
          className="btn btn-outline-secondary btn-sm"
          onClick={handleToggleTheme}
          title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
        >
          {theme === 'light' ? '🌙' : '☀️'}
        </button>

        {/* User profile dropdown */}
        <Dropdown align="end">
          <Dropdown.Toggle as="div" className="user-dropdown-btn">
            <div
              style={{
                width: 28,
                height: 28,
                borderRadius: '50%',
                background: '#0d6efd',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 600,
                fontSize: '0.8rem',
              }}
            >
              {getInitials(displayName)}
            </div>
            <span className="d-none d-sm-inline fw-medium">{displayName}</span>
          </Dropdown.Toggle>

          <Dropdown.Menu>
            <Dropdown.Header>
              <div className="fw-semibold">{displayName}</div>
              <small className="text-muted text-capitalize">{role || 'user'}</small>
            </Dropdown.Header>
            <Dropdown.Divider />
            <Dropdown.Item onClick={() => navigate('/profile')}>
              👤 {t('profile')}
            </Dropdown.Item>
            <Dropdown.Item onClick={() => navigate('/settings')}>
              ⚙️ {t('settings')}
            </Dropdown.Item>
            <Dropdown.Divider />
            <Dropdown.Item onClick={handleLogout} className="text-danger">
              🚪 {t('logout')}
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </div>
    </header>
  )
}

export default Header
