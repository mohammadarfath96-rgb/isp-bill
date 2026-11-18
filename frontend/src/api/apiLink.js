import axios from 'axios'
import { store } from '../app/store'
import { logOut } from '../features/authSlice'

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:9009/api/v1'

// Authenticated instance
const apiLink = axios.create({
  baseURL: BASE_URL,
})

apiLink.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('ispToken')
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

apiLink.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      store.dispatch(logOut())
      localStorage.removeItem('ispToken')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// Public instance (no auth interceptor)
export const publicRequest = axios.create({
  baseURL: BASE_URL,
})

export default apiLink
