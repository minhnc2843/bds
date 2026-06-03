import { useState } from 'react'
import { FaEnvelopeOpen, FaTrash, FaReply } from 'react-icons/fa'
import toast from 'react-hot-toast'
import {
  useAdminContacts,
  useUpdateContact,
  useDeleteContact,
} from '../../../hooks/useAdminCMS'
import Spinner from '../../../components/ui/Spinner'
import Pagination from '../../../components/ui/Pagination'
import { formatDate } from '../../../utils/format'

const STATUS_TABS = [
  { value: '',        label: 'Tất cả'     },
  { value: 'unread',  label: 'Chưa đọc'  },
  { value: 'read',    label: 'Đã đọc'    },
  { value: 'replied', label: 'Đã trả lời'},
]

const statusCfg = {
  unread:  { label: 'Chưa đọc',   cls: 'bg-yellow-500/20 text-yellow-400' },
  read:    { label: 'Đã đọc',     cls: 'bg-blue-500/20 text-blue-400'     },
  replied: { label: 'Đã trả lời', cls: 'bg-green-500/20 text-green-400'   },
}

export default function AdminContacts() {
  const [filters, setFilters]   = useState({ page: 1 })
  const [expanded, setExpanded] = useState(null)
  const [note, setNote]         = useState('')

  const { data, isLoading } = useAdminContacts(filters)
  const updateMutation      = useUpdateContact()
  const deleteMutation      = useDeleteContact()

  const handleExpand = async (contact) => {
    setExpanded(expanded?.id === contact.id ? null : contact)
    setNote(contact.admin_note || '')
    // Tự động đánh dấu đã đọc
    if (contact.status === 'unread') {
      await updateMutation.mutateAsync({
        id: contact.id, data: { status: 'read' },
      })
    }
  }

  const handleStatus = async (id, status) => {
    try {
      await updateMutation.mutateAsync({ id, data: { status } })
      toast.success('Cập nhật trạng thái thành công')
    } catch { toast.error('Thao tác thất bại') }
  }

  const handleSaveNote = async (id) => {
    try {
      await updateMutation.mutateAsync({
        id, data: { admin_note: note, status: 'replied' },
      })
      toast.success('Đã lưu ghi chú')
    } catch { toast.error('Lưu thất bại') }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Xóa tin nhắn này?')) return
    try {
      await deleteMutation.mutateAsync(id)
      toast.success('Đã xóa')
      if (expanded?.id === id) setExpanded(null)
    } catch { toast.error('Xóa thất bại') }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-cream mb-1">Tin nhắn Liên hệ</h1>
      <p className="text-surface text-sm mb-6">
        Quản lý tin nhắn từ khách hàng
      </p>

      {/* Tabs */}
      <div className="bg-dark-700 border border-dark-400
        rounded-2xl p-4 mb-5">
        <div className="flex gap-2 flex-wrap">
          {STATUS_TABS.map((tab) => (
            <button key={tab.value}
              onClick={() => setFilters({ status: tab.value, page: 1 })}
              className={`px-4 py-1.5 rounded-xl text-xs font-medium
                transition ${
                  filters.status === tab.value ||
                  (!filters.status && tab.value === '')
                    ? 'bg-gold text-dark-900'
                    : 'bg-dark-600 text-surface hover:text-gold'
                }`}>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      {isLoading ? <Spinner /> : (
        <div className="space-y-3">
          {data?.data?.length === 0 && (
            <div className="text-center py-16 bg-dark-700
              rounded-2xl border border-dark-400">
              <FaEnvelopeOpen className="text-4xl text-surface
                mx-auto mb-3 opacity-30" />
              <p className="text-surface">Không có tin nhắn nào</p>
            </div>
          )}

          {data?.data?.map((contact) => {
            const cfg  = statusCfg[contact.status]
            const open = expanded?.id === contact.id

            return (
              <div key={contact.id}
                className={`bg-dark-700 border rounded-2xl overflow-hidden
                  transition-all ${
                    contact.status === 'unread'
                      ? 'border-gold/30'
                      : 'border-dark-400'
                  }`}>

                {/* Header */}
                <div
                  className="flex items-center gap-4 p-4 cursor-pointer
                    hover:bg-dark-600/50 transition"
                  onClick={() => handleExpand(contact)}>

                  {/* Avatar */}
                  <div className="w-10 h-10 bg-gold/10 border border-gold/20
                    rounded-full flex items-center justify-center
                    text-gold font-bold shrink-0">
                    {contact.name?.[0]?.toUpperCase()}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <p className={`font-semibold text-sm
                        ${contact.status === 'unread'
                          ? 'text-cream' : 'text-cream/80'}`}>
                        {contact.name}
                      </p>
                      <span className={`text-xs px-2 py-0.5 rounded-full
                        font-medium ${cfg.cls}`}>
                        {cfg.label}
                      </span>
                    </div>
                    <p className="text-xs text-surface truncate">
                      {contact.subject || contact.message}
                    </p>
                  </div>

                  <div className="text-right shrink-0">
                    <p className="text-xs text-surface">
                      {formatDate(contact.created_at)}
                    </p>
                    <p className="text-xs text-gold mt-0.5">
                      {contact.email}
                    </p>
                  </div>
                </div>

                {/* Expanded content */}
                {open && (
                  <div className="border-t border-dark-400 p-5 space-y-4">

                    {/* Info */}
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      {[
                        { label: 'Email', value: contact.email },
                        { label: 'Điện thoại', value: contact.phone || '—' },
                        { label: 'Tiêu đề', value: contact.subject || '—' },
                      ].map((item) => (
                        <div key={item.label}>
                          <p className="text-xs text-surface uppercase
                            tracking-wider mb-1">{item.label}</p>
                          <p className="text-cream text-sm">{item.value}</p>
                        </div>
                      ))}
                    </div>

                    {/* Message */}
                    <div>
                      <p className="text-xs text-surface uppercase
                        tracking-wider mb-2">Nội dung</p>
                      <div className="bg-dark-600 border border-dark-400
                        rounded-xl p-4 text-cream/80 text-sm leading-relaxed">
                        {contact.message}
                      </div>
                    </div>

                    {/* Admin note */}
                    <div>
                      <p className="text-xs text-surface uppercase
                        tracking-wider mb-2">Ghi chú Admin</p>
                      <textarea
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        rows={3}
                        placeholder="Ghi chú về tin nhắn này..."
                        className="w-full bg-dark-600 border border-dark-400
                          text-cream rounded-xl px-4 py-3 text-sm
                          focus:outline-none focus:border-gold/50
                          resize-none transition placeholder-surface"
                      />
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-3 flex-wrap">
                      <button
                        onClick={() => handleSaveNote(contact.id)}
                        className="flex items-center gap-2 bg-gold
                          hover:bg-gold-light text-dark-900 font-bold
                          px-4 py-2 rounded-xl text-sm transition">
                        <FaReply size={12} /> Lưu & Đánh dấu đã trả lời
                      </button>

                      {contact.status !== 'unread' && (
                        <button
                          onClick={() => handleStatus(contact.id, 'unread')}
                          className="px-4 py-2 border border-yellow-500/30
                            text-yellow-400 hover:bg-yellow-500/10
                            rounded-xl text-sm transition">
                          Đánh dấu chưa đọc
                        </button>
                      )}

                      <a href={`mailto:${contact.email}`}
                        className="px-4 py-2 border border-blue-500/30
                          text-blue-400 hover:bg-blue-500/10
                          rounded-xl text-sm transition">
                        Gửi Email
                      </a>

                      <button
                        onClick={() => handleDelete(contact.id)}
                        className="ml-auto flex items-center gap-2
                          text-red-400 hover:bg-red-500/10 border
                          border-red-500/20 hover:border-red-500/40
                          px-4 py-2 rounded-xl text-sm transition">
                        <FaTrash size={11} /> Xóa
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      <Pagination
        meta={data}
        onPageChange={(page) => setFilters((f) => ({ ...f, page }))}
      />
    </div>
  )
}