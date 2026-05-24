'use client'
import { useState, useEffect } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { LogIn, Mail, Lock, User, ArrowRight } from 'lucide-react'

export default function AuthPage() {
  const [isSignUp, setIsSignUp] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [supabase, setSupabase] = useState<any>(null)
  const router = useRouter()

  // Инициализируем клиент только на клиенте с проверкой переменных
  useEffect(() => {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    if (url && key) {
      setSupabase(createBrowserClient(url, key))
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!supabase) { setError('Конфигурация не загружена'); return }
    setLoading(true)
    setError(null)
    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({ email, password, options: { data: { name } } })
        if (error) throw error
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) throw error
      }
      router.push('/admin')
      router.refresh()
    } catch (err: any) {
      setError(err.message || 'Ошибка')
    } finally {
      setLoading(false)
    }
  }

  const handleSocial = async (provider: 'github' | 'google') => {
    if (!supabase) return
    await supabase.auth.signInWithOAuth({ provider, options: { redirectTo: window.location.origin + '/admin' } })
  }

  // Пока клиент не инициализирован — показываем заглушку
  if (!supabase) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="w-full max-w-md glass"><CardContent className="p-6 text-center text-muted-foreground">Загрузка...</CardContent></Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-accent/5 p-4">
      <Card className="w-full max-w-md glass">
        <CardHeader className="text-center pb-2">
          <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold mx-auto mb-3 shadow-lg">FT</div>
          <CardTitle className="text-xl">{isSignUp ? 'Создать аккаунт' : 'Войти'}</CardTitle>
          <CardDescription>{isSignUp ? 'Начните документировать путь' : 'Продолжить создание трейлов'}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <Button variant="outline" onClick={() => handleSocial('github')} disabled={loading}><LogIn className="h-4 w-4 mr-2" /> GitHub</Button>
            <Button variant="outline" onClick={() => handleSocial('google')} disabled={loading}><Mail className="h-4 w-4 mr-2" /> Google</Button>
          </div>
          <div className="relative"><div className="absolute inset-0 flex items-center"><span className="w-full border-t" /></div><div className="relative flex justify-center text-xs uppercase"><span className="bg-background px-2 text-muted-foreground">или email</span></div></div>
          <form onSubmit={handleSubmit} className="space-y-3">
            {isSignUp && <div className="relative"><User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /><Input type="text" placeholder="Имя" value={name} onChange={(e) => setName(e.target.value)} className="pl-10" /></div>}
            <div className="relative"><Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /><Input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="pl-10" required /></div>
            <div className="relative"><Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /><Input type="password" placeholder="Пароль" value={password} onChange={(e) => setPassword(e.target.value)} className="pl-10" required minLength={6} /></div>
            {error && <Badge variant="outline" className="w-full justify-center text-red-600 border-red-300">{error}</Badge>}
            <Button type="submit" className="w-full" disabled={loading}>{loading ? 'Загрузка...' : isSignUp ? 'Зарегистрироваться' : 'Войти'} {!loading && <ArrowRight className="h-4 w-4 ml-2" />}</Button>
          </form>
          <p className="text-center text-sm text-muted-foreground">{isSignUp ? 'Уже есть аккаунт? ' : 'Нет аккаунта? '}<button type="button" onClick={() => setIsSignUp(!isSignUp)} className="text-primary hover:underline font-medium">{isSignUp ? 'Войти' : 'Зарегистрироваться'}</button></p>
        </CardContent>
      </Card>
    </div>
  )
}
