import { useState, useEffect, useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { FaCloudUploadAlt, FaTimes, FaStar } from 'react-icons/fa'
import toast from 'react-hot-toast'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import api from '../api/axios'
import { useListing, useCategories, useProvinces } from '../hooks/useListings'
import Spinner from '../components/ui/Spinner'

export default function ListingEdit() {
  const { id }     = useParams()
  const navigate   = useNavigate()
  const fileRef    = useRef()
  const queryClient = useQueryClient()

  const { data: listing, isLoading } = useListing(id)
  const { data: categories }         = useCategories()
  const { data: provinces  }         = useProvinces()

  const [form, setForm] = useState(null)
  const [existingImages, setExistingImages] = useState([])  // ảnh đã có trên server
  const [newImages, setNewImages]           = useState([])  // ảnh mới thêm vào

  // Load dữ liệu vào form khi có listing
  useEffect(() => {
    if (!listing) return
    setForm({
      title:         listing.title         || '',
      description:   listing.description   || '',
      type:          listing.type          || 'rent',
      category_id:   listing.category_id   || '',
      province_id:   listing.province_id   || '',
      address:       listing.address       || '',
      district:      listing.district      || '',
      price:         listing.price         || '',
      area:          listing.area          || '',
      bedrooms:      listing.bedrooms      || '',
      bathrooms:     listing.bathrooms     || '',
      floor:         listing.floor         || '',
      contact_name:  listing.contact_name  || '',
      contact_phone: listing.contact_phone || '',
    })
    setExistingImages(listing.images || [])
  }, [listing])

  const handle = (e) =>
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }))

  // Xóa ảnh đã có trên server
  const removeExisting = async (imageId) => {
    try {
      await api.delete(`/listings/${id}/images/${imageId}`)
      setExistingImages((prev) => prev.filter((img) => img.id !== imageId))
      toast.success('Đã xóa ảnh')
    } catch {
      toast.error('Xóa ảnh thất bại')
    }
  }

  // Thêm ảnh mới
  const handleNewImages = (e) => {
    const files = Array.from(e.target.files)
    const total = existingImages.length + newImages.length + files.length
    if (total > 10) { toast.error('Tối đa 10 ảnh'); return }
    const imgs = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }))
    setNewImages((prev) => [...prev, ...imgs])
  }

  const removeNew = (index) =>
    setNewImages((prev) => prev.filter((_, i) => i !== index))

  // Mutation cập nhật
  const updateMutation = useMutation({
    mutationFn: async (formData) => {
      const { data } = await api.post(
        `/listings/${id}?_method=PUT`,
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      )
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['listing', id] })
      queryClient.invalidateQueries({ queryKey: ['my-listings'] })
    },
  })

  const submit = async (e) => {
    e.preventDefault()
    const formData = new FormData()
    Object.entries(form).forEach(([key, val]) => {
      if (val !== '') formData.append(key, val)
    })
    newImages.forEach((img) => formData.append('images[]', img.file))

    try {
      await updateMutation.mutateAsync(formData)
      toast.success('Cập nhật tin thành công!')
      navigate('/my-listings')
    } catch (err) {
      if (err.response?.status === 422) {
        toast.error('Vui lòng kiểm tra lại thông tin')
      } else {
        toast.error('Cập nhật thất bại')
      }
    }
  }

  if (isLoading || !form) return <Spinner size="lg" />

  const selectCls = `w-full border border-gray-200 rounded-xl px-4
    py-2.5 text-sm focus:outline-none focus:ring-2
    focus:ring-orange-300 bg-white`

  const inputCls = `w-full border border-gray-200 rounded-xl px-4
    py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300`

  return (
    <main className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">✏️ Chỉnh sửa tin đăng</h1>

      <form onSubmit={submit} className="space-y-6">

        {/* Thông tin cơ bản */}
        <section className="bg-white rounded-2xl p-6 shadow-sm space-y-4">
          <h2 className="font-bold text-gray-700 pb-2 border-b">Thông tin cơ bản</h2>

          <input name="title" value={form.title} onChange={handle}
            placeholder="Tiêu đề" className={inputCls} />

          <div className="grid grid-cols-2 gap-4">
            <select name="type" value={form.type}
              onChange={handle} className={selectCls}>
              <option value="rent">Cho thuê</option>
              <option value="sale">Mua bán</option>
            </select>
            <select name="category_id" value={form.category_id}
              onChange={handle} className={selectCls}>
              <option value="">-- Danh mục --</option>
              {categories?.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          <textarea name="description" value={form.description}
            onChange={handle} rows={4} placeholder="Mô tả chi tiết"
            className={`${inputCls} resize-none`} />
        </section>

        {/* Vị trí */}
        <section className="bg-white rounded-2xl p-6 shadow-sm space-y-4">
          <h2 className="font-bold text-gray-700 pb-2 border-b">Vị trí</h2>
          <div className="grid grid-cols-2 gap-4">
            <select name="province_id" value={form.province_id}
              onChange={handle} className={selectCls}>
              <option value="">-- Tỉnh/Thành --</option>
              {provinces?.map((p) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
            <input name="district" value={form.district}
              onChange={handle} placeholder="Quận/Huyện" className={inputCls} />
          </div>
          <input name="address" value={form.address}
            onChange={handle} placeholder="Địa chỉ cụ thể" className={inputCls} />
        </section>

        {/* Thông số */}
        <section className="bg-white rounded-2xl p-6 shadow-sm">
          <h2 className="font-bold text-gray-700 pb-2 border-b mb-4">Thông số & Giá</h2>
          <div className="grid grid-cols-2 gap-4">
            {[
              { name: 'price',     placeholder: 'Giá (VNĐ)' },
              { name: 'area',      placeholder: 'Diện tích (m²)' },
              { name: 'bedrooms',  placeholder: 'Số phòng ngủ' },
              { name: 'bathrooms', placeholder: 'Số phòng tắm' },
              { name: 'floor',     placeholder: 'Tầng' },
            ].map((f) => (
              <input key={f.name} name={f.name} type="number"
                value={form[f.name]} onChange={handle}
                placeholder={f.placeholder} className={inputCls} />
            ))}
          </div>
        </section>

        {/* Ảnh */}
        <section className="bg-white rounded-2xl p-6 shadow-sm">
          <h2 className="font-bold text-gray-700 pb-2 border-b mb-4">Hình ảnh</h2>

          {/* Ảnh đã có */}
          {existingImages.length > 0 && (
            <div className="mb-4">
              <p className="text-xs text-gray-400 mb-2">Ảnh hiện tại:</p>
              <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                {existingImages.map((img) => (
                  <div key={img.id} className="relative group aspect-square">
                    <img
                      src={`http://localhost/bds-api/public/storage/${img.image_path}`}
                      alt="" className="w-full h-full object-cover rounded-xl" />
                    {img.is_primary && (
                      <span className="absolute top-1 left-1 bg-orange-400
                        text-white text-xs px-1 rounded-full">
                        <FaStar size={8} />
                      </span>
                    )}
                    <button type="button"
                      onClick={() => removeExisting(img.id)}
                      className="absolute top-1 right-1 bg-red-400 text-white
                        p-1 rounded-full opacity-0 group-hover:opacity-100 transition">
                      <FaTimes size={10} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Thêm ảnh mới */}
          <div onClick={() => fileRef.current.click()}
            className="border-2 border-dashed border-gray-200 rounded-xl
              p-6 text-center cursor-pointer hover:border-orange-400
              hover:bg-orange-50 transition">
            <FaCloudUploadAlt className="text-3xl text-gray-300 mx-auto mb-1" />
            <p className="text-xs text-gray-400">Thêm ảnh mới</p>
            <input ref={fileRef} type="file" multiple
              accept="image/*" className="hidden" onChange={handleNewImages} />
          </div>

          {/* Preview ảnh mới */}
          {newImages.length > 0 && (
            <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 mt-3">
              {newImages.map((img, i) => (
                <div key={i} className="relative group aspect-square">
                  <img src={img.preview} alt=""
                    className="w-full h-full object-cover rounded-xl
                      ring-2 ring-blue-300" />
                  <button type="button" onClick={() => removeNew(i)}
                    className="absolute top-1 right-1 bg-red-400 text-white
                      p-1 rounded-full opacity-0 group-hover:opacity-100 transition">
                    <FaTimes size={10} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Liên hệ */}
        <section className="bg-white rounded-2xl p-6 shadow-sm">
          <h2 className="font-bold text-gray-700 pb-2 border-b mb-4">Thông tin liên hệ</h2>
          <div className="grid grid-cols-2 gap-4">
            <input name="contact_name" value={form.contact_name}
              onChange={handle} placeholder="Tên liên hệ" className={inputCls} />
            <input name="contact_phone" value={form.contact_phone}
              onChange={handle} placeholder="Số điện thoại" className={inputCls} />
          </div>
        </section>

        {/* Submit */}
        <div className="flex gap-3">
          <button type="button" onClick={() => navigate('/my-listings')}
            className="flex-1 border border-gray-200 text-gray-600
              hover:bg-gray-50 font-semibold py-3 rounded-xl transition">
            Hủy
          </button>
          <button type="submit" disabled={updateMutation.isPending}
            className="flex-grow bg-orange-500 hover:bg-orange-600
              disabled:opacity-60 text-white font-semibold py-3
              rounded-xl transition">
            {updateMutation.isPending ? 'Đang lưu...' : '💾 Lưu thay đổi'}
          </button>
        </div>
      </form>
    </main>
  )
}