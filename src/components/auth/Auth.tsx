'use client'

import { useEffect } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import { Auth as SupabaseAuth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { Card } from '@/components/ui/card'

export function Auth({ onAuthSuccess }: { onAuthSuccess?: () => void }) {
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && onAuthSuccess) {
        onAuthSuccess()
      }
    })
    return () => subscription.unsubscribe()
  }, [onAuthSuccess])

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

  return (
    <SupabaseAuth
      supabaseClient={supabase}
      appearance={{ 
        theme: ThemeSupa, 
        variables: { 
          default: { 
            colors: { 
              brand: '#6366F1', 
              brandAccent: '#4F46E5',
              inputText: 'hsl(var(--foreground))',
              inputBackground: 'hsl(var(--background))',
            } 
          } 
        },
        className: {
          container: 'space-y-4',
          button: 'bg-primary text-primary-foreground hover:bg-primary/90',
          input: 'bg-background border-border',
          label: 'text-foreground',
        }
      }}
      providers={['github', 'google']}
      redirectTo={`${siteUrl}/admin`}
      view="sign_in"
      showLinks={true}
      socialLayout="horizontal"
    />
  )
}
