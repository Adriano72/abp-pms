import { salesforceRequest } from '@/lib/salesforce'

export default async function Page() {
  let contacts: any[] = []
  let error: string | null = null

  try {
    const query = `
      SELECT Id, FirstName, LastName, Email
      FROM Contact
      ORDER BY LastName
      LIMIT 5
    `
    const encodedQuery = encodeURIComponent(query)
    const result = await salesforceRequest(`/query?q=${encodedQuery}`)
    contacts = result.records
  } catch (err: any) {
    error = err.message || 'Unknown error'
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">📇 First 5 Salesforce Contacts</h1>

      {error ? (
        <div className="bg-red-100 text-red-800 p-4 rounded">
          <p className="font-semibold">❌ Error fetching contacts:</p>
          <pre className="mt-2 whitespace-pre-wrap text-sm">{error}</pre>
        </div>
      ) : (
        <ul className="bg-green-100 text-green-900 p-4 rounded space-y-2">
          {contacts.map((contact) => (
            <li key={contact.Id} className="text-sm">
              <strong>{contact.FirstName} {contact.LastName}</strong> — {contact.Email || 'No email'}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
