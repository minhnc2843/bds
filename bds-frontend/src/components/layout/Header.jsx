import { useState, useEffect } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import {
  FaBars, FaTimes, FaUser, FaSignOutAlt,
  FaTachometerAlt, FaBell, FaChevronDown,
} from 'react-icons/fa'
import useAuthStore from '../../store/authStore'
import { useNotifications } from '../../hooks/useNotifications'
import api from '../../api/axios'
import toast from 'react-hot-toast'

export default function Header() {
  const { user, logout, isAdmin } = useAuthStore()
  const navigate   = useNavigate()
  const [mobileOpen, setMobileOpen]   = useState(false)
  const [scrolled,   setScrolled]     = useState(false)
  const [userMenu,   setUserMenu]     = useState(false)

  const { unreadCount } = useNotifications()

  // Hiệu ứng scroll
  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handler)
    return () => window.removeEventListener('scroll', handler)
  }, [])

  const handleLogout = async () => {
    try { await api.post('/auth/logout') } finally {
      logout()
      toast.success('Đã đăng xuất')
      navigate('/')
    }
  }

  const navLinks = [
    { to: '/',          label: 'Trang chủ' },
    { to: '/search?type=sale', label: 'Mua bán' },
    { to: '/search?type=rent', label: 'Cho thuê' },
    { to: '/blog',      label: 'Tin tức' },
    { to: '/pages/gioi-thieu', label: 'Giới thiệu' },
    { to: '/contact',   label: 'Liên hệ' },
  ]

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300
      ${scrolled
        ? 'glass border-b border-dark-400 shadow-gold-sm'
        : 'bg-transparent'
      }`}>

      <div className="max-w-7xl mx-auto px-4 h-18 flex items-center justify-between py-4">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 shrink-0">
          <div className="w-10 h-10 bg-gold-gradient rounded-xl
            flex items-center justify-center text-dark-900 font-bold text-lg shadow-gold">
            B
          </div>
          <div>
            <span className="font-display font-bold text-xl text-cream">
              BĐS<span className="text-gold">Việt</span>
            </span>
            <p className="text-xs text-surface hidden sm:block leading-none">
              Bất động sản cao cấp
            </p>
          </div>
        </Link>

        {/* Nav desktop */}
        <nav className="hidden lg:flex items-center gap-1">
          {navLinks.map((link) => (
            <NavLink key={link.to} to={link.to}
              className={({ isActive }) =>
                `px-4 py-2 rounded-xl text-sm font-medium transition-all
                ${isActive
                  ? 'text-gold bg-gold/10'
                  : 'text-cream/70 hover:text-gold hover:bg-gold/5'
                }`
              }>
              {link.label}
            </NavLink>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-3">

          {user ? (
            <>
              {/* Đăng tin */}
              <Link to="/listings/create"
                className="hidden sm:flex items-center gap-2
                  bg-gold hover:bg-gold-light text-dark-900
                  font-semibold text-sm px-4 py-2 rounded-xl transition-all
                  shadow-gold-sm hover:shadow-gold">
                + Đăng tin
              </Link>

              {/* Notification bell */}
              <Link to="/notifications"
                className="relative w-9 h-9 bg-dark-600 hover:bg-dark-500
                  border border-dark-400 hover:border-gold/50
                  rounded-xl flex items-center justify-center
                  text-cream/70 hover:text-gold transition-all">
                <FaBell size={15} />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5
                    bg-gold text-dark-900 text-xs font-bold
                    rounded-full flex items-center justify-center">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </Link>

              {/* User menu */}
              <div className="relative">
                <button
                  onClick={() => setUserMenu((v) => !v)}
                  className="flex items-center gap-2 bg-dark-600
                    hover:bg-dark-500 border border-dark-400
                    hover:border-gold/50 rounded-xl px-3 py-2
                    text-cream/70 hover:text-gold transition-all">
                  <div className="w-6 h-6 bg-gold/20 rounded-full
                    flex items-center justify-center">
                    <FaUser size={11} className="text-gold" />
                  </div>
                  <span className="hidden sm:block text-sm font-medium max-w-24 truncate">
                    {user.name}
                  </span>
                  <FaChevronDown size={10} className={`transition-transform
                    ${userMenu ? 'rotate-180' : ''}`} />
                </button>

                {/* Dropdown */}
                {userMenu && (
                  <div className="absolute right-0 top-full mt-2 w-52
                    bg-dark-700 border border-dark-400 rounded-2xl
                    shadow-2xl overflow-hidden z-50">
                    <div className="px-4 py-3 border-b border-dark-400">
                      <p className="text-sm font-semibold text-cream truncate">
                        {user.name}
                      </p>
                      <p className="text-xs text-surface truncate">{user.email}</p>
                    </div>
                    {[
                      { to: '/profile',     label: 'Hồ sơ cá nhân', icon: <FaUser size={12}/> },
                      { to: '/my-listings', label: 'Tin của tôi',    icon: null },
                      ...(isAdmin() ? [{ to: '/admin', label: 'Quản trị', icon: <FaTachometerAlt size={12}/> }] : []),
                    ].map((item) => (
                      <Link key={item.to} to={item.to}
                        onClick={() => setUserMenu(false)}
                        className="flex items-center gap-3 px-4 py-2.5
                          text-sm text-cream/70 hover:text-gold
                          hover:bg-dark-600 transition">
                        {item.icon && <span className="text-gold">{item.icon}</span>}
                        {item.label}
                      </Link>
                    ))}
                    <button onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-2.5
                        text-sm text-red-400 hover:bg-red-900/20 transition
                        border-t border-dark-400">
                      <FaSignOutAlt size={12} /> Đăng xuất
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link to="/login"
                className="text-sm text-cream/70 hover:text-gold
                  font-medium transition hidden sm:block">
                Đăng nhập
              </Link>
              <Link to="/register"
                className="bg-gold hover:bg-gold-light text-dark-900
                  font-semibold text-sm px-4 py-2 rounded-xl
                  transition-all shadow-gold-sm hover:shadow-gold">
                Đăng ký
              </Link>
            </>
          )}

          {/* Mobile menu button */}
          <button onClick={() => setMobileOpen((v) => !v)}
            className="lg:hidden w-9 h-9 bg-dark-600 border border-dark-400
              rounded-xl flex items-center justify-center text-cream/70">
            {mobileOpen ? <FaTimes size={16} /> : <FaBars size={16} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="lg:hidden glass border-t border-dark-400 px-4 py-4 space-y-1">
          {navLinks.map((link) => (
            <Link key={link.to} to={link.to}
              onClick={() => setMobileOpen(false)}
              className="block px-4 py-2.5 rounded-xl text-sm
                text-cream/70 hover:text-gold hover:bg-gold/5 transition">
              {link.label}
            </Link>
          ))}
          {user ? (
            <Link to="/listings/create"
              onClick={() => setMobileOpen(false)}
              className="block text-center mt-3 bg-gold text-dark-900
                font-bold py-3 rounded-xl text-sm">
              + Đăng tin mới
            </Link>
          ) : (
            <div className="flex gap-3 mt-3">
              <Link to="/login" onClick={() => setMobileOpen(false)}
                className="flex-1 text-center border border-gold text-gold
                  font-semibold py-2.5 rounded-xl text-sm">
                Đăng nhập
              </Link>
              <Link to="/register" onClick={() => setMobileOpen(false)}
                className="flex-1 text-center bg-gold text-dark-900
                  font-bold py-2.5 rounded-xl text-sm">
                Đăng ký
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  )
}