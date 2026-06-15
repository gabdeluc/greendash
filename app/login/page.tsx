'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const supabase = createClient()
  const router   = useRouter()
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState('')
  const [mode, setMode]         = useState<'login' | 'signup'>('login')

  async function handleSubmit() {
    if (!email || !password) return
    setLoading(true)
    setError('')

    if (mode === 'login') {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) { setError(error.message); setLoading(false) }
      else router.push('/dashboard')
    } else {
      const { error } = await supabase.auth.signUp({
        email, password,
        options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
      })
      if (error) { setError(error.message); setLoading(false) }
      else { setError('Controlla la tua email per confermare la registrazione.'); setLoading(false) }
    }
  }

  return (
    <div className="min-h-screen bg-[#0e131f] flex items-center justify-center p-6">
      <main className="w-full max-w-[400px] bg-[#161c28] border border-[#3c4a42] rounded-xl p-8 shadow-2xl shadow-black/40">

        {/* Header */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-12 h-12 rounded-lg bg-[#242a36] border border-[#3c4a42] flex items-center justify-center mb-3">
            <span className="material-symbols-outlined text-[#4edea3] text-3xl"
              style={{ fontVariationSettings: "'FILL' 1" }}>
              energy_savings_leaf
            </span>
          </div>
          <h1 className="text-[#4edea3] font-semibold text-2xl tracking-tight">GreenDash</h1>
          <p className="text-[#bbcabf] text-sm mt-1">
            {mode === 'login' ? 'Sign in to your terminal' : 'Create your account'}
          </p>
        </div>

        {/* Form */}
        <div className="flex flex-col gap-5">
          {/* Email */}
          <div className="flex flex-col gap-1">
            <label className="text-[#bbcabf] text-[11px] font-semibold uppercase tracking-wider">
              Email Address
            </label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#bbcabf] text-[18px]">
                mail
              </span>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="operator@greendash.io"
                className="w-full bg-[#0e131f] border border-[#3c4a42] rounded-lg pl-10 pr-4 py-2.5 text-[#dde2f3] text-sm placeholder:text-[#bbcabf]/40 focus:outline-none focus:border-[#4edea3] transition-colors"
              />
            </div>
          </div>

          {/* Password */}
          <div className="flex flex-col gap-1">
            <div className="flex items-center justify-between">
              <label className="text-[#bbcabf] text-[11px] font-semibold uppercase tracking-wider">
                Password
              </label>
            </div>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#bbcabf] text-[18px]">
                lock
              </span>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                onKeyDown={e => e.key === 'Enter' && handleSubmit()}
                className="w-full bg-[#0e131f] border border-[#3c4a42] rounded-lg pl-10 pr-4 py-2.5 text-[#dde2f3] text-sm placeholder:text-[#bbcabf]/40 focus:outline-none focus:border-[#4edea3] transition-colors"
              />
            </div>
          </div>

          {error && (
            <p className={`text-sm ${error.includes('email') ? 'text-[#4edea3]' : 'text-red-400'}`}>
              {error}
            </p>
          )}

          {/* Button */}
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-[#10b981] hover:bg-[#4edea3] text-[#003824] font-semibold text-sm py-2.5 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2 group disabled:opacity-50 mt-1"
          >
            {loading ? 'Loading...' : mode === 'login' ? 'Sign In' : 'Create Account'}
            {!loading && (
              <span className="material-symbols-outlined text-[18px] group-hover:translate-x-0.5 transition-transform">
                arrow_forward
              </span>
            )}
          </button>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center">
          <p className="text-[#bbcabf] text-sm">
            {mode === 'login' ? 'New to GreenDash? ' : 'Already have an account? '}
            <button
              onClick={() => { setMode(mode === 'login' ? 'signup' : 'login'); setError('') }}
              className="text-[#4edea3] hover:text-[#6ffbbe] font-semibold transition-colors"
            >
              {mode === 'login' ? 'Sign up' : 'Sign in'}
            </button>
          </p>
        </div>
      </main>
    </div>
  )
}