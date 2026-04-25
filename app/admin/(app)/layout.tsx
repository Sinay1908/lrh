'use client'

import { SessionProvider } from 'next-auth/react'
import AdminLayout from '@/components/admin/AdminLayout'

export default function ProtectedAdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <AdminLayout>{children}</AdminLayout>
    </SessionProvider>
  )
}
