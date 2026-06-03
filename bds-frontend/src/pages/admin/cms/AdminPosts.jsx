import { useState } from 'react'
import { FaPlus, FaEdit, FaTrash, FaEye,
         FaSearch, FaNewspaper } from 'react-icons/fa'
import toast from 'react-hot-toast'
import {
  useAdminPosts, useDeletePost,
} from '../../../hooks/useAdminCMS'
import Spinner from '../../../components/ui/Spinner'
import Pagination from '../../../components/ui/Pagination'
import { formatDate } from '../../../utils/format'
import { Link } from 'react-router-dom'

const STATUS_TABS = [
  { value: '',          label: 'Tất cả'    },
  { value: 'published', label: 'Đã đăng'  },
  { value: 'draft',     label: 'Nháp'     },
]

export default function AdminPosts() {
  const [filters, setFilters] = useState({ page: 1 })
  const [keyword, setKeyword] = useState('')
  const { data, isLoading }   = useAdminPosts(filters)
  const deleteMutation        = useDeletePost()

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Xóa bài "${title}"?`)) return
    try {
      await deleteMutation.mutateAsync(id)
      toast.success('Đã xóa bài viết')
    } catch { toast.error('Xóa thất bại') }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-cream">Bài viết Blog</h1>
          <p className="text-surface text-sm mt-0.5">
            Quản lý tin tức và bài viết
          </p>
        </div>
        <Link to="/admin/posts/create"
          className="flex items-center gap-2 bg-gold hover:bg-gold-light
            text-dark-900 font-bold px-4 py-2.5 rounded-xl transition-all">
          <FaPlus size={12} /> Viết bài mới
        </Link>
      </div>

      {/* Toolbar */}
      <div className="bg-dark-700 border border-dark-400
        rounded-2xl p-4 mb-5 flex flex-wrap gap-3">
        <div className="flex gap-1">
          {STATUS_TABS.map((tab) => (
            <button key={tab.value}
              onClick={() => setFilters({ status: tab.value, page: 1 })}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium
                transition ${
                  filters.status === tab.value ||
                  (!filters.status && tab.value === '')
                    ? 'bg-gold text-dark-900'
                    : 'bg-dark-600 text-surface hover:text-gold'
                }`}>
              {tab.label}
            </button>
          ))}
        </div>
        <form className="flex gap-2 ml-auto"
          onSubmit={(e) => {
            e.preventDefault()
            setFilters({ keyword, page: 1 })
          }}>
          <input value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="Tìm tiêu đề..."
            className="bg-dark-600 border border-dark-400 text-cream
              rounded-xl px-3 py-1.5 text-sm focus:outline-none
              focus:border-gold/50 w-44 placeholder-surface" />
          <button type="submit"
            className="bg-gold hover:bg-gold-light text-dark-900
              px-3 py-1.5 rounded-xl">
            <FaSearch size={12} />
          </button>
        </form>
      </div>

      {/* Table */}
      <div className="bg-dark-700 border border-dark-400 rounded-2xl overflow-hidden">
        {isLoading ? <Spinner /> : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-dark-600 text-surface text-xs">
                  <tr>
                    <th className="px-4 py-3 text-left">Bài viết</th>
                    <th className="px-4 py-3 text-left">Danh mục</th>
                    <th className="px-4 py-3 text-left">Lượt xem</th>
                    <th className="px-4 py-3 text-left">Ngày đăng</th>
                    <th className="px-4 py-3 text-left">Trạng thái</th>
                    <th className="px-4 py-3 text-center">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-dark-600">
                  {data?.data?.length === 0 && (
                    <tr>
                      <td colSpan={6}
                        className="text-center py-16 text-surface">
                        <FaNewspaper className="text-4xl mx-auto mb-3 opacity-30" />
                        Chưa có bài viết nào
                      </td>
                    </tr>
                  )}
                  {data?.data?.map((post) => (
                    <tr key={post.id}
                      className="hover:bg-dark-600/50 transition">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          {post.thumbnail && (
                            <img
                              src={`http://localhost/bds-api/public/storage/${post.thumbnail}`}
                              alt=""
                              className="w-14 h-10 object-cover
                                rounded-lg shrink-0"
                            />
                          )}
                          <div>
                            <p className="font-medium text-cream
                              line-clamp-1 max-w-52 text-sm">
                              {post.title}
                            </p>
                            <p className="text-xs text-surface">
                              {post.author?.name}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-xs text-gold bg-gold/10
                          px-2 py-0.5 rounded-full">
                          {post.category?.name || 'Chưa phân loại'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs text-surface">
                        {post.view_count}
                      </td>
                      <td className="px-4 py-3 text-xs text-surface">
                        {formatDate(post.published_at || post.created_at)}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-xs px-2 py-0.5 rounded-full
                          font-medium ${
                            post.status === 'published'
                              ? 'bg-green-500/20 text-green-400'
                              : 'bg-dark-500 text-surface'
                          }`}>
                          {post.status === 'published' ? 'Đã đăng' : 'Nháp'}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-center gap-1">
                          <Link to={`/blog/${post.slug}`}
                            target="_blank"
                            className="p-1.5 text-surface hover:text-blue-400
                              hover:bg-blue-500/10 rounded-lg transition">
                            <FaEye size={13} />
                          </Link>
                          <Link to={`/admin/posts/${post.id}/edit`}
                            className="p-1.5 text-surface hover:text-gold
                              hover:bg-gold/10 rounded-lg transition">
                            <FaEdit size={13} />
                          </Link>
                          <button
                            onClick={() => handleDelete(post.id, post.title)}
                            className="p-1.5 text-surface hover:text-red-400
                              hover:bg-red-500/10 rounded-lg transition">
                            <FaTrash size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="px-4 pb-4">
              <Pagination
                meta={data}
                onPageChange={(page) =>
                  setFilters((f) => ({ ...f, page }))}
              />
            </div>
          </>
        )}
      </div>
    </div>
  )
}