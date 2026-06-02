import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { FaSearch, FaMapMarkerAlt, FaHome } from 'react-icons/fa'
import { useSuggest } from '../../hooks/useSearch'
import { useDebounce } from '../../hooks/useDebounce'

export default function SearchBar({ onSearch, defaultValue = '' }) {
  const navigate    = useNavigate()
  const inputRef    = useRef()
  const dropdownRef = useRef()

  const [input,  setInput]  = useState(defaultValue)
  const [open,   setOpen]   = useState(false)
  const debouncedInput      = useDebounce(input, 300)

  const { data: suggestions } = useSuggest(debouncedInput)

  // Click outside đóng dropdown
  useEffect(() => {
    const handler = (e) => {
      if (!dropdownRef.current?.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault()
    setOpen(false)
    if (onSearch) {
      onSearch(input)
    } else {
      navigate(`/search?keyword=${encodeURIComponent(input)}`)
    }
  }

  const handleSelect = (text) => {
    setInput(text)
    setOpen(false)
    if (onSearch) {
      onSearch(text)
    } else {
      navigate(`/search?keyword=${encodeURIComponent(text)}`)
    }
  }

  const hasSuggestions =
    suggestions?.listings?.length > 0 ||
    suggestions?.addresses?.length > 0

  return (
    <div ref={dropdownRef} className="relative w-full">
      <form onSubmit={handleSubmit}
        className="flex items-center bg-[#1A1A28] border border-[#2A2A3A]
          rounded-2xl overflow-hidden focus-within:border-[#C9A84C]
          transition-all duration-200">

        <FaSearch className="ml-5 text-[#C9A84C] shrink-0" />

        <input
          ref={inputRef}
          value={input}
          onChange={(e) => {
            setInput(e.target.value)
            setOpen(true)
          }}
          onFocus={() => input.length >= 2 && setOpen(true)}
          placeholder="Tìm kiếm căn hộ, địa chỉ, quận huyện..."
          className="flex-1 bg-transparent px-4 py-4 text-[#F0EDE8]
            placeholder-[#8B8B9A] text-sm focus:outline-none"
        />

        <button type="submit"
          className="bg-[#C9A84C] hover:bg-[#E8C97A] text-[#0A0A0F]
            font-bold px-6 py-4 text-sm transition-colors shrink-0">
          Tìm kiếm
        </button>
      </form>

      {/* Dropdown gợi ý */}
      {open && hasSuggestions && (
        <div className="absolute top-full left-0 right-0 mt-2
          bg-[#12121A] border border-[#2A2A3A] rounded-2xl
          shadow-2xl z-50 overflow-hidden">

          {/* Listings gợi ý */}
          {suggestions?.listings?.length > 0 && (
            <div>
              <p className="text-xs text-[#8B8B9A] px-4 pt-3 pb-1 uppercase tracking-wider">
                Tin đăng
              </p>
              {suggestions.listings.map((item) => (
                <button key={item.id} type="button"
                  onClick={() => handleSelect(item.title)}
                  className="w-full flex items-center gap-3 px-4 py-2.5
                    hover:bg-[#1A1A28] transition text-left group">
                  <FaHome className="text-[#C9A84C] shrink-0 text-xs" />
                  <div>
                    <p className="text-sm text-[#F0EDE8] group-hover:text-[#C9A84C]
                      transition line-clamp-1">
                      {item.title}
                    </p>
                    <p className="text-xs text-[#8B8B9A]">{item.address}</p>
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Địa chỉ gợi ý */}
          {suggestions?.addresses?.length > 0 && (
            <div className="border-t border-[#2A2A3A]">
              <p className="text-xs text-[#8B8B9A] px-4 pt-3 pb-1 uppercase tracking-wider">
                Khu vực
              </p>
              {suggestions.addresses.map((addr, i) => (
                <button key={i} type="button"
                  onClick={() => handleSelect(addr)}
                  className="w-full flex items-center gap-3 px-4 py-2.5
                    hover:bg-[#1A1A28] transition text-left">
                  <FaMapMarkerAlt className="text-[#C9A84C] shrink-0 text-xs" />
                  <p className="text-sm text-[#F0EDE8]">{addr}</p>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}