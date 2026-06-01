import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  FaCheck, FaTimes, FaTrash,
  FaEye, FaSearch,
} from 'react-icons/fa'
import toast from 'react-hot-toast'
import {
  useAdminListings,
  useApproveListing,
  useRejectListing,
  useAdminDeleteListing,
} from '../../hooks/useListings'
import Spinner from '../../components/ui/Spinner'
import Pagination from '../../components/ui/Pagination'
import { formatPrice, formatArea, formatDate, typeLabel } from '../../utils/format'

const STATUS_TABS = [
  { value: '',         label: 'Tất cả'       },
  { value: 'pending',  label: 'Chờ duyệt'    },
  { value: 'active',   label: 'Đang hiển thị'},
  { value: 'rejected', label: 'Từ chối'      },
]

export default function AdminListings() {
  const [filters, setFilters] = useState({ status: 'pending', page: 1 })
  const [keyword, setKeyword] = useState('')

  const { data, isLoading }  = useAdminListings(filters)
  const approveMutation      = useApproveListing()
  const rejectMutation       = useRejectListing()
  const deleteMutation       = useAdminDeleteListing()

  const handleSearch = (e) => {
    e.preventDefault()
    setFilters((f) => ({ ...f, keyword, page: 1 }))
  }

  const handleApprove = async (id) => {
    try {
      await approveMutation.mutateAsync(id)
      toast.success('Đã duyệt tin')
    } catch { toast.error('Thao tác thất bại') }
  }

  const handleReject = async (id) => {
    if (!window.confirm('Từ chối tin đăng này?')) return
    try {
      await rejectMutation.mutateAsync(id)
      toast.success('Đã từ chối tin')
    } catch { toast.error('Thao tác thất bại') }
  }

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Xóa vĩnh viễn tin "${title}"?`)) return
    try {
      await deleteMutation.mutateAsync(id)
      toast.success('Đã xóa tin')
    } catch { toast.error('Xóa thất bại') }
  }

  const statusCls = {
    pending:  'bg-yellow-100 text-yellow-700',
    active:   'bg-green-100 text-green-700',
    rejected: 'bg-red-100 text-red-600',
    expired:  'bg-gray-100 text-gray-500',
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-1">Quản lý tin đăng</h1>
      <p className="text-sm text-gray-400 mb-6">Duyệt và quản lý tin bất động sản</p>

      {/* Toolbar */}
      <div className="bg-white rounded-2xl p-4 shadow-sm mb-4
        flex flex-col sm:flex-row gap-3">

        {/* Tabs status */}
        <div className="flex gap-1 flex-wrap">
          {STATUS_TABS.map((tab) => (
            <button key={tab.value}
              onClick={() => setFilters({ status: tab.value, page: 1 })}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition
                ${filters.status === tab.value
                  ? 'bg-orange-500 text-white'
                  : 'bg-gray-100 text-gray-500 hover:bg-orange-50 hover:text-orange-500'
                }`}>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <form onSubmit={handleSearch}
          className="flex gap-2 ml-auto">
          <input value={keyword} onChange={(e) => setKeyword(e.target.value)}
            placeholder="Tìm tiêu đề, địa chỉ..."
            className="border border-gray-200 rounded-xl px-3 py-1.5 text-sm
              focus:outline-none focus:ring-2 focus:ring-orange-300 w-48" />
          <button type="submit"
            className="bg-orange-500 hover:bg-orange-600 text-white
              px-3 py-1.5 rounded-xl text-sm">
            <FaSearch />
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
                    <th className="px-4 py-3 text-left">Tin đăng</th>
                    <th className="px-4 py-3 text-left">Loại</th>
                    <th className="px-4 py-3 text-left">Giá</th>
                    <th className="px-4 py-3 text-left">Người đăng</th>
                    <th className="px-4 py-3 text-left">Ngày đăng</th>
                    <th className="px-4 py-3 text-left">Trạng thái</th>
                    <th className="px-4 py-3 text-center">Hành động</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {data?.data?.length === 0 && (
                    <tr>
                      <td colSpan={7}
                        className="text-center py-12 text-gray-400">
                        Không có tin đăng nào
                      </td>
                    </tr>
                  )}
                  {data?.data?.map((listing) => {
                    const type = typeLabel(listing.type)
                    return (
                      <tr key={listing.id}
                        className="hover:bg-gray-50 transition">
                        {/* Tin đăng */}
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <img
                              src={listing.primary_image
                                ? `http://localhost/bds-api/public/storage/${listing.primary_image.image_path}`
                                : 'https://placehold.co/60x40?text=No'}
                              alt=""
                              className="w-14 h-10 object-cover rounded-lg shrink-0" />
                            <div>
                              <p className="font-medium text-gray-700
                                line-clamp-1 max-w-48">
                                {listing.title}
                              </p>
                              <p className="text-xs text-gray-400">
                                {listing.province?.name}
                              </p>
                            </div>
                          </div>
                        </td>
                        {/* Loại */}
                        <td className="px-4 py-3">
                          <span className={`text-xs font-bold px-2 py-0.5
                            rounded ${type.color}`}>
                            {type.label}
                          </span>
                        </td>
                        {/* Giá */}
                        <td className="px-4 py-3">
                          <p className="font-medium text-orange-500 text-xs">
                            {formatPrice(listing.price)}
                          </p>
                          <p className="text-xs text-gray-400">
                            {formatArea(listing.area)}
                          </p>
                        </td>
                        {/* Người đăng */}
                        <td className="px-4 py-3">
                          <p className="text-xs font-medium text-gray-700">
                            {listing.user?.name}
                          </p>
                          <p className="text-xs text-gray-400">
                            {listing.user?.phone}
                          </p>
                        </td>
                        {/* Ngày */}
                        <td className="px-4 py-3 text-xs text-gray-400">
                          {formatDate(listing.created_at)}
                        </td>
                        {/* Status */}
                        <td className="px-4 py-3">
                          <span className={`text-xs px-2 py-0.5 rounded-full
                            font-medium ${statusCls[listing.status]}`}>
                            {listing.status}
                          </span>
                        </td>
                        {/* Actions */}
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-center gap-1">
                            <Link to={`/listings/${listing.id}`}
                              target="_blank"
                              className="p-1.5 text-gray-400 hover:text-blue-500
                                hover:bg-blue-50 rounded-lg transition"
                              title="Xem">
                              <FaEye size={13} />
                            </Link>
                            {listing.status === 'pending' && (
                              <>
                                <button
                                  onClick={() => handleApprove(listing.id)}
                                  disabled={approveMutation.isPending}
                                  className="p-1.5 text-gray-400 hover:text-green-500
                                    hover:bg-green-50 rounded-lg transition"
                                  title="Duyệt">
                                  <FaCheck size={13} />
                                </button>
                                <button
                                  onClick={() => handleReject(listing.id)}
                                  disabled={rejectMutation.isPending}
                                  className="p-1.5 text-gray-400 hover:text-yellow-500
                                    hover:bg-yellow-50 rounded-lg transition"
                                  title="Từ chối">
                                  <FaTimes size={13} />
                                </button>
                              </>
                            )}
                            <button
                              onClick={() => handleDelete(listing.id, listing.title)}
                              disabled={deleteMutation.isPending}
                              className="p-1.5 text-gray-400 hover:text-red-500
                                hover:bg-red-50 rounded-lg transition"
                              title="Xóa">
                              <FaTrash size={13} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
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