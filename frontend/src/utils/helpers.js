import moment from 'moment'

export const formatCurrency = (amount, currency = '৳') => {
  if (amount === undefined || amount === null) return `${currency}0`
  return `${currency}${Number(amount).toLocaleString('en-BD')}`
}

export const formatDate = (date, format = 'DD MMM YYYY') => {
  if (!date) return 'N/A'
  return moment(date).format(format)
}

export const formatDateTime = (date) => {
  if (!date) return 'N/A'
  return moment(date).format('DD MMM YYYY, hh:mm A')
}

export const getStatusBadge = (status) => {
  const map = {
    active: 'success',
    inactive: 'danger',
    expired: 'warning',
    paid: 'success',
    unpaid: 'danger',
    partial: 'warning',
    pending: 'info',
    open: 'primary',
    closed: 'secondary',
    inProgress: 'warning',
    connected: 'success',
    disconnected: 'danger',
  }
  return map[status] || 'secondary'
}

export const getStatusLabel = (status) => {
  const map = {
    active: 'Active',
    inactive: 'Inactive',
    expired: 'Expired',
    paid: 'Paid',
    unpaid: 'Unpaid',
    partial: 'Partial',
    pending: 'Pending',
    open: 'Open',
    closed: 'Closed',
    inProgress: 'In Progress',
  }
  return map[status] || status
}

export const truncateText = (text, len = 30) => {
  if (!text) return ''
  return text.length > len ? `${text.substring(0, len)}...` : text
}

export const getInitials = (name) => {
  if (!name) return '?'
  const parts = name.trim().split(' ')
  if (parts.length === 1) return parts[0][0].toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

export const getMonthName = (month) => {
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]
  return months[(month - 1) % 12]
}

export const getCurrentYears = (count = 5) => {
  const year = new Date().getFullYear()
  return Array.from({ length: count }, (_, i) => year - i)
}

export const buildQueryParams = (params) => {
  return Object.entries(params)
    .filter(([, v]) => v !== '' && v !== null && v !== undefined)
    .reduce((acc, [k, v]) => ({ ...acc, [k]: v }), {})
}
