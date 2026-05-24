'use client'

import { useState, useEffect } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import { Auth } from '@/components/auth/Auth'
import { AdminPanel } from '@/components/admin/AdminPanel'
import { Card, CardContent } from '@/components/ui/card'
import { Loader2 } from 'lucide-react'

export default function AdminPage() {
  const [userId, setUserId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession()
      setUserId(data?.session?.user?.id || null)
      setLoading(false)
    }
    checkSession()
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUserId(session?.user?.id || null)
    })
    
    return () => subscription.unsubscribe()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!userId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-accent/5 p-4">
        <Card className="w-full max-w-md glass">
          <CardContent className="pt-6">
            <div className="text-center mb-6">
              <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold mx-auto mb-3 shadow-lg">
                FT
              </div>
              <h1 className="text-xl font-bold">FromTo Admin</h1>
              <p className="text-sm text-muted-foreground">Войдите для управления проектами</p>
            </div>
            <Auth onAuthSuccess={() => {}} />
          </CardContent>
        </Card>
      </div>
    )
  }

  return <AdminPanel userId={userId} />
}
