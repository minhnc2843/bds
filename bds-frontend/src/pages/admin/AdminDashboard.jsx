import {
  FaListAlt, FaUsers, FaClock,
  FaCheckCircle, FaTimesCircle, FaHome,
} from 'react-icons/fa'
import { useAdminDashboard } from '../../hooks/useListings'
import Spinner from '../../components/ui/Spinner'

export default function AdminDashboard() {
  const { data, isLoading } = useAdminDashboard()

  if (isLoading) return <Spinner />

  const stats = [
    {
      label: 'Tổng tin đăng',
      value: data?.total_listings,
      icon:  <FaListAlt />,
      color: 'bg-blue-50 text-blue-500',
    },
    {
      label: 'Chờ duyệt',
      value: data?.pending_listings,
      icon:  <FaClock />,
      color: 'bg-yellow-50 text-yellow-500',
    },
    {
      label: 'Đang hiển thị',
      value: data?.active_listings,
      icon:  <FaCheckCircle />,
      color: 'bg-green-50 text-green-500',
    },
    {
      label: 'Bị từ chối',
      value: data?.rejected_listings,
      icon:  <FaTimesCircle />,
      color: 'bg-red-50 text-red-500',
    },
    {
      label: 'Tổng người dùng',
      value: data?.total_users,
      icon:  <FaUsers />,
      color: 'bg-purple-50 text-purple-500',
    },
    {
      label: 'Tin mua bán',
      value: data?.listings_sale,
      icon:  <FaHome />,
      color: 'bg-orange-50 text-orange-500',
    },
  ]

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-1">Dashboard</h1>
      <p className="text-sm text-gray-400 mb-6">Tổng quan hệ thống</p>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {stats.map((s, i) => (
          <div key={i}
            className="bg-white rounded-2xl p-5 shadow-sm
              flex items-center gap-4">
            <div className={`w-12 h-12 rounded-xl flex items-center
              justify-center text-xl ${s.color}`}>
              {s.icon}
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{s.value ?? 0}</p>
              <p className="text-xs text-gray-400 mt-0.5">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Tháng này */}
      <div className="grid grid-cols-2 gap-4">
        {[
          { label: 'Người dùng mới tháng này',  value: data?.new_users_this_month,    color: 'text-purple-500' },
          { label: 'Tin đăng mới tháng này',    value: data?.new_listings_this_month, color: 'text-orange-500' },
        ].map((s, i) => (
          <div key={i} className="bg-white rounded-2xl p-5 shadow-sm">
            <p className={`text-3xl font-bold ${s.color}`}>{s.value ?? 0}</p>
            <p className="text-sm text-gray-400 mt-1">{s.label}</p>
          </div>
        ))}
      </div>
    </div>
  )
}