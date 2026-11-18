import React from 'react'
import { Modal, Button } from 'react-bootstrap'

const ConfirmModal = ({
  show,
  onHide,
  onConfirm,
  title = 'Confirm Action',
  message = 'Are you sure you want to proceed?',
  confirmText = 'Delete',
  cancelText = 'Cancel',
  confirmVariant = 'danger',
  isLoading = false,
}) => {
  return (
    <Modal show={show} onHide={onHide} centered backdrop="static">
      <Modal.Header closeButton>
        <Modal.Title className="fs-5">{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p className="mb-0 text-secondary">{message}</p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide} disabled={isLoading}>
          {cancelText}
        </Button>
        <Button variant={confirmVariant} onClick={onConfirm} disabled={isLoading}>
          {isLoading ? 'Processing...' : confirmText}
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export default ConfirmModal
