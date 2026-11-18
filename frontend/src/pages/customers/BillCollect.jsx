import React, { useState, useEffect } from 'react'
import { Modal, Button, Form, Row, Col } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import apiLink from '../../api/apiLink'
import { PAYMENT_METHODS } from '../../utils/constants'
import { formatCurrency } from '../../utils/helpers'

const BillCollect = ({ show, onHide, customer, onSuccess }) => {
  const { t } = useTranslation()
  const [amount, setAmount] = useState('')
  const [paymentMethod, setPaymentMethod] = useState('cash')
  const [note, setNote] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (customer) {
      // Pre-fill with due amount or monthly fee
      const dueAmount = customer.due > 0 ? customer.due : customer.monthlyFee || ''
      setAmount(dueAmount)
      setNote('')
    }
  }, [customer, show])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!amount || Number(amount) <= 0) {
      toast.error('Please enter a valid amount')
      return
    }

    setLoading(true)
    try {
      await apiLink.post(`/customer/${customer._id}/collect`, {
        amount: Number(amount),
        paymentMethod,
        note,
      })
      toast.success('Bill collected successfully!')
      onSuccess()
      onHide()
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to collect bill'
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  if (!customer) return null

  return (
    <Modal show={show} onHide={onHide} centered backdrop="static">
      <Modal.Header closeButton>
        <Modal.Title>💰 {t('collectBill')}</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          <div className="bg-light p-3 rounded-3 mb-3">
            <Row className="gy-2">
              <Col xs={6}>
                <small className="text-muted d-block">{t('customer')}</small>
                <strong>{customer.name}</strong>
              </Col>
              <Col xs={6}>
                <small className="text-muted d-block">{t('phone')}</small>
                <span>{customer.phone}</span>
              </Col>
              <Col xs={6}>
                <small className="text-muted d-block">{t('monthlyFee')}</small>
                <span className="text-primary fw-bold">
                  {formatCurrency(customer.monthlyFee)}
                </span>
              </Col>
              <Col xs={6}>
                <small className="text-muted d-block">{t('due')}</small>
                <span className="text-danger fw-bold">
                  {formatCurrency(customer.due || 0)}
                </span>
              </Col>
            </Row>
          </div>

          <Form.Group className="mb-3">
            <Form.Label>{t('amount')} (৳) *</Form.Label>
            <Form.Control
              type="number"
              placeholder="Enter collected amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
              min="1"
              autoFocus
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>{t('method')}</Form.Label>
            <Form.Select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
            >
              {PAYMENT_METHODS.map((pm) => (
                <option key={pm.value} value={pm.value}>
                  {pm.label}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>{t('note')}</Form.Label>
            <Form.Control
              as="textarea"
              rows={2}
              placeholder="Optional notes or transaction ID"
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onHide} disabled={loading}>
            {t('cancel')}
          </Button>
          <Button variant="success" type="submit" disabled={loading}>
            {loading ? 'Processing...' : `✓ ${t('collect')}`}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  )
}

export default BillCollect
