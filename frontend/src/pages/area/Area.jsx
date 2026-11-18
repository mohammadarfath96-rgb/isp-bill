import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { Table, Button, Tabs, Tab, Modal, Form, Badge } from 'react-bootstrap'
import { toast } from 'react-toastify'
import apiLink from '../../api/apiLink'
import Loader from '../../components/common/Loader'
import ConfirmModal from '../../components/common/ConfirmModal'
import EmptyState from '../../components/common/EmptyState'

const Area = () => {
  const { t } = useTranslation()
  const { ispOwnerId } = useSelector((s) => s.auth)

  const [activeTab, setActiveTab] = useState('areas')
  const [loading, setLoading] = useState(true)

  // Data
  const [areas, setAreas] = useState([])
  const [subAreas, setSubAreas] = useState([])
  const [poleBoxes, setPoleBoxes] = useState([])

  // Modal State
  const [modalType, setModalType] = useState(null) // 'area', 'subarea', 'polebox'
  const [editingItem, setEditingItem] = useState(null)
  const [modalTitle, setModalTitle] = useState('')
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    area: '',
    subArea: '',
  })
  const [formLoading, setFormLoading] = useState(false)

  // Delete State
  const [deleteTarget, setDeleteTarget] = useState(null) // { type, id }
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  useEffect(() => {
    fetchAll()
  }, [])

  const fetchAll = async () => {
    setLoading(true)
    try {
      const [areaRes, subRes, poleRes] = await Promise.all([
        apiLink.get('/area', { params: { ispOwner: ispOwnerId } }),
        apiLink.get('/subarea', { params: { ispOwner: ispOwnerId } }),
        apiLink.get('/polebox', { params: { ispOwner: ispOwnerId } }),
      ])
      setAreas(areaRes.data.areas || areaRes.data || [])
      setSubAreas(subRes.data.subAreas || subRes.data || [])
      setPoleBoxes(poleRes.data.poleBoxes || poleRes.data || [])
    } catch (err) {
      console.error('Failed to load area data', err)
    } finally {
      setLoading(false)
    }
  }

  // Open Add Modals
  const handleOpenAddArea = () => {
    setModalType('area')
    setEditingItem(null)
    setModalTitle(t('addArea'))
    setFormData({ name: '', description: '', area: '', subArea: '' })
  }

  const handleOpenAddSubArea = () => {
    setModalType('subarea')
    setEditingItem(null)
    setModalTitle(t('addSubArea'))
    setFormData({ name: '', description: '', area: areas[0]?._id || '', subArea: '' })
  }

  const handleOpenAddPoleBox = () => {
    setModalType('polebox')
    setEditingItem(null)
    setModalTitle(t('addPoleBox'))
    setFormData({ name: '', description: '', area: areas[0]?._id || '', subArea: '' })
  }

  // Open Edit Modals
  const handleOpenEdit = (type, item) => {
    setModalType(type)
    setEditingItem(item)
    setModalTitle(`Edit ${type.toUpperCase()}`)
    setFormData({
      name: item.name || '',
      description: item.description || '',
      area: item.area?._id || item.area || '',
      subArea: item.subArea?._id || item.subArea || '',
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setFormLoading(true)

    const endpoint = modalType === 'area' ? '/area' : modalType === 'subarea' ? '/subarea' : '/polebox'
    const payload = { ...formData, ispOwner: ispOwnerId }

    try {
      if (editingItem) {
        await apiLink.put(`${endpoint}/${editingItem._id}`, payload)
        toast.success('Updated successfully!')
      } else {
        await apiLink.post(endpoint, payload)
        toast.success('Created successfully!')
      }
      setModalType(null)
      fetchAll()
    } catch (err) {
      const msg = err.response?.data?.message || 'Operation failed'
      toast.error(msg)
    } finally {
      setFormLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    const endpoint =
      deleteTarget.type === 'area'
        ? '/area'
        : deleteTarget.type === 'subarea'
        ? '/subarea'
        : '/polebox'

    try {
      await apiLink.delete(`${endpoint}/${deleteTarget.id}`)
      toast.success('Deleted successfully!')
      setShowDeleteModal(false)
      fetchAll()
    } catch (err) {
      toast.error('Failed to delete item')
    }
  }

  return (
    <div className="container-fluid p-0">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="fw-bold mb-0">🗺️ {t('area')} Management</h4>
      </div>

      <div className="table-card p-3">
        <Tabs activeKey={activeTab} onSelect={(k) => setActiveTab(k)} className="mb-3">
          {/* Main Areas Tab */}
          <Tab eventKey="areas" title={`Area (${areas.length})`}>
            <div className="d-flex justify-content-end mb-3">
              <Button variant="primary" size="sm" onClick={handleOpenAddArea}>
                + {t('addArea')}
              </Button>
            </div>
            {loading ? (
              <Loader message="Loading areas..." />
            ) : areas.length === 0 ? (
              <EmptyState title="No Areas" subtitle="Add primary service areas." />
            ) : (
              <div className="table-responsive">
                <Table hover className="align-middle mb-0">
                  <thead className="table-light">
                    <tr>
                      <th>#</th>
                      <th>{t('name')}</th>
                      <th>{t('description')}</th>
                      <th className="text-end">{t('actions')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {areas.map((a, i) => (
                      <tr key={a._id}>
                        <td>{i + 1}</td>
                        <td className="fw-bold text-primary">{a.name}</td>
                        <td>{a.description || '-'}</td>
                        <td className="text-end">
                          <Button
                            variant="outline-primary"
                            size="sm"
                            className="me-2"
                            onClick={() => handleOpenEdit('area', a)}
                          >
                            ✏️
                          </Button>
                          <Button
                            variant="outline-danger"
                            size="sm"
                            onClick={() => {
                              setDeleteTarget({ type: 'area', id: a._id })
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
          </Tab>

          {/* Sub Areas Tab */}
          <Tab eventKey="subareas" title={`Sub Area (${subAreas.length})`}>
            <div className="d-flex justify-content-end mb-3">
              <Button variant="primary" size="sm" onClick={handleOpenAddSubArea}>
                + {t('addSubArea')}
              </Button>
            </div>
            {subAreas.length === 0 ? (
              <EmptyState title="No Sub Areas" subtitle="Add sub-divisions within an area." />
            ) : (
              <div className="table-responsive">
                <Table hover className="align-middle mb-0">
                  <thead className="table-light">
                    <tr>
                      <th>#</th>
                      <th>{t('subArea')}</th>
                      <th>{t('area')}</th>
                      <th>{t('description')}</th>
                      <th className="text-end">{t('actions')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {subAreas.map((sa, i) => (
                      <tr key={sa._id}>
                        <td>{i + 1}</td>
                        <td className="fw-bold">{sa.name}</td>
                        <td>
                          <Badge bg="info">{sa.area?.name || 'N/A'}</Badge>
                        </td>
                        <td>{sa.description || '-'}</td>
                        <td className="text-end">
                          <Button
                            variant="outline-primary"
                            size="sm"
                            className="me-2"
                            onClick={() => handleOpenEdit('subarea', sa)}
                          >
                            ✏️
                          </Button>
                          <Button
                            variant="outline-danger"
                            size="sm"
                            onClick={() => {
                              setDeleteTarget({ type: 'subarea', id: sa._id })
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
          </Tab>

          {/* Pole Boxes Tab */}
          <Tab eventKey="poleboxes" title={`Pole Box (${poleBoxes.length})`}>
            <div className="d-flex justify-content-end mb-3">
              <Button variant="primary" size="sm" onClick={handleOpenAddPoleBox}>
                + {t('addPoleBox')}
              </Button>
            </div>
            {poleBoxes.length === 0 ? (
              <EmptyState title="No Pole Boxes" subtitle="Add fiber distribution pole boxes." />
            ) : (
              <div className="table-responsive">
                <Table hover className="align-middle mb-0">
                  <thead className="table-light">
                    <tr>
                      <th>#</th>
                      <th>{t('poleBox')}</th>
                      <th>{t('area')}</th>
                      <th>{t('description')}</th>
                      <th className="text-end">{t('actions')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {poleBoxes.map((pb, i) => (
                      <tr key={pb._id}>
                        <td>{i + 1}</td>
                        <td className="fw-bold">{pb.name}</td>
                        <td>
                          <Badge bg="secondary">{pb.area?.name || 'N/A'}</Badge>
                        </td>
                        <td>{pb.description || '-'}</td>
                        <td className="text-end">
                          <Button
                            variant="outline-primary"
                            size="sm"
                            className="me-2"
                            onClick={() => handleOpenEdit('polebox', pb)}
                          >
                            ✏️
                          </Button>
                          <Button
                            variant="outline-danger"
                            size="sm"
                            onClick={() => {
                              setDeleteTarget({ type: 'polebox', id: pb._id })
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
          </Tab>
        </Tabs>
      </div>

      {/* Dynamic Modal for Area / SubArea / PoleBox */}
      <Modal show={!!modalType} onHide={() => setModalType(null)} centered backdrop="static">
        <Modal.Header closeButton>
          <Modal.Title>{modalTitle}</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>{t('name')} *</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </Form.Group>

            {(modalType === 'subarea' || modalType === 'polebox') && (
              <Form.Group className="mb-3">
                <Form.Label>{t('area')} *</Form.Label>
                <Form.Select
                  value={formData.area}
                  onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                  required
                >
                  <option value="">Select Area</option>
                  {areas.map((a) => (
                    <option key={a._id} value={a._id}>
                      {a.name}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            )}

            <Form.Group className="mb-3">
              <Form.Label>{t('description')}</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                placeholder="Optional description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setModalType(null)} disabled={formLoading}>
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
        message="Are you sure you want to delete this entry?"
      />
    </div>
  )
}

export default Area
