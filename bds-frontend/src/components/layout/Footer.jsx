import { FaHome } from 'react-icons/fa'

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-gray-400 text-sm mt-16">
      <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <div className="flex items-center gap-2 text-white font-bold text-lg mb-3">
            <FaHome className="text-orange-400" />
            BĐSViệt
          </div>
          <p>Kênh mua bán & cho thuê căn hộ uy tín toàn quốc.</p>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-3">Danh mục</h4>
          <ul className="space-y-2">
            <li><a href="/?type=sale" className="hover:text-orange-400">Mua căn hộ</a></li>
            <li><a href="/?type=rent" className="hover:text-orange-400">Cho thuê</a></li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-3">Liên hệ</h4>
          <p>Email: contact@bdsviet.com</p>
          <p>Hotline: 1800 1234</p>
        </div>
      </div>
      <div className="text-center py-4 border-t border-gray-700">
        © 2025 BĐSViệt. All rights reserved.
      </div>
    </footer>
  )
}