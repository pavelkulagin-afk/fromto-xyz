'use client'
import { motion, AnimatePresence } from 'framer-motion'
import { Cloud, CloudOff, CheckCircle, Loader2 } from 'lucide-react'
import { Badge } from './badge'

interface Props { isOffline: boolean; lastSync: string | null; queueSize: number; syncing: boolean }

export function SyncIndicator({ isOffline, lastSync, queueSize, syncing }: Props) {
  return (
    <AnimatePresence>
      {(isOffline || queueSize > 0 || syncing) && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="fixed top-4 right-4 z-50">
          <Badge variant={isOffline ? 'warning' : syncing ? 'default' : 'success'} className="gap-2 shadow-lg">
            {syncing ? <Loader2 className="h-3 w-3 animate-spin" /> : isOffline ? <CloudOff className="h-3 w-3" /> : <CheckCircle className="h-3 w-3" />}
            <span className="text-xs">
              {isOffline ? 'Офлайн' : syncing ? 'Синхронизация...' : queueSize > 0 ? `${queueSize} в очереди` : 'Синхронизировано'}
              {lastSync && !isOffline && !syncing && <span className="text-muted-foreground ml-1">• {new Date(lastSync).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>}
            </span>
          </Badge>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
