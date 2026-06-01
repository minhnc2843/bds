import { useState } from 'react'
import { FaBan, FaTrash, FaSearch, FaUnlock } from 'react-icons/fa'
import toast from 'react-hot-toast'
import {
  useAdminUsers,
  useToggleBanUser,
  useAdminDeleteUser,
} from '../../hooks/useListings'
import Spinner from '../../components/ui/Spinner'
import Pagination from '../../components/ui/Pagination'
import { formatDate } from '../../utils/format'
import useAuthStore from '../../store/authStore'

export default function AdminUsers() {
  const { user: currentUser }  = useAuthStore()
  const [filters, setFilters]  = useState({ page: 1 })
  const [keyword, setKeyword]  = useState('')

  const { data, isLoading } = useAdminUsers(filters)
  const banMutation         = useToggleBanUser()
  const deleteMutation      = useAdminDeleteUser()

  const handleSearch = (e) => {
    e.preventDefault()
    setFilters({ keyword, page: 1 })
  }

  const handleBan = async (user) => {
    const action = user.banned_at ? 'mở khóa' : 'khóa'
    if (!window.confirm(`${action} tài khoản "${user.name}"?`)) return
    try {
      await banMutation.mutateAsync(user.id)
      toast.success(`Đã ${action} tài khoản`)
    } catch { toast.error('Thao tác thất bại') }
  }

  const handleDelete = async (user) => {
    if (!window.confirm(
      `Xóa tài khoản "${user.name}"?\nTất cả tin đăng của họ cũng sẽ bị xóa!`
    )) return
    try {
      await deleteMutation.mutateAsync(user.id)
      toast.success('Đã xóa tài khoản')
    } catch { toast.error('Xóa thất bại') }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-1">Quản lý người dùng</h1>
      <p className="text-sm text-gray-400 mb-6">Danh sách tài khoản trong hệ thống</p>

      {/* Search */}
      <div className="bg-white rounded-2xl p-4 shadow-sm mb-4">
        <form onSubmit={handleSearch} className="flex gap-2">
          <input value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="Tìm tên, email, số điện thoại..."
            className="flex-1 border border-gray-200 rounded-xl px-4 py-2
              text-sm focus:outline-none focus:ring-2 focus:ring-orange-300" />
          <button type="submit"
            className="bg-orange-500 hover:bg-orange-600 text-white
              px-4 py-2 rounded-xl flex items-center gap-2 text-sm">
            <FaSearch /> Tìm
          </button>
        </form>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        {isLoading ? <Spinner /> : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-gray-500 text-xs">
                  <tr>
                    <th className="px-4 py-3 text-left">Người dùng</th>
                    <th className="px-4 py-3 text-left">Điện thoại</th>
                    <th className="px-4 py-3 text-left">Số tin đăng</th>
                    <th className="px-4 py-3 text-left">Ngày tham gia</th>
                    <th className="px-4 py-3 text-left">Quyền</th>
                    <th className="px-4 py-3 text-left">Trạng thái</th>
                    <th className="px-4 py-3 text-center">Hành động</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {data?.data?.length === 0 && (
                    <tr>
                      <td colSpan={7}
                        className="text-center py-12 text-gray-400">
                        Không có người dùng nào
                      </td>
                    </tr>
                  )}
                  {data?.data?.map((user) => (
                    <tr key={user.id}
                      className="hover:bg-gray-50 transition">
                      {/* Người dùng */}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-orange-100 rounded-full
                            flex items-center justify-center text-orange-500
                            font-bold text-sm shrink-0">
                            {user.name?.[0]?.toUpperCase()}
                          </div>
                          <div>
                            <p className="font-medium text-gray-700">
                              {user.name}
                              {user.id === currentUser?.id && (
                                <span className="ml-1 text-xs text-orange-400">(Bạn)</span>
                              )}
                            </p>
                            <p className="text-xs text-gray-400">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      {/* Phone */}
                      <td className="px-4 py-3 text-xs text-gray-500">
                        {user.phone || '—'}
                      </td>
                      {/* Số tin */}
                      <td className="px-4 py-3">
                        <span className="bg-blue-50 text-blue-600 text-xs
                          font-semibold px-2 py-0.5 rounded-full">
                          {user.listings_count} tin
                        </span>
                      </td>
                      {/* Ngày tham gia */}
                      <td className="px-4 py-3 text-xs text-gray-400">
                        {formatDate(user.created_at)}
                      </td>
                      {/* Quyền */}
                      <td className="px-4 py-3">
                        <span className={`text-xs font-bold px-2 py-0.5
                          rounded-full ${
                            user.role === 'admin'
                              ? 'bg-purple-100 text-purple-600'
                              : 'bg-gray-100 text-gray-500'
                          }`}>
                          {user.role === 'admin' ? 'Admin' : 'User'}
                        </span>
                      </td>
                      {/* Trạng thái */}
                      <td className="px-4 py-3">
                        <span className={`text-xs px-2 py-0.5 rounded-full
                          font-medium ${
                            user.banned_at
                              ? 'bg-red-100 text-red-600'
                              : 'bg-green-100 text-green-600'
                          }`}>
                          {user.banned_at ? '🔒 Đã khóa' : '✅ Hoạt động'}
                        </span>
                      </td>
                      {/* Actions */}
                      <td className="px-4 py-3">
                        {user.id !== currentUser?.id && (
                          <div className="flex items-center justify-center gap-1">
                            <button
                              onClick={() => handleBan(user)}
                              disabled={banMutation.isPending}
                              className={`p-1.5 rounded-lg transition
                                ${user.banned_at
                                  ? 'text-gray-400 hover:text-green-500 hover:bg-green-50'
                                  : 'text-gray-400 hover:text-yellow-500 hover:bg-yellow-50'
                                }`}
                              title={user.banned_at ? 'Mở khóa' : 'Khóa'}>
                              {user.banned_at
                                ? <FaUnlock size={13} />
                                : <FaBan size={13} />}
                            </button>
                            <button
                              onClick={() => handleDelete(user)}
                              disabled={deleteMutation.isPending}
                              className="p-1.5 text-gray-400 hover:text-red-500
                                hover:bg-red-50 rounded-lg transition"
                              title="Xóa tài khoản">
                              <FaTrash size={13} />
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="px-4 pb-4">
              <Pagination
                meta={data}
                onPageChange={(page) =>
                  setFilters((f) => ({ ...f, page }))}
              />
            </div>
          </>
        )}
      </div>
    </div>
  )
}