import { useParams, Link } from 'react-router-dom'
import { useState } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination, Thumbs } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import {
  FaBed, FaBath, FaRulerCombined,
  FaMapMarkerAlt, FaPhone, FaUser,
  FaCalendarAlt, FaChevronLeft,
} from 'react-icons/fa'
import { useListing } from '../hooks/useListings'
import Spinner from '../components/ui/Spinner'
import { formatPrice, formatArea, formatDate, typeLabel } from '../utils/format'

export default function ListingDetail() {
  const { id } = useParams()
  const { data: listing, isLoading, isError } = useListing(id)
  const [thumbsSwiper, setThumbsSwiper] = useState(null)

  if (isLoading) return <Spinner size="lg" />

  if (isError) return (
    <div className="text-center py-20 text-red-400">
      <p className="text-4xl mb-3">😕</p>
      <p>Không tìm thấy tin đăng này</p>
      <Link to="/" className="text-orange-500 mt-4 inline-block">← Quay lại trang chủ</Link>
    </div>
  )

  const images = listing.images?.length > 0
    ? listing.images.map(img =>
        `http://localhost/bds-api/public/storage/${img.image_path}`)
    : ['https://placehold.co/800x500?text=No+Image']

  const type   = typeLabel(listing.type)

  return (
    <main className="max-w-6xl mx-auto px-4 py-8">

      {/* Breadcrumb */}
      <Link to="/"
        className="inline-flex items-center gap-1 text-sm text-gray-400
          hover:text-orange-500 mb-6">
        <FaChevronLeft size={12} /> Quay lại danh sách
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* ====== CỘT TRÁI (2/3) ====== */}
        <div className="lg:col-span-2 space-y-6">

          {/* Slider ảnh chính */}
          <div className="rounded-xl overflow-hidden bg-gray-100">
            <Swiper
              modules={[Navigation, Pagination, Thumbs]}
              navigation
              pagination={{ clickable: true }}
              thumbs={{ swiper: thumbsSwiper }}
              className="h-72 md:h-96"
            >
              {images.map((src, i) => (
                <SwiperSlide key={i}>
                  <img src={src} alt={`Ảnh ${i + 1}`}
                    className="w-full h-full object-cover" />
                </SwiperSlide>
              ))}
            </Swiper>

            {/* Thumbnail */}
            {images.length > 1 && (
              <Swiper
                modules={[Thumbs]}
                onSwiper={setThumbsSwiper}
                slidesPerView={5}
                spaceBetween={6}
                className="h-16 mt-1 px-1"
              >
                {images.map((src, i) => (
                  <SwiperSlide key={i}>
                    <img src={src} alt=""
                      className="w-full h-full object-cover rounded cursor-pointer opacity-70 hover:opacity-100" />
                  </SwiperSlide>
                ))}
              </Swiper>
            )}
          </div>

          {/* Tiêu đề & badge */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className={`text-xs font-bold px-2 py-1 rounded ${type.color}`}>
                {type.label}
              </span>
              <span className="text-xs text-gray-400">
                {listing.category?.name}
              </span>
            </div>
            <h1 className="text-xl md:text-2xl font-bold text-gray-800 leading-snug">
              {listing.title}
            </h1>
            <p className="text-gray-400 text-sm flex items-center gap-1 mt-2">
              <FaMapMarkerAlt className="text-orange-400" />
              {[listing.address, listing.district, listing.province?.name]
                .filter(Boolean).join(', ')}
            </p>
          </div>

          {/* Thông số nhanh */}
          <div className="grid grid-cols-3 gap-4">
            {[
              { icon: <FaRulerCombined />, label: 'Diện tích', value: formatArea(listing.area) },
              { icon: <FaBed />,           label: 'Phòng ngủ', value: listing.bedrooms || '—' },
              { icon: <FaBath />,          label: 'Phòng tắm', value: listing.bathrooms || '—' },
            ].map((item, i) => (
              <div key={i}
                className="bg-orange-50 rounded-xl p-4 text-center">
                <div className="text-orange-400 flex justify-center mb-1">{item.icon}</div>
                <p className="font-bold text-gray-800">{item.value}</p>
                <p className="text-xs text-gray-400 mt-0.5">{item.label}</p>
              </div>
            ))}
          </div>

          {/* Mô tả */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h2 className="font-bold text-gray-800 mb-4 text-lg">Mô tả chi tiết</h2>
            <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">
              {listing.description}
            </p>
          </div>

          {/* Thông tin thêm */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h2 className="font-bold text-gray-800 mb-4 text-lg">Thông tin bất động sản</h2>
            <div className="grid grid-cols-2 gap-y-3 text-sm">
              {[
                { label: 'Loại hình',    value: type.label },
                { label: 'Danh mục',     value: listing.category?.name },
                { label: 'Diện tích',    value: formatArea(listing.area) },
                { label: 'Tầng',         value: listing.floor ? `Tầng ${listing.floor}` : '—' },
                { label: 'Phòng ngủ',    value: listing.bedrooms || '—' },
                { label: 'Phòng tắm',    value: listing.bathrooms || '—' },
                { label: 'Tỉnh/Thành',   value: listing.province?.name },
                { label: 'Quận/Huyện',   value: listing.district || '—' },
              ].map((row, i) => (
                <div key={i} className="flex justify-between border-b border-gray-50 pb-2">
                  <span className="text-gray-400">{row.label}</span>
                  <span className="font-medium text-gray-700">{row.value}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* ====== CỘT PHẢI (1/3) ====== */}
        <div className="space-y-5">

          {/* Giá */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <p className="text-3xl font-bold text-orange-500">
              {formatPrice(listing.price)}
              {listing.type === 'rent' &&
                <span className="text-base font-normal text-gray-400">/tháng</span>}
            </p>
            {listing.area > 0 && listing.price > 0 && (
              <p className="text-xs text-gray-400 mt-1">
                ~ {formatPrice(Math.round(listing.price / listing.area))} / m²
              </p>
            )}
            <div className="flex items-center gap-1 text-xs text-gray-400 mt-3">
              <FaCalendarAlt />
              <span>Đăng ngày {formatDate(listing.created_at)}</span>
            </div>
          </div>

          {/* Liên hệ */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h3 className="font-bold text-gray-800 mb-4">Thông tin liên hệ</h3>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-orange-100 rounded-full
                flex items-center justify-center text-orange-400">
                <FaUser />
              </div>
              <div>
                <p className="font-semibold text-gray-700 text-sm">
                  {listing.contact_name}
                </p>
                <p className="text-xs text-gray-400">Người đăng tin</p>
              </div>
            </div>

            <a href={`tel:${listing.contact_phone}`}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white
                rounded-xl py-3 flex items-center justify-center gap-2
                font-semibold text-sm transition">
              <FaPhone /> {listing.contact_phone}
            </a>
          </div>

          {/* Bản đồ placeholder */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h3 className="font-bold text-gray-800 mb-3">Vị trí</h3>
            <div className="bg-gray-100 rounded-lg h-40 flex items-center
              justify-center text-gray-400 text-sm">
              <div className="text-center">
                <FaMapMarkerAlt className="mx-auto text-2xl text-orange-400 mb-2" />
                <p className="text-xs">{listing.address}</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </main>
  )
}
