import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost/bds-api/public/api',
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
})

// Tự động đính kèm token vào mọi request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Xử lý lỗi toàn cục
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default api