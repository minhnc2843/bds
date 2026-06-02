import { useState } from 'react'
import { Link } from 'react-router-dom'
import { FaCalendarAlt, FaEye, FaTag } from 'react-icons/fa'
import { useQuery } from '@tanstack/react-query'
import api from '../api/axios'
import Spinner from '../components/ui/Spinner'
import Pagination from '../components/ui/Pagination'
import { formatDate } from '../utils/format'

const usePosts = (filters = {}) => useQuery({
  queryKey: ['posts', filters],
  queryFn: async () => {
    const { data } = await api.get('/posts', { params: filters })
    return data
  },
  keepPreviousData: true,
})

const usePostCategories = () => useQuery({
  queryKey: ['post-categories'],
  queryFn: async () => {
    const { data } = await api.get('/posts/categories')
    return data
  },
})

export default function Blog() {
  const [filters, setFilters] = useState({ page: 1 })
  const { data, isLoading }         = usePosts(filters)
  const { data: categories }        = usePostCategories()

  return (
    <main className="min-h-screen bg-dark-900">

      {/* Hero */}
      <div className="bg-dark-800 border-b border-dark-400 py-16">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p className="text-gold text-xs font-semibold uppercase
            tracking-widest mb-3">Kiến thức & Tin tức</p>
          <h1 className="font-display text-4xl font-bold text-cream mb-4">
            Blog Bất Động Sản
          </h1>
          <p className="text-surface max-w-xl mx-auto">
            Cập nhật xu hướng thị trường, kinh nghiệm mua nhà và
            các kiến thức hữu ích về bất động sản
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="flex gap-8">

          {/* Sidebar */}
          <aside className="hidden lg:block w-64 shrink-0">

            {/* Danh mục */}
            <div className="bg-dark-700 border border-dark-400
              rounded-2xl p-5 mb-6">
              <h3 className="text-gold font-semibold text-sm uppercase
                tracking-wider mb-4">Danh mục</h3>
              <ul className="space-y-1">
                <li>
                  <button
                    onClick={() => setFilters({ page: 1 })}
                    className={`w-full text-left px-3 py-2 rounded-xl
                      text-sm transition flex items-center justify-between
                      ${!filters.category_slug
                        ? 'bg-gold/10 text-gold'
                        : 'text-surface hover:text-gold hover:bg-dark-600'
                      }`}>
                    <span>Tất cả</span>
                    <span className="text-xs bg-dark-500 px-2 py-0.5 rounded-full">
                      {data?.total || 0}
                    </span>
                  </button>
                </li>
                {categories?.map((cat) => (
                  <li key={cat.id}>
                    <button
                      onClick={() => setFilters({
                        category_slug: cat.slug, page: 1,
                      })}
                      className={`w-full text-left px-3 py-2 rounded-xl
                        text-sm transition flex items-center justify-between
                        ${filters.category_slug === cat.slug
                          ? 'bg-gold/10 text-gold'
                          : 'text-surface hover:text-gold hover:bg-dark-600'
                        }`}>
                      <span>{cat.name}</span>
                      <span className="text-xs bg-dark-500 px-2 py-0.5 rounded-full">
                        {cat.posts_count || 0}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Bài nổi bật */}
            <div className="bg-dark-700 border border-dark-400 rounded-2xl p-5">
              <h3 className="text-gold font-semibold text-sm uppercase
                tracking-wider mb-4">Bài viết nổi bật</h3>
              <FeaturedPosts />
            </div>
          </aside>

          {/* Main */}
          <div className="flex-1 min-w-0">

            {isLoading && <Spinner />}

            {!isLoading && data?.data?.length === 0 && (
              <div className="text-center py-16 bg-dark-700
                rounded-2xl border border-dark-400">
                <p className="text-4xl mb-3">📝</p>
                <p className="text-cream font-semibold">Chưa có bài viết nào</p>
              </div>
            )}

            {/* Grid bài viết */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {data?.data?.map((post, i) => (
                <PostCard key={post.id} post={post} featured={i === 0} />
              ))}
            </div>

            <Pagination
              meta={data}
              onPageChange={(page) => setFilters(f => ({ ...f, page }))}
            />
          </div>
        </div>
      </div>
    </main>
  )
}

function PostCard({ post, featured }) {
  const imgUrl = post.thumbnail
    ? `http://localhost/bds-api/public/storage/${post.thumbnail}`
    : 'https://placehold.co/600x400/12121A/C9A84C?text=BĐSViệt'

  return (
    <Link to={`/blog/${post.slug}`}
      className={`group bg-dark-700 border border-dark-400
        rounded-2xl overflow-hidden card-glow
        hover:border-gold/40 transition-all duration-300
        ${featured ? 'md:col-span-2' : ''}`}>

      <div className={`overflow-hidden bg-dark-600
        ${featured ? 'h-72' : 'h-48'}`}>
        <img src={imgUrl} alt={post.title}
          className="w-full h-full object-cover
            group-hover:scale-105 transition-transform duration-500" />
      </div>

      <div className="p-5">
        {/* Category */}
        {post.category && (
          <span className="inline-flex items-center gap-1 text-xs
            text-gold bg-gold/10 px-3 py-1 rounded-full mb-3">
            <FaTag size={9} /> {post.category.name}
          </span>
        )}

        <h2 className={`font-bold text-cream mb-2
          group-hover:text-gold transition line-clamp-2
          ${featured ? 'text-xl' : 'text-base'}`}>
          {post.title}
        </h2>

        {post.excerpt && (
          <p className="text-surface text-sm line-clamp-2 mb-4 leading-relaxed">
            {post.excerpt}
          </p>
        )}

        <div className="flex items-center gap-4 text-xs text-surface
          border-t border-dark-400 pt-3">
          <span className="flex items-center gap-1">
            <FaCalendarAlt className="text-gold" size={10} />
            {formatDate(post.published_at || post.created_at)}
          </span>
          <span className="flex items-center gap-1">
            <FaEye className="text-gold" size={10} />
            {post.view_count} lượt xem
          </span>
          {post.author && (
            <span className="ml-auto text-cream/60">
              {post.author.name}
            </span>
          )}
        </div>
      </div>
    </Link>
  )
}

function FeaturedPosts() {
  const { data } = usePosts({ featured: true, per_page: 5 })
  return (
    <ul className="space-y-3">
      {data?.data?.slice(0, 5).map((post) => (
        <li key={post.id}>
          <Link to={`/blog/${post.slug}`}
            className="flex gap-3 group">
            <img
              src={post.thumbnail
                ? `http://localhost/bds-api/public/storage/${post.thumbnail}`
                : 'https://placehold.co/60x60/12121A/C9A84C?text=B'}
              alt=""
              className="w-14 h-14 object-cover rounded-xl shrink-0" />
            <div>
              <p className="text-xs text-cream/80 group-hover:text-gold
                transition line-clamp-2 leading-snug">
                {post.title}
              </p>
              <p className="text-xs text-surface mt-1">
                {formatDate(post.published_at)}
              </p>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  )
}