import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { FaCloudUploadAlt, FaTimes, FaStar } from 'react-icons/fa'
import toast from 'react-hot-toast'
import { useCategories, useProvinces, useCreateListing } from '../hooks/useListings'

function Field({
  name,
  label,
  type = 'text',
  placeholder,
  required,
  half,
  form,
  errors,
  onChange,
}) {
  return (
    <div className={half ? '' : 'col-span-2'}>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label} {required && <span className="text-red-400">*</span>}
      </label>
      <input name={name} type={type}
        value={form[name]} onChange={onChange}
        placeholder={placeholder}
        className={`w-full border rounded-xl px-4 py-2.5 text-sm
          focus:outline-none focus:ring-2 focus:ring-orange-300
          ${errors[name] ? 'border-red-400' : 'border-gray-200'}`}
      />
      {errors[name] && (
        <p className="text-red-400 text-xs mt-1">{errors[name][0]}</p>
      )}
    </div>
  )
}

export default function ListingCreate() {
  const navigate  = useNavigate()
  const fileRef   = useRef()
  const { data: categories } = useCategories()
  const { data: provinces  } = useProvinces()
  const createMutation       = useCreateListing()

  const [form, setForm] = useState({
    title: '', description: '', type: 'rent',
    category_id: '', province_id: '', address: '',
    district: '', price: '', area: '',
    bedrooms: '', bathrooms: '', floor: '',
    contact_name: '', contact_phone: '',
  })

  const [images, setImages]   = useState([])   // { file, preview, isPrimary }
  const [errors, setErrors]   = useState({})

  const handle = (e) =>
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }))

  // Xử lý chọn ảnh
  const handleImages = (e) => {
    const files = Array.from(e.target.files)
    if (images.length + files.length > 10) {
      toast.error('Tối đa 10 ảnh')
      return
    }
    const newImgs = files.map((file, i) => ({
      file,
      preview: URL.createObjectURL(file),
      isPrimary: images.length === 0 && i === 0,
    }))
    setImages((prev) => [...prev, ...newImgs])
  }

  // Xóa ảnh
  const removeImage = (index) => {
    setImages((prev) => {
      const next = prev.filter((_, i) => i !== index)
      // Nếu xóa ảnh primary, đặt ảnh đầu làm primary
      if (prev[index].isPrimary && next.length > 0) {
        next[0].isPrimary = true
      }
      return next
    })
  }

  // Đặt ảnh đại diện
  const setPrimary = (index) => {
    setImages((prev) =>
      prev.map((img, i) => ({ ...img, isPrimary: i === index }))
    )
  }

  // Submit
  const submit = async (e) => {
    e.preventDefault()
    setErrors({})

    const formData = new FormData()

    // Append các field text
    Object.entries(form).forEach(([key, val]) => {
      if (val !== '') formData.append(key, val)
    })

    // Append ảnh — ảnh primary đặt lên đầu
    const sorted = [...images].sort((a, b) =>
      b.isPrimary - a.isPrimary
    )
    sorted.forEach((img) => formData.append('images[]', img.file))

    try {
      await createMutation.mutateAsync(formData)
      toast.success('Đăng tin thành công! Chờ admin duyệt.')
      navigate('/my-listings')
    } catch (err) {
      if (err.response?.status === 422) {
        setErrors(err.response.data.errors || {})
        toast.error('Vui lòng kiểm tra lại thông tin')
      } else {
        toast.error('Đăng tin thất bại, thử lại sau')
      }
    }
  }

  const selectCls = `w-full border rounded-xl px-4 py-2.5 text-sm
    focus:outline-none focus:ring-2 focus:ring-orange-300 bg-white`

  return (
    <main className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">📝 Đăng tin bất động sản</h1>

      <form onSubmit={submit} className="space-y-6">

        {/* ====== THÔNG TIN CƠ BẢN ====== */}
        <section className="bg-white rounded-2xl p-6 shadow-sm">
          <h2 className="font-bold text-gray-700 mb-4 pb-2 border-b">
            Thông tin cơ bản
          </h2>
          <div className="grid grid-cols-2 gap-4">

            {/* Tiêu đề */}
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tiêu đề <span className="text-red-400">*</span>
              </label>
              <input name="title" value={form.title} onChange={handle}
                placeholder="VD: Căn hộ 2PN Hà Nội, view hồ, nội thất đầy đủ"
                className={`w-full border rounded-xl px-4 py-2.5 text-sm
                  focus:outline-none focus:ring-2 focus:ring-orange-300
                  ${errors.title ? 'border-red-400' : 'border-gray-200'}`}
              />
              {errors.title && <p className="text-red-400 text-xs mt-1">{errors.title[0]}</p>}
            </div>

            {/* Loại tin */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Loại tin <span className="text-red-400">*</span>
              </label>
              <select name="type" value={form.type} onChange={handle} className={selectCls}>
                <option value="rent">Cho thuê</option>
                <option value="sale">Mua bán</option>
              </select>
            </div>

            {/* Danh mục */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Danh mục <span className="text-red-400">*</span>
              </label>
              <select name="category_id" value={form.category_id}
                onChange={handle} className={selectCls}>
                <option value="">-- Chọn danh mục --</option>
                {categories?.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
              {errors.category_id && (
                <p className="text-red-400 text-xs mt-1">{errors.category_id[0]}</p>
              )}
            </div>

            {/* Mô tả */}
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mô tả chi tiết <span className="text-red-400">*</span>
              </label>
              <textarea name="description" value={form.description}
                onChange={handle} rows={5}
                placeholder="Mô tả đầy đủ về căn hộ, tiện ích, vị trí..."
                className={`w-full border rounded-xl px-4 py-2.5 text-sm
                  focus:outline-none focus:ring-2 focus:ring-orange-300 resize-none
                  ${errors.description ? 'border-red-400' : 'border-gray-200'}`}
              />
              {errors.description && (
                <p className="text-red-400 text-xs mt-1">{errors.description[0]}</p>
              )}
            </div>
          </div>
        </section>

        {/* ====== VỊ TRÍ ====== */}
        <section className="bg-white rounded-2xl p-6 shadow-sm">
          <h2 className="font-bold text-gray-700 mb-4 pb-2 border-b">
            Vị trí
          </h2>
          <div className="grid grid-cols-2 gap-4">

            {/* Tỉnh/Thành */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tỉnh / Thành phố <span className="text-red-400">*</span>
              </label>
              <select name="province_id" value={form.province_id}
                onChange={handle} className={selectCls}>
                <option value="">-- Chọn tỉnh/thành --</option>
                {provinces?.map((p) => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
              {errors.province_id && (
                <p className="text-red-400 text-xs mt-1">{errors.province_id[0]}</p>
              )}
            </div>

            {/* Quận/Huyện */}
            <Field name="district" label="Quận / Huyện"
              placeholder="VD: Đống Đa" half
              form={form} errors={errors} onChange={handle} />

            {/* Địa chỉ */}
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Địa chỉ cụ thể <span className="text-red-400">*</span>
              </label>
              <input name="address" value={form.address} onChange={handle}
                placeholder="Số nhà, tên đường..."
                className={`w-full border rounded-xl px-4 py-2.5 text-sm
                  focus:outline-none focus:ring-2 focus:ring-orange-300
                  ${errors.address ? 'border-red-400' : 'border-gray-200'}`}
              />
              {errors.address && (
                <p className="text-red-400 text-xs mt-1">{errors.address[0]}</p>
              )}
            </div>
          </div>
        </section>

        {/* ====== THÔNG SỐ ====== */}
        <section className="bg-white rounded-2xl p-6 shadow-sm">
          <h2 className="font-bold text-gray-700 mb-4 pb-2 border-b">
            Thông số & Giá
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <Field name="price" label="Giá (VNĐ)" type="number"
              placeholder="VD: 8000000" required half
              form={form} errors={errors} onChange={handle} />
            <Field name="area"  label="Diện tích (m²)" type="number"
              placeholder="VD: 65" required half
              form={form} errors={errors} onChange={handle} />
            <Field name="bedrooms"  label="Số phòng ngủ"  type="number"
              placeholder="VD: 2" half
              form={form} errors={errors} onChange={handle} />
            <Field name="bathrooms" label="Số phòng tắm"  type="number"
              placeholder="VD: 1" half
              form={form} errors={errors} onChange={handle} />
            <Field name="floor" label="Tầng" type="number"
              placeholder="VD: 5" half
              form={form} errors={errors} onChange={handle} />
          </div>
        </section>

        {/* ====== ẢNH ====== */}
        <section className="bg-white rounded-2xl p-6 shadow-sm">
          <h2 className="font-bold text-gray-700 mb-1 pb-2 border-b">
            Hình ảnh
          </h2>
          <p className="text-xs text-gray-400 mb-4">
            Tối đa 10 ảnh • JPG/PNG/WEBP • Mỗi ảnh tối đa 2MB •
            Click ⭐ để chọn ảnh đại diện
          </p>

          {/* Upload zone */}
          <div
            onClick={() => fileRef.current.click()}
            className="border-2 border-dashed border-gray-200 rounded-xl
              p-8 text-center cursor-pointer hover:border-orange-400
              hover:bg-orange-50 transition mb-4">
            <FaCloudUploadAlt className="text-4xl text-gray-300 mx-auto mb-2" />
            <p className="text-sm text-gray-400">
              Click để chọn ảnh hoặc kéo thả vào đây
            </p>
            <input ref={fileRef} type="file" multiple accept="image/*"
              className="hidden" onChange={handleImages} />
          </div>

          {/* Preview ảnh */}
          {images.length > 0 && (
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
              {images.map((img, i) => (
                <div key={i} className="relative group aspect-square">
                  <img src={img.preview} alt=""
                    className={`w-full h-full object-cover rounded-xl
                      ${img.isPrimary ? 'ring-2 ring-orange-400' : ''}`}
                  />
                  {/* Badge primary */}
                  {img.isPrimary && (
                    <span className="absolute top-1 left-1 bg-orange-400
                      text-white text-xs px-1.5 py-0.5 rounded-full">
                      Chính
                    </span>
                  )}
                  {/* Actions */}
                  <div className="absolute inset-0 bg-black/40 rounded-xl
                    opacity-0 group-hover:opacity-100 transition
                    flex items-center justify-center gap-2">
                    {!img.isPrimary && (
                      <button type="button" onClick={() => setPrimary(i)}
                        className="bg-orange-400 text-white p-1.5 rounded-full"
                        title="Đặt làm ảnh đại diện">
                        <FaStar size={12} />
                      </button>
                    )}
                    <button type="button" onClick={() => removeImage(i)}
                      className="bg-red-400 text-white p-1.5 rounded-full"
                      title="Xóa ảnh">
                      <FaTimes size={12} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* ====== LIÊN HỆ ====== */}
        <section className="bg-white rounded-2xl p-6 shadow-sm">
          <h2 className="font-bold text-gray-700 mb-4 pb-2 border-b">
            Thông tin liên hệ
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <Field name="contact_name"  label="Tên liên hệ"
              placeholder="Nguyễn Văn A" required half
              form={form} errors={errors} onChange={handle} />
            <Field name="contact_phone" label="Số điện thoại"
              placeholder="0901234567" required half
              form={form} errors={errors} onChange={handle} />
          </div>
        </section>

        {/* Submit */}
        <div className="flex gap-3">
          <button type="button"
            onClick={() => navigate(-1)}
            className="flex-1 border border-gray-200 text-gray-600
              hover:bg-gray-50 font-semibold py-3 rounded-xl transition">
            Hủy
          </button>
          <button type="submit"
            disabled={createMutation.isPending}
            className="flex-2 flex-grow bg-orange-500 hover:bg-orange-600
              disabled:opacity-60 text-white font-semibold
              py-3 rounded-xl transition">
            {createMutation.isPending ? 'Đang đăng tin...' : '🚀 Đăng tin ngay'}
          </button>
        </div>

      </form>
    </main>
  )
}
