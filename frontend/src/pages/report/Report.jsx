import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { Tabs, Tab, Row, Col, Form, Button, Table, Card, Badge } from 'react-bootstrap'
import apiLink from '../../api/apiLink'
import Loader from '../../components/common/Loader'
import { formatCurrency, formatDate, getStatusBadge } from '../../utils/helpers'
import { MONTHS, getCurrentYears } from '../../utils/constants'

const Report = () => {
  const { t } = useTranslation()
  const { ispOwnerId } = useSelector((s) => s.auth)

  const [activeTab, setActiveTab] = useState('daily')

  // Daily Report State
  const [dailyDate, setDailyDate] = useState(new Date().toISOString().split('T')[0])
  const [dailyInvoices, setDailyInvoices] = useState([])
  const [dailyTotal, setDailyTotal] = useState(0)
  const [dailyLoading, setDailyLoading] = useState(false)

  // Monthly Report State
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1)
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())
  const [monthlyInvoices, setMonthlyInvoices] = useState([])
  const [monthlyTotal, setMonthlyTotal] = useState(0)
  const [monthlyExpenses, setMonthlyExpenses] = useState(0)
  const [monthlyLoading, setMonthlyLoading] = useState(false)

  // Collector Report State
  const [collectors, setCollectors] = useState([])
  const [selectedCollector, setSelectedCollector] = useState('')
  const [collectorInvoices, setCollectorInvoices] = useState([])
  const [collectorTotal, setCollectorTotal] = useState(0)
  const [collectorLoading, setCollectorLoading] = useState(false)

  useEffect(() => {
    fetchDailyReport()
    fetchCollectors()
  }, [])

  const fetchDailyReport = async () => {
    setDailyLoading(true)
    try {
      const res = await apiLink.get('/report/daily', {
        params: { ispOwner: ispOwnerId, date: dailyDate },
      }).catch(async () => {
        // Fallback to query invoice endpoint directly
        return await apiLink.get('/invoice', {
          params: { ispOwner: ispOwnerId, date: dailyDate },
        })
      })
      const list = res.data.invoices || res.data || []
      setDailyInvoices(list)
      const sum = list.reduce((a, b) => a + (Number(b.amount) || 0), 0)
      setDailyTotal(sum)
    } catch (err) {
      console.error('Error fetching daily report', err)
    } finally {
      setDailyLoading(false)
    }
  }

  const fetchMonthlyReport = async () => {
    setMonthlyLoading(true)
    try {
      const [invRes, expRes] = await Promise.all([
        apiLink.get('/invoice', {
          params: { ispOwner: ispOwnerId, month: selectedMonth, year: selectedYear },
        }),
        apiLink.get('/expenditure', {
          params: { ispOwner: ispOwnerId },
        }),
      ])

      const invList = invRes.data.invoices || invRes.data || []
      setMonthlyInvoices(invList)
      const sumRevenue = invList.reduce((a, b) => a + (Number(b.amount) || 0), 0)
      setMonthlyTotal(sumRevenue)

      const expList = expRes.data.expenditures || expRes.data || []
      const sumExpenses = expList.reduce((a, b) => a + (Number(b.amount) || 0), 0)
      setMonthlyExpenses(sumExpenses)
    } catch (err) {
      console.error('Error fetching monthly report', err)
    } finally {
      setMonthlyLoading(false)
    }
  }

  const fetchCollectors = async () => {
    try {
      const res = await apiLink.get('/collector', { params: { ispOwner: ispOwnerId } })
      setCollectors(res.data.collectors || res.data || [])
    } catch (err) {
      console.error('Failed to load collectors', err)
    }
  }

  const fetchCollectorReport = async () => {
    if (!selectedCollector) return
    setCollectorLoading(true)
    try {
      const res = await apiLink.get('/invoice', {
        params: {
          ispOwner: ispOwnerId,
          collector: selectedCollector,
          month: selectedMonth,
          year: selectedYear,
        },
      })
      const list = res.data.invoices || res.data || []
      setCollectorInvoices(list)
      const sum = list.reduce((a, b) => a + (Number(b.amount) || 0), 0)
      setCollectorTotal(sum)
    } catch (err) {
      console.error('Error fetching collector report', err)
    } finally {
      setCollectorLoading(false)
    }
  }

  return (
    <div className="container-fluid p-0">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="fw-bold mb-0">📋 {t('reports')} & Analytics</h4>
      </div>

      <div className="table-card p-3">
        <Tabs activeKey={activeTab} onSelect={(k) => setActiveTab(k)} className="mb-4">
          {/* Daily Report */}
          <Tab eventKey="daily" title={`📅 ${t('dailyReport')}`}>
            <Row className="g-3 align-items-center mb-4">
              <Col md={4}>
                <Form.Group>
                  <Form.Label className="small text-muted">Select Date</Form.Label>
                  <Form.Control
                    type="date"
                    value={dailyDate}
                    onChange={(e) => setDailyDate(e.target.value)}
                  />
                </Form.Group>
              </Col>
              <Col md={2} className="d-flex align-items-end">
                <Button variant="primary" className="w-100" onClick={fetchDailyReport}>
                  Generate
                </Button>
              </Col>
              <Col md={6} className="text-md-end">
                <Card className="bg-light border-0 d-inline-block px-4 py-2 text-start">
                  <small className="text-muted d-block">Total Collected on {dailyDate}</small>
                  <h4 className="text-success fw-bold mb-0">{formatCurrency(dailyTotal)}</h4>
                </Card>
              </Col>
            </Row>

            {dailyLoading ? (
              <Loader message="Loading daily summary..." />
            ) : (
              <div className="table-responsive">
                <Table hover className="align-middle mb-0">
                  <thead className="table-light">
                    <tr>
                      <th>#</th>
                      <th>{t('invoiceNo')}</th>
                      <th>{t('customer')}</th>
                      <th>{t('amount')}</th>
                      <th>{t('method')}</th>
                      <th>{t('status')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dailyInvoices.length > 0 ? (
                      dailyInvoices.map((inv, i) => (
                        <tr key={inv._id || i}>
                          <td>{i + 1}</td>
                          <td className="fw-semibold">#{inv.invoiceNumber || inv._id?.slice(-6)}</td>
                          <td>{inv.customer?.name || inv.customerName || 'N/A'}</td>
                          <td className="fw-bold">{formatCurrency(inv.amount)}</td>
                          <td className="text-capitalize">{inv.paymentMethod || 'cash'}</td>
                          <td>
                            <Badge bg={getStatusBadge(inv.status)}>{inv.status || 'paid'}</Badge>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={6} className="text-center py-4 text-muted">
                          No transactions found for this date.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </Table>
              </div>
            )}
          </Tab>

          {/* Monthly Report */}
          <Tab eventKey="monthly" title={`📊 ${t('monthlyReport')}`}>
            <Row className="g-3 align-items-center mb-4">
              <Col md={3}>
                <Form.Select
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(Number(e.target.value))}
                >
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
                  onChange={(e) => setSelectedYear(Number(e.target.value))}
                >
                  {getCurrentYears().map((y) => (
                    <option key={y} value={y}>
                      {y}
                    </option>
                  ))}
                </Form.Select>
              </Col>
              <Col md={2}>
                <Button variant="primary" className="w-100" onClick={fetchMonthlyReport}>
                  Generate
                </Button>
              </Col>
            </Row>

            <Row className="g-3 mb-4">
              <Col md={4}>
                <Card className="p-3 border-0 bg-primary text-white text-center">
                  <small>Monthly Revenue</small>
                  <h3 className="fw-bold mb-0">{formatCurrency(monthlyTotal)}</h3>
                </Card>
              </Col>
              <Col md={4}>
                <Card className="p-3 border-0 bg-danger text-white text-center">
                  <small>Monthly Expenses</small>
                  <h3 className="fw-bold mb-0">{formatCurrency(monthlyExpenses)}</h3>
                </Card>
              </Col>
              <Col md={4}>
                <Card className="p-3 border-0 bg-success text-white text-center">
                  <small>Net Profit</small>
                  <h3 className="fw-bold mb-0">
                    {formatCurrency(Math.max(0, monthlyTotal - monthlyExpenses))}
                  </h3>
                </Card>
              </Col>
            </Row>

            {monthlyLoading ? (
              <Loader message="Loading monthly report..." />
            ) : (
              <div className="table-responsive">
                <Table hover className="align-middle mb-0">
                  <thead className="table-light">
                    <tr>
                      <th>#</th>
                      <th>{t('invoiceNo')}</th>
                      <th>{t('customer')}</th>
                      <th>{t('amount')}</th>
                      <th>{t('date')}</th>
                      <th>{t('method')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {monthlyInvoices.length > 0 ? (
                      monthlyInvoices.map((inv, i) => (
                        <tr key={inv._id || i}>
                          <td>{i + 1}</td>
                          <td className="fw-semibold">#{inv.invoiceNumber || inv._id?.slice(-6)}</td>
                          <td>{inv.customer?.name || inv.customerName || 'N/A'}</td>
                          <td className="fw-bold">{formatCurrency(inv.amount)}</td>
                          <td>{formatDate(inv.createdAt || inv.date)}</td>
                          <td className="text-capitalize">{inv.paymentMethod || 'cash'}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={6} className="text-center py-4 text-muted">
                          Click Generate to view monthly performance.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </Table>
              </div>
            )}
          </Tab>

          {/* Collector Report */}
          <Tab eventKey="collector" title={`👤 ${t('collectorReport')}`}>
            <Row className="g-3 align-items-center mb-4">
              <Col md={4}>
                <Form.Select
                  value={selectedCollector}
                  onChange={(e) => setSelectedCollector(e.target.value)}
                >
                  <option value="">Select Collector</option>
                  {collectors.map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.name} ({c.phone})
                    </option>
                  ))}
                </Form.Select>
              </Col>
              <Col md={2}>
                <Button
                  variant="primary"
                  className="w-100"
                  onClick={fetchCollectorReport}
                  disabled={!selectedCollector}
                >
                  Generate
                </Button>
              </Col>
              <Col md={6} className="text-md-end">
                <Card className="bg-light border-0 d-inline-block px-4 py-2 text-start">
                  <small className="text-muted d-block">Total Collections</small>
                  <h4 className="text-success fw-bold mb-0">{formatCurrency(collectorTotal)}</h4>
                </Card>
              </Col>
            </Row>

            {collectorLoading ? (
              <Loader message="Loading collector collections..." />
            ) : (
              <div className="table-responsive">
                <Table hover className="align-middle mb-0">
                  <thead className="table-light">
                    <tr>
                      <th>#</th>
                      <th>{t('invoiceNo')}</th>
                      <th>{t('customer')}</th>
                      <th>{t('amount')}</th>
                      <th>{t('date')}</th>
                      <th>{t('method')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {collectorInvoices.length > 0 ? (
                      collectorInvoices.map((inv, i) => (
                        <tr key={inv._id || i}>
                          <td>{i + 1}</td>
                          <td className="fw-semibold">#{inv.invoiceNumber || inv._id?.slice(-6)}</td>
                          <td>{inv.customer?.name || inv.customerName || 'N/A'}</td>
                          <td className="fw-bold text-success">{formatCurrency(inv.amount)}</td>
                          <td>{formatDate(inv.createdAt || inv.date)}</td>
                          <td className="text-capitalize">{inv.paymentMethod || 'cash'}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={6} className="text-center py-4 text-muted">
                          Select a collector to view collection records.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </Table>
              </div>
            )}
          </Tab>
        </Tabs>
      </div>
    </div>
  )
}

export default Report
