import { useQuery } from '@tanstack/react-query'
import { useState, useCallback } from 'react'
import api from '../api/axios'

// Hook tìm kiếm chính
export const useSearch = (filters = {}) => {
  return useQuery({
    queryKey: ['search', filters],
    queryFn: async () => {
      const { data } = await api.get('/search', { params: filters })
      return data
    },
    enabled: Object.keys(filters).length > 0,
    keepPreviousData: true,
    staleTime: 1000 * 30,
  })
}

// Hook gợi ý tìm kiếm (debounce)
export const useSuggest = (keyword) => {
  return useQuery({
    queryKey: ['suggest', keyword],
    queryFn: async () => {
      const { data } = await api.get('/search/suggest', {
        params: { keyword },
      })
      return data
    },
    enabled: keyword?.length >= 2,
    staleTime: 1000 * 10,
  })
}

// Hook lấy facets nâng cao
export const useAdvancedFacets = (filters = {}) => {
  return useQuery({
    queryKey: ['facets', filters],
    queryFn: async () => {
      const { data } = await api.get('/search/advanced', {
        params: filters,
      })
      return data
    },
    staleTime: 1000 * 60,
  })
}

// Hook BĐS tương tự
export const useSimilarListings = (id) => {
  return useQuery({
    queryKey: ['similar', id],
    queryFn: async () => {
      const { data } = await api.get(`/search/similar/${id}`)
      return data
    },
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
  })
}

// Hook quản lý search state
export const useSearchState = () => {
  const [filters, setFilters] = useState({})
  const [keyword, setKeyword] = useState('')

  const updateFilter = useCallback((key, value) => {
    setFilters(prev => {
      if (!value) {
        const next = { ...prev }
        delete next[key]
        return next
      }
      return { ...prev, [key]: value, page: 1 }
    })
  }, [])

  const resetFilters = useCallback(() => {
    setFilters({})
    setKeyword('')
  }, [])

  const applyKeyword = useCallback((kw) => {
    setKeyword(kw)
    setFilters(prev => ({
      ...prev,
      keyword: kw,
      page: 1,
    }))
  }, [])

  return {
    filters, keyword,
    updateFilter, resetFilters, applyKeyword,
    setFilters,
  }
}