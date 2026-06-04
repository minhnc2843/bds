import { useEffect, useRef } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { getEcho, destroyEcho } from '../utils/echo'
import useAuthStore from '../store/authStore'

// Hook lắng nghe thông báo realtime cho user
export const useRealtimeNotifications = () => {
  const { user }       = useAuthStore()
  const queryClient    = useQueryClient()
  const channelRef     = useRef(null)

  useEffect(() => {
    if (!user) return

    const echo    = getEcho()
    const channel = echo.private(`user.${user.id}`)
    channelRef.current = channel

    // Lắng nghe sự kiện duyệt/từ chối tin
    channel.listen('.listing.status.changed', (data) => {
      // Cập nhật cache notifications
      queryClient.invalidateQueries({ queryKey: ['notifications'] })
      queryClient.invalidateQueries({ queryKey: ['my-listings'] })

      // Toast thông báo
      if (data.status === 'active') {
        toast.custom((t) => (
          <NotificationToast
            t={t}
            type="success"
            title="Tin đăng được duyệt ✅"
            message={data.message}
          />
        ), { duration: 6000 })
      } else {
        toast.custom((t) => (
          <NotificationToast
            t={t}
            type="error"
            title="Tin đăng bị từ chối ❌"
            message={data.message}
          />
        ), { duration: 6000 })
      }
    })

    return () => {
      channel.stopListening('.listing.status.changed')
      echo.leave(`user.${user.id}`)
    }
  }, [user?.id])

  return null
}

// Hook lắng nghe thông báo admin
export const useRealtimeAdmin = () => {
  const { user }    = useAuthStore()
  const queryClient = useQueryClient()

  useEffect(() => {
    if (!user || user.role !== 'admin') return

    const echo    = getEcho()
    const channel = echo.channel('admin.notifications')

    channel.listen('.new.listing.submitted', (data) => {
      queryClient.invalidateQueries({ queryKey: ['admin-listings'] })
      queryClient.invalidateQueries({ queryKey: ['admin-dashboard'] })

      toast.custom((t) => (
        <NotificationToast
          t={t}
          type="info"
          title="Tin mới cần duyệt 📋"
          message={data.message}
        />
      ), { duration: 5000 })
    })

    return () => {
      channel.stopListening('.new.listing.submitted')
      echo.leave('admin.notifications')
    }
  }, [user?.id])

  return null
}

// Toast component tùy chỉnh
function NotificationToast({ t, type, title, message }) {
  const colors = {
    success: { border: 'border-green-500/50',  icon: '✅', bg: 'bg-green-500/10' },
    error:   { border: 'border-red-500/50',    icon: '❌', bg: 'bg-red-500/10'   },
    info:    { border: 'border-gold/50',        icon: '📋', bg: 'bg-gold/10'      },
  }
  const c = colors[type]

  return (
    <div className={`
      ${t.visible ? 'animate-enter' : 'animate-leave'}
      max-w-sm w-full bg-dark-700 border ${c.border}
      rounded-2xl shadow-2xl pointer-events-auto
      flex items-start gap-3 p-4`}>
      <div className={`w-10 h-10 ${c.bg} rounded-xl flex items-center
        justify-center text-lg shrink-0`}>
        {c.icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-cream font-semibold text-sm">{title}</p>
        <p className="text-surface text-xs mt-0.5 line-clamp-2">{message}</p>
      </div>
      <button onClick={() => toast.dismiss(t.id)}
        className="text-surface hover:text-cream transition shrink-0">
        ✕
      </button>
    </div>
  )
}
