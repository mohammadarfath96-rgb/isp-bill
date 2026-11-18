export const ROLES = {
  SUPER_ADMIN: 'superadmin',
  ADMIN: 'admin',
  ISP_OWNER: 'ispOwner',
  MANAGER: 'manager',
  COLLECTOR: 'collector',
  RESELLER: 'reseller',
}

export const STATUS_OPTIONS = [
  { value: '', label: 'All' },
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
  { value: 'expired', label: 'Expired' },
]

export const PAYMENT_METHODS = [
  { value: 'cash', label: 'Cash' },
  { value: 'online', label: 'Online' },
  { value: 'mobileBanking', label: 'Mobile Banking' },
  { value: 'bank', label: 'Bank Transfer' },
]

export const CUSTOMER_TYPES = [
  { value: 'pppoe', label: 'PPPoE' },
  { value: 'static', label: 'Static' },
  { value: 'hotspot', label: 'Hotspot' },
]

export const INVOICE_STATUS = [
  { value: '', label: 'All' },
  { value: 'paid', label: 'Paid' },
  { value: 'unpaid', label: 'Unpaid' },
  { value: 'partial', label: 'Partial' },
]

export const TICKET_STATUS = [
  { value: 'open', label: 'Open' },
  { value: 'inProgress', label: 'In Progress' },
  { value: 'closed', label: 'Closed' },
]

export const MONTHS = [
  { value: 1, label: 'January' },
  { value: 2, label: 'February' },
  { value: 3, label: 'March' },
  { value: 4, label: 'April' },
  { value: 5, label: 'May' },
  { value: 6, label: 'June' },
  { value: 7, label: 'July' },
  { value: 8, label: 'August' },
  { value: 9, label: 'September' },
  { value: 10, label: 'October' },
  { value: 11, label: 'November' },
  { value: 12, label: 'December' },
]

export const BILLING_DATES = Array.from({ length: 31 }, (_, i) => ({
  value: i + 1,
  label: `${i + 1}`,
}))

export const MIKROTIK_TYPES = [
  { value: 'pppoe', label: 'PPPoE' },
  { value: 'hotspot', label: 'Hotspot' },
  { value: 'both', label: 'Both' },
]

export const EXPENDITURE_CATEGORIES = [
  { value: 'salary', label: 'Salary' },
  { value: 'maintenance', label: 'Maintenance' },
  { value: 'equipment', label: 'Equipment' },
  { value: 'rent', label: 'Rent' },
  { value: 'utility', label: 'Utility' },
  { value: 'other', label: 'Other' },
]

export const ITEMS_PER_PAGE = 10
