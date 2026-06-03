import { useState, useEffect, useRef } from 'react'
import { FaSave, FaUpload, FaGlobe, FaPhone,
         FaSearch, FaShareAlt, FaHome } from 'react-icons/fa'
import toast from 'react-hot-toast'
import {
  useAdminSettings,
  useUpdateSettings,
  useUploadSettingImage,
} from '../../../hooks/useAdminCMS'
import Spinner from '../../../components/ui/Spinner'

const GROUPS = [
  { key: 'general', label: 'Chung',        icon: <FaGlobe /> },
  { key: 'contact', label: 'Liên hệ',      icon: <FaPhone /> },
  { key: 'seo',     label: 'SEO',          icon: <FaSearch /> },
  { key: 'social',  label: 'Mạng xã hội',  icon: <FaShareAlt /> },
  { key: 'listing', label: 'Tin đăng',     icon: <FaHome /> },
]

export default function AdminSettings() {
  const { data, isLoading }   = useAdminSettings()
  const updateMutation        = useUpdateSettings()
  const uploadMutation        = useUploadSettingImage()
  const [activeGroup, setActiveGroup] = useState('general')
  const [localValues, setLocalValues] = useState({})
  const fileRefs = useRef({})

  // Load giá trị vào localValues
  useEffect(() => {
    if (!data) return
    const values = {}
    Object.values(data).forEach((group) => {
      Object.values(group).forEach((setting) => {
        values[setting.key] = setting.value || ''
      })
    })
    setLocalValues(values)
  }, [data])

  const handleSave = async () => {
    const group   = data?.[activeGroup]
    if (!group) return
    const settings = Object.values(group)
      .filter((s) => s.type !== 'image')
      .map((s) => ({ key: s.key, value: localValues[s.key] ?? '' }))

    try {
      await updateMutation.mutateAsync(settings)
      toast.success('Đã lưu cài đặt!')
    } catch {
      toast.error('Lưu thất bại')
    }
  }

  const handleImageUpload = async (key, file) => {
    try {
      const res = await uploadMutation.mutateAsync({ key, file })
      setLocalValues((p) => ({ ...p, [key]: res.data.path }))
      toast.success('Upload ảnh thành công!')
    } catch {
      toast.error('Upload thất bại')
    }
  }

  if (isLoading) return <Spinner />

  const currentGroup = data?.[activeGroup] || {}

  const inputCls = `w-full bg-dark-600 border border-dark-400
    text-cream rounded-xl px-4 py-2.5 text-sm
    focus:outline-none focus:border-gold/50 focus:ring-1
    focus:ring-gold/30 transition placeholder-surface`

  return (
    <div>
      <h1 className="text-2xl font-bold text-cream mb-1">Cài đặt Website</h1>
      <p className="text-surface text-sm mb-6">
        Quản lý logo, favicon, thông tin liên hệ và SEO
      </p>

      <div className="flex gap-6">

        {/* Sidebar groups */}
        <aside className="w-52 shrink-0">
          <div className="bg-dark-700 border border-dark-400
            rounded-2xl p-3 space-y-1">
            {GROUPS.map((g) => (
              <button key={g.key}
                onClick={() => setActiveGroup(g.key)}
                className={`w-full flex items-center gap-3 px-4 py-2.5
                  rounded-xl text-sm font-medium transition-all
                  ${activeGroup === g.key
                    ? 'bg-gold text-dark-900'
                    : 'text-surface hover:text-gold hover:bg-dark-600'
                  }`}>
                <span className={activeGroup === g.key
                  ? 'text-dark-900' : 'text-gold'}>
                  {g.icon}
                </span>
                {g.label}
              </button>
            ))}
          </div>
        </aside>

        {/* Settings form */}
        <div className="flex-1">
          <div className="bg-dark-700 border border-dark-400 rounded-2xl p-6">
            <div className="space-y-6">
              {Object.values(currentGroup).map((setting) => (
                <div key={setting.key}>
                  <label className="block text-xs text-surface
                    uppercase tracking-wider mb-2">
                    {setting.label}
                  </label>

                  {/* Image upload */}
                  {setting.type === 'image' && (
                    <div className="flex items-center gap-4">
                      {localValues[setting.key] && (
                        <img
                          src={`http://localhost/bds-api/public/storage/${localValues[setting.key]}`}
                          alt={setting.label}
                          className="h-16 w-auto rounded-xl border
                            border-dark-400 object-contain bg-dark-600 p-2"
                        />
                      )}
                      <div>
                        <button
                          onClick={() => fileRefs.current[setting.key]?.click()}
                          disabled={uploadMutation.isPending}
                          className="flex items-center gap-2 bg-dark-600
                            border border-dark-400 hover:border-gold/50
                            text-surface hover:text-gold px-4 py-2.5
                            rounded-xl text-sm transition-all">
                          <FaUpload size={12} />
                          {localValues[setting.key] ? 'Thay ảnh' : 'Upload ảnh'}
                        </button>
                        <p className="text-xs text-surface mt-1">
                          JPG, PNG, ICO • Tối đa 2MB
                        </p>
                        <input
                          ref={(el) => fileRefs.current[setting.key] = el}
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files[0]
                            if (file) handleImageUpload(setting.key, file)
                          }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Boolean toggle */}
                  {setting.type === 'boolean' && (
                    <label className="flex items-center gap-3 cursor-pointer">
                      <div className="relative">
                        <input
                          type="checkbox"
                          className="sr-only"
                          checked={localValues[setting.key] === 'true'}
                          onChange={(e) => setLocalValues((p) => ({
                            ...p,
                            [setting.key]: e.target.checked ? 'true' : 'false',
                          }))}
                        />
                        <div className={`w-12 h-6 rounded-full transition-colors
                          ${localValues[setting.key] === 'true'
                            ? 'bg-gold' : 'bg-dark-400'
                          }`}>
                          <div className={`absolute top-1 w-4 h-4 bg-white
                            rounded-full transition-transform
                            ${localValues[setting.key] === 'true'
                              ? 'translate-x-7' : 'translate-x-1'
                            }`} />
                        </div>
                      </div>
                      <span className="text-sm text-cream">
                        {localValues[setting.key] === 'true'
                          ? 'Bật' : 'Tắt'}
                      </span>
                    </label>
                  )}

                  {/* Long text */}
                  {setting.type === 'text' &&
                   setting.key.includes('description') && (
                    <textarea
                      value={localValues[setting.key] || ''}
                      onChange={(e) => setLocalValues((p) => ({
                        ...p, [setting.key]: e.target.value,
                      }))}
                      rows={3}
                      className={`${inputCls} resize-none`}
                    />
                  )}

                  {/* Regular text */}
                  {setting.type === 'text' &&
                   !setting.key.includes('description') && (
                    <input
                      type="text"
                      value={localValues[setting.key] || ''}
                      onChange={(e) => setLocalValues((p) => ({
                        ...p, [setting.key]: e.target.value,
                      }))}
                      className={inputCls}
                    />
                  )}
                </div>
              ))}
            </div>

            <div className="mt-8 pt-6 border-t border-dark-400 flex justify-end">
              <button
                onClick={handleSave}
                disabled={updateMutation.isPending}
                className="flex items-center gap-2 bg-gold hover:bg-gold-light
                  text-dark-900 font-bold px-6 py-3 rounded-xl
                  transition-all shadow-gold disabled:opacity-60">
                <FaSave size={14} />
                {updateMutation.isPending ? 'Đang lưu...' : 'Lưu cài đặt'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}