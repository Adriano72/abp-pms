import { salesforceRequest } from '@/lib/salesforce'

type Contact = {
  Id: string
  FirstName?: string
  LastName?: string
  Email?: string
}

type ContactQueryResponse = {
  records: Contact[]
}

export default async function Page() {
  let contacts: Contact[] = []
  let error: string | null = null

  try {
    const query = 'SELECT Id, FirstName, LastName, Email FROM Contact LIMIT 5'
    const encodedQuery = encodeURIComponent(query)
    const data = await salesforceRequest<ContactQueryResponse>(`/query?q=${encodedQuery}`)
    contacts = data.records
  } catch (err) {
    if (err instanceof Error) {
      error = err.message
    } else {
      error = 'Unknown error'
    }
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">📇 First 5 Salesforce Contacts</h1>

      {error ? (
        <div className="mt-4 text-red-600 bg-red-100 p-4 rounded">
          ❌ {error}
        </div>
      ) : (
        <ul className="mt-6 bg-white border border-green-200 p-4 rounded space-y-2 text-sm text-gray-800 shadow-sm">
          {contacts.map((contact) => (
            <li key={contact.Id}>
              <strong>{contact.FirstName} {contact.LastName}</strong> — {contact.Email || 'No email'}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
