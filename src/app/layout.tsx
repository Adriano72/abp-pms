import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { ReactNode } from 'react'
import SessionWrapper from '@/components/SessionWrapper'
import Navbar from '@/components/Navbar'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'ABP PMS',
  description: 'Charity Property Management System',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" data-theme="dark">
      <body className={`${inter.className} bg-base-200 text-base-content min-h-screen flex flex-col`}>
        <SessionWrapper>
          <header className="bg-base-300 shadow-md p-4 flex justify-between items-center">
            <h1 className="text-lg font-bold">🏨 ABP PMS</h1>
            <Navbar />
          </header>

          <main className="flex-grow container mx-auto px-4 py-6">{children}</main>

          <footer className="bg-base-300 text-center text-sm p-4">
            ABP PMS — Prototype © {new Date().getFullYear()}
          </footer>
        </SessionWrapper>
      </body>
    </html>
  )
}
