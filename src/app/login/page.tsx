'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleLogin = async () => {
    setLoading(true)
    setError(null)
    const res = await signIn('credentials', {
      email,
      callbackUrl: '/dashboard',
      redirect: false,
    })

    if (res?.error) {
      setError('❌ Access denied. Make sure your email is registered as Admin in Salesforce.')
    } else {
      window.location.href = res?.url || '/dashboard'
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200" data-theme="dark">
      <div className="card w-full max-w-md bg-base-100 shadow-lg">
        <div className="card-body">
          <h2 className="text-2xl font-bold text-center mb-6">🔐 Admin Login</h2>

          <input
            type="email"
            placeholder="Enter your email"
            className="input input-bordered w-full mb-4"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <button
            className={`btn btn-primary w-full ${loading ? 'loading' : ''}`}
            onClick={handleLogin}
            disabled={!email || loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>

          {error && (
            <div className="mt-4 text-red-500 text-sm bg-red-100 p-2 rounded">
              {error}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
