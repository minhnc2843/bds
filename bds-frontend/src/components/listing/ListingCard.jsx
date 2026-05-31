import { Link } from 'react-router-dom'
import { FaBed, FaBath, FaRulerCombined, FaMapMarkerAlt } from 'react-icons/fa'
import { formatPrice, formatArea, typeLabel } from '../../utils/format'

export default function ListingCard({ listing }) {
  const type   = typeLabel(listing.type)
  const imgUrl = listing.primary_image
    ? `http://localhost/bds-api/public/storage/${listing.primary_image.image_path}`
    : 'https://placehold.co/400x260?text=No+Image'

  return (
    <Link to={`/listings/${listing.id}`}
      className="bg-white rounded-xl overflow-hidden shadow-sm
        hover:shadow-md hover:-translate-y-1 transition-all duration-200 group">

      {/* Ảnh */}
      <div className="relative h-48 overflow-hidden">
        <img src={imgUrl} alt={listing.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
        <span className={`absolute top-3 left-3 text-xs font-bold
          px-2 py-1 rounded ${type.color}`}>
          {type.label}
        </span>
      </div>

      {/* Nội dung */}
      <div className="p-4">
        {/* Giá */}
        <p className="text-orange-500 font-bold text-lg">
          {formatPrice(listing.price)}
          {listing.type === 'rent' && <span className="text-sm font-normal text-gray-400">/tháng</span>}
        </p>

        {/* Tiêu đề */}
        <h3 className="font-semibold text-gray-800 mt-1 line-clamp-2 text-sm leading-snug">
          {listing.title}
        </h3>

        {/* Địa chỉ */}
        <p className="text-gray-400 text-xs mt-2 flex items-center gap-1">
          <FaMapMarkerAlt className="text-orange-400 shrink-0" />
          <span className="truncate">
            {listing.district && `${listing.district}, `}
            {listing.province?.name}
          </span>
        </p>

        {/* Thông số */}
        <div className="flex items-center gap-4 mt-3 text-gray-500 text-xs border-t pt-3">
          {listing.bedrooms > 0 && (
            <span className="flex items-center gap-1">
              <FaBed className="text-orange-400" /> {listing.bedrooms} PN
            </span>
          )}
          {listing.bathrooms > 0 && (
            <span className="flex items-center gap-1">
              <FaBath className="text-orange-400" /> {listing.bathrooms} WC
            </span>
          )}
          <span className="flex items-center gap-1">
            <FaRulerCombined className="text-orange-400" />
            {formatArea(listing.area)}
          </span>
        </div>
      </div>
    </Link>
  )
}