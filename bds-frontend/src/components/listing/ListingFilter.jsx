import { useState } from 'react'
import { FaSearch } from 'react-icons/fa'

export default function ListingFilter({ onFilter }) {
  const [form, setForm] = useState({
    keyword: '', type: '', province_id: '',
    price_min: '', price_max: '', bedrooms: '',
  })

  const handle = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))

  const submit = (e) => {
    e.preventDefault()
    // Loại bỏ field rỗng trước khi gửi
    const params = Object.fromEntries(
      Object.entries(form).filter(([, v]) => v !== '')
    )
    onFilter(params)
  }

  const reset = () => {
    setForm({ keyword: '', type: '', province_id: '',
               price_min: '', price_max: '', bedrooms: '' })
    onFilter({})
  }

  const inputCls = `w-full border border-gray-200 rounded-lg px-3 py-2
    text-sm focus:outline-none focus:ring-2 focus:ring-orange-300`

  return (
    <form onSubmit={submit}
      className="bg-white rounded-xl shadow-sm p-5 mb-8">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">

        {/* Từ khóa */}
        <div className="col-span-2 lg:col-span-2">
          <input name="keyword" value={form.keyword} onChange={handle}
            placeholder="Tìm kiếm tiêu đề, địa chỉ..."
            className={inputCls} />
        </div>

        {/* Loại */}
        <select name="type" value={form.type} onChange={handle} className={inputCls}>
          <option value="">Tất cả loại</option>
          <option value="sale">Mua bán</option>
          <option value="rent">Cho thuê</option>
        </select>

        {/* Giá tối đa */}
        <select name="price_max" value={form.price_max} onChange={handle} className={inputCls}>
          <option value="">Tất cả mức giá</option>
          <option value="3000000">Dưới 3 triệu</option>
          <option value="5000000">Dưới 5 triệu</option>
          <option value="10000000">Dưới 10 triệu</option>
          <option value="20000000">Dưới 20 triệu</option>
          <option value="1000000000">Dưới 1 tỷ</option>
          <option value="3000000000">Dưới 3 tỷ</option>
        </select>

        {/* Số phòng ngủ */}
        <select name="bedrooms" value={form.bedrooms} onChange={handle} className={inputCls}>
          <option value="">Tất cả phòng ngủ</option>
          <option value="1">1 phòng ngủ</option>
          <option value="2">2 phòng ngủ</option>
          <option value="3">3 phòng ngủ</option>
          <option value="4">4+ phòng ngủ</option>
        </select>

        {/* Nút tìm */}
        <div className="flex gap-2">
          <button type="submit"
            className="flex-1 bg-orange-500 hover:bg-orange-600 text-white
              rounded-lg flex items-center justify-center gap-2 text-sm font-medium">
            <FaSearch /> Tìm
          </button>
          <button type="button" onClick={reset}
            className="px-3 bg-gray-100 hover:bg-gray-200 text-gray-500
              rounded-lg text-sm">
            ✕
          </button>
        </div>
      </div>
    </form>
  )
}