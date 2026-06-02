import { FaBell, FaCheck, FaCheckDouble, FaTrash, FaHome } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import api from '../api/axios'
import { useNotifications, useMarkAllRead } from '../hooks/useNotifications'
import { formatDate } from '../utils/format'
import Spinner from '../components/ui/Spinner'

export default function Notifications() {
  const queryClient = useQueryClient()
  const { notifications, unreadCount, isLoading } = useNotifications()
  const markAllMutation = useMarkAllRead()

  // Đánh dấu 1 thông báo đã đọc
  const markReadMutation = useMutation({
    mutationFn: (id) => api.patch(`/notifications/${id}/read`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] })
    },
  })

  // Xóa 1 thông báo
  const deleteMutation = useMutation({
    mutationFn: (id) => api.delete(`/notifications/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] })
      toast.success('Đã xóa thông báo')
    },
  })

  const iconConfig = {
    listing_approved: { icon: '✅', color: 'bg-green-500/20 border-green-500/30' },
    listing_rejected: { icon: '❌', color: 'bg-red-500/20 border-red-500/30'    },
    new_listing:      { icon: '📋', color: 'bg-gold/20 border-gold/30'           },
    new_contact:      { icon: '💬', color: 'bg-blue-500/20 border-blue-500/30'  },
  }

  return (
    <main className="max-w-2xl mx-auto px-4 py-8">

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-cream flex items-center gap-3">
            <FaBell className="text-gold" />
            Thông báo
            {unreadCount > 0 && (
              <span className="bg-gold text-dark-900 text-sm font-bold
                px-2.5 py-0.5 rounded-full">
                {unreadCount}
              </span>
            )}
          </h1>
          <p className="text-surface text-sm mt-0.5">
            Cập nhật về tin đăng và hoạt động của bạn
          </p>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={() => markAllMutation.mutate()}
            disabled={markAllMutation.isPending}
            className="flex items-center gap-2 text-sm text-gold
              hover:text-gold-light border border-gold/30
              hover:border-gold px-4 py-2 rounded-xl transition-all">
            <FaCheckDouble size={13} />
            Đọc tất cả
          </button>
        )}
      </div>

      {/* Content */}
      {isLoading && <Spinner />}

      {!isLoading && notifications.length === 0 && (
        <div className="text-center py-20 bg-dark-700 rounded-2xl
          border border-dark-400">
          <FaBell className="text-5xl text-dark-400 mx-auto mb-4" />
          <p className="text-cream font-semibold mb-2">Chưa có thông báo nào</p>
          <p className="text-surface text-sm">
            Thông báo sẽ xuất hiện khi có hoạt động mới
          </p>
        </div>
      )}

      <div className="space-y-3">
        {notifications.map((notif) => {
          const cfg = iconConfig[notif.type] || {
            icon: '🔔',
            color: 'bg-dark-500 border-dark-400',
          }

          return (
            <div key={notif.id}
              className={`relative bg-dark-700 border rounded-2xl p-4
                transition-all duration-200 group
                ${notif.is_read
                  ? 'border-dark-400'
                  : 'border-gold/30 shadow-gold-sm'
                }`}>

              {/* Dot chưa đọc */}
              {!notif.is_read && (
                <div className="absolute top-4 right-4 w-2 h-2
                  bg-gold rounded-full" />
              )}

              <div className="flex gap-4 items-start">
                {/* Icon */}
                <div className={`w-11 h-11 rounded-xl border flex items-center
                  justify-center text-xl shrink-0 ${cfg.color}`}>
                  {cfg.icon}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0 pr-6">
                  <p className={`font-semibold text-sm mb-0.5
                    ${notif.is_read ? 'text-cream/80' : 'text-cream'}`}>
                    {notif.title}
                  </p>
                  {notif.body && (
                    <p className="text-surface text-xs leading-relaxed mb-2">
                      {notif.body}
                    </p>
                  )}
                  <div className="flex items-center gap-4">
                    <p className="text-surface text-xs">
                      {formatDate(notif.created_at)}
                    </p>
                    {/* Link đến listing nếu có */}
                    {notif.data?.listing_id && (
                      <Link
                        to={`/listings/${notif.data.listing_id}`}
                        className="text-xs text-gold hover:text-gold-light
                          flex items-center gap-1 transition">
                        <FaHome size={10} /> Xem tin đăng
                      </Link>
                    )}
                  </div>
                </div>
              </div>

              {/* Actions (hiện khi hover) */}
              <div className="absolute top-3 right-3 items-center gap-1
                hidden group-hover:flex">
                {!notif.is_read && (
                  <button
                    onClick={() => markReadMutation.mutate(notif.id)}
                    className="w-7 h-7 bg-dark-600 hover:bg-green-900/30
                      border border-dark-400 hover:border-green-500/50
                      rounded-lg flex items-center justify-center
                      text-surface hover:text-green-400 transition"
                    title="Đánh dấu đã đọc">
                    <FaCheck size={10} />
                  </button>
                )}
                <button
                  onClick={() => deleteMutation.mutate(notif.id)}
                  className="w-7 h-7 bg-dark-600 hover:bg-red-900/30
                    border border-dark-400 hover:border-red-500/50
                    rounded-lg flex items-center justify-center
                    text-surface hover:text-red-400 transition"
                  title="Xóa thông báo">
                  <FaTrash size={10} />
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </main>
  )
}