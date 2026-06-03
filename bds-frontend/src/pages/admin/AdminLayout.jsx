import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import {
  FaTachometerAlt, FaListAlt, FaUsers,
  FaImage, FaFire, FaCog, FaNewspaper,
  FaEnvelope, FaFileAlt,
} from 'react-icons/fa'
import useAuthStore from '../../store/authStore'
import api from '../../api/axios'
import toast from 'react-hot-toast'
const navItems = [
  { to: '/admin',             label: 'Dashboard',   icon: <FaTachometerAlt />, end: true },
  { to: '/admin/listings',    label: 'Tin đăng',    icon: <FaListAlt />     },
  { to: '/admin/users',       label: 'Người dùng',  icon: <FaUsers />       },

  // Divider label
  { type: 'divider', label: 'NỘI DUNG' },

  { to: '/admin/posts',       label: 'Bài viết',    icon: <FaNewspaper />   },
  { to: '/admin/pages',       label: 'Trang tĩnh',  icon: <FaFileAlt />     },
  { to: '/admin/contacts',    label: 'Liên hệ',     icon: <FaEnvelope />    },

  // Divider label
  { type: 'divider', label: 'CÀI ĐẶT' },

  { to: '/admin/banners',     label: 'Banners',     icon: <FaImage />       },
  { to: '/admin/promotions',  label: 'Khuyến mãi',  icon: <FaFire />        },
  { to: '/admin/settings',    label: 'Cài đặt',     icon: <FaCog />         },
]
const navItems = [
  { to: '/admin',          label: 'Dashboard',    icon: <FaTachometerAlt />, end: true },
  { to: '/admin/listings', label: 'Tin đăng',     icon: <FaListAlt /> },
  { to: '/admin/users',    label: 'Người dùng',   icon: <FaUsers /> },
]

export default function AdminLayout() {
  const { user, logout } = useAuthStore()
  const navigate         = useNavigate()

  const handleLogout = async () => {
    try { await api.post('/auth/logout') } finally {
      logout()
      toast.success('Đã đăng xuất')
      navigate('/')
    }
  }

  const linkCls = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm
     font-medium transition ${
       isActive
         ? 'bg-orange-500 text-white shadow'
         : 'text-gray-500 hover:bg-orange-50 hover:text-orange-500'
     }`

  return (
    <div className="min-h-screen bg-gray-50 flex">

     <nav className="flex-1 p-4 space-y-0.5 overflow-y-auto">
  {navItems.map((item, i) => {
    if (item.type === 'divider') return (
      <p key={i} className="text-xs text-surface/50 uppercase
        tracking-widest px-4 pt-4 pb-1 font-semibold">
        {item.label}
      </p>
    )
    return (
      <NavLink key={item.to} to={item.to}
        end={item.end} className={linkCls}>
        <span>{item.icon}</span> {item.label}
      </NavLink>
    )
  })}
</nav>
      <aside className="w-56 bg-white shadow-sm flex flex-col
        fixed top-0 left-0 h-full z-40">

        {/* Logo */}
        <div className="p-5 border-b">
          <p className="font-bold text-orange-500 text-lg">🏠 BĐSViệt</p>
          <p className="text-xs text-gray-400 mt-0.5">Quản trị hệ thống</p>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => (
            <NavLink key={item.to} to={item.to}
              end={item.end} className={linkCls}>
              {item.icon} {item.label}
            </NavLink>
          ))}
        </nav>

        {/* User info */}
        <div className="p-4 border-t space-y-2">
          <NavLink to="/" className="flex items-center gap-2 text-xs
            text-gray-400 hover:text-orange-500 px-2 py-1.5 rounded-lg
            hover:bg-orange-50 transition">
            <FaHome /> Về trang chủ
          </NavLink>
          <div className="px-2 py-1.5">
            <p className="text-xs font-semibold text-gray-700 truncate">
              {user?.name}
            </p>
            <p className="text-xs text-gray-400 truncate">{user?.email}</p>
          </div>
          <button onClick={handleLogout}
            className="w-full flex items-center gap-2 text-xs text-red-400
              hover:bg-red-50 px-2 py-1.5 rounded-lg transition">
            <FaSignOutAlt /> Đăng xuất
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="ml-56 flex-1 p-6 min-h-screen">
        <Outlet />
      </main>
    </div>
  )
}