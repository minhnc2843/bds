import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  FaPlus, FaEdit, FaTrash, FaEye,
  FaClock, FaCheckCircle, FaTimesCircle, FaHourglass
} from 'react-icons/fa'
import toast from 'react-hot-toast'
import { useMyListings, useDeleteListing } from '../hooks/useListings'
import Spinner from '../components/ui/Spinner'
import { formatPrice, formatArea, formatDate, typeLabel } from '../utils/format'

export default function MyListings() {
  const { data, isLoading }  = useMyListings()
  const deleteMutation       = useDeleteListing()
  const [deletingId, setDeletingId] = useState(null)

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Xóa tin "${title}"?`)) return
    setDeletingId(id)
    try {
      await deleteMutation.mutateAsync(id)
      toast.success('Đã xóa tin đăng')
    } catch {
      toast.error('Xóa thất bại, thử lại sau')
    } finally {
      setDeletingId(null)
    }
  }

  const statusConfig = {
    pending:  { label: 'Chờ duyệt',     icon: <FaClock />,        cls: 'bg-yellow-100 text-yellow-700' },
    active:   { label: 'Đang hiển thị', icon: <FaCheckCircle />,  cls: 'bg-green-100 text-green-700'  },
    rejected: { label: 'Bị từ chối',    icon: <FaTimesCircle />,  cls: 'bg-red-100 text-red-600'      },
    expired:  { label: 'Hết hạn',       icon: <FaHourglass />,    cls: 'bg-gray-100 text-gray-500'    },
  }

  return (
    <main className="max-w-5xl mx-auto px-4 py-8">

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Tin đăng của tôi</h1>
          <p className="text-sm text-gray-400 mt-0.5">
            Quản lý toàn bộ tin bất động sản bạn đã đăng
          </p>
        </div>
        <Link to="/listings/create"
          className="bg-orange-500 hover:bg-orange-600 text-white
            text-sm font-semibold px-4 py-2.5 rounded-xl
            flex items-center gap-2 transition">
          <FaPlus /> Đăng tin mới
        </Link>
      </div>

      {/* Thống kê nhanh */}
      {data && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          {Object.entries(statusConfig).map(([key, cfg]) => {
            const count = data.data.filter((l) => l.status === key).length
            return (
              <div key={key}
                className="bg-white rounded-xl p-4 shadow-sm text-center">
                <p className="text-2xl font-bold text-gray-800">{count}</p>
                <p className={`text-xs mt-1 font-medium inline-flex items-center
                  gap-1 px-2 py-0.5 rounded-full ${cfg.cls}`}>
                  {cfg.icon} {cfg.label}
                </p>
              </div>
            )
          })}
        </div>
      )}

      {/* Danh sách */}
      {isLoading && <Spinner />}

      {data?.data?.length === 0 && (
        <div className="text-center py-20 bg-white rounded-2xl shadow-sm">
          <p className="text-5xl mb-4">🏠</p>
          <p className="text-gray-500 font-medium">Bạn chưa có tin đăng nào</p>
          <Link to="/listings/create"
            className="mt-4 inline-block bg-orange-500 hover:bg-orange-600
              text-white text-sm font-semibold px-6 py-2.5 rounded-xl transition">
            Đăng tin ngay
          </Link>
        </div>
      )}

      {data?.data?.length > 0 && (
        <div className="space-y-4">
          {data.data.map((listing) => {
            const type   = typeLabel(listing.type)
            const status = statusConfig[listing.status] || statusConfig.pending
            const imgUrl = listing.primary_image
              ? `http://localhost/bds-api/public/storage/${listing.primary_image.image_path}`
              : 'https://placehold.co/120x90?text=No+Image'

            return (
              <div key={listing.id}
                className="bg-white rounded-2xl shadow-sm p-4
                  flex gap-4 items-start hover:shadow-md transition">

                {/* Ảnh */}
                <img src={imgUrl} alt={listing.title}
                  className="w-28 h-20 object-cover rounded-xl shrink-0" />

                {/* Nội dung */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    {/* Badge loại */}
                    <span className={`text-xs font-bold px-2 py-0.5
                      rounded ${type.color}`}>
                      {type.label}
                    </span>
                    {/* Badge status */}
                    <span className={`text-xs font-medium px-2 py-0.5
                      rounded-full inline-flex items-center gap-1 ${status.cls}`}>
                      {status.icon} {status.label}
                    </span>
                  </div>

                  <h3 className="font-semibold text-gray-800 text-sm
                    line-clamp-1 mb-1">
                    {listing.title}
                  </h3>

                  <div className="flex flex-wrap gap-3 text-xs text-gray-400">
                    <span className="text-orange-500 font-bold">
                      {formatPrice(listing.price)}
                      {listing.type === 'rent' && '/tháng'}
                    </span>
                    <span>{formatArea(listing.area)}</span>
                    <span>{listing.province?.name}</span>
                    <span>Đăng: {formatDate(listing.created_at)}</span>
                    {listing.expired_at && (
                      <span>Hết hạn: {formatDate(listing.expired_at)}</span>
                    )}
                  </div>

                  {/* Lý do từ chối */}
                  {listing.status === 'rejected' && (
                    <p className="text-xs text-red-400 mt-2 bg-red-50
                      px-3 py-1.5 rounded-lg">
                      ⚠️ Tin bị từ chối. Vui lòng chỉnh sửa và đăng lại.
                    </p>
                  )}
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-2 shrink-0">
                  <Link to={`/listings/${listing.id}`}
                    className="flex items-center gap-1.5 text-xs text-gray-500
                      hover:text-orange-500 border border-gray-200
                      hover:border-orange-300 px-3 py-1.5 rounded-lg transition">
                    <FaEye size={11} /> Xem
                  </Link>
                  <Link to={`/listings/${listing.id}/edit`}
                    className="flex items-center gap-1.5 text-xs text-gray-500
                      hover:text-blue-500 border border-gray-200
                      hover:border-blue-300 px-3 py-1.5 rounded-lg transition">
                    <FaEdit size={11} /> Sửa
                  </Link>
                  <button
                    onClick={() => handleDelete(listing.id, listing.title)}
                    disabled={deletingId === listing.id}
                    className="flex items-center gap-1.5 text-xs text-gray-500
                      hover:text-red-500 border border-gray-200
                      hover:border-red-300 px-3 py-1.5 rounded-lg transition
                      disabled:opacity-50">
                    <FaTrash size={11} />
                    {deletingId === listing.id ? '...' : 'Xóa'}
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </main>
  )
}