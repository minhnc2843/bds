import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useListings } from '../hooks/useListings'
import ListingCard from '../components/listing/ListingCard'
import ListingFilter from '../components/listing/ListingFilter'
import Spinner from '../components/ui/Spinner'
import Pagination from '../components/ui/Pagination'

export default function Home() {
  const [searchParams] = useSearchParams()
  const [filters, setFilters] = useState({
    type: searchParams.get('type') || '',
    page: 1,
  })

  // Sync URL params vào filter
  useEffect(() => {
    const type = searchParams.get('type')
    if (type) setFilters((f) => ({ ...f, type }))
  }, [searchParams])

  const { data, isLoading, isError } = useListings(filters)

  const handleFilter = (params) =>
    setFilters({ ...params, page: 1 })

  const handlePage = (page) =>
    setFilters((f) => ({ ...f, page }))

  return (
    <main className="max-w-7xl mx-auto px-4 py-8">

      {/* Hero */}
      <div className="text-center mb-10">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3">
          Tìm căn hộ <span className="text-orange-500">phù hợp</span> với bạn
        </h1>
        <p className="text-gray-500 text-sm">
          Hàng nghìn căn hộ mua bán & cho thuê trên toàn quốc
        </p>
      </div>

      {/* Filter */}
      <ListingFilter onFilter={handleFilter} />

      {/* Kết quả */}
      {isLoading && <Spinner />}

      {isError && (
        <div className="text-center py-16 text-red-400">
          Không thể tải dữ liệu. Vui lòng thử lại.
        </div>
      )}

      {data && (
        <>
          {/* Tổng số kết quả */}
          <p className="text-sm text-gray-500 mb-4">
            Tìm thấy <span className="font-semibold text-gray-700">
              {data.total}
            </span> bất động sản
          </p>

          {data.data.length === 0 ? (
            <div className="text-center py-20 text-gray-400">
              <p className="text-4xl mb-3">🏠</p>
              <p>Không có tin đăng nào phù hợp</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2
              lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {data.data.map((listing) => (
                <ListingCard key={listing.id} listing={listing} />
              ))}
            </div>
          )}

          <Pagination meta={data} onPageChange={handlePage} />
        </>
      )}
    </main>
  )
}