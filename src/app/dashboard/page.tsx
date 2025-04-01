'use client'

import { useSession } from 'next-auth/react'

export default function DashboardPage() {
  const { data: session } = useSession()

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">👋 Welcome, {session?.user?.name || 'Guest'}!</h1>

      {/* Statistiche */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="stat bg-base-100 shadow-md rounded-lg">
          <div className="stat-title text-sm">Total Bookings</div>
          <div className="stat-value text-primary">24</div>
        </div>
        <div className="stat bg-base-100 shadow-md rounded-lg">
          <div className="stat-title text-sm">Guests Today</div>
          <div className="stat-value text-secondary">7</div>
        </div>
        <div className="stat bg-base-100 shadow-md rounded-lg">
          <div className="stat-title text-sm">Open Rooms</div>
          <div className="stat-value text-accent">5</div>
        </div>
        <div className="stat bg-base-100 shadow-md rounded-lg">
          <div className="stat-title text-sm">Pending Payments</div>
          <div className="stat-value text-warning">3</div>
        </div>
      </div>

      {/* Sezione Ospiti */}
      <div className="bg-base-100 shadow-md rounded-lg p-4">
        <h2 className="text-xl font-semibold mb-2">🛌 Latest Guests</h2>
        <ul className="divide-y divide-base-300 text-sm">
          <li className="py-2 flex justify-between">
            <span>Maria Rossi</span>
            <span className="text-gray-400">Room 8 - Abbey</span>
          </li>
          <li className="py-2 flex justify-between">
            <span>Jean Dupont</span>
            <span className="text-gray-400">Room 2 - Guest House</span>
          </li>
          <li className="py-2 flex justify-between">
            <span>Angela Smith</span>
            <span className="text-gray-400">Room 5 - Abbey</span>
          </li>
        </ul>
      </div>
    </div>
  )
}
