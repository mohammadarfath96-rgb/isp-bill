import React from 'react'

const EmptyState = ({
  icon = '📭',
  title = 'No Data Available',
  subtitle = 'There are no records to display at this moment.',
  actionButton = null,
}) => {
  return (
    <div className="empty-state">
      <div className="empty-state-icon">{icon}</div>
      <h5 className="fw-semibold text-secondary">{title}</h5>
      <p className="text-muted small">{subtitle}</p>
      {actionButton && <div className="mt-3">{actionButton}</div>}
    </div>
  )
}

export default EmptyState
