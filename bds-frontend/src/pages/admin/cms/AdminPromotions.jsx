import { useState, useRef } from 'react'
import { FaPlus, FaTrash, FaCloudUploadAlt, FaFire } from 'react-icons/fa'
import toast from 'react-hot-toast'
import {
  useAdminPromotions,
  useCreatePromotion,
  useDeletePromotion,
} from '../../../hooks/useAdminCMS'
import Spinner from '../../../components/ui/Spinner'
import { formatDate } from '../../../utils/format'

const emptyForm = {
  title: '', description: '', badge_text: '',
  badge_color: '#C9A84C', link: '',
  started_at: '', ended_at: '',
}

export default function AdminPromotions() {
  const { data: promotions, isLoading } = useAdminPromotions()
  const createMutation = useCreatePromotion()
  const deleteMutation = useDeletePromotion()

  const [showForm, setShowForm]     = useState(false)
  const [form, setForm]             = useState(emptyForm)
  const [preview, setPreview]       = useState(null)
  const [imageFile, setImageFile]   = useState(null)
  const fileRef = useRef()

  const handle = (e) =>
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }))

  const handleCreate = async (e) => {
    e.preventDefault()
    const fd = new FormData()
    Object.entries(form).forEach(([k, v]) => {
      if (v) fd.append(k, v)
    })
    if (imageFile) fd.append('image', imageFile)
    try {
      await createMutation.mutateAsync(fd)
      toast.success('Tạo khuyến mãi thành công!')
      setForm(emptyForm); setPreview(null)
      setImageFile(null); setShowForm(false)
    } catch { toast.error('Tạo khuyến mãi thất bại') }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Xóa khuyến mãi này?')) return
    try {
      await deleteMutation.mutateAsync(id)
      toast.success('Đã xóa khuyến mãi')
    } catch { toast.error('Xóa thất bại') }
  }

  const inputCls = `w-full bg-dark-600 border border-dark-400
    text-cream rounded-xl px-4 py-2.5 text-sm
    focus:outline-none focus:border-gold/50 transition
    placeholder-surface`

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-cream">Khuyến mãi</h1>
          <p className="text-surface text-sm mt-0.5">
            Chương trình ưu đãi hiển thị trên trang chủ
          </p>
        </div>
        <button onClick={() => setShowForm((v) => !v)}
          className="flex items-center gap-2 bg-gold hover:bg-gold-light
            text-dark-900 font-bold px-4 py-2.5 rounded-xl transition-all">
          <FaPlus size={12} />
          {showForm ? 'Đóng' : 'Thêm Khuyến mãi'}
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-dark-700 border border-gold/30
          rounded-2xl p-6 mb-6">
          <h3 className="font-bold text-cream mb-5">
            Tạo chương trình khuyến mãi
          </h3>
          <form onSubmit={handleCreate}>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="col-span-2">
                <label className="block text-xs text-surface
                  uppercase tracking-wider mb-2">Tiêu đề *</label>
                <input name="title" value={form.title}
                  onChange={handle} required
                  placeholder="VD: Ưu đãi tháng 12"
                  className={inputCls} />
              </div>
              <div className="col-span-2">
                <label className="block text-xs text-surface
                  uppercase tracking-wider mb-2">Mô tả</label>
                <textarea name="description" value={form.description}
                  onChange={handle} rows={3}
                  placeholder="Nội dung chương trình..."
                  className={`${inputCls} resize-none`} />
              </div>
              <div>
                <label className="block text-xs text-surface
                  uppercase tracking-wider mb-2">Badge text</label>
                <input name="badge_text" value={form.badge_text}
                  onChange={handle} placeholder="HOT / NEW / -20%"
                  className={inputCls} />
              </div>
              <div>
                <label className="block text-xs text-surface
                  uppercase tracking-wider mb-2">Màu badge</label>
                <div className="flex gap-2 items-center">
                  <input type="color" name="badge_color"
                    value={form.badge_color} onChange={handle}
                    className="w-10 h-10 rounded-xl border border-dark-400
                      bg-dark-600 cursor-pointer" />
                  <input name="badge_color" value={form.badge_color}
                    onChange={handle} className={`${inputCls} flex-1`} />
                </div>
              </div>
              <div>
                <label className="block text-xs text-surface
                  uppercase tracking-wider mb-2">Ngày bắt đầu</label>
                <input type="datetime-local" name="started_at"
                  value={form.started_at} onChange={handle}
                  className={inputCls} />
              </div>
              <div>
                <label className="block text-xs text-surface
                  uppercase tracking-wider mb-2">Ngày kết thúc</label>
                <input type="datetime-local" name="ended_at"
                  value={form.ended_at} onChange={handle}
                  className={inputCls} />
              </div>
              <div className="col-span-2">
                <label className="block text-xs text-surface
                  uppercase tracking-wider mb-2">Link</label>
                <input name="link" value={form.link}
                  onChange={handle} placeholder="/search?type=sale"
                  className={inputCls} />
              </div>
            </div>

            {/* Ảnh */}
            <div className="mb-5">
              <label className="block text-xs text-surface
                uppercase tracking-wider mb-2">Ảnh</label>
              {preview ? (
                <div className="relative">
                  <img src={preview} alt=""
                    className="w-full h-40 object-cover rounded-xl" />
                  <button type="button"
                    onClick={() => { setPreview(null); setImageFile(null) }}
                    className="absolute top-2 right-2 bg-red-500 text-white
                      w-7 h-7 rounded-full flex items-center
                      justify-center text-sm">×</button>
                </div>
              ) : (
                <div onClick={() => fileRef.current.click()}
                  className="border-2 border-dashed border-dark-400
                    hover:border-gold/50 rounded-xl h-36
                    flex flex-col items-center justify-center
                    cursor-pointer hover:bg-gold/5 transition">
                  <FaCloudUploadAlt className="text-2xl text-surface mb-2" />
                  <p className="text-surface text-sm">Click để chọn ảnh</p>
                </div>
              )}
              <input ref={fileRef} type="file"
                accept="image/*" className="hidden"
                onChange={(e) => {
                  const f = e.target.files[0]
                  if (f) { setImageFile(f); setPreview(URL.createObjectURL(f)) }
                }} />
            </div>

            <div className="flex gap-3 justify-end">
              <button type="button" onClick={() => setShowForm(false)}
                className="px-5 py-2.5 border border-dark-400
                  text-surface rounded-xl text-sm transition
                  hover:text-cream">Hủy</button>
              <button type="submit"
                disabled={createMutation.isPending}
                className="px-5 py-2.5 bg-gold hover:bg-gold-light
                  text-dark-900 font-bold rounded-xl text-sm
                  transition disabled:opacity-60">
                {createMutation.isPending ? 'Đang tạo...' : 'Tạo Khuyến mãi'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* List */}
      {isLoading ? <Spinner /> : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {promotions?.length === 0 && (
            <div className="col-span-3 text-center py-16
              bg-dark-700 rounded-2xl border border-dark-400">
              <FaFire className="text-4xl text-surface mx-auto mb-3" />
              <p className="text-surface">Chưa có chương trình khuyến mãi</p>
            </div>
          )}
          {promotions?.map((promo) => (
            <div key={promo.id}
              className="bg-dark-700 border border-dark-400
                rounded-2xl overflow-hidden hover:border-gold/30
                transition-all group">
              {promo.image_path && (
                <div className="h-36 overflow-hidden bg-dark-600">
                  <img
                    src={`http://localhost/bds-api/public/storage/${promo.image_path}`}
                    alt={promo.title}
                    className="w-full h-full object-cover
                      group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
              )}
              <div className="p-4">
                <div className="flex items-start gap-2 mb-2">
                  {promo.badge_text && (
                    <span className="text-xs font-bold px-2 py-0.5
                      rounded-full text-dark-900 shrink-0"
                      style={{ backgroundColor: promo.badge_color }}>
                      {promo.badge_text}
                    </span>
                  )}
                  <h3 className="font-bold text-cream text-sm line-clamp-1">
                    {promo.title}
                  </h3>
                </div>
                {promo.description && (
                  <p className="text-surface text-xs line-clamp-2 mb-3">
                    {promo.description}
                  </p>
                )}
                {(promo.started_at || promo.ended_at) && (
                  <p className="text-xs text-surface mb-3">
                    {promo.started_at && formatDate(promo.started_at)}
                    {promo.started_at && promo.ended_at && ' → '}
                    {promo.ended_at && formatDate(promo.ended_at)}
                  </p>
                )}
                <button onClick={() => handleDelete(promo.id)}
                  className="w-full flex items-center justify-center gap-2
                    text-xs text-red-400 hover:bg-red-500/10 border
                    border-red-500/20 hover:border-red-500/40
                    py-2 rounded-xl transition">
                  <FaTrash size={11} /> Xóa
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}