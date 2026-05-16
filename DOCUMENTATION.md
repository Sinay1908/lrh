# Documentation — Site Lyon Roller Hockey

> Dernière mise à jour : mai 2026  
> Projet : Site web complet du club Lyon Roller Hockey (LRH) avec espace d'administration

---

## Table des matières

1. [Vue d'ensemble](#1-vue-densemble)
2. [Stack technique](#2-stack-technique)
3. [Structure du projet](#3-structure-du-projet)
4. [Base de données](#4-base-de-données)
5. [Pages publiques](#5-pages-publiques)
6. [Espace administration](#6-espace-administration)
7. [Routes API](#7-routes-api)
8. [Sécurité](#8-sécurité)
9. [Variables d'environnement](#9-variables-denvironnement)
10. [Déploiement](#10-déploiement)
11. [Historique des développements](#11-historique-des-développements)
12. [Problèmes connus & solutions](#12-problèmes-connus--solutions)
13. [Comment ajouter une nouvelle fonctionnalité](#13-comment-ajouter-une-nouvelle-fonctionnalité)

---

## 1. Vue d'ensemble

Site web complet pour le **club de roller hockey Lyon Roller Hockey (LRH)**, composé de :

- **Un site public** : vitrine du club, actualités, calendrier, classement, boutique, inscription, contact
- **Un espace d'administration** : gestion complète de tout le contenu via une interface graphique
- **Des APIs REST** : communication entre le front et la base de données MySQL

Le site est entièrement dynamique — chaque contenu visible sur le site public est modifiable depuis l'admin sans toucher au code.

---

## 2. Stack technique

| Composant | Technologie | Version |
|---|---|---|
| Framework | Next.js (App Router) | 16.2.4 |
| Bundler | Turbopack | intégré |
| ORM | Prisma | 7.8.0 |
| Base de données | MySQL / MariaDB | — |
| Authentification | NextAuth.js (JWT) | 4.24.14 |
| Chiffrement MDP | bcryptjs | 12 rounds |
| Langage | TypeScript | — |
| Styles | CSS-in-JS (inline styles) | — |
| Output | Standalone (`output: 'standalone'`) | — |

**Polices utilisées :**
- `Barlow Condensed` — titres, chiffres, badges
- `Barlow` — corps de texte, interface

**Palette de couleurs :**
```
Navy (principal) : #0D2150
Rouge (accent)   : #D42B2B
Bleu clair       : #A8D6E8
Off-white        : #F5F7FA
```

---

## 3. Structure du projet

```
lrh/
├── app/
│   ├── (public)/               ← Pages visibles par les visiteurs
│   │   ├── page.tsx            ← Accueil (server component)
│   │   ├── HomePageClient.tsx  ← Accueil (client component)
│   │   ├── boutique/
│   │   ├── calendrier/
│   │   ├── classement/
│   │   ├── club/
│   │   ├── contact/
│   │   ├── equipes/
│   │   └── inscription/
│   ├── admin/
│   │   ├── login/              ← Page de connexion admin
│   │   ├── layout.tsx          ← Layout racine admin (SessionProvider)
│   │   └── (app)/              ← Pages protégées (nécessitent une session)
│   │       ├── page.tsx        ← Tableau de bord
│   │       ├── actualites/
│   │       ├── administration/
│   │       ├── boutique/
│   │       ├── classement/
│   │       ├── equipes/
│   │       ├── faq/
│   │       ├── inscriptions/
│   │       ├── matchs/
│   │       ├── messages/
│   │       ├── palmares/       ← "Le Club" (identité, stats, valeurs, palmarès, staff)
│   │       ├── parametres/
│   │       ├── partenaires/
│   │       ├── staff/
│   │       └── tarifs/
│   └── api/                    ← Routes API REST
│       ├── admins/
│       ├── articles/
│       ├── auth/               ← NextAuth handler
│       ├── boutique/
│       ├── classement/
│       ├── dashboard/
│       ├── equipes/
│       ├── faq/
│       ├── files/[name]/       ← Serveur de fichiers uploadés
│       ├── inscriptions/
│       ├── matchs/
│       ├── messages/
│       ├── palmares/
│       ├── parametres/
│       ├── sponsors/
│       ├── staff/
│       ├── tarifs/
│       └── upload/             ← Upload d'images en base64
├── components/
│   ├── admin/
│   │   ├── ui.tsx              ← Librairie de composants UI admin
│   │   └── AdminLayout.tsx     ← Sidebar + TopBar de l'admin
│   └── public/
│       ├── ui.tsx              ← Librairie de composants UI public
│       ├── NavBar.tsx
│       └── Footer.tsx
├── lib/
│   ├── auth.ts                 ← Configuration NextAuth
│   ├── prisma.ts               ← Client Prisma singleton
│   └── utils.ts
├── prisma/
│   ├── schema.prisma           ← Définition de la base de données
│   └── seed.ts                 ← Données initiales
├── scripts/
│   └── fix-prisma-standalone.js ← Fix Turbopack (voir §12)
├── proxy.ts                    ← Middleware de sécurité (Next.js 16)
└── next.config.ts              ← Configuration Next.js + headers sécurité
```

---

## 4. Base de données

### Modèles Prisma (tables MySQL)

#### `admins` — Comptes administrateurs
```prisma
id           Int      (PK auto-incrémenté)
email        String   (unique)
passwordHash String   (bcrypt 12 rounds)
nom          String?
createdAt    DateTime
updatedAt    DateTime
```

#### `articles` — Actualités du club
```prisma
id          Int
titre       String
slug        String   (unique, auto-généré depuis le titre)
contenu     String   (LongText)
extrait     String?
imageUrl    String?
categorie   String?
statut      String   "draft" | "published"
vues        Int
publishedAt DateTime?
createdAt   DateTime
updatedAt   DateTime
```

#### `equipes` — Équipes du club
```prisma
id          Int
nom         String
niveau      String
categorie   String
groupe      String   "senior" | "jeunes" | "loisir"
couleur     String   (code hex, défaut "#0D2150")
horaire     String?
coach       String?
description String?
nbJoueurs   Int
actif       Boolean
```

#### `matchs` — Calendrier et résultats
```prisma
id          Int
equipeId    Int?     (relation → equipes)
domicile    Boolean
adversaire  String
competition String
lieu        String?
date        DateTime
heure       String?
statut      String   "upcoming" | "win" | "loss" | "draw"
scoreDom    Int?
scoreExt    Int?
createdAt   DateTime
```

#### `inscriptions` — Demandes d'inscription
```prisma
id        Int
prenom    String
nom       String
email     String
telephone String?
equipe    String?
message   String?
statut    String   "pending" | "approved" | "rejected"
createdAt DateTime
updatedAt DateTime
```

#### `sponsors` — Partenaires
```prisma
id      Int
nom     String
logoUrl String?
siteUrl String?
niveau  String  "premium" | "partenaire" | "supporter"
actif   Boolean
ordre   Int
```

#### `messages` — Messages du formulaire contact
```prisma
id        Int
nom       String
email     String
sujet     String
corps     String (Text)
lu        Boolean
archive   Boolean
createdAt DateTime
```

#### `parametres` — Tous les paramètres éditoriaux du site
```prisma
id      Int
cle     String (unique)
valeur  String (Text)
section String
```
> C'est la table centrale pour tout le contenu modifiable depuis l'admin.  
> Chaque paramètre a une clé unique (ex. `hero.title`, `contact.email`).

#### `staff` — Membres du staff technique
```prisma
id          Int
nom         String
role        String
depuis      String?
equipeNom   String?
description String?
photoUrl    String?
actif       Boolean
ordre       Int
createdAt   DateTime
updatedAt   DateTime
```

#### `tarifs` — Cotisations par saison
```prisma
id          Int
saison      String   (ex. "2025-2026")
categorie   String
montant     Float
description String?
actif       Boolean
ordre       Int
createdAt   DateTime
updatedAt   DateTime
```

#### `palmares` — Palmarès du club
```prisma
id          Int
annee       String
titre       String
competition String
description String?
ordre       Int
createdAt   DateTime
```

#### `classement` — Tableaux de classement
```prisma
id          Int
competition String   (ex. "Nationale 1")
saison      String   (ex. "2024-2025")
position    Int
equipe      String
joues       Int
gagnes      Int
nuls        Int
perdus      Int
bpour       Int
bcontre     Int
points      Int
isLyon      Boolean  (surligne la ligne Lyon en rouge)
updatedAt   DateTime
```

#### `boutique` — Produits boutique
```prisma
id          Int
nom         String
categorie   String   "Maillot" | "Équipement" | "Accessoire"
prix        Float
description String?
badge       String?
disponible  Boolean
ordre       Int
createdAt   DateTime
updatedAt   DateTime
```

#### `faq` — Questions fréquentes (page Contact)
```prisma
id        Int
question  String (Text)
reponse   String (Text)
actif     Boolean
ordre     Int
createdAt DateTime
updatedAt DateTime
```

---

## 5. Pages publiques

### `/` — Accueil
- **Server component** : charge les params hero + sponsors depuis Prisma
- Hero avec titre/sous-titre/CTA dynamiques
- Bande de 4 statistiques (modifiables depuis admin → Paramètres → Statistiques accueil)
- Section prochains matchs (3 max, chargés depuis `/api/matchs`)
- Section actualités (3 max, publiées)
- Grille des équipes actives
- Section partenaires (logos + liens)
- Bandeau CTA inscription

### `/equipes`
- Liste de toutes les équipes actives groupées par catégorie
- Couleur d'accroche par équipe
- Infos : niveau, coach, horaire, joueurs

### `/calendrier`
- Onglets "À venir" / "Résultats"
- Filtrage par équipe
- Affichage date, lieu, score, statut (victoire/défaite/nul)

### `/classement`
- Filtrage par compétition
- Ligne de Lyon surlignée en rouge
- Colonnes : J, G, N, P, BP, BC, Pts

### `/club` — "Les Aigles de Lyon"
- Texte d'identité du club (2 paragraphes modifiables)
- Photo de l'équipe (uploadable depuis l'admin)
- Bande de 6 statistiques du club
- Section "Nos Valeurs" (4 cartes : icône emoji, titre, description)
- Palmarès (liste des titres)
- Staff technique (photos, rôles)

### `/inscription`
- Avantages adhésion
- 3 étapes d'inscription
- Tarifs dynamiques (saison active la plus récente)
- Documents requis
- Formulaire de demande (→ `/api/inscriptions`)

### `/contact`
- Informations de contact (adresse, téléphone, email, horaires) — dynamiques
- Carte Google Maps intégrée
- Formulaire de contact (→ `/api/messages`)
- FAQ dynamique (depuis la table `faq`)

### `/boutique`
- Grille de produits par catégorie
- Badge "Nouveau", "Promo", etc.

---

## 6. Espace administration

URL d'accès : `/admin`  
Connexion : `/admin/login` (email + mot de passe)

### Tableau de bord (`/admin`)
- Statistiques en temps réel : inscriptions, messages non lus, articles, équipes
- Dernières inscriptions reçues
- Derniers messages reçus
- Prochains matchs

### Actualités (`/admin/actualites`)
- CRUD complet des articles
- Upload d'image de couverture
- Statuts : brouillon / publié
- Auto-génération du slug

### Équipes (`/admin/equipes`)
- CRUD complet
- Couleur personnalisable par équipe
- Les équipes créées ici alimentent les listes déroulantes de Matchs, Classement et Tarifs

### Matchs & Résultats (`/admin/matchs`)
- Onglets "À venir" / "Résultats"
- La compétition est choisie depuis la liste des équipes actives (dynamique)
- Saisie du score pour les matchs terminés

### Classement (`/admin/classement`)
- Filtrage par compétition
- La compétition est choisie depuis la liste des équipes actives (dynamique)
- Checkbox "C'est Lyon" pour surligner la ligne

### Boutique (`/admin/boutique`)
- CRUD des produits
- Gestion des badges et de la disponibilité

### Tarifs (`/admin/tarifs`)
- CRUD des tarifs par saison
- Catégorie : sélectionnable depuis les équipes actives **ou** saisie manuelle libre
  (utile pour : Famille, Pass Sport, Réduction, etc.)
- Groupement par saison à l'affichage

### Le Club (`/admin/palmares`)
Page unifiée avec 5 sous-sections via sidebar :

#### ① Identité du club
- 2 paragraphes de texte éditoriaux
- Upload de la photo d'équipe + légende
- Sauvegarde vers `parametres` (clés `club.identite.*`)

#### ② Statistiques
- 6 paires valeur/libellé (ex. "50+" / "Ans d'existence")
- Sauvegarde vers `parametres` (clés `club.stat.1-6.*`)

#### ③ Nos Valeurs
- 4 cartes : emoji + titre + description
- Sauvegarde vers `parametres` (clés `club.valeur.1-4.*`)

#### ④ Palmarès
- CRUD : année, titre, compétition, description

#### ⑤ Staff technique
- CRUD : nom, rôle, équipe, depuis, description
- Upload de photo de profil

### Inscriptions (`/admin/inscriptions`)
- Liste des demandes reçues
- Changement de statut : en attente / approuvé / refusé
- Archivage

### Partenaires (`/admin/partenaires`)
- CRUD des sponsors
- Upload de logo
- Niveaux : Premium / Partenaire / Supporter
- Ordre d'affichage

### FAQ Contact (`/admin/faq`)
- CRUD des questions/réponses affichées sur la page Contact
- Activation/désactivation par question

### Messages (`/admin/messages`)
- Lecture des messages du formulaire contact
- Marquer comme lu / archiver / supprimer

### Paramètres (`/admin/parametres`)
Sous-sections via sidebar :

#### Hero / Accueil
- Badge, titre, sous-titre, bouton principal, bouton secondaire
- Aperçu visuel en temps réel

#### Statistiques accueil *(nouveau)*
- 4 paires valeur/libellé pour la bande de stats de la homepage
- ex. "50+" / "Ans d'histoire", "180+" / "Licenciés"
- Aperçu live de la bande

#### Badges des pages
- Le badge affiché en haut de chaque page publique
- Accueil, Équipes, Calendrier, Classement, Inscription, Boutique, Le Club, Contact

#### Informations contact
- Adresse, rue, ville, téléphone, email, horaires secrétariat

#### Pied de page
- Description du club
- Liens réseaux sociaux (Facebook, Instagram, X/Twitter)

#### SEO & Métadonnées
- Titre de l'onglet navigateur
- Description meta
- Image OG (partage réseaux sociaux)

### Administration (`/admin/administration`)
- Gestion des comptes admin (CRUD)
- Modification du mot de passe
- Impossible de supprimer le dernier compte admin

---

## 7. Routes API

### Convention générale
- `GET` : lecture, accessible publiquement sauf exceptions
- `POST` / `PUT` / `DELETE` : écriture, **toujours protégé** (session requise)

### Endpoints disponibles

| Route | Méthodes | Notes |
|---|---|---|
| `/api/articles` | GET, POST | GET public |
| `/api/articles/[id]` | PUT, DELETE | |
| `/api/boutique` | GET, POST | GET public |
| `/api/boutique/[id]` | PUT, DELETE | |
| `/api/classement` | GET, POST | GET public |
| `/api/classement/[id]` | PUT, DELETE | |
| `/api/dashboard` | GET | **Toujours protégé** |
| `/api/equipes` | GET, POST | GET public |
| `/api/equipes/[id]` | PUT, DELETE | |
| `/api/faq` | GET, POST | GET public |
| `/api/faq/[id]` | PUT, DELETE | |
| `/api/files/[name]` | GET | Serveur de fichiers uploadés |
| `/api/inscriptions` | GET, POST | POST public (formulaire), GET protégé |
| `/api/inscriptions/[id]` | PUT, DELETE | **Toujours protégé** |
| `/api/matchs` | GET, POST | GET public |
| `/api/matchs/[id]` | PUT, DELETE | |
| `/api/messages` | GET, POST | POST public (formulaire), GET protégé |
| `/api/messages/[id]` | PUT, DELETE | **Toujours protégé** |
| `/api/palmares` | GET, POST | GET public |
| `/api/palmares/[id]` | PUT, DELETE | |
| `/api/parametres` | GET, POST | GET public, POST protégé |
| `/api/sponsors` | GET, POST | GET public |
| `/api/sponsors/[id]` | PUT, DELETE | |
| `/api/staff` | GET, POST | GET public |
| `/api/staff/[id]` | PUT, DELETE | |
| `/api/tarifs` | GET, POST | GET public |
| `/api/tarifs/[id]` | PUT, DELETE | |
| `/api/admins` | GET, POST | **Toujours protégé** |
| `/api/admins/[id]` | PUT, DELETE | **Toujours protégé** |
| `/api/upload` | POST | **Toujours protégé** |

### Upload de fichiers (`/api/upload`)
- Reçoit une image en base64 via JSON : `{ data: "data:image/...", filename: "..." }`
- Vérifie que le contenu commence par `data:image/`
- Limite : **8 MB maximum**
- Nom de fichier : UUID aléatoire (ex. `a3f2b1c4-....jpg`)
- Stockage : dossier `uploads/` à la racine (configurable via `UPLOAD_DIR`)
- Retourne : `{ url: "/api/files/<uuid>.jpg" }`

### Paramètres (`/api/parametres`)
```
GET  /api/parametres          → retourne tous les paramètres en map {cle: valeur}
GET  /api/parametres?section=hero  → filtre par section
POST /api/parametres          → upsert bulk
  Body: { "hero.title": { valeur: "...", section: "hero" }, ... }
```

---

## 8. Sécurité

### Authentification
- **NextAuth.js** avec stratégie JWT
- Provider : `CredentialsProvider` (email + mot de passe)
- Mots de passe hashés avec **bcrypt, 12 rounds**
- Sessions JWT stockées côté client (cookie `HttpOnly`)

### Protection des routes — `proxy.ts`

> Note : Next.js 16 utilise `proxy.ts` au lieu de `middleware.ts`

Le fichier `proxy.ts` à la racine protège **côté serveur** :

```
/admin/* (sauf /admin/login)       → redirection vers login si pas de session
/api/admins, /api/dashboard, /api/upload → 401 toutes méthodes
/api/messages, /api/inscriptions   → POST public, tout le reste 401
Toutes les autres /api/*           → GET public, écriture 401
```

⚠️ **L'interface admin vérifie aussi la session côté client** (`useSession` dans `AdminLayout`), mais c'est la protection **serveur** dans `proxy.ts` qui est la vraie barrière de sécurité.

### Headers HTTP de sécurité (configurés dans `next.config.ts`)

```
X-Content-Type-Options  : nosniff
X-Frame-Options         : DENY
X-XSS-Protection        : 1; mode=block
Referrer-Policy         : strict-origin-when-cross-origin
Permissions-Policy      : camera=(), microphone=(), geolocation=()
```

### Protection contre le path traversal
La route `/api/files/[name]` bloque tout nom de fichier contenant `..`, `/` ou `\`.

### Pas d'exposition d'erreurs internes
Les routes API retournent `{ error: "Erreur serveur" }` en cas d'exception, sans détail Prisma ni chemin système.

### Ce qui reste à ajouter (futur)
- **Rate limiting** sur les formulaires publics (contact, inscription) — nécessite Redis ou un service externe
- **CAPTCHA** sur les formulaires pour bloquer les bots

---

## 9. Variables d'environnement

Créer un fichier `.env.local` à la racine du projet :

```env
# Base de données MySQL
DATABASE_URL="mysql://user:password@host:3306/lrh"

# NextAuth — OBLIGATOIRE pour la sécurité JWT
NEXTAUTH_SECRET="une-chaine-aleatoire-de-32-caracteres-minimum"
NEXTAUTH_URL="https://votredomaine.com"

# Dossier de stockage des fichiers uploadés (optionnel)
# Défaut : ./uploads à la racine du projet
UPLOAD_DIR="/chemin/absolu/vers/uploads"
```

> ⚠️ `NEXTAUTH_SECRET` doit être une chaîne **aléatoire et longue** (32+ caractères).  
> Générer : `openssl rand -base64 32`

---

## 10. Déploiement

### Build de production
```bash
npm run build
```
Génère un output **standalone** dans `.next/standalone/`.

### Postbuild automatique
Le script `scripts/fix-prisma-standalone.js` s'exécute automatiquement après le build.  
Il corrige un problème Turbopack où `@prisma/client` est hashé (`@prisma/client-xxxx`) dans le bundle standalone.

### Lancement en production
```bash
node .next/standalone/server.js
```

### Structure du déploiement standalone
```
.next/standalone/
├── server.js               ← Point d'entrée
├── .env.local              ← À copier manuellement !
├── node_modules/
│   └── @prisma/client-xxxx/ ← Créé par le script postbuild
└── ...
```

> ⚠️ Le dossier `uploads/` n'est **pas** dans `.next/standalone/`.  
> Il faut le créer séparément et le monter comme volume persistant.

### Base de données — initialisation
```bash
# Appliquer le schéma sur la base
npx prisma migrate deploy

# Ou push direct (sans migration)
npx prisma db push

# Créer les données initiales (admin, etc.)
npx prisma db seed
```

---

## 11. Historique des développements

### Phase 1 — Fondations
- Initialisation du projet Next.js 16 + Prisma + MySQL
- Connexion de toutes les pages publiques à la base de données
- Espace admin complet : tableau de bord, actualités, équipes, matchs, inscriptions, partenaires
- Upload de photos (articles, staff)
- Système de paramètres éditoriaux (table `parametres`)

### Phase 2 — Contenu dynamique
- Connexion des paramètres admin aux pages publiques (hero, contact, footer)
- Badges des pages dynamiques (depuis admin → Paramètres)
- Tarifs dynamiques sur la page inscription (chargés depuis Prisma)
- Dashboard en temps réel

### Phase 3 — Design & Responsive
- Refactoring responsive complet (mobile-first)
- Amélioration UI admin (sidebar, topbar, composants)

### Phase 4 — Fonctionnalités avancées
- **FAQ Contact** : éditable depuis l'admin, affichée sur la page /contact
- **Upload d'images** : articles, staff, partenaires, identité du club
- **Documents requis** : liste statique mise à jour (CM < 6 mois, photo, dossier, cotisation)

### Phase 5 — Page "Le Club" unifiée
- Refonte de l'admin "Palmarès" → "Le Club" avec 5 sous-sections :
  1. Identité du club (texte + photo)
  2. Statistiques (6 chiffres clés)
  3. Nos Valeurs (4 cartes éditoriaux)
  4. Palmarès (CRUD)
  5. Staff technique (CRUD + photos)
- Page publique `/club` connectée à tous ces paramètres

### Phase 6 — Listes déroulantes dynamiques
- **Classement** : compétition = liste des équipes actives (plus de liste codée en dur)
- **Matchs** : compétition = liste des équipes actives
- **Tarifs** : catégorie = liste des équipes actives OU saisie manuelle libre
  - Mode `select` : choisir parmi les équipes
  - Mode `manual` : saisir librement (Famille, Pass Sport, etc.)
  - Détection automatique du mode à l'édition

### Phase 7 — Statistiques accueil éditables
- Ajout de la section "Statistiques accueil" dans admin → Paramètres
- Les 4 chiffres du hero (50+, 180+, 7, 12) sont maintenant éditables
- Aperçu live dans l'interface admin
- La page d'accueil charge ces valeurs depuis Prisma côté serveur

### Phase 8 — Sécurité
- **Critique** : création du `proxy.ts` pour protéger toutes les routes API
  (avant : aucune protection côté serveur — n'importe qui pouvait créer un admin)
- Headers de sécurité HTTP ajoutés dans `next.config.ts`
- Suppression de l'exposition des erreurs techniques dans les réponses API

---

## 12. Problèmes connus & solutions

### Turbopack — `@prisma/client` non trouvé en production
**Symptôme** : `Cannot find module '@prisma/client'` au runtime en mode standalone

**Cause** : Turbopack hash le nom du package en `@prisma/client-{hash}` dans le bundle, mais le répertoire réel n'existe pas.

**Solution** : Script `scripts/fix-prisma-standalone.js` exécuté en postbuild.  
Il détecte le hash et crée un vrai répertoire `node_modules/@prisma/client-{hash}/` avec les bons fichiers.

---

### `middleware.ts` vs `proxy.ts` (Next.js 16)
**Symptôme** : Erreur `Both middleware file and proxy file are detected`

**Cause** : Next.js 16 utilise `proxy.ts` comme fichier de middleware (breaking change).  
Le fichier `middleware.ts` traditionnel crée un conflit.

**Solution** : Utiliser **uniquement** `proxy.ts`. La fonction export s'appelle `proxy` (et non `middleware`).

```typescript
// proxy.ts (Next.js 16)
export async function proxy(req: NextRequest) { ... }
export const config = { matcher: [...] }
```

---

### Google Maps dans Safari / navigateurs stricts
**Symptôme** : La carte Google Maps ne s'affiche pas

**Solution** : Utiliser `referrerPolicy="no-referrer-when-downgrade"` sur l'iframe Maps.

---

### Upload d'images et déploiement
**Symptôme** : Images perdues après redéploiement

**Cause** : Le dossier `uploads/` est en dehors de `.next/` mais peut être écrasé selon la méthode de déploiement.

**Solution** : Configurer `UPLOAD_DIR` pour pointer vers un volume persistant externe au dossier de l'application.

---

## 13. Comment ajouter une nouvelle fonctionnalité

### Ajouter un nouveau modèle de données

1. **Ajouter le modèle dans `prisma/schema.prisma`**
```prisma
model MonModele {
  id        Int    @id @default(autoincrement())
  champ     String
  createdAt DateTime @default(now())
  @@map("ma_table")
}
```

2. **Appliquer la migration**
```bash
npx prisma db push
```

3. **Créer les routes API** dans `app/api/mon-modele/route.ts`
```typescript
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const items = await prisma.monModele.findMany()
  return NextResponse.json(items)
}

export async function POST(request: Request) {
  const body = await request.json()
  const item = await prisma.monModele.create({ data: body })
  return NextResponse.json(item, { status: 201 })
}
```

4. **Ajouter la protection dans `proxy.ts`**  
   - Si lecture publique → ajouter dans `PUBLIC_READ_APIS`
   - Si toujours protégé → ajouter dans `ALWAYS_AUTH_APIS`

5. **Créer la page admin** dans `app/admin/(app)/mon-modele/page.tsx`

6. **Ajouter le lien dans la sidebar** dans `components/admin/AdminLayout.tsx`

---

### Ajouter un paramètre éditorial

1. Ajouter la clé dans `DEFAULTS` de `app/admin/(app)/parametres/page.tsx`
2. Ajouter le champ input dans la section correspondante
3. Lire la valeur côté public via `fetch('/api/parametres?section=xxx')`

---

### Ajouter une icône dans l'interface admin

Les icônes sont définies dans `components/admin/ui.tsx` dans l'objet `ICONS`.  
Chaque entrée est un SVG JSX :

```typescript
// Dans le Record<string, ReactElement> ICONS :
monIcone: (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="..." />
  </svg>
),
```

Utilisation : `<Icon name="monIcone" size={16} color={A.blue} />`

---

*Documentation générée et maintenue manuellement — à mettre à jour à chaque évolution majeure du projet.*
