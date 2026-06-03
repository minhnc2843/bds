import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '../api/axios'

// ====== SITE SETTINGS ======
export const useAdminSettings = () => {
  return useQuery({
    queryKey: ['admin-settings'],
    queryFn: async () => {
      const { data } = await api.get('/admin/settings')
      return data
    },
  })
}

export const useUpdateSettings = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (settings) =>
      api.put('/admin/settings', { settings }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-settings'] })
      queryClient.invalidateQueries({ queryKey: ['site-config'] })
    },
  })
}

export const useUploadSettingImage = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ key, file }) => {
      const formData = new FormData()
      formData.append('key', key)
      formData.append('image', file)
      return api.post('/admin/settings/upload-image', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-settings'] })
      queryClient.invalidateQueries({ queryKey: ['site-config'] })
    },
  })
}

// ====== BANNERS ======
export const useAdminBanners = () => {
  return useQuery({
    queryKey: ['admin-banners'],
    queryFn: async () => {
      const { data } = await api.get('/admin/banners')
      return data
    },
  })
}

export const useCreateBanner = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (formData) =>
      api.post('/admin/banners', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-banners'] })
      queryClient.invalidateQueries({ queryKey: ['site-config'] })
    },
  })
}

export const useUpdateBanner = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, formData }) =>
      api.post(`/admin/banners/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-banners'] })
      queryClient.invalidateQueries({ queryKey: ['site-config'] })
    },
  })
}

export const useDeleteBanner = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id) => api.delete(`/admin/banners/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-banners'] })
      queryClient.invalidateQueries({ queryKey: ['site-config'] })
    },
  })
}

// ====== PROMOTIONS ======
export const useAdminPromotions = () => {
  return useQuery({
    queryKey: ['admin-promotions'],
    queryFn: async () => {
      const { data } = await api.get('/admin/promotions')
      return data
    },
  })
}

export const useCreatePromotion = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (formData) =>
      api.post('/admin/promotions', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-promotions'] })
      queryClient.invalidateQueries({ queryKey: ['site-config'] })
    },
  })
}

export const useDeletePromotion = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id) => api.delete(`/admin/promotions/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-promotions'] })
      queryClient.invalidateQueries({ queryKey: ['site-config'] })
    },
  })
}

// ====== POSTS ======
export const useAdminPosts = (filters = {}) => {
  return useQuery({
    queryKey: ['admin-posts', filters],
    queryFn: async () => {
      const { data } = await api.get('/admin/posts', { params: filters })
      return data
    },
    keepPreviousData: true,
  })
}

export const useCreatePost = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (formData) =>
      api.post('/admin/posts', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-posts'] })
    },
  })
}

export const useDeletePost = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id) => api.delete(`/admin/posts/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-posts'] })
    },
  })
}

// ====== PAGES ======
export const useAdminPages = () => {
  return useQuery({
    queryKey: ['admin-pages'],
    queryFn: async () => {
      const { data } = await api.get('/admin/pages')
      return data
    },
  })
}

export const useUpdatePage = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }) => api.put(`/admin/pages/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-pages'] })
    },
  })
}

// ====== CONTACTS ======
export const useAdminContacts = (filters = {}) => {
  return useQuery({
    queryKey: ['admin-contacts', filters],
    queryFn: async () => {
      const { data } = await api.get('/admin/contacts', { params: filters })
      return data
    },
    keepPreviousData: true,
  })
}

export const useAdminContactUnread = () => {
  return useQuery({
    queryKey: ['admin-contact-unread'],
    queryFn: async () => {
      const { data } = await api.get('/admin/contacts/unread-count')
      return data
    },
    refetchInterval: 1000 * 60,
  })
}

export const useUpdateContact = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }) => api.patch(`/admin/contacts/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-contacts'] })
      queryClient.invalidateQueries({ queryKey: ['admin-contact-unread'] })
    },
  })
}

export const useDeleteContact = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id) => api.delete(`/admin/contacts/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-contacts'] })
    },
  })
}