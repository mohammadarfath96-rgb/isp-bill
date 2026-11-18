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

const Collector = () => {
  const { t } = useTranslation()
  const { ispOwnerId } = useSelector((s) => s.auth)

  const [collectors, setCollectors] = useState([])
  const [loading, setLoading] = useState(true)

  // Add/Edit Modal
  const [showModal, setShowModal] = useState(false)
  const [editingCollector, setEditingCollector] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    password: '',
    phone: '',
    address: '',
    salary: '',
    canCollect: true,
    canEdit: false,
  })
  const [formLoading, setFormLoading] = useState(false)

  // Delete
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deletingId, setDeletingId] = useState(null)

  useEffect(() => {
    fetchCollectors()
  }, [])

  const fetchCollectors = async () => {
    setLoading(true)
    try {
      const res = await apiLink.get('/collector', { params: { ispOwner: ispOwnerId } })
      setCollectors(res.data.collectors || res.data || [])
    } catch (err) {
      console.error('Failed to load collectors', err)
    } finally {
      setLoading(false)
    }
  }

  const handleOpenAdd = () => {
    setEditingCollector(null)
    setFormData({
      name: '',
      username: '',
      password: '',
      phone: '',
      address: '',
      salary: '',
      canCollect: true,
      canEdit: false,
    })
    setShowModal(true)
  }

  const handleOpenEdit = (col) => {
    setEditingCollector(col)
    setFormData({
      name: col.name || '',
      username: col.user?.username || col.username || '',
      password: '',
      phone: col.phone || '',
      address: col.address || '',
      salary: col.salary || '',
      canCollect: col.permissions?.canCollect ?? true,
      canEdit: col.permissions?.canEdit ?? false,
    })
    setShowModal(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setFormLoading(true)

    const payload = {
      name: formData.name,
      username: formData.username,
      password: formData.password || undefined,
      phone: formData.phone,
      address: formData.address,
      salary: Number(formData.salary) || 0,
      permissions: {
        canCollect: formData.canCollect,
        canEdit: formData.canEdit,
      },
      ispOwner: ispOwnerId,
    }

    try {
      if (editingCollector) {
        await apiLink.put(`/collector/${editingCollector._id}`, payload)
        toast.success('Collector updated successfully!')
      } else {
        await apiLink.post('/collector', payload)
        toast.success('Collector created successfully!')
      }
      setShowModal(false)
      fetchCollectors()
    } catch (err) {
      const msg = err.response?.data?.message || 'Operation failed'
      toast.error(msg)
    } finally {
      setFormLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!deletingId) return
    try {
      await apiLink.delete(`/collector/${deletingId}`)
      toast.success('Collector deleted!')
      setShowDeleteModal(false)
      fetchCollectors()
    } catch (err) {
      toast.error('Failed to delete collector')
    }
  }

  return (
    <div className="container-fluid p-0">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="fw-bold mb-0">👤 {t('collector')} Management</h4>
        <Button variant="primary" onClick={handleOpenAdd}>
          + {t('addCollector')}
        </Button>
      </div>

      <div className="table-card">
        {loading ? (
          <Loader message="Loading collectors..." />
        ) : collectors.length === 0 ? (
          <EmptyState
            icon="👤"
            title="No Collectors"
            subtitle="Add bill collection field agents."
            actionButton={
              <Button variant="primary" size="sm" onClick={handleOpenAdd}>
                + {t('addCollector')}
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
                  <th>{t('salary')}</th>
                  <th>{t('permissions')}</th>
                  <th>{t('status')}</th>
                  <th className="text-end">{t('actions')}</th>
                </tr>
              </thead>
              <tbody>
                {collectors.map((c, i) => (
                  <tr key={c._id}>
                    <td>{i + 1}</td>
                    <td>
                      <div className="fw-bold">{c.name}</div>
                      <small className="text-muted">@{c.user?.username || c.username}</small>
                    </td>
                    <td>{c.phone}</td>
                    <td>{formatCurrency(c.salary || 0)}</td>
                    <td>
                      {c.permissions?.canCollect && (
                        <Badge bg="success" className="me-1">
                          Collect
                        </Badge>
                      )}
                      {c.permissions?.canEdit && <Badge bg="info">Edit</Badge>}
                    </td>
                    <td>
                      <Badge bg={c.isActive !== false ? 'success' : 'secondary'}>
                        {c.isActive !== false ? 'Active' : 'Inactive'}
                      </Badge>
                    </td>
                    <td className="text-end">
                      <div className="btn-group btn-group-sm">
                        <Button
                          variant="outline-primary"
                          title="Edit"
                          onClick={() => handleOpenEdit(c)}
                        >
                          ✏️
                        </Button>
                        <Button
                          variant="outline-danger"
                          title="Delete"
                          onClick={() => {
                            setDeletingId(c._id)
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

      {/* Add / Edit Collector Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg" centered backdrop="static">
        <Modal.Header closeButton>
          <Modal.Title>{editingCollector ? t('editCollector') : t('addCollector')}</Modal.Title>
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
                    {t('password')} {editingCollector && '(Leave blank to keep)'}
                  </Form.Label>
                  <Form.Control
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required={!editingCollector}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>{t('salary')} (৳)</Form.Label>
                  <Form.Control
                    type="number"
                    value={formData.salary}
                    onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>{t('address')}</Form.Label>
                  <Form.Control
                    type="text"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  />
                </Form.Group>
              </Col>
            </Row>

            <div className="d-flex gap-4 mt-2">
              <Form.Check
                type="checkbox"
                id="canCollect"
                label="Can Collect Bill"
                checked={formData.canCollect}
                onChange={(e) => setFormData({ ...formData, canCollect: e.target.checked })}
              />
              <Form.Check
                type="checkbox"
                id="canEdit"
                label="Can Edit Customer"
                checked={formData.canEdit}
                onChange={(e) => setFormData({ ...formData, canEdit: e.target.checked })}
              />
            </div>
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
        message="Are you sure you want to delete this collector?"
      />
    </div>
  )
}

export default Collector
