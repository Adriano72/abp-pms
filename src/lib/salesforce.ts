const TOKEN_URL = `${process.env.SALESFORCE_LOGIN_URL}/services/oauth2/token`

let cachedAccessToken: string | null = null
let cachedInstanceUrl: string | null = null

async function authenticateWithSalesforce() {
  const res = await fetch(TOKEN_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'password',
      client_id: process.env.SALESFORCE_CLIENT_ID!,
      client_secret: process.env.SALESFORCE_CLIENT_SECRET!,
      username: process.env.SALESFORCE_USERNAME!,
      password: `${process.env.SALESFORCE_PASSWORD}${process.env.SALESFORCE_TOKEN || ''}`,
    }),
  })

  if (!res.ok) {
    const error = await res.text()
    console.error('Salesforce Auth Error:', error)
    throw new Error('Failed to authenticate with Salesforce')
  }

  const data = await res.json()
  cachedAccessToken = data.access_token
  cachedInstanceUrl = data.instance_url
}

export async function salesforceRequest<T = any>(
  path: string,
  method: 'GET' | 'POST' | 'PATCH' | 'DELETE' = 'GET',
  body?: Record<string, any>
): Promise<T> {
  if (!cachedAccessToken || !cachedInstanceUrl) {
    await authenticateWithSalesforce()
  }

  const url = `${cachedInstanceUrl}/services/data/v59.0${path}`

  const res = await fetch(url, {
    method,
    headers: {
      Authorization: `Bearer ${cachedAccessToken}`,
      'Content-Type': 'application/json',
    },
    body: body ? JSON.stringify(body) : undefined,
  })

  if (res.status === 401) {
    console.warn('Access token expired, refreshing...')
    await authenticateWithSalesforce()
    return salesforceRequest<T>(path, method, body)
  }

  if (!res.ok) {
    const error = await res.text()
    console.error('Salesforce API Error:', error)
    throw new Error(`Salesforce API request failed: ${res.statusText}`)
  }

  return res.json()
}
