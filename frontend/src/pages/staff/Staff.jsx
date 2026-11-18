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

const Staff = () => {
  const { t } = useTranslation()
  const { ispOwnerId } = useSelector((s) => s.auth)

  const [staffList, setStaffList] = useState([])
  const [loading, setLoading] = useState(true)

  // Add/Edit Modal
  const [showModal, setShowModal] = useState(false)
  const [editingStaff, setEditingStaff] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    designation: '',
    salary: '',
    address: '',
    nid: '',
    joiningDate: '',
  })
  const [formLoading, setFormLoading] = useState(false)

  // Salary Modal
  const [showSalaryModal, setShowSalaryModal] = useState(false)
  const [salaryTarget, setSalaryTarget] = useState(null)
  const [salaryAmount, setSalaryAmount] = useState('')
  const [salaryMonth, setSalaryMonth] = useState(new Date().getMonth() + 1)
  const [salaryYear, setSalaryYear] = useState(new Date().getFullYear())
  const [salaryLoading, setSalaryLoading] = useState(false)

  // Delete Modal
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deletingId, setDeletingId] = useState(null)

  useEffect(() => {
    fetchStaff()
  }, [])

  const fetchStaff = async () => {
    setLoading(true)
    try {
      const res = await apiLink.get('/staff', { params: { ispOwner: ispOwnerId } })
      setStaffList(res.data.staff || res.data || [])
    } catch (err) {
      console.error('Failed to load staff', err)
    } finally {
      setLoading(false)
    }
  }

  const handleOpenAdd = () => {
    setEditingStaff(null)
    setFormData({
      name: '',
      phone: '',
      email: '',
      designation: 'Line Man / Technician',
      salary: '',
      address: '',
      nid: '',
      joiningDate: new Date().toISOString().split('T')[0],
    })
    setShowModal(true)
  }

  const handleOpenEdit = (st) => {
    setEditingStaff(st)
    setFormData({
      name: st.name || '',
      phone: st.phone || '',
      email: st.email || '',
      designation: st.designation || '',
      salary: st.salary || '',
      address: st.address || '',
      nid: st.nid || '',
      joiningDate: st.joiningDate ? st.joiningDate.split('T')[0] : '',
    })
    setShowModal(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setFormLoading(true)
    const payload = {
      ...formData,
      salary: Number(formData.salary) || 0,
      ispOwner: ispOwnerId,
    }

    try {
      if (editingStaff) {
        await apiLink.put(`/staff/${editingStaff._id}`, payload)
        toast.success('Staff updated!')
      } else {
        await apiLink.post('/staff', payload)
        toast.success('Staff created!')
      }
      setShowModal(false)
      fetchStaff()
    } catch (err) {
      const msg = err.response?.data?.message || 'Operation failed'
      toast.error(msg)
    } finally {
      setFormLoading(false)
    }
  }

  const handleOpenSalary = (st) => {
    setSalaryTarget(st)
    setSalaryAmount(st.salary || '')
    setShowSalaryModal(true)
  }

  const handleSalarySubmit = async (e) => {
    e.preventDefault()
    if (!salaryAmount || Number(salaryAmount) <= 0) {
      toast.error('Enter a valid salary amount')
      return
    }
    setSalaryLoading(true)
    try {
      await apiLink.post(`/staff/${salaryTarget._id}/salary`, {
        amount: Number(salaryAmount),
        month: salaryMonth,
        year: salaryYear,
      })
      toast.success('Salary recorded as expenditure successfully!')
      setShowSalaryModal(false)
      fetchStaff()
    } catch (err) {
      toast.error('Failed to disburse salary')
    } finally {
      setSalaryLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!deletingId) return
    try {
      await apiLink.delete(`/staff/${deletingId}`)
      toast.success('Staff deleted!')
      setShowDeleteModal(false)
      fetchStaff()
    } catch (err) {
      toast.error('Failed to delete staff')
    }
  }

  return (
    <div className="container-fluid p-0">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="fw-bold mb-0">👨‍💼 {t('staff')} Management</h4>
        <Button variant="primary" onClick={handleOpenAdd}>
          + {t('addStaff')}
        </Button>
      </div>

      <div className="table-card">
        {loading ? (
          <Loader message="Loading staff..." />
        ) : staffList.length === 0 ? (
          <EmptyState
            icon="👨‍💼"
            title="No Staff"
            subtitle="Record technicians, line men, and office employees."
            actionButton={
              <Button variant="primary" size="sm" onClick={handleOpenAdd}>
                + {t('addStaff')}
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
                  <th>Designation</th>
                  <th>{t('phone')}</th>
                  <th>{t('salary')}</th>
                  <th>Joining Date</th>
                  <th>{t('status')}</th>
                  <th className="text-end">{t('actions')}</th>
                </tr>
              </thead>
              <tbody>
                {staffList.map((st, i) => (
                  <tr key={st._id}>
                    <td>{i + 1}</td>
                    <td className="fw-bold">{st.name}</td>
                    <td>{st.designation || 'Staff'}</td>
                    <td>{st.phone}</td>
                    <td className="fw-bold text-primary">{formatCurrency(st.salary || 0)}</td>
                    <td>{formatDate(st.joiningDate)}</td>
                    <td>
                      <Badge bg={st.isActive !== false ? 'success' : 'secondary'}>
                        {st.isActive !== false ? 'Active' : 'Inactive'}
                      </Badge>
                    </td>
                    <td className="text-end">
                      <div className="btn-group btn-group-sm">
                        <Button
                          variant="outline-success"
                          title="Pay Salary"
                          onClick={() => handleOpenSalary(st)}
                        >
                          💵 {t('paySalary')}
                        </Button>
                        <Button
                          variant="outline-primary"
                          title="Edit"
                          onClick={() => handleOpenEdit(st)}
                        >
                          ✏️
                        </Button>
                        <Button
                          variant="outline-danger"
                          title="Delete"
                          onClick={() => {
                            setDeletingId(st._id)
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

      {/* Add / Edit Staff Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg" centered backdrop="static">
        <Modal.Header closeButton>
          <Modal.Title>{editingStaff ? t('editStaff') : t('addStaff')}</Modal.Title>
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
                  <Form.Label>Designation</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="e.g. Technician / Support"
                    value={formData.designation}
                    onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>{t('salary')} (৳) *</Form.Label>
                  <Form.Control
                    type="number"
                    value={formData.salary}
                    onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>{t('email')}</Form.Label>
                  <Form.Control
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>{t('nid')}</Form.Label>
                  <Form.Control
                    type="text"
                    value={formData.nid}
                    onChange={(e) => setFormData({ ...formData, nid: e.target.value })}
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Joining Date</Form.Label>
                  <Form.Control
                    type="date"
                    value={formData.joiningDate}
                    onChange={(e) => setFormData({ ...formData, joiningDate: e.target.value })}
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

      {/* Salary Modal */}
      <Modal show={showSalaryModal} onHide={() => setShowSalaryModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Disburse Salary</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSalarySubmit}>
          <Modal.Body>
            <p>
              Paying salary for <strong>{salaryTarget?.name}</strong>
            </p>
            <Form.Group className="mb-3">
              <Form.Label>Salary Amount (৳) *</Form.Label>
              <Form.Control
                type="number"
                value={salaryAmount}
                onChange={(e) => setSalaryAmount(e.target.value)}
                required
              />
            </Form.Group>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Month</Form.Label>
                  <Form.Select
                    value={salaryMonth}
                    onChange={(e) => setSalaryMonth(Number(e.target.value))}
                  >
                    {Array.from({ length: 12 }, (_, i) => (
                      <option key={i + 1} value={i + 1}>
                        Month {i + 1}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Year</Form.Label>
                  <Form.Control
                    type="number"
                    value={salaryYear}
                    onChange={(e) => setSalaryYear(Number(e.target.value))}
                  />
                </Form.Group>
              </Col>
            </Row>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowSalaryModal(false)}>
              Cancel
            </Button>
            <Button variant="success" type="submit" disabled={salaryLoading}>
              {salaryLoading ? 'Processing...' : 'Confirm Payment'}
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
        message="Are you sure you want to delete this staff member?"
      />
    </div>
  )
}

export default Staff
