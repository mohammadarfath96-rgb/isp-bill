import React from 'react'

const DashboardCard = ({ title, value, icon, variant = 'primary', trend }) => {
  const bgStyles = {
    primary: { bg: 'rgba(13, 110, 253, 0.1)', color: '#0d6efd' },
    success: { bg: 'rgba(25, 135, 84, 0.1)', color: '#198754' },
    warning: { bg: 'rgba(255, 193, 7, 0.15)', color: '#d97706' },
    danger: { bg: 'rgba(220, 53, 69, 0.1)', color: '#dc3545' },
    info: { bg: 'rgba(13, 202, 240, 0.1)', color: '#0dcaf0' },
  }

  const currentStyle = bgStyles[variant] || bgStyles.primary

  return (
    <div className="stat-card">
      <div
        className="stat-icon"
        style={{ backgroundColor: currentStyle.bg, color: currentStyle.color }}
      >
        <span>{icon}</span>
      </div>
      <div className="stat-info">
        <h3>{value}</h3>
        <p>{title}</p>
        {trend && (
          <small className={trend.isPositive ? 'text-success' : 'text-danger'}>
            {trend.isPositive ? '↑' : '↓'} {trend.text}
          </small>
        )}
      </div>
    </div>
  )
}

export default DashboardCard
