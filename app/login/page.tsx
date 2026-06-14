'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const supabase = createClient()
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleLogin() {
    // 1. Aggiungi questo controllo
    if (!email || !password) {
      setError('Per favore, inserisci email e password.')
      return
    }

    setLoading(true)
    setError('')
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) { 
      setError(error.message)
      setLoading(false) 
    }
    else {
      router.push('/dashboard')
    }
  }

  async function handleSignup() {
    // 2. Aggiungi questo controllo
    if (!email || !password) {
      setError('Per favore, inserisci email e password.')
      return
    }

    setLoading(true)
    setError('')
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    })
    
    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      setError('Controlla la tua email e clicca sul link di conferma.')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950">
      <div className="w-full max-w-sm bg-gray-900 border border-gray-800 rounded-xl p-8">
        <div className="flex items-center gap-2 mb-8">
          <span className="text-green-400 text-xl">🌱</span>
          <h1 className="text-white font-medium text-lg">GreenDash</h1>
        </div>
        <div className="space-y-4">
          <div>
            <label className="text-sm text-gray-400 block mb-1">Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-green-500"
              placeholder="tu@email.com" />
          </div>
          <div>
            <label className="text-sm text-gray-400 block mb-1">Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-green-500"
              placeholder="••••••••" />
          </div>
          {error && <p className="text-sm text-red-400">{error}</p>}
          <button onClick={handleLogin} disabled={loading}
            className="w-full bg-green-500 hover:bg-green-400 text-gray-950 font-medium rounded-lg py-2 text-sm transition-colors disabled:opacity-50">
            {loading ? 'Caricamento...' : 'Accedi'}
          </button>
          <button onClick={handleSignup} disabled={loading}
            className="w-full border border-gray-700 hover:border-gray-600 text-gray-300 rounded-lg py-2 text-sm transition-colors">
            Registrati
          </button>
        </div>
      </div>
    </div>
  )
}