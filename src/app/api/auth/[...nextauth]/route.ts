import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { salesforceRequest } from '@/lib/salesforce'

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Email Login',
      credentials: {
        email: { label: 'Email', type: 'email' },
      },
      async authorize(credentials) {
        const email = credentials?.email
        if (!email) return null

        try {
          const query = `
            SELECT Id, Email, FirstName, LastName
            FROM Contact
            WHERE Email = '${email}'
              AND Access_Control_Profiles__c = 'Admin'
            LIMIT 1
          `
          const result = await salesforceRequest<{
            records: Array<{ Id: string; Email: string; FirstName?: string; LastName?: string }>
          }>(`/query?q=${encodeURIComponent(query)}`)

          const contact = result.records?.[0]
          if (!contact) return null

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
  session: { strategy: 'jwt' },
  pages: { signIn: '/login' },
  secret: process.env.NEXTAUTH_SECRET,
})

export { handler as GET, handler as POST }
