#!/usr/bin/env node
/**
 * Postbuild: crée un vrai répertoire @prisma/client-{hash} dans le standalone.
 * Turbopack génère des noms de packages hashés (ex: @prisma/client-2c3a283f134fdcb6)
 * que Next.js ne copie pas dans standalone/node_modules/@prisma/.
 * Sans ce fix, prisma.faqItem (et tous les modèles Prisma) sont undefined au runtime.
 */
const { readdirSync, existsSync, mkdirSync, copyFileSync, writeFileSync, rmSync, lstatSync } = require('fs')
const path = require('path')

const chunksDir = path.join(__dirname, '../.next/standalone/.next/server/chunks')
const prismaDir = path.join(__dirname, '../.next/standalone/node_modules/@prisma')
const clientDir = path.join(prismaDir, 'client')

if (!existsSync(chunksDir) || !existsSync(prismaDir)) {
  console.log('[fix-prisma] standalone dir not found, skipping')
  process.exit(0)
}

// Trouver tous les noms @prisma/client-{hash} dans les chunks de production
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
  const destDir = path.join(prismaDir, `client-${hash}`)

  // Supprimer si c'est un symlink (mauvaise approche précédente)
  if (existsSync(destDir)) {
    try {
      const stat = lstatSync(destDir)
      if (stat.isSymbolicLink()) {
        rmSync(destDir)
        console.log(`[fix-prisma] removed old symlink: client-${hash}`)
      } else {
        // Vrai répertoire déjà là — juste s'assurer que index.js est présent
        const idxPath = path.join(destDir, 'index.js')
        if (!existsSync(idxPath)) {
          writeFileSync(idxPath, "module.exports = { ...require('.prisma/client/default') };\n")
          console.log(`[fix-prisma] added missing index.js to existing dir: client-${hash}`)
        } else {
          console.log(`[fix-prisma] already complete: client-${hash}`)
        }
        continue
      }
    } catch {}
  }

  // Créer un vrai répertoire avec les fichiers nécessaires
  mkdirSync(path.join(destDir, 'runtime'), { recursive: true })

  // index.js — point d'entrée du package (charge le client généré via .prisma/client/default)
  writeFileSync(
    path.join(destDir, 'index.js'),
    "module.exports = { ...require('.prisma/client/default') };\n"
  )

  // Copier default.js et package.json depuis @prisma/client
  for (const f of ['default.js', 'package.json']) {
    const src = path.join(clientDir, f)
    if (existsSync(src)) copyFileSync(src, path.join(destDir, f))
  }

  // Copier runtime/client.js si présent
  const runtimeSrc = path.join(clientDir, 'runtime', 'client.js')
  if (existsSync(runtimeSrc)) copyFileSync(runtimeSrc, path.join(destDir, 'runtime', 'client.js'))

  console.log(`[fix-prisma] created real package: @prisma/client-${hash}`)
}
