#!/usr/bin/env node
/**
 * Postbuild: crée les symlinks @prisma/client-{hash} -> client dans le standalone.
 * Turbopack génère des noms de packages hashés (ex: @prisma/client-2c3a283f134fdcb6)
 * que Next.js ne copie pas automatiquement dans standalone/node_modules/@prisma/.
 */
const { execSync } = require('child_process')
const { readdirSync, existsSync } = require('fs')
const path = require('path')

const chunksDir = path.join(__dirname, '../.next/standalone/.next/server/chunks')
const prismaDir = path.join(__dirname, '../.next/standalone/node_modules/@prisma')

if (!existsSync(chunksDir) || !existsSync(prismaDir)) {
  console.log('[fix-prisma] standalone dir not found, skipping')
  process.exit(0)
}

// Trouver tous les noms @prisma/client-{hash} utilisés dans les chunks
const hashes = new Set()
const files = readdirSync(chunksDir)
for (const file of files) {
  if (!file.endsWith('.js')) continue
  try {
    const content = require('fs').readFileSync(path.join(chunksDir, file), 'utf8')
    const matches = content.matchAll(/"@prisma\/client-([a-f0-9]+)"/g)
    for (const m of matches) hashes.add(m[1])
  } catch {}
}

if (hashes.size === 0) {
  console.log('[fix-prisma] no hashed @prisma/client references found')
  process.exit(0)
}

for (const hash of hashes) {
  const linkPath = path.join(prismaDir, `client-${hash}`)
  if (!existsSync(linkPath)) {
    const { symlinkSync } = require('fs')
    symlinkSync('client', linkPath)
    console.log(`[fix-prisma] created symlink: @prisma/client-${hash} -> client`)
  } else {
    console.log(`[fix-prisma] already exists: @prisma/client-${hash}`)
  }
}
