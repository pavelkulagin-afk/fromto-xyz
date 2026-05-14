"use client"

import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { GripVertical, Pencil, Trash2, Image as ImageIcon } from "lucide-react"
import { Step } from "@/types/trail"
import { format } from "date-fns"
import { ru } from "date-fns/locale"

interface StepCardProps {
  step: Step
  isEditing?: boolean
  onEdit?: (step: Step) => void
  onDelete?: (id: string) => void
}

export function StepCard({ step, isEditing, onEdit, onDelete }: StepCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: step.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 10 : 1,
  }

  return (
    <div ref={setNodeRef} style={style} className="relative">
      <Card className={`mb-4 ${isDragging ? "border-primary shadow-lg" : ""}`}>
        <CardHeader className="pb-2">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2">
              <button
                {...attributes}
                {...listeners}
                className="p-1 hover:bg-muted rounded cursor-grab active:cursor-grabbing"
                aria-label="Переместить шаг"
              >
                <GripVertical className="h-4 w-4 text-muted-foreground" />
              </button>
              <CardTitle className="text-lg">{step.order}. {step.title}</CardTitle>
            </div>
            {isEditing && (
              <div className="flex gap-1">
                <Button variant="ghost" size="icon" onClick={() => onEdit?.(step)}>
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => onDelete?.(step.id)} className="text-destructive">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-3">{step.description}</p>
          
          {step.mediaUrl && (
            <div className="mb-3 rounded-lg overflow-hidden bg-muted aspect-video flex items-center justify-center">
              <ImageIcon className="h-8 w-8 text-muted-foreground" />
              <span className="sr-only">Медиа: {step.mediaUrl}</span>
            </div>
          )}
          
          {step.materials && step.materials.length > 0 && (
            <div className="mb-3">
              <p className="text-sm font-medium mb-1">Материалы:</p>
              <ul className="text-sm text-muted-foreground space-y-1">
                {step.materials.map((m, i) => (
                  <li key={i}>• {m.name}{m.link && ` — ${m.link}`}</li>
                ))}
              </ul>
            </div>
          )}
          
          {step.timeSpentMinutes && (
            <p className="text-xs text-muted-foreground">
              ⏱ {step.timeSpentMinutes} мин
            </p>
          )}
          
          <p className="text-xs text-muted-foreground mt-2">
            Добавлено: {format(new Date(step.createdAt), "dd MMM yyyy", { locale: ru })}
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
