import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { Table, Button, Modal, Form, Row, Col, Badge } from 'react-bootstrap'
import { toast } from 'react-toastify'
import apiLink from '../../api/apiLink'
import Loader from '../../components/common/Loader'
import ConfirmModal from '../../components/common/ConfirmModal'
import EmptyState from '../../components/common/EmptyState'
import { formatCurrency, getStatusBadge } from '../../utils/helpers'

const Package = () => {
  const { t } = useTranslation()
  const { ispOwnerId } = useSelector((s) => s.auth)

  const [packages, setPackages] = useState([])
  const [loading, setLoading] = useState(true)

  // Form Modal
  const [showModal, setShowModal] = useState(false)
  const [editingPackage, setEditingPackage] = useState(null)
  const [formLoading, setFormLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    type: 'pppoe',
    uploadSpeed: '',
    downloadSpeed: '',
    price: '',
    mikrotikProfile: '',
    description: '',
    isActive: true,
  })

  // Delete Modal
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deletingId, setDeletingId] = useState(null)

  useEffect(() => {
    fetchPackages()
  }, [])

  const fetchPackages = async () => {
    setLoading(true)
    try {
      const res = await apiLink.get('/package', { params: { ispOwner: ispOwnerId } })
      setPackages(res.data.packages || res.data || [])
    } catch (err) {
      console.error('Failed to load packages', err)
      toast.error('Failed to load packages')
    } finally {
      setLoading(false)
    }
  }

  const handleOpenAdd = () => {
    setEditingPackage(null)
    setFormData({
      name: '',
      type: 'pppoe',
      uploadSpeed: '',
      downloadSpeed: '',
      price: '',
      mikrotikProfile: '',
      description: '',
      isActive: true,
    })
    setShowModal(true)
  }

  const handleOpenEdit = (pkg) => {
    setEditingPackage(pkg)
    setFormData({
      name: pkg.name || '',
      type: pkg.type || 'pppoe',
      uploadSpeed: pkg.uploadSpeed || '',
      downloadSpeed: pkg.downloadSpeed || '',
      price: pkg.price || '',
      mikrotikProfile: pkg.mikrotikProfile || '',
      description: pkg.description || '',
      isActive: pkg.isActive ?? true,
    })
    setShowModal(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setFormLoading(true)

    const payload = {
      ...formData,
      price: Number(formData.price),
      ispOwner: ispOwnerId,
    }

    try {
      if (editingPackage) {
        await apiLink.put(`/package/${editingPackage._id}`, payload)
        toast.success('Package updated successfully!')
      } else {
        await apiLink.post('/package', payload)
        toast.success('Package created successfully!')
      }
      setShowModal(false)
      fetchPackages()
    } catch (err) {
      const msg = err.response?.data?.message || 'Operation failed'
      toast.error(msg)
    } finally {
      setFormLoading(false)
    }
  }

  const handleDeleteConfirm = async () => {
    if (!deletingId) return
    try {
      await apiLink.delete(`/package/${deletingId}`)
      toast.success('Package deleted successfully!')
      setShowDeleteModal(false)
      fetchPackages()
    } catch (err) {
      toast.error('Failed to delete package')
    }
  }

  return (
    <div className="container-fluid p-0">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="fw-bold mb-0">📦 {t('packages')}</h4>
        <Button variant="primary" onClick={handleOpenAdd}>
          + {t('addPackage')}
        </Button>
      </div>

      <div className="table-card">
        {loading ? (
          <Loader message="Loading packages..." />
        ) : packages.length === 0 ? (
          <EmptyState
            icon="📦"
            title="No Packages Available"
            subtitle="Define packages with upload/download speeds and pricing."
            actionButton={
              <Button variant="primary" size="sm" onClick={handleOpenAdd}>
                + {t('addPackage')}
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
                  <th>{t('type')}</th>
                  <th>{t('speed')} (↓ / ↑)</th>
                  <th>{t('price')}</th>
                  <th>Profile</th>
                  <th>{t('status')}</th>
                  <th className="text-end">{t('actions')}</th>
                </tr>
              </thead>
              <tbody>
                {packages.map((pkg, index) => (
                  <tr key={pkg._id}>
                    <td>{index + 1}</td>
                    <td className="fw-bold">{pkg.name}</td>
                    <td>
                      <Badge bg="secondary" className="text-uppercase">
                        {pkg.type || 'pppoe'}
                      </Badge>
                    </td>
                    <td>
                      {pkg.downloadSpeed} Mbps ↓ / {pkg.uploadSpeed || pkg.downloadSpeed} Mbps ↑
                    </td>
                    <td className="fw-bold text-primary">{formatCurrency(pkg.price)}</td>
                    <td>{pkg.mikrotikProfile || 'default'}</td>
                    <td>
                      <Badge bg={pkg.isActive ? 'success' : 'secondary'}>
                        {pkg.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </td>
                    <td className="text-end">
                      <div className="btn-group btn-group-sm">
                        <Button variant="outline-primary" onClick={() => handleOpenEdit(pkg)}>
                          ✏️ {t('edit')}
                        </Button>
                        <Button
                          variant="outline-danger"
                          onClick={() => {
                            setDeletingId(pkg._id)
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

      {/* Add / Edit Package Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered backdrop="static">
        <Modal.Header closeButton>
          <Modal.Title>{editingPackage ? t('editPackage') : t('addPackage')}</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>{t('name')} *</Form.Label>
              <Form.Control
                type="text"
                placeholder="e.g. Standard 10 Mbps"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </Form.Group>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>{t('type')}</Form.Label>
                  <Form.Select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  >
                    <option value="pppoe">PPPoE</option>
                    <option value="static">Static</option>
                    <option value="hotspot">Hotspot</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>{t('price')} (৳) *</Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="Monthly price"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>{t('downloadSpeed')} (Mbps) *</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="e.g. 10"
                    value={formData.downloadSpeed}
                    onChange={(e) => setFormData({ ...formData, downloadSpeed: e.target.value })}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>{t('uploadSpeed')} (Mbps)</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="e.g. 10"
                    value={formData.uploadSpeed}
                    onChange={(e) => setFormData({ ...formData, uploadSpeed: e.target.value })}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>{t('mikrotikProfile')}</Form.Label>
              <Form.Control
                type="text"
                placeholder="Profile name configured on MikroTik"
                value={formData.mikrotikProfile}
                onChange={(e) => setFormData({ ...formData, mikrotikProfile: e.target.value })}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>{t('description')}</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                placeholder="Description or features included"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
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
        onConfirm={handleDeleteConfirm}
        title={t('confirmDelete')}
        message="Are you sure you want to delete this package?"
      />
    </div>
  )
}

export default Package
