'use client'

import { Suspense, useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import Image from 'next/image'
import { SessionProvider } from 'next-auth/react'
import { A, ABtn, AInput, Icon } from '@/components/admin/ui'

function LoginForm() {
  const router = useRouter()
  const params = useSearchParams()
  const [email, setEmail]     = useState('admin@lyonrollerhockey.fr')
  const [pass, setPass]       = useState('')
  const [error, setError]     = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const res = await signIn('credentials', {
      email,
      password: pass,
      redirect: false,
    })
    setLoading(false)
    if (res?.error) {
      setError('Identifiants incorrects. Vérifiez votre email et mot de passe.')
    } else {
      const cb = params.get('callbackUrl')
      router.push(cb ? decodeURIComponent(cb) : '/admin')
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: A.navy, display: 'flex',
      alignItems: 'center', justifyContent: 'center', padding: 20,
      position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', right: -120, top: -80, width: 500, height: 500,
        borderRadius: '50%', background: 'rgba(168,214,232,0.06)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', left: -80, bottom: -80, width: 360, height: 360,
        borderRadius: '50%', background: 'rgba(212,43,43,0.07)', pointerEvents: 'none' }} />
      <Image src="/assets/logo-principal.png" alt="" width={280} height={280}
        style={{ position: 'absolute', right: '6%', bottom: '6%',
          opacity: 0.07, filter: 'brightness(10)', pointerEvents: 'none' }} />

      <div style={{ width: '100%', maxWidth: 400, position: 'relative', zIndex: 2 }}>
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <Image src="/assets/logo-principal.png" alt="Lyon Roller Hockey" width={64} height={64}
            style={{ objectFit: 'contain', margin: '0 auto 14px', display: 'block' }} />
          <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 900,
            fontSize: 22, color: '#fff', letterSpacing: 2 }}>LYON ROLLER HOCKEY</div>
          <div style={{ color: 'rgba(168,214,232,0.7)', fontSize: 12.5, marginTop: 4,
            fontFamily: "'Barlow',sans-serif", letterSpacing: 1.5, textTransform: 'uppercase' }}>
            Espace administration
          </div>
        </div>

        <div style={{ background: A.white, borderRadius: A.r12, padding: '32px 28px',
          boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}>
          <h2 style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 700,
            fontSize: 20, color: A.textPri, margin: '0 0 22px' }}>Connexion</h2>
          <form onSubmit={handleSubmit}>
            <AInput label="Adresse email" type="email" value={email}
              onChange={e => setEmail(e.target.value)} required
              icon="mail" placeholder="admin@lyonrollerhockey.fr" />
            <AInput label="Mot de passe" type="password" value={pass}
              onChange={e => { setPass(e.target.value); setError('') }} required
              placeholder="••••••••" />
            {error && (
              <div style={{ background: A.redL, border: `1px solid rgba(212,43,43,0.2)`,
                borderRadius: A.r8, padding: '10px 14px', marginBottom: 14,
                color: A.red, fontSize: 13, display: 'flex', alignItems: 'center', gap: 8 }}>
                <Icon name="x" size={13} color={A.red} />
                {error}
              </div>
            )}
            <ABtn variant="navy" size="lg" fullWidth type="submit" disabled={loading}>
              {loading ? 'Connexion en cours…' : 'Se connecter'}
            </ABtn>
          </form>
        </div>

        <p style={{ textAlign: 'center', marginTop: 20, color: 'rgba(255,255,255,0.3)',
          fontFamily: "'Barlow',sans-serif", fontSize: 12 }}>
          © 2025 Lyon Roller Hockey — Accès réservé
        </p>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <SessionProvider>
      <Suspense fallback={null}>
        <LoginForm />
      </Suspense>
    </SessionProvider>
  )
}
