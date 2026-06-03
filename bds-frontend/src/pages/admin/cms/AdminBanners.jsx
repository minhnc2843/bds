import { useState, useRef } from 'react'
import { FaPlus, FaTrash, FaToggleOn,
         FaToggleOff, FaCloudUploadAlt } from 'react-icons/fa'
import toast from 'react-hot-toast'
import {
  useAdminBanners, useCreateBanner,
  useUpdateBanner, useDeleteBanner,
} from '../../../hooks/useAdminCMS'
import Spinner from '../../../components/ui/Spinner'

const emptyForm = {
  title: '', subtitle: '', button_text: '',
  button_link: '', order: 0,
}

export default function AdminBanners() {
  const { data: banners, isLoading } = useAdminBanners()
  const createMutation  = useCreateBanner()
  const updateMutation  = useUpdateBanner()
  const deleteMutation  = useDeleteBanner()

  const [showForm, setShowForm] = useState(false)
  const [form, setForm]         = useState(emptyForm)
  const [preview, setPreview]   = useState(null)
  const [imageFile, setImageFile] = useState(null)
  const fileRef = useRef()

  const handle = (e) =>
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }))

  const handleFile = (e) => {
    const file = e.target.files[0]
    if (!file) return
    setImageFile(file)
    setPreview(URL.createObjectURL(file))
  }

  const handleCreate = async (e) => {
    e.preventDefault()
    if (!imageFile) { toast.error('Vui lòng chọn ảnh banner'); return }
    const fd = new FormData()
    Object.entries(form).forEach(([k, v]) => fd.append(k, v))
    fd.append('image', imageFile)
    try {
      await createMutation.mutateAsync(fd)
      toast.success('Tạo banner thành công!')
      setForm(emptyForm); setPreview(null); setImageFile(null)
      setShowForm(false)
    } catch { toast.error('Tạo banner thất bại') }
  }

  const handleToggle = async (banner) => {
    const fd = new FormData()
    fd.append('title',     banner.title)
    fd.append('is_active', banner.is_active ? 0 : 1)
    try {
      await updateMutation.mutateAsync({ id: banner.id, formData: fd })
      toast.success(banner.is_active ? 'Đã ẩn banner' : 'Đã hiện banner')
    } catch { toast.error('Thao tác thất bại') }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Xóa banner này?')) return
    try {
      await deleteMutation.mutateAsync(id)
      toast.success('Đã xóa banner')
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
          <h1 className="text-2xl font-bold text-cream">Quản lý Banner</h1>
          <p className="text-surface text-sm mt-0.5">
            Slideshow banner trên trang chủ
          </p>
        </div>
        <button onClick={() => setShowForm((v) => !v)}
          className="flex items-center gap-2 bg-gold hover:bg-gold-light
            text-dark-900 font-bold px-4 py-2.5 rounded-xl transition-all">
          <FaPlus size={12} />
          {showForm ? 'Đóng' : 'Thêm Banner'}
        </button>
      </div>

      {/* Form tạo mới */}
      {showForm && (
        <div className="bg-dark-700 border border-gold/30
          rounded-2xl p-6 mb-6">
          <h3 className="font-bold text-cream mb-5">Thêm banner mới</h3>
          <form onSubmit={handleCreate}>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="col-span-2">
                <label className="block text-xs text-surface
                  uppercase tracking-wider mb-2">Tiêu đề *</label>
                <input name="title" value={form.title}
                  onChange={handle} required
                  placeholder="Tiêu đề banner"
                  className={inputCls} />
              </div>
              <div className="col-span-2">
                <label className="block text-xs text-surface
                  uppercase tracking-wider mb-2">Phụ đề</label>
                <input name="subtitle" value={form.subtitle}
                  onChange={handle}
                  placeholder="Mô tả ngắn"
                  className={inputCls} />
              </div>
              <div>
                <label className="block text-xs text-surface
                  uppercase tracking-wider mb-2">Text nút CTA</label>
                <input name="button_text" value={form.button_text}
                  onChange={handle} placeholder="Xem ngay"
                  className={inputCls} />
              </div>
              <div>
                <label className="block text-xs text-surface
                  uppercase tracking-wider mb-2">Link nút CTA</label>
                <input name="button_link" value={form.button_link}
                  onChange={handle} placeholder="/search"
                  className={inputCls} />
              </div>
              <div>
                <label className="block text-xs text-surface
                  uppercase tracking-wider mb-2">Thứ tự</label>
                <input name="order" type="number"
                  value={form.order} onChange={handle}
                  className={inputCls} />
              </div>
            </div>

            {/* Upload ảnh */}
            <div className="mb-5">
              <label className="block text-xs text-surface
                uppercase tracking-wider mb-2">Ảnh Banner *</label>
              {preview ? (
                <div className="relative">
                  <img src={preview} alt=""
                    className="w-full h-48 object-cover rounded-xl" />
                  <button type="button"
                    onClick={() => { setPreview(null); setImageFile(null) }}
                    className="absolute top-2 right-2 bg-red-500
                      text-white w-7 h-7 rounded-full flex items-center
                      justify-center text-sm">×</button>
                </div>
              ) : (
                <div onClick={() => fileRef.current.click()}
                  className="border-2 border-dashed border-dark-400
                    hover:border-gold/50 rounded-xl h-40 flex flex-col
                    items-center justify-center cursor-pointer
                    hover:bg-gold/5 transition">
                  <FaCloudUploadAlt className="text-3xl text-surface mb-2" />
                  <p className="text-surface text-sm">
                    Click để chọn ảnh (1920×1080 khuyến nghị)
                  </p>
                </div>
              )}
              <input ref={fileRef} type="file"
                accept="image/*" className="hidden" onChange={handleFile} />
            </div>

            <div className="flex gap-3 justify-end">
              <button type="button"
                onClick={() => setShowForm(false)}
                className="px-5 py-2.5 border border-dark-400
                  text-surface hover:text-cream rounded-xl
                  text-sm transition">
                Hủy
              </button>
              <button type="submit"
                disabled={createMutation.isPending}
                className="px-5 py-2.5 bg-gold hover:bg-gold-light
                  text-dark-900 font-bold rounded-xl text-sm
                  transition disabled:opacity-60">
                {createMutation.isPending ? 'Đang tạo...' : 'Tạo Banner'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Danh sách banners */}
      {isLoading ? <Spinner /> : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {banners?.length === 0 && (
            <div className="col-span-2 text-center py-16
              bg-dark-700 rounded-2xl border border-dark-400">
              <p className="text-surface">Chưa có banner nào</p>
            </div>
          )}
          {banners?.map((banner) => (
            <div key={banner.id}
              className={`bg-dark-700 rounded-2xl overflow-hidden
                border transition-all ${
                  banner.is_active
                    ? 'border-dark-400 hover:border-gold/30'
                    : 'border-dark-400 opacity-60'
                }`}>
              <div className="h-40 overflow-hidden bg-dark-600">
                <img
                  src={`http://localhost/bds-api/public/storage/${banner.image_path}`}
                  alt={banner.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <h3 className="font-bold text-cream text-sm line-clamp-1">
                    {banner.title}
                  </h3>
                  <span className={`text-xs px-2 py-0.5 rounded-full shrink-0
                    font-medium ${banner.is_active
                      ? 'bg-green-500/20 text-green-400'
                      : 'bg-dark-500 text-surface'
                    }`}>
                    {banner.is_active ? 'Hiện' : 'Ẩn'}
                  </span>
                </div>
                {banner.subtitle && (
                  <p className="text-surface text-xs line-clamp-1 mb-3">
                    {banner.subtitle}
                  </p>
                )}
                <div className="flex items-center justify-between">
                  <p className="text-xs text-surface">
                    Thứ tự: {banner.order}
                  </p>
                  <div className="flex gap-2">
                    <button onClick={() => handleToggle(banner)}
                      className={`flex items-center gap-1.5 text-xs px-3 py-1.5
                        rounded-lg border transition ${
                          banner.is_active
                            ? 'border-yellow-500/30 text-yellow-400 hover:bg-yellow-500/10'
                            : 'border-green-500/30 text-green-400 hover:bg-green-500/10'
                        }`}>
                      {banner.is_active
                        ? <><FaToggleOff size={12}/> Ẩn</>
                        : <><FaToggleOn size={12}/> Hiện</>
                      }
                    </button>
                    <button onClick={() => handleDelete(banner.id)}
                      className="flex items-center gap-1.5 text-xs px-3 py-1.5
                        rounded-lg border border-red-500/30 text-red-400
                        hover:bg-red-500/10 transition">
                      <FaTrash size={11} /> Xóa
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}