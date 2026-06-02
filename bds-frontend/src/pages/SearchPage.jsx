import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { FaSlidersH, FaTimes } from 'react-icons/fa'
import { useSearch, useAdvancedFacets, useSearchState } from '../hooks/useSearch'
import { useCategories, useProvinces } from '../hooks/useListings'
import ListingCard from '../components/listing/ListingCard'
import Pagination from '../components/ui/Pagination'
import SearchBar from '../components/search/SearchBar'
import Spinner from '../components/ui/Spinner'
import { formatPrice } from '../utils/format'

export default function SearchPage() {
  const [searchParams] = useSearchParams()
  const [showFilter, setShowFilter] = useState(false)

  const {
    filters, keyword,
    updateFilter, resetFilters, applyKeyword,
    setFilters,
  } = useSearchState()

  const { data: categories } = useCategories()
  const { data: provinces  } = useProvinces()
  const { data: facets      } = useAdvancedFacets(filters)
  const { data, isLoading   } = useSearch(filters)

  // Sync URL params → filters khi vào trang
  useEffect(() => {
    const kw = searchParams.get('keyword')
    const initial = {}
    if (kw) initial.keyword = kw
    searchParams.forEach((val, key) => {
      if (key !== 'keyword') initial[key] = val
    })
    if (Object.keys(initial).length > 0) setFilters(initial)
  }, [])

  const activeFilterCount = Object.keys(filters).filter(
    k => !['keyword', 'page', 'per_page'].includes(k)
  ).length

  const selectCls = `w-full bg-[#12121A] border border-[#2A2A3A]
    text-[#F0EDE8] rounded-xl px-3 py-2 text-sm
    focus:outline-none focus:border-[#C9A84C]`

  return (
    <main className="min-h-screen bg-[#0A0A0F]">

      {/* Search Header */}
      <div className="bg-[#12121A] border-b border-[#2A2A3A] py-6">
        <div className="max-w-6xl mx-auto px-4">
          <SearchBar
            defaultValue={filters.keyword || ''}
            onSearch={applyKeyword}
          />
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex gap-8">

          {/* ====== SIDEBAR FILTER ====== */}
          <aside className={`
            ${showFilter ? 'fixed inset-0 z-50 overflow-auto' : 'hidden'}
            lg:block lg:static lg:z-auto
            w-72 shrink-0`}>

            {/* Mobile overlay */}
            <div className="lg:hidden fixed inset-0 bg-black/60 z-[-1]"
              onClick={() => setShowFilter(false)} />

            <div className="bg-[#12121A] border border-[#2A2A3A]
              rounded-2xl p-5 lg:sticky lg:top-24 space-y-5">

              {/* Header filter */}
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-[#F0EDE8] flex items-center gap-2">
                  <FaSlidersH className="text-[#C9A84C]" /> Bộ lọc
                  {activeFilterCount > 0 && (
                    <span className="bg-[#C9A84C] text-[#0A0A0F] text-xs
                      font-bold w-5 h-5 rounded-full flex items-center justify-center">
                      {activeFilterCount}
                    </span>
                  )}
                </h3>
                {activeFilterCount > 0 && (
                  <button onClick={resetFilters}
                    className="text-xs text-[#8B8B9A] hover:text-[#C9A84C]
                      flex items-center gap-1 transition">
                    <FaTimes size={10} /> Xóa tất cả
                  </button>
                )}
              </div>

              {/* Loại tin */}
              <div>
                <label className="text-xs text-[#8B8B9A] uppercase
                  tracking-wider mb-2 block">Loại tin</label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { value: '',     label: 'Tất cả' },
                    { value: 'sale', label: 'Mua bán' },
                    { value: 'rent', label: 'Cho thuê' },
                  ].map((opt) => (
                    <button key={opt.value}
                      onClick={() => updateFilter('type', opt.value)}
                      className={`py-2 rounded-xl text-xs font-medium
                        transition border ${
                          filters.type === opt.value ||
                          (!filters.type && opt.value === '')
                            ? 'bg-[#C9A84C] text-[#0A0A0F] border-[#C9A84C]'
                            : 'bg-transparent text-[#8B8B9A] border-[#2A2A3A] hover:border-[#C9A84C]'
                        }`}>
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tỉnh/Thành */}
              <div>
                <label className="text-xs text-[#8B8B9A] uppercase
                  tracking-wider mb-2 block">Tỉnh / Thành phố</label>
                <select value={filters.province_id || ''}
                  onChange={(e) => updateFilter('province_id', e.target.value)}
                  className={selectCls}>
                  <option value="">Tất cả</option>
                  {provinces?.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                      {facets?.facets?.provinces?.[p.id] &&
                        ` (${facets.facets.provinces[p.id].count})`}
                    </option>
                  ))}
                </select>
              </div>

              {/* Danh mục */}
              <div>
                <label className="text-xs text-[#8B8B9A] uppercase
                  tracking-wider mb-2 block">Danh mục</label>
                <select value={filters.category_id || ''}
                  onChange={(e) => updateFilter('category_id', e.target.value)}
                  className={selectCls}>
                  <option value="">Tất cả</option>
                  {categories?.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              {/* Khoảng giá */}
              <div>
                <label className="text-xs text-[#8B8B9A] uppercase
                  tracking-wider mb-2 block">Khoảng giá</label>
                <div className="space-y-2">
                  <select value={filters.price_min || ''}
                    onChange={(e) => updateFilter('price_min', e.target.value)}
                    className={selectCls}>
                    <option value="">Giá từ</option>
                    <option value="1000000">1 triệu</option>
                    <option value="3000000">3 triệu</option>
                    <option value="5000000">5 triệu</option>
                    <option value="10000000">10 triệu</option>
                    <option value="500000000">500 triệu</option>
                    <option value="1000000000">1 tỷ</option>
                  </select>
                  <select value={filters.price_max || ''}
                    onChange={(e) => updateFilter('price_max', e.target.value)}
                    className={selectCls}>
                    <option value="">Giá đến</option>
                    <option value="3000000">3 triệu</option>
                    <option value="5000000">5 triệu</option>
                    <option value="10000000">10 triệu</option>
                    <option value="20000000">20 triệu</option>
                    <option value="1000000000">1 tỷ</option>
                    <option value="5000000000">5 tỷ</option>
                  </select>
                </div>
              </div>

              {/* Diện tích */}
              <div>
                <label className="text-xs text-[#8B8B9A] uppercase
                  tracking-wider mb-2 block">Diện tích (m²)</label>
                <div className="grid grid-cols-2 gap-2">
                  <input type="number"
                    value={filters.area_min || ''}
                    onChange={(e) => updateFilter('area_min', e.target.value)}
                    placeholder="Từ"
                    className={`${selectCls} text-center`}
                  />
                  <input type="number"
                    value={filters.area_max || ''}
                    onChange={(e) => updateFilter('area_max', e.target.value)}
                    placeholder="Đến"
                    className={`${selectCls} text-center`}
                  />
                </div>
              </div>

              {/* Số phòng ngủ */}
              <div>
                <label className="text-xs text-[#8B8B9A] uppercase
                  tracking-wider mb-2 block">Số phòng ngủ</label>
                <div className="flex gap-2 flex-wrap">
                  {['', '1', '2', '3', '4'].map((n) => (
                    <button key={n}
                      onClick={() => updateFilter('bedrooms', n)}
                      className={`w-10 h-10 rounded-xl text-sm font-medium
                        transition border ${
                          filters.bedrooms === n ||
                          (!filters.bedrooms && n === '')
                            ? 'bg-[#C9A84C] text-[#0A0A0F] border-[#C9A84C]'
                            : 'bg-transparent text-[#8B8B9A] border-[#2A2A3A] hover:border-[#C9A84C]'
                        }`}>
                      {n === '' ? 'Tất cả' : n === '4' ? '4+' : n}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sắp xếp */}
              <div>
                <label className="text-xs text-[#8B8B9A] uppercase
                  tracking-wider mb-2 block">Sắp xếp theo</label>
                <select
                  value={`${filters.sort_by || 'created_at'}_${filters.sort_order || 'desc'}`}
                  onChange={(e) => {
                    const [sort_by, sort_order] = e.target.value.split('_')
                    updateFilter('sort_by', sort_by)
                    updateFilter('sort_order', sort_order)
                  }}
                  className={selectCls}>
                  <option value="created_at_desc">Mới nhất</option>
                  <option value="price_asc">Giá thấp → cao</option>
                  <option value="price_desc">Giá cao → thấp</option>
                  <option value="area_desc">Diện tích lớn nhất</option>
                  <option value="area_asc">Diện tích nhỏ nhất</option>
                </select>
              </div>

              {/* Nút đóng (mobile) */}
              <button onClick={() => setShowFilter(false)}
                className="lg:hidden w-full bg-[#C9A84C] text-[#0A0A0F]
                  font-bold py-3 rounded-xl">
                Áp dụng bộ lọc
              </button>
            </div>
          </aside>

          {/* ====== KẾT QUẢ ====== */}
          <div className="flex-1 min-w-0">

            {/* Toolbar */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-[#F0EDE8] font-semibold">
                  {isLoading ? 'Đang tìm...' : (
                    <>
                      <span className="text-[#C9A84C]">{data?.total ?? 0}</span>
                      {' '}bất động sản
                      {filters.keyword && (
                        <span className="text-[#8B8B9A] text-sm">
                          {' '}cho "<span className="text-[#C9A84C]">{filters.keyword}</span>"
                        </span>
                      )}
                    </>
                  )}
                </p>
              </div>
              <button onClick={() => setShowFilter(true)}
                className="lg:hidden flex items-center gap-2 bg-[#1A1A28]
                  border border-[#2A2A3A] text-[#F0EDE8] px-4 py-2
                  rounded-xl text-sm hover:border-[#C9A84C] transition">
                <FaSlidersH className="text-[#C9A84C]" />
                Bộ lọc
                {activeFilterCount > 0 && (
                  <span className="bg-[#C9A84C] text-[#0A0A0F] text-xs
                    font-bold w-5 h-5 rounded-full flex items-center justify-center">
                    {activeFilterCount}
                  </span>
                )}
              </button>
            </div>

            {isLoading && <Spinner />}

            {!isLoading && data?.data?.length === 0 && (
              <div className="text-center py-20">
                <p className="text-5xl mb-4">🔍</p>
                <p className="text-[#F0EDE8] font-semibold text-lg mb-2">
                  Không tìm thấy kết quả
                </p>
                <p className="text-[#8B8B9A] text-sm mb-6">
                  Thử thay đổi từ khóa hoặc bộ lọc
                </p>
                <button onClick={resetFilters}
                  className="bg-[#C9A84C] hover:bg-[#E8C97A] text-[#0A0A0F]
                    font-bold px-6 py-2.5 rounded-xl transition">
                  Xóa bộ lọc
                </button>
              </div>
            )}

            {!isLoading && data?.data?.length > 0 && (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2
                  xl:grid-cols-3 gap-5">
                  {data.data.map((listing) => (
                    <ListingCard key={listing.id} listing={listing} />
                  ))}
                </div>

                <Pagination
                  meta={data}
                  onPageChange={(page) =>
                    setFilters(f => ({ ...f, page }))
                  }
                />
              </>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}