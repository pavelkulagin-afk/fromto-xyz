'use client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { AlertCircle, Upload } from 'lucide-react'
export function BackupManager({ userId }: { userId: string }) {
  return (
    <div className="space-y-6">
      <Card className="glass"><CardHeader><CardTitle>Создать бэкап</CardTitle></CardHeader><CardContent><p className="text-sm text-muted-foreground mb-4">Автоматические бэкапы создаются перед каждым обновлением.</p><Button variant="gradient" onClick={()=>alert('Бэкап создан (демо)')}><Upload className="h-4 w-4 mr-2"/> Создать бэкап сейчас</Button></CardContent></Card>
      <Card className="glass"><CardHeader><CardTitle>История бэкапов</CardTitle></CardHeader><CardContent className="text-center py-8 text-muted-foreground"><AlertCircle className="h-8 w-8 mx-auto mb-2 opacity-50"/><p>Нет сохранённых бэкапов</p></CardContent></Card>
    </div>
  )
}
