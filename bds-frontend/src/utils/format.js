import numeral from 'numeral'

// Format giá: 8000000 → "8.000.000 đ" hoặc "8 triệu"
export const formatPrice = (price) => {
  if (!price) return 'Thỏa thuận'
  if (price >= 1_000_000_000) {
    return numeral(price / 1_000_000_000).format('0.0') + ' tỷ'
  }
  if (price >= 1_000_000) {
    return numeral(price / 1_000_000).format('0') + ' triệu'
  }
  return numeral(price).format('0,0') + ' đ'
}

// Format diện tích: 65 → "65 m²"
export const formatArea = (area) => {
  if (!area) return 'N/A'
  return `${area} m²`
}

// Format ngày: 2024-01-15 → "15/01/2024"
export const formatDate = (date) => {
  if (!date) return ''
  return new Date(date).toLocaleDateString('vi-VN')
}

// Badge trạng thái
export const statusLabel = (status) => {
  const map = {
    pending:  { label: 'Chờ duyệt',  color: 'bg-yellow-100 text-yellow-700' },
    active:   { label: 'Đang hiển thị', color: 'bg-green-100 text-green-700' },
    rejected: { label: 'Bị từ chối', color: 'bg-red-100 text-red-700' },
    expired:  { label: 'Hết hạn',    color: 'bg-gray-100 text-gray-600' },
  }
  return map[status] || { label: status, color: 'bg-gray-100 text-gray-600' }
}

// Badge loại tin
export const typeLabel = (type) => {
  return type === 'sale'
    ? { label: 'Bán', color: 'bg-blue-600 text-white' }
    : { label: 'Cho thuê', color: 'bg-orange-500 text-white' }
}