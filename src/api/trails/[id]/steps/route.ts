import { NextRequest, NextResponse } from 'next/server'
import { optimizeImage, generateBackupSnapshot } from '@/lib/utils'

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  // TODO: Заменить на реальный запрос к БД
  return NextResponse.json([])
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { steps } = await req.json()
    
    // 1. Оптимизация изображений
    const optimized = steps.map((s: any) => ({
      ...s,
      mediaUrl: s.mediaUrl ? optimizeImage(s.mediaUrl) : undefined,
    }))
    
    // 2. Создание бэкапа перед сохранением
    const backup = generateBackupSnapshot({ trailId: params.id, steps: optimized })
    // TODO: Сохранить бэкап в R2 / Supabase Storage
    
    // 3. Очистка лишних данных
    const cleaned = optimized.map(({ isSynced, ...rest }: any) => rest)
    
    // TODO: Сохранить в БД
    
    return NextResponse.json({ success: true, backupId: backup.checksum })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update' }, { status: 500 })
  }
}
