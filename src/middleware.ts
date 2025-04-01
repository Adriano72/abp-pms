import { withAuth } from 'next-auth/middleware'
//import { NextResponse } from 'next/server'

export default withAuth({
  pages: {
    signIn: '/login', // redireziona qui se non autenticato
  },
})

export const config = {
  matcher: [
    // protegge tutto tranne login, api, assets e root-level files
    '/((?!api|_next|favicon.ico|.*\\..*|login).*)',
  ],
}
