import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import { Form, Button, Alert, InputGroup } from 'react-bootstrap'
import { publicRequest } from '../../api/apiLink'
import { logInStart, logInSuccess, loginFailure } from '../../features/authSlice'

const Login = () => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { isFetching } = useSelector((s) => s.auth)

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!username.trim() || !password.trim()) {
      setErrorMsg('Please enter both username and password.')
      return
    }

    setErrorMsg('')
    dispatch(logInStart())

    try {
      const res = await publicRequest.post('/auth/login', { username, password })
      dispatch(logInSuccess(res.data))
      toast.success('Logged in successfully!')
      navigate('/dashboard')
    } catch (err) {
      dispatch(loginFailure())
      const msg = err.response?.data?.message || t('loginError')
      setErrorMsg(msg)
      toast.error(msg)
    }
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-logo">
          <div className="login-logo-icon">⚡</div>
          <h3>ISP Billing</h3>
          <p>{t('loginSubtitle')}</p>
        </div>

        {errorMsg && (
          <Alert variant="danger" dismissible onClose={() => setErrorMsg('')}>
            {errorMsg}
          </Alert>
        )}

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>{t('username')}</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              autoFocus
            />
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Label>{t('password')}</Form.Label>
            <InputGroup>
              <Form.Control
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <Button
                variant="outline-secondary"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
              >
                {showPassword ? '👁️' : '🔒'}
              </Button>
            </InputGroup>
          </Form.Group>

          <Button
            variant="primary"
            type="submit"
            className="w-100 py-2 fw-semibold"
            disabled={isFetching}
          >
            {isFetching ? 'Signing in...' : t('signIn')}
          </Button>
        </Form>

        <div className="text-center mt-4">
          <span className="text-muted small">{t('noAccount')} </span>
          <Link to="/register" className="text-primary small fw-semibold text-decoration-none">
            {t('signUp')}
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Login
