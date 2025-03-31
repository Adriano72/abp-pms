import { NextResponse } from 'next/server'
import { salesforceRequest } from '@/lib/salesforce'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const email = searchParams.get('email')

  if (!email) {
    return NextResponse.json({ error: 'Missing email' }, { status: 400 })
  }

  try {
    // 1. Trova il contatto
    const contactQuery = `
      SELECT Id FROM Contact WHERE Email = '${email}' LIMIT 1
    `
    const contactRes = await salesforceRequest(`/query?q=${encodeURIComponent(contactQuery)}`)
    const contact = contactRes.records[0]

    if (!contact) {
      return NextResponse.json([], { status: 200 })
    }

    // 2. Trova le registrazioni evento, includendo il nome evento con dot notation
    const registrationQuery = `
      SELECT Id, Name, Registration_Type__c, CreatedDate, Event_Name__r.Name
      FROM Event_Registration__c
      WHERE Attendee__c = '${contact.Id}'
      ORDER BY CreatedDate DESC
    `
    const registrationRes = await salesforceRequest(`/query?q=${encodeURIComponent(registrationQuery)}`)

    return NextResponse.json(registrationRes.records)
  } catch (err: any) {
    console.error(err)
    return NextResponse.json({ error: err.message || 'Internal error' }, { status: 500 })
  }
}
