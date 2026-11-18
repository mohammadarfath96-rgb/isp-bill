import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { Tabs, Tab, Form, Button, Row, Col, Card } from 'react-bootstrap'
import { toast } from 'react-toastify'
import apiLink from '../../api/apiLink'
import { updateUserData } from '../../features/authSlice'

const Settings = () => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const { ispOwnerId, userData } = useSelector((s) => s.auth)

  const [activeTab, setActiveTab] = useState('profile')
  const [loading, setLoading] = useState(false)

  // ISP Profile State
  const [profileForm, setProfileForm] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    logo: '',
  })

  // SMS Gateway Settings
  const [smsForm, setSmsForm] = useState({
    smsGatewayUrl: '',
    smsSenderId: '',
    smsApiKey: '',
    smsEnabled: false,
  })

  // Payment Gateway Settings
  const [paymentForm, setPaymentForm] = useState({
    bkashEnabled: true,
    nagadEnabled: true,
    sslCommerzEnabled: false,
    sslStoreId: '',
    sslStorePass: '',
  })

  useEffect(() => {
    if (userData) {
      setProfileForm({
        name: userData.name || '',
        email: userData.email || '',
        phone: userData.phone || '',
        address: userData.address || '',
        logo: userData.logo || '',
      })
      if (userData.bpSettings) {
        setSmsForm({
          smsGatewayUrl: userData.bpSettings.smsGatewayUrl || '',
          smsSenderId: userData.bpSettings.smsSenderId || '',
          smsApiKey: userData.bpSettings.smsApiKey || '',
          smsEnabled: userData.bpSettings.smsEnabled || false,
        })
        setPaymentForm({
          bkashEnabled: userData.bpSettings.bkashEnabled ?? true,
          nagadEnabled: userData.bpSettings.nagadEnabled ?? true,
          sslCommerzEnabled: userData.bpSettings.sslCommerzEnabled ?? false,
          sslStoreId: userData.bpSettings.sslStoreId || '',
          sslStorePass: userData.bpSettings.sslStorePass || '',
        })
      }
    }
  }, [userData])

  const handleSaveProfile = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await apiLink.put(`/auth/profile`, profileForm)
      dispatch(updateUserData(res.data.user || res.data))
      toast.success('ISP Profile updated successfully!')
    } catch (err) {
      toast.error('Failed to update ISP profile')
    } finally {
      setLoading(false)
    }
  }

  const handleSaveSms = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await apiLink.put(`/auth/settings`, { bpSettings: smsForm })
      toast.success('SMS Gateway settings saved!')
    } catch (err) {
      toast.error('Failed to save SMS settings')
    } finally {
      setLoading(false)
    }
  }

  const handleSavePayment = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await apiLink.put(`/auth/settings`, { bpSettings: paymentForm })
      toast.success('Payment Gateway settings saved!')
    } catch (err) {
      toast.error('Failed to save Payment settings')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container-fluid p-0">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="fw-bold mb-0">⚙️ {t('settings')}</h4>
      </div>

      <div className="table-card p-4">
        <Tabs activeKey={activeTab} onSelect={(k) => setActiveTab(k)} className="mb-4">
          {/* ISP Profile */}
          <Tab eventKey="profile" title={`🏢 ${t('ispProfile')}`}>
            <Form onSubmit={handleSaveProfile} style={{ maxWidth: '640px' }}>
              <Form.Group className="mb-3">
                <Form.Label>{t('name')} (Company / ISP) *</Form.Label>
                <Form.Control
                  type="text"
                  value={profileForm.name}
                  onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                  required
                />
              </Form.Group>

              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>{t('phone')} *</Form.Label>
                    <Form.Control
                      type="text"
                      value={profileForm.phone}
                      onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>{t('email')} *</Form.Label>
                    <Form.Control
                      type="email"
                      value={profileForm.email}
                      onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                      required
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Form.Group className="mb-3">
                <Form.Label>{t('address')}</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={2}
                  value={profileForm.address}
                  onChange={(e) => setProfileForm({ ...profileForm, address: e.target.value })}
                />
              </Form.Group>

              <Form.Group className="mb-4">
                <Form.Label>Company Logo URL</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="https://example.com/logo.png"
                  value={profileForm.logo}
                  onChange={(e) => setProfileForm({ ...profileForm, logo: e.target.value })}
                />
              </Form.Group>

              <Button variant="primary" type="submit" disabled={loading}>
                {loading ? 'Saving...' : t('save')}
              </Button>
            </Form>
          </Tab>

          {/* SMS Settings */}
          <Tab eventKey="sms" title={`📱 ${t('smsSettings')}`}>
            <Form onSubmit={handleSaveSms} style={{ maxWidth: '640px' }}>
              <Form.Check
                type="switch"
                id="sms-enabled-switch"
                label="Enable SMS Notifications"
                checked={smsForm.smsEnabled}
                onChange={(e) => setSmsForm({ ...smsForm, smsEnabled: e.target.checked })}
                className="mb-4 fw-semibold"
              />

              <Form.Group className="mb-3">
                <Form.Label>{t('smsGatewayUrl')}</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="e.g. http://bulksmsbd.net/api/smsapi"
                  value={smsForm.smsGatewayUrl}
                  onChange={(e) => setSmsForm({ ...smsForm, smsGatewayUrl: e.target.value })}
                />
              </Form.Group>

              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>{t('smsSenderId')}</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="e.g. 8809612..."
                      value={smsForm.smsSenderId}
                      onChange={(e) => setSmsForm({ ...smsForm, smsSenderId: e.target.value })}
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>{t('smsApiKey')}</Form.Label>
                    <Form.Control
                      type="password"
                      placeholder="Enter SMS API Key"
                      value={smsForm.smsApiKey}
                      onChange={(e) => setSmsForm({ ...smsForm, smsApiKey: e.target.value })}
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Button variant="primary" type="submit" disabled={loading}>
                {loading ? 'Saving...' : t('save')}
              </Button>
            </Form>
          </Tab>

          {/* Payment Gateways */}
          <Tab eventKey="payment" title={`💳 ${t('paymentGateway')}`}>
            <Form onSubmit={handleSavePayment} style={{ maxWidth: '640px' }}>
              <div className="mb-4">
                <Form.Check
                  type="switch"
                  id="bkash-switch"
                  label="Enable bKash Merchant Payment"
                  checked={paymentForm.bkashEnabled}
                  onChange={(e) => setPaymentForm({ ...paymentForm, bkashEnabled: e.target.checked })}
                  className="mb-3"
                />
                <Form.Check
                  type="switch"
                  id="nagad-switch"
                  label="Enable Nagad Online Payment"
                  checked={paymentForm.nagadEnabled}
                  onChange={(e) => setPaymentForm({ ...paymentForm, nagadEnabled: e.target.checked })}
                  className="mb-3"
                />
                <Form.Check
                  type="switch"
                  id="ssl-switch"
                  label="Enable SSLCommerz Payment Gateway"
                  checked={paymentForm.sslCommerzEnabled}
                  onChange={(e) => setPaymentForm({ ...paymentForm, sslCommerzEnabled: e.target.checked })}
                  className="mb-3"
                />
              </div>

              {paymentForm.sslCommerzEnabled && (
                <Row className="mb-4">
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>SSLCommerz Store ID</Form.Label>
                      <Form.Control
                        type="text"
                        value={paymentForm.sslStoreId}
                        onChange={(e) => setPaymentForm({ ...paymentForm, sslStoreId: e.target.value })}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>SSLCommerz Store Password</Form.Label>
                      <Form.Control
                        type="password"
                        value={paymentForm.sslStorePass}
                        onChange={(e) => setPaymentForm({ ...paymentForm, sslStorePass: e.target.value })}
                      />
                    </Form.Group>
                  </Col>
                </Row>
              )}

              <Button variant="primary" type="submit" disabled={loading}>
                {loading ? 'Saving...' : t('save')}
              </Button>
            </Form>
          </Tab>
        </Tabs>
      </div>
    </div>
  )
}

export default Settings
