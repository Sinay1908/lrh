/**
 * Script de migration : ajoute la colonne photoUrl à la table staff
 * Usage : node migrate-staff-photo.mjs
 */
import { createConnection } from 'mariadb'

const url   = new URL(process.env.DATABASE_URL)
const conn  = await createConnection({
  host:     url.hostname,
  port:     parseInt(url.port || '3306'),
  user:     decodeURIComponent(url.username),
  password: decodeURIComponent(url.password),
  database: url.pathname.slice(1),
})

try {
  await conn.query('ALTER TABLE staff ADD COLUMN IF NOT EXISTS photoUrl VARCHAR(500) NULL')
  console.log('✅ Colonne photoUrl ajoutée à la table staff')
} catch (e) {
  if (e.code === 'ER_DUP_FIELDNAME') {
    console.log('ℹ️  La colonne photoUrl existe déjà — rien à faire.')
  } else {
    console.error('❌ Erreur :', e.message)
    process.exit(1)
  }
} finally {
  await conn.end()
}
