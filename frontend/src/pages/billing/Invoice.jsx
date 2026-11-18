import React, { useEffect, useState, useRef } from 'react'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { Table, Button, Form, Row, Col, Badge, Modal } from 'react-bootstrap'
import { useReactToPrint } from 'react-to-print'
import { toast } from 'react-toastify'
import apiLink from '../../api/apiLink'
import Loader from '../../components/common/Loader'
import Pagination from '../../components/common/Pagination'
import EmptyState from '../../components/common/EmptyState'
import InvoicePrint from './InvoicePrint'
import { formatCurrency, formatDate, getStatusBadge } from '../../utils/helpers'
import { MONTHS, getCurrentYears } from '../../utils/constants'

const Invoice = () => {
  const { t } = useTranslation()
  const { ispOwnerId, userData } = useSelector((s) => s.auth)

  const [invoices, setInvoices] = useState([])
  const [loading, setLoading] = useState(true)
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  // Filters
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [selectedMonth, setSelectedMonth] = useState('')
  const [selectedYear, setSelectedYear] = useState('')

  // Printing state
  const [selectedInvoice, setSelectedInvoice] = useState(null)
  const [showPrintModal, setShowPrintModal] = useState(false)
  const printComponentRef = useRef()

  const handlePrint = useReactToPrint({
    content: () => printComponentRef.current,
  })

  useEffect(() => {
    fetchInvoices()
  }, [page, statusFilter, selectedMonth, selectedYear])

  const fetchInvoices = async () => {
    setLoading(true)
    try {
      const res = await apiLink.get('/invoice', {
        params: {
          ispOwner: ispOwnerId,
          search: search.trim() || undefined,
          status: statusFilter || undefined,
          month: selectedMonth || undefined,
          year: selectedYear || undefined,
          page,
          limit: 10,
        },
      })
      const data = res.data
      setInvoices(data.invoices || data.data || [])
      setTotal(data.total || data.count || 0)
      setTotalPages(data.totalPages || Math.ceil((data.total || 0) / 10) || 1)
    } catch (err) {
      console.error('Failed to load invoices', err)
    } finally {
      setLoading(false)
    }
  }

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    setPage(1)
    fetchInvoices()
  }

  const handleOpenPrint = (inv) => {
    setSelectedInvoice(inv)
    setShowPrintModal(true)
  }

  return (
    <div className="container-fluid p-0">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="fw-bold mb-0">💰 {t('billing')} ({total})</h4>
      </div>

      {/* Filter Controls */}
      <div className="table-card mb-4 p-3">
        <Row className="g-3">
          <Col md={3}>
            <Form onSubmit={handleSearchSubmit}>
              <div className="input-group">
                <Form.Control
                  type="text"
                  placeholder="Invoice# or customer name..."
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
              <option value="paid">Paid</option>
              <option value="unpaid">Unpaid</option>
              <option value="partial">Partial</option>
            </Form.Select>
          </Col>

          <Col md={3}>
            <Form.Select
              value={selectedMonth}
              onChange={(e) => {
                setSelectedMonth(e.target.value)
                setPage(1)
              }}
            >
              <option value="">All Months</option>
              {MONTHS.map((m) => (
                <option key={m.value} value={m.value}>
                  {m.label}
                </option>
              ))}
            </Form.Select>
          </Col>

          <Col md={3}>
            <Form.Select
              value={selectedYear}
              onChange={(e) => {
                setSelectedYear(e.target.value)
                setPage(1)
              }}
            >
              <option value="">All Years</option>
              {getCurrentYears().map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </Form.Select>
          </Col>
        </Row>
      </div>

      {/* Invoices Table */}
      <div className="table-card">
        {loading ? (
          <Loader message="Loading invoices..." />
        ) : invoices.length === 0 ? (
          <EmptyState
            icon="🧾"
            title="No Invoices Found"
            subtitle="Invoices generated from bill collection or recurring billing will show up here."
          />
        ) : (
          <div className="table-responsive">
            <Table hover className="align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th>{t('invoiceNo')}</th>
                  <th>{t('customer')}</th>
                  <th>{t('amount')}</th>
                  <th>{t('date')}</th>
                  <th>{t('method')}</th>
                  <th>{t('status')}</th>
                  <th className="text-end">{t('actions')}</th>
                </tr>
              </thead>
              <tbody>
                {invoices.map((inv) => (
                  <tr key={inv._id}>
                    <td className="fw-bold text-primary">
                      #{inv.invoiceNumber || inv._id?.slice(-6)}
                    </td>
                    <td>
                      <div className="fw-semibold">
                        {inv.customer?.name || inv.customerName || 'N/A'}
                      </div>
                      <small className="text-muted">
                        {inv.customer?.phone || ''}
                      </small>
                    </td>
                    <td className="fw-bold">{formatCurrency(inv.amount)}</td>
                    <td>{formatDate(inv.createdAt || inv.date)}</td>
                    <td className="text-capitalize">{inv.paymentMethod || 'cash'}</td>
                    <td>
                      <Badge bg={getStatusBadge(inv.status)}>
                        {inv.status || 'paid'}
                      </Badge>
                    </td>
                    <td className="text-end">
                      <Button
                        variant="outline-primary"
                        size="sm"
                        onClick={() => handleOpenPrint(inv)}
                      >
                        🖨️ {t('printReceipt')}
                      </Button>
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

      {/* Invoice Print Modal */}
      <Modal
        show={showPrintModal}
        onHide={() => setShowPrintModal(false)}
        size="lg"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Print Money Receipt</Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-0">
          <div style={{ overflowX: 'auto' }}>
            <InvoicePrint
              ref={printComponentRef}
              invoice={selectedInvoice}
              ispOwnerData={userData}
            />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowPrintModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={handlePrint}>
            🖨️ Print Now
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  )
}

export default Invoice
