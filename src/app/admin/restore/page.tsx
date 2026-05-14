"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface Backup {
  id: string
  timestamp: string
  size: string
}

export default function RestorePage() {
  const [backups, setBackups] = useState<Backup[]>([])
  const [loading, setLoading] = useState(false)
  const [restoring, setRestoring] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const loadBackups = async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/backups")
      const data = await res.json()
      setBackups(data)
    } catch (e) {
      setError("Не удалось загрузить список бэкапов")
    }
    setLoading(false)
  }

  const restoreBackup = async (backupId: string) => {
    setRestoring(backupId)
    setError(null)
    setSuccess(null)
    try {
      const res = await fetch("/api/backups/restore", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ backupId }),
      })
      if (!res.ok) throw new Error("Ошибка восстановления")
      setSuccess("Бэкап успешно восстановлен!")
    } catch (e) {
      setError("Не удалось восстановить бэкап")
    }
    setRestoring(null)
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">🔙 Восстановление из бэкапа</h1>
        
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        {success && (
          <Alert className="mb-4 bg-green-50 text-green-800">
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        )}

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Доступные бэкапы</CardTitle>
          </CardHeader>
          <CardContent>
            <Button onClick={loadBackups} disabled={loading} className="mb-4">
              {loading ? "Загрузка..." : "Обновить список"}
            </Button>
            
            {backups.length === 0 ? (
              <p className="text-muted-foreground">Нет доступных бэкапов</p>
            ) : (
              <div className="space-y-3">
                {backups.map(backup => (
                  <div key={backup.id} className="flex items-center justify-between p-3 border rounded">
                    <div>
                      <p className="font-medium">{backup.timestamp}</p>
                      <p className="text-sm text-muted-foreground">{backup.size}</p>
                    </div>
                    <Button
                      onClick={() => restoreBackup(backup.id)}
                      disabled={restoring === backup.id}
                      variant="outline"
                    >
                      {restoring === backup.id ? "Восстановление..." : "Восстановить"}
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Ручное восстановление</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>ID бэкапа</Label>
              <Input placeholder="abc123..." id="backup-id" />
            </div>
            <Button onClick={() => {
              const id = (document.getElementById("backup-id") as HTMLInputElement).value
              if (id) restoreBackup(id)
            }}>
              Восстановить по ID
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
