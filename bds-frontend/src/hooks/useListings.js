import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '../api/axios'

// Hook lấy danh sách listings với filter
export const useListings = (filters = {}) => {
  return useQuery({
    queryKey: ['listings', filters],
    queryFn: async () => {
      const { data } = await api.get('/listings', { params: filters })
      return data
    },
    staleTime: 1000 * 60 * 2,
    keepPreviousData: true,
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
export const useSiteConfig = () => {
  return useQuery({
    queryKey: ['site-config'],
    queryFn: async () => {
      const { data } = await api.get('/site/config')
      return data
    },
    staleTime: 1000 * 60 * 5, // cache 5 phút
  })
}
// Hook lấy categories
export const useCategories = () => {
  return useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data } = await api.get('/categories')
      return data
    },
    staleTime: 1000 * 60 * 10, // cache 10 phút
  })
}

// Hook lấy provinces
export const useProvinces = () => {
  return useQuery({
    queryKey: ['provinces'],
    queryFn: async () => {
      const { data } = await api.get('/provinces')
      return data
    },
    staleTime: 1000 * 60 * 10,
  })
}

// Hook tạo listing mới
export const useCreateListing = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (formData) => {
      const { data } = await api.post('/listings', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['listings'] })
      queryClient.invalidateQueries({ queryKey: ['my-listings'] })
    },
  })
}

// Hook lấy tin của tôi
export const useMyListings = () => {
  return useQuery({
    queryKey: ['my-listings'],
    queryFn: async () => {
      const { data } = await api.get('/my-listings')
      return data
    },
  })
}

// Hook xóa listing
export const useDeleteListing = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id) => {
      await api.delete(`/listings/${id}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-listings'] })
      queryClient.invalidateQueries({ queryKey: ['listings'] })
    },
  })
}
export const useAdminDashboard = () => {
  return useQuery({
    queryKey: ['admin-dashboard'],
    queryFn: async () => {
      const { data } = await api.get('/admin/dashboard')
      return data
    },
  })
}

// Danh sách tất cả listings (admin)
export const useAdminListings = (filters = {}) => {
  return useQuery({
    queryKey: ['admin-listings', filters],
    queryFn: async () => {
      const { data } = await api.get('/admin/listings', { params: filters })
      return data
    },
    keepPreviousData: true,
  })
}

// Duyệt tin
export const useApproveListing = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id) => {
      const { data } = await api.patch(`/admin/listings/${id}/approve`)
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-listings'] })
      queryClient.invalidateQueries({ queryKey: ['admin-dashboard'] })
    },
  })
}

// Từ chối tin
export const useRejectListing = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id) => {
      const { data } = await api.patch(`/admin/listings/${id}/reject`)
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-listings'] })
      queryClient.invalidateQueries({ queryKey: ['admin-dashboard'] })
    },
  })
}

// Xóa tin (admin)
export const useAdminDeleteListing = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id) => {
      await api.delete(`/admin/listings/${id}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-listings'] })
      queryClient.invalidateQueries({ queryKey: ['admin-dashboard'] })
    },
  })
}

// Danh sách users (admin)
export const useAdminUsers = (filters = {}) => {
  return useQuery({
    queryKey: ['admin-users', filters],
    queryFn: async () => {
      const { data } = await api.get('/admin/users', { params: filters })
      return data
    },
    keepPreviousData: true,
  })
}

// Khóa/mở khóa user
export const useToggleBanUser = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id) => {
      const { data } = await api.patch(`/admin/users/${id}/toggle-ban`)
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] })
      queryClient.invalidateQueries({ queryKey: ['admin-dashboard'] })
    },
  })
}

// Xóa user (admin)
export const useAdminDeleteUser = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id) => {
      await api.delete(`/admin/users/${id}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] })
      queryClient.invalidateQueries({ queryKey: ['admin-dashboard'] })
    },
  })
}