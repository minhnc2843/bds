import { Navigate } from 'react-router-dom'
import useAuthStore from '../../store/authStore'

// Bảo vệ route cần đăng nhập
export function ProtectedRoute({ children }) {
  const { user } = useAuthStore()
  if (!user) return <Navigate to="/login" replace />
  return children
}

// Bảo vệ route chỉ dành cho Admin
export function AdminRoute({ children }) {
  const { user } = useAuthStore()
  if (!user) return <Navigate to="/login" replace />
  if (user.role !== 'admin') return <Navigate to="/" replace />
  return children
}