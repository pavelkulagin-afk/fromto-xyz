"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Step, StepFormData } from "@/types/trail"

const stepSchema = z.object({
  title: z.string().min(1, "Обязательное поле"),
  description: z.string().min(1, "Обязательное поле"),
  mediaUrl: z.string().url("Невалидный URL").optional().or(z.literal("")),
  materials: z.array(z.object({
    name: z.string().min(1),
    link: z.string().url().optional().or(z.literal("")),
  })).optional(),
  timeSpentMinutes: z.coerce.number().min(0).optional(),
})

interface StepEditorProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  step?: Step | null
  onSave: (data: StepFormData) => void
}

export function StepEditor({ open, onOpenChange, step, onSave }: StepEditorProps) {
  const [materialName, setMaterialName] = useState("")
  const [materialLink, setMaterialLink] = useState("")

  const form = useForm<StepFormData>({
    resolver: zodResolver(stepSchema),
    defaultValues: step || {
      title: "",
      description: "",
      mediaUrl: "",
      materials: [],
      timeSpentMinutes: 0,
    },
  })

  const addMaterial = () => {
    if (!materialName.trim()) return
    const current = form.getValues("materials") || []
    form.setValue("materials", [...current, { name: materialName, link: materialLink || undefined }])
    setMaterialName("")
    setMaterialLink("")
  }

  const removeMaterial = (index: number) => {
    const current = form.getValues("materials") || []
    form.setValue("materials", current.filter((_, i) => i !== index))
  }

  const onSubmit = (data: StepFormData) => {
    onSave(data)
    onOpenChange(false)
    form.reset()
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{step ? "Редактировать шаг" : "Новый шаг"}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField control={form.control} name="title" render={({ field }) => (
              <FormItem>
                <FormLabel>Название шага</FormLabel>
                <FormControl><Input placeholder="Например: Подготовка материалов" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            
            <FormField control={form.control} name="description" render={({ field }) => (
              <FormItem>
                <FormLabel>Описание</FormLabel>
                <FormControl><Textarea placeholder="Что вы делали на этом этапе?" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            
            <FormField control={form.control} name="mediaUrl" render={({ field }) => (
              <FormItem>
                <FormLabel>Ссылка на изображение (опционально)</FormLabel>
                <FormControl><Input placeholder="https://..." {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            
            <div className="space-y-2">
              <FormLabel>Материалы</FormLabel>
              <div className="flex gap-2">
                <Input placeholder="Название" value={materialName} onChange={(e) => setMaterialName(e.target.value)} />
                <Input placeholder="Ссылка (опционально)" value={materialLink} onChange={(e) => setMaterialLink(e.target.value)} />
                <Button type="button" onClick={addMaterial} variant="secondary">+</Button>
              </div>
              {form.getValues("materials")?.map((m, i) => (
                <div key={i} className="flex items-center justify-between text-sm bg-muted px-3 py-2 rounded">
                  <span>{m.name}{m.link && ` — ${m.link}`}</span>
                  <Button type="button" variant="ghost" size="sm" onClick={() => removeMaterial(i)}>×</Button>
                </div>
              ))}
            </div>
            
            <FormField control={form.control} name="timeSpentMinutes" render={({ field }) => (
              <FormItem>
                <FormLabel>Время (минуты)</FormLabel>
                <FormControl><Input type="number" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Отмена</Button>
              <Button type="submit">{step ? "Сохранить" : "Добавить шаг"}</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
