import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import { Form, Button, Alert, Row, Col } from 'react-bootstrap'
import { publicRequest } from '../../api/apiLink'

const Register = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  })
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (formData.password !== formData.confirmPassword) {
      setErrorMsg('Passwords do not match.')
      return
    }

    if (formData.password.length < 6) {
      setErrorMsg('Password must be at least 6 characters long.')
      return
    }

    setErrorMsg('')
    setLoading(true)

    try {
      await publicRequest.post('/auth/register', {
        name: formData.name,
        username: formData.username,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        role: 'ispOwner',
      })

      toast.success('Registration successful! Please sign in.')
      navigate('/login')
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration failed. Try again.'
      setErrorMsg(msg)
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-page">
      <div className="login-card" style={{ maxWidth: '480px' }}>
        <div className="login-logo">
          <div className="login-logo-icon">⚡</div>
          <h3>{t('registerTitle')}</h3>
          <p>{t('registerSubtitle')}</p>
        </div>

        {errorMsg && (
          <Alert variant="danger" dismissible onClose={() => setErrorMsg('')}>
            {errorMsg}
          </Alert>
        )}

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>{t('name')} (ISP / Company)</Form.Label>
            <Form.Control
              type="text"
              name="name"
              placeholder="e.g. FastNet Broadband"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>{t('username')}</Form.Label>
                <Form.Control
                  type="text"
                  name="username"
                  placeholder="admin username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>{t('phone')}</Form.Label>
                <Form.Control
                  type="text"
                  name="phone"
                  placeholder="01XXXXXXXXX"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>
          </Row>

          <Form.Group className="mb-3">
            <Form.Label>{t('email')}</Form.Label>
            <Form.Control
              type="email"
              name="email"
              placeholder="name@company.com"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>{t('password')}</Form.Label>
                <Form.Control
                  type="password"
                  name="password"
                  placeholder="Min 6 characters"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>{t('confirmPassword')}</Form.Label>
                <Form.Control
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>
          </Row>

          <Button
            variant="primary"
            type="submit"
            className="w-100 py-2 fw-semibold mt-2"
            disabled={loading}
          >
            {loading ? 'Creating Account...' : t('signUp')}
          </Button>
        </Form>

        <div className="text-center mt-4">
          <span className="text-muted small">{t('haveAccount')} </span>
          <Link to="/login" className="text-primary small fw-semibold text-decoration-none">
            {t('signIn')}
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Register
