import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Row, Col, Card, Table, Badge, Button, Tabs, Tab } from 'react-bootstrap'
import { toast } from 'react-toastify'
import apiLink from '../../api/apiLink'
import Loader from '../../components/common/Loader'
import BillCollect from './BillCollect'
import CustomerForm from './CustomerForm'
import { formatCurrency, formatDate, getStatusBadge } from '../../utils/helpers'

const CustomerProfile = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { t } = useTranslation()

  const [customer, setCustomer] = useState(null)
  const [invoices, setInvoices] = useState([])
  const [tickets, setTickets] = useState([])
  const [loading, setLoading] = useState(true)

  // Modals
  const [showCollectModal, setShowCollectModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)

  useEffect(() => {
    fetchCustomerDetails()
  }, [id])

  const fetchCustomerDetails = async () => {
    setLoading(true)
    try {
      const [custRes, invRes, ticketRes] = await Promise.all([
        apiLink.get(`/customer/${id}`),
        apiLink.get('/invoice', { params: { customer: id } }),
        apiLink.get('/supportticket', { params: { customer: id } }).catch(() => ({ data: [] })),
      ])

      setCustomer(custRes.data.customer || custRes.data)
      setInvoices(invRes.data.invoices || invRes.data || [])
      setTickets(ticketRes.data.tickets || ticketRes.data || [])
    } catch (err) {
      console.error('Failed to load customer profile', err)
      toast.error('Failed to load customer profile')
    } finally {
      setLoading(false)
    }
  }

  const handleToggleStatus = async () => {
    if (!customer) return
    const newStatus = customer.status === 'active' ? 'inactive' : 'active'
    try {
      await apiLink.put(`/customer/${customer._id}`, { status: newStatus })
      setCustomer({ ...customer, status: newStatus })
      toast.success(`Customer marked as ${newStatus}`)
    } catch (err) {
      toast.error('Failed to update customer status')
    }
  }

  if (loading) return <Loader message="Loading customer profile..." />
  if (!customer) return <div className="p-4 text-center">Customer not found.</div>

  return (
    <div className="container-fluid p-0">
      {/* Top Banner / Actions */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <Button variant="outline-secondary" onClick={() => navigate('/customers')}>
          ← Back to Customers
        </Button>
        <div className="d-flex gap-2">
          <Button variant="success" onClick={() => setShowCollectModal(true)}>
            💰 {t('collectBill')}
          </Button>
          <Button variant="outline-primary" onClick={() => setShowEditModal(true)}>
            ✏️ {t('edit')}
          </Button>
          <Button
            variant={customer.status === 'active' ? 'outline-warning' : 'outline-success'}
            onClick={handleToggleStatus}
          >
            {customer.status === 'active' ? t('deactivate') : t('activate')}
          </Button>
        </div>
      </div>

      <Row className="g-4 mb-4">
        {/* Customer Info Card */}
        <Col lg={4}>
          <div className="table-card p-4 h-100">
            <div className="text-center mb-4">
              <div
                style={{
                  width: 72,
                  height: 72,
                  borderRadius: '50%',
                  background: '#0d6efd',
                  color: 'white',
                  fontSize: '2rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 12px',
                }}
              >
                👤
              </div>
              <h4 className="fw-bold mb-1">{customer.name}</h4>
              <Badge bg={getStatusBadge(customer.status)} className="px-3 py-1 fs-6">
                {customer.status}
              </Badge>
            </div>

            <div className="border-top pt-3">
              <div className="d-flex justify-content-between py-2 border-bottom">
                <span className="text-muted">{t('phone')}</span>
                <span className="fw-semibold">{customer.phone}</span>
              </div>
              <div className="d-flex justify-content-between py-2 border-bottom">
                <span className="text-muted">{t('email')}</span>
                <span>{customer.email || 'N/A'}</span>
              </div>
              <div className="d-flex justify-content-between py-2 border-bottom">
                <span className="text-muted">{t('pppoeUsername')}</span>
                <span className="fw-semibold text-primary">{customer.username}</span>
              </div>
              <div className="d-flex justify-content-between py-2 border-bottom">
                <span className="text-muted">{t('package')}</span>
                <span>{customer.package?.name || 'N/A'}</span>
              </div>
              <div className="d-flex justify-content-between py-2 border-bottom">
                <span className="text-muted">{t('area')}</span>
                <span>{customer.area?.name || 'N/A'}</span>
              </div>
              <div className="d-flex justify-content-between py-2 border-bottom">
                <span className="text-muted">{t('monthlyFee')}</span>
                <span className="fw-bold">{formatCurrency(customer.monthlyFee)}</span>
              </div>
              <div className="d-flex justify-content-between py-2 border-bottom">
                <span className="text-muted">{t('due')}</span>
                <span className="fw-bold text-danger">{formatCurrency(customer.due || 0)}</span>
              </div>
              <div className="d-flex justify-content-between py-2 border-bottom">
                <span className="text-muted">{t('balance')}</span>
                <span className="fw-bold text-success">{formatCurrency(customer.balance || 0)}</span>
              </div>
              <div className="d-flex justify-content-between py-2">
                <span className="text-muted">{t('address')}</span>
                <span className="text-end" style={{ maxWidth: '60%' }}>
                  {customer.address || 'N/A'}
                </span>
              </div>
            </div>
          </div>
        </Col>

        {/* Invoices and Tickets Tabs */}
        <Col lg={8}>
          <div className="table-card p-3">
            <Tabs defaultActiveKey="invoices" id="customer-profile-tabs" className="mb-3">
              <Tab eventKey="invoices" title={`🧾 ${t('invoiceHistory')} (${invoices.length})`}>
                <div className="table-responsive">
                  <Table hover className="align-middle mb-0">
                    <thead className="table-light">
                      <tr>
                        <th>{t('invoiceNo')}</th>
                        <th>{t('amount')}</th>
                        <th>{t('method')}</th>
                        <th>{t('date')}</th>
                        <th>{t('status')}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {invoices.length > 0 ? (
                        invoices.map((inv) => (
                          <tr key={inv._id}>
                            <td className="fw-semibold">#{inv.invoiceNumber || inv._id?.slice(-6)}</td>
                            <td className="fw-bold">{formatCurrency(inv.amount)}</td>
                            <td className="text-capitalize">{inv.paymentMethod || 'cash'}</td>
                            <td>{formatDate(inv.createdAt || inv.date)}</td>
                            <td>
                              <Badge bg={getStatusBadge(inv.status)}>
                                {inv.status}
                              </Badge>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={5} className="text-center py-4 text-muted">
                            No billing history found.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </Table>
                </div>
              </Tab>

              <Tab eventKey="tickets" title={`🎫 ${t('supportTickets')} (${tickets.length})`}>
                <div className="table-responsive">
                  <Table hover className="align-middle mb-0">
                    <thead className="table-light">
                      <tr>
                        <th>Subject</th>
                        <th>Status</th>
                        <th>Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tickets.length > 0 ? (
                        tickets.map((tk) => (
                          <tr key={tk._id}>
                            <td className="fw-semibold">{tk.subject}</td>
                            <td>
                              <Badge bg={getStatusBadge(tk.status)}>
                                {tk.status}
                              </Badge>
                            </td>
                            <td>{formatDate(tk.createdAt)}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={3} className="text-center py-4 text-muted">
                            No tickets reported.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </Table>
                </div>
              </Tab>
            </Tabs>
          </div>
        </Col>
      </Row>

      {/* Bill Collect Modal */}
      <BillCollect
        show={showCollectModal}
        onHide={() => setShowCollectModal(false)}
        customer={customer}
        onSuccess={fetchCustomerDetails}
      />

      {/* Customer Edit Modal */}
      <CustomerForm
        show={showEditModal}
        onHide={() => setShowEditModal(false)}
        customer={customer}
        onSuccess={fetchCustomerDetails}
        ispOwnerId={customer.ispOwner}
      />
    </div>
  )
}

export default CustomerProfile
