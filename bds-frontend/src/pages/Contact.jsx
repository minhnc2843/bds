import { useState } from 'react'
import { FaPhone, FaEnvelope, FaMapMarkerAlt,
         FaClock, FaFacebook, FaPaperPlane } from 'react-icons/fa'
import { SiZalo } from 'react-icons/si'
import { useMutation } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import api from '../api/axios'
import { useSiteConfig } from '../hooks/useSiteConfig'

export default function Contact() {
  const { data: config } = useSiteConfig()
  const contact = config?.contact || {}
  const social  = config?.social  || {}

  const [form, setForm] = useState({
    name: '', email: '', phone: '',
    subject: '', message: '',
  })
  const [errors, setErrors] = useState({})

  const mutation = useMutation({
    mutationFn: (data) => api.post('/contact', data),
    onSuccess: () => {
      toast.success('Gửi liên hệ thành công! Chúng tôi sẽ phản hồi sớm.')
      setForm({ name: '', email: '', phone: '', subject: '', message: '' })
      setErrors({})
    },
    onError: (err) => {
      if (err.response?.status === 422) {
        setErrors(err.response.data.errors || {})
      } else {
        toast.error('Gửi thất bại, thử lại sau')
      }
    },
  })

  const handle = (e) =>
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }))

  const inputCls = (field) =>
    `w-full bg-dark-600 border rounded-xl px-4 py-3 text-sm
     text-cream placeholder-surface focus:outline-none
     focus:ring-2 focus:ring-gold/50 transition
     ${errors[field] ? 'border-red-500/50' : 'border-dark-400 focus:border-gold/50'}`

  const contactItems = [
    { icon: <FaMapMarkerAlt />, label: 'Địa chỉ',     value: contact.contact_address },
    { icon: <FaPhone />,        label: 'Hotline',      value: contact.contact_phone   },
    { icon: <FaEnvelope />,     label: 'Email',        value: contact.contact_email   },
    { icon: <FaClock />,        label: 'Giờ làm việc', value: contact.working_hours   },
  ].filter(i => i.value)

  return (
    <main className="min-h-screen bg-dark-900">

      {/* Hero */}
      <div className="bg-dark-800 border-b border-dark-400 py-16">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <p className="text-gold text-xs font-semibold uppercase
            tracking-widest mb-3">Kết nối với chúng tôi</p>
          <h1 className="font-display text-4xl font-bold text-cream mb-3">
            Liên hệ
          </h1>
          <p className="text-surface max-w-md mx-auto">
            Đội ngũ tư vấn của chúng tôi luôn sẵn sàng hỗ trợ bạn
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-14">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">

          {/* Thông tin liên hệ */}
          <div className="lg:col-span-2 space-y-5">

            {/* Contact cards */}
            {contactItems.map((item, i) => (
              <div key={i}
                className="bg-dark-700 border border-dark-400
                  rounded-2xl p-5 flex items-start gap-4
                  hover:border-gold/30 transition-all group">
                <div className="w-11 h-11 bg-gold/10 border border-gold/20
                  rounded-xl flex items-center justify-center
                  text-gold group-hover:bg-gold/20 transition shrink-0">
                  {item.icon}
                </div>
                <div>
                  <p className="text-xs text-surface uppercase
                    tracking-wider mb-1">{item.label}</p>
                  <p className="text-cream text-sm font-medium">
                    {item.value}
                  </p>
                </div>
              </div>
            ))}

            {/* Social */}
            <div className="bg-dark-700 border border-dark-400
              rounded-2xl p-5">
              <p className="text-xs text-surface uppercase
                tracking-wider mb-4">Mạng xã hội</p>
              <div className="flex gap-3">
                {[
                  { href: social.social_facebook, icon: <FaFacebook />,  label: 'Facebook', color: 'hover:bg-blue-600 hover:border-blue-600' },
                  { href: social.social_zalo,     icon: <SiZalo />,      label: 'Zalo',     color: 'hover:bg-blue-500 hover:border-blue-500' },
                ].filter(s => s.href).map((s, i) => (
                  <a key={i} href={s.href}
                    target="_blank" rel="noreferrer"
                    className={`flex items-center gap-2 px-4 py-2.5
                      bg-dark-600 border border-dark-400 rounded-xl
                      text-surface hover:text-white text-sm
                      transition-all ${s.color}`}>
                    {s.icon} {s.label}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Form liên hệ */}
          <div className="lg:col-span-3">
            <div className="bg-dark-700 border border-dark-400
              rounded-2xl p-8">
              <h2 className="font-display text-2xl font-bold text-cream mb-6">
                Gửi tin nhắn
              </h2>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-surface
                      uppercase tracking-wider mb-2">
                      Họ và tên *
                    </label>
                    <input name="name" value={form.name}
                      onChange={handle} placeholder="Nguyễn Văn A"
                      className={inputCls('name')} />
                    {errors.name && (
                      <p className="text-red-400 text-xs mt-1">{errors.name[0]}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-xs text-surface
                      uppercase tracking-wider mb-2">
                      Số điện thoại
                    </label>
                    <input name="phone" value={form.phone}
                      onChange={handle} placeholder="0901234567"
                      className={inputCls('phone')} />
                  </div>
                </div>

                <div>
                  <label className="block text-xs text-surface
                    uppercase tracking-wider mb-2">Email *</label>
                  <input name="email" type="email"
                    value={form.email} onChange={handle}
                    placeholder="example@gmail.com"
                    className={inputCls('email')} />
                  {errors.email && (
                    <p className="text-red-400 text-xs mt-1">{errors.email[0]}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs text-surface
                    uppercase tracking-wider mb-2">Tiêu đề</label>
                  <input name="subject" value={form.subject}
                    onChange={handle}
                    placeholder="Tôi muốn hỏi về..."
                    className={inputCls('subject')} />
                </div>

                <div>
                  <label className="block text-xs text-surface
                    uppercase tracking-wider mb-2">Nội dung *</label>
                  <textarea name="message" value={form.message}
                    onChange={handle} rows={5}
                    placeholder="Nội dung tin nhắn của bạn..."
                    className={`${inputCls('message')} resize-none`}
                  />
                  {errors.message && (
                    <p className="text-red-400 text-xs mt-1">{errors.message[0]}</p>
                  )}
                </div>

                <button
                  onClick={() => mutation.mutate(form)}
                  disabled={mutation.isPending}
                  className="w-full bg-gold hover:bg-gold-light
                    disabled:opacity-60 text-dark-900 font-bold
                    py-4 rounded-xl flex items-center justify-center
                    gap-2 transition-all shadow-gold hover:shadow-gold">
                  {mutation.isPending
                    ? 'Đang gửi...'
                    : <><FaPaperPlane /> Gửi tin nhắn</>
                  }
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}