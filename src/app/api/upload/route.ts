import { NextRequest, NextResponse } from 'next/server'
import { optimizeImage } from '@/lib/image-optimizer'

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get('image') as File
    if (!file || !file.type.startsWith('image/')) return NextResponse.json({ error: 'Invalid file' }, { status: 400 })
    
    const buffer = Buffer.from(await file.arrayBuffer())
    const optimized = await optimizeImage(buffer, { width: 1600, quality: 85, format: 'webp' })
    const thumbnail = await optimizeImage(buffer, { width: 400, quality: 70, format: 'webp' })
    
    // В реальном проекте: загрузка в Cloudflare R2 / Supabase Storage
    // Здесь возвращаем данные для демо
    return NextResponse.json({
      success: true,
      originalSize: buffer.length,
      optimizedSize: optimized.length,
      thumbnailSize: thumbnail.length,
      savings: Math.round((1 - optimized.length / buffer.length) * 100) + '%',
      // Для демо: возвращаем base64 (в продакшене — URL из хранилища)
      url: `data:image/webp;base64,${optimized.toString('base64')}`,
      thumbnail: `data:image/webp;base64,${thumbnail.toString('base64')}`,
    })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
  }
}
