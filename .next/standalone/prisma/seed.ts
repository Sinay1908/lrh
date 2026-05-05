import { PrismaMariaDb } from '@prisma/adapter-mariadb'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const url = new URL(process.env.DATABASE_URL!)
const adapter = new PrismaMariaDb({
  host: url.hostname,
  port: parseInt(url.port || '3306'),
  user: url.username,
  password: url.password,
  database: url.pathname.slice(1),
})
const prisma = new PrismaClient({ adapter })

async function main() {
  // Admin account
  const hash = await bcrypt.hash('admin2025!', 12)
  await prisma.admin.upsert({
    where:  { email: 'admin@lyonrollerhockey.fr' },
    update: {},
    create: { email: 'admin@lyonrollerhockey.fr', passwordHash: hash, nom: 'Admin LRH' },
  })

  // Équipes
  const equipes = [
    { nom: 'Nationale 1',  niveau: 'Nat. 1', categorie: 'Senior', groupe: 'senior', couleur: '#D42B2B', coach: 'Marc Villeneuve',   horaire: 'Mar & Jeu 19h–21h' },
    { nom: 'Régionale 1',  niveau: 'Rég. 1', categorie: 'Senior', groupe: 'senior', couleur: '#0D2150', coach: 'Marc Villeneuve',   horaire: 'Mar & Jeu 19h–21h' },
    { nom: 'Régionale 2',  niveau: 'Rég. 2', categorie: 'Senior', groupe: 'senior', couleur: '#1E6B9A', coach: 'Pierre Dumont',     horaire: 'Mar & Sam 10h–12h' },
    { nom: 'U17 Juniors',  niveau: 'U17',    categorie: 'Jeunes', groupe: 'jeunes', couleur: '#1E6B9A', coach: 'Sophie Bertrand',   horaire: 'Mer & Sam 14h–16h' },
    { nom: 'U14 Cadets',   niveau: 'U14',    categorie: 'Jeunes', groupe: 'jeunes', couleur: '#1E6B9A', coach: 'Sophie Bertrand',   horaire: 'Mer & Sam 10h–12h' },
    { nom: 'U11 Poussins', niveau: 'U11',    categorie: 'Jeunes', groupe: 'jeunes', couleur: '#1E6B9A', coach: 'Claire Moulin',     horaire: 'Sam 09h–11h'       },
    { nom: 'Loisir',       niveau: 'Loisir', categorie: 'Loisir', groupe: 'loisir', couleur: '#2A7A4B', coach: 'Équipe encadrante', horaire: 'Ven 20h–22h'       },
  ]
  for (const e of equipes) {
    await prisma.equipe.upsert({ where: { id: equipes.indexOf(e) + 1 }, update: {}, create: e })
  }

  // Articles sample
  await prisma.article.upsert({
    where: { slug: 'victoire-6-2-bordeaux' },
    update: {},
    create: {
      titre: 'Victoire 6-2 face à Bordeaux à domicile',
      slug: 'victoire-6-2-bordeaux',
      contenu: 'Belle victoire des Aigles ce samedi face à Bordeaux. Score final 6-2.',
      extrait: 'Les Aigles s\'imposent 6-2 face à Bordeaux en match de championnat.',
      categorie: 'Résultat', statut: 'published', vues: 412,
      publishedAt: new Date('2025-04-18'),
    },
  })

  // Partenaires
  const sponsors = [
    { nom: 'Métropole de Lyon', niveau: 'premium',    siteUrl: 'metropole.lyon.fr', ordre: 1 },
    { nom: 'Mairie du 5e',      niveau: 'premium',    siteUrl: 'lyon.fr',           ordre: 2 },
    { nom: 'Decathlon Pro',     niveau: 'partenaire', siteUrl: 'decathlon.fr',      ordre: 3 },
  ]
  for (const s of sponsors) {
    await prisma.sponsor.upsert({ where: { id: sponsors.indexOf(s) + 1 }, update: {}, create: s })
  }

  // Paramètres
  const params = [
    { cle: 'hero_title',    valeur: 'La Passion du Roller Hockey',           section: 'hero'    },
    { cle: 'hero_subtitle', valeur: 'Depuis 1974, les Aigles de Lyon…',      section: 'hero'    },
    { cle: 'contact_phone', valeur: '04 72 00 00 00',                         section: 'contact' },
    { cle: 'contact_email', valeur: 'contact@lyonrollerhockey.fr',            section: 'contact' },
  ]
  for (const p of params) {
    await prisma.parametre.upsert({ where: { cle: p.cle }, update: { valeur: p.valeur }, create: p })
  }

  console.log('✅ Seed terminé.')
}

main()
  .catch(e => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
