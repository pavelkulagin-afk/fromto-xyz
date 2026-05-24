import sharp from 'sharp'

export async function optimizeImage(buffer: Buffer, options?: { width?: number; quality?: number; format?: 'webp' | 'jpeg' | 'png' }) {
  const { width = 1200, quality = 85, format = 'webp' } = options || {}
  let pipeline = sharp(buffer).resize({ width, fit: 'inside', withoutEnlargement: true })
  
  if (format === 'webp') pipeline = pipeline.webp({ quality, effort: 6 })
  else if (format === 'jpeg') pipeline = pipeline.jpeg({ quality, progressive: true })
  else pipeline = pipeline.png({ quality, compressionLevel: 9 })
  
  return await pipeline.toBuffer()
}

export function getImageDimensions(buffer: Buffer) {
  return sharp(buffer).metadata()
}
