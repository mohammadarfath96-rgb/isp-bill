import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Table, Button, Form, Row, Col, Badge } from 'react-bootstrap'
import { toast } from 'react-toastify'
import apiLink from '../../api/apiLink'
import Loader from '../../components/common/Loader'
import Pagination from '../../components/common/Pagination'
import ConfirmModal from '../../components/common/ConfirmModal'
import EmptyState from '../../components/common/EmptyState'
import CustomerForm from './CustomerForm'
import BillCollect from './BillCollect'
import { formatCurrency, getStatusBadge } from '../../utils/helpers'

const Customer = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { ispOwnerId } = useSelector((s) => s.auth)

  const [customers, setCustomers] = useState([])
  const [areas, setAreas] = useState([])
  const [loading, setLoading] = useState(true)
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  // Filters
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [areaFilter, setAreaFilter] = useState('')

  // Modals state
  const [showFormModal, setShowFormModal] = useState(false)
  const [editingCustomer, setEditingCustomer] = useState(null)
  const [showCollectModal, setShowCollectModal] = useState(false)
  const [collectingCustomer, setCollectingCustomer] = useState(null)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deletingCustomer, setDeletingCustomer] = useState(null)
  const [deleteLoading, setDeleteLoading] = useState(false)

  useEffect(() => {
    fetchAreas()
  }, [])

  useEffect(() => {
    fetchCustomers()
  }, [page, statusFilter, areaFilter])

  const fetchAreas = async () => {
    try {
      const res = await apiLink.get('/area', { params: { ispOwner: ispOwnerId } })
      setAreas(res.data.areas || res.data || [])
    } catch (err) {
      console.error('Failed to load areas', err)
    }
  }

  const fetchCustomers = async () => {
    setLoading(true)
    try {
      const res = await apiLink.get('/customer', {
        params: {
          ispOwner: ispOwnerId,
          search: search.trim() || undefined,
          status: statusFilter || undefined,
          area: areaFilter || undefined,
          page,
          limit: 10,
        },
      })
      const data = res.data
      setCustomers(data.customers || data.data || [])
      setTotal(data.total || data.count || 0)
      setTotalPages(data.totalPages || Math.ceil((data.total || 0) / 10) || 1)
    } catch (err) {
      console.error('Failed to load customers', err)
    } finally {
      setLoading(false)
    }
  }

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    setPage(1)
    fetchCustomers()
  }

  const handleOpenAdd = () => {
    setEditingCustomer(null)
    setShowFormModal(true)
  }

  const handleOpenEdit = (customer) => {
    setEditingCustomer(customer)
    setShowFormModal(true)
  }

  const handleOpenCollect = (customer) => {
    setCollectingCustomer(customer)
    setShowCollectModal(true)
  }

  const handleOpenDelete = (customer) => {
    setDeletingCustomer(customer)
    setShowDeleteModal(true)
  }

  const handleDeleteConfirm = async () => {
    if (!deletingCustomer) return
    setDeleteLoading(true)
    try {
      await apiLink.delete(`/customer/${deletingCustomer._id}`)
      toast.success('Customer deleted successfully!')
      setShowDeleteModal(false)
      fetchCustomers()
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to delete customer'
      toast.error(msg)
    } finally {
      setDeleteLoading(false)
    }
  }

  return (
    <div className="container-fluid p-0">
      {/* Header & Filter Controls */}
      <div className="table-card mb-4 p-3">
        <Row className="g-3 align-items-center">
          <Col md={4}>
            <Form onSubmit={handleSearchSubmit}>
              <div className="input-group">
                <Form.Control
                  type="text"
                  placeholder="Search name, phone, or PPPoE..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <Button variant="outline-primary" type="submit">
                  🔍
                </Button>
              </div>
            </Form>
          </Col>

          <Col md={3}>
            <Form.Select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value)
                setPage(1)
              }}
            >
              <option value="">All Statuses</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="expired">Expired</option>
            </Form.Select>
          </Col>

          <Col md={3}>
            <Form.Select
              value={areaFilter}
              onChange={(e) => {
                setAreaFilter(e.target.value)
                setPage(1)
              }}
            >
              <option value="">All Areas</option>
              {areas.map((ar) => (
                <option key={ar._id} value={ar._id}>
                  {ar.name}
                </option>
              ))}
            </Form.Select>
          </Col>

          <Col md={2} className="text-md-end">
            <Button variant="primary" className="w-100" onClick={handleOpenAdd}>
              + {t('addCustomer')}
            </Button>
          </Col>
        </Row>
      </div>

      {/* Customer List Table */}
      <div className="table-card">
        <div className="table-card-header">
          <h5 className="table-card-title">👥 {t('customers')} ({total})</h5>
        </div>

        {loading ? (
          <Loader message="Loading customers..." />
        ) : customers.length === 0 ? (
          <EmptyState
            icon="👥"
            title="No Customers Found"
            subtitle="Try adjusting your search criteria or add a new customer."
            actionButton={
              <Button variant="primary" size="sm" onClick={handleOpenAdd}>
                + {t('addCustomer')}
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
                  <th>{t('package')}</th>
                  <th>{t('area')}</th>
                  <th>{t('status')}</th>
                  <th>{t('balance')}</th>
                  <th>{t('due')}</th>
                  <th className="text-end">{t('actions')}</th>
                </tr>
              </thead>
              <tbody>
                {customers.map((c, index) => (
                  <tr key={c._id}>
                    <td>{(page - 1) * 10 + index + 1}</td>
                    <td>
                      <div className="fw-semibold text-primary" style={{ cursor: 'pointer' }} onClick={() => navigate(`/customers/${c._id}`)}>
                        {c.name}
                      </div>
                      <small className="text-muted">@{c.username || 'n/a'}</small>
                    </td>
                    <td>{c.phone}</td>
                    <td>{c.package?.name || 'N/A'}</td>
                    <td>{c.area?.name || 'N/A'}</td>
                    <td>
                      <Badge bg={getStatusBadge(c.status)}>
                        {c.status}
                      </Badge>
                    </td>
                    <td>{formatCurrency(c.balance || 0)}</td>
                    <td className={c.due > 0 ? 'text-danger fw-bold' : ''}>
                      {formatCurrency(c.due || 0)}
                    </td>
                    <td className="text-end">
                      <div className="btn-group btn-group-sm">
                        <Button
                          variant="outline-success"
                          title="Collect Bill"
                          onClick={() => handleOpenCollect(c)}
                        >
                          ৳
                        </Button>
                        <Button
                          variant="outline-primary"
                          title="View Profile"
                          onClick={() => navigate(`/customers/${c._id}`)}
                        >
                          👁️
                        </Button>
                        <Button
                          variant="outline-secondary"
                          title="Edit"
                          onClick={() => handleOpenEdit(c)}
                        >
                          ✏️
                        </Button>
                        <Button
                          variant="outline-danger"
                          title="Delete"
                          onClick={() => handleOpenDelete(c)}
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

        <div className="p-3">
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={(p) => setPage(p)}
          />
        </div>
      </div>

      {/* Customer Add/Edit Modal */}
      <CustomerForm
        show={showFormModal}
        onHide={() => setShowFormModal(false)}
        customer={editingCustomer}
        onSuccess={fetchCustomers}
        ispOwnerId={ispOwnerId}
      />

      {/* Bill Collect Modal */}
      <BillCollect
        show={showCollectModal}
        onHide={() => setShowCollectModal(false)}
        customer={collectingCustomer}
        onSuccess={fetchCustomers}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        show={showDeleteModal}
        onHide={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteConfirm}
        title={t('confirmDelete')}
        message={t('confirmDeleteMessage')}
        isLoading={deleteLoading}
      />
    </div>
  )
}

export default Customer
