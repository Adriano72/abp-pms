'use client'

import { useState } from 'react'

type EventRegistration = {
  Id: string
  Event_Name__r?: { Name: string }
  Registration_Type__c?: string
  CreatedDate: string
}

export default function EventRegistrationSearchPage() {
  const [email, setEmail] = useState<string>('')
  const [results, setResults] = useState<EventRegistration[]>([])
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState<boolean>(false)

  async function handleSearch() {
    setLoading(true)
    setError(null)
    setResults([])

    try {
      const res = await fetch(`/api/search-event-registrations?email=${encodeURIComponent(email)}`)
      if (!res.ok) throw new Error(await res.text())
      const data: EventRegistration[] = await res.json()
      setResults(data)
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError('Unknown error')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">🔎 Search Event Registrations</h1>

      <input
        type="email"
        className="border border-gray-300 rounded px-3 py-2 w-full mb-4"
        placeholder="Enter contact email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <button
        onClick={handleSearch}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        disabled={loading}
      >
        {loading ? 'Searching...' : "Search event's registrations"}
      </button>

      {error && (
        <div className="mt-4 text-red-600 bg-red-100 p-4 rounded">
          ❌ {error}
        </div>
      )}

      {results.length > 0 && (
        <ul className="mt-6 bg-white border border-green-200 p-4 rounded space-y-3 text-sm text-gray-800 shadow-sm">
          {results.map((r) => (
            <li key={r.Id}>
              <p><strong>📛 Event:</strong> {r.Event_Name__r?.Name || 'N/A'}</p>
              <p><strong>🎫 Type:</strong> {r.Registration_Type__c || 'N/A'}</p>
              <p><strong>📅 Created:</strong> {new Date(r.CreatedDate).toLocaleString()}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
