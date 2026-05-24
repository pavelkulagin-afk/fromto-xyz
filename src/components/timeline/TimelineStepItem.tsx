'use client'

import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { motion } from 'framer-motion'
import { GripVertical, Pencil, Trash2, Check } from 'lucide-react'

import { TimelineStep } from '@/types/timeline'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

interface Props {
  step: TimelineStep
  index: number
  editable: boolean
  onEdit: () => void
  onDelete: () => void
}

export function TimelineStepItem({ step, index, editable, onEdit, onDelete }: Props) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: step.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 10 : 1,
  }

  return (
    <motion.div ref={setNodeRef} style={style} layout>
      <Card className={`group relative ${!step.isSynced ? 'ring-2 ring-amber-400/50' : ''}`}>
        {/* Drag handle */}
        {editable && (
          <div
            {...attributes}
            {...listeners}
            className="absolute -left-3 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 cursor-grab active:cursor-grabbing p-1 bg-background rounded border"
          >
            <GripVertical className="h-4 w-4 text-muted-foreground" />
          </div>
        )}

        <CardHeader className="pb-2">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <Badge variant="outline" className="font-mono">#{index + 1}</Badge>
              {step.status === 'completed' && (
                <Badge variant="default" className="gap-1">
                  <Check className="h-3 w-3" /> Готово
                </Badge>
              )}
              {!step.isSynced && <Badge variant="outline" className="text-amber-600">Не синхронизировано</Badge>}
            </div>
            
            {editable && (
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button variant="ghost" size="icon" onClick={onEdit}>
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={onDelete}>
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            )}
          </div>
          <h3 className="text-lg font-semibold">{step.title || 'Без названия'}</h3>
        </CardHeader>
        
        <CardContent>
          <p className="text-sm text-muted-foreground line-clamp-3">{step.content || 'Нет описания'}</p>
          
          {step.mediaUrl && (
            <div className="mt-3 aspect-video rounded-lg overflow-hidden bg-muted">
              <img src={step.mediaUrl} alt="" className="w-full h-full object-cover" />
            </div>
          )}
          
          {step.materials?.length > 0 && (
            <div className="mt-3 pt-3 border-t">
              <p className="text-xs font-medium mb-1">Материалы:</p>
              <ul className="text-xs space-y-0.5">
                {step.materials.slice(0, 3).map((m, i) => (
                  <li key={i} className="flex items-center gap-1">
                    <Check className="h-3 w-3 text-emerald-500" />
                    {m.name}{m.price && ` — $${m.price}`}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}
