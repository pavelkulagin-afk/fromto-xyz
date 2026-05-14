export interface Step {
  id: string
  order: number
  title: string
  description: string
  mediaUrl?: string
  materials?: { name: string; link?: string }[]
  timeSpentMinutes?: number
  createdAt: string
}

export interface Trail {
  id: string
  userId: string
  title: string
  description: string
  coverImage?: string
  steps: Step[]
  status: 'draft' | 'published' | 'completed'
  license: 'CC0' | 'CC-BY-4.0' | 'all-rights-reserved'
  createdAt: string
  updatedAt: string
}

export type StepFormData = Pick<Step, 'title' | 'description' | 'mediaUrl' | 'materials' | 'timeSpentMinutes'>
