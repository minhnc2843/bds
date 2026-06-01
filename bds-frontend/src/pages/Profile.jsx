import { useState, useRef } from 'react'
import { FaCamera, FaUser, FaPhone, FaEnvelope, FaLock } from 'react-icons/fa'
import toast from 'react-hot-toast'
import { useMutation } from '@tanstack/react-query'
import api from '../api/axios'
import useAuthStore from '../store/authStore'

export default function Profile() {
  const { user, setAuth } = useAuthStore()
  const fileRef           = useRef()

  const [infoForm, setInfoForm] = useState({
    name:  user?.name  || '',
    phone: user?.phone || '',
  })

  const [pwdForm, setPwdForm] = useState({
    current_password:      '',
    password:              '',
    password_confirmation: '',
  })

  const [infoErrors, setInfoErrors] = useState({})
  const [pwdErrors,  setPwdErrors]  = useState({})
  const [avatarPreview, setAvatarPreview] = useState(
    user?.avatar
      ? `http://localhost/bds-api/public/storage/${user.avatar}`
      : null
  )

  // Mutation cập nhật thông tin
  const updateInfoMutation = useMutation({
    mutationFn: async (data) => {
      const res = await api.put('/profile', data)
      return res.data
    },
    onSuccess: (data) => {
      setAuth(data.user, localStorage.getItem('token'))
      toast.success('Cập nhật thông tin thành công!')
      setInfoErrors({})
    },
    onError: (err) => {
      if (err.response?.status === 422) {
        setInfoErrors(err.response.data.errors || {})
      } else {
        toast.error('Cập nhật thất bại')
      }
    },
  })

  // Mutation đổi mật khẩu
  const updatePwdMutation = useMutation({
    mutationFn: async (data) => {
      const res = await api.put('/profile/password', data)
      return res.data
    },
    onSuccess: () => {
      toast.success('Đổi mật khẩu thành công!')
      setPwdForm({
        current_password: '',
        password: '',
        password_confirmation: '',
      })
      setPwdErrors({})
    },
    onError: (err) => {
      if (err.response?.status === 422) {
        setPwdErrors(err.response.data.errors || {})
      } else {
        toast.error(err.response?.data?.message || 'Đổi mật khẩu thất bại')
      }
    },
  })

  // Mutation upload avatar
  const avatarMutation = useMutation({
    mutationFn: async (file) => {
      const formData = new FormData()
      formData.append('avatar', file)
      const res = await api.post('/profile/avatar', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      return res.data
    },
    onSuccess: (data) => {
      setAuth(data.user, localStorage.getItem('token'))
      toast.success('Cập nhật ảnh đại diện thành công!')
    },
    onError: () => toast.error('Upload ảnh thất bại'),
  })

  const handleAvatar = (e) => {
    const file = e.target.files[0]
    if (!file) return
    setAvatarPreview(URL.createObjectURL(file))
    avatarMutation.mutate(file)
  }

  const inputCls = (err) =>
    `w-full border rounded-xl px-4 py-2.5 text-sm
     focus:outline-none focus:ring-2 focus:ring-orange-300
     ${err ? 'border-red-400' : 'border-gray-200'}`

  return (
    <main className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        Thông tin cá nhân
      </h1>

      {/* ====== AVATAR ====== */}
      <div className="bg-white rounded-2xl p-6 shadow-sm mb-6 flex items-center gap-6">
        <div className="relative">
          <div className="w-20 h-20 rounded-full bg-orange-100
            flex items-center justify-center overflow-hidden">
            {avatarPreview
              ? <img src={avatarPreview} alt="avatar"
                  className="w-full h-full object-cover" />
              : <FaUser className="text-3xl text-orange-400" />
            }
          </div>
          <button
            onClick={() => fileRef.current.click()}
            disabled={avatarMutation.isPending}
            className="absolute bottom-0 right-0 w-7 h-7 bg-orange-500
              hover:bg-orange-600 text-white rounded-full flex items-center
              justify-center shadow transition">
            <FaCamera size={12} />
          </button>
          <input ref={fileRef} type="file"
            accept="image/*" className="hidden"
            onChange={handleAvatar} />
        </div>
        <div>
          <p className="font-bold text-gray-800 text-lg">{user?.name}</p>
          <p className="text-sm text-gray-400">{user?.email}</p>
          <span className={`text-xs font-bold px-2 py-0.5 rounded-full mt-1 inline-block
            ${user?.role === 'admin'
              ? 'bg-purple-100 text-purple-600'
              : 'bg-orange-100 text-orange-600'}`}>
            {user?.role === 'admin' ? 'Admin' : 'Thành viên'}
          </span>
        </div>
      </div>

      {/* ====== THÔNG TIN CƠ BẢN ====== */}
      <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
        <h2 className="font-bold text-gray-700 mb-4 pb-2 border-b">
          Thông tin cơ bản
        </h2>
        <div className="space-y-4">

          {/* Email (readonly) */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Email
            </label>
            <div className="relative">
              <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2
                text-gray-300" />
              <input value={user?.email} disabled
                className="w-full border border-gray-100 rounded-xl pl-10
                  pr-4 py-2.5 text-sm bg-gray-50 text-gray-400 cursor-not-allowed" />
            </div>
            <p className="text-xs text-gray-400 mt-1">Email không thể thay đổi</p>
          </div>

          {/* Họ tên */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Họ và tên
            </label>
            <div className="relative">
              <FaUser className="absolute left-4 top-1/2 -translate-y-1/2
                text-gray-300" />
              <input
                value={infoForm.name}
                onChange={(e) => setInfoForm((p) => ({ ...p, name: e.target.value }))}
                placeholder="Họ và tên"
                className={`${inputCls(infoErrors.name)} pl-10`}
              />
            </div>
            {infoErrors.name && (
              <p className="text-red-400 text-xs mt-1">{infoErrors.name[0]}</p>
            )}
          </div>

          {/* Số điện thoại */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Số điện thoại
            </label>
            <div className="relative">
              <FaPhone className="absolute left-4 top-1/2 -translate-y-1/2
                text-gray-300" />
              <input
                value={infoForm.phone}
                onChange={(e) => setInfoForm((p) => ({ ...p, phone: e.target.value }))}
                placeholder="0901234567"
                className={`${inputCls(infoErrors.phone)} pl-10`}
              />
            </div>
            {infoErrors.phone && (
              <p className="text-red-400 text-xs mt-1">{infoErrors.phone[0]}</p>
            )}
          </div>

          <button
            onClick={() => updateInfoMutation.mutate(infoForm)}
            disabled={updateInfoMutation.isPending}
            className="w-full bg-orange-500 hover:bg-orange-600
              disabled:opacity-60 text-white font-semibold
              py-3 rounded-xl transition">
            {updateInfoMutation.isPending ? 'Đang lưu...' : 'Lưu thông tin'}
          </button>
        </div>
      </div>

      {/* ====== ĐỔI MẬT KHẨU ====== */}
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <h2 className="font-bold text-gray-700 mb-4 pb-2 border-b">
          Đổi mật khẩu
        </h2>
        <div className="space-y-4">
          {[
            { key: 'current_password',      label: 'Mật khẩu hiện tại' },
            { key: 'password',              label: 'Mật khẩu mới' },
            { key: 'password_confirmation', label: 'Xác nhận mật khẩu mới' },
          ].map((f) => (
            <div key={f.key}>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                {f.label}
              </label>
              <div className="relative">
                <FaLock className="absolute left-4 top-1/2 -translate-y-1/2
                  text-gray-300" />
                <input
                  type="password"
                  value={pwdForm[f.key]}
                  onChange={(e) =>
                    setPwdForm((p) => ({ ...p, [f.key]: e.target.value }))}
                  placeholder="••••••••"
                  className={`${inputCls(pwdErrors[f.key])} pl-10`}
                />
              </div>
              {pwdErrors[f.key] && (
                <p className="text-red-400 text-xs mt-1">
                  {pwdErrors[f.key][0]}
                </p>
              )}
            </div>
          ))}

          <button
            onClick={() => updatePwdMutation.mutate(pwdForm)}
            disabled={updatePwdMutation.isPending}
            className="w-full bg-gray-800 hover:bg-gray-900
              disabled:opacity-60 text-white font-semibold
              py-3 rounded-xl transition">
            {updatePwdMutation.isPending ? 'Đang đổi...' : 'Đổi mật khẩu'}
          </button>
        </div>
      </div>
    </main>
  )
}