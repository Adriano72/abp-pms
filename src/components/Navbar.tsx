'use client'

import Link from 'next/link'
import { signOut } from 'next-auth/react'

export default function Navbar() {
  return (
    <nav className="flex items-center gap-2">
      <Link href="/test/sf-connection" className="btn btn-ghost btn-sm">SF Test</Link>
      <Link href="/test/contacts" className="btn btn-ghost btn-sm">Contacts</Link>
      <Link href="/test/event-registrations" className="btn btn-ghost btn-sm">Registrations</Link>
      <Link href="/dashboard" className="btn btn-outline btn-sm">Dashboard</Link>
      <button onClick={() => signOut({ callbackUrl: '/login' })} className="btn btn-error btn-sm ml-2">
        Logout
      </button>
    </nav>
  )
}
