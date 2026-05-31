import { useQuery } from '@tanstack/react-query'
import api from '../api/axios'

// Hook lấy danh sách listings với filter
export const useListings = (filters = {}) => {
  return useQuery({
    queryKey: ['listings', filters],
    queryFn: async () => {
      const { data } = await api.get('/listings', { params: filters })
      return data
    },
    staleTime: 1000 * 60 * 2, // cache 2 phút
    keepPreviousData: true,    // giữ data cũ khi đổi trang
  })
}

// Hook lấy chi tiết 1 listing
export const useListing = (id) => {
  return useQuery({
    queryKey: ['listing', id],
    queryFn: async () => {
      const { data } = await api.get(`/listings/${id}`)
      return data
    },
    enabled: !!id,
  })
}