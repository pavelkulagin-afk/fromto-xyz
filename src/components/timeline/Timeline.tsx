"use client"

import { useState, useMemo } from "react"
import { DndContext, closestCenter, DragEndEvent } from "@dnd-kit/core"
import { SortableContext, verticalListSortingStrategy, arrayMove } from "@dnd-kit/sortable"
import { Button } from "@/components/ui/button"
import { Plus, GitFork } from "lucide-react"
import { StepCard } from "./StepCard"
import { StepEditor } from "./StepEditor"
import { Step, Trail, StepFormData } from "@/types/trail"

interface TimelineProps {
  trail?: Trail
  isEditable?: boolean
  onStepsChange?: (steps: Step[]) => void
  onRemix?: (trail: Trail) => void
}

export function Timeline({ trail, isEditable = false, onStepsChange, onRemix }: TimelineProps) {
  const [steps, setSteps] = useState<Step[]>(trail?.steps || [])
  const [editorOpen, setEditorOpen] = useState(false)
  const [editingStep, setEditingStep] = useState<Step | null>(null)

  const sortedSteps = useMemo(() => 
    [...steps].sort((a, b) => a.order - b.order), 
    [steps]
  )

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (!over || active.id === over.id) return
    
    const oldIndex = sortedSteps.findIndex(s => s.id === active.id)
    const newIndex = sortedSteps.findIndex(s => s.id === over.id)
    
    const newSteps = arrayMove(sortedSteps, oldIndex, newIndex).map((step, index) => ({
      ...step,
      order: index + 1,
    }))
    
    setSteps(newSteps)
    onStepsChange?.(newSteps)
  }

  const handleSaveStep = (data: StepFormData) => {
    if (editingStep) {
      const updated = steps.map(s => s.id === editingStep.id ? { ...s, ...data } : s)
      setSteps(updated)
      onStepsChange?.(updated)
    } else {
      const newStep: Step = {
        id: crypto.randomUUID(),
        order: steps.length + 1,
        createdAt: new Date().toISOString(),
        ...data,
      }
      const updated = [...steps, newStep]
      setSteps(updated)
      onStepsChange?.(updated)
    }
    setEditingStep(null)
  }

  const handleDeleteStep = (id: string) => {
    const updated = steps.filter(s => s.id !== id).map((s, i) => ({ ...s, order: i + 1 }))
    setSteps(updated)
    onStepsChange?.(updated)
  }

  return (
    <div className="space-y-4">
      <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={sortedSteps.map(s => s.id)} strategy={verticalListSortingStrategy}>
          {sortedSteps.map(step => (
            <StepCard
              key={step.id}
              step={step}
              isEditing={isEditable}
              onEdit={(s) => { setEditingStep(s); setEditorOpen(true) }}
              onDelete={handleDeleteStep}
            />
          ))}
        </SortableContext>
      </DndContext>

      {isEditable && (
        <div className="flex gap-2 pt-4">
          <Button onClick={() => { setEditingStep(null); setEditorOpen(true) }}>
            <Plus className="h-4 w-4 mr-2" /> Добавить шаг
          </Button>
          {trail && onRemix && (
            <Button variant="outline" onClick={() => onRemix(trail)}>
              <GitFork className="h-4 w-4 mr-2" /> Remix этот трейл
            </Button>
          )}
        </div>
      )}

      <StepEditor
        open={editorOpen}
        onOpenChange={setEditorOpen}
        step={editingStep}
        onSave={handleSaveStep}
      />
    </div>
  )
}
