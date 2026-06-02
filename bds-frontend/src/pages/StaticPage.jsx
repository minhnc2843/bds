import { useParams, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import api from '../api/axios'
import Spinner from '../components/ui/Spinner'

const usePage = (slug) => useQuery({
  queryKey: ['page', slug],
  queryFn: async () => {
    const { data } = await api.get(`/pages/${slug}`)
    return data
  },
  enabled: !!slug,
})

export default function StaticPage() {
  const { slug }                    = useParams()
  const { data: page, isLoading, isError } = usePage(slug)

  if (isLoading) return <Spinner size="lg" />

  if (isError) return (
    <div className="text-center py-20">
      <p className="text-5xl mb-4">📄</p>
      <p className="text-cream font-semibold mb-4">Không tìm thấy trang này</p>
      <Link to="/" className="text-gold hover:text-gold-light transition">
        ← Về trang chủ
      </Link>
    </div>
  )

  return (
    <main className="min-h-screen bg-dark-900">
      <div className="bg-dark-800 border-b border-dark-400 py-12">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="font-display text-3xl font-bold text-cream">
            {page.title}
          </h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-12">
        <div
          className="prose prose-invert max-w-none text-cream/80 leading-relaxed"
          style={{
            '--tw-prose-body':     '#C8C4BC',
            '--tw-prose-headings': '#F0EDE8',
            '--tw-prose-links':    '#C9A84C',
            '--tw-prose-bold':     '#F0EDE8',
            '--tw-prose-hr':       '#2A2A3A',
          }}
          dangerouslySetInnerHTML={{ __html: page.content }}
        />
      </div>
    </main>
  )
}