import { Link } from 'react-router-dom'
import {
  FaFacebook, FaYoutube, FaPhone,
  FaEnvelope, FaMapMarkerAlt, FaClock,
} from 'react-icons/fa'
import { SiZalo, SiTiktok } from 'react-icons/si'
import { useSiteConfig } from '../../hooks/useSiteConfig'

export default function Footer() {
  const { data: config } = useSiteConfig()
  const contact = config?.contact || {}
  const social  = config?.social  || {}
  const general = config?.general || {}

  return (
    <footer className="bg-dark-800 border-t border-dark-400 mt-20">

      {/* Top section */}
      <div className="max-w-7xl mx-auto px-4 py-14
        grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">

        {/* Brand */}
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-gold-gradient rounded-xl
              flex items-center justify-center text-dark-900 font-bold text-lg">
              B
            </div>
            <span className="font-display font-bold text-xl text-cream">
              BĐS<span className="text-gold">Việt</span>
            </span>
          </div>
          <p className="text-surface text-sm leading-relaxed mb-5">
            {general.site_description || 'Kênh mua bán & cho thuê căn hộ uy tín toàn quốc.'}
          </p>
          {/* Social */}
          <div className="flex gap-3">
            {[
              { href: social.social_facebook, icon: <FaFacebook />,  color: 'hover:bg-blue-600' },
              { href: social.social_zalo,     icon: <SiZalo />,      color: 'hover:bg-blue-500' },
              { href: social.social_youtube,  icon: <FaYoutube />,   color: 'hover:bg-red-600'  },
              { href: social.social_tiktok,   icon: <SiTiktok />,    color: 'hover:bg-pink-600' },
            ].filter(s => s.href).map((s, i) => (
              <a key={i} href={s.href} target="_blank" rel="noreferrer"
                className={`w-9 h-9 bg-dark-600 border border-dark-400
                  rounded-xl flex items-center justify-center
                  text-surface ${s.color} hover:text-white
                  hover:border-transparent transition-all`}>
                {s.icon}
              </a>
            ))}
          </div>
        </div>

        {/* Links */}
        <div>
          <h4 className="text-gold font-semibold mb-4 text-sm uppercase tracking-wider">
            Dịch vụ
          </h4>
          <ul className="space-y-2.5">
            {[
              { to: '/search?type=sale', label: 'Mua bán căn hộ' },
              { to: '/search?type=rent', label: 'Cho thuê căn hộ' },
              { to: '/listings/create',  label: 'Đăng tin miễn phí' },
              { to: '/blog',             label: 'Tin tức BĐS' },
            ].map((link) => (
              <li key={link.to}>
                <Link to={link.to}
                  className="text-surface hover:text-gold text-sm
                    transition flex items-center gap-2 group">
                  <span className="w-1 h-1 bg-gold rounded-full opacity-0
                    group-hover:opacity-100 transition shrink-0" />
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Hỗ trợ */}
        <div>
          <h4 className="text-gold font-semibold mb-4 text-sm uppercase tracking-wider">
            Hỗ trợ
          </h4>
          <ul className="space-y-2.5">
            {[
              { to: '/pages/gioi-thieu',         label: 'Giới thiệu' },
              { to: '/pages/dieu-khoan',         label: 'Điều khoản sử dụng' },
              { to: '/pages/chinh-sach-bao-mat', label: 'Chính sách bảo mật' },
              { to: '/contact',                  label: 'Liên hệ' },
            ].map((link) => (
              <li key={link.to}>
                <Link to={link.to}
                  className="text-surface hover:text-gold text-sm
                    transition flex items-center gap-2 group">
                  <span className="w-1 h-1 bg-gold rounded-full opacity-0
                    group-hover:opacity-100 transition shrink-0" />
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="text-gold font-semibold mb-4 text-sm uppercase tracking-wider">
            Liên hệ
          </h4>
          <ul className="space-y-3">
            {[
              { icon: <FaMapMarkerAlt />, text: contact.contact_address  },
              { icon: <FaPhone />,        text: contact.contact_phone    },
              { icon: <FaEnvelope />,     text: contact.contact_email    },
              { icon: <FaClock />,        text: contact.working_hours    },
            ].filter(i => i.text).map((item, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="text-gold mt-0.5 shrink-0 text-xs">
                  {item.icon}
                </span>
                <span className="text-surface text-sm">{item.text}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Bottom */}
      <div className="border-t border-dark-400">
        <div className="max-w-7xl mx-auto px-4 py-5
          flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-surface text-xs">
            {general.site_footer_text || '© 2025 BĐSViệt. All rights reserved.'}
          </p>
          <div className="flex items-center gap-1">
            <span className="text-surface text-xs">Thiết kế bởi</span>
            <span className="text-gold text-xs font-semibold">BĐSViệt Team</span>
          </div>
        </div>
      </div>
    </footer>
  )
}