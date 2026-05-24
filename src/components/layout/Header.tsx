'use client'

import { useState } from 'react'
import { Search as SearchIcon, MessageCircle, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export function Header({ onSearch }: { onSearch?: (query: string) => void }) {
  const [query, setQuery] = useState('')
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSearch?.(query)
  }
  
  return (
    <header className="sticky top-0 z-30 border-b bg-background/80 backdrop-blur-xl">
      <div className="flex items-center justify-between px-4 py-3 lg:pl-24 xl:pl-28">
        {/* Поиск */}
        <form onSubmit={handleSubmit} className="flex-1 max-w-xl">
          <div className="relative">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Найти трейл, идею, материал..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-10 pr-4 h-11 rounded-full bg-muted/50 border-0 focus-visible:ring-2 focus-visible:ring-primary/50"
            />
          </div>
        </form>
        
        {/* Правая часть */}
        <div className="flex items-center gap-1 ml-4">
          <Button variant="ghost" size="icon" className="icon-btn" aria-label="Сообщения">
            <MessageCircle className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="icon-btn" aria-label="Язык">
            <span className="text-sm font-medium">RU</span>
          </Button>
          <Button variant="ghost" size="icon" className="icon-btn" aria-label="Профиль">
            <ChevronDown className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </header>
  )
}
