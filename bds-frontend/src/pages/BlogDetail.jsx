import { useParams, Link } from 'react-router-dom'
import { FaCalendarAlt, FaEye, FaTag,
         FaFacebook, FaLink, FaChevronLeft } from 'react-icons/fa'
import { useQuery } from '@tanstack/react-query'
import api from '../api/axios'
import Spinner from '../components/ui/Spinner'
import { formatDate } from '../utils/format'
import toast from 'react-hot-toast'

const usePostDetail = (slug) => useQuery({
  queryKey: ['post', slug],
  queryFn: async () => {
    const { data } = await api.get(`/posts/${slug}`)
    return data
  },
  enabled: !!slug,
})

export default function BlogDetail() {
  const { slug }                    = useParams()
  const { data, isLoading, isError } = usePostDetail(slug)

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href)
    toast.success('Đã copy link!')
  }

  if (isLoading) return <Spinner size="lg" />

  if (isError) return (
    <div className="text-center py-20">
      <p className="text-5xl mb-4">😕</p>
      <p className="text-cream font-semibold mb-4">Không tìm thấy bài viết</p>
      <Link to="/blog" className="text-gold hover:text-gold-light transition">
        ← Quay lại Blog
      </Link>
    </div>
  )

  const { post, related } = data

  return (
    <main className="min-h-screen bg-dark-900">

      {/* Thumbnail hero */}
      {post.thumbnail && (
        <div className="h-72 md:h-96 overflow-hidden relative">
          <img
            src={`http://localhost/bds-api/public/storage/${post.thumbnail}`}
            alt={post.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t
            from-dark-900 via-dark-900/40 to-transparent" />
        </div>
      )}

      <div className="max-w-4xl mx-auto px-4 py-10">

        {/* Back */}
        <Link to="/blog"
          className="inline-flex items-center gap-2 text-sm
            text-surface hover:text-gold transition mb-6">
          <FaChevronLeft size={11} /> Quay lại Blog
        </Link>

        {/* Article */}
        <article>
          {/* Category */}
          {post.category && (
            <span className="inline-flex items-center gap-1 text-xs
              text-gold bg-gold/10 px-3 py-1 rounded-full mb-4">
              <FaTag size={9} /> {post.category.name}
            </span>
          )}

          {/* Title */}
          <h1 className="font-display text-3xl md:text-4xl font-bold
            text-cream leading-tight mb-4">
            {post.title}
          </h1>

          {/* Meta */}
          <div className="flex flex-wrap items-center gap-5
            text-sm text-surface border-b border-dark-400 pb-6 mb-8">
            {post.author && (
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 bg-gold/20 rounded-full
                  flex items-center justify-center text-gold text-xs font-bold">
                  {post.author.name?.[0]}
                </div>
                <span className="text-cream/70">{post.author.name}</span>
              </div>
            )}
            <span className="flex items-center gap-1">
              <FaCalendarAlt className="text-gold" size={11} />
              {formatDate(post.published_at || post.created_at)}
            </span>
            <span className="flex items-center gap-1">
              <FaEye className="text-gold" size={11} />
              {post.view_count} lượt xem
            </span>

            {/* Share */}
            <div className="ml-auto flex items-center gap-2">
              <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`}
                target="_blank" rel="noreferrer"
                className="w-8 h-8 bg-blue-600/20 border border-blue-600/30
                  rounded-xl flex items-center justify-center
                  text-blue-400 hover:bg-blue-600/30 transition">
                <FaFacebook size={13} />
              </a>
              <button onClick={copyLink}
                className="w-8 h-8 bg-dark-600 border border-dark-400
                  rounded-xl flex items-center justify-center
                  text-surface hover:text-gold hover:border-gold/50 transition">
                <FaLink size={13} />
              </button>
            </div>
          </div>

          {/* Tags */}
          {post.tags?.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {post.tags.map((tag, i) => (
                <span key={i}
                  className="text-xs text-surface bg-dark-600
                    border border-dark-400 px-3 py-1 rounded-full">
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Content */}
          <div
            className="prose prose-invert prose-gold max-w-none
              text-cream/80 leading-relaxed"
            style={{
              '--tw-prose-body':       '#C8C4BC',
              '--tw-prose-headings':   '#F0EDE8',
              '--tw-prose-links':      '#C9A84C',
              '--tw-prose-bold':       '#F0EDE8',
              '--tw-prose-quotes':     '#C9A84C',
              '--tw-prose-hr':         '#2A2A3A',
              '--tw-prose-th-borders': '#2A2A3A',
              '--tw-prose-td-borders': '#2A2A3A',
            }}
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </article>

        {/* Bài viết liên quan */}
        {related?.length > 0 && (
          <div className="mt-16 pt-10 border-t border-dark-400">
            <h3 className="font-display text-2xl font-bold text-cream mb-6">
              Bài viết liên quan
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {related.map((p) => (
                <Link key={p.id} to={`/blog/${p.slug}`}
                  className="group bg-dark-700 border border-dark-400
                    rounded-2xl overflow-hidden card-glow
                    hover:border-gold/40 transition-all">
                  <div className="h-36 overflow-hidden bg-dark-600">
                    <img
                      src={p.thumbnail
                        ? `http://localhost/bds-api/public/storage/${p.thumbnail}`
                        : 'https://placehold.co/300x200/12121A/C9A84C?text=B'}
                      alt=""
                      className="w-full h-full object-cover
                        group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-4">
                    <p className="text-sm text-cream/80 font-medium
                      group-hover:text-gold transition line-clamp-2">
                      {p.title}
                    </p>
                    <p className="text-xs text-surface mt-2">
                      {formatDate(p.published_at)}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  )
}