import { useState } from 'react'
import { Navigate } from 'react-router-dom'
import { Eye, EyeOff } from 'lucide-react'
import { useAuth } from './AuthContext'
import BrandMark from '../../shared/BrandMark'

export default function LoginPage() {
  const { login, authError, user } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email || !password) return
    setSubmitting(true)
    await login(email.trim(), password)
    setSubmitting(false)
  }

  if (user) return <Navigate to="/" replace />

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-rose-50 via-white to-orange-50 dark:from-stone-950 dark:via-stone-900 dark:to-stone-950">
      <div className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-rose-200/40 blur-3xl dark:bg-rose-500/10" />
      <div className="pointer-events-none absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-orange-200/40 blur-3xl dark:bg-orange-500/10" />

      <div className="relative flex min-h-screen items-center justify-center px-6">
        <div className="w-full max-w-sm">
          <div className="mb-9 text-center">
            <div className="mb-5 flex justify-center">
              <BrandMark size={48} />
            </div>
            <h1 className="font-display text-[26px] font-semibold tracking-tight text-stone-900 dark:text-white">
              Private Couple App
            </h1>
            <p className="mt-1.5 text-sm text-stone-500 dark:text-stone-400">Just for the two of us</p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="rounded-3xl border border-white/60 bg-white/70 p-6 shadow-xl shadow-stone-200/50 backdrop-blur-xl dark:border-white/10 dark:bg-white/5 dark:shadow-none"
          >
            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="mb-1.5 block text-xs font-medium text-stone-600 dark:text-stone-300">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  autoComplete="email"
                  required
                  className="w-full rounded-xl border border-stone-200 bg-white px-3.5 py-2.5 text-sm text-stone-900 outline-none placeholder:text-stone-400 focus:border-rose-400 focus:ring-2 focus:ring-rose-100 dark:border-white/10 dark:bg-stone-900 dark:text-white dark:focus:ring-rose-500/20"
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="mb-1.5 block text-xs font-medium text-stone-600 dark:text-stone-300"
                >
                  Password
                </label>
                <div className="flex items-center rounded-xl border border-stone-200 bg-white pr-2 focus-within:border-rose-400 focus-within:ring-2 focus-within:ring-rose-100 dark:border-white/10 dark:bg-stone-900 dark:focus-within:ring-rose-500/20">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    autoComplete="current-password"
                    required
                    className="w-full bg-transparent px-3.5 py-2.5 text-sm text-stone-900 outline-none placeholder:text-stone-400 dark:text-white"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((s) => !s)}
                    className="rounded-lg p-1.5 text-stone-400 hover:text-stone-600 dark:hover:text-stone-200"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            </div>

            {authError && (
              <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-xs text-red-600 dark:bg-red-500/10 dark:text-red-400">
                {authError}
              </p>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="mt-6 w-full rounded-xl bg-gradient-to-r from-rose-500 to-orange-500 py-3 text-sm font-semibold text-white shadow-lg shadow-rose-500/25 transition active:scale-[0.98] disabled:opacity-60"
            >
              {submitting ? 'Signing in…' : 'Sign In'}
            </button>
          </form>

          <p className="mt-6 text-center text-xs text-stone-400 dark:text-stone-500">
            End-to-end encrypted · No public sign-up
          </p>
        </div>
      </div>
    </div>
  )
}
