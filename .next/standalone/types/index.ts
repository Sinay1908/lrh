export interface Article {
  id: number
  titre: string
  slug: string
  contenu: string
  extrait?: string | null
  imageUrl?: string | null
  categorie?: string | null
  statut: string
  vues: number
  publishedAt?: Date | null
  createdAt: Date
}

export interface Equipe {
  id: number
  nom: string
  niveau: string
  categorie: string
  groupe: string
  couleur: string
  horaire?: string | null
  coach?: string | null
  description?: string | null
  actif: boolean
}

export interface Match {
  id: number
  equipeId?: number | null
  domicile: boolean
  adversaire: string
  competition: string
  lieu?: string | null
  date: Date
  statut: string
  scoreDom?: number | null
  scoreExt?: number | null
  resultat?: string | null
}

export interface Inscription {
  id: number
  prenom: string
  nom: string
  email: string
  telephone?: string | null
  equipe?: string | null
  message?: string | null
  statut: string
  createdAt: Date
}

export interface Sponsor {
  id: number
  nom: string
  logoUrl?: string | null
  siteUrl?: string | null
  niveau: string
  actif: boolean
  ordre: number
}

export interface Message {
  id: number
  nom: string
  email: string
  sujet: string
  corps: string
  lu: boolean
  archive: boolean
  createdAt: Date
}
