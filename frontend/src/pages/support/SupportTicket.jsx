import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { Table, Button, Modal, Form, Badge, Card } from 'react-bootstrap'
import { toast } from 'react-toastify'
import apiLink from '../../api/apiLink'
import Loader from '../../components/common/Loader'
import EmptyState from '../../components/common/EmptyState'
import { formatDate, getStatusBadge } from '../../utils/helpers'

const SupportTicket = () => {
  const { t } = useTranslation()
  const { ispOwnerId, currentUser } = useSelector((s) => s.auth)

  const [tickets, setTickets] = useState([])
  const [customers, setCustomers] = useState([])
  const [loading, setLoading] = useState(true)

  // Create Ticket Modal
  const [showModal, setShowModal] = useState(false)
  const [formData, setFormData] = useState({
    customer: '',
    subject: '',
    message: '',
    priority: 'medium',
  })
  const [formLoading, setFormLoading] = useState(false)

  // Status Change state
  const [statusLoading, setStatusLoading] = useState(false)

  useEffect(() => {
    fetchTickets()
    fetchCustomers()
  }, [])

  const fetchTickets = async () => {
    setLoading(true)
    try {
      const res = await apiLink.get('/supportticket', { params: { ispOwner: ispOwnerId } })
      setTickets(res.data.tickets || res.data || [])
    } catch (err) {
      console.error('Failed to load tickets', err)
    } finally {
      setLoading(false)
    }
  }

  const fetchCustomers = async () => {
    try {
      const res = await apiLink.get('/customer', { params: { ispOwner: ispOwnerId } })
      setCustomers(res.data.customers || res.data || [])
    } catch (err) {
      console.error('Failed to load customers for tickets', err)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setFormLoading(true)
    try {
      await apiLink.post('/supportticket', {
        ...formData,
        ispOwner: ispOwnerId,
      })
      toast.success('Ticket submitted successfully!')
      setShowModal(false)
      setFormData({ customer: '', subject: '', message: '', priority: 'medium' })
      fetchTickets()
    } catch (err) {
      toast.error('Failed to create ticket')
    } finally {
      setFormLoading(false)
    }
  }

  const handleUpdateStatus = async (ticketId, nextStatus) => {
    setStatusLoading(true)
    try {
      await apiLink.put(`/supportticket/${ticketId}`, { status: nextStatus })
      toast.success(`Ticket marked as ${nextStatus}`)
      fetchTickets()
    } catch (err) {
      toast.error('Failed to update ticket status')
    } finally {
      setStatusLoading(false)
    }
  }

  return (
    <div className="container-fluid p-0">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="fw-bold mb-0">🎫 {t('support')} Tickets</h4>
        <Button variant="primary" onClick={() => setShowModal(true)}>
          + {t('createTicket')}
        </Button>
      </div>

      <div className="table-card">
        {loading ? (
          <Loader message="Loading tickets..." />
        ) : tickets.length === 0 ? (
          <EmptyState
            icon="🎫"
            title="No Support Tickets"
            subtitle="Any client complaints or fiber link issues reported will be displayed here."
            actionButton={
              <Button variant="primary" size="sm" onClick={() => setShowModal(true)}>
                + {t('createTicket')}
              </Button>
            }
          />
        ) : (
          <div className="table-responsive">
            <Table hover className="align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th>#</th>
                  <th>{t('ticketSubject')}</th>
                  <th>{t('customer')}</th>
                  <th>Priority</th>
                  <th>{t('status')}</th>
                  <th>Created At</th>
                  <th className="text-end">{t('actions')}</th>
                </tr>
              </thead>
              <tbody>
                {tickets.map((tk, i) => (
                  <tr key={tk._id}>
                    <td>{i + 1}</td>
                    <td>
                      <div className="fw-bold">{tk.subject}</div>
                      <small className="text-muted">{tk.message}</small>
                    </td>
                    <td>{tk.customer?.name || 'General / Line issue'}</td>
                    <td>
                      <Badge
                        bg={
                          tk.priority === 'high'
                            ? 'danger'
                            : tk.priority === 'medium'
                            ? 'warning'
                            : 'info'
                        }
                      >
                        {tk.priority || 'medium'}
                      </Badge>
                    </td>
                    <td>
                      <Badge bg={getStatusBadge(tk.status)}>{tk.status || 'open'}</Badge>
                    </td>
                    <td>{formatDate(tk.createdAt)}</td>
                    <td className="text-end">
                      {tk.status !== 'closed' ? (
                        <Button
                          variant="outline-success"
                          size="sm"
                          onClick={() => handleUpdateStatus(tk._id, 'closed')}
                          disabled={statusLoading}
                        >
                          ✓ Close Ticket
                        </Button>
                      ) : (
                        <Button
                          variant="outline-secondary"
                          size="sm"
                          onClick={() => handleUpdateStatus(tk._id, 'open')}
                          disabled={statusLoading}
                        >
                          Reopen
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        )}
      </div>

      {/* Create Ticket Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered backdrop="static">
        <Modal.Header closeButton>
          <Modal.Title>{t('createTicket')}</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>{t('customer')} (Optional)</Form.Label>
              <Form.Select
                value={formData.customer}
                onChange={(e) => setFormData({ ...formData, customer: e.target.value })}
              >
                <option value="">General Issue (No customer selected)</option>
                {customers.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name} ({c.phone})
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>{t('ticketSubject')} *</Form.Label>
              <Form.Control
                type="text"
                placeholder="e.g. Red optical light blinking (LOS)"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Priority</Form.Label>
              <Form.Select
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High / Urgent</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>{t('ticketMessage')} *</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Describe the complaint in detail..."
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                required
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)} disabled={formLoading}>
              {t('cancel')}
            </Button>
            <Button variant="primary" type="submit" disabled={formLoading}>
              {formLoading ? 'Submitting...' : t('submit')}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  )
}

export default SupportTicket
