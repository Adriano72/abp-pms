import { salesforceRequest } from '@/lib/salesforce'

type SObjectInfo = {
  name: string
  label: string
}

type SObjectResponse = {
  sobjects: SObjectInfo[]
}

export default async function Page() {
  let data: SObjectResponse | null = null
  let error: string | null = null

  try {
    data = await salesforceRequest<SObjectResponse>('/sobjects')
  } catch (err) {
    if (err instanceof Error) {
      error = err.message
    } else {
      error = 'Unknown error'
    }
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Salesforce Connection Test</h1>

      {error ? (
        <div className="bg-red-100 text-red-800 p-4 rounded">
          <p className="font-semibold">❌ Error connecting to Salesforce:</p>
          <pre className="mt-2 whitespace-pre-wrap text-sm">{error}</pre>
        </div>
      ) : (
        <div className="bg-green-100 text-green-900 p-4 rounded">
          <p className="font-semibold mb-2">✅ Connected! Available objects:</p>
          <pre className="text-sm whitespace-pre-wrap">
            {JSON.stringify(data?.sobjects.slice(0, 5), null, 2)}
          </pre>
        </div>
      )}
    </div>
  )
}
