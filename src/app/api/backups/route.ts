import { NextResponse } from "next/server"

export async function GET() {
  // В продакшене: запрос к R2 API для списка бэкапов
  // Для демо: мок-данные
  const backups = [
    { id: "abc123", timestamp: "2026-05-14 02:00:00", size: "12.4 MB" },
    { id: "def456", timestamp: "2026-05-13 02:00:00", size: "11.8 MB" },
    { id: "ghi789", timestamp: "2026-05-12 02:00:00", size: "10.2 MB" },
  ]
  return NextResponse.json(backups)
}
