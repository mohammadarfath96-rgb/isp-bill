import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { Table, Button, Modal, Form, Row, Col, Badge } from 'react-bootstrap'
import { toast } from 'react-toastify'
import apiLink from '../../api/apiLink'
import Loader from '../../components/common/Loader'
import ConfirmModal from '../../components/common/ConfirmModal'
import EmptyState from '../../components/common/EmptyState'
import { formatCurrency } from '../../utils/helpers'

const Reseller = () => {
  const { t } = useTranslation()
  const { ispOwnerId } = useSelector((s) => s.auth)

  const [resellers, setResellers] = useState([])
  const [loading, setLoading] = useState(true)

  // Add/Edit Modal
  const [showModal, setShowModal] = useState(false)
  const [editingReseller, setEditingReseller] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    password: '',
    phone: '',
    email: '',
    commissionRate: 10,
    address: '',
  })
  const [formLoading, setFormLoading] = useState(false)

  // Recharge Modal
  const [showRechargeModal, setShowRechargeModal] = useState(false)
  const [rechargeTarget, setRechargeTarget] = useState(null)
  const [rechargeAmount, setRechargeAmount] = useState('')
  const [rechargeLoading, setRechargeLoading] = useState(false)

  // Delete
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deletingId, setDeletingId] = useState(null)

  useEffect(() => {
    fetchResellers()
  }, [])

  const fetchResellers = async () => {
    setLoading(true)
    try {
      const res = await apiLink.get('/reseller', { params: { ispOwner: ispOwnerId } })
      setResellers(res.data.resellers || res.data || [])
    } catch (err) {
      console.error('Failed to load resellers', err)
    } finally {
      setLoading(false)
    }
  }

  const handleOpenAdd = () => {
    setEditingReseller(null)
    setFormData({
      name: '',
      username: '',
      password: '',
      phone: '',
      email: '',
      commissionRate: 10,
      address: '',
    })
    setShowModal(true)
  }

  const handleOpenEdit = (reseller) => {
    setEditingReseller(reseller)
    setFormData({
      name: reseller.name || '',
      username: reseller.user?.username || reseller.username || '',
      password: '',
      phone: reseller.phone || '',
      email: reseller.email || '',
      commissionRate: reseller.commissionRate || 10,
      address: reseller.address || '',
    })
    setShowModal(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setFormLoading(true)
    const payload = { ...formData, ispOwner: ispOwnerId }

    try {
      if (editingReseller) {
        await apiLink.put(`/reseller/${editingReseller._id}`, payload)
        toast.success('Reseller updated!')
      } else {
        await apiLink.post('/reseller', payload)
        toast.success('Reseller created!')
      }
      setShowModal(false)
      fetchResellers()
    } catch (err) {
      const msg = err.response?.data?.message || 'Action failed'
      toast.error(msg)
    } finally {
      setFormLoading(false)
    }
  }

  const handleOpenRecharge = (reseller) => {
    setRechargeTarget(reseller)
    setRechargeAmount('')
    setShowRechargeModal(true)
  }

  const handleRechargeSubmit = async (e) => {
    e.preventDefault()
    if (!rechargeAmount || Number(rechargeAmount) <= 0) {
      toast.error('Enter a valid amount')
      return
    }
    setRechargeLoading(true)
    try {
      await apiLink.post(`/reseller/${rechargeTarget._id}/recharge`, {
        amount: Number(rechargeAmount),
      })
      toast.success('Balance recharged successfully!')
      setShowRechargeModal(false)
      fetchResellers()
    } catch (err) {
      toast.error('Failed to recharge balance')
    } finally {
      setRechargeLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!deletingId) return
    try {
      await apiLink.delete(`/reseller/${deletingId}`)
      toast.success('Reseller deleted!')
      setShowDeleteModal(false)
      fetchResellers()
    } catch (err) {
      toast.error('Failed to delete reseller')
    }
  }

  return (
    <div className="container-fluid p-0">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="fw-bold mb-0">🔁 {t('reseller')} Management</h4>
        <Button variant="primary" onClick={handleOpenAdd}>
          + {t('addReseller')}
        </Button>
      </div>

      <div className="table-card">
        {loading ? (
          <Loader message="Loading resellers..." />
        ) : resellers.length === 0 ? (
          <EmptyState
            icon="🔁"
            title="No Resellers"
            subtitle="Delegate customer subscriptions through resellers."
            actionButton={
              <Button variant="primary" size="sm" onClick={handleOpenAdd}>
                + {t('addReseller')}
              </Button>
            }
          />
        ) : (
          <div className="table-responsive">
            <Table hover className="align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th>#</th>
                  <th>{t('name')}</th>
                  <th>{t('phone')}</th>
                  <th>{t('balance')}</th>
                  <th>{t('commission')}</th>
                  <th>{t('status')}</th>
                  <th className="text-end">{t('actions')}</th>
                </tr>
              </thead>
              <tbody>
                {resellers.map((r, i) => (
                  <tr key={r._id}>
                    <td>{i + 1}</td>
                    <td>
                      <div className="fw-bold">{r.name}</div>
                      <small className="text-muted">@{r.user?.username || r.username}</small>
                    </td>
                    <td>{r.phone}</td>
                    <td className="fw-bold text-success">{formatCurrency(r.balance || 0)}</td>
                    <td>{r.commissionRate}%</td>
                    <td>
                      <Badge bg={r.isActive !== false ? 'success' : 'secondary'}>
                        {r.isActive !== false ? 'Active' : 'Inactive'}
                      </Badge>
                    </td>
                    <td className="text-end">
                      <div className="btn-group btn-group-sm">
                        <Button
                          variant="outline-success"
                          title="Recharge Balance"
                          onClick={() => handleOpenRecharge(r)}
                        >
                          💳 {t('recharge')}
                        </Button>
                        <Button
                          variant="outline-primary"
                          title="Edit"
                          onClick={() => handleOpenEdit(r)}
                        >
                          ✏️
                        </Button>
                        <Button
                          variant="outline-danger"
                          title="Delete"
                          onClick={() => {
                            setDeletingId(r._id)
                            setShowDeleteModal(true)
                          }}
                        >
                          🗑️
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        )}
      </div>

      {/* Add / Edit Reseller Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg" centered backdrop="static">
        <Modal.Header closeButton>
          <Modal.Title>{editingReseller ? t('editReseller') : t('addReseller')}</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>{t('name')} *</Form.Label>
                  <Form.Control
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>{t('phone')} *</Form.Label>
                  <Form.Control
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>{t('username')} *</Form.Label>
                  <Form.Control
                    type="text"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>
                    {t('password')} {editingReseller && '(Leave blank to keep current)'}
                  </Form.Label>
                  <Form.Control
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required={!editingReseller}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>{t('email')}</Form.Label>
                  <Form.Control
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>{t('commission')} (%)</Form.Label>
                  <Form.Control
                    type="number"
                    value={formData.commissionRate}
                    onChange={(e) => setFormData({ ...formData, commissionRate: e.target.value })}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>{t('address')}</Form.Label>
              <Form.Control
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
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

      {/* Recharge Modal */}
      <Modal show={showRechargeModal} onHide={() => setShowRechargeModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Recharge Reseller Balance</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleRechargeSubmit}>
          <Modal.Body>
            <p>
              Recharging balance for <strong>{rechargeTarget?.name}</strong> (Current:{' '}
              {formatCurrency(rechargeTarget?.balance || 0)})
            </p>
            <Form.Group className="mb-3">
              <Form.Label>Recharge Amount (৳) *</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter amount"
                value={rechargeAmount}
                onChange={(e) => setRechargeAmount(e.target.value)}
                required
                min="1"
                autoFocus
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowRechargeModal(false)}>
              Cancel
            </Button>
            <Button variant="success" type="submit" disabled={rechargeLoading}>
              {rechargeLoading ? 'Recharging...' : 'Confirm Recharge'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* Delete Modal */}
      <ConfirmModal
        show={showDeleteModal}
        onHide={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        title={t('confirmDelete')}
        message="Are you sure you want to delete this reseller?"
      />
    </div>
  )
}

export default Reseller
