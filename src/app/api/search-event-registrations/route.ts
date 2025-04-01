import { NextResponse } from 'next/server'
import { salesforceRequest } from '@/lib/salesforce'

type EventRegistration = {
  Id: string
  Registration_Type__c?: string
  CreatedDate: string
  Event_Name__r?: { Name: string }
}

type ContactQueryResponse = {
  records: { Id: string }[]
}

type EventRegistrationQueryResponse = {
  records: EventRegistration[]
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const email = searchParams.get('email')

  if (!email) {
    return NextResponse.json({ error: 'Missing email' }, { status: 400 })
  }

  try {
    // Step 1: Cerca il contatto in Salesforce
    const contactQuery = `
      SELECT Id FROM Contact WHERE Email = '${email}' LIMIT 1
    `
    const contactRes = await salesforceRequest<ContactQueryResponse>(
      `/query?q=${encodeURIComponent(contactQuery)}`
    )

    const contact = contactRes.records[0]
    if (!contact) {
      return NextResponse.json({ error: 'Contact not found' }, { status: 404 })
    }

    // Step 2: Recupera le registrazioni
    const registrationQuery = `
      SELECT Id, Registration_Type__c, CreatedDate, Event_Name__r.Name
      FROM Event_Registration__c
      WHERE Attendee__c = '${contact.Id}'
      ORDER BY CreatedDate DESC
    `
    const registrationRes = await salesforceRequest<EventRegistrationQueryResponse>(
      `/query?q=${encodeURIComponent(registrationQuery)}`
    )

    return NextResponse.json(registrationRes.records)
  } catch (err) {
    console.error('SF Event Registration Error:', err)
    const message = err instanceof Error ? err.message : 'Unknown error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
