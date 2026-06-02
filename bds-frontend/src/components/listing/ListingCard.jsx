import { Link } from 'react-router-dom'
import {
  FaBed, FaBath, FaRulerCombined,
  FaMapMarkerAlt, FaHeart,
} from 'react-icons/fa'
import { formatPrice, formatArea, typeLabel } from '../../utils/format'

export default function ListingCard({ listing }) {
  const type   = typeLabel(listing.type)
  const imgUrl = listing.primary_image
    ? `http://localhost/bds-api/public/storage/${listing.primary_image.image_path}`
    : 'https://placehold.co/400x260/12121A/C9A84C?text=BĐSViệt'

  return (
    <Link to={`/listings/${listing.id}`}
      className="group bg-dark-700 border border-dark-400
        rounded-2xl overflow-hidden card-glow
        hover:border-gold/40 transition-all duration-300">

      {/* Ảnh */}
      <div className="relative h-52 overflow-hidden bg-dark-600">
        <img src={imgUrl} alt={listing.title}
          className="w-full h-full object-cover
            group-hover:scale-105 transition-transform duration-500" />

        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t
          from-dark-900/80 via-transparent to-transparent" />

        {/* Badge loại */}
        <span className={`absolute top-3 left-3 text-xs font-bold
          px-3 py-1 rounded-full backdrop-blur-sm
          ${type.value === 'sale'
            ? 'bg-blue-500/90 text-white'
            : 'bg-gold/90 text-dark-900'
          }`}>
          {type.label}
        </span>

        {/* Nút yêu thích */}
        <button
          onClick={(e) => { e.preventDefault() }}
          className="absolute top-3 right-3 w-8 h-8 bg-dark-700/80
            backdrop-blur-sm border border-dark-400 rounded-full
            flex items-center justify-center text-surface
            hover:text-red-400 hover:border-red-400/50 transition-all">
          <FaHeart size={12} />
        </button>

        {/* Giá overlay */}
        <div className="absolute bottom-3 left-3 right-3
          flex items-end justify-between">
          <div>
            <p className="text-gold font-bold text-lg leading-none">
              {formatPrice(listing.price)}
            </p>
            {listing.type === 'rent' && (
              <p className="text-cream/60 text-xs">/tháng</p>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-semibold text-cream text-sm leading-snug
          line-clamp-2 mb-2 group-hover:text-gold transition">
          {listing.title}
        </h3>

        <p className="text-surface text-xs flex items-center gap-1 mb-3">
          <FaMapMarkerAlt className="text-gold shrink-0" size={10} />
          <span className="truncate">
            {[listing.district, listing.province?.name]
              .filter(Boolean).join(', ')}
          </span>
        </p>

        {/* Thông số */}
        <div className="flex items-center gap-3 pt-3
          border-t border-dark-400 text-xs text-surface">
          {listing.bedrooms > 0 && (
            <span className="flex items-center gap-1">
              <FaBed className="text-gold" size={11} />
              {listing.bedrooms} PN
            </span>
          )}
          {listing.bathrooms > 0 && (
            <span className="flex items-center gap-1">
              <FaBath className="text-gold" size={11} />
              {listing.bathrooms} WC
            </span>
          )}
          <span className="flex items-center gap-1 ml-auto">
            <FaRulerCombined className="text-gold" size={11} />
            {formatArea(listing.area)}
          </span>
        </div>
      </div>
    </Link>
  )
}