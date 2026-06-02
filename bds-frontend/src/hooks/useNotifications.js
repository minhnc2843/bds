import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '../api/axios'
import useAuthStore from '../store/authStore'

export const useNotifications = () => {
  const { user } = useAuthStore()

  const { data, isLoading } = useQuery({
    queryKey: ['notifications'],
    queryFn: async () => {
      const { data } = await api.get('/notifications')
      return data
    },
    enabled: !!user,
    refetchInterval: 1000 * 30, // poll mỗi 30 giây
  })

  return {
    notifications: data?.notifications?.data || [],
    unreadCount:   data?.unread_count || 0,
    isLoading,
  }
}

export const useMarkAllRead = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: () => api.patch('/notifications/read-all'),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] })
    },
  })
}