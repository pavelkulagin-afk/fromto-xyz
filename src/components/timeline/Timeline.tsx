'use client'
import { useState, useCallback, useEffect } from 'react'
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core'
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { motion, AnimatePresence } from 'framer-motion'
import { Cloud, CloudOff, Plus } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { TimelineStep } from '@/types'
import { TimelineStepItem } from './TimelineStepItem'
import { StepEditor } from './StepEditor'
import { useOffline } from '@/hooks/useOffline'
import { Button } from '@/components/ui/button'

interface TimelineProps {
  steps: TimelineStep[]
  onChange?: (s: TimelineStep[]) => void
  editable?: boolean
}

export function Timeline({ steps = [], onChange, editable = false }: TimelineProps) {
  const [localSteps, setLocalSteps] = useState<TimelineStep[]>(steps)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [showAdd, setShowAdd] = useState(false)
  const { isOffline } = useOffline()

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  const { data: fetchedSteps } = useQuery({
    queryKey: ['trail', 'steps'],
    queryFn: async () => {
      try {
        const res = await fetch('/api/trails/steps')
        if (!res.ok) return []
        return res.json()
      } catch { return [] }
    },
    enabled: !steps.length,
  })

  useEffect(() => {
    if (fetchedSteps) setLocalSteps(fetchedSteps)
  }, [fetchedSteps])

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event
    if (!over || active.id === over.id) return
    const newSteps = [...localSteps]
    const oldIndex = newSteps.findIndex(s => s.id === active.id)
    const newIndex = newSteps.findIndex(s => s.id === over.id)
    const [moved] = newSteps.splice(oldIndex, 1)
    newSteps.splice(newIndex, 0, { ...moved, orderIndex: newIndex, isSynced: false })
    const reordered = newSteps.map((s, i) => ({ ...s, orderIndex: i }))
    setLocalSteps(reordered)
    onChange?.(reordered)
  }, [localSteps, onChange])

  const handleAdd = useCallback((newStep: Omit<TimelineStep, 'id' | 'createdAt' | 'updatedAt'>) => {
    const step: TimelineStep = { ...newStep, id: crypto.randomUUID(), createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), isSynced: !isOffline }
    const updated = [...localSteps, step].map((s, i) => ({ ...s, orderIndex: i }))
    setLocalSteps(updated)
    setShowAdd(false)
    onChange?.(updated)
  }, [localSteps, isOffline, onChange])

  const handleUpdate = useCallback((updated: TimelineStep) => {
    const newSteps = localSteps.map(s => s.id === updated.id ? { ...updated, updatedAt: new Date().toISOString(), isSynced: !isOffline } : s)
    setLocalSteps(newSteps)
    setEditingId(null)
    onChange?.(newSteps)
  }, [localSteps, isOffline, onChange])

  const handleDelete = useCallback((id: string) => {
    const newSteps = localSteps.filter(s => s.id !== id).map((s, i) => ({ ...s, orderIndex: i }))
    setLocalSteps(newSteps)
    onChange?.(newSteps)
  }, [localSteps, onChange])

  if (!Array.isArray(localSteps)) return <div className="p-4 text-muted-foreground">Загрузка...</div>

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        {isOffline ? <><CloudOff className="h-4 w-4 text-amber-500" /> Офлайн</> : <><Cloud className="h-4 w-4 text-emerald-500" /> Онлайн</>}
      </div>
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={localSteps.map(s => s.id)} strategy={verticalListSortingStrategy}>
          <AnimatePresence mode="popLayout">
            {localSteps.map((step, index) => (
              <motion.div key={step.id} layout>
                {editingId === step.id ? (
                  <StepEditor step={step as any} onSave={handleUpdate} onCancel={() => setEditingId(null)} />
                ) : (
                  <TimelineStepItem step={step} index={index} editable={editable} onEdit={() => setEditingId(step.id)} onDelete={() => handleDelete(step.id)} />
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </SortableContext>
      </DndContext>
      {showAdd ? (
        <StepEditor orderIndex={localSteps.length} onSave={handleAdd} onCancel={() => setShowAdd(false)} />
      ) : editable && (
        <Button variant="outline" className="w-full border-dashed" onClick={() => setShowAdd(true)}>
          <Plus className="mr-2 h-4 w-4" /> Добавить шаг
        </Button>
      )}
    </div>
  )
}
