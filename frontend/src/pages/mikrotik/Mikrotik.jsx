import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { Table, Button, Modal, Form, Row, Col, Badge } from 'react-bootstrap'
import { toast } from 'react-toastify'
import apiLink from '../../api/apiLink'
import Loader from '../../components/common/Loader'
import ConfirmModal from '../../components/common/ConfirmModal'
import EmptyState from '../../components/common/EmptyState'
import { MIKROTIK_TYPES } from '../../utils/constants'

const Mikrotik = () => {
  const { t } = useTranslation()
  const { ispOwnerId } = useSelector((s) => s.auth)

  const [routers, setRouters] = useState([])
  const [loading, setLoading] = useState(true)

  // Add/Edit Modal
  const [showModal, setShowModal] = useState(false)
  const [editingRouter, setEditingRouter] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    host: '',
    port: 8728,
    username: '',
    password: '',
    type: 'pppoe',
  })
  const [formLoading, setFormLoading] = useState(false)

  // Test Connection state
  const [testingId, setTestingId] = useState(null)

  // Delete Modal
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deletingId, setDeletingId] = useState(null)

  useEffect(() => {
    fetchRouters()
  }, [])

  const fetchRouters = async () => {
    setLoading(true)
    try {
      const res = await apiLink.get('/mikrotik', { params: { ispOwner: ispOwnerId } })
      setRouters(res.data.mikrotiks || res.data || [])
    } catch (err) {
      console.error('Failed to load MikroTik routers', err)
    } finally {
      setLoading(false)
    }
  }

  const handleOpenAdd = () => {
    setEditingRouter(null)
    setFormData({
      name: '',
      host: '',
      port: 8728,
      username: 'admin',
      password: '',
      type: 'pppoe',
    })
    setShowModal(true)
  }

  const handleOpenEdit = (router) => {
    setEditingRouter(router)
    setFormData({
      name: router.name || '',
      host: router.host || '',
      port: router.port || 8728,
      username: router.username || '',
      password: '',
      type: router.type || 'pppoe',
    })
    setShowModal(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setFormLoading(true)
    const payload = {
      ...formData,
      port: Number(formData.port),
      ispOwner: ispOwnerId,
    }

    try {
      if (editingRouter) {
        await apiLink.put(`/mikrotik/${editingRouter._id}`, payload)
        toast.success('MikroTik configuration updated!')
      } else {
        await apiLink.post('/mikrotik', payload)
        toast.success('MikroTik router added!')
      }
      setShowModal(false)
      fetchRouters()
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to save configuration'
      toast.error(msg)
    } finally {
      setFormLoading(false)
    }
  }

  const handleTestConnection = async (router) => {
    setTestingId(router._id)
    try {
      const res = await apiLink.post(`/mikrotik/${router._id}/test`)
      if (res.data?.success || res.status === 200) {
        toast.success(`Connected successfully to ${router.name} (${router.host})!`)
      } else {
        toast.warning(res.data?.message || 'Connection test returned a warning.')
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Connection test failed. Verify host and port.')
    } finally {
      setTestingId(null)
    }
  }

  const handleDelete = async () => {
    if (!deletingId) return
    try {
      await apiLink.delete(`/mikrotik/${deletingId}`)
      toast.success('Router deleted!')
      setShowDeleteModal(false)
      fetchRouters()
    } catch (err) {
      toast.error('Failed to delete router')
    }
  }

  return (
    <div className="container-fluid p-0">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="fw-bold mb-0">📶 {t('mikrotik')} Routers</h4>
        <Button variant="primary" onClick={handleOpenAdd}>
          + {t('addMikrotik')}
        </Button>
      </div>

      <div className="table-card">
        {loading ? (
          <Loader message="Loading MikroTik routers..." />
        ) : routers.length === 0 ? (
          <EmptyState
            icon="📶"
            title="No MikroTik Routers Configured"
            subtitle="Connect your MikroTik routers via RouterOS API for automated PPPoE client management."
            actionButton={
              <Button variant="primary" size="sm" onClick={handleOpenAdd}>
                + {t('addMikrotik')}
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
                  <th>{t('host')}</th>
                  <th>{t('port')}</th>
                  <th>{t('username')}</th>
                  <th>{t('type')}</th>
                  <th>API Connection</th>
                  <th className="text-end">{t('actions')}</th>
                </tr>
              </thead>
              <tbody>
                {routers.map((r, i) => (
                  <tr key={r._id}>
                    <td>{i + 1}</td>
                    <td className="fw-bold">{r.name}</td>
                    <td><code>{r.host}</code></td>
                    <td>{r.port || 8728}</td>
                    <td>{r.username}</td>
                    <td>
                      <Badge bg="secondary" className="text-uppercase">
                        {r.type}
                      </Badge>
                    </td>
                    <td>
                      <Button
                        variant="outline-info"
                        size="sm"
                        disabled={testingId === r._id}
                        onClick={() => handleTestConnection(r)}
                      >
                        {testingId === r._id ? 'Pinging...' : `⚡ ${t('testConnection')}`}
                      </Button>
                    </td>
                    <td className="text-end">
                      <div className="btn-group btn-group-sm">
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

      {/* Add / Edit MikroTik Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered backdrop="static">
        <Modal.Header closeButton>
          <Modal.Title>{editingRouter ? t('editMikrotik') : t('addMikrotik')}</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>{t('name')} *</Form.Label>
              <Form.Control
                type="text"
                placeholder="e.g. Core CCR1036 Router"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </Form.Group>

            <Row>
              <Col md={8}>
                <Form.Group className="mb-3">
                  <Form.Label>{t('host')} *</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="e.g. 192.168.88.1"
                    value={formData.host}
                    onChange={(e) => setFormData({ ...formData, host: e.target.value })}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>{t('port')} *</Form.Label>
                  <Form.Control
                    type="number"
                    value={formData.port}
                    onChange={(e) => setFormData({ ...formData, port: e.target.value })}
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
                    {t('password')} {editingRouter && '(Leave blank to keep)'}
                  </Form.Label>
                  <Form.Control
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required={!editingRouter}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>{t('type')}</Form.Label>
              <Form.Select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              >
                {MIKROTIK_TYPES.map((mt) => (
                  <option key={mt.value} value={mt.value}>
                    {mt.label}
                  </option>
                ))}
              </Form.Select>
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
        message="Are you sure you want to remove this MikroTik router connection?"
      />
    </div>
  )
}

export default Mikrotik
