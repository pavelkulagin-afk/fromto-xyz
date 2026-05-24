'use client'
'use client'

import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { motion } from 'framer-motion'
import { GripVertical, Pencil, Trash2, Check, Link as LinkIcon, Image as ImageIcon, Clock, Repeat } from 'lucide-react'

import { TimelineStep } from '@/types'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader } from '@/components/ui/card'

interface Props {
  step: TimelineStep
  index: number
  editable: boolean
  onEdit: () => void
  onDelete: () => void
  onRemix: () => void
}

export function StepCard({ step, index, editable, onEdit, onDelete, onRemix }: Props) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: step.id })
  const style = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.5 : 1, zIndex: isDragging ? 10 : 1 }

  return (
    <motion.div ref={setNodeRef} style={style} layout>
      <Card className={`group ${!step.isSynced ? 'ring-2 ring-amber-400/50 ring-offset-2' : ''} hover:shadow-xl transition-shadow duration-300`}>
        {/* Drag handle */}
        {editable && (
          <div {...attributes} {...listeners} className="absolute -left-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 cursor-grab active:cursor-grabbing p-1.5 bg-background/80 backdrop-blur-sm rounded-lg border shadow-sm z-10">
            <GripVertical className="h-4 w-4 text-muted-foreground" />
          </div>
        )}

        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant="outline" className="font-mono bg-background/50">#{index + 1}</Badge>
              {step.mediaType && (
                <Badge variant="secondary" icon={step.mediaType === 'image' ? <ImageIcon className="h-3 w-3" /> : <LinkIcon className="h-3 w-3" />}>
                  {step.mediaType}
                </Badge>
              )}
              {step.status === 'completed' && <Badge variant="success" icon={<Check className="h-3 w-3" />}>Готово</Badge>}
              {!step.isSynced && <Badge variant="warning">Не синхронизировано</Badge>}
            </div>
            
            {editable && (
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onEdit}><Pencil className="h-4 w-4" /></Button>
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onDelete}><Trash2 className="h-4 w-4 text-destructive" /></Button>
              </div>
            )}
          </div>
          <h3 className="text-lg font-semibold leading-tight">{step.title || 'Без названия'}</h3>
          {step.timeSpentMinutes && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" />
              {step.timeSpentMinutes} мин
            </div>
          )}
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Content preview */}
          <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">{step.content || 'Нет описания'}</p>
          
          {/* Media preview */}
          {step.mediaUrl && (
            <motion.div className="aspect-video rounded-xl overflow-hidden bg-muted/50 border" whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
              <img src={step.mediaUrl} alt="" className="w-full h-full object-cover" loading="lazy" />
            </motion.div>
          )}
          
          {/* Materials */}
          {step.materials.length > 0 && (
            <div className="pt-3 border-t">
              <p className="text-xs font-medium mb-2 flex items-center gap-1">
                <LinkIcon className="h-3 w-3" />
                Материалы ({step.materials.length})
              </p>
              <div className="flex flex-wrap gap-1.5">
                {step.materials.slice(0, 4).map((m) => (
                  <Badge key={m.id} variant="outline" size="sm" className={m.purchased ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400' : ''}>
                    {m.purchased && <Check className="h-3 w-3 mr-1" />}
                    {m.name}{m.price && ` • $${m.price}`}
                  </Badge>
                ))}
                {step.materials.length > 4 && (
                  <Badge variant="ghost" size="sm">+{step.materials.length - 4}</Badge>
                )}
              </div>
            </div>
          )}
        </CardContent>

        {/* Remix button */}
        {!editable && (
          <div className="px-6 pb-4">
            <Button variant="ghost" size="sm" className="w-full justify-start text-muted-foreground hover:text-foreground" onClick={onRemix}>
              <Repeat className="h-4 w-4 mr-2" />
              Использовать как шаблон
            </Button>
          </div>
        )}
      </Card>
    </motion.div>
  )
}
