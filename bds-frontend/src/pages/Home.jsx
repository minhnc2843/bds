import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Navigation, Pagination, EffectFade } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import 'swiper/css/effect-fade'
import {
  FaArrowRight, FaBuilding, FaKey,
  FaShieldAlt, FaHeadset, FaStar,
} from 'react-icons/fa'
import { useListings } from '../hooks/useListings'
import { useSiteConfig } from '../hooks/useSiteConfig'
import ListingCard from '../components/listing/ListingCard'
import SearchBar from '../components/search/SearchBar'
import Spinner from '../components/ui/Spinner'

export default function Home() {
  const [activeTab, setActiveTab] = useState('all')
  const { data: config } = useSiteConfig()

  const banners     = config?.banners     || []
  const promotions  = config?.promotions  || []

  const { data: allListings,  isLoading: loadingAll  } = useListings({ per_page: 8 })
  const { data: saleListings, isLoading: loadingSale } = useListings({ type: 'sale', per_page: 8 })
  const { data: rentListings, isLoading: loadingRent } = useListings({ type: 'rent', per_page: 8 })

  const tabData = {
    all:  { data: allListings,  loading: loadingAll  },
    sale: { data: saleListings, loading: loadingSale },
    rent: { data: rentListings, loading: loadingRent },
  }

  const stats = [
    { value: '10.000+', label: 'Tin đăng',       icon: <FaBuilding /> },
    { value: '5.000+',  label: 'Giao dịch',       icon: <FaKey />     },
    { value: '4.9★',    label: 'Đánh giá',         icon: <FaStar />    },
    { value: '24/7',    label: 'Hỗ trợ',           icon: <FaHeadset /> },
  ]

  return (
    <div className="min-h-screen bg-dark-900">

      {/* ====== HERO BANNER SLIDESHOW ====== */}
      <section className="relative h-screen min-h-[600px] max-h-[900px]">
        {banners.length > 0 ? (
          <Swiper
            modules={[Autoplay, Navigation, Pagination, EffectFade]}
            effect="fade"
            autoplay={{ delay: 5000, disableOnInteraction: false }}
            pagination={{ clickable: true }}
            navigation
            loop
            className="h-full"
          >
            {banners.map((banner) => (
              <SwiperSlide key={banner.id}>
                <div className="relative h-full">
                  <img
                    src={`http://localhost/bds-api/public/storage/${banner.image_path}`}
                    alt={banner.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r
                    from-dark-900/90 via-dark-900/50 to-transparent" />
                  <div className="absolute inset-0 flex items-center">
                    <div className="max-w-7xl mx-auto px-4 w-full">
                      <div className="max-w-2xl">
                        <p className="text-gold text-sm font-semibold uppercase
                          tracking-widest mb-4">
                          Bất động sản cao cấp
                        </p>
                        <h2 className="font-display text-4xl md:text-6xl
                          font-bold text-cream leading-tight mb-4">
                          {banner.title}
                        </h2>
                        {banner.subtitle && (
                          <p className="text-cream/70 text-lg mb-8 leading-relaxed">
                            {banner.subtitle}
                          </p>
                        )}
                        {banner.button_text && (
                          <Link to={banner.button_link || '/search'}
                            className="inline-flex items-center gap-2
                              bg-gold hover:bg-gold-light text-dark-900
                              font-bold px-8 py-4 rounded-2xl transition-all
                              shadow-gold hover:shadow-gold text-sm">
                            {banner.button_text}
                            <FaArrowRight />
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        ) : (
          /* Default hero khi chưa có banner */
          <div className="relative h-full bg-gradient-to-br
            from-dark-900 via-dark-800 to-dark-700 flex items-center">
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute top-1/4 left-1/4 w-96 h-96
                bg-gold/5 rounded-full blur-3xl" />
              <div className="absolute bottom-1/4 right-1/4 w-64 h-64
                bg-gold/3 rounded-full blur-3xl" />
            </div>
            <div className="max-w-7xl mx-auto px-4 w-full relative z-10">
              <div className="max-w-3xl">
                <p className="text-gold text-sm font-semibold uppercase
                  tracking-widest mb-4">
                  Nền tảng bất động sản hàng đầu
                </p>
                <h1 className="font-display text-5xl md:text-7xl
                  font-bold text-cream leading-tight mb-6">
                  Tìm căn hộ{' '}
                  <span className="text-gold-gradient">
                    hoàn hảo
                  </span>
                  {' '}cho bạn
                </h1>
                <p className="text-cream/60 text-xl mb-10 leading-relaxed">
                  Khám phá hàng nghìn bất động sản cao cấp trên toàn quốc
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Search box overlay */}
        <div className="absolute bottom-0 left-0 right-0 z-20">
          <div className="max-w-4xl mx-auto px-4 pb-10">
            {/* Tabs */}
            <div className="flex gap-2 mb-4">
              {[
                { value: 'all',  label: 'Tất cả' },
                { value: 'sale', label: 'Mua bán' },
                { value: 'rent', label: 'Cho thuê' },
              ].map((tab) => (
                <Link key={tab.value}
                  to={tab.value === 'all'
                    ? '/search'
                    : `/search?type=${tab.value}`}
                  className={`px-5 py-2 rounded-t-xl text-sm font-semibold
                    transition border-b-2 ${
                      activeTab === tab.value
                        ? 'bg-dark-700 text-gold border-gold'
                        : 'bg-dark-900/60 text-cream/60 border-transparent hover:text-gold'
                    }`}
                  onClick={() => setActiveTab(tab.value)}>
                  {tab.label}
                </Link>
              ))}
            </div>
            <SearchBar />
          </div>
        </div>
      </section>

      {/* ====== STATS ====== */}
      <section className="bg-dark-800 border-y border-dark-400 py-10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-gold text-2xl flex justify-center mb-2">
                  {stat.icon}
                </div>
                <p className="text-3xl font-display font-bold text-cream mb-1">
                  {stat.value}
                </p>
                <p className="text-surface text-sm">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ====== KHUYẾN MÃI ====== */}
      {promotions.length > 0 && (
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-end justify-between mb-8">
              <div>
                <p className="text-gold text-xs font-semibold uppercase
                  tracking-widest mb-2">Ưu đãi đặc biệt</p>
                <h2 className="font-display text-3xl font-bold text-cream">
                  Chương trình khuyến mãi
                </h2>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {promotions.map((promo) => (
                <Link key={promo.id}
                  to={promo.link || '/search'}
                  className="group relative bg-dark-700 border border-dark-400
                    rounded-2xl overflow-hidden card-glow
                    hover:border-gold/40 transition-all duration-300">
                  {promo.image_path && (
                    <div className="h-48 overflow-hidden">
                      <img
                        src={`http://localhost/bds-api/public/storage/${promo.image_path}`}
                        alt={promo.title}
                        className="w-full h-full object-cover
                          group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t
                        from-dark-900/80 to-transparent" />
                    </div>
                  )}
                  {promo.badge_text && (
                    <span className="absolute top-4 left-4 text-xs font-bold
                      px-3 py-1 rounded-full text-dark-900"
                      style={{ backgroundColor: promo.badge_color || '#C9A84C' }}>
                      {promo.badge_text}
                    </span>
                  )}
                  <div className="p-5">
                    <h3 className="font-bold text-cream mb-2
                      group-hover:text-gold transition">
                      {promo.title}
                    </h3>
                    {promo.description && (
                      <p className="text-surface text-sm line-clamp-2">
                        {promo.description}
                      </p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ====== LISTINGS ====== */}
      <section className="py-16 bg-dark-800">
        <div className="max-w-7xl mx-auto px-4">
          {/* Header + Tabs */}
          <div className="flex flex-col sm:flex-row sm:items-end
            justify-between gap-4 mb-8">
            <div>
              <p className="text-gold text-xs font-semibold uppercase
                tracking-widest mb-2">Bất động sản nổi bật</p>
              <h2 className="font-display text-3xl font-bold text-cream">
                Tin đăng mới nhất
              </h2>
            </div>
            <div className="flex gap-2">
              {[
                { value: 'all',  label: 'Tất cả'    },
                { value: 'sale', label: 'Mua bán'   },
                { value: 'rent', label: 'Cho thuê'  },
              ].map((tab) => (
                <button key={tab.value}
                  onClick={() => setActiveTab(tab.value)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium
                    transition border ${
                      activeTab === tab.value
                        ? 'bg-gold text-dark-900 border-gold'
                        : 'bg-transparent text-surface border-dark-400 hover:border-gold/50 hover:text-gold'
                    }`}>
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Grid */}
          {tabData[activeTab].loading ? (
            <Spinner />
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2
                lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {tabData[activeTab].data?.data?.map((listing) => (
                  <ListingCard key={listing.id} listing={listing} />
                ))}
              </div>
              <div className="text-center mt-10">
                <Link to={`/search${activeTab !== 'all' ? `?type=${activeTab}` : ''}`}
                  className="inline-flex items-center gap-2
                    border border-gold text-gold hover:bg-gold
                    hover:text-dark-900 font-semibold px-8 py-3
                    rounded-2xl transition-all">
                  Xem tất cả <FaArrowRight />
                </Link>
              </div>
            </>
          )}
        </div>
      </section>

      {/* ====== WHY US ====== */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <p className="text-gold text-xs font-semibold uppercase
              tracking-widest mb-3">Tại sao chọn chúng tôi</p>
            <h2 className="font-display text-3xl font-bold text-cream">
              Dịch vụ đẳng cấp, uy tín hàng đầu
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: <FaShieldAlt className="text-3xl" />,
                title: 'An toàn & Uy tín',
                desc: 'Tất cả tin đăng được kiểm duyệt kỹ càng trước khi hiển thị.',
              },
              {
                icon: <FaStar className="text-3xl" />,
                title: 'Bất động sản cao cấp',
                desc: 'Chuyên các căn hộ hạng sang, vị trí đắc địa, pháp lý rõ ràng.',
              },
              {
                icon: <FaHeadset className="text-3xl" />,
                title: 'Hỗ trợ 24/7',
                desc: 'Đội ngũ tư vấn chuyên nghiệp luôn sẵn sàng hỗ trợ bạn.',
              },
            ].map((item, i) => (
              <div key={i}
                className="bg-dark-700 border border-dark-400
                  rounded-2xl p-8 text-center card-glow
                  hover:border-gold/40 transition-all duration-300 group">
                <div className="w-16 h-16 bg-gold/10 border border-gold/20
                  rounded-2xl flex items-center justify-center
                  text-gold mx-auto mb-5 group-hover:bg-gold/20
                  transition-all animate-float"
                  style={{ animationDelay: `${i * 0.5}s` }}>
                  {item.icon}
                </div>
                <h3 className="font-bold text-cream text-lg mb-3">
                  {item.title}
                </h3>
                <p className="text-surface text-sm leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  )
}