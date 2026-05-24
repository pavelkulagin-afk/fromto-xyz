'use client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { DollarSign, TrendingUp, AlertCircle, Heart } from 'lucide-react'
export function TreasuryDashboard({ metrics }: { metrics?: any }) {
  const m = metrics || { totalDonations: 0, monthlyExpenses: 0, coveragePercent: 0, topDonors: [], recentExpenses: [] }
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="glass"><CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground flex items-center gap-2"><DollarSign className="h-4 w-4"/> Собрано</CardTitle></CardHeader><CardContent><div className="text-3xl font-bold">${m.totalDonations.toFixed(2)}</div><Badge variant="success" className="mt-2 gap-1"><TrendingUp className="h-3 w-3"/> +12%</Badge></CardContent></Card>
        <Card className="glass"><CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Расходы</CardTitle></CardHeader><CardContent><div className="text-3xl font-bold">${m.monthlyExpenses.toFixed(2)}</div><p className="text-xs text-muted-foreground mt-2">Хостинг, БД, CDN</p></CardContent></Card>
        <Card className="glass"><CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Покрытие</CardTitle></CardHeader><CardContent><div className="text-3xl font-bold">{m.coveragePercent}%</div><Badge variant={m.coveragePercent >= 100 ? 'success' : 'warning'} className="mt-2">{m.coveragePercent >= 100 ? 'Полное' : 'Нужно ещё'}</Badge></CardContent></Card>
      </div>
      <Card className="glass"><CardHeader><CardTitle>Прозрачные расходы</CardTitle></CardHeader><CardContent>{m.recentExpenses.length > 0 ? <div className="space-y-3">{m.recentExpenses.map((exp:any,i:number)=>(<div key={i} className="flex items-center justify-between p-3 rounded-lg bg-background/50"><span className="font-medium">{exp.category}</span><div className="text-right"><span className="font-bold">${exp.amount.toFixed(2)}</span><p className="text-xs text-muted-foreground">{exp.date}</p></div></div>))}</div> : <div className="text-center py-8 text-muted-foreground"><AlertCircle className="h-8 w-8 mx-auto mb-2 opacity-50"/><p>Расходы появятся после первого деплоя</p></div>}</CardContent></Card>
      <Card className="glass border-indigo-500/30"><CardHeader><CardTitle className="flex items-center gap-2"><Heart className="h-4 w-4"/> Поддержать проект</CardTitle></CardHeader><CardContent className="space-y-4"><p className="text-sm text-muted-foreground">Все донаты идут на покрытие инфраструктурных расходов.</p><div className="flex flex-wrap gap-2">{[1,5,10,25].map((amt)=>(<Button key={amt} variant="outline" className="min-w-[80px]" onClick={()=>alert(`Донат $${amt} (демо)`)}>${amt}</Button>))}<Button variant="gradient">Другая сумма</Button></div></CardContent></Card>
    </div>
  )
}
