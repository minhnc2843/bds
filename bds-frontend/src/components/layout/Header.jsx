import { Link, useNavigate } from 'react-router-dom'
import { FaHome, FaUser, FaSignOutAlt, FaTachometerAlt } from 'react-icons/fa'
import useAuthStore from '../../store/authStore'
import api from '../../api/axios'
import toast from 'react-hot-toast'

export default function Header() {
  const { user, logout, isAdmin } = useAuthStore()
  const navigate = useNavigate()

  const handleLogout = async () => {
    try {
      await api.post('/auth/logout')
    } finally {
      logout()
      toast.success('Đã đăng xuất')
      navigate('/')
    }
  }

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 font-bold text-xl text-orange-500">
          <FaHome />
          <span>BĐS<span className="text-gray-800">Việt</span></span>
        </Link>

        {/* Nav */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-600">
          <Link to="/?type=sale"
            className="hover:text-orange-500">Mua căn hộ</Link>
          <Link to="/?type=rent"
            className="hover:text-orange-500">Cho thuê</Link>
        </nav>

        {/* Auth */}
        <div className="flex items-center gap-3">
          {user ? (
            <>
              <Link to="/listings/create"
                className="hidden sm:block bg-orange-500 hover:bg-orange-600
                  text-white text-sm font-medium px-4 py-2 rounded-lg">
                + Đăng tin
              </Link>

              {isAdmin() && (
                <Link to="/admin"
                  className="text-gray-500 hover:text-orange-500"
                  title="Admin">
                  <FaTachometerAlt size={18} />
                </Link>
              )}

              <Link to="/profile"
                className="text-gray-500 hover:text-orange-500"
                title={user.name}>
                <FaUser size={18} />
              </Link>

              <button onClick={handleLogout}
                className="text-gray-400 hover:text-red-500"
                title="Đăng xuất">
                <FaSignOutAlt size={18} />
              </button>
            </>
          ) : (
            <>
              <Link to="/login"
                className="text-sm text-gray-600 hover:text-orange-500 font-medium">
                Đăng nhập
              </Link>
              <Link to="/register"
                className="bg-orange-500 hover:bg-orange-600 text-white
                  text-sm font-medium px-4 py-2 rounded-lg">
                Đăng ký
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  )
}