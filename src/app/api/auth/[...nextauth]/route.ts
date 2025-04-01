import NextAuth, { AuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { salesforceRequest } from '@/lib/salesforce'

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Email Login',
      credentials: {
        email: { label: 'Email', type: 'email' },
      },
      async authorize(credentials) {
        const email = credentials?.email?.trim()
        if (!email) return null

        // Escape per evitare injection SOQL
        const escapedEmail = email.replace(/'/g, "\\'")

        try {
          const query = `
            SELECT Id, Email, FirstName, LastName, Access_Control_Profiles__c
            FROM Contact
            WHERE Email = '${escapedEmail}'
              AND Access_Control_Profiles__c = 'Admin'
            LIMIT 1
          `

          const result = await salesforceRequest<{
            records: Array<{
              Id: string
              Email: string
              FirstName?: string
              LastName?: string
              Access_Control_Profiles__c?: string
            }>
          }>(`/query?q=${encodeURIComponent(query)}`)

          console.log('[SF Auth] Query result:', result.records)

          const contact = result.records?.[0]

          if (!contact) {
            console.warn(`❌ No admin found for: ${email}`)
            return null
          }

          if (contact.Access_Control_Profiles__c !== 'Admin') {
            console.warn(`⛔ Not authorized: ${email} → ${contact.Access_Control_Profiles__c}`)
            return null
          }

          return {
            id: contact.Id,
            email: contact.Email,
            name: `${contact.FirstName ?? ''} ${contact.LastName ?? ''}`.trim(),
          }
        } catch (err) {
          console.error('Salesforce login error:', err)
          return null
        }
      },
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/login',
  },
  secret: process.env.NEXTAUTH_SECRET,
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
