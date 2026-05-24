'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Search, Plus, Bell, User, Settings, FolderPlus, DollarSign, Shield, LogOut, Menu, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { useState, useEffect } from 'react'

interface NavItem {
  href: string
  icon: React.ReactNode
  label: string
  adminOnly?: boolean
}

const mainNav: NavItem[] = [
  { href: '/', icon: <Home className="h-5 w-5" />, label: 'Главная' },
  { href: '/search', icon: <Search className="h-5 w-5" />, label: 'Поиск' },
  { href: '/create', icon: <Plus className="h-5 w-5" />, label: 'Создать' },
  { href: '/notifications', icon: <Bell className="h-5 w-5" />, label: 'Уведомления' },
  { href: '/profile', icon: <User className="h-5 w-5" />, label: 'Профиль' },
]

const adminNav: NavItem[] = [
  { href: '/admin', icon: <Settings className="h-5 w-5" />, label: 'Админ', adminOnly: true },
  { href: '/admin/trails', icon: <FolderPlus className="h-5 w-5" />, label: 'Проекты', adminOnly: true },
  { href: '/admin/treasury', icon: <DollarSign className="h-5 w-5" />, label: 'Казначейство', adminOnly: true },
  { href: '/admin/backups', icon: <Shield className="h-5 w-5" />, label: 'Бэкапы', adminOnly: true },
]

export function Sidebar({ userId, onSignOut }: { userId?: string | null; onSignOut?: () => void }) {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [isDesktop, setIsDesktop] = useState(false)
  
  // Проверяем ширину экрана только на клиенте
  useEffect(() => {
    const checkDesktop = () => setIsDesktop(window.innerWidth >= 1280)
    checkDesktop()
    window.addEventListener('resize', checkDesktop)
    return () => window.removeEventListener('resize', checkDesktop)
  }, [])
  
  const allNav = [...mainNav, ...(userId ? adminNav : [])]
  
  const NavContent = ({ mobile = false }: { mobile?: boolean }) => (
    <nav className={cn("flex flex-col gap-1", mobile ? "p-4" : "p-2")}>
      {/* Логотип */}
      <div className={cn("flex items-center gap-3 px-3 py-4", mobile ? "border-b pb-4" : "mb-2")}>
        <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm shadow">FT</div>
        {(mobile || isDesktop) && <span className="font-semibold text-lg">FromTo</span>}
      </div>
      
      {/* Основные пункты */}
      {mainNav.map((item) => {
        const isActive = pathname === item.href || (item.href !== '/' && pathname?.startsWith(item.href))
        return (
          <Link key={item.href} href={item.href}
            className={cn("icon-btn flex items-center gap-3 w-full text-left", isActive ? "icon-btn-active" : "text-muted-foreground hover:text-foreground", mobile ? "py-3 px-4" : "py-2.5")}
            onClick={() => setMobileOpen(false)}
          >
            {item.icon}
            {(mobile || isDesktop) && <span className="font-medium">{item.label}</span>}
          </Link>
        )
      })}
      
      {userId && <div className="my-2 border-t mx-2" />}
      
      {/* Админ-пункты */}
      {userId && adminNav.map((item) => {
        const isActive = pathname?.startsWith(item.href)
        return (
          <Link key={item.href} href={item.href}
            className={cn("icon-btn flex items-center gap-3 w-full text-left", isActive ? "icon-btn-active" : "text-muted-foreground hover:text-foreground", mobile ? "py-3 px-4" : "py-2.5")}
            onClick={() => setMobileOpen(false)}
          >
            {item.icon}
            {(mobile || isDesktop) && <span className="font-medium">{item.label}</span>}
          </Link>
        )
      })}
      
      {/* Выход */}
      {userId && (
        <>
          <div className="my-2 border-t mx-2" />
          <button onClick={() => { onSignOut?.(); setMobileOpen(false); }}
            className={cn("icon-btn flex items-center gap-3 w-full text-left text-muted-foreground hover:text-destructive", mobile ? "py-3 px-4" : "py-2.5")}
          >
            <LogOut className="h-5 w-5" />
            {(mobile || isDesktop) && <span className="font-medium">Выйти</span>}
          </button>
        </>
      )}
    </nav>
  )
  
  return (
    <>
      {/* Мобильная кнопка */}
      <button className="fixed top-4 left-4 z-50 p-2 rounded-full bg-background/80 backdrop-blur border lg:hidden icon-btn" onClick={() => setMobileOpen(true)} aria-label="Меню">
        <Menu className="h-5 w-5" />
      </button>
      
      {/* Мобильное меню */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMobileOpen(false)} />
          <div className="absolute left-0 top-0 h-full w-72 bg-background border-r shadow-xl">
            <div className="flex justify-end p-2"><button className="icon-btn" onClick={() => setMobileOpen(false)} aria-label="Закрыть"><X className="h-5 w-5" /></button></div>
            <NavContent mobile />
          </div>
        </div>
      )}
      
      {/* Десктопный сайдбар */}
      <aside className="hidden lg:flex flex-col w-20 xl:w-64 fixed left-0 top-0 h-screen border-r bg-background/80 backdrop-blur-xl z-40">
        <NavContent />
      </aside>
    </>
  )
}
