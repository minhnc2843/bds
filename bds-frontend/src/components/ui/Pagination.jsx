export default function Pagination({ meta, onPageChange }) {
  if (!meta || meta.last_page <= 1) return null

  const pages = Array.from({ length: meta.last_page }, (_, i) => i + 1)

  return (
    <div className="flex justify-center gap-2 mt-8 flex-wrap">
      {pages.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`px-4 py-2 rounded-lg font-medium text-sm transition
            ${page === meta.current_page
              ? 'bg-orange-500 text-white shadow'
              : 'bg-white text-gray-600 border border-gray-200 hover:border-orange-400 hover:text-orange-500'
            }`}
        >
          {page}
        </button>
      ))}
    </div>
  )
}