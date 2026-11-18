import React from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

const NotFound = () => {
  const { t } = useTranslation()

  return (
    <div
      className="d-flex flex-column align-items-center justify-content-center text-center"
      style={{ minHeight: '80vh' }}
    >
      <div style={{ fontSize: '5rem', fontWeight: 800, color: '#0d6efd', lineHeight: 1 }}>
        404
      </div>
      <h2 className="mt-3 mb-2">{t('notFound')}</h2>
      <p className="text-muted mb-4">{t('notFoundMessage')}</p>
      <Link to="/dashboard" className="btn btn-primary px-4 py-2">
        {t('backToDashboard')}
      </Link>
    </div>
  )
}

export default NotFound
