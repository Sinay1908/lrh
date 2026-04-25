'use client'

import { usePathname } from 'next/navigation'
import NavBar from '@/components/public/NavBar'
import Footer from '@/components/public/Footer'

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  return (
    <>
      <NavBar currentPath={pathname} />
      <main style={{ paddingTop: 72 }}>{children}</main>
      <Footer />
    </>
  )
}
