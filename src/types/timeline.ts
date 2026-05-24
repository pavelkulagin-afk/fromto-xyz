export type StepStatus = 'draft' | 'in_progress' | 'completed'

export interface TimelineStep {
  id: string
  orderIndex: number
  title: string
  content: string
  mediaUrl?: string
  materials?: { name: string; price?: number }[]
  status: StepStatus
  createdAt: string
  updatedAt: string
  isSynced: boolean // Для офлайн-режима
}

export interface TimelineProps {
  steps: TimelineStep[]
  onChange: (steps: TimelineStep[]) => void
  editable?: boolean
}
