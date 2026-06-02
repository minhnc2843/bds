import { useQuery } from '@tanstack/react-query'
import api from '../api/axios'

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