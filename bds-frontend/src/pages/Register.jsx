import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FaHome, FaEye, FaEyeSlash } from 'react-icons/fa'
import toast from 'react-hot-toast'
import api from '../api/axios'
import useAuthStore from '../store/authStore'

function Field({ name, label, type = 'text', placeholder, form, errors, onChange }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <input name={name} type={type}
        value={form[name]} onChange={onChange}
        placeholder={placeholder}
        className={`w-full border rounded-xl px-4 py-3 text-sm
          focus:outline-none focus:ring-2 focus:ring-orange-300
          ${errors[name] ? 'border-red-400' : 'border-gray-200'}`}
      />
      {errors[name] && (
        <p className="text-red-400 text-xs mt-1">{errors[name][0]}</p>
      )}
    </div>
  )
}

export default function Register() {
  const navigate  = useNavigate()
  const { setAuth } = useAuthStore()

  const [form, setForm] = useState({
    name: '', email: '', phone: '',
    password: '', password_confirmation: '',
  })
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
      const { data } = await api.post('/auth/register', form)
      setAuth(data.user, data.token)
      toast.success('Đăng ký thành công!')
      navigate('/')
    } catch (err) {
      if (err.response?.status === 422) {
        setErrors(err.response.data.errors || {})
      } else {
        toast.error('Đăng ký thất bại, thử lại sau')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">

        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2
            text-2xl font-bold text-orange-500">
            <FaHome /> BĐSViệt
          </Link>
          <p className="text-gray-500 text-sm mt-2">Tạo tài khoản miễn phí</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-8">
          <form onSubmit={submit} className="space-y-4">

            <Field name="name"  label="Họ và tên"
              placeholder="Nguyễn Văn A" form={form} errors={errors} onChange={handle} />
            <Field name="email" label="Email" type="email"
              placeholder="example@gmail.com" form={form} errors={errors} onChange={handle} />
            <Field name="phone" label="Số điện thoại"
              placeholder="0901234567" form={form} errors={errors} onChange={handle} />

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mật khẩu
              </label>
              <div className="relative">
                <input name="password"
                  type={showPwd ? 'text' : 'password'}
                  value={form.password} onChange={handle}
                  placeholder="Tối thiểu 6 ký tự"
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

            <Field name="password_confirmation" label="Xác nhận mật khẩu"
              type="password" placeholder="Nhập lại mật khẩu"
              form={form} errors={errors} onChange={handle} />

            <button type="submit" disabled={loading}
              className="w-full bg-orange-500 hover:bg-orange-600
                disabled:opacity-60 text-white font-semibold
                py-3 rounded-xl transition mt-2">
              {loading ? 'Đang tạo tài khoản...' : 'Đăng ký'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Đã có tài khoản?{' '}
            <Link to="/login"
              className="text-orange-500 font-medium hover:underline">
              Đăng nhập
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
