/**
 * Migration : ajoute la colonne photoUrl à la table staff
 * Usage : node migrate-staff-photo.mjs
 */
import { createConnection } from 'mariadb'
import { readFileSync, existsSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dir = dirname(fileURLToPath(import.meta.url))

// ── Lecture du DATABASE_URL depuis les fichiers .env ──────────────────────
function readEnvFiles() {
  const files = ['.env.local', '.env.production', '.env']
  for (const f of files) {
    const p = join(__dir, f)
    if (!existsSync(p)) continue
    const content = readFileSync(p, 'utf8')
    for (const line of content.split('\n')) {
      const m = line.match(/^DATABASE_URL\s*=\s*["']?(.+?)["']?\s*$/)
      if (m) return m[1].trim()
    }
  }
  return null
}

const dbUrl = process.env.DATABASE_URL || readEnvFiles()

if (!dbUrl) {
  console.error('❌ DATABASE_URL introuvable (ni dans l\'env ni dans .env/.env.local)')
  process.exit(1)
}

console.log('🔌 Connexion à la base de données…')

let url
try { url = new URL(dbUrl) } catch {
  console.error('❌ DATABASE_URL invalide :', dbUrl)
  process.exit(1)
}

const conn = await createConnection({
  host:     url.hostname,
  port:     parseInt(url.port || '3306'),
  user:     decodeURIComponent(url.username),
  password: decodeURIComponent(url.password),
  database: url.pathname.slice(1),
})

try {
  await conn.query('ALTER TABLE staff ADD COLUMN IF NOT EXISTS photoUrl VARCHAR(500) NULL')
  console.log('✅ Colonne photoUrl ajoutée à la table staff !')
} catch (e) {
  if (e.code === 'ER_DUP_FIELDNAME') {
    console.log('ℹ️  La colonne photoUrl existait déjà — rien à faire.')
  } else {
    console.error('❌ Erreur SQL :', e.message)
    process.exit(1)
  }
} finally {
  await conn.end()
  console.log('✅ Migration terminée.')
}
