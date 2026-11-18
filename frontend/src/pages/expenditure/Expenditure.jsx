import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { Table, Button, Modal, Form, Row, Col, Badge } from 'react-bootstrap'
import { toast } from 'react-toastify'
import apiLink from '../../api/apiLink'
import Loader from '../../components/common/Loader'
import ConfirmModal from '../../components/common/ConfirmModal'
import EmptyState from '../../components/common/EmptyState'
import { formatCurrency, formatDate } from '../../utils/helpers'
import { EXPENDITURE_CATEGORIES } from '../../utils/constants'

const Expenditure = () => {
  const { t } = useTranslation()
  const { ispOwnerId } = useSelector((s) => s.auth)

  const [expenditures, setExpenditures] = useState([])
  const [loading, setLoading] = useState(true)
  const [totalAmount, setTotalAmount] = useState(0)

  // Add Modal
  const [showModal, setShowModal] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    category: 'maintenance',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    note: '',
  })
  const [formLoading, setFormLoading] = useState(false)

  // Delete
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deletingId, setDeletingId] = useState(null)

  useEffect(() => {
    fetchExpenditures()
  }, [])

  const fetchExpenditures = async () => {
    setLoading(true)
    try {
      const res = await apiLink.get('/expenditure', { params: { ispOwner: ispOwnerId } })
      const list = res.data.expenditures || res.data || []
      setExpenditures(list)
      const total = list.reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0)
      setTotalAmount(total)
    } catch (err) {
      console.error('Failed to load expenditures', err)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.amount || Number(formData.amount) <= 0) {
      toast.error('Enter a valid amount')
      return
    }

    setFormLoading(true)
    try {
      await apiLink.post('/expenditure', {
        ...formData,
        amount: Number(formData.amount),
        ispOwner: ispOwnerId,
      })
      toast.success('Expenditure logged successfully!')
      setShowModal(false)
      setFormData({
        title: '',
        category: 'maintenance',
        amount: '',
        date: new Date().toISOString().split('T')[0],
        note: '',
      })
      fetchExpenditures()
    } catch (err) {
      toast.error('Failed to save expenditure')
    } finally {
      setFormLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!deletingId) return
    try {
      await apiLink.delete(`/expenditure/${deletingId}`)
      toast.success('Expenditure removed!')
      setShowDeleteModal(false)
      fetchExpenditures()
    } catch (err) {
      toast.error('Failed to delete expenditure')
    }
  }

  return (
    <div className="container-fluid p-0">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="fw-bold mb-0">💸 {t('expenditure')}</h4>
          <small className="text-muted">Total Expenses: {formatCurrency(totalAmount)}</small>
        </div>
        <Button variant="primary" onClick={() => setShowModal(true)}>
          + {t('addExpenditure')}
        </Button>
      </div>

      <div className="table-card">
        {loading ? (
          <Loader message="Loading expenses..." />
        ) : expenditures.length === 0 ? (
          <EmptyState
            icon="💸"
            title="No Expenditures Recorded"
            subtitle="Track overhead expenses, server rent, line repairs, and equipment costs."
            actionButton={
              <Button variant="primary" size="sm" onClick={() => setShowModal(true)}>
                + {t('addExpenditure')}
              </Button>
            }
          />
        ) : (
          <div className="table-responsive">
            <Table hover className="align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th>#</th>
                  <th>Title</th>
                  <th>{t('category')}</th>
                  <th>{t('amount')}</th>
                  <th>{t('date')}</th>
                  <th>{t('note')}</th>
                  <th className="text-end">{t('actions')}</th>
                </tr>
              </thead>
              <tbody>
                {expenditures.map((e, i) => (
                  <tr key={e._id}>
                    <td>{i + 1}</td>
                    <td className="fw-semibold">{e.title}</td>
                    <td>
                      <Badge bg="secondary" className="text-capitalize">
                        {e.category}
                      </Badge>
                    </td>
                    <td className="fw-bold text-danger">{formatCurrency(e.amount)}</td>
                    <td>{formatDate(e.date || e.createdAt)}</td>
                    <td className="text-muted small">{e.note || '-'}</td>
                    <td className="text-end">
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => {
                          setDeletingId(e._id)
                          setShowDeleteModal(true)
                        }}
                      >
                        🗑️
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        )}
      </div>

      {/* Add Expenditure Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered backdrop="static">
        <Modal.Header closeButton>
          <Modal.Title>{t('addExpenditure')}</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Expense Title *</Form.Label>
              <Form.Control
                type="text"
                placeholder="e.g. Fiber optical splice joint"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </Form.Group>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>{t('category')} *</Form.Label>
                  <Form.Select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  >
                    {EXPENDITURE_CATEGORIES.map((c) => (
                      <option key={c.value} value={c.value}>
                        {c.label}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>{t('amount')} (৳) *</Form.Label>
                  <Form.Control
                    type="number"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>{t('date')} *</Form.Label>
              <Form.Control
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>{t('note')}</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                placeholder="Optional details or vendor receipt number"
                value={formData.note}
                onChange={(e) => setFormData({ ...formData, note: e.target.value })}
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)} disabled={formLoading}>
              {t('cancel')}
            </Button>
            <Button variant="primary" type="submit" disabled={formLoading}>
              {formLoading ? 'Saving...' : t('save')}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmModal
        show={showDeleteModal}
        onHide={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        title={t('confirmDelete')}
        message="Are you sure you want to delete this expenditure record?"
      />
    </div>
  )
}

export default Expenditure
