'use client'
'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard, FolderPlus, Settings, Download, Upload, Trash2,
  Eye, Edit, Clock, Cloud, AlertCircle, Users, DollarSign, BarChart3, Shield, Repeat } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'

import { Trail, TreasuryMetrics } from '@/types'
import { Timeline } from '@/components/timeline/Timeline'
import { TreasuryDashboard } from './TreasuryDashboard'
import { BackupManager } from './BackupManager'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export function AdminPanel({ userId }: { userId: string }) {
  const [activeTab, setActiveTab] = useState<'trails' | 'treasury' | 'backups' | 'settings'>('trails')
  const [selectedTrail, setSelectedTrail] = useState<Trail | null>(null)

  const { data: trails } = useQuery({
    queryKey: ['user', userId, 'trails'],
    queryFn: async () => {
      const res = await fetch(`/api/users/${userId}/trails`)
      if (!res.ok) throw new Error('Failed to fetch')
      return res.json() as Promise<Trail[]>
    },
  })

  const { data: treasury } = useQuery<TreasuryMetrics>({
    queryKey: ['treasury'],
    queryFn: async () => {
      const res = await fetch('/api/treasury')
      if (!res.ok) throw new Error('Failed to fetch')
      return res.json()
    },
    staleTime: 60 * 1000,
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold shadow-lg">
              FT
            </div>
            <div>
              <h1 className="text-lg font-bold">FromTo Admin</h1>
              <p className="text-xs text-muted-foreground">Панель управления</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" icon={<Users className="h-3 w-3" />}>
              {trails?.length || 0} проектов
            </Badge>
            <Button variant="gradient" size="sm">
              <FolderPlus className="h-4 w-4 mr-1" />
              Новый трейл
            </Button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:inline-grid">
            <TabsTrigger value="trails" className="gap-2"><LayoutDashboard className="h-4 w-4" /> Проекты</TabsTrigger>
            <TabsTrigger value="treasury" className="gap-2"><DollarSign className="h-4 w-4" /> Казначейство</TabsTrigger>
            <TabsTrigger value="backups" className="gap-2"><Shield className="h-4 w-4" /> Бэкапы</TabsTrigger>
            <TabsTrigger value="settings" className="gap-2"><Settings className="h-4 w-4" /> Настройки</TabsTrigger>
          </TabsList>

          <AnimatePresence mode="wait">
            {/* Trails tab */}
            <TabsContent value="trails" className="space-y-6">
              {selectedTrail ? (
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                  <Button variant="ghost" onClick={() => setSelectedTrail(null)} className="mb-4">← Назад</Button>
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-xl">{selectedTrail.title}</CardTitle>
                      <CardDescription>{selectedTrail.description}</CardDescription>
                      <div className="flex flex-wrap gap-2 mt-2">
                        <Badge variant={selectedTrail.status === 'published' ? 'success' : 'secondary'}>
                          {selectedTrail.status === 'published' ? 'Опубликован' : 'Черновик'}
                        </Badge>
                        <Badge variant="outline">{selectedTrail.license}</Badge>
                        <Badge variant="ghost" icon={<Eye className="h-3 w-3" />}>{selectedTrail.views} просмотров</Badge>
                        <Badge variant="ghost" icon={<Repeat className="h-3 w-3" />}>{selectedTrail.remixes} ремиксов</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <Timeline steps={selectedTrail.steps || []} editable={true} />
                    </CardContent>
                  </Card>
                </motion.div>
              ) : (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {trails?.map((trail) => (
                    <Card key={trail.id} className="cursor-pointer hover:border-indigo-300/50 transition-colors" onClick={() => setSelectedTrail(trail)}>
                      <CardHeader className="pb-2">
                        <div className="flex items-start justify-between">
                          <CardTitle className="line-clamp-1">{trail.title}</CardTitle>
                          <Badge variant={trail.status === 'published' ? 'success' : 'secondary'} className="text-xs">
                            {trail.status === 'published' ? '✓' : '✎'}
                          </Badge>
                        </div>
                        <CardDescription className="line-clamp-2 text-sm">{trail.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {new Date(trail.updatedAt).toLocaleDateString()}</span>
                          <span className="flex items-center gap-1">{trail.lastBackupAt ? <Cloud className="h-3 w-3 text-emerald-500" /> : <AlertCircle className="h-3 w-3 text-amber-500" />} {trail.lastBackupAt ? 'Бэкап' : 'Нет'}</span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  {(!trails || trails.length === 0) && (
                    <Card className="col-span-full border-dashed bg-muted/30">
                      <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                        <FolderPlus className="h-12 w-12 text-muted-foreground mb-4" />
                        <h3 className="font-medium mb-1">Нет проектов</h3>
                        <p className="text-sm text-muted-foreground mb-4 max-w-sm">Создайте первый трейл, чтобы начать документировать свой путь от идеи до результата</p>
                        <Button variant="gradient">
                          <FolderPlus className="mr-2 h-4 w-4" />
                          Создать трейл
                        </Button>
                      </CardContent>
                    </Card>
                  )}
                </motion.div>
              )}
            </TabsContent>

            {/* Treasury tab */}
            <TabsContent value="treasury">
              <TreasuryDashboard metrics={treasury} />
            </TabsContent>

            {/* Backups tab */}
            <TabsContent value="backups">
              <BackupManager userId={userId} />
            </TabsContent>

            {/* Settings tab */}
            <TabsContent value="settings">
              <Card>
                <CardHeader>
                  <CardTitle>Настройки аккаунта</CardTitle>
                  <CardDescription>Управление данными, приватностью и экспортом</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-xl bg-background/50">
                    <div>
                      <p className="font-medium">Экспорт всех данных</p>
                      <p className="text-sm text-muted-foreground">Скачать трейлы, шаги и медиа в формате JSON</p>
                    </div>
                    <Button variant="outline" size="sm" icon={<Download className="h-4 w-4" />}>Экспорт</Button>
                  </div>
                  <div className="flex items-center justify-between p-4 border rounded-xl bg-background/50">
                    <div>
                      <p className="font-medium">Удалить аккаунт</p>
                      <p className="text-sm text-muted-foreground">Безвозвратно удалить все данные</p>
                    </div>
                    <Button variant="destructive" size="sm" icon={<Trash2 className="h-4 w-4" />}>Удалить</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </AnimatePresence>
        </Tabs>
      </main>
    </div>
  )
}
