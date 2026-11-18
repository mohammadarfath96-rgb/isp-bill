import React from 'react'
import { Spinner } from 'react-bootstrap'

const Loader = ({ message = 'Loading...', size = 'border', inline = false }) => {
  if (inline) {
    return (
      <div className="d-inline-flex align-items-center gap-2">
        <Spinner animation={size} size="sm" variant="primary" />
        {message && <span className="text-muted small">{message}</span>}
      </div>
    )
  }

  return (
    <div className="full-page-loader d-flex flex-column align-items-center justify-content-center p-5">
      <Spinner animation="border" variant="primary" style={{ width: '3rem', height: '3rem' }} />
      {message && <p className="mt-3 text-muted">{message}</p>}
    </div>
  )
}

export default Loader
