import React, { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { adminService } from '@/api/admin'

const AdminLoginPage: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setErrorMessage(null)

    try {
      setIsSubmitting(true)
      const result = await adminService.login({ email: email.trim(), password })
      adminService.saveSession(result.token, result.admin)

      const redirectTarget =
        typeof location.state === 'object' &&
        location.state !== null &&
        'from' in location.state &&
        typeof (location.state as { from?: string }).from === 'string'
          ? (location.state as { from: string }).from
          : '/admin/dashboard'

      navigate(redirectTarget, { replace: true })
    } catch (error: unknown) {
      const message =
        typeof error === 'object' &&
        error !== null &&
        'response' in error &&
        typeof (error as { response?: { data?: { message?: string } } }).response?.data?.message === 'string'
          ? (error as { response: { data: { message: string } } }).response.data.message
          : 'Unable to sign in. Please check your credentials.'
      setErrorMessage(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="min-h-screen bg-[#f8fafc] px-4 py-10 text-slate-900" data-testid="admin-login">
      <section className="mx-auto max-w-120 rounded-2xl border border-slate-200 bg-white p-6 shadow-lg md:p-8">
        <h1 className="mb-2 text-[36px] font-semibold text-slate-900">Admin Login</h1>
        <p className="mb-6 text-[15px] text-slate-600">Sign in with your admin account to access dashboard controls.</p>

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label htmlFor="admin-email" className="mb-2 block text-sm text-slate-700">Email</label>
            <input
              id="admin-email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              className="h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-slate-900 outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100"
            />
          </div>

          <div>
            <label htmlFor="admin-password" className="mb-2 block text-sm text-slate-700">Password</label>
            <input
              id="admin-password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              className="h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-slate-900 outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100"
            />
          </div>

          {errorMessage ? <p className="text-sm text-red-600">{errorMessage}</p> : null}

          <button
            type="submit"
            disabled={isSubmitting}
            className="h-11 w-full rounded-lg bg-slate-900 text-[16px] font-semibold text-white hover:bg-slate-800 disabled:bg-slate-400"
          >
            {isSubmitting ? 'Signing In...' : 'Sign In'}
          </button>
        </form>
      </section>
    </main>
  )
}

AdminLoginPage.displayName = 'AdminLoginPage'
export default AdminLoginPage