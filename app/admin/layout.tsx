import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: { template: '%s | Admin LRH', default: 'Administration | Lyon Roller Hockey' },
}

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
