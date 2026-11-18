import React, { forwardRef } from 'react'
import { Row, Col, Table } from 'react-bootstrap'
import { formatCurrency, formatDate } from '../../utils/helpers'

const InvoicePrint = forwardRef(({ invoice, ispOwnerData }, ref) => {
  if (!invoice) return null

  return (
    <div ref={ref} className="p-5" style={{ background: '#fff', color: '#000', minHeight: '100%' }}>
      {/* Receipt Header */}
      <div className="d-flex justify-content-between align-items-center border-bottom pb-4 mb-4">
        <div>
          <h2 className="fw-bold mb-1">{ispOwnerData?.name || 'ISP Billing'}</h2>
          <p className="text-muted mb-0">{ispOwnerData?.address || 'Broadband Internet Services'}</p>
          <p className="text-muted mb-0">Phone: {ispOwnerData?.phone || 'Support line'}</p>
        </div>
        <div className="text-end">
          <h3 className="text-primary fw-bold mb-1">MONEY RECEIPT</h3>
          <p className="mb-0"><strong>Invoice #:</strong> #{invoice.invoiceNumber || invoice._id?.slice(-6)}</p>
          <p className="mb-0"><strong>Date:</strong> {formatDate(invoice.createdAt || invoice.date)}</p>
        </div>
      </div>

      {/* Customer Info */}
      <div className="bg-light p-3 rounded mb-4">
        <Row>
          <Col xs={6}>
            <p className="mb-1"><strong>Customer:</strong> {invoice.customer?.name || invoice.customerName}</p>
            <p className="mb-1"><strong>Phone:</strong> {invoice.customer?.phone || 'N/A'}</p>
            <p className="mb-0"><strong>PPPoE User:</strong> {invoice.customer?.username || 'N/A'}</p>
          </Col>
          <Col xs={6} className="text-end">
            <p className="mb-1"><strong>Package:</strong> {invoice.customer?.package?.name || 'Standard'}</p>
            <p className="mb-1"><strong>Payment Method:</strong> {invoice.paymentMethod || 'Cash'}</p>
            <p className="mb-0"><strong>Status:</strong> <span className="text-success fw-bold text-uppercase">{invoice.status || 'PAID'}</span></p>
          </Col>
        </Row>
      </div>

      {/* Item Details */}
      <Table bordered className="mb-4">
        <thead className="table-light">
          <tr>
            <th>Description</th>
            <th className="text-end" style={{ width: '150px' }}>Amount</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              Monthly Internet Subscription
              {invoice.month && invoice.year ? ` - ${invoice.month}/${invoice.year}` : ''}
              {invoice.note && <div className="small text-muted">Note: {invoice.note}</div>}
            </td>
            <td className="text-end fw-bold">{formatCurrency(invoice.amount)}</td>
          </tr>
        </tbody>
        <tfoot>
          <tr>
            <th className="text-end">Total Paid:</th>
            <th className="text-end text-primary fs-5">{formatCurrency(invoice.amount)}</th>
          </tr>
        </tfoot>
      </Table>

      {/* Footer Notes */}
      <div className="d-flex justify-content-between align-items-end mt-5 pt-5 border-top">
        <div>
          <small className="text-muted">Thank you for staying with us!</small>
          <br />
          <small className="text-muted">System generated receipt - No signature required.</small>
        </div>
        <div className="text-center" style={{ width: '180px' }}>
          <div className="border-bottom pb-4 mb-1"></div>
          <small className="text-muted">Authorized Signature</small>
        </div>
      </div>
    </div>
  )
})

export default InvoicePrint
