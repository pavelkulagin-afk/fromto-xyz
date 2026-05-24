'use client'

import { useState } from 'react'
import { Sidebar } from '@/components/layout/Sidebar'
import { Header } from '@/components/layout/Header'
import { Timeline } from '@/components/timeline/Timeline'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Plus, Heart, Repeat, Eye } from 'lucide-react'
import { motion } from 'framer-motion'

// Демо-данные (заменить на запрос к Supabase)
const demoTrails = [
  {
    id: '1',
    title: 'Создал свой сайт за выходные',
    description: 'От идеи до деплоя: мои шаги, инструменты и ошибки',
    coverImage: 'https://picsum.photos/seed/trail1/400/300',
    steps: 8,
    likes: 42,
    remixes: 12,
    views: 156,
    author: { name: 'Анна К.', avatar: 'https://i.pravatar.cc/40?img=1' },
    tags: ['веб', 'no-code', 'дизайн'],
  },
  {
    id: '2',
    title: 'Вырастил микрозелень на подоконнике',
    description: 'Простой гайд для начинающих: семена, свет, полив',
    coverImage: 'https://picsum.photos/seed/trail2/400/300',
    steps: 5,
    likes: 89,
    remixes: 34,
    views: 421,
    author: { name: 'Михаил П.', avatar: 'https://i.pravatar.cc/40?img=2' },
    tags: ['еда', 'здоровье', 'эко'],
  },
  {
    id: '3',
    title: 'Научился играть 3 аккорда на гитаре',
    description: 'Мой путь от "не могу" до первой песни за 2 недели',
    coverImage: 'https://picsum.photos/seed/trail3/400/300',
    steps: 12,
    likes: 156,
    remixes: 67,
    views: 892,
    author: { name: 'Елена В.', avatar: 'https://i.pravatar.cc/40?img=3' },
    tags: ['музыка', 'хобби', 'навыки'],
  },
]

export default function HomePage() {
  const [userId] = useState<string | null>(null) // Заменить на реального пользователя
  
  return (
    <div className="min-h-screen bg-background">
      <Sidebar userId={userId} onSignOut={() => {}} />
      <Header onSearch={(q) => console.log('Search:', q)} />
      
      <main className="lg:ml-20 xl:ml-64 pt-4 pb-12 px-4">
        {/* Кнопка создания */}
        <div className="mb-6 flex justify-center lg:justify-start">
          <Button variant="gradient" size="lg" className="rounded-full px-6 shadow-lg shadow-indigo-500/25">
            <Plus className="h-5 w-5 mr-2" />
            Создать трейл
          </Button>
        </div>
        
        {/* Лента трейлов */}
        <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4">
          {demoTrails.map((trail, i) => (
            <motion.div
              key={trail.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className="glass overflow-hidden group cursor-pointer hover:shadow-xl transition-shadow">
                {/* Обложка */}
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img 
                    src={trail.coverImage} 
                    alt={trail.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  
                  {/* Быстрые действия */}
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="flex items-center gap-2">
                      <Button size="icon" variant="secondary" className="h-8 w-8 rounded-full bg-white/90 hover:bg-white">
                        <Heart className="h-4 w-4" />
                      </Button>
                      <Button size="icon" variant="secondary" className="h-8 w-8 rounded-full bg-white/90 hover:bg-white">
                        <Repeat className="h-4 w-4" />
                      </Button>
                    </div>
                    <Badge variant="secondary" className="bg-white/90 text-foreground">
                      <Eye className="h-3 w-3 mr-1" /> {trail.views}
                    </Badge>
                  </div>
                </div>
                
                {/* Контент */}
                <CardContent className="p-4 space-y-3">
                  <h3 className="font-semibold line-clamp-2">{trail.title}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">{trail.description}</p>
                  
                  {/* Теги */}
                  <div className="flex flex-wrap gap-1">
                    {trail.tags.map((tag) => (
                      <Badge key={tag} variant="outline" size="sm" className="text-xs">{tag}</Badge>
                    ))}
                  </div>
                  
                  {/* Автор и статистика */}
                  <div className="flex items-center justify-between pt-2 border-t">
                    <div className="flex items-center gap-2">
                      <img src={trail.author.avatar} alt={trail.author.name} className="h-6 w-6 rounded-full" />
                      <span className="text-xs font-medium">{trail.author.name}</span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><Heart className="h-3 w-3" /> {trail.likes}</span>
                      <span className="flex items-center gap-1"><Repeat className="h-3 w-3" /> {trail.remixes}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
        
        {/* Загрузка ещё */}
        <div className="flex justify-center mt-8">
          <Button variant="outline" className="rounded-full">Загрузить ещё</Button>
        </div>
      </main>
    </div>
  )
}
