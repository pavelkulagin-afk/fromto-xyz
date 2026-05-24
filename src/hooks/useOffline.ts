'use client'
import { useState, useEffect, useCallback } from 'react'

export function useOffline() {
  const [isOffline, setIsOffline] = useState(false)
  const [lastSync, setLastSync] = useState<string | null>(null)
  const [queueSize, setQueueSize] = useState(0)
  const [syncing, setSyncing] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return
    setIsOffline(!navigator.onLine)
    setLastSync(localStorage.getItem('fromto_last_sync'))
    setQueueSize(JSON.parse(localStorage.getItem('fromto_queue') || '[]').length)

    const handleOnline = async () => {
      setIsOffline(false)
      const time = new Date().toISOString()
      setLastSync(time)
      localStorage.setItem('fromto_last_sync', time)
      await syncQueue()
    }
    const handleOffline = () => { setIsOffline(true); updateQueueSize() }

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)
    
    const interval = setInterval(() => { if (navigator.onLine) { const q = JSON.parse(localStorage.getItem('fromto_queue') || '[]'); if (q.length > 0) syncQueue() } updateQueueSize() }, 30000)
    return () => { window.removeEventListener('online', handleOnline); window.removeEventListener('offline', handleOffline); clearInterval(interval) }
  }, [])

  const updateQueueSize = () => setQueueSize(JSON.parse(localStorage.getItem('fromto_queue') || '[]').length)

  const addToQueue = useCallback((type: string, payload: any) => {
    if (typeof window === 'undefined') return
    const queue = JSON.parse(localStorage.getItem('fromto_queue') || '[]')
    queue.push({ id: crypto.randomUUID(), type, payload, timestamp: Date.now(), retries: 0 })
    localStorage.setItem('fromto_queue', JSON.stringify(queue))
    updateQueueSize()
  }, [])

  const syncQueue = useCallback(async () => {
    if (typeof window === 'undefined' || !navigator.onLine) return
    setSyncing(true)
    const queue = JSON.parse(localStorage.getItem('fromto_queue') || '[]')
    if (queue.length === 0) { setSyncing(false); return }

    const successful: string[] = []
    for (const item of queue) {
      try {
        await fetch(`/api/sync/${item.type}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(item.payload) })
        successful.push(item.id)
      } catch (e) {
        console.warn('Sync failed:', e)
        item.retries += 1
        if (item.retries >= 3) successful.push(item.id) // удалить после 3 попыток
      }
    }
    const remaining = queue.filter((i: any) => !successful.includes(i.id))
    localStorage.setItem('fromto_queue', JSON.stringify(remaining))
    updateQueueSize()
    setSyncing(false)
    return { synced: successful.length, remaining: remaining.length }
  }, [])

  return { isOffline, lastSync, queueSize, syncing, addToQueue, syncQueue }
}
