import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FaHome, FaEye, FaEyeSlash } from 'react-icons/fa'
import toast from 'react-hot-toast'
import api from '../api/axios'
import useAuthStore from '../store/authStore'

export default function Login() {
  const navigate  = useNavigate()
  const { setAuth } = useAuthStore()

  const [form, setForm]       = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [showPwd, setShowPwd] = useState(false)
  const [errors, setErrors]   = useState({})

  const handle = (e) =>
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }))

  const submit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setErrors({})
    try {
      const { data } = await api.post('/auth/login', form)
      setAuth(data.user, data.token)
      toast.success(`Chào mừng ${data.user.name}!`)
      navigate(data.user.role === 'admin' ? '/admin' : '/')
    } catch (err) {
      if (err.response?.status === 422) {
        setErrors(err.response.data.errors || {})
      } else {
        toast.error(err.response?.data?.message || 'Đăng nhập thất bại')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2
            text-2xl font-bold text-orange-500">
            <FaHome /> BĐSViệt
          </Link>
          <p className="text-gray-500 text-sm mt-2">Đăng nhập để tiếp tục</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-8">
          <form onSubmit={submit} className="space-y-5">

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                name="email" type="email"
                value={form.email} onChange={handle}
                placeholder="example@gmail.com"
                className={`w-full border rounded-xl px-4 py-3 text-sm
                  focus:outline-none focus:ring-2 focus:ring-orange-300
                  ${errors.email ? 'border-red-400' : 'border-gray-200'}`}
              />
              {errors.email && (
                <p className="text-red-400 text-xs mt-1">{errors.email[0]}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mật khẩu
              </label>
              <div className="relative">
                <input
                  name="password"
                  type={showPwd ? 'text' : 'password'}
                  value={form.password} onChange={handle}
                  placeholder="••••••••"
                  className={`w-full border rounded-xl px-4 py-3 text-sm
                    focus:outline-none focus:ring-2 focus:ring-orange-300 pr-11
                    ${errors.password ? 'border-red-400' : 'border-gray-200'}`}
                />
                <button type="button"
                  onClick={() => setShowPwd((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2
                    text-gray-400 hover:text-gray-600">
                  {showPwd ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-400 text-xs mt-1">{errors.password[0]}</p>
              )}
            </div>

            {/* Submit */}
            <button type="submit" disabled={loading}
              className="w-full bg-orange-500 hover:bg-orange-600 disabled:opacity-60
                text-white font-semibold py-3 rounded-xl transition">
              {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Chưa có tài khoản?{' '}
            <Link to="/register" className="text-orange-500 font-medium hover:underline">
              Đăng ký ngay
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}