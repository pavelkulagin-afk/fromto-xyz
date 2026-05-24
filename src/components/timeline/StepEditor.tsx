'use client'
import { useState } from 'react'
import { X, Save, Loader2 } from 'lucide-react'
import { TimelineStep, StepStatus } from '@/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'

interface StepEditorProps {
  step?: TimelineStep
  orderIndex?: number
  onSave: (step: TimelineStep) => void
  onCancel: () => void
}

export function StepEditor({ step, orderIndex = 0, onSave, onCancel }: StepEditorProps) {
  const [title, setTitle] = useState(step?.title || '')
  const [content, setContent] = useState(step?.content || '')
  const [status, setStatus] = useState<StepStatus>(step?.status || 'draft')
  const [isSaving, setIsSaving] = useState(false)

  const handleSave = async () => {
    if (!title.trim()) return
    setIsSaving(true)
    try {
      onSave({
        id: step?.id || crypto.randomUUID(),
        trailId: step?.trailId || '',
        orderIndex: step?.orderIndex ?? orderIndex,
        title,
        content,
        status,
        mediaUrl: step?.mediaUrl,
        materials: step?.materials || [],
        createdAt: step?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isSynced: true,
      } as TimelineStep)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Card className="border-indigo-200 dark:border-indigo-800">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Название шага"
            className="text-lg font-semibold border-0 p-0 h-auto focus-visible:ring-0"
          />
          <Button variant="ghost" size="icon" onClick={onCancel}><X className="h-4 w-4" /></Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <Textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Опишите этот шаг..."
          className="min-h-[100px] font-mono text-sm"
        />
        <div className="flex items-center gap-2 pt-2 border-t">
          <span className="text-sm">Статус:</span>
          {(['draft', 'in_progress', 'completed'] as StepStatus[]).map((s) => (
            <Button
              key={s}
              type="button"
              variant={status === s ? 'default' : 'outline'}
              size="sm"
              onClick={() => setStatus(s)}
              className="capitalize text-xs"
            >
              {s === 'draft' ? 'Черновик' : s === 'in_progress' ? 'В работе' : 'Готово'}
            </Button>
          ))}
        </div>
      </CardContent>
      <CardFooter className="flex justify-end gap-2 border-t pt-4">
        <Button variant="outline" onClick={onCancel}>Отмена</Button>
        <Button onClick={handleSave} disabled={isSaving || !title.trim()}>
          {isSaving ? <><Loader2 className="mr-1 h-3 w-3 animate-spin" /> Сохранение...</> : <><Save className="mr-1 h-3 w-3" /> Сохранить</>}
        </Button>
      </CardFooter>
    </Card>
  )
}
