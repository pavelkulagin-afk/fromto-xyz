export type StepStatus = 'draft' | 'in_progress' | 'completed' | 'published' | 'published'
export type TrailStatus = 'draft' | 'published' | 'archived'
export type License = 'CC0' | 'CC-BY-4.0' | 'AllRightsReserved'

export interface Material {
  id: string
  name: string
  link?: string
  price?: number
  purchased: boolean
}

export interface TimelineStep {
  id: string
  trailId: string
  orderIndex: number
  title: string
  content: string
  mediaUrl?: string
  mediaType?: 'image' | 'video' | 'link'
  materials: Material[]
  timeSpentMinutes?: number
  status: StepStatus
  isSynced: boolean
  createdAt: string
  updatedAt: string
}

export interface Trail {
  id: string
  userId: string
  title: string
  description: string
  coverImageUrl?: string
  tags: string[]
  steps: TimelineStep[]
  status: TrailStatus
  license: License
  views: number
  likes: number
  remixes: number
  createdAt: string
  updatedAt: string
  lastBackupAt?: string
}

export interface User {
  id: string
  email: string
  name: string
  avatarUrl?: string
  bio?: string
  settings: {
    theme: 'light' | 'dark' | 'system'
    notifications: boolean
    publicProfile: boolean
  }
}

export interface TreasuryMetrics {
  totalDonations: number
  monthlyExpenses: number
  coveragePercent: number
  topDonors: Array<{ name: string; amount: number }>
  recentExpenses: Array<{ category: string; amount: number; date: string }>
}
