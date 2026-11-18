import React, { useEffect, useState } from 'react'
import { Modal, Button, Form, Row, Col } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import apiLink from '../../api/apiLink'
import { BILLING_DATES } from '../../utils/constants'

const CustomerForm = ({ show, onHide, customer, onSuccess, ispOwnerId }) => {
  const { t } = useTranslation()
  const isEditing = !!customer

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    username: '',
    password: '',
    package: '',
    area: '',
    subArea: '',
    monthlyFee: '',
    billingDate: 1,
    nid: '',
    note: '',
    status: 'active',
  })

  const [packages, setPackages] = useState([])
  const [areas, setAreas] = useState([])
  const [subAreas, setSubAreas] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchDropdowns()
  }, [])

  useEffect(() => {
    if (customer) {
      setFormData({
        name: customer.name || '',
        phone: customer.phone || '',
        email: customer.email || '',
        address: customer.address || '',
        username: customer.username || '',
        password: customer.password || '',
        package: customer.package?._id || customer.package || '',
        area: customer.area?._id || customer.area || '',
        subArea: customer.subArea?._id || customer.subArea || '',
        monthlyFee: customer.monthlyFee || '',
        billingDate: customer.billingDate || 1,
        nid: customer.nid || '',
        note: customer.note || '',
        status: customer.status || 'active',
      })
      if (customer.area?._id || customer.area) {
        fetchSubAreasByArea(customer.area?._id || customer.area)
      }
    } else {
      setFormData({
        name: '',
        phone: '',
        email: '',
        address: '',
        username: '',
        password: '',
        package: '',
        area: '',
        subArea: '',
        monthlyFee: '',
        billingDate: 1,
        nid: '',
        note: '',
        status: 'active',
      })
    }
  }, [customer, show])

  const fetchDropdowns = async () => {
    try {
      const [pkgRes, areaRes] = await Promise.all([
        apiLink.get('/package', { params: { ispOwner: ispOwnerId } }),
        apiLink.get('/area', { params: { ispOwner: ispOwnerId } }),
      ])
      setPackages(pkgRes.data.packages || pkgRes.data || [])
      setAreas(areaRes.data.areas || areaRes.data || [])
    } catch (err) {
      console.error('Error fetching dropdowns:', err)
    }
  }

  const fetchSubAreasByArea = async (areaId) => {
    try {
      const res = await apiLink.get('/subarea', { params: { area: areaId } })
      setSubAreas(res.data.subAreas || res.data || [])
    } catch (err) {
      console.error('Error fetching subareas:', err)
    }
  }

  const handleAreaChange = (e) => {
    const areaId = e.target.value
    setFormData({ ...formData, area: areaId, subArea: '' })
    if (areaId) fetchSubAreasByArea(areaId)
    else setSubAreas([])
  }

  const handlePackageChange = (e) => {
    const pkgId = e.target.value
    const selectedPkg = packages.find((p) => p._id === pkgId)
    setFormData({
      ...formData,
      package: pkgId,
      monthlyFee: selectedPkg ? selectedPkg.price : formData.monthlyFee,
    })
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    const payload = {
      ...formData,
      ispOwner: ispOwnerId,
    }

    try {
      if (isEditing) {
        await apiLink.put(`/customer/${customer._id}`, payload)
        toast.success('Customer updated successfully!')
      } else {
        await apiLink.post('/customer', payload)
        toast.success('Customer created successfully!')
      }
      onSuccess()
      onHide()
    } catch (err) {
      const msg = err.response?.data?.message || 'Operation failed. Please try again.'
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal show={show} onHide={onHide} size="lg" centered backdrop="static">
      <Modal.Header closeButton>
        <Modal.Title>{isEditing ? t('editCustomer') : t('addCustomer')}</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>{t('name')} *</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>{t('phone')} *</Form.Label>
                <Form.Control
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>{t('pppoeUsername')} *</Form.Label>
                <Form.Control
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>{t('pppoePassword')} *</Form.Label>
                <Form.Control
                  type="text"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>{t('package')} *</Form.Label>
                <Form.Select
                  name="package"
                  value={formData.package}
                  onChange={handlePackageChange}
                  required
                >
                  <option value="">Select Package</option>
                  {packages.map((pkg) => (
                    <option key={pkg._id} value={pkg._id}>
                      {pkg.name} ({pkg.downloadSpeed} Mbps) - ৳{pkg.price}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>{t('monthlyFee')} (৳) *</Form.Label>
                <Form.Control
                  type="number"
                  name="monthlyFee"
                  value={formData.monthlyFee}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>{t('area')} *</Form.Label>
                <Form.Select
                  name="area"
                  value={formData.area}
                  onChange={handleAreaChange}
                  required
                >
                  <option value="">Select Area</option>
                  {areas.map((ar) => (
                    <option key={ar._id} value={ar._id}>
                      {ar.name}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>{t('subArea')}</Form.Label>
                <Form.Select
                  name="subArea"
                  value={formData.subArea}
                  onChange={handleChange}
                >
                  <option value="">Select Sub Area</option>
                  {subAreas.map((sa) => (
                    <option key={sa._id} value={sa._id}>
                      {sa.name}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>{t('billingDate')}</Form.Label>
                <Form.Select
                  name="billingDate"
                  value={formData.billingDate}
                  onChange={handleChange}
                >
                  {BILLING_DATES.map((d) => (
                    <option key={d.value} value={d.value}>
                      Day {d.label}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>{t('email')}</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>{t('nid')}</Form.Label>
                <Form.Control
                  type="text"
                  name="nid"
                  value={formData.nid}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={8}>
              <Form.Group className="mb-3">
                <Form.Label>{t('address')}</Form.Label>
                <Form.Control
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>{t('status')}</Form.Label>
                <Form.Select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="expired">Expired</option>
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>

          <Form.Group className="mb-3">
            <Form.Label>{t('note')}</Form.Label>
            <Form.Control
              as="textarea"
              rows={2}
              name="note"
              value={formData.note}
              onChange={handleChange}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onHide} disabled={loading}>
            {t('cancel')}
          </Button>
          <Button variant="primary" type="submit" disabled={loading}>
            {loading ? 'Saving...' : t('save')}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  )
}

export default CustomerForm
