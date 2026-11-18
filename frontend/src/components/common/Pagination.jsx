import React from 'react'
import { Pagination as BSPagination } from 'react-bootstrap'

const Pagination = ({ currentPage = 1, totalPages = 1, onPageChange }) => {
  if (totalPages <= 1) return null

  let items = []
  const startPage = Math.max(1, currentPage - 2)
  const endPage = Math.min(totalPages, currentPage + 2)

  if (startPage > 1) {
    items.push(
      <BSPagination.Item key={1} onClick={() => onPageChange(1)}>
        1
      </BSPagination.Item>
    )
    if (startPage > 2) {
      items.push(<BSPagination.Ellipsis key="start-ellipsis" disabled />)
    }
  }

  for (let page = startPage; page <= endPage; page++) {
    items.push(
      <BSPagination.Item
        key={page}
        active={page === currentPage}
        onClick={() => onPageChange(page)}
      >
        {page}
      </BSPagination.Item>
    )
  }

  if (endPage < totalPages) {
    if (endPage < totalPages - 1) {
      items.push(<BSPagination.Ellipsis key="end-ellipsis" disabled />)
    }
    items.push(
      <BSPagination.Item key={totalPages} onClick={() => onPageChange(totalPages)}>
        {totalPages}
      </BSPagination.Item>
    )
  }

  return (
    <div className="d-flex justify-content-end mt-3">
      <BSPagination>
        <BSPagination.Prev
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
        />
        {items}
        <BSPagination.Next
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
        />
      </BSPagination>
    </div>
  )
}

export default Pagination
